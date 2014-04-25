/**
 * @file        libapt-query.js
 * @brief       Model query class
 * @details     
 * @see			libapt-model.js libapt-field.js
 * @ingroup     LIBAPT_MODELS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Model query class
 * @param[in]	arg_name			name of the field
 */
function LibaptQuery(arg_name, arg_fields, arg_filters, arg_orders, arg_groups, arg_slice, arg_model)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptQuery';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// QUERY ATTRIBUTES
	this.action			= 'select';
	this.fields_set		= new LibaptFieldsSet(arg_name + '_fields_set');
	this.filters_set	= new LibaptFiltersSet(arg_name + '_filters_set');
	this.orders_set		= new LibaptOrdersSet(arg_name + '_orders_set');
	this.groups_set		= new LibaptGroupsSet(arg_name + '_groups_set');;
	this.slice			= null;
	this.model			= arg_model;
	this.one_field		= null;
	
	
	// INIT QUERY
	if (arg_fields)
	{
		this.fields_set.add_fields(arg_fields, this.model);
	}
	if (arg_filters)
	{
		this.filters_set.add_filters(arg_filters);
	}
	if (arg_orders)
	{
		this.orders_set.add_orders(arg_orders);
	}
	if (arg_groups)
	{
		this.groups_set.add_groups(arg_groups);
	}
	if (arg_slice && Libapt.is_number(arg_slice['offset']) && Libapt.is_number(arg_slice['length']) )
	{
		var arg_offset = arg_slice['offset'];
		var arg_length = arg_slice['length'];
		if ( ! Libapt.is_null(arg_offset) && ! Libapt.is_null(arg_length) )
		{
			this.slice = { offset:arg_offset, length:arg_length };
		}
	}
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	// METHOD : CREATE AN URL QUERY STRING FROM QUERY SETTINGS
	this.get_options_url_from_strings = function(arg_str_action, arg_str_fields, arg_str_slice, arg_str_orders, arg_str_groups, arg_str_filters, arg_one_field_name)
	{
		var context = "get_options_url_from_strings(...)";
		this.enter(context);
		
		// MAKE URL STRING
		var url_str = "";
		if ( ! Libapt.is_empty_str_or_null(arg_str_action) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += "model_action=\"" + arg_str_action + "\"";
		}
		if ( ! Libapt.is_empty_str_or_null(arg_one_field_name) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += "model_one_field=\"" + arg_one_field_name + "\"";
		}
		if ( ! Libapt.is_empty_str_or_null(arg_str_fields) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += "model_fields=\"" + arg_str_fields + "\"";
		}
		if ( ! Libapt.is_empty_str_or_null(arg_str_filters) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += "model_filters=\"" + arg_str_filters + "\"";
		}
		if ( ! Libapt.is_empty_str_or_null(arg_str_orders) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += "model_orders=\"" + arg_str_orders + "\"";
		}
		if ( ! Libapt.is_empty_str_or_null(arg_str_groups) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += "model_groups=\"" + arg_str_groups + "\"";
		}
		if ( ! Libapt.is_empty_str_or_null(arg_str_slice) )
		{
			if (url_str != "")
			{
				url_str += "&";
			}
			url_str += arg_str_slice;
		}
		
		if (url_str != "")
		{
			url_str = "&" + url_str;
		}
		
		this.leave(context, url_str);
		return url_str;
	}


	// PROTECTED METHOD : CREATE AN URL QUERY STRING FROM QUERY SETTINGS
	this.get_url_string = function()
	{
		var context = "get_url_string()";
		this.enter(context);
		
		// ACTION
		var str_action = '';
		if (this.action == 'select_distinct')
		{
			this.step(context, 'action is select_distinct');
			str_action = 'select_distinct';
		}
		else if (this.action == 'select_distinct_one')
		{
			this.step(context, 'action is select_distinct_one');
			str_action = 'select_distinct_one';
		}
		else if (this.action == 'select_count')
		{
			this.step(context, 'action is select_count');
			str_action = 'select_count';
		}
		else
		{
			this.step(context, 'action is select');
			str_action = 'select';
		}
		
		// FIELDS
		var str_fields = this.fields_set.get_url_string();
		var str_one_field = Libapt.is_null(this.one_field) ? null : this.one_field.name;
		
		// FILTERS
		var str_filters = this.filters_set.get_url_string();
		
		// ORDERS
		var str_orders = this.orders_set.get_url_string();
		
		// GROUP BY
		var str_groups = this.groups_set.get_url_string();
		
		// SLICE
		var str_slice = "";
		if ( ! Libapt.is_null(this.slice) )
		{
			str_slice = "&model_slice_offset=" + this.slice['offset'];
			str_slice += "&model_slice_length=" + this.slice['length'];
		}
		
		// GET URL OPTIONS STRING
		var url_opts_str = this.get_options_url_from_strings(str_action, str_fields, str_slice, str_orders, str_groups, str_filters, str_one_field);
		
		this.leave(context, 'success');
		return url_opts_str;
	}
	
	
	// ONE FIELD
	this.set_one_field = function(arg_one_field)
	{
		// this.assert(arg_one_field instanceof LibaptField);
		this.one_field = arg_one_field;
		return true;
	}
	
	// ACTION METHOD - SET
	this.set_action = function(arg_action)
	{
		this.action = arg_action;
	}
	
	this.set_select = function()
	{
		this.action = 'select';
	}
	
	this.set_select_distinct = function()
	{
		this.action = 'select_distinct';
	}
	
	this.set_select_distinct_one = function()
	{
		this.action = 'select_distinct_one';
	}
	
	this.set_select_count = function()
	{
		this.action = 'select_count';
	}
	
	
	// SLICES METHOD - SET
	this.set_slice = function(arg_offset, arg_length)
	{
		var context = this.class_name + '.set_slice(' + arg_offset + ',' + arg_length + ')';
		this.enter(context, '');
		
		if ( ! Libapt.is_null(arg_offset) && ! Libapt.is_null(arg_length) )
		{
			this.slice = { offset:arg_offset, length:arg_length };
		}
		
		this.leave(context, '');
		return this;
	}
	
	
	// SLICES METHOD - REMOVE
	this.remove_slice = function()
	{
		var context = this.class_name + '.remove_slice()';
		this.enter(context, '');
		
		this.slice = null;
		
		this.leave(context, '');
		return this;
	}
	
	// SLICES METHOD - GET
	this.get_slice = function()
	{
		var context = this.class_name + '.get_slice()';
		this.enter(context, '');
		
		
		this.leave(context, '');
		return this.slice;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('action', this.action)
			+ this.to_string_value('fields_set.count', this.fields_set.fields.length)
			+ this.to_string_value('filters_set', this.filters_set)
			+ this.to_string_value('orders.count', this.orders.length)
			+ this.to_string_value('groups.count', this.groups.length)
			+ this.to_string_value('slice', this.slice)
			;
	}
}

/*
LibaptQuery.create = function(arg_settings)
{
	var context = 'LibaptQuery.create(arg_settings)';
	Libapt.trace_enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'fields_set'	: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_empty_str_or_null(ext_settings.name) )
	{
		trace_error(context, 'object name is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var field_obj = new LibaptFieldsSet(ext_settings.name, ext_settings.fields);
	
	Libapt.trace_leave(context, '', true);
	return field_obj;
}*/
