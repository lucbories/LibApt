/**
 * @file        libapt-group.js
 * @brief       Query group class
 * @details     
 * @see			libapt-query.js libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_CORE
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Query group class
 * @param[in]	arg_field			field
 */
function LibaptGroup(arg_field)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_field.name, false);
	
	// CONSTRUCTOR BEGIN
	this.class_name		= 'LibaptGroup';
	var context = this.class_name + '(' + arg_field.name + ')';
	this.enter(context, 'constructor');
	
	
	// FILTER ATTRIBUTES
	this.trace			= false;
	this.field			= get_arg(arg_field, null);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// PUBLIC METHOD : HAS A FIELD
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		// var url_str = 'field=' + this.field.name;
		var url_str = this.field.name;
		
		this.leave(context, 'not found');
		return url_str;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('field.name', this.field.name);
	}
}



var LIBAPT_GROUP_TRACE = false;

LibaptGroup.create_from_string = function(arg_str, arg_model)
{
	var context = 'LibaptGroup.create_from_string(str,model)';
	trace_enter(context, '', LIBAPT_GROUP_TRACE);
	
	// GET GROUP FIELD
	var field_name = arg_str;
	var field = arg_model.fields_set.get_field(field_name);
	if (! field)
	{
		trace_error(context, 'bad field name [' + field_name + '] for model [' + arg_model.name + ']', true);
		return null;
	}
	
	// CREATE OBJECT
	var group_obj = new LibaptGroup(field);
	
	trace_leave(context, '', LIBAPT_GROUP_TRACE);
	return group_obj;
}

LibaptGroup.create = function(arg_settings)
{
	var context = 'LibaptGroup.create(arg_settings)';
	trace_enter(context, '', LIBAPT_GROUP_TRACE);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			"field"			: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_null(ext_settings.field) )
	{
		trace_error(context, 'group field is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var group_obj = new LibaptGroup(ext_settings.field);
	
	trace_leave(context, '', LIBAPT_GROUP_TRACE);
	return group_obj;
}
