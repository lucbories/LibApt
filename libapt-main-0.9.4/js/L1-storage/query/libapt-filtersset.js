/**
 * @file        libapt-filtersset.js
 * @brief       Filters set class
 * @details     
 * @see			libapt-filter.js
 * @ingroup     LIBAPT_CORE
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Filters set class
 * @param[in]	arg_name			name of the field
 * @param[in]	arg_filters			filters array
 */
function LibaptFiltersSet(arg_name, arg_filters)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptFiltersSet';
	var context			= '(' + arg_name + ',filters)';
	this.enter(context, 'constructor');
	
	
	// FIELDS SET ATTRIBUTES
	this.filters		= get_arg(arg_filters, []);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// PUBLIC METHOD : GET A FIELD
	this.get_filters_for_field = function(arg_field_name)
	{
		var context = 'get_filters_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var field_filters = [];
		for(filter_index in this.filters)
		{
			var filter = this.filters[filter_index];
			if (filter.field.name == arg_field_name)
			{
				field_filters.push(filter);
			}
		}
		
		this.leave(context, 'filters found:' + field_filters.length);
		return field_filters;
	}
	
	
	// PUBLIC METHOD : HAS FILTERS
	this.has_filters = function()
	{
		return ! Libapt.is_null(this.filters) && this.filters.length > 0;
	}
	
	
	// PUBLIC METHOD : HAS A FIELD
	this.has_filter_for_field = function(arg_field_name)
	{
		var context = 'has_filter_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		for(filter_index in this.filters)
		{
			var filter = this.filters[filter_index];
			if (filter.field.name == arg_field_name)
			{
				this.leave(context, 'found');
				return true;
			}
		}
		
		this.leave(context, 'not found');
		return false;
	}
	
	// FILTERS METHOD - ADD
	this.add_filter = function(arg_filter)
	{
		var context = 'add_filter(' + arg_filter + ')';
		this.enter(context, '');
		
		if ( ! Libapt.is_null(arg_filter) )
		{
			this.filters.push(arg_filter);
		}
		
		this.leave(context, '');
		return this;
	}
	
	// FILTERS METHOD - ADD MANY
	this.add_filters = function(arg_filters)
	{
		var context = 'add_filter(' + arg_filters.length + ')';
		this.enter(context, '');
		
		for(key in arg_filters)
		{
			var filter = arg_filters[key];
			if ( ! Libapt.is_null(filter) )
			{
				this.filters.push(filter);
			}
		}
		
		this.leave(context, '');
		return this;
	}
	
	// FILTERS METHOD - REPLACE AND ADD FILTER ON A FIELD VALUE
	this.replace_or_add_filter_field_value = function(arg_fields_set, arg_field_name, arg_field_value, arg_allow_multiple_values)
	{
		var context = 'replace_or_add_filter_field_value(' + arg_field_name + ',' + arg_field_value + ',' + arg_allow_multiple_values + ')';
		this.enter(context, '');
		
		if ( ! arg_fields_set.has_field(arg_field_name) )
		{
			console.error('bad field name[' + arg_field_name + ']');
			console.log(arg_fields_set);
			this.error(context, 'bad field name[' + arg_field_name + ']');
			return this;
		}
		
		var field = arg_fields_set.get_field(arg_field_name);
		// var var1 = Libapt.is_array(arg_field_value) ? arg_field_value.join(':') : arg_field_value;
		var filter = null;
		
		if (arg_allow_multiple_values)
		{
			var filters = this.get_filters_for_field(arg_field_name);
			var multiple_filter = null;
			
			if (filters.length > 0)
			{
				this.step(context, 'filters found [' + filters.length + '] for field name [' + arg_field_name + ']');
				
				// LOOP ON FILTERS FOR THE GIVEN FIELD NAME
				for(filter_index in filters)
				{
					this.value(context, 'filter', filter.toString());
					
					// GET CURRENT FILTER
					filter = filters[filter_index];
					
					// INIT MULTIPLE FILTER
					if ( Libapt.is_null(multiple_filter) )
					{
						this.step(context, 'init multiple filter');
						filter.operator = 'in';
						multiple_filter = filter;
						multiple_filter.var1 += ':' + (Libapt.is_array(arg_field_value) ? arg_field_value.join(':') : arg_field_value);
						continue;
					}
					
					// MERGE CURRENT FILTER WITH MULTIPLE FILTER
					if (filter.operator == 'equals' || filter.operator == 'in')
					{
						this.step(context, 'merge multiple filter and current filter');
						multiple_filter.var1 += ':' + filter.var1;
					}
				}
				
				if ( ! Libapt.is_null(multiple_filter) )
				{
					this.step(context, 'remove all existing fields and append multiple filter');
					this.remove_filters_for_field(arg_field_name);
					this.add_filter(multiple_filter);
				}
			}
			else
			{
				this.step(context, 'field not found and created for field [' + arg_field_name + ']');
				var var1 = Libapt.is_array(arg_field_value) ? arg_field_value.join(':') : arg_field_value;
				filter = new LibaptFilter(field, field.value_type, '', 'in', var1);
				this.filters.push(filter);
			}
		}
		else
		{
			this.remove_filters_for_field(arg_field_name);
			var var1 = arg_field_value;
			var op = 'equals';
			if ( Libapt.is_array(arg_field_value) )
			{
				var1 = arg_field_value.join(':');
				op = 'in';
			}
			filter = new LibaptFilter(field, field.value_type, '', op, var1);
			this.filters.push(filter);
		}
		
		this.leave(context, '');
		return this;
	}
	
	// FILTERS METHOD - REMOVE ALL
	this.remove_all_filters = function()
	{
		var context = 'remove_all_filters()';
		this.enter(context, '');
		
		this.filters = [];
				
		this.leave(context, '');
		return this;
	}
	
	// FILTERS METHOD - REMOVE
	this.remove_filter = function(arg_filter)
	{
		var context = 'remove_filter(' + arg_filter.name + ')';
		this.enter(context, '');
		
		var index = this.filters.lastIndexOf(arg_filter);
		if (index >= 0)
		{
			this.filters.splice(index, 1);
		}
		
		this.leave(context, '');
		return this;
	}
	
	// FILTERS METHOD - REMOVE FILTERS OF A FIELD
	this.remove_filters_for_field = function(arg_field_name)
	{
		var context = 'remove_filters_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var removed_count = 0;
		for(key in this.filters)
		{
			var filter = this.filters[key];
			if ( ! Libapt.is_null(filter) && filter.field.name == arg_field_name )
			{
				var index = this.filters.lastIndexOf(filter);
				if (index >= 0)
				{
					++removed_count;
					this.filters.splice(index, 1);
				}
			}
		}
		
		this.leave(context, 'filters removed:[' + removed_count + ']');
		return this;
	}
	
	// FILTERS METHOD - GET FILTERS OF A FIELD
	this.get_filters_for_field = function(arg_field_name)
	{
		var context = 'get_filters_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in this.filters)
		{
			var filter = this.filters[key];
			if ( ! Libapt.is_null(filter) && filter.field.name == arg_field_name )
			{
				results_array.push(filter);
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	// FILTERS METHOD - GET FILTERS OF A FIELD
	this.get_filters_for_field_in = function(arg_field_name)
	{
		var context = 'get_filters_for_field_in(' + arg_field_name + ')';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in this.filters)
		{
			var filter = this.filters[key];
			if ( ! Libapt.is_null(filter) && filter.field.name == arg_field_name && filter.op == 'in' )
			{
				results_array.push(filter);
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	// FILTERS METHOD - GET FILTERS OF A FIELD
	this.get_filters_fields = function()
	{
		var context = 'get_filters_fields()';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in this.filters)
		{
			var filter = this.filters[key];
			if ( ! Libapt.is_null(filter) )
			{
				results_array.push(filter.field);
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	
	// PUBLIC METHOD : GET URL STRING
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		var url_str = '';
		for(filter_index in this.filters)
		{
			var filter = this.filters[filter_index];
			url_str += filter.get_url_string() + '|';
		}
		
		this.leave(context, 'success');
		return url_str;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('filters.count', this.filters.length);
	}
}


LibaptFiltersSet.create = function(arg_settings)
{
	var context = 'LibaptFiltersSet.create(arg_settings)';
	this.enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'filters'		: null
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
	var field_obj = new LibaptFiltersSet(ext_settings.name, ext_settings.fields);
	
	this.leave(context, '', true);
	return field_obj;
}
