/**
 * @file        libapt-pivot.js
 * @brief       Pivot class
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
 * @brief		Pivot class
 * @param[in]	arg_name		pivot name (string)
 */
function LibaptPivot(arg_name)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.class_name		= 'LibaptPivot';
	var context = this.class_name + '(' + arg_name.name + ')';
	this.enter(context, 'constructor');
	
	
	// FILTER ATTRIBUTES
	this.trace				= false;
	this.pivot_groups		= [];
	this.pivot_measures		= [];
	this.pivot_cells		= [];
	this.need_init			= true;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	// GROUPS METHOD : ADD
	this.add_group = function(arg_group_obj)
	{
		var context = 'add_group()';
		this.enter(context, '');
		
		if (arg_group_obj instanceof LibaptPivotGroup)
		{
			this.pivot_groups.push(arg_group_obj);
		}
		
		this.leave(context, '');
		return true;
	}
	
	// GROUPS METHOD : GET
	this.get_group = function(arg_field_name)
	{
		var context = 'get_group(' + arg_field_name + ')';
		this.enter(context, '');
		
		for(group_index in this.pivot_groups)
		{
			var group = this.pivot_groups[group_index];
			if (group.field.name == arg_field_name)
			{
				this.leave(context, 'found');
				return group;
			}
		}
		
		this.leave(context, 'not found');
		return null;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('pivot_groups.length', this.pivot_groups.length)
			+ this.to_string_value('pivot_measures.length', this.pivot_measures.length)
			+ this.to_string_value('pivot_cells.length', this.pivot_cells.length)
			;
	}
}


/*
	
	var pivot = new LibaptPivot('grid1');
	
	// DEFINE PIVOT
	pivot.add_group( new LibaptPivotGroup('groupA', fieldA, 'A');
	pivot.add_group( new LibaptPivotGroup('groupB', fieldB, 'B');
	pivot.add_group( new LibaptPivotGroup('groupC', fieldC, 'C');
	pivot.add_measure( new LibaptPivotMeasure('measureD', fieldD, 'D');
	pivot.add_measure( new LibaptPivotMeasure('measureE', fieldD, 'E');
	
	
	// INIT PIVOT FOR TARGET
			A		A		...
			D	E	D	E
	B	C	x	x	x	x	...
		C	x	x	x	x	...
	B	C	x	x	x	x	...
		C	x	x	x	x	...
	...
	pivot.set_group_on_col(groupA, depthA);
	pivot.set_measure_on_col(groupA, depthA);
	pivot.set_group_on_row(groupB, depthB);
	pivot.set_group_on_row(groupC, depthC);
	pivot.set_datas(datas);
	
	
	// DRAW HELPERS
	col_max_depth = pivot.get_col_max_depth()
	col_headers = pivot.get_col_headers()
	for(var depth = 0 ; depth < col_max_depth ; depth++)
	{
		var col_header = col_headers[depth];
		var col_header_values = col_header.get_values()
		
		for(var value_index = 0 ; value_index < col_header_values.length ; value_index++)
		{
			var value = col_header_values[value_index];
			var th = $('<th colspan="' + col_header.get_size() + '">' + col_header.get_value_label(value) + '</th>');
			th.data('pivot_header', col_header);
			table_tr.append(th);
		}
	}
	
	row_cells_count = ...
	row_max_depth = pivot.get_row_max_depth()
	row_headers = pivot.get_row_headers()
	for(var depth = 0 ; depth < row_max_depth ; depth++)
	{
		var row_header = row_headers[depth];
		var row_header_values = row_header.get_values()
		
		// for(var value_index = 0 ; value_index < col_header_values.length ; value_index++)
		// {
			// var value = col_header_values[value_index];
			// var th = $('<th colspan="' + row_header.get_size() + '">' + row_header.get_value_label(value) + '</th>');
			// th.data('pivot_header', row_header);
			// table_tr.append(th);
		// }
		
		for(var value_index = 0 ; value_index < row_cells_count ; value_index++)
		{
			var td = $('<td colspan="1"></td>');
			table_tr.append(td);
		}
	}
	
	
	LibaptPivotHeader
		position: col / row
		pivot_group : LibaptPivotGroup
		get_values()
		get_values_count()
		get_value_label()
		???get_label()
		get_size() : colspan/rowspan
	
	
LibaptGroup.create = function(arg_settings)
{
	var context = 'LibaptGroup.create(arg_settings)';
	trace_enter(context, '', true);
	
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			"name"				: null,
			"field"				: null,
			"label"				: null,
			"can_group_on_cols"	: true,
			"can_group_on_rows"	: true,
			"is_sparse"	: true,
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
	var obj = new LibaptGroup(ext_settings.name, ext_settings.field, ext_settings.label);
	obj.can_group_on_cols	= ext_settings.can_group_on_cols;
	obj.can_group_on_rows	= ext_settings.can_group_on_rows;
	obj.is_sparse			= ext_settings.is_sparse;
	
	
	trace_leave(context, '', true);
	return obj;
}*/
