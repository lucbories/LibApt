/**
 * @file        libapt-runtime-introspect-options.js
 * @desc        Libapt static runtime features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/* ---------------------------------------------- CLASSES OPTIONS ---------------------------------------------- */

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The introspection classes options model
 */
Libapt.runtime_classes_options_model = null;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The introspection classes options table view
 */
Libapt.runtime_classes_options_table_view = null;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The name of the introspection classes options model
 */
Libapt.runtime_classes_options_model_name = 'MODEL_RUNTIME_CLASSES_OPTIONS';


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The name of the introspection classes options table view
 */
Libapt.runtime_classes_options_view_table_name = 'VIEW_RUNTIME_CLASSES_OPTIONS_TABLE';



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_runtime_classes_options_model_name()
 * @desc				Get the name of the introspection classes options model
 * @return {string}		Model name
 */
Libapt.get_runtime_classes_options_model_name = function()
{
	return Libapt.runtime_classes_options_model_name;
}



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_classes_model_name()
 * @desc				Get the name of the introspection classes options model
 * @return {string}		Model name
 */
Libapt.get_runtime_classes_options_model = function()
{
	// CHECK IF THE MODEL EXISTS
	if ( Libapt.is_object(Libapt.runtime_classes_options_model) )
	{
		return Libapt.runtime_classes_options_model;
	}
	
	
	// INIT MODEL ATTRIBUTES
	var source				= 'array',
		
		field_class_name	= new LibaptField('class_name',		Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Class name',			true, false, false, false, null, null, null, null),
		field_name			= new LibaptField('name',			Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Option name',		true, false, false, false, null, null, null, null),
		field_type			= new LibaptField('type',			Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Option type',		true, false, false, false, null, null, null, null),
		field_aliases		= new LibaptField('aliases',		Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Option aliases',		true, false, false, false, null, null, null, null),
		field_default		= new LibaptField('default_value',	Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Default value',		true, false, false, false, null, null, null, null),
		field_array_sep		= new LibaptField('array_separator',Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Array separator',	true, false, false, false, null, null, null, null),
		field_array_type	= new LibaptField('array_type',		Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Array items type',	true, false, false, false, null, null, null, null),
		field_format		= new LibaptField('format',			Libapt.runtime_classes_options_model_name, 'model', 'String',	'', null, 'Value format',		true, false, false, false, null, null, null, null),
		field_is_required	= new LibaptField('is_required',	Libapt.runtime_classes_options_model_name, 'model', 'Boolean',	'', null, 'Is required?',		true, false, false, false, null, null, null, null),
		// field_childs		= new LibaptField('childs',			Libapt.runtime_classes_options_model_name, 'model', 'String', '', null, 'Option childs', true, false, false, false, null, null, null, null),
		
		fields		= [field_class_name, field_name, field_type, field_aliases, field_default, field_array_sep, field_array_type, field_format, field_is_required],
		accesses	= {create:false,read:true,update:false,'delete':false},
		options		= null;
	
	// CREATE MODEL
	Libapt.runtime_classes_options_model = new LibaptModel(Libapt.runtime_classes_options_model_name, source, fields, accesses, options);
	
	// SET DATAS
	Libapt.runtime_classes_options_model.engine.get_records_cb = function(datas)
		{
			var records = [];
			
			for(class_name in datas)
			{
				var class_options = datas[class_name];
				
				for(option_name in class_options)
				{
					var option_record = class_options[option_name];
					
					option_record['class_name'] = class_name;
					records.push(option_record);
				}
			}
			return records;
		};
	Libapt.runtime_classes_options_model.engine.set_datas_array( Libapt.options );
	
	return Libapt.runtime_classes_options_model;
}



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_classes_model_name()
 * @desc				Get the name of the introspection classes options model
 * @return {string}		Model name
 */
Libapt.get_runtime_classes_options_view_table = function()
{
	// CHECK IF THE VIEW EXISTS
	if ( Libapt.is_object(Libapt.runtime_classes_options_view_table) )
	{
		return Libapt.runtime_classes_options_view_table;
	}
	
	// CREATE MODEL
	LibaptModels.add( Libapt.get_runtime_classes_options_model() );
	
	// INIT VIEW
	Libapt.use('apps-views');
	Libapt.use('apps-views-factory');
	
	// CREATE VIEW
	var options =
		{
			class_name:'LibaptTable',
			name:Libapt.runtime_classes_options_view_table_name,
			label:'Registered classes options',
			tooltip:null,
			parent_view_name:'',
			
			is_resizable:false,
			is_visible:true,
			is_editable:false,
			is_portlet:false,
			has_hscrollbar:false,
			has_vscrollbar:false,
			
			html_id:Libapt.runtime_classes_options_view_table_name + '_id',
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
			
			model_name:Libapt.runtime_classes_options_model_name,
			// query_fields:['class_name'],
			query_filters:null,
			query_orders:'class_name=ASC',
			query_groups:null,
			query_slice:{offset:0,length:20000}
		};
	LibaptViews.create(options);
	Libapt.runtime_classes_options_view_table = LibaptViews.get(Libapt.runtime_classes_options_view_table_name);
	
	LibaptViews.add(Libapt.runtime_classes_options_view_table);
	
	return Libapt.runtime_classes_options_view_table;
}
