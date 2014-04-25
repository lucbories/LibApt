/**
 * @file        libapt-filter.js
 * @brief       Query filter class
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
 * @brief		Query filter class
 * @param[in]	arg_field			field (object)
 * @param[in]	arg_type			value type (string)
 * @param[in]	arg_modifier		value modifier (string)
 * @param[in]	arg_operator		operator (string)
 * @param[in]	arg_var1			operand 1 value (string)
 * @param[in]	arg_var2			operand 2 value (string)
 */
function LibaptFilter(arg_field, arg_type, arg_modifier, arg_operator, arg_var1, arg_var2)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_field.name, false);
	
	// CONSTRUCTOR BEGIN
	this.class_name		= 'LibaptFilter';
	var context = this.class_name + '(' + arg_field.name + ',' + arg_type + ',' + arg_modifier + ',' + arg_operator + '...)';
	this.enter(context, 'constructor');
	
	
	// FILTER ATTRIBUTES
	this.trace			= false;
	this.group_mode		= '';
	this.join_mode		= '';
	this.field			= get_arg(arg_field, null);
	this.type			= get_arg(arg_type, null);
	this.modifier		= get_arg(arg_modifier, null);
	this.operator		= get_arg(arg_operator, 'equals');
	this.var1			= get_arg(arg_var1, null);
	this.var2			= get_arg(arg_var2, null);
	this.parent			= null;
	this.childs			= [];
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// PUBLIC METHOD : GET URL STRING
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		var url_str = "group=" + this.group_mode
			+ ",join=" + this.join_mode
			+ ",field=" + this.field.name
			+ ",type=" + this.type
			+ ",modifier=" + this.modifier
			+ ",op=" + this.operator
			+ ",var1=" + this.var1
			+ ",var2=" + this.var2;
		
		this.leave(context, 'success');
		return url_str;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('group_mode', this.group_mode)
			+ this.to_string_value('join_mode', this.join_mode)
			+ this.to_string_value('field.name', this.field.name)
			+ this.to_string_value('modifier', this.modifier)
			+ this.to_string_value('operator', this.operator)
			+ this.to_string_value('var1', this.var1)
			+ this.to_string_value('var2', this.var2)
			+ this.to_string_value('parent?', ! Libapt.is_null(this.parent) )
			+ this.to_string_value('childs.count', this.childs.length)
			;
	}
}



var LIBAPT_FILTER_TRACE = false;

LibaptFilter.create_from_string = function(arg_str)
{
	var context = 'LibaptFilter.create_from_string(arg_str)';
	trace_enter(context, '', LIBAPT_FILTER_TRACE);
	
	// SPLIT STRING
	var values = arg_str.split(',', 10);
	if (values.length < 6)
	{
		trace_error(context, 'filter string is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var filter_obj = null;
	// TODO
	// var filter_obj = new LibaptFilter();
	
	trace_leave(context, '', LIBAPT_FILTER_TRACE);
	return filter_obj;
}



LibaptFilter.create = function(arg_settings)
{
	var context = 'LibaptFilter.create(arg_settings)';
	trace_enter(context, '', LIBAPT_FILTER_TRACE);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			"group_mode"   : '',
			"join_mode"    : '',
			"field"		   : null,
			"type"         : null,
			"modifier"     : '',
			"operator"     : 'equals',
			"var1"         : null,
			"var2"         : null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// TODO CHECK SETTINGS
	// if ( is_str(ext_settings.field) )
	// {
		// trace_error(context, 'object name is not valid', true);
		// return null;
	// }
	
	// CREATE OBJECT
	var field_obj = LibaptFilter(ext_settings.field, ext_settings.type, ext_settings.modifier, ext_settings.operator, ext_settings.var1, ext_settings.var2);
	
	trace_leave(context, '', LIBAPT_FILTER_TRACE);
	return field_obj;
}
