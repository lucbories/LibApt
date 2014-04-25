/**
 * @file        libapt-toolbar-tu.js
 * @desc        Toolbar class Tests 
 * @see			libapt-action.js libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-03-24
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @static
 * @method					LibaptToolbar.tu(arg_tu_name, arg_view_name, arg_toolbar_options);
 * @desc					Actions toolbar class generic unit tests
 * @param {string}			arg_tu_name				Test name
 * @param {string}			arg_view_name			Model view name for the toolbar actions
 * @param {object|null}		arg_toolbar_options		Toolbar options as an associative array
 * @return {nothing}
 */
LibaptToolbar.tu = function(arg_tu_name, arg_view_name, arg_toolbar_options)
{
	var context = 'LibaptToolbar.' + arg_tu_name + '(' + arg_view_name + ')';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var view = null;
	var toolbar = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get(arg_view_name);
		tu.assertNotNull(context, 'view', view);
		view.selected_first_row = $('#' + view.name + ' tzble tbody tr:eq(1)');
		
		// CREATE TOOLBAR VIEW
		var jqo = $('.row:eq(1)');
		jqo.append( $('<hr>') );
		toolbar = new LibaptToolbar(context + '_toolbar', jqo, arg_toolbar_options);
		
		// CREAT AND ADD TOOLBAR ACTIONS ON THE MODEL VIEW
		var action_options = null;
		var action1 = new LibaptCrudAction('create', view, 'create', action_options);
		var action2 = new LibaptCrudAction('refresh', view, 'refresh', action_options);
		var action3 = new LibaptCrudAction('update', view, 'update', action_options);
		var action4 = new LibaptCrudAction('delete', view, 'delete', action_options);
		toolbar.add_action(action1);
		toolbar.add_action(action2);
		toolbar.add_action(action3);
		toolbar.add_action(action4);
		
		// INIT AND DRAW VIEW
		toolbar.draw();
		
		return toolbar;
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(toolbar);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
	return null;
}


/**
 * @public
 * @static
 * @method				LibaptToolbar.tu_users_toolbar();
 * @desc				Toolbar unit test on the USERS
 * @return {nothing}
 */
LibaptToolbar.tu_users_toolbar = function()
{
	var toolbar_options =
		{
			'render_template'	: null,
			'render_begin'		: '<table><tr><td>',
			'render_separator'	: '</td><td>',
			'render_end'		: '</td></tr></table>',
			'actions'			: {}
		};
	LibaptToolbar.tu('tu_users_toolbar', 'VIEW_AUTH_USERS', toolbar_options);
}

