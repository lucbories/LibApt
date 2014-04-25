/**
 * @file        libapt-flot.js
 * @desc       Flot class
 * @details     ...
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


 
/**
 * @desc				Flot wrapper class
 * @param {string}		arg_name			Flot name (string)
 * @param {object}		arg_jqo				JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptFlot(arg_name, arg_jqo, arg_options)
{
	var self = this;
	
	// SET FIXED OPTIONS
	if ( ! Libapt.is_object(arg_options) )
	{
		arg_options = {};
	}
	arg_options.has_pager = false;
	
	// INHERIT
	this.inheritFrom = LibaptModelView;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptFlot';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// FLOT ATTRIBUTES
	
	// INIT OPTIONS
	// Libapt.options_set_trace = true;
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	// Libapt.options_set_trace = false;
	// console.log(self);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	/**
	 * @desc		Draw selector
	 * @param {}	arg_values_record	Record of values as an associative array (object)
	 * @return {boolean}				true:success,false:failure
	 */
	this.draw = function(arg_values_record)
	{
		var self = this;
		var context = 'draw(record)';
		this.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-begin');
		
		// DRAW TITLE BAR
		self.draw_title_bar();
		
		// DRAW CONTENT
		self.adjust_sizes();
		
		// INIT VIEW CONTENT
		this.content_jqo		= $('<div>');
		this.container_jqo.append(this.content_jqo);
		
		// FILL THE GRID ON LOAD IF NEEDED
		if (self.fill_on_load)
		{
			// DATAS ARE ALREADY LOADED
			var records = self.get_datas();
			if ( Libapt.is_array(records) )
			{
				self.draw_records(records);
				self.leave(context, '');
				return true;
			}
			
			// LOAD CURRENT PAGE DATAS
			var ok_cb = [self, self.draw_records];
			var ko_cb = null;
			var bool_result = self.load_datas(self.model, self.query, null, null, null, ok_cb, ko_cb, true);
			self.assert(context, 'read', bool_result);
		}
		
		// FIRE EVENT (END)
		self.fire_event('draw-end');
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method				draw_records()
	 * @desc				Draw the table body with given records
	 * @param {array}		Table records
	 * @return {object}		This
	 */
	this.draw_records = function(arg_records)
	{
		var self = this;
		var context = 'draw_records(records)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assertArray(context, 'datas_records', arg_records);
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-records-begin');
		
		
		// INIT SERIES ARRAY
		var series_count	= Math.min(self.axis_x_fields.length, self.axis_y_fields.length);
		var series_datas	= [];
		var series_x_min	= [];
		var series_x_max	= [];
		var series_y_min	= [];
		var series_y_max	= [];
		var x_min			= 0;
		var x_max			= 0;
		var y_min			= 1;
		var y_max			= 1;
		for(var series_index = 0 ; series_index < series_count ; series_index++)
		{
			series_datas.push([]);
			series_x_min.push(0);
			series_x_max.push(1);
			series_y_min.push(0);
			series_y_max.push(1);
		}
		
		
		// TODO WHY ???
		arg_records = arg_records[0];
		
		
		// FILL RECORDS INTO SERIES ARRAY
		for(var record_index = 0 ; record_index < arg_records.length ; record_index++)
		{
			var record = arg_records[record_index];
			self.assertNotNull(context, 'record[' + record_index + ']', record);
			
			for(var series_index = 0 ; series_index < series_count ; series_index++)
			{
				var x_field_name = self.axis_x_fields[series_index];
				var y_field_name = self.axis_y_fields[series_index];
				
				var x_value = record[x_field_name];
				var y_value = record[y_field_name];
				x_value = Date.parse(x_value);
				var xy_values = [x_value, y_value];
				// console.log(series_index + ':' + xy_values);
				
				var serie_y_min = series_y_min[series_index];
				series_y_min[series_index] = Math.min(serie_y_min, y_value);
				
				var serie_y_max = series_y_max[series_index];
				series_y_max[series_index] = Math.max(serie_y_max, y_value);
				
				y_min	= Math.min(series_y_min[series_index], y_min);
				y_max	= Math.max(series_y_max[series_index], y_max);
				
				var serie_x_min = series_x_min[series_index];
				series_x_min[series_index] = Math.min(serie_x_min, x_value);
				
				var serie_x_max = series_x_max[series_index];
				series_x_max[series_index] = Math.max(serie_x_max, x_value);
				
				x_min	= Math.min(series_x_min[series_index], x_min);
				x_max	= Math.max(series_x_max[series_index], x_max);
				
				var current_series_datas = series_datas[series_index];
				current_series_datas.push(xy_values);
			}
		}
		// console.log(series_datas);
		
		// INIT FLOT OPTIONS
		var flot_options =
			{
				title: self.label,
				// xaxis: { min:x_min, max:x_max },
				xaxis: { mode:'time', timeformat:'%y-%m-%d' },
				yaxis: { min:y_min, max:y_max },
				legend: 'always',
				showRoller: true,
			  // rollPeriod: 14,
			  // customBars: true,
			  xlabel: 'Dates',
			  ylabel: 'Count'
			};
		// console.log(flot_options);
		
		// CREATE FLOT OBJECT
		this.content_jqo.height(300);
		this.content_jqo.width(400);
		
		$.plot(
			this.content_jqo,
			series_datas,
			flot_options
		);
		// this.content_jqo.show();
		
		// ADJUST TABLE SIZE
		self.adjust_sizes();
		
		// FIRE EVENT (END)
		self.fire_event('draw-records-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptFlot, ['LibaptModelView'], 'Luc BORIES', '2013-08-21', 'Flot view class.');


// INTROSPECTION : REGISTER OPTIONS
// Libapt.register_str_option(LibaptFlot, 'axis_x_field',	null, true, []);
// Libapt.register_str_option(LibaptFlot, 'axis_y_field',	null, true, []);

Libapt.register_option(LibaptFlot, {
		name: 'axis_x_fields',
		type: 'Array',
		aliases: [],
		default_value: [],
		array_separator: ',',
		array_type: 'String',
		format: '',
		is_required: true,
		childs: {}
	}
);

Libapt.register_option(LibaptFlot, {
		name: 'axis_y_fields',
		type: 'Array',
		aliases: [],
		default_value: [],
		array_separator: ',',
		array_type: 'String',
		format: '',
		is_required: true,
		childs: {}
	}
);

