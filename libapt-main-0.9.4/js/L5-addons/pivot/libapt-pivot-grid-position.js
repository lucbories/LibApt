/**
 * @file        libapt-pivot-grid-position.js
 * @brief       Pivot grid position class
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
 * @brief		Pivot grid position class
 * @param[in]	arg_grid_obj					pivot axis object (LibaptPivotAxis)
 * @param[in]	arg_ordered_axis_positions		pivot axis ordered positions (array of LibaptPivotAxisPosition)
 */
function LibaptPivotGridPosition(arg_grid_obj, arg_ordered_axis_positions)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	// this.inheritFrom(arg_grid_obj.name + '_position_[' + arg_ordered_axis_positions.map( function(item){return item.get_key();} ).join('/') + ']', false);
	this.inheritFrom(arg_grid_obj.name + '_position', false);
	Libapt.register_inheritance(LibaptPivotGridPosition, LibaptObject);
	
	// CONSTRUCTOR BEGIN
	this.trace							= false;
	this.class_name						= 'LibaptPivotGridPosition';
	var context							= this.class_name + '(' + arg_grid_obj.name + ',indexes,values)';
	this.enter(context, 'constructor');
	
	
	// GRID POSITION ATTRIBUTES
	this.grid							= arg_grid_obj;
	this.ordered_axis_positions			= arg_ordered_axis_positions;
	this.ordered_axis_members_indexes	= null;
	this.ordered_axis_members_values	= null;
	this.named_members_values			= null;
	this.key							= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// GET POSITION GRID
	this.get_grid = function()
	{
		this.step('get_grid');
		return this.grid;
	}
	
	// GET AXIS POSITIONS
	this.get_positions = function()
	{
		this.step('get_positions');
		return this.ordered_axis_positions;
	}
	
	// INIT
	this.init = function()
	{
		this.step('init');
		
		this.ordered_axis_members_indexes	= [];
		this.ordered_axis_members_values	= [];
		this.named_members_values			= {};
		for(position_index in this.ordered_axis_positions)
		{
			var current_axis_position		= this.ordered_axis_positions[position_index];
			this.ordered_axis_members_indexes.push( current_axis_position.get_indexes() );
			this.ordered_axis_members_values.push( current_axis_position.get_values() );
			
			// CREATE NAMED MEMBERS MAP
			var axis_members = current_axis_position.get_named_values();
			for(field_name in axis_members)
			{
				this.named_members_values[field_name] = axis_members[field_name];
			}
		}
		
		// CREATE KEY
		this.key = LibaptPivotGridPosition.get_position_key(this.grid.all_ordered_groups, this.named_members_values);
		
		return true;
	}
	
	// GET POSITION MEMBERS INDEXES
	this.get_indexes = function()
	{
		this.step('get_indexes');
		
		if ( Libapt.is_null(this.ordered_axis_members_indexes) )
		{
			this.step('get_indexes: generate indexes');
			
			this.init();
		}
		
		return this.ordered_axis_members_indexes;
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
		
		return this.named_members_values;
	}
	
	// GET POSITION KEY
	this.get_key = function()
	{
		this.step('get_key');
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


	
	
// PUBLIC METHOD : GET AXIS POSITION KEY
LibaptPivotGridPosition.get_position_key = function(arg_all_ordered_groups, arg_position_record)
{
	var key = '';
	var groups_count = arg_all_ordered_groups.length;
	for(var group_index = 0; group_index < groups_count ; group_index++)
	{
		var field_name = arg_all_ordered_groups[group_index].field.name;
		key += (key == '' ? '' : '/') + arg_position_record[field_name];
	}
	return MD5(key);
}


LibaptPivotGridPosition.get_position_key_from_ordered_members = function(arg_position_members)
{
	var key = '';
	var groups_count = arg_position_members.length;
	for(var group_index = 0; group_index < groups_count ; group_index++)
	{
		key += (key == '' ? '' : '/') + arg_position_members[group_index];
	}
	return MD5(key);
}


// LibaptPivotGridPosition.get_position_key_from_named_members = function(arg_all_ordered_groups, arg_position_members)
// {
	// var key = '';
	// var groups_count = arg_all_ordered_groups.length;
	// for(var group_index = 0; group_index < groups_count ; group_index++)
	// {
		// var field_name = arg_all_ordered_groups[group_index].field.name;
		// key += (key == '' ? '' : '/') + arg_position_members[field_name];
	// }
	// return key;
// }



LibaptPivotGridPosition.init_grid_positions = function(arg_pivot_grid_object)
{
	var context = 'LibaptPivotGridPosition.init_positions()';
	arg_pivot_grid_object.enter(context, '');
	
	var v_iter = new LibaptPivotAxisIterator(arg_pivot_grid_object.vaxis_object);
	v_iter.init();
	
	var h_iter = new LibaptPivotAxisIterator(arg_pivot_grid_object.haxis_object);
	h_iter.init();
	
	// var rows = $(arg_pivot_grid_object.table_body_jqo).children();
	// console.log(rows);
	
	var row_index = 0;
	var v_position = v_iter.move_first();
	while( ! Libapt.is_null(v_position) )
	{
		// arg_pivot_grid_object.value(context, 'loop v_position', v_position);
		
		// CREATE NEW ROW
		// var tr_jqo = rows.eq(row_index);
		// console.log(tr_jqo);
		
		// LOOP ON HORIZONTAL MEMBERS POSITIONS
		// var cols = tr_jqo.contents();
		// console.log(cols);
		
		var col_index = arg_pivot_grid_object.vaxis_object.groups_array.length;
		var h_position = h_iter.move_first();
		while( ! Libapt.is_null(h_position) )
		{
			// arg_pivot_grid_object.value(context, 'loop h_position', h_position);
			
			var v_indexes_key = v_position.join('/');
			var v_axis_position = arg_pivot_grid_object.vaxis_object.axis_positions_by_indexes[v_indexes_key];
			
			var h_indexes_key = h_position.join('/');
			var h_axis_position = arg_pivot_grid_object.haxis_object.axis_positions_by_indexes[h_indexes_key];
			
			var axis_positions = [h_axis_position, v_axis_position];
			
			var current_grid_position = new LibaptPivotGridPosition(arg_pivot_grid_object, axis_positions);
			current_grid_position.init();
			
			var tbody_jqo	= arg_pivot_grid_object.table_body_jqo[0];
			// console.log(tbody_jqo);
			
			var tr_jqo		= $('tr', tbody_jqo).eq(row_index);
			// console.log(tr_jqo);
			
			// var td_jqo		= $('tr:eq(' + row_index + ') td', arg_pivot_grid_object.table_body_jqo[0]).eq(col_index);
			var td_jqo		= $('td', tr_jqo).eq(col_index);
			// console.log(td_jqo);
			
			arg_pivot_grid_object.assertTrue(context, '[td_jqo].length', td_jqo.length == 1);
			td_jqo.addClass('libapt-pivot-grid-cell')
			td_jqo.data('grid-position', current_grid_position);
			// console.log(td_jqo);
			
			var hvkey = current_grid_position.get_key();
			// arg_pivot_grid_object.value(context, 'loop hvkey', hvkey);
			arg_pivot_grid_object.table_cells_jqo_by_key[hvkey] = td_jqo;
			arg_pivot_grid_object.table_cells_pos_by_key[hvkey] = current_grid_position;
			
			h_position = h_iter.move_next();
			col_index++;
		}
		
		v_position = v_iter.move_next();
		row_index++;
	}
	
	
	arg_pivot_grid_object.leave(context, 'success');
	return true;
}