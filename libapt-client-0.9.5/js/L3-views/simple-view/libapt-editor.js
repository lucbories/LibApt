/**
 * @file        libapt-editor.js
 * @desc        Editor class
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @class					LibaptEditor
 * @desc					Editor class
 * @param {string}			arg_name			View name
 * @param {object}			arg_container_jqo	JQuery object to attach the view to
 * @param {object|null}		arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptEditor(arg_name, arg_container_jqo, arg_options)
{
	var self = this;
	
	
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptEditor';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @memberof	LibaptEditor
	 * @event		LibaptEditor.updated:Editor is updated
	 * @type		{anything}	new value
	 */
	
	
	/**
	 * @public
	 * @memberof				LibaptEditor
	 * @desc					Init editor type
	 * @return {boolean}		true:success,false:failure
	 */
	this.init_editor_type = function()
	{
		var self = this;
		var context = 'init_editor_type()';
		this.enter(context, '');
		
		
		// CHECK EDITOR TYPE
		self.assertTrue(context, 'editor type', Libapt.is_string(self.editor_type) );
		
		// CHOOSE TYPE
		// console.log(self.editor_type);
		switch(self.editor_type.toLocaleLowerCase())
		{
			case 'editor_string':	Libapt.use('LibaptMixinEditorString');
									self.register_mixin(LibaptMixinEditorString);
									break
			case 'editor_integer':	Libapt.use('LibaptMixinEditorInteger');
									self.register_mixin(LibaptMixinEditorInteger);
									break;
			case 'editor_select':	Libapt.use('LibaptMixinEditorSelect');
									self.register_mixin(LibaptMixinEditorSelect);
									break;
		}
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptEditor
	 * @desc					Set editor value(s)
	 * @param {anything}		arg_value	editor value(s)
	 * @return {boolean}		true:success,false:failure
	 * @fires					LibaptEditor.editor-values-updated
	 */
	this.set_values = function(arg_values)
	{
		var context = 'set_values(values)';
		this.enter(context, '');
		
		
		var result = self.set_editor_values(arg_values);
		if (! result)
		{
			this.leave(context, 'failure');
			return false;
		}
		
		self.fire_event('editor-values-updated', [arg_values]);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptEditor
	 * @desc					Get editor value(s)
	 * @return {anything}		Editor value(s)
	 */
	this.get_values = function()
	{
		var context = 'get_values()';
		this.enter(context, '');
		
		
		var value = self.get_editor_values();
		
		
		this.leave(context, 'success');
		return value;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptEditor
	 * @method					get_selected_values()
	 * @desc					Get editor selected value(s)
	 * @return {anything}		Editor value(s)
	 */
	this.get_selected_values = function()
	{
		var context = 'get_selected_values()';
		this.enter(context, '');
		
		
		var value = self.get_editor_selected_values();
		
		
		this.leave(context, 'success');
		return value;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptEditor
	 * @method					set_selected_values(arg_values)
	 * @desc					Set editor selected value(s)
	 * @param {anything}		arg_values	editor value(s)
	 * @return {boolean}		true:success,false:failure
	 * @fires					LibaptEditor.editor-selections-updated
	 */
	this.set_selected_values = function(arg_values)
	{
		var context = 'set_selected_values(values)';
		this.enter(context, '');
		
		var result = self.set_editor_selected_values(arg_values);
		if (! result)
		{
			this.leave(context, 'failure');
			return false;
		}
		
		self.fire_event('editor-selections-updated', [arg_values]);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptEditor
	 * @desc					Draw view
	 * @param {anything}		arg_values	editor value(s)
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw = function(arg_values)
	{
		var context = 'draw()';
		this.enter(context, '');
		
		
		self.content_jqo = self.draw_editor(self.container_jqo, self.editor_name, arg_values, self.is_readonly);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptEditor
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return
			  this.to_string_value('editor_type', this.editor_type)
			  this.to_string_value('editor_name', this.editor_name)
			  this.to_string_value('is_readonly', this.is_readonly)
			;
	}
	
		
	// INIT EDITOR FEATURES
	self.assertTrue(context, 'init_editor_type', self.init_editor_type());
	
	// ON READY HANDLER
	this.on_ready();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptEditor, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'Value editor view.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_str_option(LibaptEditor, 'editor_type',			'editor_string', true, []);
Libapt.register_str_option(LibaptEditor, 'editor_name',			null, true, []);
Libapt.register_bool_option(LibaptEditor, 'is_readonly',		false, false, []);
