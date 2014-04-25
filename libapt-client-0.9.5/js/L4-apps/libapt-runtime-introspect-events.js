/**
 * @file        libapt-runtime-events.js
 * @desc        Libapt static runtime features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The events model
 */
Libapt.runtime_events_model = null;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The events table view
 */
Libapt.runtime_events_table_view = null;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The name of the events model
 */
Libapt.runtime_events_model_name = 'MODEL_RUNTIME_EVENTS';


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The name of the events table view
 */
Libapt.runtime_events_view_table_name = 'VIEW_RUNTIME_EVENTS_TABLE';



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_runtime_events_model_name()
 * @desc				Get the name of the events model
 * @return {string}		Model name
 */
Libapt.get_runtime_events_model_name = function()
{
	return Libapt.runtime_events_model_name;
}



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_classes_model_name()
 * @desc				Get the name of the events model
 * @return {string}		Model name
 */
Libapt.get_runtime_events_model = function()
{
	// CHECK IF THE MODEL EXISTS
	if ( Libapt.is_object(Libapt.runtime_events_model) )
	{
		return Libapt.runtime_events_model;
	}
	
		
	// INIT MODEL ATTRIBUTES
	var source				= 'array',
		
		field_name			= new LibaptField('name',			Libapt.runtime_events_model_name, 'model', 'String',	'', null, 'Event name',			true, false, false, false, null, null, null, null),
		field_target		= new LibaptField('target_object',	Libapt.runtime_events_model_name, 'model', 'String',	'', null, 'Target object',		true, false, false, false, null, null, null, null),
		field_operands		= new LibaptField('operands_array',	Libapt.runtime_events_model_name, 'model', 'String',	'', null, 'Operands',			true, false, false, false, null, null, null, null),
		field_ts			= new LibaptField('fired_ts',		Libapt.runtime_events_model_name, 'model', 'String',	'', null, 'Timestamp',			true, false, false, false, null, null, null, null),
		
		fields		= [field_name, field_target, field_operands, field_ts],
		accesses	= {'create':false,'read':true,'update':false,'delete':false},
		options		= null;
	
	// CREATE MODEL
	Libapt.runtime_events_model = new LibaptModel(Libapt.runtime_events_model_name, source, fields, accesses, options);
	
	// SET DATAS
	Libapt.runtime_events_model.engine.get_records_cb = function(datas)
		{
			var records = [];
			
			for(data_key in datas)
			{
				var current_event			= datas[data_key];
				var current_event_target	= current_event.target_object;
				var current_event_opds		= current_event.operands_array;
				
				var event_record = new Object();
				event_record['name']			= current_event.name;
				event_record['target_object']	= current_event_target.class_name + ':' + current_event_target.name;
				event_record['operands_array']	= current_event_opds ? current_event_opds.length + ' operands' : 'no operands';
				event_record['fired_ts']		= current_event.fired_ts;
				
				records.push(event_record);
			}
			return records;
		};
	Libapt.runtime_events_model.engine.set_datas_array( LibaptEvents.all_events );
	
	return Libapt.runtime_events_model;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_runtime_events_view_table()
 * @desc				Get the events table view object
 * @return {object}		LibaptView object
 */
Libapt.get_runtime_events_view_table = function()
{
	// CHECK IF THE VIEW EXISTS
	if ( Libapt.is_object(Libapt.runtime_events_view_table) )
	{
		return Libapt.runtime_events_view_table;
	}
	
	// CREATE THE VIEW
	var view_name = Libapt.runtime_events_view_table_name;
	Libapt.runtime_events_view_table = Libapt.create_runtime_events_view_table(view_name);
	
	return Libapt.runtime_events_view_table;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.create_runtime_events_view_table(arg_view_name)
 * @desc				Create an events table view object
 * @param {string}		arg_view_name		The view unique name
 * @return {object}		LibaptView object
 */
Libapt.create_runtime_events_view_table = function(arg_view_name)
{
	// INIT VIEW
	Libapt.use('apps-views');
	Libapt.use('apps-views-factory');
	
	// CREATE VIEW
	var view_name = arg_view_name;
	var options =
		{
			class_name:'LibaptTable',
			name: view_name,
			label:'Fired events',
			tooltip:null,
			parent_view_name:'',
			
			is_resizable:false,
			is_visible:true,
			is_editable:false,
			is_portlet:false,
			has_hscrollbar:false,
			has_vscrollbar:false,
			
			html_id: view_name + '_id',
			css_styles:null,
			css_classes:null,
			
			js_on_ready:null,
			js_on_change:null,
			js_on_refresh:null,
			
			template_enabled:true,
			template_string:'{br}{b1c}{ec}{b9c}{this}{ec}{b1c}{ec}{er}',
			template_bindings:null,
			template_tags:null,
			template_file_name:null,
			
			js_on_read:null,
			js_on_create:null,
			js_on_update:null,
			js_on_delete:null,
			
			model_name:Libapt.runtime_events_model_name,
			// query_fields:[], VIEW ALL MODEL FIELDS
			query_filters:null,
			query_orders:'fired_ts=DESC',
			query_groups:null,
			query_slice:{offset:0,length:20000}
		};
	LibaptViews.create(options);
	var view_obj = LibaptViews.get(view_name);
	
	return view_obj;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.create_runtime_events_view_window()
 * @desc				Create and get a window for the events table view
 * @return {object}		LibaptView object
 */
Libapt.create_runtime_events_view_window = function()
{
	// CREATE MODEL
	LibaptModels.add( Libapt.get_runtime_events_model() );
	
	// CREATE TABLE VIEW
	var events_table_name	= 'events';
	var events_table		= Libapt.create_runtime_events_view_table(events_table_name);
	Libapt.set_option_value(events_table, 'has_hscrollbar', false, true, true);
	Libapt.set_option_value(events_table, 'has_vscrollbar', false, true, true);
	
	// CREATE WINDOW VIEW
	var add_event_cb = function(arg_event)
		{
			if (   arg_event
				&& arg_event.target_object.name != events_table.name
				&& arg_event.target_object.name != window_obj.name
				&& arg_event.target_object.name != events_table.model.name
				&& arg_event.target_object.name != events_table.pager.name)
			{
				// console.log(arg_event.target_object);
				events_table.refresh();
			}
		};
	var window_name			= LibaptWindows.get_unique_name(events_table.name + '_window');
	var window_close_cb		= function ()
		{
			// DETTACH ALL EVENTS
			LibaptEvents.remove_callback_on_add(add_event_cb);
		};
	var window_options		= { 'format':'window_close', 'close_cb':window_close_cb };
	var window_content_jqo	= events_table.container_jqo;
	var window_obj			= new LibaptWindow(window_name, window_content_jqo, window_options);
	window_obj.content_childs_jqo.push(events_table);
	
	// DRAW WINDOW
	events_table.draw();
	window_obj.draw();
	
	// ATTACH ALL EVENTS
	LibaptEvents.append_callback_on_add(add_event_cb);
	
	return window_obj;
}