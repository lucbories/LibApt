/**
 * @file        libapt-pivot-grid-time.js
 * @desc        Pivot grid with time axis class
 * @see			libapt-pivot-grid.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-09-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @class				LibaptPivotGridTime
 * @desc				Pivot grid with time axis class
 * @param {string}		arg_name			View name (string)
 * @param {object}		arg_container_obj	JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptPivotGridTime(arg_name, arg_jqo, arg_options)
{
	var self = this;
	
	// INHERIT
	this.inheritFrom = LibaptPivotGrid;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace					= true;
	this.class_name				= 'LibaptPivotGridTime';
	var context					= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	// TIME PIVOT ATTRIBUTES
	self.is_h_axis_time					= true;
	self.is_v_axis_time					= false;
	
	self.time_axis_year_field_obj		= null;
	self.time_axis_quarter_field_obj	= null;
	self.time_axis_month_field_obj		= null;
	self.time_axis_week_field_obj		= null;
	self.time_axis_doy_field_obj		= null;
	self.time_axis_dom_field_obj		= null;
	self.time_axis_dow_field_obj		= null;
	self.time_axis_hour_field_obj		= null;
	self.time_axis_minute_field_obj		= null;
	self.time_axis_datetime_field_obj	= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @desc					Edit view settings
	 * @return {boolean}		true:success,false:failure
	 */
	this.edit_settings = function()
	{
		var context = 'edit_settings()';
		this.enter(context, '');
		
		
		// SETTINGS CONTAINER
		var container_jqo = $('<div></div>');
		
		// CREATE SETTINGS EDITOR VIEW
		var grid_editor_options = { has_haxis:false, has_vaxis:true };
		var grid_editor = new LibaptPivotGridTimeEditor(this.name + '_grid_editor', container_jqo, grid_editor_options);
		grid_editor.model_view = this;
		
		// EDIT GRID SETTINGS
		grid_editor.draw();
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return this.to_string_value('model.name', this.model.name)
			// + this.to_string_value('', this.)
			// + this.to_string_value('pivot_cells.length', this.pivot_cells.length)
			;
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptPivotGridTime, ['LibaptPivotGrid'], 'Luc BORIES', '2013-08-21', 'Pivot table model view class.');


// INTROSPECTION : REGISTER OPTIONS
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_datetime_field_name',null, true, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_year_field_name',	null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_quarter_field_name',	null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_month_field_name',	null, false, []);
// Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_week_field_name',	null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_doy_field_name',		null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_dom_field_name',		null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_dow_field_name',		null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_hour_field_name',	null, false, []);
Libapt.register_str_option(LibaptPivotGridTime, 'time_axis_minute_field_name',	null, false, []);

Libapt.register_date_option(LibaptPivotGridTime, 'time_axis_dates_first',		null, false, []);
Libapt.register_date_option(LibaptPivotGridTime, 'time_axis_dates_last',		null, false, []);

Libapt.register_time_option(LibaptPivotGridTime, 'time_axis_times_first',		'00:00:00', false, []);
Libapt.register_time_option(LibaptPivotGridTime, 'time_axis_times_last',		'24:00:00', false, []);

Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_datetimes',	false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_years',		true, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_quarters',	false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_months',	false, false, []);
// Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_weeks',		false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_doy',		false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_dom',		false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_dow',		false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_hours',		false, false, []);
Libapt.register_bool_option(LibaptPivotGridTime, 'time_axis_has_minutes',	false, false, []);
