/**
 * @file        libapt-pivot-axis.js
 * @brief       Pivot axis class
 * @details     ...
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Pivot axis class
 */
function LibaptPivotTableRender(arg_grid)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom('render', false);
	Libapt.register_inheritance(LibaptPivotTableRender, LibaptObject);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptPivotTableRender';
	var context				= this.class_name + '()';
	this.enter(context, 'constructor');
	
	
	this.grid				= arg_grid;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Render...
	 * @return		boolean			true:success,false:failure
	 */
	this.render_table_head = function(arg_table_head_jqo, arg_pivot_haxis_object, arg_pivot_vaxis_object)
	{
		var context = 'render_table_head(tr)';
		this.enter(context, '');
		
		
		// GET GROUPS TREE
		var htree = arg_pivot_haxis_object.get_groups_tree();
		
		// GET VAXIS PREFIX
		var vgroups_count	= arg_pivot_vaxis_object.groups_array.length;
		var vaxis_prefix	= '';
		for(var group_index = 0 ; group_index < vgroups_count ; group_index++)
		{
			vaxis_prefix += '<th></th>';
		}
		
		// INIT
		var distinct_values_force_reload = false;
		var distinct_values_max = arg_pivot_haxis_object.max_members_count;
		var tr_jqo = null;
		
		
		var depth = 0;
		var max_depth = arg_pivot_haxis_object.groups_nodes_by_depth.length;
		while(depth < max_depth)
		{
			this.value(context, 'depth', depth);
			
			// GET DEPTH GROUP NODE
			var current_group_node = arg_pivot_haxis_object.groups_nodes_by_depth[depth];
			this.value(context, 'current_group_node.name', current_group_node.name);
			this.value(context, 'current_group_node.members_count', current_group_node.members_count);
			this.value(context, 'current_group_node.depths_members_count', current_group_node.depths_members_count);
			
			// CREATE NEW ROW
			tr_jqo = $('<tr></tr>');
			arg_table_head_jqo.append(tr_jqo);
			if (vaxis_prefix != '')
			{
				tr_jqo.append( $(vaxis_prefix) );
			}
			
			// LOOP ON PARENT MEMBERS
			var parent_node = current_group_node.parent_node;
			var parent_node_members_count = 1;
			while(parent_node)
			{
				parent_node_members_count *= Libapt.is_null(parent_node) ? 1 : parent_node.members_count;
				parent_node = parent_node.parent_node;
			}
			for(var parent_members_index = 0 ; parent_members_index < parent_node_members_count ; parent_members_index++)
			{
				this.value(context, 'parent_members_index', parent_members_index);
				
				// LOOP ON DEPTH MEMBERS
				var current_members	= current_group_node.group.get_distinct_values(distinct_values_force_reload, distinct_values_max, arg_pivot_haxis_object);
				this.value(context, 'current_members.length', current_members.length);
				// for(var member_index = 0 ; member_index < current_group_node.members_count ; member_index++)
				for(var member_index = 0 ; member_index < current_members.length ; member_index++)
				{
					var current_member_record	= current_members[member_index];
					var current_member_value	= current_member_record[current_group_node.group.field.name];
					this.value(context, 'member_index', member_index);
					this.value(context, 'current_member_value', current_member_value);
					
					var colspan = (current_members.members_count == current_group_node.depths_members_count) ? 1 : current_group_node.depths_members_count / current_members.members_count ;
					var th_jqo = $('<th class="libapt-pivot-grid-header"></th>');
					tr_jqo.append(th_jqo);
					th_jqo.attr('colspan', colspan);
					th_jqo.text(current_member_value);
					th_jqo.data('records-count', 0);
				}
			}
			depth++;
		}
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Render...
	 * @return		boolean			true:success,false:failure
	 */
	this.render_table_head_tr_node = function(arg_table_head_tr_jqo, arg_pivot_group_node_object)
	{
		var context = 'render_table_head_tr_node(tr,group_node)';
		this.enter(context, '');
		
		var th_jqo = $('<th></th>');
		arg_table_head_tr_jqo.append(th_jqo);
		th_jqo.attr('colspan', arg_pivot_group_node_object.depths_members_count);
		th_jqo.val(arg_pivot_group_node_object.group.label);
		th_jqo.data('records-count', 0);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Render...
	 * @return		boolean			true:success,false:failure
	 */
	this.render_table_body = function(arg_table_body_jqo, arg_pivot_haxis_object, arg_pivot_vaxis_object)
	{
		var context = 'render_table_body(body,haxis,vaxis)';
		this.enter(context, '');
		
		
		// INIT HORIZONTAL GROUPS
		var htree			= arg_pivot_haxis_object.get_groups_tree();
		var hgroups_count	= arg_pivot_haxis_object.groups_array.length;
		var haxis_max_cells	= htree.depths_members_count;
		
		
		// INIT VERTICAL GROUPS
		var vtree			= arg_pivot_vaxis_object.get_groups_tree();
		var vmatrix			= arg_pivot_vaxis_object.get_members_matrix();
		var vgroups_count	= arg_pivot_vaxis_object.groups_array.length;
		var vaxis_max_rows	= vtree.depths_members_count * vgroups_count;
		
		
		// INIT VERTICAL GROUPS EMPTY MEMBERS
		var current_member_value	= '';
		var previous_member_values	= [];
		for(var group_index = 0 ; group_index < vgroups_count ; group_index++)
		{
			previous_member_values.push('');
		}
		
		
		// LOOP ON ROWS
		this.step(context, 'LOOP ON ROWS');
		for(var row_index = 0 ; row_index < vaxis_max_rows ; row_index++)
		{
			// CREATE NEW ROW
			tr_jqo = $('<tr></tr>');
			arg_table_body_jqo.append(tr_jqo);
			tr_jqo.data('records-count', 0);
			
			// LOOP ON VERTICAL GROUPS
			this.step(context, 'LOOP ON GROUPS at row[' + row_index + ']');
			for(var group_index = 0 ; group_index < vgroups_count ; group_index++)
			{
				var colspan = 1;
				current_member_value = vmatrix[row_index][group_index];
				this.step(context, 'LOOP ON GROUPS at group_index[' + group_index + '] member=[' + current_member_value + ']');
				
				if (current_member_value == previous_member_values[group_index])
				{
					current_member_value = '';
				}
				var td_jqo = $('<td></td>');
				tr_jqo.append(td_jqo);
				td_jqo.attr('colspan', colspan);
				td_jqo.data('records-count', 0);
				td_jqo.text(current_member_value);
				
				previous_member_values[group_index] = current_member_value == '' ? previous_member_values[group_index] : current_member_value;
			}
			
			// APPEND EMPTY CELLS
			this.step(context, 'APPEND EMPTY CELLS at row[' + row_index + ']');
			for(var cell_index = 0 ; cell_index < haxis_max_cells ; cell_index++)
			{
				// var colspan = 1;
				var td_jqo = $('<td></td>');
				tr_jqo.append(td_jqo);
				// td_jqo.attr('colspan', colspan);
				// td_jqo.data('records-count', 0);
			}
		}
		// console.log( $('tr', arg_table_body_jqo) );
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Render...
	 * @return		boolean			true:success,false:failure
	 */
	this.render = function(arg_table_head_jqo, arg_pivot_group_nodes_array, arg_repeat_count)
	{
		var context = 'render(head,group_nodes,repeat_count)';
		this.enter(context, '');
		
		
		this.leave(context, 'success');
		return true;
	}
}
