/**
 * @file        libapt-table-tu.js
 * @desc		Table view class
 * @see			libapt-table.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @desc		Table class unit tests
 * @return {nothing}
 */
LibaptTable.tu_profiles_users_roles_1 = function()
{
	var context = 'LibaptTable.tu_profiles_users_roles_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var field1 = null;
	var field2 = null;
	var field3 = null;
	try
	{
		// GET MODEL
		model = LibaptModels.get('MODEL_AUTH_PROFILES_USERS_ROLES');
		
		// CREATE VIEW
		var view_options =
			{
				'model': model,
				'query_fields':['profile', 'login', 'role']
			};
		var jqo = $('.row:eq(1)');
		jqo.append( $('<hr>') );
		view = new LibaptTable('table_1', jqo, view_options);
		
		// INIT AND DRAW
		view.draw();
		
		// CELL DOUBLE CLICKABLE
		var callback2 = [view, view.on_double_clicked_cell];
		view.double_clickable('tbody tr td', callback2);
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(model);
		console.log(view);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}
