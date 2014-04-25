/**
 * @file        libapt-mixin-pivot-table.js
 * @desc        Mixin of view for table operations
 * @see			libapt-view.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewTablePivot
 * @public
 * @desc				Mixin of view sizes operations
 */
var LibaptMixinViewTablePivot =
{
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	trace_mixin_view_table: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @desc				Table jQuery object
	 */
	mixin_view_table_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @desc				Table header jQuery object
	 */
	mixin_view_table_head_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @desc				Table body jQuery object
	 */
	mixin_view_table_body_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @desc				Table footer jQuery object
	 */
	mixin_view_table_foot_jqo: null,
	
	
	mixin_view_table_members_per_col: [],
	mixin_view_table_th_per_col: [],
	mixin_view_table_tr_per_depth: [],
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				draw_empty()
	 * @desc				Draw an empty table
	 * @return {object}		This
	 */
	draw_empty: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'draw_empty()';
		self.enter(context, '');
		
		
		// CHECK CONTAINER JQO
		if ( ! self.container_jqo )
		{
			self.leave(context, 'no container jqo');
			this.pop_trace();
			return self;
		}
		
		
		// FIRE EVENT
		self.fire_event('draw-empty-begin');
		
		// CREATE MAIN TABLE NODES
		self.content_jqo = $('<div></div>');
		
		self.mixin_view_table_jqo = $('<table></table>');
		self.mixin_view_table_jqo.uniqueId();
		self.mixin_view_table_jqo.addClass('ui-widget ui-widget-content ui-widget ui-widget-content');
		self.mixin_view_table_jqo.css('margin-bottom', '0px');
		self.content_jqo.append(self.mixin_view_table_jqo);
		this.content_childs_jqo.push(this.mixin_view_table_jqo);
		
		self.mixin_view_table_head_jqo = $('<thead></thead>');
		self.mixin_view_table_head_jqo.addClass('ui-widget-header ui-widget-header');
		
		self.mixin_view_table_body_jqo = $('<tbody></tbody>');
		
		self.mixin_view_table_foot_jqo = $('<tfoot></tfoot>');
		
		self.mixin_view_table_jqo.append(self.mixin_view_table_head_jqo).append(self.mixin_view_table_body_jqo).append(self.mixin_view_table_foot_jqo);
		self.container_jqo.append(self.content_jqo);
		
		// FIRE EVENT
		self.fire_event('draw-empty-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				draw_records()
	 * @desc				Draw the table body with given records
	 * @param {array}		Table records
	 * @return {object}		This
	 */
	draw_records: function(arg_records)
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'draw_records(records)';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-records-begin');
		
		// REMOVE ALL DATAS ROWS
		self.remove_records();
		
		// GET VERTICAL GROUPS
		var v_groups = self.vaxis_object.groups_array;
		var v_groups_count = v_groups.length;
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Process cells content', 60);
		
		
		// LOOP ON VERTICAL MEMBERS
		var max_horizontal_members = self.mixin_view_table_members_per_col.length;
		var dfs_root	= self.mixin_pivot_members_v_axis_tree.root;
		var dfs_config	= {};
		var current_member_per_depth = [];
		var previous_member_per_depth = [];
		for(var depth = 0 ; depth < v_groups_count ; depth++)
		{
			current_member_per_depth.push('no member');
			previous_member_per_depth.push('no member');
		}
		
		
		var row_index = 0;
		var dfs_cb = function(node,parent,ctrl)
			{
				// console.log(node);
				
				current_member_per_depth[node.depth] = node.value;
				
				if (node.depth == v_groups_count - 1 && row_index < self.vaxis_object.max_members_count)
				{
					// CREATE NEW ROW
					var tr_jqo = $('<tr>');
					self.mixin_view_table_body_jqo.append(tr_jqo);
					tr_jqo.data('records-count', 0);
					
					// CREATE ROW HEADERS
					for(var depth = 0 ; depth < v_groups_count ; depth++)
					{
						// CREATE NEW ROW HEADER CELL
						var td_jqo = $('<td>');
						tr_jqo.append(td_jqo);
						
						// UPDATE ROW HEADER CELL LABEL
						var current_depth_member = current_member_per_depth[depth];
						td_jqo.text(current_depth_member);
						if (previous_member_per_depth[depth] == current_member_per_depth[depth])
						{
							td_jqo.text('');
						}
						
						previous_member_per_depth[depth] = current_member_per_depth[depth];
						
						// ON CELL CLICK
						// td_jqo.click( function()
							// {
								// var cell_jqo = $(this);
								// console.log('row records-count', cell_jqo.parent('tr').data('records-count') );
							// }
						// );
					}
					
					// CREATE ROW CELLS
					var current_cell_v_members = current_member_per_depth;
					for(var col_index = 0 ; col_index < max_horizontal_members ; col_index++)
					{
						var td_jqo = $('<td>');
						tr_jqo.append(td_jqo);
						td_jqo.addClass('libapt-pivot-grid-cell');
						
						var current_cell_h_members	= self.mixin_view_table_members_per_col[col_index];
						
						// GET PIVOT CURRENT POSITION MEMBERS
						var current_cell_members	= current_cell_v_members.concat(current_cell_h_members);
						td_jqo.data('ordered-members', current_cell_members);
						
						// GET PIVOT CURRENT POSITION DATAS RECORDS
						var cell_records			= self.get_datas_records_for_members(current_cell_members);
						if ( Libapt.is_array(cell_records) )
						{
							// SET CUSTOM CELL CONTENT
							self.assertTrue(context, 'fill cell for at[' + row_index + ',' + col_index + ']', self.set_cell_data(td_jqo, cell_records, true, current_cell_h_members, current_cell_v_members) );
						}
						else
						{
							td_jqo.data('records', 0);
							td_jqo.data('records-count', 0);
							td_jqo.text('');
						}
						
						// ON CELL CLICK
						if ( self.cells_render_on_click )
						{
							td_jqo.click( function()
								{
									var cell_jqo = $(this);
									self.do_callback(self.cells_render_on_click, [cell_jqo]);
								}
							);
						}
					}
					
					++row_index;
				}
			};
		t.dfs(dfs_root, dfs_config, dfs_cb);
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Process cells content');
		
		self.progress_window_obj.append_progress_label_and_value('Ending process', 100);
		
		
		// ADJUST TABLE SIZE
		self.adjust_sizes();
		
		
		// FIRE EVENT (END)
		self.fire_event('draw-records-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				remove_records()
	 * @desc				Remove draw datas
	 * @return {object}		This
	 */
	remove_records: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'remove_records()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('remove-records-begin');
		
		self.mixin_view_table_body_jqo.find('tr.libapt_table_record').remove();
		
		// FIRE EVENT (END)
		self.fire_event('remove-records-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				draw_headers()
	 * @desc				Draw headers row
	 * @return {object}		This
	 */
	draw_headers: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'draw_headers()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-headers-begin');
		
		// REMOVE EXISTING HEADERS
		self.remove_headers();
		self.remove_records();
		
		
		// DRAW HORIZONTAL AXIS HEADERS
		if (self.is_h_axis_time)
		{
			// GET VERTICAL GROUPS
			var v_groups = self.vaxis_object.groups_array;
			var v_groups_count = v_groups.length;
			
			self.assertTrue(context, 'draw h axis headers', self.draw_headers_h_time_axis_init(self.haxis_object, v_groups_count) );
			// self.assertTrue(context, 'draw h axis headers', self.draw_headers_h_axis_init() );
		}
		else
		{
			self.assertTrue(context, 'draw h axis headers', self.draw_headers_h_axis_init() );
		}
		
		// DRAW VERTICAL AXIS HEADERS
		self.assertTrue(context, 'draw v axis headers', self.draw_headers_h_axis_end() );
		
		
		// ADJUST TABLE SIZE
		self.adjust_sizes();
		
		
		// FIRE EVENT (END)
		self.fire_event('draw-headers-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				draw_headers_h_time_axis_init()
	 * @desc				Draw horizontal axis headers
	 * @return {boolean}	true:success,false:failure
	 */
	draw_headers_h_time_axis_init: function(arg_time_axis, arg_prefix_count)
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'draw_headers_h_time_axis_init()';
		self.enter(context, '');
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Init horizontal headers', 40);
		
		
		// GET HORIZONTAL GROUPS
		var h_groups = arg_time_axis.groups_array;
		var h_groups_count = h_groups.length;
		
		// GET VERTICAL GROUPS
		// var v_groups = self.vaxis_object.groups_array;
		// var v_groups_count = v_groups.length;
		
		// INIT HORIZONTAL AXIS HEADERS ROWS
		for(var depth = 0 ; depth < h_groups_count ; depth++)
		{
			var tr_jqo = $('<tr>');
			
			// APPEND HORIZONTAL HEADERS PREFIX
			var v_groups_prefix = $('<th>');
			v_groups_prefix.attr('colspan', arg_prefix_count);
			
			tr_jqo.append(v_groups_prefix);
			self.mixin_view_table_head_jqo.append(tr_jqo);
			self.mixin_view_table_tr_per_depth.push(tr_jqo);
		}
		
		// INIT TIME COUNTERS
		var time_fields_count	= 0;
		var time_cols_count		= 1;
		var colspan_per_depth	= [];
		
		// DAW YEARS HEADERS
		var has_years		= self.time_axis_has_years && Libapt.is_string(self.time_axis_year_field_name) && Libapt.is_object(self.time_axis_year_field_obj);
		var years_depth		= null;
		var years_cols		= null;
		var years_members	= [];
		var years_is_sparse	= true;
		if (has_years)
		{
			years_depth	= time_fields_count;
			var members_are_numeric		= self.time_axis_year_field_obj.value_type.toLocaleLowerCase() == 'integer';
			var members_sort_cb			= members_are_numeric ? function(a,b){return a-b} : null;
			var members_record			= self.mixin_pivot_members_array[self.time_axis_year_field_name];
			var members_values_records	= members_record['values'];
			var members_values			= Object.keys(members_values_records).sort(members_sort_cb);
			years_cols					= members_values.length;
			time_cols_count *= years_cols;
			years_members = members_values;
			++time_fields_count;
		}
		
		// DRAW QUARTERS HEADERS
		var has_quarters		= self.time_axis_has_quarters && Libapt.is_string(self.time_axis_quarter_field_name) && Libapt.is_object(self.time_axis_quarter_field_obj);
		var quarters_depth		= null;
		var quarters_cols		= null;
		var quarters_members	= [];
		var quarters_is_sparse	= false; //self.haxis_object.is_sparse;
		if (has_quarters)
		{
			quarters_depth	= time_fields_count;
			var members_are_numeric		= self.time_axis_quarter_field_obj.value_type.toLocaleLowerCase() == 'integer';
			var members_sort_cb			= members_are_numeric ? function(a,b){return a-b} : null;
			var members_record			= self.mixin_pivot_members_array[self.time_axis_quarter_field_name];
			var members_values_records	= members_record['values'];
			var members_values			= quarters_is_sparse ? Object.keys(members_values_records).sort(members_sort_cb) : ['Q1','Q2','Q3','Q4'];
			quarters_cols				= members_values.length;
			time_cols_count *= quarters_cols;
			quarters_members = members_values;
			++time_fields_count;
		}
		
		// DRAW MONTHS HEADERS
		var has_months			= self.time_axis_has_months && Libapt.is_string(self.time_axis_month_field_name) && Libapt.is_object(self.time_axis_month_field_obj);
		var months_depth		= null;
		var months_cols			= has_quarters ? 3 : 12;
		var months_members		= [];
		var months_is_sparse	= false; //self.haxis_object.is_sparse;
		if (has_months)
		{
			months_depth				= time_fields_count;
			var members_are_numeric		= self.time_axis_month_field_obj.value_type.toLocaleLowerCase() == 'integer';
			var members_sort_cb			= members_are_numeric ? function(a,b){return a-b} : null;
			var members_record			= self.mixin_pivot_members_array[self.time_axis_month_field_name];
			var members_values_records	= members_record['values'];
			var members_values			= months_is_sparse ? Object.keys(members_values_records).sort(members_sort_cb) : [1,2,3,4,5,6,7,8,9,10,11,12];
			// months_cols					= members_values.length;
			time_cols_count *= months_cols;
			months_members = members_values;
			++time_fields_count;
		}
		
		// DRAW WEEKS HEADERS
/*		var has_weeks		= self.time_axis_has_weeks && Libapt.is_string(self.time_axis_week_field_name) && Libapt.is_object(self.time_axis_week_field_obj);
		var weeks_depth		= null;
		var weeks_cols		= has_months ? 6 : (has_quarters ? 6*3 : 53);
		var weeks_members	= [];
		var weeks_is_sparse	= true; //self.haxis_object.is_sparse;
		if (has_weeks)
		{
			weeks_depth	= time_fields_count;
			var members_are_numeric		= self.time_axis_week_field_obj.value_type.toLocaleLowerCase() == 'integer';
			var members_sort_cb			= members_are_numeric ? function(a,b){return a-b} : null;
			var members_record			= self.mixin_pivot_members_array[self.time_axis_week_field_name];
			var members_values_records	= members_record['values'];
			var members_values			= null
			if (weeks_is_sparse)
			{
				members_values = Object.keys(members_values_records).sort(members_sort_cb);
			}
			else
			{
				members_values = [];
				for(var w = 1 ; w < 54 ;w++)
				{
					members_values.push(w);
				}
			}
			// weeks_cols					= members_values.length;
			// console.log(members_values);
			time_cols_count *= members_values.length;
			weeks_members = members_values;
			++time_fields_count;
		}*/
		
		// DRAW DOY HEADERS
		
		// DRAW DOM HEADERS
		
		// DRAW DOW HEADERS
		
		// DRAW HOUR HEADERS
		
		// DRAW MINUTE HEADERS
		
		
		// INIT COLUMNS SPAN
		for(var depth = h_groups_count - 1 ; depth >= 0 ; depth--)
		{
			/*if (depth == weeks_depth)
			{
				colspan_per_depth[depth] = weeks_cols;
			}
			else */if (depth == months_depth)
			{
				colspan_per_depth[depth] = months_cols;
			}
			else if (depth == quarters_depth)
			{
				colspan_per_depth[depth] = quarters_cols;
			}
			else if (depth == years_depth)
			{
				colspan_per_depth[depth] = years_cols;
			}
			else
			{
				colspan_per_depth[depth] = 0;
			}
		}
		// console.log('colspan_per_depth:', colspan_per_depth);
		
		// FILL MEMBERS PER COLUMNS
		for(var col_index = 0 ; col_index < time_cols_count ; col_index++)
		{
			self.mixin_view_table_th_per_col.push([]);
			self.mixin_view_table_members_per_col.push([]);
			for(var depth = 0 ; depth < h_groups_count ; depth++)
			{
				self.mixin_view_table_th_per_col[col_index].push(null);
				self.mixin_view_table_members_per_col[col_index].push(null);
			}
		}
		// console.log('self.mixin_view_table_th_per_col:', self.mixin_view_table_members_per_col);
		
		if (has_years)
		{	
			var span = colspan_per_depth.length > (years_depth + 1) ? colspan_per_depth[years_depth + 1] : 1;
			var members_index = 0;
			for(var col_index = 0 ; col_index < time_cols_count ; col_index += span)
			{
				self.mixin_view_table_members_per_col[col_index][years_depth] = years_members[members_index];
				++members_index;
			}
		}
		if (has_quarters)
		{	
			var span = colspan_per_depth.length > (quarters_depth + 1) ? colspan_per_depth[quarters_depth + 1] : 1;
			var members_index = 0;
			for(var col_index = 0 ; col_index < time_cols_count ; col_index += span)
			{
				self.mixin_view_table_members_per_col[col_index][quarters_depth] = quarters_members[members_index];
				++members_index;
			}
		}
		if (has_months)
		{	
			var span = colspan_per_depth.length > (months_depth + 1) ? colspan_per_depth[months_depth + 1] : 1;
			var members_index = 0;
			for(var col_index = 0 ; col_index < time_cols_count ; col_index += span)
			{
				self.mixin_view_table_members_per_col[col_index][months_depth] = months_members[members_index];
				++members_index;
			}
		}
	/*	if (has_weeks)
		{	
			var span = colspan_per_depth.length > (weeks_depth + 1) ? colspan_per_depth[weeks_depth + 1] : 1;
			var members_index = 0;
			for(var col_index = 0 ; col_index < time_cols_count ; col_index += span)
			{
				self.mixin_view_table_members_per_col[col_index][weeks_depth] = weeks_members[members_index];
				++members_index;
			}
		}*/
		// console.log('self.mixin_view_table_th_per_col:', self.mixin_view_table_members_per_col);
		
		
		// var depth = 0;
			// if (has_years)
			// {
				// 
			// }
			
		// if (self.time_axis_has_doys)
		// {
			// self.time_axis_doy_field_obj = self.query.fields_set.get_field(self.time_axis_doy_field_name);
			// arg_time_axis_obj.add_group(self.time_axis_doy_field_obj);
			// ++time_fields_count;
		// }
		// if (self.time_axis_has_doms)
		// {
			// self.time_axis_dom_field_obj = self.query.fields_set.get_field(self.time_axis_dom_field_name);
			// arg_time_axis_obj.add_group(self.time_axis_dom_field_obj);
			// ++time_fields_count;
		// }
		// if (self.time_axis_has_dows)
		// {
			// self.time_axis_dow_field_obj = self.query.fields_set.get_field(self.time_axis_dow_field_name);
			// arg_time_axis_obj.add_group(self.time_axis_dow_field_obj);
			// ++time_fields_count;
		// }
		// if (self.time_axis_has_hours)
		// {
			// self.time_axis_hour_field_obj = self.query.fields_set.get_field(self.time_axis_hour_field_name);
			// arg_time_axis_obj.add_group(self.time_axis_hour_field_obj);
			// ++time_fields_count;
		// }
		// if (self.time_axis_has_minutes)
		// {
			// self.time_axis_minute_field_obj = self.query.fields_set.get_field(self.time_axis_minute_field_name);
			// arg_time_axis_obj.add_group(self.time_axis_minute_field_obj);
			// ++time_fields_count;
		// }
		// if (self.time_axis_has_datetimes)
		// {
			// self.time_axis_datetime_field_obj = self.query.fields_set.get_field(self.time_axis_datetime_field_name);
			// arg_time_axis_obj.add_group(self.time_axis_datetime_field_obj);
			// ++time_fields_count;
		// }
		self.assertTrue(context, 'time fields count', time_fields_count > 0);
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Init horizontal headers');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				draw_headers_h_axis_init()
	 * @desc				Draw horizontal axis headers
	 * @return {boolean}	true:success,false:failure
	 */
	draw_headers_h_axis_init: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'draw_headers_h_axis_init()';
		self.enter(context, '');
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Init horizontal headers', 40);
		
		
		// GET HORIZONTAL GROUPS
		var h_groups = self.haxis_object.groups_array;
		var h_groups_count = h_groups.length;
		
		// GET VERTICAL GROUPS
		var v_groups = self.vaxis_object.groups_array;
		var v_groups_count = v_groups.length;
		
		// INIT HORIZONTAL HEADERS ROWS
		for(var depth = 0 ; depth < h_groups_count ; depth++)
		{
			var tr_jqo = $('<tr>');
			
			// APPEND HORIZONTAL HEADERS PREFIX
			var v_groups_prefix = $('<th>');
			v_groups_prefix.attr('colspan', v_groups_count);
			
			tr_jqo.append(v_groups_prefix);
			self.mixin_view_table_head_jqo.append(tr_jqo);
			self.mixin_view_table_tr_per_depth.push(tr_jqo);
		}
		
		
		// LOOP ON HORIZONTAL MEMBERS
		var col_index		= 0;
		var dfs_h_root		= self.mixin_pivot_members_h_axis_tree.root;
		var dfs_h_config	= {};
		var dfs_h_cb		= function(node,parent,ctrl)
			{
				// console.log(node);
				if ( ! Libapt.is_null(node.value) )
				{
					if ( col_index < self.haxis_object.max_members_count && ! Libapt.is_array( self.mixin_view_table_members_per_col[col_index] ) )
					{
						self.mixin_view_table_members_per_col.push([]);
						self.mixin_view_table_th_per_col.push([]);
						
						for(var depth = 0 ; depth < h_groups_count ; depth++)
						{
							self.mixin_view_table_members_per_col[col_index].push(null);
							self.mixin_view_table_th_per_col[col_index].push(null);
						}
					}
					
					if ( Libapt.is_array( self.mixin_view_table_members_per_col[col_index] ) )
					{
						self.mixin_view_table_members_per_col[col_index][node.depth] = node.value;
					}
				}
				
				if (node.depth == h_groups_count - 1)
				{
					++col_index;
				}
			};
		// console.log(dfs_h_root);
		t.dfs(dfs_h_root, dfs_h_config, dfs_h_cb);
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Init horizontal headers');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				draw_headers_h_axis_end()
	 * @desc				Draw ... axis headers
	 * @return {boolean}	true:success,false:failure
	 */
	draw_headers_h_axis_end: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'draw_headers_h_axis_end()';
		self.enter(context, '');
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Init vertical headers', 50);
		
		
		// GET HORIZONTAL AXIS GROUPS
		var h_groups = self.haxis_object.groups_array;
		var h_groups_count = h_groups.length;
		
		// GET VERTICAL AXIS GROUPS
		var v_groups = self.vaxis_object.groups_array;
		var v_groups_count = v_groups.length;
		
		// DRAW HORIZONTAL AXIS HEADERS
		for(var col_index = 0 ; col_index < self.mixin_view_table_members_per_col.length ; col_index++)
		{
			self.step(context, 'Loop at col_index[' + col_index + ']');
			
			for(var depth = 0 ; depth < h_groups_count ; depth++)
			{
				self.step(context, 'Loop at depth[' + depth + ']');
				// GET ROW AND TH
				var tr_jqo = self.mixin_view_table_tr_per_depth[depth];
				var th_jqo = null;
				
				// GET CELL CONTENT
				var cell_value	= self.mixin_view_table_members_per_col[col_index][depth];
				// self.value(context, 'cell_value', cell_value);
				
				if ( Libapt.is_null(cell_value) )
				{
					self.step(context, 'cell_value is null (should merge with previous)');
					
					var loops = 0;
					var tmp_col_index	= col_index;
					while( tmp_col_index > 0 && Libapt.is_null( self.mixin_view_table_th_per_col[tmp_col_index][depth] ) )
					{
						self.value(context, 'in loop', loops);
						++loops;
						tmp_col_index = col_index - loops;
						cell_value	= self.mixin_view_table_members_per_col[tmp_col_index][depth];
					}
					self.value(context, 'col_index', col_index);
					self.value(context, 'tmp_col_index', tmp_col_index);
					self.value(context, 'loops', loops);
					self.value(context, 'cell_value', cell_value);
					
					if (tmp_col_index >= 0 && ! Libapt.is_null(cell_value) )
					{
						self.step(context, 'merge with previous cell');
						
						// GET PREVIOUS CELL
						var th_jqo = self.mixin_view_table_th_per_col[tmp_col_index][depth];
						if ( ! Libapt.is_null(th_jqo) )
						{
							// UPDATE COLSPAN
							var colspan = parseInt( th_jqo.attr('colspan') ) || 1;
							colspan += 1;
							th_jqo.attr('colspan', colspan);
							// console.log(th_jqo);
						}
						
						self.mixin_view_table_members_per_col[col_index][depth] = cell_value;
					}
					else
					{
						self.step(context, 'could not merge with previous cell for tmp_col_index[' + tmp_col_index + ']');
					}
				}
				else
				{
					self.step(context, 'cell_value is not null[' + cell_value + ']');
					
					th_jqo = $('<th>');
					th_jqo.text(cell_value);
					self.mixin_view_table_th_per_col[col_index][depth] = th_jqo;
					
					tr_jqo.append(th_jqo);
				}
			}
		}
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Init vertical headers');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				remove_headers()
	 * @desc				Remove headers rows
	 * @return {object}		This
	 */
	remove_headers: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_table);
		var context = 'remove_headers()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('remove-headers-begin');
		
		self.mixin_view_table_head_jqo.children('.libapt_header_fields').remove();
		
		// FIRE EVENT (END)
		self.fire_event('remove-headers-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				empty_cell_data(arg_td_jqo, arg_should_render)
	 * @desc				Render an empty cell
	 * @param {object}		arg_td_jqo			Cell jQuery object
	 * @param {boolean}		arg_should_render	Should render the cell with the custom callback
	 * @return {boolean}	true:success,false:failure
	 */
	empty_cell_data : function(arg_td_jqo, arg_should_render)
	{
		var context = 'empty_cell_data(td,render?)';
		this.enter(context, '');
		
		var td_jqo = arg_td_jqo;
		var cell_records = td_jqo.data('records');
		// var cell_records = td_jqo.data('records-count');
		
		
		// UPDATE VERTICAL COUNT
		var tr_jqo		= $( td_jqo.parent()[0] );
		var tr_count	= tr_jqo.data('records-count');
		tr_count		-= cell_records.length;
		tr_jqo.data('records-count', tr_count > 0 ? tr_count : 0);
		
		// VERTICAL AXIS IS SPARSE
		if (this.vaxis_object.is_sparse && tr_count == 0)
		{
			tr_jqo.hide();
		}
		else
		{
			tr_jqo.show();
		}
		
		// UPDATE HORIZONTAL COUNT
		var td_index	= td_jqo.index();
		var tr_jqo		= this.mixin_view_table_head_jqo.children().last();
		var th_jqo		= tr_jqo.children().eq(td_index);
		var cols_records_count = th_jqo.data('records-count');
		cols_records_count -= cell_records.length;
		th_jqo.data('records-count', cols_records_count > 0 ? cols_records_count : 0);
		
		
		// HORIZONTAL AXIS IS SPARSE
		if (this.haxis_object.is_sparse && cols_records_count == 0)
		{
			th_jqo.hide();
			this.mixin_view_table_body_jqo.children('tr').find('td[index="'+td_index + '"]').hide();
		}
		else
		{
			th_jqo.show();
			this.mixin_view_table_body_jqo.children('tr').find('td[index="'+td_index + '"]').show();
		}
		
		// RESET RECORDS DATAS
		td_jqo.data('records', []);
		td_jqo.data('records-count', 0);
		
		// RENDER CELL
		if ( arg_should_render && Libapt.is_function(this.cells_render_fill) )
		{
			var position = this.table_cells_pos_by_key[hvkey];
			this.assertNotNull(context, 'position', position);
			
			var current_vmembers = position.ordered_axis_positions[0].get_values();
			var current_hmembers = position.ordered_axis_positions[1].get_values();
			this.assertNotNull(context, 'current_vmembers', current_vmembers);
			this.assertNotNull(context, 'current_hmembers', current_hmembers);
		
			this.cells_render_fill(this, current_hmembers, current_vmembers, null, td_jqo);
		}
		
		this.leave(context, 'success');
		return true;
	},
	
	
	/**
	 * @memberof			LibaptMixinViewTablePivot
	 * @public
	 * @method				set_cell_data(arg_td_jqo, arg_records, arg_should_render, arg_h_members, arg_v_members)
	 * @desc				Fill and render a cell
	 * @param {object}		arg_td_jqo			Cell jQuery object
	 * @param {array}		arg_records			Array of datas records
	 * @param {boolean}		arg_should_render	Should render the cell with the custom callback
	 * @param {array}		arg_h_members		Array of cell position horizontal members
	 * @param {array}		arg_v_members		Array of cell position vertical members
	 * @return {boolean}	true:success,false:failure
	 */
	set_cell_data : function(arg_td_jqo, arg_records, arg_should_render, arg_h_members, arg_v_members)
	{
		var context = 'set_cell_data(td,records,render?)';
		this.enter(context, '');
		
		var td_jqo = arg_td_jqo;
		var cell_records = arg_records;
		this.assertNotNull(context, 'records', arg_records);
		
		td_jqo.data('records', cell_records);
		td_jqo.data('records-count', cell_records.length);
		
		// UPDATE VERTICAL COUNT
		var tr_jqo		= td_jqo.parent('tr');
		var tr_count	= tr_jqo.data('records-count');
		tr_count		+= cell_records.length;
		tr_jqo.data('records-count', tr_count);
		tr_jqo.attr('title', tr_count + LibaptI18n.tr(' records'));
		// console.log(tr_jqo);
		
		// VERTICAL AXIS IS SPARSE
		if (this.vaxis_object.is_sparse && tr_count == 0)
		{
			// tr_jqo.hide();
		}
		else
		{
			tr_jqo.show();
		}
		
		// UPDATE HORIZONTAL COUNT
		var td_index	= td_jqo.index();
		this.value(context, 'td_index', td_index);
		
		var tr_jqo		= this.mixin_view_table_head_jqo.children().last();
		var th_jqo		= tr_jqo.children().eq(td_index);
		var cols_records_count = th_jqo.data('records-count');
		cols_records_count += cell_records.length;
		th_jqo.data('records-count', cols_records_count);
		this.value(context, 'cols_records_count', cols_records_count);
		
		// HORIZONTAL AXIS IS SPARSE
		if (this.haxis_object.is_sparse && cols_records_count == 0)
		{
			th_jqo.hide();
			this.mixin_view_table_body_jqo.children('tr').find('td[index="'+td_index + '"]').hide();
		}
		else
		{
			th_jqo.show();
			this.mixin_view_table_body_jqo.children('tr').find('td[index="'+td_index + '"]').show();
		}
		
		// RENDER CELL
		if ( arg_should_render && Libapt.is_function(this.cells_render_fill) )
		{
			var current_vmembers = arg_v_members;
			var current_hmembers = arg_h_members;
			this.assertNotNull(context, 'current_vmembers', current_vmembers);
			this.assertNotNull(context, 'current_hmembers', current_hmembers);
		
			this.cells_render_fill(this, current_hmembers, current_vmembers, cell_records, td_jqo);
		}
		else
		{
			this.step(context, 'should no render or not render function');
		}
		
		this.leave(context, 'success');
		return true;
	}
};
