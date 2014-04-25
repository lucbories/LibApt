/**
 * @file        libapt-runtime-introspect-classes.js
 * @desc        Libapt static runtime features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/* ---------------------------------------------- CLASSES ---------------------------------------------- */

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The introspection classes model
 */
Libapt.runtime_classes_model = null;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The introspection classes table view
 */
Libapt.runtime_classes_table_view = null;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The name of the introspection classes model
 */
Libapt.runtime_classes_model_name = 'MODEL_RUNTIME_CLASSES';


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		The name of the introspection classes table view
 */
Libapt.runtime_classes_view_table_name = 'VIEW_RUNTIME_CLASSES_TABLE';



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_runtime_classes_model_name()
 * @desc				Get the name of the introspection classes model
 * @return {string}		Model name
 */
Libapt.get_runtime_classes_model_name = function()
{
	return Libapt.runtime_classes_model_name;
}



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_classes_model_name()
 * @desc				Get the name of the introspection classes model
 * @return {string}		Model name
 */
Libapt.get_runtime_classes_model = function()
{
	// CHECK IF THE MODEL EXISTS
	if ( Libapt.is_object(Libapt.runtime_classes_model) )
	{
		return Libapt.runtime_classes_model;
	}
		
	// INIT MODEL ATTRIBUTES
	var source				= 'array',
		field_class_name	= new LibaptField('name',			Libapt.runtime_classes_model_name, 'model', 'String', null, null, 'Class name', true, false, false, false, null, null, null, null),
		field_class_parents	= new LibaptField('parents_array',	Libapt.runtime_classes_model_name, 'model', 'String', null, null, 'Inherits from', true, false, false, false, null, null, null, null),
		field_class_author	= new LibaptField('author',			Libapt.runtime_classes_model_name, 'model', 'String', null, null, 'Author', true, false, false, false, null, null, null, null),
		field_class_updated	= new LibaptField('updated',		Libapt.runtime_classes_model_name, 'model', 'String', null, null, 'Last update', true, false, false, false, null, null, null, null),
		field_class_desc	= new LibaptField('description',	Libapt.runtime_classes_model_name, 'model', 'String', null, null, 'Description', true, false, false, false, null, null, null, null),
		fields				= [field_class_name,field_class_parents,field_class_author,field_class_updated,field_class_desc],
		// fields			= [field_class_name,field_class_author,field_class_updated,field_class_desc],
		accesses			= {create:false,read:true,update:false,'delete':false},
		options				= null;
	
	// CREATE MODEL
	Libapt.runtime_classes_model = new LibaptModel(Libapt.runtime_classes_model_name, source, fields, accesses, options);
	
	// SET DATAS
	Libapt.runtime_classes_model.engine.set_datas_array( Libapt.get_classes_array() );
	
	return Libapt.runtime_classes_model;
}



/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.get_classes_model_name()
 * @desc				Get the name of the introspection classes model
 * @return {string}		Model name
 */
Libapt.get_runtime_classes_view_table = function()
{
	// CHECK IF THE VIEW EXISTS
	if ( Libapt.is_object(Libapt.runtime_classes_view_table) )
	{
		return Libapt.runtime_classes_view_table;
	}
	
	// CREATE MODEL
	LibaptModels.add( Libapt.get_runtime_classes_model() );
	
	// INIT VIEW
	Libapt.use('apps-views');
	Libapt.use('apps-views-factory');
	
	// CREATE VIEW
	var options =
		{
			class_name:'LibaptTable',
			name:Libapt.runtime_classes_view_table_name,
			label:'Registered classes',
			parent_view_name:'',
			tooltip:null,
			
			is_resizable:false,
			is_visible:true,
			is_editable:false,
			is_portlet:false,
			has_hscrollbar:false,
			has_vscrollbar:false,
			
			html_id:Libapt.runtime_classes_view_table_name + '_id',
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
			
			model_name:Libapt.runtime_classes_model_name,
			// query_fields:['name'],
			query_filters:null,
			query_orders:'name=ASC',
			query_groups:null,
			query_slice:{offset:0,length:20000}
		};
	LibaptViews.create(options);
	Libapt.runtime_classes_view_table = LibaptViews.get(Libapt.runtime_classes_view_table_name);
	
	LibaptViews.add(Libapt.runtime_classes_view_table);
	
	return Libapt.runtime_classes_view_table;
}
