/**
 * @file        libapt-pivot-grid-tu.js
 * @desc        Test unit of Pivot grid class
 * @see			libapt-pivot-grid.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @static
 * @method				LibaptPivotGrid.tu_draw()
 * @desc				TU Pivot grid class
 * @return {nothing}
 */
LibaptPivotGrid.tu_draw = function()
{
	var arg_name		= 'grid1';
	var arg_model		= LibaptModels.get('MODEL_AUTH_PROFILES_USERS_ROLES');
	var arg_fields		= ['profile', 'role', 'login'];
	var arg_filters		= null;
	var arg_orders		= null;
	var arg_groups		= null;
	var arg_slice		= null;
	var arg_jqo			= $('<div></div>');
	
	var arg_options =
		{
			model:			arg_model,
			query_fields:	arg_fields,
			query_filters:	arg_filters,
			query_orders:	arg_orders,
			query_groups:	arg_groups,
			query_slice:	arg_slice, 
			
			haxis_label: 'H Axis',
			vaxis_label: 'V Axis',
			
			haxis_max_members: 7,
			vaxis_max_members: 20,
			
			haxis_is_sparse: true,
			vaxis_is_sparse: true,
			
			haxis_fields_names: ['login'],
			vaxis_fields_names: ['profile'],
			
			cells_render_fill: function(arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_cells_records, arg_container_jqo)
				{
					if ( ! arg_cells_records )
					{
						arg_cells_records = [];
					}
					// var str = 'records=' + arg_cells_records.length;
					var str = '';
					for(record_index in arg_cells_records)
					{
						var record = arg_cells_records[record_index];
						for(value_key in record)
						{
							str += record[value_key] + ',';
						}
						str += '<br>';
					}
					
					arg_container_jqo.attr('title', str);
					arg_container_jqo.text( arg_cells_records.length );
				}
		};
	
	$( $('.row')[1] ).append( $('<hr>') ).append(arg_jqo);
	var grid = new LibaptPivotGrid(arg_name, arg_jqo, arg_options);
	
	grid.draw();
}




LibaptPivotGrid.tu_draw_checkbox = function()
{
	var arg_name		= 'grid2';
	var arg_model		= LibaptModels.get('MODEL_AUTH_PROFILES_USERS');
	var arg_fields		= ['id_profile_user', 'profile', 'login'];
	var arg_filters		= null;
	var arg_orders		= null;
	var arg_groups		= null;
	var arg_slice		= null;
	var arg_jqo			= $('<div></div>');
	
	var arg_options =
		{
			model:			arg_model,
			query_fields:	arg_fields,
			query_filters:	arg_filters,
			query_orders:	arg_orders,
			query_groups:	arg_groups,
			query_slice:	arg_slice, 
			
			haxis_label: 'H Axis',
			vaxis_label: 'V Axis',
			
			haxis_max_members: 20,
			vaxis_max_members: 40,
			
			haxis_is_sparse: false,
			vaxis_is_sparse: false,
			
			haxis_fields_names: ['profile'],
			vaxis_fields_names: ['login'],
			
			// headers_render_init: function(arg_pivot_grid_obj, arg_th_jqo)
				// {
					// arg_th_jqo.css('background-color', 'blue');
				// },
			
			// vheaders_render_init: function(arg_pivot_grid_obj, arg_axis_obj)
				// {
				// },
			
			cells_render_init: function(arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_container_jqo)
				{
					var context = 'LibaptPivotGrid.cells_render_init';
					
					var check_jqo = $('<input type="CHECKBOX"/>');
					check_jqo.attr('checked', false);
					arg_container_jqo.append(check_jqo);
					arg_container_jqo.css('text-align', 'center');
					
					check_jqo.change(
						function()
						{
							var is_checked = check_jqo.is(':checked');
							
							// GET POSITION IN PIVOT GRID
							var position = arg_container_jqo.data('grid-position');
							arg_pivot_grid_obj.assertNotNull(context, 'position', position);
							
							
							// CHANGE: NO CHECKED -> CHECKED
							if (is_checked)
							{
								var members_record = position.get_named_values();
								
								arg_pivot_grid_obj.assertNotEmptyObjectOrArray(context, 'members_record', members_record);
								
								var ok_cb = function(datas)
									{
										// READ A FULL RECORD WITH PK
										members_record = arg_model.read_records_with_values_sync(members_record);
										var records = Libapt.is_null(members_record) ? null : [members_record];
										if ( Libapt.is_array(members_record) )
										{
											arg_pivot_grid_obj.set_cell_data(arg_container_jqo, records, false);
										}
									};
								
								var bool_result = arg_model.create_one_record(members_record, ok_cb);
								if (!bool_result)
								{
									check_jqo.attr('checked', false);
									
									// TODO TRACE ERROR
									return;
								}
								
							}
							// CHANGE: CHECKED -> NO CHECKED
							else
							{
								var cell_records = arg_container_jqo.data('records');
								if ( ! Libapt.is_array(cell_records) && cell_records.length == 1)
								{
									// TODO TRACE ERROR
									return;
								}
								
								var bool_result = arg_model.delete_one_record(cell_records[0]);
								if (bool_result)
								{
									LibaptViews.get(arg_name).empty_cell_data(arg_container_jqo, false);
								}
								else
								{
									check_jqo.attr('checked', true);
									
									// TODO TRACE ERROR
									return;
								}
							}
						}
					);
				},
				
			cells_render_fill: function(arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_cells_records, arg_container_jqo)
				{
					var check_jqo = $('input', arg_container_jqo);
					
					if ( Libapt.is_null(check_jqo) ) 
					{
						// TODO TRACE ERROR
						return;
					}
					// self.assertNotNull('cells_render_fill', 'checkbox', check_jqo);
					
					// NO RECORDS FOUND
					if ( ! arg_cells_records )
					{
						check_jqo.attr('checked', false);
					}
					// ONE RECORD FOUND
					else
					{
						check_jqo.attr('checked', true);
					}
				}
		};
	
	$( $('.row')[1] ).append( $('<hr>') ).append(arg_jqo);
	var grid = new LibaptPivotGrid(arg_name, arg_jqo, arg_options);
	
	var container_jqo = $( $('.row')[1] ).find('table').first();
	('td', container_jqo).css('padding', '2px');
	
	grid.draw();
}