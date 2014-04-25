	/**
 * @file        libapt-toolbar.js
 * @desc        Toolbar class
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
 * @class					LibaptToolbar
 * @desc					Toolbar class : a set of actions draw into a toolbar
 * @param {string}			arg_name			View name
 * @param {object}			arg_container_jqo	JQuery object to attach the view to
 * @param {object|null}		arg_options			Associative array of options
 * @return {nothing}
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
	 * @desc		Default options for the toolbar class
	 */
	var default_options = {
		render_template:	null,
		render_begin:		null,
		render_separator:	null,
		render_end:			null,
		is_enabled:			true
	}
	
	// VIEW ATTRIBUTES
	this.actions = {};
	$.extend(this, default_options, get_arg_not_null(arg_options, {}));
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	/**
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Add an action to the toolbar
	 * @param {object}			arg_action_object	 Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return {boolean}		true:success,false:failure
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
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Get a toolbar action by name
	 * @param {object}			arg_action_name		Action to add to the toolbar (object inheriting from LibaptAction)
	 * @return {boolean}		true:success,false:failure
	 */
	this.get_action = function(arg_action_name)
	{
		var context = 'get_action(' + arg_action_name + ')';
		this.enter(context, '');
		
		var action = this.actions[arg_action_name];
		
		this.leave(context, Libapt.is_null(action) ? 'not found' : 'found');
		return action;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Enable all toolbar actions
	 * @return {boolean}		true:success,false:failure
	 */
	this.enable = function()
	{
		var context = 'enable()';
		this.enter(context, '');
		
		for(action_key in this.actions)
		{
			this.actions[action_key].enable();
		}
		this.is_enabled = true;
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Disable all toolbar actions
	 * @return {boolean}		true:success,false:failure
	 */
	this.disable = function()
	{
		var context = 'disable()';
		this.enter(context, '');
		
		for(action_key in this.actions)
		{
			this.actions[action_key].disable();
		}
		this.is_enabled = false;
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Remove an action from the toolbar
	 * @param {object}			arg_action_name		Action to remove from the toolbar (object inheriting from LibaptAction)
	 * @return {boolean}		true:success,false:failure
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
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Enable a toolbar action
	 * @param {object}			arg_action_name		Action to enable on the toolbar (object inheriting from LibaptAction)
	 * @return {boolean}		true:success,false:failure
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
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Disable a toolbar action
	 * @param {object}			arg_action_name		Action to disable on the toolbar (object inheriting from LibaptAction)
	 * @return {boolean}		true:success,false:failure
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
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Toggle the enabled status of a toolbar action
	 * @param {object}			arg_action_name		Action to enable or disable on the toolbar (object inheriting from LibaptAction)
	 * @return {boolean}		true:success,false:failure
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
	 * @public
	 * @memberof				LibaptToolbar
	 * @desc					Draw toolbar
	 * @return {boolean}		true:success,false:failure
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
	
	
	
	/**
	 * @public
	 * @memberof				LibaptToolbar
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
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


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptToolbar, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'Toolbar view.');


// INTROSPETION : REGISTER OPTIONS

