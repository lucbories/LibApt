/**
 * @file        libapt-dygraph.js
 * @desc       Dygraph class
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
 * @desc				Dygraph wrapper class
 * @param {string}		arg_name			Dygraph name (string)
 * @param {object}		arg_jqo				JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptDygraph(arg_name, arg_jqo, arg_options)
{
	// SET FIXED OPTIONS
	if ( Libapt.is_object(arg_options) )
	{
		arg_options.has_pager = false;
	}
	
	// INHERIT
	this.inheritFrom = LibaptModelView;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptDygraph';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// DYGRAPH ATTRIBUTES
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	
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
		
		// INIT CSV STRING WITH HEADERS
		var csv_eol		= '\n';
		var csv_fs		= ',';
		var csv_string	= '';
		var csv_labels	= '';
		var fields_count = self.query.fields_set.fields.length;
		for(var field_index = 0 ; field_index < fields_count ; field_index++)
		{
			csv_string += self.query.fields_set.fields[field_index].label;
			
			if (field_index == fields_count - 1)
			{
				csv_string += csv_eol;
			}
			else
			{
				csv_string += csv_fs;
			}
		}
		
		// FILL RECORDS INTO CSV STRING
		
		
		// TODO : WHY ???
		// console.log(arg_records);
		arg_records = arg_records[0];
		
		
		
		for(var record_index = 0 ; record_index < arg_records.length ; record_index++)
		{
			var record = arg_records[record_index];
			self.assertNotNull(context, 'record[' + record_index + ']', record);
			
			for(var field_index = 0 ; field_index < fields_count ; field_index++)
			{
				var loop_field_name 	= self.query.fields_set.fields[field_index].name;
				var loop_field_default 	= self.query.fields_set.fields[field_index].default_value;
				var loop_field_value	= record[loop_field_name];
				
				csv_string += Libapt.is_null(loop_field_value) ? loop_field_default : loop_field_value;
				
				if (field_index == fields_count - 1)
				{
					csv_string += csv_eol;
				}
				else
				{
					csv_string += csv_fs;
				}
			}
		}
		
		
		// INIT DYGRAPH OPTIONS
		var dygraph_options = null;
/*			{
			  legend: 'always',
			  title: 'NYC vs. SF',
			  showRoller: true,
			  rollPeriod: 14,
			  customBars: true,
			  ylabel: 'Temperature (F)'
			};*/
		
		// CREATE DYGRAPH OBJECT
		var div_tag = this.content_jqo[0];
		// console.log(this);
		new Dygraph(
			div_tag,
			csv_string/*,
			dygraph_options*/
		);
		this.content_jqo.show();
		
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
Libapt.register_class(LibaptDygraph, ['LibaptModelView'], 'Luc BORIES', '2013-08-21', 'Dygraoh view class.');


// INTROSPECTION : REGISTER OPTIONS
// Libapt.register_str_option(LibaptDygraph, 'xxx',	null, true, []);

