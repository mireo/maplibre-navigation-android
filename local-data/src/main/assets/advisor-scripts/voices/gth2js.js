// Helper function for transition from Glothal advisor scripts to JavaScript advisor scripts

function GetBorderCrossingName(advice) {
    if (advice.class_type == advice_class.ac_border_crossing)
        return advice.get_string_property(advice_property.ap_country_name);
    return "";        
}

function GetPoiType(advice) {
    if ((advice.class_type == advice_class.ac_confirmation) ||
        (advice.class_type == advice_class.ac_maneuver_landmark)) {
        var landmark = advice.get_landmark_property(advice_property.ap_landmark);
        if (landmark)
            return landmark.type;
    }
    return 0;
}

function GetPoiRelationToRoad(advice) {
    if ((advice.class_type == advice_class.ac_confirmation) ||
        (advice.class_type == advice_class.ac_maneuver_landmark)) {
        var landmark = advice.get_landmark_property(advice_property.ap_landmark);
        if (landmark)
            return landmark.road_side;
    }
    return 0;
}

function GetPoiRelationToAdvice(advice) {
    if (advice.class_type == advice_class.ac_confirmation)
        return 2;
        
    if (advice.class_type != advice_class.ac_maneuver_landmark)
        return 0;

    return advice.get_int_property(advice_property.ap_landmark_pos);    
}

function GetShortAdvice(advice) {
    if (!advice.has_property(advice_property.ap_short_advice))
			return -1;
	return advice.get_int_property(advice_property.ap_short_advice);
}

function GetChainedComplexAdvice(advice) {
    if (!advice.has_property(advice_property.ap_chained_advice))
			return -1;
	return advice.get_int_property(advice_property.ap_chained_advice);
}

function GetIntersectionShape(advice) {
    if (advice.class_type != advice_class.ac_maneuver_road_shape)
		return 0;
	return advice.get_int_property(advice_property.ap_shape);
}

function IsNextIntersection(advice) {
    return advice.class_type == advice_class.ac_maneuver_next_intersection;
}

function GetRoadCurveBeforeAdvice(advice) {
    if (advice.class_type != advice_class.ac_maneuver_curve)
		return 0;
	return advice.get_int_property(advice_property.ap_curve_shape);
}

function GetSignpostExitNumber(advice) {
    return advice.get_string_property(advice_property.ap_signpost_number);
}

function GetSignpostInfoPhonetic$(advice) {
    return advice.get_string_property(advice_property.ap_signpost_ph);
}

function GetSignpostInfo$(advice) {
    return advice.get_string_property(advice_property.ap_signpost);
}

function GetExitNumber$(advice) {
    return advice.get_string_property(advice_property.ap_signpost_number);
}

function GetToStreetNamePhonetic$(advice) {
    return advice.get_string_property(advice_property.ap_exit_road_name_ph);
}

function GetToStreetName$(advice) {
    return advice.get_string_property(advice_property.ap_exit_road_name);
}

function GetMergeName$(advice) {
    return advice.get_string_property(advice_property.ap_exit_route_name);
}

function GetDenseRoadCount(advice) {
    if (advice.class_type != advice_class.ac_maneuver_dense_roads)
		return -1;
	return advice.get_int_property(advice_property.ap_dense_road_count);
}

function GetSideRoadCount(advice) {
    if (advice.class_type != advice_class.ac_maneuver_numbered)
		return -1;

	return advice.get_int_property(advice_property.ap_side_road_count);
}

function IsLeftRoadCountry(advice) {
    return advisor.is_country_left_road(advice.get_int_property(advice_property.ap_country_code));
}

function IsMergeHighway(advice) {
    return advice.get_int_property(advice_property.ap_merge_on_highway);
}

function GetRouteName(advice) {
    return advice.get_string_property(advice_property.ap_exit_route_name);
}

function AdviceLaneCount(advice) {
    var masked_lanes = advice.get_int_array_property(advice_property.ap_masked_lane_info);
    if (masked_lanes)
        return masked_lanes.length;
    return 0;
}

function LaneCount(advice) {
    var lanes = advice.get_int_array_property(advice_property.ap_lane_info);
    if (lanes)
        return lanes.length;
    return 0;
}

function AdviceLane(advice, i) {
    var masked_lanes = advice.get_int_array_property(advice_property.ap_masked_lane_info);
    if (!masked_lanes) 
        return 0;
        
    if ((i < 0) || (i >= masked_lanes.length))
		return -1;

	return masked_lanes[i];
}

function GetExitHighwayRoadRelation(advice) {
    if (!advice)
        return 0;
        
    return advice.get_int_property(advice_property.ap_advice_road_side);
}

function IsLastRoute() { return advisor.last_subtrip; }
function GetSpitPosition() { return advisor.spit_position; }

function GetDistance() { return advisor.distance.length; }
function GetDistanceUnit() { return advisor.distance.unit; }
function GetAfterDot() { return (advisor.distance.unit == 2) ? advisor.distance.after_dot : 0; }
function GetMilePart() { return (advisor.distance.unit == 5) ? advisor.distance.mile_part : 0; }
function IsOnHighway() { return advisor.on_highway; }

function Len(s) { return s.length; }

function AddAdviceString(s) { advisor.play(s); }
