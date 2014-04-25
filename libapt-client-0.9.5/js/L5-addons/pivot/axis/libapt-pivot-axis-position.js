/**
 * @file        libapt-pivot-axis-position.js
 * @desc       Pivot axis position class
 * @details     ...
 * @see			libapt-object.js
 * @ingroup     LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// LibaptModules.use('LibaptObject');


/**
 * @desc		Pivot axis position class
 * @param {}	arg_axis_obj					pivot axis object (LibaptPivotAxis)
 * @param {}	arg_ordered_members_indexes		pivot axis ordered position members indexs (array of integers)
 * @param {}	arg_ordered_members_values		pivot axis ordered position members (array of strings)
 */
function LibaptPivotAxisPosition(arg_axis_obj, arg_ordered_members_indexes, arg_ordered_members_values)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_axis_obj.name + '_position_[' + arg_ordered_members_indexes.join(',') + ']', false);
	Libapt.register_inheritance(LibaptPivotAxisPosition, LibaptObject);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptPivotAxisPosition';
	var context			= this.class_name + '(' + arg_axis_obj.name + ',indexes,values)';
	this.enter(context, 'constructor');
	
	
	// FILTER ATTRIBUTES
	this.axis						= arg_axis_obj;
	this.ordered_members_indexes	= arg_ordered_members_indexes;
	this.ordered_members_values		= arg_ordered_members_values;
	this.named_members_values		= null;
	this.key						= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// GET POSITION AXIS
	this.get_axis = function()
	{
		this.step('get_axis');
		return this.axis;
	}
	
	// GET POSITION MEMBERS INDEXES
	this.get_indexes = function()
	{
		this.step('get_indexes');
		return this.ordered_members_indexes;
	}
	
	// GET POSITION MEMBERS VALUES
	this.get_values = function()
	{
		this.step('get_values');
		return this.ordered_members_values;
	}
	
	// GET POSITION NAMED MEMBERS VALUES
	this.get_named_values = function()
	{
		this.step('get_named_values');
		
		if ( Libapt.is_null(this.named_members_values) )
		{
			this.named_members_values = {};
			for(group_index in this.axis.groups_array)
			{
				var field_name = this.axis.groups_array[group_index].field.name;
				this.named_members_values[field_name] = this.ordered_members_values[group_index];
			}
		}
		
		return this.named_members_values;
	}
	
	// GET POSITION KEY
	this.get_key = function()
	{
		this.step('get_key');
		
		if ( Libapt.is_null(this.key) )
		{
			this.step('get_ke: generate key');
			this.key = this.ordered_members_values.join('/');
		}
		
		return this.key;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('key', this.key)
			+ this.to_string_value('indexes', this.ordered_members_indexes)
			+ this.to_string_value('values', this.ordered_members_values)
			;
	}
}
