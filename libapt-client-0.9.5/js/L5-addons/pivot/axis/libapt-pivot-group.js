/**
 * @file        libapt-pivot-group.js
 * @desc       Pivot group class
 * @details     ...
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @desc		Pivot group class
 * @param {}	arg_name			pivot group name (string)
 * @param {}	arg_field			field (object of class LibaptField)
 * @param {}	arg_label			pivot group label (string)
 */
function LibaptPivotGroup(arg_name, arg_field, arg_label)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptPivotGroup';
	var context				= this.class_name + '(' + arg_field.name + ')';
	this.enter(context, 'constructor');
	
	
	// FILTER ATTRIBUTES
	this.field				= get_arg(arg_field, null);
	this.can_group_on_cols	= true;
	this.can_group_on_rows	= true;
	this.is_sparse			= true;
	this.label				= get_arg(arg_label, this.field.label);
	
	this.distinct_values	= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// VALUES METHOD : GET DISTINCT GROUP VALUES
	this.get_distinct_values = function(arg_force_read, arg_max, arg_axis)
	{
		var context = 'get_distinct_values(...)';
		this.enter(context, 'max=[' + arg_max + ']');
		
		
		if ( Libapt.is_array(this.distinct_values) )
		{
			if ( Libapt.is_number(arg_max) && arg_max < this.distinct_values.length)
			{
				this.leave(context, 'cached values only ' + arg_max);
				return this.distinct_values.slice(0, arg_max - 1);
			}
			
			this.value(context, 'distinct_values', this.distinct_values);
			this.leave(context, 'cached values');
			return this.distinct_values;
		}
		
		// READ SPARSE DISTINCT VALUES
		if (this.is_sparse && arg_axis)
		{
			this.step(context, 'for sparse axis');
			var grid	= arg_axis.grid;
			this.assertNotNull(context, 'grid', grid);
			
			var query	= grid.query;
			this.assertNotNull(context, 'query', query);
			
			var model = grid.model;
			this.assertNotNull(context, 'model', model);
			
			var fields	= query.fields_set.fields;
			var filters	= query.filters;
			var groups	= query.groups;
			var orders	= [ new LibaptOrder(this.field, 'ASC') ];
			var ok_cb	= null;
			var ko_cb	= null;
			
			this.distinct_values = model.read_distinct_one_sync(this.field, fields, filters, orders, groups, arg_max, ok_cb, ko_cb);
			this.value(context, 'distinct_values.length', this.distinct_values.length);
			
			this.leave(context, '');
			return this.distinct_values;
		}
		
		
		// READ ALL DISTINCT VALUES
		this.distinct_values = this.field.get_all_distinct_values(arg_force_read, arg_max);
		
		
		this.leave(context, '');
		return this.distinct_values;
	}
	
	// VALUES METHOD : GET DISTINCT GROUP VALUES COUNT
	this.get_distinct_values_count = function(arg_force_read, arg_max, arg_axis)
	{
		this.step('get_distinct_values_count', 'max=[' + arg_max + ']');
		
		return this.get_distinct_values(arg_force_read, arg_max, arg_axis).length;
	}
	
	// VALUES METHOD : GET DISTINCT GROUP VALUES
	this.get_distinct_value_at = function(arg_index, arg_force_read, arg_max, arg_axis)
	{
		this.step('get_distinct_value_at[' + arg_index + ']', 'max=[' + arg_max + ']');
		
		return this.get_distinct_values(arg_force_read, arg_max, arg_axis)[arg_index];
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('field.name', this.field.name)
			+ this.to_string_value('can_group_on_cols', this.can_group_on_cols)
			+ this.to_string_value('can_group_on_rows', this.can_group_on_rows)
			+ this.to_string_value('is_sparse', this.is_sparse)
			+ this.to_string_value('label', this.label)
			;
	}
}

Libapt.register_inheritance(LibaptPivotGroup, LibaptObject);



LibaptPivotGroup.create = function(arg_settings)
{
	var context = 'LibaptPivotGroup.create(arg_settings)';
	trace_enter(context, '', true);
	
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			"name"				: null,
			"field"				: null,
			"label"				: null,
			"can_group_on_cols"	: true,
			"can_group_on_rows"	: true,
			"is_sparse"			: true,
			'grid'				: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( ! Libapt.is_not_empty_str(ext_settings.name) )
	{
		trace_error(context, 'name is not valid', true);
		return null;
	}
	if ( Libapt.is_null(ext_settings.field) )
	{
		trace_error(context, 'field is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var obj = new LibaptPivotGroup(ext_settings.name, ext_settings.field, ext_settings.label, ext_settings.grid);
	obj.can_group_on_cols	= ext_settings.can_group_on_cols;
	obj.can_group_on_rows	= ext_settings.can_group_on_rows;
	obj.is_sparse			= ext_settings.is_sparse;
	
	
	trace_leave(context, '', true);
	return obj;
}
