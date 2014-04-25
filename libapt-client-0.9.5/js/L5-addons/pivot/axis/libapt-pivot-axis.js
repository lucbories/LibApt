/**
 * @file        libapt-pivot-axis.js
 * @desc       Pivot axis class
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
 * @desc		Pivot axis class
 * @param {}	arg_name			pivot axis name (string)
 * @param {}	arg_label			pivot axis label (string)
 * @param {}	arg_ordered_groups	ordered groups (object of class LibaptField)
 */
function LibaptPivotAxis(arg_name, arg_label, arg_ordered_groups, arg_grid)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace					= false;
	this.class_name				= 'LibaptPivotAxis';
	var context					= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// AXIS ATTRIBUTES
	this.groups_array			= get_arg(arg_ordered_groups, []);
	this.groups_map				= null;
	this.groups_tree			= null;
	this.groups_nodes_by_depth	= [];
	this.members_matrix			= null;
	this.max_members_count		= 100;
	
	this.is_sparse				= true;
	this.label					= get_arg(arg_label, '');
	
	this.axis_positions				= [];
	this.axis_positions_by_indexes	= {};
	
	this.grid						= arg_grid;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// RESET GROUP
	this.reset = function()
	{
		var context = 'reset()';
		this.enter(context, '');
		
		
		this.groups_array			= [];
		this.groups_map				= null;
		this.groups_tree			= null;
		this.groups_nodes_by_depth	= [];
		this.members_matrix			= null;
		
		this.axis_positions				= [];
		// this.axis_positions_by_indexes	= {};
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// INIT POSITIONS
	this.init = function()
	{
		var context = 'init()';
		this.enter(context, '');
		
		var iter = new LibaptPivotAxisIterator(this);
		iter.init();
		
		var current_members_indexes = iter.move_first();
		while( ! Libapt.is_null(current_members_indexes) )
		{
			this.step(context, 'iteration at position [' + current_members_indexes + ']');
			
			var current_members_values = this.get_members_at_position(current_members_indexes);
			var axis_position = new LibaptPivotAxisPosition(this, current_members_indexes, current_members_values);
			this.axis_positions.push(axis_position);
			
			var indexes_key = current_members_indexes.join('/');
			// this.axis_positions_by_indexes[indexes_key] = axis_position;
			
			current_members_indexes = iter.move_next();
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GET MEMBERS AT POSITION
	this.get_members_at_position = function(arg_position)
	{
		var context = 'get_members_at_position(position)';
		this.assertTrue(context, 'position length', arg_position.length == this.groups_array.length);
		
		var members = {};
		for(var group_index = 0 ; group_index < this.groups_array.length ; group_index++)
		{
			var group = this.groups_array[group_index];
			var member_index	= arg_position[group_index];
			// var member_record	= group.get_distinct_value_at(member_index, false, null, this);
			var member_value	= group.get_distinct_value_at(member_index, false, null, this);
			// members.push(member_record[group.field.name]);
			var member_record = {};
			members[group.name] = member_value;
			// members.push(member_record);
		}
		
		return members;
	}
	
	
	// INIT
	this.init_map = function()
	{
		var context = 'init_map()';
		this.enter(context, '');
		
		if ( ! Libapt.is_null(this.groups_map) )
		{
			return true;
		}
		
		// CREATE AND FILL MAP
		this.groups_map	= new Object();
		for(var group_index = 0 ; group_index < this.groups_array.length ; group_index++)
		{
			var group = this.groups_array[group_index];
			this.groups_map[group.name] = group;
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GRID METHOD : GET A GROUP FROM A FIELD/GROUP/FIELD NAME AND A OPTIONAL LABEL
	this.get_group = function(arg_group, arg_label, arg_fields_set)
	{
		var context = 'get_group(group[,label])';
		this.enter(context, '');
		
		this.value(context, 'group', arg_group);
		this.value(context, 'label', arg_label);
		
		var field_name = null;
		var field = null;
		var group = null;
		
		// GIVEN GROUP IS A PIVOT GROUP
		if (arg_group instanceof LibaptPivotGroup)
		{
			this.step(context, 'arg is LibaptPivotGroup');
			
			// field_name = arg_group.field.name;
			// field = arg_group.field;
			group = arg_group;
		}
		
		// GIVEN GROUP IS A FIELD
		else if (arg_group instanceof LibaptField)
		{
			this.step(context, 'arg is LibaptField');
			
			var arg_field = arg_group;
			group_name = arg_field.name;
			field = arg_field;
			var group_label = arg_label ? arg_label : field.label;
			group = new LibaptPivotGroup(group_name, field, group_label);
		}
		
		// GIVEN GROUP IS A FIELD NAME
		else if ( Libapt.is_string(arg_group) && arg_fields_set instanceof LibaptFieldsSet)
		{
			this.step(context, 'arg is string');
			
			field_name	= arg_group;
			field		= arg_fields_set.get_field(field_name);
			this.assertNotNull(context, 'field', field);
			var group_label = arg_label ? arg_label : field.label;
			group		= new LibaptPivotGroup(field_name, field, group_label);
		}
		
		// CHECK GROUP
		this.assertNotNull(context, 'group', group);
		// if ( ! this.query.has_field(field_name) )
		// {
			// this.query.add_field(field);
		// }
		
		
		this.leave(context, 'success');
		return group;
	}
	
	
	// GRID METHOD : ADD A GROUP
	this.add_group = function(arg_group, arg_label)
	{
		var context = 'add_group(group[,label])';
		this.enter(context, '');
		
		this.value(context, 'group', arg_group);
		this.value(context, 'label', arg_label);
		
		this.init_map();
		
		var group = this.get_group(arg_group, arg_label);
		this.groups_map[group.field.name] = group;
		this.groups_array.push(group);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GRID METHOD : REMOVE A GROUP
	this.has_group = function(arg_group_name)
	{
		return this.groups_array.indexOf(arg_group_name) >= 0;
	}
	
	
	// GRID METHOD : REMOVE A GROUP
	this.remove_group = function(arg_group)
	{
		var context = 'remove_group(group)';
		this.enter(context, '');
		
		this.value(context, 'group', arg_group);
		
		var group = this.get_group(arg_group, arg_label);
		
		var map_group_index = this.groups_array.indexOf(group.field.name);
		this.groups_map.splice(map_group_index, 1);
		
		var array_group_index = this.groups_array.indexOf(group);
		this.groups_array.splice(array_group_index, 1);
		
		this.groups_tree			= null;
		this.groups_nodes_by_depth	= [];
		this.members_matrix			= null;
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GRID METHOD : REMOVE A GROUP
	this.remove_all_groups = function()
	{
		var context = 'remove_all_groups()';
		this.enter(context, '');
		
		this.groups_map				= null;
		this.groups_array			= [];
		this.groups_tree			= null;
		this.groups_nodes_by_depth	= [];
		this.members_matrix			= null;
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// GRID METHOD : GET A COLS HEADERS TREE
	this.get_groups_tree = function()
	{
		var context = 'get_groups_tree()';
		this.enter(context, '');
		
		// CHECK IF TREE ALREADY EXISTS
		if ( ! Libapt.is_null(this.groups_tree) )
		{
			this.leave(context, 'tree exists');
			return this.groups_tree;
		}
		
		// READ CONSTANTS
		var distinct_values_force_reload = false;
		var distinct_values_max = this.max_members_count;
		this.value(context, 'max_members_count', this.max_members_count);
		
		// CREATE TREE
		this.groups_tree = { name:'tree', childs:[], members_count:1, depths_members_count:0 };
		
		// CREATE TREE FIRST NODE
		var current_tree_node = { name:'node', parent_node:null, group:null, depth:null, childs:[], members_count:1, depths_members_count:0 };
		this.groups_tree.childs.push(current_tree_node);
		
		// LOOP ON AXIS GROUPS ARRAY
		for(var group_index = 0 ; group_index < this.groups_array.length ; group_index++)
		{
			// GET CURRENT GROUP
			var current_group = this.groups_array[group_index];
			this.step(context, 'current group at [' + group_index + ']=[' + current_group.name + ']');
			
			// FILL CURRENT NODE
			current_tree_node.name					= current_group.name;
			current_tree_node.group					= current_group;
			current_tree_node.members_count			= current_group.get_distinct_values_count(distinct_values_force_reload, distinct_values_max, this);
			current_tree_node.depths_members_count	= current_tree_node.members_count;
			current_tree_node.depth					= group_index;
			this.groups_nodes_by_depth.push(current_tree_node);
			
			// CREATE NEXT CURRENT NODE
			if ( (group_index + 1) < this.groups_array.length )
			{
				var new_tree_node = { name:'node', group:null, depth:null, childs:[], members_count:0, depths_members_count:0 };
				new_tree_node.parent_node = current_tree_node;
				current_tree_node.childs.push(new_tree_node);
				current_tree_node = new_tree_node;
			}
		}
		
		// DEBUG
		// console.log(this.groups_tree);
		
		// UPDATE CUMULATIVE MEMBERS COUNT
		this.update_node_members_count(this.groups_tree);
		
		// DEBUG
		// console.log(this.groups_tree);
		
		this.leave(context, 'success');
		return this.groups_tree;
	}
	
	
	this.update_node_members_count = function(arg_node)
	{
		var context = 'update_node_members_count(node)';
		this.assertNotNull(context, 'arg_node', arg_node);
		this.enter(context, arg_node.name);
		
		// GIVEN NODE HAS NO CHILDS
		if (arg_node.childs.length == 0)
		{
			arg_node.depths_members_count = arg_node.members_count;
			this.value(context, 'depths_members_count', arg_node.depths_members_count);
			this.leave(context, 'no child');
			return;
		}
		
		// GIVEN NODE HAS CHILDS
		var count = 0;
		this.value(context, 'members_count', arg_node.members_count);
		for(var node_index = 0 ; node_index < arg_node.childs.length ; node_index++)
		{
			var current_node = arg_node.childs[node_index];
			this.assertNotNull(context, 'current_node at [' + node_index + ']', current_node);
			this.update_node_members_count(current_node);
			count += arg_node.members_count * current_node.depths_members_count;
		}
		arg_node.depths_members_count = count;
		this.value(context, 'depths_members_count', arg_node.depths_members_count);
		
		this.leave(context, 'has childs');
	}
	
	
	/*
		GET A MATRIX OF MEMBERS BY DEPTH
		Example for a axis of groups A(5 members), B(2 members), C(3 members)
			A1	B1	C1
					C2
					C3
				B2	C1
					C2
					C3
			A2	B1	C1
				...
		will give the matrix
			0:	[A1,B1,C1]
			1:	[A1,B1,C2]
			2:	[A1,B1,C3]
			3:	[A1,B2,C1]
	*/
	this.get_members_matrix = function()
	{
		var context = 'get_members_matrix()';
		this.enter(context, '');
		
		// CHECK IF THE MATRIX ALREADY EXISTS
		if ( ! Libapt.is_null(this.members_matrix) )
		{
			this.leave(context, 'members matrix exists');
			return this.members_matrix;
		}
		
		// INIT
		var distinct_values_force_reload = false;
		var distinct_values_max = this.max_members_count;
		var current_positions = [];
		var members = [];
		var members_str = [];
		var max_positions = [];
		for(var group_index = 0 ; group_index < this.groups_array.length ; group_index++)
		{
			var current_group = this.groups_array[group_index];
			// var current_group_members =	current_group.field.get_all_distinct_values_for_field(distinct_values_force_reload, distinct_values_max);
			var current_group_members =	current_group.get_distinct_values(distinct_values_force_reload, distinct_values_max, this);
			
			current_positions.push(0);
			members.push(current_group_members);
			max_positions.push(current_group_members.length - 1);
			members_str.push( current_group_members.join(',') );
		}
		this.value(context, 'current_positions', current_positions.join(',') );
		this.value(context, 'max_positions', max_positions.join(',') );
		this.value(context, 'members', members_str.join(' | ') );
		// console.log(current_positions);
		// console.log(max_positions);
		// console.log(members);
		
		// CREATE MATRIX
		var tree = this.get_groups_tree();
		var max_members = tree.depths_members_count * this.groups_array.length;
		this.value(context, 'max_members', max_members);
		this.members_matrix = [];
		var loop_index = 0;
		var groups_last_index = this.groups_array.length - 1.
		while(loop_index < max_members)
		{
			var position_members = [];
			
			for(var group_index = 0 ; group_index <= groups_last_index ; group_index++)
			{
				this.step(context, 'get members: loop_index=[' + loop_index + '] group_index=[' + group_index + '] positions=[' + current_positions.join(',') + ']');
				
				var current_group = this.groups_array[group_index];
				var member_position = current_positions[group_index];
				var member = members[group_index][member_position];
				position_members.push(member);
			}
			this.members_matrix.push(position_members);
			loop_index++;
			
			// UPDATE POSITIONS
			current_positions[groups_last_index] = current_positions[groups_last_index] + 1;
			for(var group_index = groups_last_index ; group_index >= 0 ; group_index--)
			{
				this.step(context, 'update positons: loop_index=[' + loop_index + '] group_index=[' + group_index + '] positions=[' + current_positions.join(',') + ']');
				
				if (current_positions[group_index] > max_positions[group_index])
				{
					current_positions[group_index] = 0;
					if (group_index > 0)
					{
						current_positions[group_index - 1] = current_positions[group_index - 1] + 1;
					}
				}
				else
				{
					break;
				}
			}
		}
		
		this.leave(context, 'success');
		return this.members_matrix;
	}
	
	
	// PUBLIC METHOD : GET AXIS POSITION KEY
	this.get_position_key = function(arg_position_record)
	{
		var key = '';
		var groups_count = this.groups_array.length;
		for(var group_index = 0; group_index < groups_count ; group_index++)
		{
			var group_name = this.groups_array[group_index].name;
			key += (key == '' ? '' : '/') + arg_position_record[group_name];
		}
		return key;
	}
	
	this.get_position_key_from_members = function(arg_position_members)
	{
		var key = '';
		var groups_count = this.groups_array.length;
		for(var group_index = 0; group_index < groups_count ; group_index++)
		{
			key += (key == '' ? '' : '/') + arg_position_members[group_index];
		}
		return key;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('groups_array', this.groups_array)
			+ this.to_string_value('groups_map', this.groups_map)
			+ this.to_string_value('is_sparse', this.is_sparse)
			+ this.to_string_value('label', this.label)
			;
	}
}

Libapt.register_inheritance(LibaptPivotAxis, LibaptObject);
