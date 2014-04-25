/**
 * @file        libapt-toolbar.js
 * @brief       Toolbar class
 * @details     ...
 * @see			libapt-action.js libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-24
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @brief		Toolbar class : a set of actions draw into a toolbar
 * @param[in]	arg_name			View unique name (string)
 * @param[in]	arg_container_obj	JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptToolbar(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptToolbar';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	/**
	 * @brief		Default options for the toolbar class
	 */
	var default_options = {
		'render_template'	: null,
		'render_begin'		: null,
		'render_separator'	: null,
		'render_end'		: null
	}
	
	// VIEW ATTRIBUTES
	this.actions = {};
	$.extend(this, default_options, get_arg_not_null(arg_options, {}));
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	/**
	 * @brief		Add an action to the toolbar
	 * @param[in]	arg_action_object	 Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return		boolean				true:success,false:failure
	 */
	this.add_action = function(arg_action_object)
	{
		var context = 'add_action(' + arg_action_object.name + ')';
		this.enter(context, '');
		
		this.assertNotNull(context, 'action', arg_action_object);
		// TODO this.assertInherit(context, 'action', arg_action_object, LibaptAction);
		this.actions[arg_action_object.name] = arg_action_object;
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Enable all  toolbar actions
	 * @return		boolean				true:success,false:failure
	 */
	this.enable = function()
	{
		var context = 'enable()';
		this.enter(context, '');
		
		for(action_key in this.actions)
		{
			this.actions[action_key].enable();
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Disable all  toolbar actions
	 * @return		boolean				true:success,false:failure
	 */
	this.disable = function()
	{
		var context = 'disable()';
		this.enter(context, '');
		
		for(action_key in this.actions)
		{
			this.actions[action_key].disable();
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Remove an action from the toolbar
	 * @param[in]	arg_action_name		Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return		boolean				true:success,false:failure
	 */
	this.remove_action = function(arg_action_name)
	{
		var context = 'remove_action(' + arg_action_name + ')';
		this.enter(context, '');
		
		var index = this.actions.lastIndexOf(arg_action_name);
		if (index >= 0)
		{
			this.actions.splice(index, 1);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Enable a toolbar action
	 * @param[in]	arg_action_name		Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return		boolean				true:success,false:failure
	 */
	this.enable_action = function(arg_action_name)
	{
		var context = 'enable_action(' + arg_action_name + ')';
		this.enter(context, '');
		
		var action = this.actions[arg_action_name];
		if ( ! Libapt.is_null(action) )
		{
			action.enable();
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Disable a toolbar action
	 * @param[in]	arg_action_name		Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return		boolean				true:success,false:failure
	 */
	this.disable_action = function(arg_action_name)
	{
		var context = 'disable_action(' + arg_action_name + ')';
		this.enter(context, '');
		
		var action = this.actions[arg_action_name];
		if ( ! Libapt.is_null(action) )
		{
			action.disable();
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Toggle the enabled status of a toolbar action
	 * @param[in]	arg_action_name		Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return		boolean				true:success,false:failure
	 */
	this.toggle_enabled_action = function(arg_action_name)
	{
		var context = 'toggle_enabled_action(' + arg_action_name + ')';
		this.enter(context, '');
		
		var action = this.actions[arg_action_name];
		if ( ! Libapt.is_null(action) )
		{
			action.toggle_enabled();
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw toolbar
	 * @return		boolean			true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		
		// CHECK ACTIONS
		this.assertNotNull(context, 'actions', this.actions);
		
		// INIT TOOLBAR BEGIN
		this.content_jqo = $('<span></span>');
		
		// DRAW TOOLBAR BEGIN
		if ( ! Libapt.is_empty_str_or_null(this.render_begin) )
		{
			this.content_jqo.append( $(this.render_begin) );
		}
		
		// LOOP ON ACTION AND DRAW IT
		var action_count = 0;
		for(action_key in this.actions)
		{
			var action = this.actions[action_key];
			if (action_count > 0 && ! Libapt.is_empty_str_or_null(this.render_separator) )
			{
				this.content_jqo.append( $(this.render_separator) );
			}
			this.assert(context, 'action[' + action.name + ']', action.draw_button(this.content_jqo, null, null) );
		}
		
		// DRAW TOOLBAR END
		if ( ! Libapt.is_empty_str_or_null(this.render_end) )
		{
			this.content_jqo.append( $(this.render_end) );
		}
		
		// ADJUST TITLE BAR
		this.container_jqo.append(this.content_jqo);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return
			this.to_string_value('render_template', this.render_template)
			+ this.to_string_value('render_begin', this.render_begin)
			+ this.to_string_value('render_separator', this.render_separator)
			+ this.to_string_value('render_end', this.render_end)
			+ this.to_string_value('actions.length', this.actions.length)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptToolbar, LibaptView);



/**
 * @brief		Actions toolbar class generic unit tests
 * @param[in]	arg_tu_name				Test name (string)
 * @param[in]	arg_view_name			Model view name for the toolbar actions (string)
 * @param[in]	arg_toolbar_options		Toolbar options as an associative array (object or null)
 * @return		nothing
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
 * @brief		Toolbar unit test on the USERS
 * @return		nothing
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

