/**
 * @file        libapt-pivot-groups-container.js
 * @brief       Pivot groups container class
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
 * @brief		Pivot groups container class
 * @param[in]	arg_name		Grid name (string)
 * @return		nothing
 */
function LibaptPivotGroupsContainer(arg_name)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptGrid';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// GRID ATTRIBUTES
	this.col_groups			= new Object();
	this.col_groups_array	= [];
	
	this.row_groups			= new Object();
	this.row_groups_array	= [];
	
	this.cell_measures		= new Object();
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	
	
	// GRID METHOD : ADD A ROW GROUP
	this.add_row_group = function(arg_group, arg_label)
	{
		var context = 'add_row_group(group[,label])';
		this.enter(context, '');
		
		var group = this.get_group(arg_group, arg_label);
		this.row_groups[field_name] = group;
		this.row_groups_array.push(group);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GRID METHOD : ADD A CELL MEASURE
	this.add_cell_measure = function(arg_measure_name, arg_field, arg_label, arg_aggregator_cb)
	{
		var context = 'add_cell_measure()';
		this.enter(context, '');
		
		// INIT
		var field_name = null;
		var field = null;
		
		// GIVEN FIELD ARG IS A FIELD OBJECT
		if (arg_field instanceof LibaptField)
		{
			field_name = arg_field.name;
			field = arg_field;
		}
		
		// GIVEN FIELD ARG IS A FIELD NAME
		else if ( Libapt.is_string(arg_field) )
		{
			field_name = arg_field;
			field = this.query.get_field(arg_field);
		}
		
		// CHECK FIELD
		this.assertNotNull(context, 'field', field);
		
		// ADD MEASURE
		this.cell_measures[arg_measure_name] = { 'name':arg_measure_name, 'field':field, 'label':arg_label, 'aggregator':arg_aggregator_cb };
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GRID METHOD : GET A COLS HEADERS TREE
	this.get_cols_headers_tree = function()
	{
		var context = 'get_cols_headers_tree()';
		this.enter(context, '');
		
		var tree = { childs:[], span };
		
		var current_tree_node = { group:null, depth:null, childs:[] };
		tree.childs.push(current_tree_node);
		for(var col_group_index = 0 ; col_group_index < this.col_groups_array.length ; col_group_index++)
		{
			var col_group = this.col_groups_array[col_group_index];
			current_tree_node.group	= col_group;
			current_tree_node.depth	= col_group_index;
			
			if ( (col_group_index + 1) < this.col_groups_array.length )
			{
				var new_tree_node = { group:null, depth:null, childs:[] };
				current_tree_node.childs.push(new_tree_node);
				current_tree_node = new_tree_node;
			}
		}
		console.log(tree);
		
		this.leave(context, 'success');
		return tree;
	}
	
	
	// GRID METHOD : GET A ROWS HEADERS TREE
	this.get_rows_headers_tree = function()
	{
		var context = 'get_rows_headers_tree()';
		this.enter(context, '');
		
		var tree = [];
		
		var current_tree_node = { group:null, depth:null, childs:[] };
		tree.push(current_tree_node);
		for(var row_group_index = 0 ; row_group_index < this.row_groups_array.length ; row_group_index++)
		{
			var row_group = this.col_groups_array[row_group_index];
			current_tree_node.group	= row_group;
			current_tree_node.depth	= row_group_index;
			
			if ( (row_group_index + 1) < this.col_groups_array.length )
			{
				var new_tree_node = { group:null, depth:null, childs:[] };
				current_tree_node.childs.push(new_tree_node);
				current_tree_node = new_tree_node;
			}
		}
		console.log(tree);
		
		this.leave(context, 'success');
		return tree;
	}
	
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('col_groups',		this.col_groups)
			+ this.to_string_value('row_groups_array',	this.row_groups_array)
			+ this.to_string_value('cell_measures',		this.cell_measures)
			;
	}
}
