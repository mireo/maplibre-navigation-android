var NearbyPoiRelation = {
	Poi_None            : 0, 
	Poi_BeforeAdvice    : 1, 
	Poi_AtAdvice        : 2, 
	Poi_AfterAdvice     : 3
};

var RoadCurveShape = {
	RoadCurve_Unknown :     0,
	RoadCurve_Left :        1,
	RoadCurve_Right :       2,
	RoadCurve_AroundLeft :  3,
	RoadCurve_AroundRight : 4	
};

const 
	Poi_Museum = 402,
	Poi_HistoricalMonument = 403,
	Poi_TouristAttraction = 406,
	Poi_Theatre = 421,
	Poi_Nightlife = 423,
	Poi_Cinema = 426,
	Poi_Hotel = 450,
	Poi_Motel = 452,
	Poi_Restaurant = 460,
	Poi_CafePub = 461,
	Poi_ShoppingCenter = 470,
	Poi_GroceryStore = 471,
	Poi_Market = 473,
	Poi_Stadium = 480,
	Poi_PoliceStation = 502,
	Poi_Embassy = 506,
	Poi_Church = 540,
	Poi_Mosque = 541,
	Poi_Temple = 542,
	Poi_Hindu = 545,
	Poi_Hospital = 560,
	Poi_Pharmacy = 562,
	Poi_PostOffice = 570,
	Poi_Bank = 580,
	Poi_ATM = 581,
	Poi_VehicleRepairFacility = 600,
	Poi_PetrolStation = 610,
	Poi_LPGStation = 611,
	Poi_Rentacar = 620,
	Poi_CarDealer = 670,
	Poi_Apartment = 831,
	Poi_ShoppingRetailChain = 838,
	Poi_ShoppingRetailChain2 = 839
;

var _poi_names = [];
var _poi_names_at = [];
var _poi_names_after = [];

_poi_names[Poi_Museum] = "متحف";
_poi_names[Poi_HistoricalMonument] = "نصب تذكاري";
_poi_names[Poi_TouristAttraction] = "منطقة جذب سياحي";
_poi_names[Poi_Theatre] = "مسرح";
_poi_names[Poi_Nightlife] = "ملهى ليلي";
_poi_names[Poi_Cinema] = "سينما";
_poi_names[Poi_Hotel] = "فندق";
_poi_names[Poi_Motel] = "موتيل";
_poi_names[Poi_Restaurant] = "مطعم";
_poi_names[Poi_CafePub] = "مقهى";
_poi_names[Poi_ShoppingCenter] = "مركز تسوق";
_poi_names[Poi_GroceryStore] = "متجر خضروات";
_poi_names[Poi_Market] = "سوق";
_poi_names[Poi_Stadium] = "استاد";
_poi_names[Poi_PoliceStation] = "مركز شرطة";
_poi_names[Poi_Embassy] = "سفارة";
_poi_names[Poi_Church] = "كنيسة";
_poi_names[Poi_Mosque] = "مسجد";
_poi_names[Poi_Temple] = "معبد";
_poi_names[Poi_Hindu] = "معبد هندوسي";
_poi_names[Poi_Hospital] = "مستشفى";
_poi_names[Poi_Pharmacy] = "صيدلية";
_poi_names[Poi_PostOffice] = "مكتب بريد";
_poi_names[Poi_Bank] = "بنك";
_poi_names[Poi_ATM] = "ماكينة الصراف الآلي";
_poi_names[Poi_VehicleRepairFacility] = "ورشة إصلاح سيارات";
_poi_names[Poi_PetrolStation] = "محطة بنزين";
_poi_names[Poi_LPGStation] = "محطة بنزين/غاز مسال";
_poi_names[Poi_Rentacar] = "منشأة تأجير سيارات";
_poi_names[Poi_CarDealer] = "وكيل سيارات";
_poi_names[Poi_Apartment] = "مجمع سكني";
_poi_names[Poi_ShoppingRetailChain] = "متجر";
_poi_names[Poi_ShoppingRetailChain2] = "متجر";

_poi_names_at[Poi_Museum] = "عند المتحف";
_poi_names_at[Poi_HistoricalMonument] = "عند النصب التذكاري";
_poi_names_at[Poi_TouristAttraction] = "عند منطقة الجذب السياحي";
_poi_names_at[Poi_Theatre] = "عند المسرح";
_poi_names_at[Poi_Nightlife] = "عند الملهى الليلي";
_poi_names_at[Poi_Cinema] = "عند السينما";
_poi_names_at[Poi_Hotel] = "عند الفندق";
_poi_names_at[Poi_Motel] = "عند الموتيل";
_poi_names_at[Poi_Restaurant] = "عند المطعم";
_poi_names_at[Poi_CafePub] = "عند المقهى";
_poi_names_at[Poi_ShoppingCenter] = "عند مركز التسوق";
_poi_names_at[Poi_GroceryStore] = "عند متجر الخضروات";
_poi_names_at[Poi_Market] = "عند السوق";
_poi_names_at[Poi_Stadium] = "عند الاستاد";
_poi_names_at[Poi_PoliceStation] = "عند مركز الشرطة";
_poi_names_at[Poi_Embassy] = "عند السفارة";
_poi_names_at[Poi_Church] = "عند الكنيسة";
_poi_names_at[Poi_Mosque] = "عند المسجد";
_poi_names_at[Poi_Temple] = "عند المعبد";
_poi_names_at[Poi_Hindu] = "عند المعبد الهندوسي";
_poi_names_at[Poi_Hospital] = "عند المستشفى";
_poi_names_at[Poi_Pharmacy] = "عند الصيدلية";
_poi_names_at[Poi_PostOffice] = "عند مكتب البريد";
_poi_names_at[Poi_Bank] = "عند البنك";
_poi_names_at[Poi_ATM] = "عند ماكينة الصراف الآلي";
_poi_names_at[Poi_VehicleRepairFacility] = "عند ورشة إصلاح السيارات";
_poi_names_at[Poi_PetrolStation] = "عند محطة البنزين";
_poi_names_at[Poi_LPGStation] = "عند محطة البترول/الغاز النفطي المسال";
_poi_names_at[Poi_Rentacar] = "عند منشأة إيجار السيارات";
_poi_names_at[Poi_CarDealer] = "عند وكيل السيارات";
_poi_names_at[Poi_Apartment] = "عند المجمع السكني";
_poi_names_at[Poi_ShoppingRetailChain] = "عند المتجر";
_poi_names_at[Poi_ShoppingRetailChain2] = "عند المتجر";

_poi_names_after[Poi_Museum] = "بعد المتحف";
_poi_names_after[Poi_HistoricalMonument] = "بعد النصب التذكاري";
_poi_names_after[Poi_TouristAttraction] = "بعد منطقة الجذب السياحي";
_poi_names_after[Poi_Theatre] = "بعد المسرح";
_poi_names_after[Poi_Nightlife] = "بعد الملهى الليلي";
_poi_names_after[Poi_Cinema] = "بعد السينما";
_poi_names_after[Poi_Hotel] = "بعد الفندق";
_poi_names_after[Poi_Motel] = "بعد الموتيل";
_poi_names_after[Poi_Restaurant] = "بعد المطعم";
_poi_names_after[Poi_CafePub] = "بعد المقهى";
_poi_names_after[Poi_ShoppingCenter] = "بعد مركز التسوق";
_poi_names_after[Poi_GroceryStore] = "بعد متجر الخضروات";
_poi_names_after[Poi_Market] = "بعد متجر";
_poi_names_after[Poi_Stadium] = "بعد الاستاد";
_poi_names_after[Poi_PoliceStation] = "بعد مركز الشرطة";
_poi_names_after[Poi_Embassy] = "بعد السفارة";
_poi_names_after[Poi_Church] = "بعد الكنيسة";
_poi_names_after[Poi_Mosque] = "بعد المسجد";
_poi_names_after[Poi_Temple] = "بعد المعبد";
_poi_names_after[Poi_Hindu] = "بعد المعبد الهندوسي";
_poi_names_after[Poi_Hospital] = "بعد المستشفى";
_poi_names_after[Poi_Pharmacy] = "بعد الصيدلية";
_poi_names_after[Poi_PostOffice] = "بعد مكتب البريد";
_poi_names_after[Poi_Bank] = "بعد البنك";
_poi_names_after[Poi_ATM] = "بعد ماكينة الصراف الآلي";
_poi_names_after[Poi_VehicleRepairFacility] = "بعد ورشة إصلاح السيارات";
_poi_names_after[Poi_PetrolStation] = "بعد محطة البترول";
_poi_names_after[Poi_LPGStation] = "بعد محطة بنزين/غاز مسال";
_poi_names_after[Poi_Rentacar] = "بعد منشأة إيجار السيارات";
_poi_names_after[Poi_CarDealer] = "بعد وكيل السيارات";
_poi_names_after[Poi_Apartment] = "بعد المجمع السكني";
_poi_names_after[Poi_ShoppingRetailChain] = "بعد المتجر";
_poi_names_after[Poi_ShoppingRetailChain2] = "بعد المتجر";

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
var tts_array = [];

var rtl_embed = '\u202B';
var pop_directional = '\u202C';

function force_rtl(str) {
	return rtl_embed + str + pop_directional;
}

function _play_advices() {
	var len = tts_array.length;
	//var sentence = "";

	for (var i = 0; i < len; ++i) {
		//sentence += force_rtl(tts_array[i] + ((i < len-1) ? " " : ""));
		advisor.play(tts_array[i]);
	}

	//advisor.play(sentence);
	tts_array = [];
}

function _orientation_text(orientation) {
	switch(orientation) {
		case WorldOrientation.Orientation_North:     return "الشمال";
		case WorldOrientation.Orientation_NorthEast: return "الشمال الشرقي";
		case WorldOrientation.Orientation_East:      return "الشرق";
		case WorldOrientation.Orientation_SouthEast: return "الجنوب الشرقي";
		case WorldOrientation.Orientation_South:     return "الجنوب";
		case WorldOrientation.Orientation_SouthWest: return "الجنوب الغربي";
		case WorldOrientation.Orientation_West:      return "الغرب";
		case WorldOrientation.Orientation_NorthWest: return "الشمال الغربي";
	}
	return "";
}

function _advice_to_text(advice) {
	_country_code = advice.get_int_property(advice_property.ap_country_code);
	_left_road_country = advisor.is_country_left_road(_country_code);

	if (advice.class_type == advice_class.ac_start) {
		_heading_to_text(advice.get_int_property(advice_property.ap_start_orientation));
	} else if (advice.class_type == advice_class.ac_border_crossing) {
		if (_say_distance(advice) == null) {
			tts_array = [];
			return;
		}
		tts_array.push("سوف تعبر حدود الدولة");
	} else if (advice.class_type == advice_class.ac_confirmation) {
		_say_distance(advice);
		_confirmation_advice_to_text(advice);
	} else {
		if (advisor.hint_turnaround) {
			tts_array.push("قم بالدوران عندما يكون ذلك ممكناً");
		} else {
			var attrs_names = _say_distance(advice);
			if (attrs_names == null) {
				tts_array = [];
				return;
			}
			_maneuver_advice_to_text(advice, attrs_names.attributes, attrs_names.names);
		}
	}

	_play_advices();
}

function _route_missed_text() {
	tts_array.push("ضاعت الاستدارة، جاري إعادة التوجيه");
	_play_advices();
}

function _heading_to_text(heading) {
	tts_array.push("توجه إلى");
	tts_array.push(_orientation_text(heading));
	_play_advices();
}

function _destination_reached(road_side) {
	var distance = _round_distance(advisor.distance);
	
	if ((distance.length == 0) && (distance.mile_part == sys.mile_part.mp_none)) {
		switch(road_side) {
			case RelationToRoad.Rel2Road_None: 
				tts_array.push(advisor.last_subtrip ? "لقد وصلت إلى وجهتك" : "لقد وصلت إلى وجهتك المتوسطة");
				break; 
			case RelationToRoad.Rel2Road_Left: 
				tts_array.push(advisor.last_subtrip ? "وجهتك على يسارك" : "وجهتك المتوسطة على يسارك");
				break; 
			case RelationToRoad.Rel2Road_Right: 
				tts_array.push(advisor.last_subtrip ? "وجهتك على يمينك" : "وجهتك المتوسطة على يمينك"); 
				break; 
		}
		_play_advices();
		return;
	}
	
	tts_array.push(advisor.last_subtrip ? "وجهتك على بعد" : "وجهتك المتوسطة على بعد");
	_format_distance(distance, false);

	switch(road_side) {
		case RelationToRoad.Rel2Road_None: tts_array.push("أمامك مباشرة"); break;
		case RelationToRoad.Rel2Road_Left: tts_array.push("على يسارك"); break;
		case RelationToRoad.Rel2Road_Right: tts_array.push("على يمينك"); break;
	}

	_play_advices();
}

function _prepare_attributes(advice) {
	var attributes = [];
	var names = [];
	var distance = advisor.distance;
	
	if (advice.class_type == advice_class.ac_maneuver_curve)
		attributes.curve_shape = advice.get_int_property(advice_property.ap_curve_shape);
		
	if ((advice.class_type == advice_class.ac_maneuver_road_shape) &&
		(distance.unit != sys.distance_unit_type.dist_kilometers) && (distance.unit != sys.distance_unit_type.dist_miles))
		attributes.shape = advice.get_int_property(advice_property.ap_shape);
		
	if (advice.class_type == advice_class.ac_maneuver_dense_roads) {
		attributes.dense_road_count = advice.get_int_property(advice_property.ap_dense_road_count);
		if (attributes.dense_road_count > 7)
			delete attributes.dense_road_count;
	}
		
	if (advice.class_type == advice_class.ac_maneuver_numbered)
		attributes.side_road_count = advice.get_int_property(advice_property.ap_side_road_count);
		
	if (advice.class_type == advice_class.ac_maneuver_next_intersection) {
		var short_advice = advice.get_int_property(advice_property.ap_short_advice);
		if ((short_advice == SimpleAdvice.adv_left) || (short_advice == SimpleAdvice.adv_right))
			attributes.side_road_count = 0;
		else
			attributes.next_intersection = true;
	}
				
	switch(advisor.spit_position) {
		case sys.spit_position.first:
			names = _get_speak_names(advice);
			delete attributes.shape;
			attributes.follow_this_road_text = true;
			break;
			
		case sys.spit_position.mid:
			names = _get_speak_names(advice);
			if (advice.class_type == advice_class.ac_maneuver_landmark) {
				attributes.landmark = advice.get_landmark_property(advice_property.ap_landmark);
				attributes.landmark_pos = advice.get_int_property(advice_property.ap_landmark_pos);
			}
			break;
		
		case sys.spit_position.last:
			break;
	}
	
	var short_advice = advice.get_int_property(advice_property.ap_short_advice);
	if (short_advice == SimpleAdvice.adv_destination_reached) {
		delete attributes.next_intersection;
		delete attributes.side_road_count;
		delete attributes.shape;
		delete attributes.curve_shape;
	}
	if ((advice.get_int_property(advice_property.ap_merge_on_highway)) && 
		(short_advice == SimpleAdvice.adv_straight_ahead)) {
		delete attributes.next_intersection;
		delete attributes.side_road_count;
		delete attributes.curve_shape;
	}
	
	if (attributes.hasOwnProperty('curve_shape') || 
		advisor.on_ferry ||
		advice.class_type == advice_class.ac_confirmation)
		delete attributes.follow_this_road_text;
	
	if (_is_advice_roundabout(short_advice) || 
		(short_advice == SimpleAdvice.adv_take_highway_exit))
	{
		delete attributes.next_intersection;
		delete attributes.side_road_count;
		delete attributes.shape;
		delete attributes.curve_shape;
		delete names.signpost_number;
		if ((short_advice == SimpleAdvice.adv_take_highway_exit) && 
			(attributes.dense_road_count)) {
			attributes.hw_exit_count = attributes.dense_road_count;
			delete attributes.dense_road_count;
		}
	}
	
	var zero_dist = ((distance.length == 0) && (distance.mile_part == sys.mile_part.mp_none) && (distance.after_dot == 0));	
	if (zero_dist) {
		delete attributes.next_intersection;
		delete attributes.side_road_count;
		delete attributes.shape;
		delete attributes.curve_shape;
		if (advisor.spit_position == sys.spit_position.last)
			delete attributes.dense_road_count;
	}
	
	return {
		attributes: attributes,
		names: names,
		zero_dist: zero_dist
	};
}

function _say_distance(advice) {	
	var distance = advisor.distance;
	var attrs_names = _prepare_attributes(advice);
	var short_advice = advice.get_int_property(advice_property.ap_short_advice);
	
	var attributes = attrs_names.attributes;
	var names = attrs_names.names;
	var zero_dist = attrs_names.zero_dist;

	if (!zero_dist &&
		!attributes.hasOwnProperty('next_intersection') &&
		!attributes.hasOwnProperty('side_road_count') &&
		!attributes.hasOwnProperty('dense_road_count') &&
		!attributes.hasOwnProperty('shape') &&
		!attributes.hasOwnProperty('curve_shape')) {
		
		distance = _round_distance(distance);
		
		if ((distance.length <= 0) ||
			((distance.unit != sys.distance_unit_type.dist_kilometers) && (distance.unit != sys.distance_unit_type.dist_miles))) {
			delete attributes.follow_this_road_text;
		}
		
		if (!attributes.follow_this_road_text)
			tts_array.push("بعد");	
		_format_distance(distance, attributes.follow_this_road_text);

		if (attributes.follow_this_road_text) {
			if (short_advice == SimpleAdvice.adv_straight_ahead) 
				return null;
			tts_array.push(short_advice == SimpleAdvice.adv_destination_reached ? "و" : "ثم");
		}
	} else {
		delete attributes.follow_this_road_text;
	}

	if (attributes.hasOwnProperty('curve_shape') && !advisor.on_ferry) {
		if ((attributes.curve_shape == RoadCurveShape.RoadCurve_Left) || 
			(attributes.curve_shape == RoadCurveShape.RoadCurve_AroundLeft))
			tts_array.push("بعد انعطاف الطريق نحو اليسار،");
			
		if ((attributes.curve_shape == RoadCurveShape.RoadCurve_Right) || 
			(attributes.curve_shape == RoadCurveShape.RoadCurve_AroundRight))
			tts_array.push("بعد انعطاف الطريق نحو اليمين،");
	}
	
	return {
		attributes: attributes,
		names: names
	};
}

function _maneuver_advice_to_text(advice, attributes, names) {
	var distance = advisor.distance;
	var short_advice = advice.get_int_property(advice_property.ap_short_advice);
	if (advisor.on_ferry) {
		tts_array.push("سوف ترسو العبارة");
		return;
	}
	if (advice.get_int_property(advice_property.ap_short_advice) == SimpleAdvice.adv_destination_reached) {
		if ((distance.length > 0) || (distance.mile_part != sys.mile_part.mp_none))
			tts_array.push(advisor.last_subtrip ? "سوف تصل إلى وجهتك" : "سوف تصل إلى وجهتك المتوسطة");
		return;
	}
	if (advice.get_int_property(advice_property.ap_short_advice) == SimpleAdvice.adv_take_ferry) {
		tts_array.push("استقل العبارة");
		if (names.location_name && names.location_name.length)
			tts_array.push(names.location_name);
		if (names.entry_road_name && names.entry_road_name.length &&
			names.exit_road_name && names.exit_road_name.length) {
			tts_array.push("من"); // from
			tts_array.push(names.entry_road_name); // entry name
			tts_array.push("إلى"); // to
			tts_array.push(names.exit_road_name); // exit name
		}
	}
	
	var res = _add_advice_prefix(advice, attributes, names);

	attributes = res.attributes;
	var has_word_at = res.has_word_at;
	var has_hw_advice = res.has_hw_advice;
	var man_text_added = res.man_text_added;
	
	if (!man_text_added) {
		if (short_advice == SimpleAdvice.adv_round_about_1)
			tts_array.push("اخرج من الطريق الملتو");
		else
			tts_array.push(_simple_advice_text(short_advice, advice.get_int_property(advice_property.ap_advice_road_side)));
	}
	
	if (advice.get_int_property(advice_property.ap_turnaround_shortcut))
		tts_array.push("للانعطاف للخلف");
	
	if (names.signpost_number && names.signpost_number.length) {
		delete attributes.hw_exit_count;
		tts_array.push("عند المخرج");
		tts_array.push(names.signpost_number);
		if (names.location_name && names.location_name.length)
			tts_array.push(names.location_name);
	}
	
	_add_names(advice, attributes, names, has_word_at);
	
	if (((distance.length != 0) || (distance.mile_part != sys.mile_part.mp_none)) && 
		(advice.get_int_array_property(advice_property.ap_lane_info).length > 0)) {
		_lane_info_text(advice);
	}

	var chained_advice = advice.get_int_property(advice_property.ap_chained_advice);
	if ((chained_advice != SimpleAdvice.adv_invalid) &&
		(!attributes.hasOwnProperty('follow_this_road_text'))) {
		if (short_advice == chained_advice) {
			tts_array.push("ثم");
		} else {
			if ((chained_advice != SimpleAdvice.adv_destination_reached) && 
				(short_advice != SimpleAdvice.adv_enter_round_about))
				tts_array.push("ثم");
			else
				tts_array.push("و");
		}		
		tts_array.push(_simple_advice_text(chained_advice, RelationToRoad.Rel2Road_None));
		if (short_advice == chained_advice)
			tts_array.push("مرة أخرى");
		if (chained_advice == SimpleAdvice.adv_destination_reached) return;
	}

	if (attributes.landmark_pos && attributes.landmark_pos == NearbyPoiRelation.Poi_AfterAdvice) {
		var landmark = attributes.landmark;
		var can_say = _can_say_confirmation(landmark.type);
		if (!can_say)
			return;
		tts_array.push("وسوف تمر على");
		tts_array.push(_poi_names[landmark.type]);
		
		if (landmark.road_side == RelationToRoad.Rel2Road_Left)
			tts_array.push("على يسارك");
		else if (landmark.road_side == RelationToRoad.Rel2Road_Right)
			tts_array.push("على يمينك");
	}
}

function _add_advice_prefix(advice, attributes, names) {
	var has_word_at = false;
	var has_hw_advice = false;
	var short_advice = advice.get_int_property(advice_property.ap_short_advice);
	
	if (attributes.hasOwnProperty('next_intersection')) {
		tts_array.push("عند تقاطع الطرق التالي");
		has_word_at = true;
	} else if (names.signpost_number && names.signpost_number.length) {
		has_word_at = true;
		has_hw_advice = true;
		delete attributes.hw_exit_count;
	} else if ((short_advice == SimpleAdvice.adv_take_highway_exit) && 
				(names.location_name && names.location_name.length)) {
		tts_array.push("عند تقاطع الطرق السريعة");
		tts_array.push(names.location_name);
		has_hw_advice = true;
		delete attributes.hw_exit_count;
	} else if (attributes.shape == IntersectionShape.IntersectionShape_T) {
		tts_array.push("عند نهاية الطريق");
		has_word_at = true;
	} else if (attributes.shape == IntersectionShape.IntersectionShape_Y) {
		tts_array.push("عند مفترق الطرق");
		has_word_at = true;
	}
	
	var man_text_added = false;
	if (advice.get_int_property(advice_property.ap_merge_on_highway) && 
	   (short_advice == SimpleAdvice.adv_straight_ahead))
		man_text_added = true;
	
	if (has_hw_advice)
		return {
			attributes: attributes,
			has_word_at: has_word_at,
			has_hw_advice: has_hw_advice,
			man_text_added: man_text_added
		};

	if (attributes.landmark_pos && attributes.landmark_pos == NearbyPoiRelation.Poi_BeforeAdvice) {
		var landmark = attributes.landmark;
		var can_say = _can_say_confirmation(landmark.type);
		if (can_say) {
			tts_array.push(_poi_names_after[landmark.type]);
		}
	} else if (attributes.landmark_pos && attributes.landmark_pos == NearbyPoiRelation.Poi_AtAdvice) {
		var landmark = attributes.landmark;
		var can_say = _can_say_confirmation(landmark.type);
		if (can_say) {
			tts_array.push(_poi_names_at[landmark.type]);
			has_word_na = 1;
		}
	} else if ((short_advice == SimpleAdvice.adv_left) && (attributes.hasOwnProperty('side_road_count'))) {
		tts_array.push("استقل اليسار");
		tts_array.push(_ordinal_string(attributes.side_road_count + 1));
		man_text_added = true;
	} else if ((short_advice == SimpleAdvice.adv_right) && (attributes.hasOwnProperty('side_road_count'))) {
		tts_array.push("استقل اليمين");
		tts_array.push(_ordinal_string(attributes.side_road_count + 1));
		man_text_added = true;
	} else if ((short_advice == SimpleAdvice.adv_left) && (attributes.hasOwnProperty('dense_road_count'))) {
		tts_array.push("استقل اليسار");
		tts_array.push(_ordinal_string(attributes.side_road_count + 1));
		man_text_added = true;
	} else if ((short_advice == SimpleAdvice.adv_right) && (attributes.hasOwnProperty('dense_road_count'))) {
		tts_array.push("استقل اليمين");
		tts_array.push(_ordinal_string(attributes.side_road_count + 1));
		man_text_added = true;
	}

	return {
			attributes: attributes,
			has_word_at: has_word_at,
			has_hw_advice: has_hw_advice,
			man_text_added: man_text_added
		};
}

function _add_names(advice, attributes, names, has_word_at) {
	var short_advice = advice.get_int_property(advice_property.ap_short_advice);
	
	if (advice.get_int_property(advice_property.ap_merge_on_highway)) {
		if (names.signpost && names.signpost.length) {
			tts_array.push("نحو");
			tts_array.push(names.signpost);
		}

		tts_array.push((short_advice == SimpleAdvice.adv_straight_ahead) ? "اندمج مع" : "واندمج مع");
		tts_array.push("الطريق السريع"); // highway
		if (names.exit_road_name && names.exit_road_name.length)		
			tts_array.push(names.exit_road_name);
		return;
	}
	
	if (names.signpost && names.signpost.length) {
		tts_array.push("نحو");
		tts_array.push(names.signpost);
	} else if (attributes.hasOwnProperty('hw_exit_count')) {
		tts_array.push("عند منحنى الطريق السريع");
		tts_array.push(_ordinal_string(attributes.hw_exit_count+1));
	} else if ((short_advice != SimpleAdvice.adv_straight_ahead) && (short_advice != SimpleAdvice.adv_turn_around)) {
		if (names.entry_road_name && names.exit_road_name && names.exit_road_name.length && (names.entry_road_name == names.exit_road_name)) {
			tts_array.push("للبقاء على طريق");
			tts_array.push(names.exit_road_name);
		} else if (names.exit_road_name && names.exit_road_name.length) {
			tts_array.push("على");
			tts_array.push(names.exit_road_name);
		}
	} else if (short_advice == SimpleAdvice.adv_straight_ahead) {
		if (names.entry_road_name && names.exit_road_name && names.exit_road_name.length && (names.entry_road_name == names.exit_road_name)) {
			tts_array.push("للبقاء على طريق");
			tts_array.push(names.exit_road_name);
		} else if (names.exit_road_name && names.exit_road_name.length) {
			tts_array.push("على");		
			tts_array.push(names.exit_road_name);
		}
	} else if (short_advice == SimpleAdvice.adv_turn_around &&
			   names.location_name && names.location_name.length && !has_word_at) {
			tts_array.push("على طريق");
			tts_array.push(names.location_name);	
		}
}

function _confirmation_advice_to_text(advice) {
	var landmark = advice.get_landmark_property(advice_property.ap_landmark);  
	var description = _get_poi_description(landmark.type, landmark.brand_name);
	if (description.length == 0)
		return;
	
	tts_array.push("سوف تمر على"); // you will pass 
	tts_array.push(description);   // description
	if (landmark.road_side == RelationToRoad.Rel2Road_Left)
		tts_array.push("على يسارك");
	else if (landmark.road_side == RelationToRoad.Rel2Road_Right)
		tts_array.push("على يمينك");
}

function _can_say_confirmation(poi_type) {
	if (!_poi_names.hasOwnProperty(poi_type))
		poi_type = poi_type - (poi_type % 10);
	if (!_poi_names.hasOwnProperty(poi_type))
		return false;
	return true;
}

function _round_distance(distance) {
	var rounded_distance = {
		unit: distance.unit,
		length: distance.length,
		mile_part: (distance.unit == sys.distance_unit_type.dist_miles) ? distance.mile_part : 0,
		after_dot: (distance.unit == sys.distance_unit_type.dist_kilometers) ? distance.after_dot : 0
	};
	
	if ((rounded_distance.length > 19500) && 
		(rounded_distance.unit != sys.distance_unit_type.dist_kilometers) && 
		(rounded_distance.unit != sys.distance_unit_type.dist_miles)) {
		rounded_distance.length = 10000*(((rounded_distance.length + 5000)/10000)|0);
		rounded_distance.after_dot = 0;
		rounded_distance.mile_part = sys.mile_part.mp_none;
		return rounded_distance;
	}
	
	if (rounded_distance.length > 950) {
		rounded_distance.length = 1000*(((rounded_distance.length + 500)/1000)|0);
		rounded_distance.after_dot = 0;
		rounded_distance.mile_part = sys.mile_part.mp_none;
		return rounded_distance;
	}
	
	if ((rounded_distance.length > 95) && 
		(rounded_distance.unit != sys.distance_unit_type.dist_kilometers) && 
		(rounded_distance.unit != sys.distance_unit_type.dist_miles)) {
		rounded_distance.length = 100*(((rounded_distance.length + 50)/100)|0);
		rounded_distance.after_dot = 0;
		rounded_distance.mile_part = sys.mile_part.mp_none;
		return rounded_distance;
	}
	
	if(rounded_distance.length > 20){
		rounded_distance.length = 10*(((rounded_distance.length + 5)/10)|0);
		rounded_distance.after_dot = 0;
		rounded_distance.mile_part = sys.mile_part.mp_none;
	}
	
	return rounded_distance;
}

function _format_mile_part_distance(mile_part) {
	switch(mile_part){
		case sys.mile_part.mp_1_8:
			return "ثمن ميل";
		case sys.mile_part.mp_1_4:
			return "ربع ميل";
		case sys.mile_part.mp_1_3:
			return "ثلث ميل";
		case sys.mile_part.mp_1_2:
			return "نصف ميل";
		case sys.mile_part.mp_2_3:
			return "ثلثي ميل";
		case sys.mile_part.mp_3_4:
			return "ثلاثة أرباع ميل";
	}
}

function _get_miles(miles) {
	return (miles <= 2 || miles >= 11) ? "ميل" : "أميال";
}

function _format_distance(distance, drive_long_text) {
	if ((distance.length == 0) && 
		(distance.unit == sys.distance_unit_type.dist_miles)) {
		return tts_array.push(_format_mile_part_distance(distance.mile_part));
	}

	if (drive_long_text)
		tts_array.push(advisor.on_highway ? "اتبع هذا الطريق السريع مسافة" : "اتبع هذا الطريق مسافة");

	// if unit is kilometer and there is a fraction
	var len = "";
	len += distance.length;
	len += (distance.unit == sys.distance_unit_type.dist_kilometers && distance.after_dot > 0) ? ("." + distance.after_dot) : "";
	tts_array.push(len);

	switch (distance.unit) {
		case sys.distance_unit_type.dist_meters:
			tts_array.push("متر");
			break;
		case sys.distance_unit_type.dist_feet:
			tts_array.push("قدم");
			break;
		case sys.distance_unit_type.dist_yards:
			tts_array.push("ياردة");
			break;
		case sys.distance_unit_type.dist_miles:
			tts_array.push(_get_miles(len));
			switch(distance.mile_part) {
				case sys.mile_part.mp_none:
					break;
				default:
					tts_array.push("و");
					tts_array.push(_format_mile_part_distance(distance.mile_part));
					break;
			}
			break;

		case sys.distance_unit_type.dist_kilometers:
			tts_array.push("كيلومتر");
			break;
	}   
}

function _simple_advice_text(simple_advice, hw_exit_side) {
	switch (simple_advice) {
		case SimpleAdvice.adv_sharp_right:          return "استدر إلى أقصى اليمين";
		case SimpleAdvice.adv_right:                return "استدر إلى اليمين";
		case SimpleAdvice.adv_bear_right:           return "انعطف نحو اليمين";
		case SimpleAdvice.adv_straight_ahead:       return "واصل إلى الأمام مباشرة";
		case SimpleAdvice.adv_bear_left:            return "انعطف نحو اليسار";
		case SimpleAdvice.adv_left:                 return "استدر إلى اليسار";
		case SimpleAdvice.adv_sharp_left:           return "استدر إلى أقصى اليسار";
		case SimpleAdvice.adv_turn_around:          return "انعطف إلى الخلف";
		case SimpleAdvice.adv_enter_round_about:    return "ادخل إلى الطريق الملتو";
		case SimpleAdvice.adv_round_about_1:        return "استقل المخرج الأول";
		case SimpleAdvice.adv_round_about_2:        return "استقل المخرج الثاني";
		case SimpleAdvice.adv_round_about_3:        return "استقل المخرج الثالث";
		case SimpleAdvice.adv_round_about_4:        return "استقل المخرج الرابع";
		case SimpleAdvice.adv_round_about_5:        return "استقل المخرج الخامس";
		case SimpleAdvice.adv_round_about_6:        return "استقل المخرج السادس";
		case SimpleAdvice.adv_round_about_7:        return "استقل المخرج السابع";
		case SimpleAdvice.adv_round_about_8:        return "استقل المخرج الثامن";
		case SimpleAdvice.adv_take_highway_exit:    
			if (hw_exit_side == RelationToRoad.Rel2Road_Left)
				return "اخرج من الطريق السريع على اليسار";	
			if (hw_exit_side == RelationToRoad.Rel2Road_Right)
				return "اخرج من الطريق السريع على اليمين";
			return "اخرج من الطريق السريع";
		case SimpleAdvice.adv_destination_reached:  return advisor.last_subtrip ? "سوف تصل إلى وجهتك" : "سوف تصل إلى وجهتك المتوسطة";
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

function _ordinal_string(ordinal_num) {
	switch(ordinal_num) {
		case 1: return "التالي";
		case 2: return "الثاني";
		case 3: return "الثالث";
		case 4: return "الرابع";
		case 5: return "الخامس";
		case 6: return "السادس";
		case 7: return "السابع";
		case 8: return "الثامن";
	}
	return "";
}

function _get_speak_names(advice) {
	var speak_names = [];
	
	var has_phonetics = advisor.has_phonetics;
	
	speak_names.entry_road_name = !has_phonetics ? "" : advice.get_string_property(advice_property.ap_entry_road_name_ph);
	if (speak_names.entry_road_name.length == 0 ) {
		speak_names.entry_road_name = advice.get_string_property(advice_property.ap_entry_road_name);
		if ((speak_names.entry_road_name.length > 0) && has_phonetics)
			speak_names.entry_road_name = "\u001B\\tn=address\\" + speak_names.entry_road_name + "\u001B\\tn=normal\\";
	}
	else
		speak_names.entry_road_name = "\u001B/+" + speak_names.entry_road_name + "\u001B/+";
		
	speak_names.exit_road_name = !has_phonetics ? "" : advice.get_string_property(advice_property.ap_exit_road_name_ph);
	if (speak_names.exit_road_name.length == 0) {
		speak_names.exit_road_name = advice.get_string_property(advice_property.ap_exit_road_name);
		if ((speak_names.exit_road_name.length > 0) && has_phonetics)
			speak_names.exit_road_name = "\u001B\\tn=address\\" + speak_names.exit_road_name + "\u001B\\tn=normal\\";
	}
	else 
		speak_names.exit_road_name = "\u001B/+" + speak_names.exit_road_name + "\u001B/+";

	speak_names.location_name = !has_phonetics ? "" : advice.get_string_property(advice_property.ap_location_name_ph);
	if (speak_names.location_name.length == 0) {
		speak_names.location_name = advice.get_string_property(advice_property.ap_location_name);
		if ((speak_names.location_name.length > 0) && has_phonetics)
			speak_names.location_name = "\u001B\\tn=address\\" + speak_names.location_name + "\u001B\\tn=normal\\";
	}
	else 
		speak_names.location_name = "\u001B/+" + speak_names.location_name + "\u001B/+"; 
				
	speak_names.signpost_number = advice.get_string_property(advice_property.ap_signpost_number);

	speak_names.signpost = !has_phonetics ? "" : advice.get_string_property(advice_property.ap_signpost_ph);
	if (speak_names.signpost.length == 0) {
		speak_names.signpost = advice.get_string_property(advice_property.ap_signpost);
		if ((speak_names.signpost.length > 0) && has_phonetics)
			speak_names.signpost = "\u001B\\tn=address\\" + speak_names.signpost + "\u001B\\tn=normal\\";
	}
	else
		speak_names.signpost = "\u001B/+" + speak_names.signpost + "\u001B/+";
	
	return speak_names;
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
		return;

	tts_array.push("باستخدام"); // using

	for (i = 1; i < lanes; i++) {
		l = _advice_lane(advice, i) >> 9;
		if (l > lmax) lmax = l;
		if (l < lmin) lmin = l;
	}
	
	if ((lmin == (_lane_count - lmax - 1)) &&
		((lmax - lmin + 1) == lanes)) {
		if (lmin == lmax)
			tts_array.push("الحارة الوسطى"); // the middle lane
		else {
			tts_array.push("إحدى الحارات المتوسطة الـ");
			tts_array.push(lmax - lmin + 1); // number of lanes
		}
		return;
	}

	if (lmax + 1 - lmin == lanes) {
		// connected
		if (lmax == _lane_count-1) {
			if (lanes == 1) { // left
				tts_array.push("الحارة الموجودة في أقصى اليسار");
			} else {
				tts_array.push("إحدى الحارات الموجودة في أقصى اليسار الـ");
				tts_array.push(lanes);
			}
		} else if (lmin == 0) {
			if (lanes == 1) { // right
				tts_array.push("الحارة الموجودة في أقصى اليمين");
			} else {
				tts_array.push("إحدى الحارات الموجودة في أقصى اليمين الـ");
				tts_array.push(lanes);
			}
		} else {
			lmin = _lane_num(lmin);
			lmax = _lane_num(lmax);
			if (lmin == lmax) {
				tts_array.push("الحارة"); // za lane #n
				tts_array.push(lmin);
			} else {			
				if (lanes <= 2) {
					tts_array.push("الحارات"); // lane part
					tts_array.push(lmin < lmax ? lmin : lmax); // lmin
					tts_array.push("أو"); // or
					tts_array.push(lmax > lmin ? lmax : lmin); // lmax
				}
				else {
					tts_array.push("الحارتين"); // lanes
					tts_array.push(lmin < lmax ? lmin : lmax); // lmin
					tts_array.push("إلى"); // to
					tts_array.push(lmax > lmin ? lmax : lmin); // lmax
				}
			}
		}
	} else {
		// disconnected
		tts_array.push("الحارات"); // lanes
		if (_left_road_country) {
			for (i = lanes - 1; i >= 0; i--) {
				if ((i == 0) && (i < lanes - 1)) {
					tts_array.push("أو"); // or
				}
				else if (i > 0) {
					tts_array.push("،"); // comma
				}
				l = _advice_lane(advice, i) >> 9;
				tts_array.push(lanes - l);
			}
		} else {
			for (i = 0; i < lanes; i++) {
				if ((i == lanes - 1) && (i > 0)) {
					tts_array.push("أو"); // or
				}
				else if (i > 0) {
					tts_array.push("،"); // comma
				}
				l = _advice_lane(advice, i) >> 9;
				tts_array.push(l);
			}
		}
	}
}

(function() {
	advisor.advice_to_text = _advice_to_text;
	advisor.route_missed_text = _route_missed_text;
	advisor.heading_to_text = _heading_to_text;
	advisor.destination_reached = _destination_reached;
	advisor.can_say_confirmation = function(geoTypeId) { 
		var desc = _get_poi_description(geoTypeId, null);
		return (desc.length > 0); 
	}
})();
