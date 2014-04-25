/**
 * @file        libapt-crud-action-tu.js
 * @desc        Crud action class Tests Unit
 * @see			libapt-crud-action.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

 

/**
 * @desc					Crud action class generic unit tests
 * @param {string}			arg_tu_name				test name ()
 * @param {string}			arg_view_name			view name for the window content
 * @param {string}			arg_action_type			action type
 * @param {object|null}		arg_action_options		action options as an associative array
 * @return {nothing}
 */
LibaptCrudAction.tu = function(arg_tu_name, arg_view_name, arg_action_type, arg_action_options)
{
	var context = 'LibaptCrudAction.' + arg_tu_name + '(' + arg_view_name + ')';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var view = null;
	var action = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get(arg_view_name);
		tu.assertNotNull(context, 'view', view);
		
		// CREATE VIEW
		var jqo = $('.row:eq(1)');
		jqo.append( $('<hr>') );
		view = new LibaptTable('table_1', view.model, view.model.fields_set.fields, null, null, null, null, jqo);
		
		// INIT AND DRAW
		view.init_selectable();
		view.draw();
		
		// CREATE THE ACTION
		action = new LibaptCrudAction(context + '.action', view, arg_action_type, arg_action_options);
		// console.log(action);
		return action;
		// DO THE ACTION
		// var operands = null;
		// action.do_action(operands);
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(action);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
	return null;
}


/**
 * @desc		Refresh action unit test
 * @return {nothing}
 */
LibaptCrudAction.tu_users_refresh = function()
{
	var action_options = null;
	LibaptCrudAction.tu('tu_users_refresh', 'VIEW_AUTH_USERS', 'refresh', action_options);
}


/**
 * @desc		Create action unit test
 * @return {nothing}
 */
LibaptCrudAction.tu_users_create = function()
{
	var action_options = null;
	LibaptCrudAction.tu('tu_users_create', 'VIEW_AUTH_USERS', 'create', action_options);
}


/**
 * @desc		Update action unit test
 * @return {nothing}
 */
LibaptCrudAction.tu_users_update = function()
{
	var action_options = null;
	LibaptCrudAction.tu('tu_users_update', 'VIEW_AUTH_USERS', 'update', action_options);
}


/**
 * @desc		Delete action unit test
 * @return {nothing}
 */
LibaptCrudAction.tu_users_delete = function()
{
	var action_options = null;
	LibaptCrudAction.tu('tu_users_delete', 'VIEW_AUTH_USERS', 'delete', action_options);
}



/**
 * @desc		Refresh action unit test
 * @return {nothing}
 */
LibaptCrudAction.tu_users_roles_refresh = function()
{
	var action_options = null;
	LibaptCrudAction.tu('tu_users_roles_refresh', 'VIEW_AUTH_USERS_ROLES', 'refresh', action_options);
}


/**
 * @desc		Create action unit test
 * @return {nothing}
 */
LibaptCrudAction.tu_users_roles_create = function()
{
	var action_options = null;
	// var yes_cb = function(){ console.log('YES'); };
	// var no_cb = function(){ console.log('NO'); };
	// var window_options = { 'format':'window_yes_no', 'yes_cb':yes_cb, 'no_cb':no_cb };
	
	LibaptCrudAction.tu('tu_users_roles_refresh', 'VIEW_AUTH_USERS_ROLES', 'create', action_options);
}

