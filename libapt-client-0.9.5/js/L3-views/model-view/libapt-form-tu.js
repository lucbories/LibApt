/**
 * @file        libapt-form-tu.js
 * @desc        Form lodel view class to generate model crud form
 * @see			libapt-form-tu.js
 * @group       LIBAPT_VIEWS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @desc				Form class unit tests with users model
 * @param {object}		arg_optional_target_jqo		JQuery object to attach the view to
 * @return {nothing}
 */
LibaptForm.tu_users_1 = function(arg_optional_target_jqo)
{
	var context = 'LibaptForm.tu_users_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get('VIEW_AUTH_USERS');
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) );
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, no_options);
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0]);
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}



/**
 * @desc			Form class unit tests with users roles model
 * @param {object}	arg_optional_target_jqo		JQuery object to attach the view to
 * @return {nothing}
 */
LibaptForm.tu_users_roles_1 = function(arg_optional_target_jqo)
{
	var context = 'LibaptTable.tu_users_roles_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get('VIEW_AUTH_USERS_ROLES');
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) );
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, {'format':'table', 'max_cols':4} );
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0], 'table');
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}



/**
 * @desc			Form class unit tests with activities model
 * @param {object}	arg_optional_target_jqo		JQuery object to attach the view to
 * @return {nothing}
 */
LibaptForm.tu_activities_1 = function(arg_optional_target_jqo)
{
	var context = 'LibaptTable.tu_activities_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get('VIEW_CALENDARS_DOM_ACTIVITIES_TABLE');
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) );
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, {'format':'table', 'max_cols':4} );
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0], 'table');
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}
