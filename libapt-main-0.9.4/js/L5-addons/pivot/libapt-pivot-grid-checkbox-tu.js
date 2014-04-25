/**
 * @file        libapt-pivot-grid-checkbox_tu.js
 * @desc        Tests unit of Pivot grid of checkbox cells class
 * @see			libapt-pivot-grid-checkbox.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

 

/**
 * @memberof			LibaptPivotGridCheckbox
 * @public
 * @static
 * @method				LibaptPivotGridCheckbox.tu_draw_profiles_users()
 * @desc				Test LibaptPivotGridCheckbox on model "MODEL_AUTH_PROFILES_USERS"
 * @param {string}		arg_name		View name
 * @param {object}		arg_jqo			Jquery object container
 * @param {object|null}	arg_options		View options
 * @return {nothing}
 */
LibaptPivotGridCheckbox.tu_draw_profiles_users = function()
{
	var arg_container	= $( $('.row')[1] );
	var arg_name		= 'grid_checkbox_profiles_users';
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
			vaxis_fields_names: ['login']
			
			// headers_render_init: function(arg_pivot_grid_obj, arg_th_jqo)
				// {
					// arg_th_jqo.css('background-color', 'blue');
				// },
			
			// vheaders_render_init: function(arg_pivot_grid_obj, arg_axis_obj)
				// {
				// }
		};
	
	arg_container.append( $('<hr>') ).append(arg_jqo);
	var grid = new LibaptPivotGridCheckbox(arg_name, arg_jqo, arg_options);
	
	var container_jqo = arg_container.find('table').first();
	$('td', container_jqo).css('padding', '2px');
	
	grid.draw();
}


/**
 * @memberof			LibaptPivotGridCheckbox
 * @public
 * @static
 * @method				LibaptPivotGridCheckbox.tu_draw_profiles_roles()
 * @desc				Test LibaptPivotGridCheckbox on model "MODEL_AUTH_PROFILES_ROLES"
 * @return {nothing}
 */
LibaptPivotGridCheckbox.tu_draw_profiles_roles = function()
{
	var arg_container	= $( $('.row')[1] );
	var arg_name		= 'grid_checkbox_profiles_roles';
	var arg_model		= LibaptModels.get('MODEL_AUTH_PROFILES_ROLES');
	var arg_fields		= ['id_profile_role', 'profile', 'role'];
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
			vaxis_fields_names: ['role']
		};
	
	arg_container.append( $('<hr>') ).append(arg_jqo);
	
	arg_options.class_name = 'LibaptPivotGridCheckbox';
	arg_options.name = arg_name;
	arg_options.container_jqo = arg_jqo;
	var grid = LibaptViews.factory(arg_options);
	// var grid = new LibaptPivotGridCheckbox(arg_name, arg_jqo, arg_options);
	
	var container_jqo = arg_container.find('table').first();
	$('td', container_jqo).css('padding', '2px');
	
	grid.draw();
}
