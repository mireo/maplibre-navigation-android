package com.mapbox.services.android.navigation.testapp

import com.mapbox.mapboxsdk.location.engine.LocationEngine
import com.mapbox.services.android.navigation.v5.snap.SnapToRoute
import com.mapbox.services.android.navigation.v5.routeprogress.RouteProgress
import com.mapbox.mapboxsdk.location.engine.LocationEngineCallback
import com.mapbox.mapboxsdk.location.engine.LocationEngineResult
import com.mapbox.mapboxsdk.location.engine.LocationEngineRequest
import android.os.Looper
import android.app.PendingIntent
import android.location.Location
import java.lang.Exception

class SnapToRouteLocationEngine(val baseEngine: LocationEngine) : LocationEngine {
    val snapper: SnapToRoute
    var routeProgress: RouteProgress? = null
    fun snappedLocation(location: Location?): Location? {
        var location = location
        if (routeProgress != null) location = snapper.getSnappedLocation(location, routeProgress)
        return location
    }

    private fun wrap(callback: LocationEngineCallback<LocationEngineResult>): LocationEngineCallback<LocationEngineResult> {
        return object : LocationEngineCallback<LocationEngineResult> {
            override fun onSuccess(result: LocationEngineResult) {
                var result = result
                if (routeProgress != null) {
                    val location = snappedLocation(result.lastLocation)
                    result = LocationEngineResult.create(location)
                }
                callback.onSuccess(result)
            }

            override fun onFailure(exception: Exception) {
                callback.onFailure(exception)
            }
        }
    }

    @Throws(SecurityException::class)
    override fun getLastLocation(callback: LocationEngineCallback<LocationEngineResult>) {
        baseEngine.getLastLocation(wrap(callback))
    }

    @Throws(SecurityException::class)
    override fun requestLocationUpdates(request: LocationEngineRequest, callback: LocationEngineCallback<LocationEngineResult>, looper: Looper?) {
        baseEngine.requestLocationUpdates(request, wrap(callback), looper)
    }

    @Throws(SecurityException::class)
    override fun requestLocationUpdates(request: LocationEngineRequest, pendingIntent: PendingIntent) {
        baseEngine.requestLocationUpdates(request, pendingIntent)
    }

    override fun removeLocationUpdates(callback: LocationEngineCallback<LocationEngineResult>) {
        baseEngine.removeLocationUpdates(callback)
    }

    override fun removeLocationUpdates(pendingIntent: PendingIntent) {
        baseEngine.removeLocationUpdates(pendingIntent)
    }

    fun routeProgressChanged(routeProgress: RouteProgress?) {
        this.routeProgress = routeProgress
    }

    init {
        snapper = SnapToRoute()
    }
}
