/**
 * @file        libapt-window-tu.js
 * @desc        Window view class Tests Unit
 * @see			libapt-window.js libapt-model.js
 * @group       LIBAPT_VIEWS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @memberof			LibaptWindow
 * @public
 * @static
 * @desc 			Window class generic unit tests
 * @param {string}	arg_tu_name				test name (string)
 * @param {}	arg_view_name			view name for the window content (string)
 * @param {}	arg_form_options		form options as an associative array (object or null)
 * @param {}	arg_window_options		window options as an associative array (object or null)
 * @return {nothing}
 */
LibaptWindow.tu = function(arg_tu_name, arg_view_name, arg_form_options, arg_window_options)
{
	var context = 'LibaptWindow.' + arg_tu_name + '(' + arg_view_name + ')';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	var window = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get(arg_view_name);
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = null; // get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) )
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, arg_form_options);
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0]);
		
		// CREATE WINDOW VIEW
		window = new LibaptWindow(context + '.window', form, arg_window_options);
		
		window.draw();
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log(window);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}


/**
 * @memberof			LibaptWindow
 * @public
 * @static
 * @desc 		Window class unit tests for a window with two buttons : yes and no
 * @return {nothing}
 */
LibaptWindow.tu_users_yes_no = function()
{
	var form_options = null;
	var yes_cb = function(){ console.log('YES'); };
	var no_cb = function(){ console.log('NO'); };
	var window_options = { 'format':'window_yes_no', 'yes_cb':yes_cb, 'no_cb':no_cb };
	LibaptWindow.tu('tu_users_yes_no', 'VIEW_AUTH_USERS', form_options, window_options);
}


/**
 * @memberof			LibaptWindow
 * @public
 * @static
 * @desc 		Window class unit tests for a window with one close button
 * @param {}	
 * @return {nothing}
 */
LibaptWindow.tu_users_close = function()
{
	var form_options = null;
	var window_options = { 'format':'window_close' };
	LibaptWindow.tu('tu_users_close', 'VIEW_AUTH_USERS', form_options, window_options);
}


/**
 * @memberof			LibaptWindow
 * @public
 * @static
 * @desc 		Window class unit tests for a window with one close button
 * @param {}	
 * @return {nothing}
 */
LibaptWindow.tu_users_roles_close = function()
{
	var form_options = null;
	var window_options = { 'format':'window_close', 'is_resizable':true };
	LibaptWindow.tu('tu_users_roles_close', 'VIEW_AUTH_USERS_ROLES', form_options, window_options);
}

