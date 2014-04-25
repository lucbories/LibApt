/**
 * @file        libapt-pivot-grid-checkbox.js
 * @desc        Pivot grid of checkbox cells class
 * @see			libapt-pivot-grid.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

 

/**
 * @public
 * @desc				Pivot grid of checkbox cells class
 * @param {string}		arg_name		View name
 * @param {object}		arg_jqo			Jquery object container
 * @param {object|null}	arg_options		View options
 * @return {nothing}
 */
function LibaptPivotGridCheckbox(arg_name, arg_jqo, arg_options)
{
	// CELLS RENDERS CALL BACK
	var cells_render_init_cb = function(arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_container_jqo)
		{
			var context = 'LibaptPivotGridCheckbox.cells_render_init';
			
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
						// GET CELL POSITION MEMBERS
						var members_record = position.get_named_values();
						arg_pivot_grid_obj.assertNotEmptyObjectOrArray(context, 'members_record', members_record);
						arg_pivot_grid_obj.value(context, 'members_record', members_record);
						
						// ON CREATE SUCCESS
						var ok_cb = function(datas)
							{
								// READ A FULL RECORD WITH PK
								var read_members_record = arg_pivot_grid_obj.model.read_records_with_values_sync(members_record);
								var records = Libapt.is_null(read_members_record) ? null : read_members_record;
								if ( Libapt.is_array(records) )
								{
									// console.log(records);
									arg_pivot_grid_obj.set_cell_data(arg_container_jqo, records, false);
								}
							};
						
						// ON CREATE FAILURE
						var ko_cb = function(datas)
							{
								check_jqo.attr('checked', false);
							};
						
						// CREATE RECORD
						var bool_result = arg_pivot_grid_obj.model.create_one_record(members_record, ok_cb, ko_cb);
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
						var one_record = cell_records[0];
						// console.log(one_record);
						var bool_result = arg_pivot_grid_obj.model.delete_one_record(one_record);
						if (bool_result)
						{
							arg_pivot_grid_obj.empty_cell_data(arg_container_jqo, false);
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
		};
		
	var cells_render_fill_cb = function(arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_cells_records, arg_container_jqo)
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
		};
	
	
	// UPDATE OPTIONS
	if ( ! Libapt.is_function(arg_options.cells_render_init) )
	{
		arg_options.cells_render_init = cells_render_init_cb;
	}
	if ( ! Libapt.is_function(arg_options.cells_render_fill) )
	{
		arg_options.cells_render_fill = cells_render_fill_cb;
	}
	
	
	// INHERIT
	this.inheritFrom = LibaptPivotGrid;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	
	// CONSTRUCTOR BEGIN
	this.trace				= true;
	this.class_name			= 'LibaptPivotGridCheckbox';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
}

Libapt.register_inheritance(LibaptPivotGridCheckbox, LibaptPivotGrid);
