package com.mapbox.services.android.navigation.testapp

import android.app.Activity
import android.content.Context
import com.mapbox.api.directions.v5.models.RouteOptions
import com.mapbox.services.android.navigation.v5.navigation.MapboxNavigationOptions
import android.text.SpannableString
import android.text.format.DateFormat
import android.view.View
import com.mapbox.services.android.navigation.v5.utils.DistanceFormatter
import android.widget.TextView
import com.mapbox.services.android.navigation.v5.routeprogress.RouteProgress
import com.mapbox.api.directions.v5.models.LegStep
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.RelativeLayout
import com.mapbox.services.android.navigation.R
import com.mapbox.services.android.navigation.v5.utils.LocaleUtils
import com.mapbox.services.android.navigation.v5.utils.time.TimeFormatter
import com.mapbox.services.android.navigation.v5.utils.ManeuverUtils
import java.util.*

class ManeuverView internal constructor(context: Activity, routeOptions: RouteOptions, private val mNavigationOptions: MapboxNavigationOptions) {
    private var mainView: View? = null
    private var currentDistanceText: SpannableString? = null
    private var distanceFormatter: DistanceFormatter? = null
    private var instructionText: String? = null
    private var currentManeuverId = 0
    private var isTwentyFourHourFormat = false
    private var etaFormat: String? = null
    private var distancetextView: TextView? = null
    private var instructionTextView: TextView? = null
    private var arrivalTimeTextView: TextView? = null
    private var instructionImage: ImageView? = null

    fun updateView(routeProgress: RouteProgress) {
        updateInstructionText(routeProgress.currentLegProgress().currentStep())
        updateDistanceText(routeProgress)
        updateArrivalTime(routeProgress)
        val step = if (routeProgress.currentLegProgress().upComingStep() != null) routeProgress.currentLegProgress().upComingStep() else routeProgress.currentLegProgress().currentStep()
        updateManeuverImage(step)
    }

    fun show(context: Activity, rootView: ViewGroup) {
        if (mainView != null) {
            mainView!!.visibility = View.VISIBLE
        } else buildView(context, rootView)
    }

    fun hide() {
        if (mainView != null) {
            mainView!!.visibility = View.GONE
        }
    }

    private fun initialize(context: Activity, routeOptions: RouteOptions, mapboxNavigationOptions: MapboxNavigationOptions) {
        etaFormat = context.getString(R.string.eta_format)
        initializeDistanceFormatter(context, routeOptions, mapboxNavigationOptions)
        isTwentyFourHourFormat = DateFormat.is24HourFormat(context)
    }

    private fun initializeDistanceFormatter(context: Context, routeOptions: RouteOptions?, mapboxNavigationOptions: MapboxNavigationOptions) {
        val localeUtils = LocaleUtils()
        var language = localeUtils.inferDeviceLanguage(context)
        var unitType = localeUtils.getUnitTypeForDeviceLocale(context)
        if (routeOptions != null) {
            language = routeOptions.language()
            unitType = routeOptions.voiceUnits()
        }
        distanceFormatter = DistanceFormatter(context, language!!, unitType!!, mapboxNavigationOptions.roundingIncrement())
    }

    private fun buildView(context: Activity, rootView: ViewGroup) {
        mainView = context.layoutInflater.inflate(R.layout.collapsed_navigation_notification_layout, null)
        distancetextView = mainView?.findViewById(R.id.notificationDistanceText)
        instructionTextView = mainView?.findViewById(R.id.notificationInstructionText)
        arrivalTimeTextView = mainView?.findViewById(R.id.notificationArrivalText)
        instructionImage = mainView?.findViewById(R.id.maneuverImage)
        rootView.addView(mainView, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.WRAP_CONTENT))
    }

    private fun updateInstructionText(step: LegStep) {
        if (hasInstructions(step) && (instructionText == null || newInstructionText(step))) {
            instructionText = step.bannerInstructions()!![0].primary().text()
            instructionTextView!!.text = instructionText
        }
    }

    private fun hasInstructions(step: LegStep): Boolean {
        return step.bannerInstructions() != null && !step.bannerInstructions()!!.isEmpty()
    }

    private fun newInstructionText(step: LegStep): Boolean {
        return instructionText != step.bannerInstructions()!![0].primary().text()
    }

    private fun updateDistanceText(routeProgress: RouteProgress) {
        if (currentDistanceText == null || newDistanceText(routeProgress)) {
            currentDistanceText = distanceFormatter!!.formatDistance(
                    routeProgress.currentLegProgress().currentStepProgress().distanceRemaining())
            distancetextView!!.text = currentDistanceText
        }
    }

    private fun newDistanceText(routeProgress: RouteProgress): Boolean {
        return (currentDistanceText != null
                && currentDistanceText.toString() != distanceFormatter!!.formatDistance(
                routeProgress.currentLegProgress().currentStepProgress().distanceRemaining()).toString())
    }

    private fun updateArrivalTime(routeProgress: RouteProgress) {
        val time = Calendar.getInstance()
        val durationRemaining = routeProgress.durationRemaining()
        val timeFormatType = mNavigationOptions.timeFormatType()
        val arrivalTime = TimeFormatter.formatTime(time, durationRemaining, timeFormatType, isTwentyFourHourFormat)
        val formattedArrivalTime = String.format(etaFormat!!, arrivalTime)
        arrivalTimeTextView!!.text = formattedArrivalTime
    }

    private fun updateManeuverImage(step: LegStep?) {
        if (newManeuverId(step)) {
            val maneuverResource = ManeuverUtils.getManeuverResource(step)
            currentManeuverId = maneuverResource
            instructionImage!!.setImageResource(maneuverResource)
        }
    }

    private fun newManeuverId(step: LegStep?): Boolean {
        return currentManeuverId != ManeuverUtils.getManeuverResource(step)
    }

    init {
        initialize(context, routeOptions, mNavigationOptions)
    }
}
