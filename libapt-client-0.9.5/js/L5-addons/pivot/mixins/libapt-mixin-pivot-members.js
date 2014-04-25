/**
 * @file        libapt-mixin-pivot-members.js
 * @desc        Mixin for pivot members operations
 * @see			libapt-object.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinPivotMembers
 * @public
 * @desc				Mixin of view sizes operations
 */
var LibaptMixinPivotMembers =
{
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	mixin_pivot_members_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @desc				Members tree as
	 *						 group_node: { 'value'=>group_node }
	 *						 member_node: { group_name, values, all, parent, datas}
	 *						 For example:
	 *						 	groups_array = ['country', 'city', 'product', 'color']
	 *						 	members_tree = {
	 *						 		'group_name': 'country',
	 *						 		'values': {
	 *						 			'FR': {
	 *						 				'group_name': 'city',
	 *						 				'values': {
	 *						 					'PARIS': {
	 *						 						'group_name': 'product',
	 *						 						'values': {
	 *						 							'CAR': {
	 *						 								'group_name': 'color',
	 *						 								'values': {
	 *						 									'BLUE',
	 *						 									'RED',
	 *						 									'YELLOW'
	 *						 									},
	 *						 								}
	 *						 							'TRUCK': {
	 *						 								'group_name': 'color',
	 *						 								'values': {
	 *						 									'BLACK',
	 *						 									'RED',
	 *						 									'GREEN'
	 *						 									}
	 *						 								}
	 *						 							}
	 *						 						}
	 *						 					'BORDEAUX': {
	 *						 						'group_name': 'product',
	 *						 						'values': {
	 *						 							'CAR': {
	 *						 								'group_name': 'color',
	 *						 								'values': {
	 *						 									'GREEN',
	 *						 									'RED',
	 *						 									'YELLOW'
	 *						 									}
	 *						 								}
	 *						 							}
	 *						 						}
	 *						 					'LYON': {
	 *						 						'group_name': 'product',
	 *						 						'values': {
	 *						 							...
	 *						 							}
	 *						 						}
	 *						 					}
	 *						 				}
	 *						 			 'GB': {
	 *						 					...
	 *						 				}
	 *						 			}
	 *								}
	 */
	mixin_pivot_members_tree: {
			root: {
				'value': '',
				'group_name': '',
				'group_index': 0,
				'values': {},
				'parent': null,
				'datas': [],
				'all': { 'count':0 }
				},
			max_depth: 0,
			ordered_groups_names: []
		},
	
	
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @desc				Members tree as mixin_pivot_members_tree for horizontal axis
	 */
	mixin_pivot_members_h_axis_tree: {
			root: {
				'value': 'no value',
				'depth': -1,
				'children': [],
				'values':{},
				'parent': null,
				'datas': { 'tree_childs_count':0 }
				},
			max_depth: 0,
			ordered_groups_names: [],
			ordered_members_per_depth:[]
		},
	
	
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @desc				Members tree as mixin_pivot_members_tree for vertical axis
	 */
	mixin_pivot_members_v_axis_tree: {
			root: {
				'value': 'no value',
				'depth': -1,
				'children': [],
				'values': {},
				'parent': null,
				'datas': { 'tree_childs_count':0 }
				},
			max_depth: 0,
			ordered_groups_names: [],
			ordered_members_per_depth:[]
		},
	
	
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @desc				Associative array of all distinct members per group
	 *							{
	 *								'country': { 'all':member_datas, 'values':{'FR':member_datas, 'EN':member_datas, 'DE':member_datas...} },
	 *								'city': { 'all':member_datas, 'values':{'PARIS':member_datas,'BORDEAUX':member_datas,'LONDON':member_datas,'MUNICH':member_datas...} },
	 *								...
	 *							}
	 *						with member_datas as { count:integer count of occurences, ...} (later append custom stats per member)
	 */
	mixin_pivot_members_array: {},
	
	
	
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @desc				Some stats per member
	 */
	mixin_pivot_members_stats_cb: null,
	
	
	
	/**
	 * @memberof				LibaptMixinPivotMembers
	 * @public
	 * @method					get_datas_records_for_members(arg_position_members)
	 * @desc					Get datas records at given position
	 * @param {object}			arg_position_members		Associative array of groups members values
	 * @return {array|null}		Array of datas records or empty array if no datas or null if bad members
	 */
	get_datas_records_for_members: function(arg_position_members)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_members_trace);
		var context = 'get_datas_records_for_members(members)';
		self.enter(context, '');
		
		self.value(context, 'arg_position_members', arg_position_members);
		
		// GET ORDERED GROUPS
		var groups_names = self.get_ordered_groups_names();
		self.assertNotEmptyArray(context, 'groups_names', groups_names);
		// self.value(context, 'groups_names', groups_names);
		
		// GET LAST ORDERED GROUP NAME
		var last_depth_group_name = groups_names[groups_names.length - 1];
		self.value(context, 'last_depth_group_name', last_depth_group_name);
		
		// LOOP
		var datas_records = [];
		var datas_found = false;
		var current_member_node = self.mixin_pivot_members_tree.root;
		var group_index = 0;
		while(!datas_found)
		{
			var current_group_name = current_member_node.group_name;
			self.assertNotEmptyString(context, 'current_group_name', current_group_name);
			self.value(context, 'current_group_name', current_group_name);
			
			if (current_group_name === last_depth_group_name)
			{
				self.step(context, 'datas_found');
				datas_found = true;
				
				// console.log(current_member_node);
				
				var current_member = arg_position_members[group_index];
				self.value(context, 'current_member', current_member);
				
				if ( Libapt.is_object(current_member_node.values[current_member]) )
				{
					datas_records = current_member_node.values[current_member].datas;
				}
				self.value(context, 'datas_records', datas_records);
			}
			else
			{
				var current_member = arg_position_members[group_index];
				self.assertNotNull(context, 'given member not found for group [' + current_group_name + ']', current_member);
				self.value(context, 'current_member', current_member);
				
				var next_node = current_member_node.values[current_member];
				if ( Libapt.is_null(next_node) )
				{
					self.value(context, 'given members', arg_position_members);
					self.leave(context, 'given members not found');
					self.pop_trace();
					return null;
				}
				
				current_member_node = next_node;
			}
			++group_index;
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return datas_records;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinPivotMembers
	 * @public
	 * @method					get_next_position_node(arg_tree, arg_position_members_node)
	 * @desc					Get the next position members of a H or V tree
	 * @param {object}			arg_tree				Members nodes tree
	 * @param {object}			arg_positions_node		Node
	 * @return {object|null}	Position node
	 */
/*	get_next_position_node: function(arg_tree, arg_positions_node)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_members_trace);
		var context = 'get_next_position_node(tree,positions)';
		self.enter(context, '');
		
		
		// INIT RESULT NODE
		var position_node = { positions: [], members: [], tree_nodes:[] };
		// var position_node = { positions: [], members: [] };
		for(var group_index = 0 ; group_index < arg_tree.ordered_groups_names.length ; group_index++)
		{
			position_node.positions.push(null);
			position_node.tree_nodes.push(null);
			position_node.members.push(null);
		}
		
		// GET FIRST POSITION NODE
		if ( Libapt.is_null(arg_positions_node) )
		{
			self.step(context, 'GET FIRST POSITION NODE');
			
			// UPDATE POSITIONS/MEMBERS/NODES
			var current_tree_node	= arg_tree.root;
			// console.log(current_tree_node);
			for(var group_index = 0 ; group_index < arg_tree.ordered_groups_names.length ; group_index++)
			{
				var member	= current_tree_node.children[0];
				var node	= current_tree_node.values[member];
				
				position_node.positions[group_index]	= 0;
				position_node.tree_nodes[group_index]	= current_tree_node;
				position_node.members[group_index]		= member;
				
				current_tree_node = node;
			}
			// console.log(position_node);
			
			// TRACE
			self.value(context, 'position_node.positions', position_node.positions);
			self.value(context, 'position_node.members', position_node.members);
			
			self.leave(context, 'first node');
			self.pop_trace();
			return position_node;
		}
		
		// TRACE
		self.value(context, 'arg_positions_node.positions', arg_positions_node.positions);
		self.value(context, 'arg_positions_node.members', arg_positions_node.members);
		
		// GET NEXT NODE
		self.step(context, 'GET NEXT NODE');
		self.assertTrue(context, 'positions length', arg_positions_node.positions.length == arg_tree.ordered_groups_names.length);
		var move_next = false;
		for(var group_index = arg_tree.ordered_groups_names.length - 1 ; group_index >= 0  ; group_index--)
		{
			self.value(context, 'group_index', group_index);
			
			var current_member		= null;
			var current_group_name	= arg_tree.ordered_groups_names[group_index];
			var current_tree_node	= arg_positions_node.tree_nodes[group_index];
			var current_position	= arg_positions_node.positions[group_index];
			// console.log(current_tree_node);
			
			// CHECK CURRENT POSITION
			if (current_tree_node.children.length <= current_position)
			{
				self.leave(context, 'bad position for group [' + current_group_name + '] at [' + current_position + ']');
				self.pop_trace();
				return null;
			}
			
			// MOVE NEXT
			if ( ! move_next && current_tree_node.children.length > current_position + 1)
			{
				self.step(context, 'MOVE NEXT INCR at group[' + group_index + ']');
				
				++current_position;
				
				// STORE NEXT POSITION INDEX AND MEMBER
				current_member = current_tree_node.children[current_position];
				position_node.positions[group_index]	= current_position;
				position_node.members[group_index]		= current_member;
				position_node.tree_nodes[group_index]	= current_tree_node;
				
				// UPDATE CHILDS
				current_tree_node = current_tree_node.values[current_member];
				for(var child_group_index = group_index + 1 ; child_group_index < arg_tree.ordered_groups_names.length ; child_group_index++)
				{
					var current_child_position	= position_node.positions[child_group_index];
					var current_child_member	= current_tree_node.children[current_child_position];
					
					position_node.members[child_group_index]	= current_child_member;
					position_node.tree_nodes[child_group_index]	= current_tree_node;
					
					current_tree_node = current_tree_node.values[current_child_member];
				}
				
				move_next = true;
			}
			else if ( ! move_next )
			{
				self.step(context, 'MOVE NEXT RAZ at group[' + group_index + ']');
				
				current_position = 0;
				
				// STORE NEXT POSITION INDEX AND MEMBER
				current_member = current_tree_node.children[current_position];
				position_node.positions[group_index]	= current_position;
				position_node.members[group_index]		= current_member;
				position_node.tree_nodes[group_index]	= current_tree_node;
			}
			else
			{
				self.step(context, 'STORE NEXT POSITION INDEX AND MEMBER at group[' + group_index + ']');
				
				// STORE NEXT POSITION INDEX AND MEMBER
				position_node.positions[group_index]	= arg_positions_node.positions[group_index];
				position_node.members[group_index]		= arg_positions_node.members[group_index];
				position_node.tree_nodes[group_index]	= arg_positions_node.tree_nodes[group_index];
				// position_node = null;
			}
			
			
			// CHECK NODE
			if ( Libapt.is_null(current_tree_node) )
			{
				self.leave(context, 'position not found for group [' + current_group_name + '] and member [' + current_member + ']');
				self.pop_trace();
				return null;
			}	
		}
		
		// console.log(position_node);
		
		self.leave(context, 'success');
		self.pop_trace();
		return position_node;
	},*/
	
	
	
	/**
	 * @memberof			LibaptMixinPivotMembers
	 * @public
	 * @method				add_members_record(arg_record)
	 * @desc				Register the record members into the tree
	 * @param {object}		arg_record		Associative array of groups members values and datas
	 * @return {object}		This
	 */
	add_members_record: function(arg_record)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_members_trace);
		var context = 'add_members_record(record)';
		self.enter(context, '');
		
		
		// TRACE ARGS
		self.value(context, 'record', arg_record);
		
		// GET ORDERED GROUPS
		var groups_names = self.get_ordered_groups_names();
		self.assertNotEmptyArray(context, 'groups_names', groups_names);
		// self.value(context, 'groups_names', groups_names);
		
		// GET LAST ORDERED GROUP NAME
		var last_depth_group_name = groups_names[groups_names.length - 1];
		// self.value(context, 'last_depth_group_name', last_depth_group_name);
		
		// GET H AXIS ORDERED GROUPS
		var h_groups_names = self.get_ordered_h_groups_names();
		self.assertNotEmptyArray(context, 'h_groups_names', h_groups_names);
		// self.value(context, 'h_groups_names', h_groups_names);
		
		// GET V AXIS ORDERED GROUPS
		var v_groups_names = self.get_ordered_v_groups_names();
		self.assertNotEmptyArray(context, 'v_groups_names', v_groups_names);
		// self.value(context, 'v_groups_names', v_groups_names);
		
		
		// LOOP ON GROUPS NAMES
		self.step(context, 'LOOP ON GROUPS NAMES');
		self.mixin_pivot_members_tree.max_depth = groups_names.length;
		self.mixin_pivot_members_tree.ordered_groups_names = groups_names;
		var current_member_node		= self.mixin_pivot_members_tree.root;
		var current_h_members		= {};
		var current_v_members		= {};
		for(var group_name_index = 0 ; group_name_index < groups_names.length ; group_name_index++)
		{
			var current_group_name = groups_names[group_name_index];
			// self.value(context, 'current_group_name', current_group_name);
			
			var current_member = arg_record[current_group_name];
			self.assertNotNull(context, 'group member for [' + current_group_name + ']', current_member);
			// self.value(context, 'current_member_node', current_member_node);
			
			// CHECK CURRENT NODE GROUP NAME
			if (current_member_node.group_name === '')
			{
				current_member_node.group_name = current_group_name;
			}
			
			// INIT CURRENT NODE FOR CURRENT MEMBER IF NEEDED
			if ( ! current_member_node.values[current_member] )
			{
				current_member_node.values[current_member] = {
						'value': current_member,
						'group_name': '',
						'group_index':group_name_index,
						'values': {},
						'parent': current_member_node,
						'datas': [],
						'all': { 'count':0 }
					};
			}
			current_member_node.all.count += 1;
			current_member_node.values[current_member].all.count += 1;
			
			// CHANGE CURRENT TREE NODE
			current_member_node = current_member_node.values[current_member];
			
			// SET POSITION RECORDS
			if (current_group_name == last_depth_group_name)
			{
				var datas_record = {};
				for(record_key in arg_record)
				{
					if ( groups_names.indexOf(record_key) < 0 )
					{
						datas_record[record_key] = arg_record[record_key];
					}
				}
				current_member_node.datas.push(datas_record);
			}
			
			
			// REGISTER DISTINCT MEMBER
			if ( ! self.mixin_pivot_members_array[current_group_name] )
			{
				self.mixin_pivot_members_array[current_group_name] = { 'count':0, 'values': {} };
			}
			if (!self.mixin_pivot_members_array[current_group_name].values[current_member])
			{
				self.mixin_pivot_members_array[current_group_name].values[current_member] = { 'count': 0 };
			}
			self.mixin_pivot_members_array[current_group_name].values[current_member].count += 1;
			self.mixin_pivot_members_array[current_group_name].count += 1;
			if ( Libapt.is_callback(self.mixin_pivot_members_stats_cb) )
			{
				var cb_args = [ arg_record, current_member, self.mixin_pivot_members_array[current_group_name] ];
				self.do_callback(self.mixin_pivot_members_stats_cb, cb_args);
			}
			
			// CURRENT GROUP IS PART OF HORIZONTAL AXIS
			if ( h_groups_names.indexOf(current_group_name) >= 0 )
			{
				current_h_members[current_group_name] = current_member;
			}
			
			// CURRENT GROUP IS PART OF VERTICAL AXIS
			if ( v_groups_names.indexOf(current_group_name) >= 0 )
			{
				current_v_members[current_group_name] = current_member;
			}
		}
		
		
		
		// CALLBACK TO COMPARE TWO NODES
		var compare_node_cb = function(a,b)
			{
				if (a.value > b.value)
				{
					return 1;
				}
				if (a.value < b.value)
				{
					return -1;
				}
				return 0;
			};
		
		
		
		// UDPATE HORIZONTAL AXIS TREE
		self.step(context, 'UDPATE HORIZONTAL AXIS TREE');
		
		// INIT TREE IF NEEDED
		if ( self.mixin_pivot_members_h_axis_tree.ordered_members_per_depth.length == 0 )
		{
			self.mixin_pivot_members_h_axis_tree.ordered_members_per_depth = [];
			for(var depth = 0 ; depth < h_groups_names.length ; depth++)
			{
				self.mixin_pivot_members_h_axis_tree.ordered_members_per_depth.push([]);
			}
			
			self.mixin_pivot_members_h_axis_tree.max_depth = h_groups_names.length;
			self.mixin_pivot_members_h_axis_tree.ordered_groups_names = h_groups_names;
		}
		
		
		// LOOP ON GROUPS
		var current_node	= self.mixin_pivot_members_h_axis_tree.root;
		for(var depth = 0 ; depth < h_groups_names.length ; depth++)
		{
			// self.value(context, 'depth', depth);
			// self.value(context, 'current_node', current_node);
			
			var current_ordered_members_per_depth = self.mixin_pivot_members_h_axis_tree.ordered_members_per_depth[depth];
			
			var current_group_name = h_groups_names[depth];
			// self.value(context, 'current_group_name', current_group_name);
			
			var current_member = current_h_members[current_group_name];
			// self.value(context, 'current_member', current_member);
			
			// CHECK CURRENT NODE GROUP NAME
			if (current_node.group_name === '')
			{
				current_node.group_name = current_group_name;
			}
			
			// INIT CURRENT NODE FOR CURRENT MEMBER IF NEEDED
			var current_member_node = current_node.values[current_member];
			if ( Libapt.is_null(current_member_node) )
			{
				// CREATE CHILD NODE
				current_member_node = {
						'value': current_member,
						'depth': depth,
						'children': [],
						'values':{},
						'parent': current_node,
						'datas': { 'tree_childs_count':0 }
					};
				
				// UPDATE MEMBERS PER DEPTH
				current_ordered_members_per_depth.push(current_member_node);
				
				// APPEND MEMBER NODE
				current_node.values[current_member] = current_member_node;
				current_node.children.push(current_member_node);
				
				// SORT CHILDREN
				// TODO: use a custom sort (with callback?)
				// TODO: update previous and next sibling on sort
				current_node.children = current_node.children.sort( compare_node_cb );
			}
			
			
			// UPDATE STATS
			current_node.datas.tree_childs_count += 1;
			current_member_node.datas.tree_childs_count += 1;
			
			// CHANGE CURRENT TREE NODE
			current_node = current_member_node;
		}
		
		
		
		// UDPATE VERTICAL AXIS TREE
		self.step(context, 'UDPATE VERTICAL AXIS TREE')
		
		// INIT TREE IF NEEDED
		if ( self.mixin_pivot_members_v_axis_tree.ordered_members_per_depth.length == 0 )
		{
			self.mixin_pivot_members_v_axis_tree.ordered_members_per_depth = [];
			for(var depth = 0 ; depth < v_groups_names.length ; depth++)
			{
				self.mixin_pivot_members_v_axis_tree.ordered_members_per_depth.push([]);
			}
			
			self.mixin_pivot_members_v_axis_tree.max_depth = v_groups_names.length;
			self.mixin_pivot_members_v_axis_tree.ordered_groups_names = v_groups_names;
		}
		
		
		// LOOP ON GROUPS
		current_node	= self.mixin_pivot_members_v_axis_tree.root;
		for(var depth = 0 ; depth < v_groups_names.length ; depth++)
		{
			// self.value(context, 'depth', depth);
			// self.value(context, 'current_node', current_node);
			
			var current_ordered_members_per_depth = self.mixin_pivot_members_v_axis_tree.ordered_members_per_depth[depth];
			
			var current_group_name = v_groups_names[depth];
			// self.value(context, 'current_group_name', current_group_name);
			
			var current_member = current_v_members[current_group_name];
			// self.value(context, 'current_member', current_member);
			
			// CHECK CURRENT NODE GROUP NAME
			if (current_node.group_name === '')
			{
				current_node.group_name = current_group_name;
			}
			
			// INIT CURRENT NODE FOR CURRENT MEMBER IF NEEDED
			var current_member_node = current_node.values[current_member];
			if ( ! Libapt.is_null(current_member) && Libapt.is_null(current_member_node) )
			{
				// CREATE CHILD NODE
				current_member_node = {
						'value': current_member,
						'depth': depth,
						'children': [],
						'values':{},
						'parent': current_node,
						'datas': { 'tree_childs_count':0 }
					};
				
				// UPDATE MEMBERS PER DEPTH
				current_ordered_members_per_depth.push(current_member_node);
				
				// APPEND MEMBER NODE
				current_node.values[current_member] = current_member_node;
				current_node.children.push(current_member_node);
				
				// SORT CHILDREN
				// TODO: use a custom sort (with callback?)
				// TODO: update previous and next sibling on sort
				current_node.children = current_node.children.sort( compare_node_cb );
			}
			
			
			// UPDATE STATS
			current_node.datas.tree_childs_count += 1;
			current_member_node.datas.tree_childs_count += 1;
			
			// CHANGE CURRENT TREE NODE
			current_node = current_member_node;
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	}
};
