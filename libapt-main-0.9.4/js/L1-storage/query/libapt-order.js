/**
 * @file        libapt-order.js
 * @brief       Query order class
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
 * @brief		Query order class
 * @param[in]	arg_field			field
 * @param[in]	arg_mode			order mode ('ASC' or 'DESC')
 */
function LibaptOrder(arg_field, arg_mode)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_field.name + '.' + arg_mode, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptOrder';
	var context			= this.class_name + '(' + arg_field.name + ',' + arg_mode + ')';
	this.enter(context, 'constructor');
	
	
	// ORDER ATTRIBUTES
	this.field			= get_arg(arg_field, null);
	this.mode			= get_arg(arg_mode, null);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// PUBLIC METHOD : HAS A FIELD
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		var url_str = this.field.name + "=" + this.mode;
		
		this.leave(context, 'not found');
		return url_str;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('field.name', this.field.name)
			+ this.to_string_value('mode', this.mode)
			;
	}
}



var LIBAPT_ORDER_TRACE = false;

LibaptOrder.create_from_string = function(arg_str, arg_model)
{
	var context = 'LibaptOrder.create_from_string(str,model)';
	trace_enter(context, '', LIBAPT_ORDER_TRACE);
	
	// SPLIT STRING
	var parts = arg_str.split('=', 2);
	if (parts.length != 2)
	{
		trace_error(context, 'order string is not valid', true);
		return null;
	}
	
	// GET ORDER FIELD
	var field_name = parts[0];
	var field = arg_model.fields_set.get_field(field_name);
	if (! field)
	{
		trace_error(context, 'bad field name [' + field_name + '] for model [' + arg_model.name + ']', true);
		return null;
	}
	
	// GET ORDER MODE
	var mode_name = parts[1];
	if (mode_name != 'ASC' && mode_name != 'DESC')
	{
		trace_error(context, 'bad order mode [' + mode_name + ']', true);
		return null;
	}
	
	// CREATE OBJECT
	var order_obj = new LibaptOrder(field, mode_name);
	
	trace_leave(context, '', LIBAPT_ORDER_TRACE);
	return order_obj;
}


LibaptOrder.create = function(arg_settings)
{
	var context = 'LibaptOrder.create(arg_settings)';
	trace_enter(context, '', LIBAPT_ORDER_TRACE);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			"field"			: null,
			"mode"   		: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_null(ext_settings.field) )
	{
		trace_error(context, 'order field is not valid', true);
		return null;
	}
	if ( Libapt.is_empty_str_or_null(ext_settings.mode) )
	{
		trace_error(context, 'order mode is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var field_obj = new LibaptOrder(ext_settings.field, ext_settings.mode);
	
	trace_leave(context, '', LIBAPT_ORDER_TRACE);
	return field_obj;
}
