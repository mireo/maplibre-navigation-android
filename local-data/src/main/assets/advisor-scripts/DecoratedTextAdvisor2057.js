var NearbyPoiRelation = {
	Poi_None            : 0, 
	Poi_BeforeAdvice    : 1, 
	Poi_AtAdvice        : 2, 
	Poi_AfterAdvice     : 3
};	

var NearbyPoiType = {
	Poi_Museum              : 402,
    Poi_HistoricalMonument	: 403,
    Poi_TouristAttraction	: 406,
    Poi_Theatre             : 421,
    Poi_Nightlife           : 423,
    Poi_Cinema				: 426,
    Poi_Hotel				: 450,
    Poi_Motel				: 452,
    Poi_Restaurant			: 460,
    Poi_CafePub				: 461,
    Poi_ShoppingCenter		: 470,
    Poi_GroceryStore        : 471,
    Poi_Market				: 473,
    Poi_Stadium				: 480,
    Poi_PoliceStation		: 502,
    Poi_Embassy				: 506,
    Poi_Church				: 540,
    Poi_Mosque				: 541,
    Poi_Temple				: 542,
    Poi_Hindu				: 545,
    Poi_Hospital			: 560,
    Poi_Pharmacy			: 562,
    Poi_PostOffice			: 570,
    Poi_Bank				: 580,
    Poi_ATM                 : 581,
    Poi_VehicleRepairFacility : 600,
    Poi_PetrolStation		: 610,
    Poi_LPGStation          : 611,
    Poi_Rentacar			: 620,
    Poi_CarDealer			: 670,
    Poi_Apartment			: 831,
    Poi_ShoppingRetailChain	: 838,
    Poi_ShoppingRetailChain2 : 839
};

var SimpleAdvice = {
	adv_invalid             : -1,
	adv_sharp_right         : 0,
	adv_right               : 1,
	adv_bear_right          : 2,
	adv_straight_ahead      : 3,
	adv_bear_left           : 4,
	adv_left                : 5,
	adv_sharp_left          : 6,
	adv_turn_around         : 7,
	adv_enter_round_about   : 8,
	adv_round_about_1       : 9,
	adv_round_about_2       : 10,
	adv_round_about_3       : 11,
	adv_round_about_4       : 12,
	adv_round_about_5       : 13,
	adv_round_about_6       : 14,
	adv_round_about_7       : 15,
	adv_round_about_8       : 16,
	adv_shift_right         : 17,
	adv_shift_left          : 18,
	adv_take_highway_exit   : 19,
	adv_destination_reached : 20,
	adv_take_ferry          : 24,
	adv_leave_ferry          : 25
};

var IntersectionShape = {
	IntersectionShape_Unknown   : 0, 
	IntersectionShape_T         : 1, 
	IntersectionShape_Y         : 2
};

var WorldOrientation = {
	Orientation_Unknown     : 0,
	Orientation_North       : 1, 
	Orientation_NorthEast   : 2, 
	Orientation_East        : 3, 
	Orientation_SouthEast   : 4,
	Orientation_South       : 5, 
	Orientation_SouthWest   : 6, 
	Orientation_West        : 7, 
	Orientation_NorthWest   : 8
};

var RelationToRoad = {
	Rel2Road_None    : 0, 
	Rel2Road_Left   : 1, 
	Rel2Road_Right  : 2
};

var _country_code = 0;
var _left_road_country = false;
var _lane_count = 0;

function _turnaround_advice_text() {
    advisor.add_output_string("Make a u-turn when possible.");
}

function _advice_to_text(advice) {
    _country_code = advice.get_int_property(advice_property.ap_country_code);
    _left_road_country = advisor.is_country_left_road(_country_code);

    if (advice.class_type == advice_class.ac_start) {
        _start_advice_to_text(advice);
    } else if (advice.class_type == advice_class.ac_border_crossing) {
        _border_crossing_advice_to_text(advice);
    } else if (advice.class_type == advice_class.ac_confirmation) {
        _confirmation_advice_to_text(advice);
    } else {
        _maneuver_advice_to_text(advice);
    }
}

function _start_advice_to_text(advice) {
	advisor.add_output_string(advisor.bold("head") +  " ");	
	_start_orientation_text(advice);
}

function _border_crossing_advice_to_text(advice) {
    var text = "";
    var country_name = advice.get_string_property(advice_property.ap_country_name);

    if (country_name.length > 0)
		text = advisor.bold("you will cross the country border") + " to " + advisor.italic(country_name) + ". Continue ";
	else
		text = advisor.bold("you will cross the country border") + ". Continue ";

	advisor.add_output_string(text);

	_start_orientation_text(advice);
}

function _confirmation_advice_to_text(advice) {
    var text = "";
    var entry_road_name = advice.get_string_property(advice_property.ap_entry_road_name);
    var landmark = advice.get_landmark_property(advice_property.ap_landmark);
    
	if (entry_road_name.length > 0)
		text += "while driving on " + advisor.italic(entry_road_name) + " ";

	text += "you will pass by " + _get_poi_description(landmark.type, landmark.brand_name) + " ";
	
	if (landmark.road_side == RelationToRoad.Rel2Road_Left)
		text += "on your left";
	else if (landmark.road_side == RelationToRoad.Rel2Road_Right)
		text += "on your right";
		
	advisor.add_output_string(text);
}

function _start_orientation_text(advice) {
    var text = "";
    var entry_road_name = advice.get_string_property(advice_property.ap_entry_road_name);
	var location_name = advice.get_string_property(advice_property.ap_location_name);
	var orientation = advice.get_int_property(advice_property.ap_start_orientation);

	if (orientation != WorldOrientation.Orientation_Unknown)
		text += _orientation_text(orientation) + " ";
	else if (location_name.length > 0)
		text = "start ";

	if (entry_road_name.length > 0)
		text += "on " + advisor.italic(entry_road_name) + " ";

	if (location_name.length > 0)
		text += "towards " + advisor.italic(location_name) + " ";

	if (text.length == 0) // this shouldn't happen, just in case
		text = "begin the journey ";

	advisor.add_output_string(text);
}

function _maneuver_advice_to_text(advice) {
    if (advice.get_int_property(advice_property.ap_short_advice) == SimpleAdvice.adv_destination_reached) {
        _destination_advice_to_text(advice);
        return;
    }
    if (advice.get_int_property(advice_property.ap_short_advice) == SimpleAdvice.adv_take_ferry) {
        _take_ferry_advice_to_text(advice);
        return;
    }
    if (advice.get_int_property(advice_property.ap_short_advice) == SimpleAdvice.adv_leave_ferry) {
        _leave_ferry_advice_to_text(advice);
        return;
    }

	var params = _add_advice_prefix(advice);
    
    params.has_word_at = _add_maneuver(advice, params.has_hw_advice, params.has_word_at, params.side_road_count)
    
    _add_street_names(advice, params.has_word_at);
    
    advisor.add_output_string(_lane_info_text(advice));    
    
    _add_chained_advice_text(advice);
    if (advice.get_int_property(advice_property.ap_chained_advice) == SimpleAdvice.adv_destination_reached)
        return;
        
    _add_landmark_after_advice(advice);
}

function _add_advice_prefix(advice) {
    var has_word_at = false;
    var has_hw_advice = false;
    var short_advice = advice.get_int_property(advice_property.ap_short_advice);
    
    var side_road_count = -1;
    var intersection_shape = IntersectionShape.IntersectionShape_Unknown;
    var first_from_prev = false;
    if (advice.class_type == advice_class.ac_maneuver_numbered)
        side_road_count = advice.get_int_property(advice_property.ap_side_road_count);
    if (advice.class_type == advice_class.ac_maneuver_road_shape)
        intersection_shape = advice.get_int_property(advice_property.ap_shape);
    if (advice.class_type == advice_class.ac_maneuver_next_intersection)
        first_from_prev = true;    
        
    var location_name = advice.get_string_property(advice_property.ap_location_name);
	var signpost_number = advice.get_string_property(advice_property.ap_signpost_number);    
       
    if ((advice.get_int_property(advice_property.ap_merge_on_highway) && (short_advice == SimpleAdvice.adv_straight_ahead)) ||
        _is_advice_roundabout(short_advice)) {
		first_from_prev = false;
		side_road_count = -1;
		intersection_shape = IntersectionShape.IntersectionShape_Unknown;
		signpost_number = "";
	}
	
	var text = "";
	
	if (first_from_prev && !advice.get_int_property(advice_property.ap_merge_on_highway)) {
		text = "at the next intersection ";
		has_word_at = true;
	} else if (signpost_number.length > 0) {
		text = "at exit " + advisor.italic(signpost_number) + " ";
		has_word_at = true;

		if (location_name.length > 0)
			text += "(" + advisor.italic(location_name) + ")";
		has_hw_advice = true;
	} else if ((short_advice == SimpleAdvice.adv_take_highway_exit) && (location_name.length > 0)) {
		text = "at " + _highway() + " intersection " + advisor.italic(location_name) + " ";
		has_hw_advice = true;
	} else if (intersection_shape != IntersectionShape.IntersectionShape_Unknown) {
        text = (intersection_shape == IntersectionShape.IntersectionShape_T) ? 
            "at the end of the road " :
            "at the fork ";
        has_word_at = true;
	}
	
	advisor.add_output_string(text);
	
	return {
	    side_road_count: side_road_count,
	    has_word_at: has_word_at,
	    has_hw_advice: has_hw_advice
	};
}

function _add_chained_advice_text(advice) {
    var short_advice = advice.get_int_property(advice_property.ap_short_advice);
    var chained_advice = advice.get_int_property(advice_property.ap_chained_advice);
    if (chained_advice == SimpleAdvice.adv_invalid)
        return;
        
    var text = "";
    
	if (chained_advice != SimpleAdvice.adv_destination_reached)
		text += ", then ";
	else
		text += " and ";

	text += _simple_advice_text(chained_advice) + " ";
	
	if (short_advice == chained_advice)
		text += "again ";
			
    advisor.add_output_string(text);
}

function _add_landmark_after_advice(advice) {
    if ((advice.class_type != advice_class.ac_maneuver_landmark) ||
        (advice.get_int_property(advice_property.ap_landmark_pos) != NearbyPoiRelation.Poi_AfterAdvice))
        return;
        
    var text = "";
    var landmark = advice.get_landmark_property(advice_property.ap_landmark);
	text += " and you will pass " + _get_poi_description(landmark.type, landmark.brand_name) + " ";
	if (landmark.road_side == RelationToRoad.Rel2Road_Left)
		text += "on your left";
	else if (landmark.road_side == RelationToRoad.Rel2Road_Right)
		text += "on your right";
			
    advisor.add_output_string(text);
}

function _destination_advice_to_text(advice) {
    var text = "";
    var road_side = advice.get_int_property(advice_property.ap_advice_road_side);
    text = advisor.last_subtrip ? advisor.bold("you will arrive at your destination") : advisor.bold("you will arrive at your intermediate destination");
    
	if (road_side == RelationToRoad.Rel2Road_Left)
		text += advisor.last_subtrip ? ". Destination is on your left" : ". Intermediate destination is on your left";
	else if (road_side == RelationToRoad.Rel2Road_Right)
		text += advisor.last_subtrip ? ". Destination is on your right" : ". Intermediate destination is on your right";

	advisor.add_output_string(text);
}

function _take_ferry_advice_to_text(advice) {
    var text = "";
    var entry_road_name = advice.get_string_property(advice_property.ap_entry_road_name);
    var exit_road_name = advice.get_string_property(advice_property.ap_exit_road_name);
	var location_name = advice.get_string_property(advice_property.ap_location_name);
    
    text = advisor.bold("take the ferry") + " ";
	if (location_name.length > 0)
		text += advisor.italic(location_name) + " ";
	if ((entry_road_name.length > 0) && (exit_road_name.length > 0))
		text += "from " + advisor.italic(entry_road_name) + " to " + advisor.italic(exit_road_name);

    advisor.add_output_string(text);
}

function _leave_ferry_advice_to_text(advice) {
    var text = "";
    var exit_road_name = advice.get_string_property(advice_property.ap_exit_road_name);
    
    if (exit_road_name.length > 0)
		text += "the ferry will dock at " + advisor.italic(exit_road_name);
	else
		text = "leave the ferry";			

    advisor.add_output_string(text);
}

function _add_street_names(advice, has_word_at) {
    if (advice.get_int_property(advice_property.ap_merge_on_highway)) {
        _add_highway_names(advice);
        return;
    }
    
    var text = "";
    var short_advice = advice.get_int_property(advice_property.ap_short_advice);
    var chained_advice = advice.get_int_property(advice_property.ap_chained_advice);
    var signpost = advice.get_string_property(advice_property.ap_signpost);
    var entry_road_name = advice.get_string_property(advice_property.ap_entry_road_name);
    var exit_road_name = advice.get_string_property(advice_property.ap_exit_road_name);
    var location_name = advice.get_string_property(advice_property.ap_location_name);
	

	if (signpost.length > 0) {
		text += " towards " + advisor.italic(signpost);
	} else if (short_advice == SimpleAdvice.adv_straight_ahead) {
		if ((entry_road_name == exit_road_name) && (entry_road_name.length > 0)) {
			text += " to stay on " + advisor.italic(exit_road_name);
		} else if (exit_road_name.length > 0) {
			text += " on ";
			text += advisor.italic(exit_road_name);
		}
	} else if (short_advice == SimpleAdvice.adv_turn_around) {
		if ((location_name.length > 0) && !has_word_at)
			text += " at " + advisor.italic(location_name);
	} else {	    
		if ((entry_road_name == exit_road_name) && (entry_road_name.length > 0)) {
			text += " to stay on " + advisor.italic(exit_road_name);
		} else if (exit_road_name.length > 0) {
			if (has_word_at)
				text += " onto";
			else
				text += " at";

			text += " " + advisor.italic(exit_road_name);
		}
	} 
		
    advisor.add_output_string(text);
}

function _add_highway_names(advice) {
    var text = "";
    var signpost = advice.get_string_property(advice_property.ap_signpost);
    var exit_road_name = advice.get_string_property(advice_property.ap_exit_road_name);
    var short_advice = advice.get_int_property(advice_property.ap_short_advice);
    var chained_advice = advice.get_int_property(advice_property.ap_chained_advice);
    
    if (signpost.length > 0)
		text += " towards " + advisor.italic(signpost);

	if ((short_advice != SimpleAdvice.adv_straight_ahead) || 
	    (chained_advice != SimpleAdvice.adv_invalid) ||
	    (signpost.length > 0))
		text += " and";

	text += " " + advisor.bold("merge") + " onto ";

	if (exit_road_name.length > 0)			
		text += _highway() + " " + advisor.italic(exit_road_name);
    else
	    text += "the " + _highway();

	advisor.add_output_string(text);
}

function _add_maneuver(advice, has_hw_advice, has_word_at, side_road_count) {
    var text = "";
    var maneuver_text_added = false;
    var short_advice = advice.get_int_property(advice_property.ap_short_advice);
    var chained_advice = advice.get_int_property(advice_property.ap_chained_advice);
    var landmark = advice.get_landmark_property(advice_property.ap_landmark);
    var landmark_pos = advice.get_int_property(advice_property.ap_landmark_pos);
    
    if (!has_hw_advice)	{
		if (landmark_pos == NearbyPoiRelation.Poi_BeforeAdvice)	{
			text = "after " + _get_poi_description(landmark.type, landmark.brand_name) + " ";
		} else if (landmark_pos == NearbyPoiRelation.Poi_AtAdvice) {
			text = "at " + _get_poi_description(landmark.type, landmark.brand_name) + " ";
			has_word_at = text;
		} else if ((short_advice == SimpleAdvice.adv_left) && (side_road_count != -1)) {
			text = "take the " + _ordinal_string(side_road_count + 1) + " " + advisor.bold("left");
			maneuver_text_added = true;
		} else if ((short_advice == SimpleAdvice.adv_right) && (side_road_count != -1)) {
			text = "take the " + _ordinal_string(side_road_count + 1) + " " + advisor.bold("right");
			maneuver_text_added = true;
		}
	}

	// if the advice is "merge on highway" do not output "continue straight" part
	if ((advice.get_int_property(advice_property.ap_merge_on_highway)) && 
	    (short_advice == SimpleAdvice.adv_straight_ahead) && 
	    (chained_advice == SimpleAdvice.adv_invalid)) {
		maneuver_text_added = true;
	}

	if (!maneuver_text_added)
		text += _simple_advice_text(short_advice);
	
	advisor.add_output_string(text);
	
	return has_word_at;
}

function _simple_advice_text(simple_advice) {
    switch (simple_advice) {
	case SimpleAdvice.adv_sharp_right:          return "make a " + advisor.bold("sharp right") + " turn";
	case SimpleAdvice.adv_right:                return "turn " + advisor.bold("right");
	case SimpleAdvice.adv_bear_right:           return advisor.bold("bear right");
	case SimpleAdvice.adv_straight_ahead:       return "continue " + advisor.bold("straight");
	case SimpleAdvice.adv_bear_left:            return advisor.bold("bear left");
	case SimpleAdvice.adv_left :                return "turn " + advisor.bold("left");
	case SimpleAdvice.adv_sharp_left:           return "make a " + advisor.bold("sharp left") + " turn";
	case SimpleAdvice.adv_turn_around:          return "make a " + advisor.bold("u-turn");
	case SimpleAdvice.adv_enter_round_about:    return "enter the roundabout";
	case SimpleAdvice.adv_round_about_1:        return "take the " + advisor.bold("1st") + " exit";
	case SimpleAdvice.adv_round_about_2:        return "take the " + advisor.bold("2nd") + " exit";
	case SimpleAdvice.adv_round_about_3:        return "take the " + advisor.bold("3rd") + " exit";
	case SimpleAdvice.adv_round_about_4:        return "take the " + advisor.bold("4th") + " exit";
	case SimpleAdvice.adv_round_about_5:        return "take the " + advisor.bold("5th") + " exit";
	case SimpleAdvice.adv_round_about_6:        return "take the " + advisor.bold("6th") + " exit";
	case SimpleAdvice.adv_round_about_7:        return "take the " + advisor.bold("7th") + " exit";
	case SimpleAdvice.adv_round_about_8:        return "take the " + advisor.bold("8th") + " exit";
	case SimpleAdvice.adv_take_highway_exit:    return advisor.bold("exit") + " the " + _highway();
	case SimpleAdvice.adv_destination_reached:  return advisor.last_subtrip ? "you will arrive at your destination" : "you will arrive at your intermediate destination";
	}
	return "";
}

function _is_advice_roundabout(simple_advice) {
    switch (simple_advice) {
    case SimpleAdvice.adv_enter_round_about:
	case SimpleAdvice.adv_round_about_1:
	case SimpleAdvice.adv_round_about_2:
	case SimpleAdvice.adv_round_about_3:
	case SimpleAdvice.adv_round_about_4:
	case SimpleAdvice.adv_round_about_5:
	case SimpleAdvice.adv_round_about_6:
	case SimpleAdvice.adv_round_about_7:
	case SimpleAdvice.adv_round_about_8:
		return true;
	}
	return false;
}

function _orientation_text(orientation) {
    switch(orientation) {
	case WorldOrientation.Orientation_North:     return "north";
	case WorldOrientation.Orientation_NorthEast: return "north-east";
	case WorldOrientation.Orientation_East:      return "east";
	case WorldOrientation.Orientation_SouthEast: return "south-east";
	case WorldOrientation.Orientation_South:     return "south";
	case WorldOrientation.Orientation_SouthWest: return "south-west";
	case WorldOrientation.Orientation_West:      return "west";
	case WorldOrientation.Orientation_NorthWest: return "north-west";
	}
	return "";
}

function _ordinal_string(ordinal_num) {
    switch(ordinal_num) {
	case 1: return "1st";
	case 2: return "2nd";
	case 3: return "3rd";
	case 4: return "4th";
	case 5: return "5th";
	}
	return "";
}

function _highway() {
    return _country_code == 840 ? "highway" : "motorway";
}

function _get_poi_description(poi_type, poi_name) {
    var description = _poi_description_from_type(poi_type, poi_name);
    
    if (description.length == 0)
        description = _poi_description_from_type(poi_type - poi_type%10, poi_name);
    
    if (description.length == 0)
        description = advisor.italic(poi_name);
        
    return description;
}

function _poi_description_from_type(poi_type, poi_name) {
    switch (poi_type) {
    case NearbyPoiType.Poi_Museum:              return "the museum";
    case NearbyPoiType.Poi_HistoricalMonument:  return advisor.italic(poi_name) + " monument";
    case NearbyPoiType.Poi_TouristAttraction:   return advisor.italic(poi_name);
    case NearbyPoiType.Poi_Theatre:             return "the theatre";
    case NearbyPoiType.Poi_Cinema:              return "the cinema";
	case NearbyPoiType.Poi_Stadium:             return "the stadium";
	case NearbyPoiType.Poi_Hotel:               return advisor.italic(poi_name) + " hotel";
	case NearbyPoiType.Poi_Motel:               return advisor.italic(poi_name) + " motel";
	case NearbyPoiType.Poi_Restaurant:          return advisor.italic(poi_name) + " restaurant";
	case NearbyPoiType.Poi_Nightlife:           return advisor.italic(poi_name) + " night club";
	case NearbyPoiType.Poi_CafePub:             return advisor.italic(poi_name) + " cafe";
	case NearbyPoiType.Poi_Rentacar:            return advisor.italic(poi_name) + " rent-a-car facility";
	case NearbyPoiType.Poi_Pharmacy:            return "the pharmacy";
	case NearbyPoiType.Poi_Hospital:            return "the hospital";
	case NearbyPoiType.Poi_PetrolStation:       return advisor.italic(poi_name) + " Petrol station";
	case NearbyPoiType.Poi_LPGStation:          return advisor.italic(poi_name) + " Petrol/LPG station";
	case NearbyPoiType.Poi_ShoppingCenter:      return "the shopping center";
	case NearbyPoiType.Poi_GroceryStore:        return "the grocery store";
	case NearbyPoiType.Poi_Market:              return "the market";
	case NearbyPoiType.Poi_VehicleRepairFacility: return advisor.italic(poi_name) + " vehicle repair shop";
	case NearbyPoiType.Poi_Embassy:             return advisor.italic(poi_name) + " embassy";
	case NearbyPoiType.Poi_PoliceStation:       return "the police station";
	case NearbyPoiType.Poi_PostOffice:          return "the post office";
	case NearbyPoiType.Poi_Bank:                return "the bank";
	case NearbyPoiType.Poi_ATM:                 return "the ATM machine";
	case NearbyPoiType.Poi_Church:              return "the church";
	case NearbyPoiType.Poi_Mosque:              return "the mosque";
	case NearbyPoiType.Poi_Temple:              return "the temple";
	case NearbyPoiType.Poi_Hindu:               return "the hindu temple";
	case NearbyPoiType.Poi_CarDealer:           return advisor.italic(poi_name) + " car dealership";
	case NearbyPoiType.Poi_Bank:                return advisor.italic(poi_name) + " bank";
	case NearbyPoiType.Poi_Apartment:           return advisor.italic(poi_name) + " apartment complex";
	case NearbyPoiType.Poi_ShoppingRetailChain: return advisor.italic(poi_name) + " store";
	case NearbyPoiType.Poi_ShoppingRetailChain2:return advisor.italic(poi_name) + " store";
	}	
	return "";
}

function _lanes(lanes, dir) {
	var ret = "";
	if (lanes > 1) {
	    ret += "one of the ";
		ret += lanes + " ";
		ret += dir;
		ret += " lanes";
	} else {
		ret += "the " + dir + " lane";
	}
	return ret;
}

function _lane_num(lane) {
	if (_left_road_country)
		return _lane_count - lane;
	return lane + 1;
}

function _advice_lane(advice, i) {
    if (!advice.is_nonconf)
        return 0;
        
    var masked_lanes = advice.get_int_array_property(advice_property.ap_masked_lane_info);
    if (i < 0 || i >= masked_lanes.length) {
		return -1;
	}
	
	return masked_lanes[i];
}

function _lane_info_text(advice) {
    var lanes, lmin, lmax, i, l, ret;
    _lane_count = advice.get_int_array_property(advice_property.ap_lane_info).length;
	lanes = advice.get_int_array_property(advice_property.ap_masked_lane_info).length;
	lmin = _advice_lane(advice, 0) >> 9;
	lmax = lmin;
	
	if ((lanes == 0) || (_lane_count == lanes))
	    return "";

	ret = " using ";

	for (i = 1; i < lanes; i++) {
		l = _advice_lane(advice, i) >> 9;
		if (l > lmax) lmax = l;
		if (l < lmin) lmin = l;
	}
	
	if ((lmin == (_lane_count - lmax - 1)) &&
	    ((lmax - lmin + 1) == lanes)) {
		if (lmin == lmax)
			ret += " the middle lane";
		else
			ret += " one of the " + (lmax - lmin + 1) + " middle lanes";
		return ret;
	}

	if (lmax + 1 - lmin == lanes) {
		// connected
		if (lmax == _lane_count-1) {
			ret += _lanes(lanes, "leftmost");
		} else if (lmin == 0) {
			ret += _lanes(lanes, "rightmost");
		} else {
			lmin = _lane_num(lmin);
			lmax = _lane_num(lmax);
			if (lmin == lmax) {
				ret += "lane " + lmin;
			}
			else {
				ret += "lanes ";
				ret += lmin < lmax ? lmin : lmax;
				ret += lanes > 2 ? " to " : " or ";
				ret += lmax > lmin ? lmax : lmin;
			}
		}
	} else {
		// disconnected
		ret += "lanes ";
		if (_left_road_country) {
			for (i = lanes - 1; i >= 0; i--) {
				if ((i == 0) && (i < lanes - 1)) {
					ret += " or ";
				}
				else if (i > 0) {
					ret += ", ";
				}
				l = _advice_lane(advice, i) >> 9;
				ret += lanes - l;
			}
		} else {
			for (i = 0; i < lanes; i++) {
				if ((i == lanes - 1) && (i > 0)) {
					ret += " or ";
				}
				else if (i > 0) {
					ret += ", ";
				}
				l = _advice_lane(advice, i) >> 9;
				ret += (l + 1);
			}
		}
	}
	return ret;
}

(function() {
    advisor.turnaround_advice_text = _turnaround_advice_text;
    advisor.advice_to_text = _advice_to_text;
})();
