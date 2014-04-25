/**
 * @file        libapt-pivot-axis-iterator.js
 * @desc       Pivot axis iterator class
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
 * @desc		Pivot axis iterator class
 * @param {}	arg_axis_obj					pivot axis object (LibaptPivotAxis)
 */
function LibaptPivotAxisIterator(arg_axis_obj)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_axis_obj.name + '_iterator', false);
	Libapt.register_inheritance(LibaptPivotAxisIterator, LibaptObject);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptPivotAxisIterator';
	var context				= this.class_name + '(' + arg_axis_obj.name + ')';
	this.enter(context, 'constructor');
	
	
	// AXIS ITERATOR ATTRIBUTES
	this.axis_obj			= arg_axis_obj;
	this.first_position		= null;
	this.current_position	= null;
	this.last_position		= null;
	this.groups_count		= this.axis_obj.groups_array.length;
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// GET POSITION AXIS
	this.get_axis = function()
	{
		this.step('get_axis');
		return this.axis_obj;
	}
	
	
	// INIT
	this.init = function()
	{
		var context = 'init()';
		this.enter(context, '');
		
		this.first_position		= [];
		this.current_position	= [];
		this.last_position		= [];
		
		var distinct_values_force_reload = false;
		var distinct_values_max = this.axis_obj.max_members_count;
		
		for(var group_index = 0 ; group_index < this.groups_count ; group_index++)
		{
			this.step(context, 'group_index [' + group_index + ']');
			
			var current_group				= this.axis_obj.groups_array[group_index];
			var current_group_members_count	= current_group.get_distinct_values_count(distinct_values_force_reload, distinct_values_max, this.axis_obj);
			
			this.first_position.push(0);
			this.current_position.push(0);
			this.last_position.push(current_group_members_count - 1);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GET POSITION MEMBERS INDEXES
	this.copy_position = function(arg_position_1, arg_position_2)
	{
		for(var group_index = 0 ; group_index < this.groups_count ; group_index++)
		{
			arg_position_1[group_index] = arg_position_2[group_index];
		}
		
		return true;
	}
	
	
	// GET CURRENT POSITION
	this.get_current_position = function()
	{
		this.step('get_current_position');
		return this.current_position;
	}
	
	
	// HAS NEXT POSITION
	this.has_next = function()
	{
		this.step('has_next');
		
		return this.current_position[this.groups_count - 1] < this.last_position[this.groups_count - 1];
	}
	
		
	// MOVE TO THE FIRST AXIS POSITION
	this.move_first = function()
	{
		this.step('move_first');
		
		this.copy_position(this.current_position, this.first_position);
		
		return this.current_position;
	}
	
		
	// MOVE TO THE LAST AXIS POSITION
	this.move_last = function()
	{
		this.step('move_last');
		
		this.copy_position(this.current_position, this.last_position);
		
		return this.current_position;
	}
	
		
	// MOVE TO THE NEXT AXIS POSITION
	this.move_next = function()
	{
		this.step('move_last');
		
		if ( this.has_next() )
		{
			var group_index = 0;
			while (group_index < this.groups_count)
			{
				if ( this.current_position[group_index] < this.last_position[group_index] )
				{
					this.current_position[group_index] += 1;
					return this.current_position;
				}
				
				group_index++;
			}
		}
		
		return null;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('first_position', this.first_position)
			+ this.to_string_value('last_position', this.last_position)
			+ this.to_string_value('current_position', this.current_position)
			;
	}
}
