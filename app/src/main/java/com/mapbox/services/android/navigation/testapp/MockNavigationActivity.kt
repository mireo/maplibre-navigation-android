package com.mapbox.services.android.navigation.testapp

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.AssetManager
import android.location.Location
import android.os.Build
import android.os.Bundle
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.android.material.snackbar.Snackbar
import com.mapbox.api.directions.v5.models.DirectionsResponse
import com.mapbox.geojson.Point
import com.mapbox.mapboxsdk.annotations.MarkerOptions
import com.mapbox.mapboxsdk.camera.CameraPosition
import com.mapbox.mapboxsdk.geometry.LatLng
import com.mapbox.mapboxsdk.location.LocationComponentActivationOptions
import com.mapbox.mapboxsdk.location.engine.LocationEngineCallback
import com.mapbox.mapboxsdk.location.engine.LocationEngineRequest
import com.mapbox.mapboxsdk.location.engine.LocationEngineResult
import com.mapbox.mapboxsdk.location.modes.CameraMode
import com.mapbox.mapboxsdk.location.modes.RenderMode
import com.mapbox.mapboxsdk.maps.MapboxMap
import com.mapbox.mapboxsdk.maps.OnMapReadyCallback
import com.mapbox.mapboxsdk.maps.Style
import com.mapbox.mapboxsdk.net.ConnectivityReceiver
import com.mapbox.mapboxsdk.offline.OfflineManager
import com.mapbox.mapboxsdk.offline.OfflineManager.FileSourceCallback
import com.mapbox.services.android.navigation.testapp.databinding.ActivityMockNavigationBinding
import com.mapbox.services.android.navigation.ui.v5.route.MapboxRouteFetcher
import com.mapbox.services.android.navigation.ui.v5.route.NavigationRoute
import com.mapbox.services.android.navigation.v5.location.engine.LocationEngineProvider
import com.mapbox.services.android.navigation.v5.milestone.*
import com.mapbox.services.android.navigation.v5.models.DirectionsRoute
import com.mapbox.services.android.navigation.v5.models.RouteOptions
import com.mapbox.services.android.navigation.v5.navigation.*
import com.mapbox.services.android.navigation.v5.offroute.OffRouteListener
import com.mapbox.services.android.navigation.v5.route.RouteFetcher
import com.mapbox.services.android.navigation.v5.route.RouteListener
import com.mapbox.services.android.navigation.v5.routeprogress.ProgressChangeListener
import com.mapbox.services.android.navigation.v5.routeprogress.RouteProgress
import com.mapbox.turf.TurfConstants
import com.mapbox.turf.TurfMeasurement
import hr.mireo.compactmaps.NativeServer
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import timber.log.Timber
import java.lang.ref.WeakReference

class MockNavigationActivity :
    AppCompatActivity(),
    OnMapReadyCallback,
    MapboxMap.OnMapClickListener,
    ProgressChangeListener,
    NavigationEventListener,
    MilestoneEventListener,
    OffRouteListener {
    private val BEGIN_ROUTE_MILESTONE = 1001
    private lateinit var mapboxMap: MapboxMap
    private lateinit var customNotification: CustomNavigationNotification

    // Navigation related variables
    private lateinit var locationEngine: SnapToRouteLocationEngine
    private lateinit var navigation: MapboxNavigation
    private lateinit var navigationMapRoute: NavigationMapRoute
    private lateinit var routeFetcher: RouteFetcher
    private lateinit var accessToken: String
    private lateinit var textToSpeech: TextToSpeech

    private var route: DirectionsRoute? = null
    private var lastRouteProgress: RouteProgress? = null
    private var ttsStatus = 0
    private val waypoints: MutableList<Point> = mutableListOf()
    private var maneuverView: ManeuverView? = null
    private var lastLocation: Location? = null

    private lateinit var binding: ActivityMockNavigationBinding

    private var languageId = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMockNavigationBinding.inflate(layoutInflater)
        setContentView(binding.root)

        if (intent != null) {
            val localFolder = intent.getStringExtra("localFolder")
            if (localFolder != null) {
                languageId = intent.getStringExtra("languageId") ?: "";
                startLocalServer(assets, "/__A/")
                switchToLocal()
            }
        }

        binding.mapView.apply {
            onCreate(savedInstanceState)
            getMapAsync(this@MockNavigationActivity)
        }

        customNotification = CustomNavigationNotification(applicationContext)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            customNotification.createNotificationChannel(this)
        }
        val options = MapboxNavigationOptions.builder()
            .navigationNotification(customNotification)
            .build()

        accessToken = "pk.0"
        navigation = MapboxNavigation(this, options)

        locationEngine  = SnapToRouteLocationEngine(LocationEngineProvider.getBestLocationEngine(this))
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return
        }
        locationEngine.requestLocationUpdates(
            LocationEngineRequest.Builder(1000).build(),
                object : LocationEngineCallback<LocationEngineResult> {
                    override fun onSuccess(result: LocationEngineResult) {
                        lastLocation = result.lastLocation
                    }
                    override fun onFailure(exception: Exception) {}
                }, Looper.myLooper()
        )
        binding.startRouteButton.setOnClickListener {
            route?.let { route ->
                binding.startRouteButton.visibility = View.INVISIBLE
                startNavigation(route)
            }
        }

        binding.newLocationFab.setOnClickListener {
            startTracking()
        }

        binding.clearPoints.setOnClickListener {
            onClearButtonClicked()
        }

        textToSpeech = TextToSpeech(this) { status: Int -> ttsStatus = status }

    }

    private fun onClearButtonClicked() {
        if (route != null)
            stopNavigation()
        if (waypoints.size > 0)
            clearDestinations()
        binding.startRouteButton.visibility = View.INVISIBLE
        binding.clearPoints.hide()
    }

    private fun clearDestinations() {
        if (::mapboxMap.isInitialized) {
            mapboxMap.markers.forEach {
                mapboxMap.removeMarker(it)
            }
        }
        waypoints.clear()
    }

    private fun stopNavigation() {
        clearDestinations()
        if (maneuverView != null)
            maneuverView?.hide()
        routeFetcher.clearListeners()
        navigation.stopNavigation()
        navigationMapRoute.removeRoute()
        locationEngine.routeProgressChanged(null)
        lastRouteProgress = null
        route = null
    }

    override fun onMapReady(mapboxMap: MapboxMap) {
        this.mapboxMap = mapboxMap
        mapboxMap.setStyle(Style.Builder().fromUri(STYLE_URL)) { style ->
            enableLocationComponent(style)
        }
        val options = MapboxNavigationOptions.builder()
                .enableOffRouteDetection(true)
                .defaultMilestonesEnabled(true)
                .snapToRoute(true)
                .navigationNotification(customNotification)
                .build()

        navigation = MapboxNavigation(this, options)
        navigation.addProgressChangeListener { location: Location?, routeProgress: RouteProgress ->
            lastRouteProgress = routeProgress
            locationEngine.routeProgressChanged(lastRouteProgress)
            navigationMapRoute.addUpcomingManeuverArrow(routeProgress)
            if (maneuverView != null) {
                maneuverView?.updateView(routeProgress)
            }
        }
        navigation.addMilestoneEventListener { routeProgress: RouteProgress, _: String?, milestone: Milestone? ->
            if (maneuverView != null) {
                maneuverView?.updateView(routeProgress)
            }
            if (ttsStatus == TextToSpeech.SUCCESS && milestone is VoiceInstructionMilestone) {
                textToSpeech.speak(milestone.announcement, TextToSpeech.QUEUE_ADD, null )
            }
        }
        navigation.addOffRouteListener { location: Location? ->
            routeFetcher.findRouteFromRouteProgress(location, lastRouteProgress)
            locationEngine.routeProgressChanged(null)
        }

        routeFetcher = MapboxRouteFetcher(this)
        maneuverView = ManeuverView(this, generateRouteOptions(), options)
        navigationMapRoute = NavigationMapRoute(navigation, binding.mapView, mapboxMap)
        navigationMapRoute.addProgressChangeListener(navigation)

        mapboxMap.addOnMapClickListener(this)
        Snackbar.make(
            findViewById(R.id.container),
            "Tap map to place waypoint",
            Snackbar.LENGTH_LONG,
        ).show()

    }

    private fun generateRouteOptions(): RouteOptions {
        var coordinates = mutableListOf<Point>()
        if (lastLocation != null) {
            val origin = Point.fromLngLat(lastLocation!!.longitude, lastLocation!!.latitude)
            coordinates.add(origin)
        }
        coordinates.addAll(waypoints)
        return RouteOptions.builder()
                .profile("driving-traffic")
                .coordinates(coordinates)
                .continueStraight(true)
                .annotations("congestion,distance")
                .bearings(";")
                .alternatives(true)
                .language("en")
                .user("mapbox")
                .voiceInstructions(true)
                .bannerInstructions(true)
                .roundaboutExits(true)
                .geometries("polyline6")
                .overview("full")
                .steps(true)
                .voiceUnits("metric")
                .accessToken(accessToken)
                .requestUuid("uuid")
                .baseUrl(BASE_URL)
                .build()
    }

    @SuppressWarnings("MissingPermission")
    private fun enableLocationComponent(style: Style) {
        // Get an instance of the component
        val locationComponent = mapboxMap.locationComponent
        locationComponent.let {
            // Activate with a built LocationComponentActivationOptions object
            it.activateLocationComponent(
                LocationComponentActivationOptions.builder(this, style).build(),
            )

            // Enable to make component visible
            it.isLocationComponentEnabled = true

            // Set the component's camera mode
            it.cameraMode = CameraMode.TRACKING

            // Set the component's render mode
            it.renderMode = RenderMode.GPS

            it.locationEngine = locationEngine
        }
    }

    override fun onMapClick(point: LatLng): Boolean {
        if (route != null)
            return false
        waypoints.add(Point.fromLngLat(point.longitude, point.latitude))
        mapboxMap.addMarker(MarkerOptions().position(point))
        binding.clearPoints.show()
        calculateRoute()
        return true
    }

    private fun calculateRoute() {
        if (lastLocation == null) {
            Timber.e("calculateRoute: User location is null, therefore, origin can't be set.")
            return
        }
        val userLocation = lastLocation!!
        if (waypoints.size == 0) {
            Timber.e("calculateRoute: no waypoints")
            return
        }

        val destination = waypoints[waypoints.size - 1]
        val origin = Point.fromLngLat(userLocation.longitude, userLocation.latitude)
        if (TurfMeasurement.distance(origin, destination, TurfConstants.UNIT_METERS) < 50) {
            binding.startRouteButton.visibility = View.INVISIBLE
            return
        }

        val navigationRouteBuilder = NavigationRoute.builder(this).apply {
            this.accessToken(accessToken)
            this.origin(origin)
            this.destination(destination)
            this.routeOptions(generateRouteOptions())
        }

        if (waypoints.size > 1)
            for(idx in 0 until waypoints.size - 1) { navigationRouteBuilder.addWaypoint(waypoints[idx]) }

        navigationRouteBuilder.build().getRoute(object : Callback<DirectionsResponse> {
            override fun onResponse(call: Call<DirectionsResponse>, response: Response<DirectionsResponse>) {
                response.body()?.let { response ->
                    if (response.routes().isNotEmpty()) {
                        val maplibreResponse = com.mapbox.services.android.navigation.v5.models.DirectionsResponse.fromJson(response.toJson());
                        val directionsRoute = DirectionsRoute.fromJson(maplibreResponse.routes().first().toJson())
                        this@MockNavigationActivity.route = directionsRoute
                        navigationMapRoute.addRoutes(maplibreResponse.routes())
                        binding.startRouteButton.visibility = View.VISIBLE
                    }
                }
            }

            override fun onFailure(call: Call<DirectionsResponse>, throwable: Throwable) {
                Timber.e(throwable, "onFailure: navigation.getRoute()")
                Toast.makeText(this@MockNavigationActivity, "Cannot calculate route: ${throwable.message}", Toast.LENGTH_SHORT).show()

            }
        })
    }

    private fun startNavigation(
        result: DirectionsRoute,
    ) {
        route = result
        customNotification.register(MyBroadcastReceiver(navigation), applicationContext)
        navigation.startNavigation(result)
        maneuverView?.show(this, findViewById(R.id.bannerText))
        routeFetcher.addRouteListener(object : RouteListener {
            override fun onResponseReceived(response: com.mapbox.services.android.navigation.v5.models.DirectionsResponse, routeProgress: RouteProgress?) {
                Timber.d("onResponseReceived")
                navigationMapRoute.removeRoute()
                if (response.routes().isEmpty()) {
                    Toast.makeText(this@MockNavigationActivity, "Cannot recalculate route", Toast.LENGTH_SHORT).show()
                } else {
                    route = response.routes()[0]
                    navigationMapRoute.addRoutes(response.routes())
                    navigationMapRoute.addUpcomingManeuverArrow(routeProgress)
                    navigation.startNavigation(route!!)
                }
            }

            override fun onErrorReceived(throwable: Throwable) {
                clearDestinations()
                Toast.makeText(this@MockNavigationActivity, "Cannot recalculate route", Toast.LENGTH_SHORT).show()
            }
        })
        startTracking()
    }

    private fun startTracking() {
        val locationComponent = mapboxMap.locationComponent
        val lastKnown = locationComponent.lastKnownLocation ?: return
        mapboxMap.cameraPosition = CameraPosition.Builder()
                .target(LatLng(lastKnown.latitude, lastKnown.longitude)) //                .bearing(cameraPosition.bearing)
                .tilt(60.0)
                .zoom(17.0)
                .build()
        locationComponent.cameraMode = CameraMode.TRACKING_GPS
        locationComponent.renderMode = RenderMode.GPS
    }

    override fun onResume() {
        super.onResume()
        binding.mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        binding.mapView.onPause()
    }

    override fun onStart() {
        super.onStart()
        binding.mapView.onStart()
    }

    override fun onStop() {
        super.onStop()
        binding.mapView.onStop()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        binding.mapView.onLowMemory()
    }

    override fun onDestroy() {
        super.onDestroy()
        navigation.onDestroy()
        binding.mapView.onDestroy()
        killLocalServer()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.mapView.onSaveInstanceState(outState)
    }


    private class MyBroadcastReceiver(navigation: MapboxNavigation) : BroadcastReceiver() {
        private val weakNavigation: WeakReference<MapboxNavigation> = WeakReference(navigation)

        override fun onReceive(context: Context, intent: Intent) {
            weakNavigation.get()?.stopNavigation()
        }
    }

    companion object{
        private const val REMOTE_STYLE_URL = "https://maps.mireo.com/style/mireo-style.json"
        private const val REMOTE_BASE_URL = "https://maps.mireo.com/"
        private const val LOCAL_STYLE_URL = "http://localhost:4242/style/mireo-style.json"
        private const val LOCAL_BASE_URL = "http://localhost:4242/"
        private const val MAP_UPDATE_URL = "https://maps.mireo.hr/cm-listings/maps/##YOUR_CLIENT_ID##"
        var STYLE_URL: String = REMOTE_STYLE_URL
        var BASE_URL: String = REMOTE_BASE_URL

    }

    private fun switchToRemote() {
        BASE_URL = REMOTE_BASE_URL
        STYLE_URL = REMOTE_STYLE_URL
        clearCache()
        ConnectivityReceiver.instance(applicationContext).setConnected(null)
    }

    private fun clearCache() {
        val fileSource = OfflineManager.getInstance(this)
        fileSource.clearAmbientCache(object : FileSourceCallback {
            override fun onSuccess() {
                Timber.d("Cache cleared")
            }

            override fun onError(message: String) {}
        })
    }

    private fun switchToLocal() {
        BASE_URL = LOCAL_BASE_URL
        STYLE_URL = LOCAL_STYLE_URL
        clearCache()
        ConnectivityReceiver.instance(applicationContext).setConnected(true)
    }


    var localServer = 0L

    private fun startLocalServer(assets: AssetManager, workDir: String) {
        if (localServer != 0L)
            killLocalServer()
        val writableDir = getExternalFilesDir(null).toString()
        val config =
            NativeServer.Configuration(
                "127.0.0.1:4242",
                languageId,
                writableDir + "/beast-maps.acp",
                "/__A/",
                writableDir + "/data/maps",
                writableDir,
                null,
                null
            )
        localServer = NativeServer.create(assets, config)
        NativeServer.start(localServer, true)
    }
    private fun killLocalServer() {
        if (localServer != 0L) {
            NativeServer.stop(localServer)
            NativeServer.destroy(localServer)
            localServer = 0
        }
        if (BASE_URL.equals(LOCAL_BASE_URL)) clearCache()
    }

    override fun onProgressChange(location: Location?, routeProgress: RouteProgress?) {
    }

    override fun onRunning(running: Boolean) {
    }

    override fun onMilestoneEvent(
        routeProgress: RouteProgress?,
        instruction: String?,
        milestone: Milestone?
    ) {
    }

    override fun userOffRoute(location: Location?) {
    }
}
