/**
 * @file        libapt-mixin-editor-string.js
 * @desc        Mixin of editor view for string values
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-07-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinEditorString
 * @public
 * @desc				Mixin of editor view for string values
 */
var LibaptMixinEditorString =
{
	/**
	 * @memberof			LibaptMixinEditorString
	 * @public
	 * @desc				Enable/disable trace for editor operations
	 */
	mixin_editor_trace: false,
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorString
	 * @method					set_editor_values(arg_values)
	 * @desc					Set editor value(s)
	 * @param {anything}		arg_values	editor value(s)
	 * @return {boolean}		true:success,false:failure
	 */
	set_editor_values: function(arg_values)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'set_editor_values(values)';
		self.enter(context, '');
		
		
		// SET INPUT TAG VALUE
		if ( ! Libapt.is_null(self.content_jqo) /*&& self.content_jqo.tag_name == 'INPUT'*/)
		{
			self.content_jqo.val( Libapt.to_string(arg_values) );
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorString
	 * @method					get_editor_values()
	 * @desc					Get editor value(s)
	 * @return {anything}		Editor value
	 */
	get_editor_values: function(arg_values)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'get_editor_values()';
		self.enter(context, '');
		
		
		// GET INPUT TAG VALUE
		var value = null;
		if ( ! Libapt.is_null(self.content_jqo) /*&& self.content_jqo.tag_name == 'INPUT'*/)
		{
			value = self.content_jqo.val();
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return value;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorString
	 * @method					set_editor_selected_values(arg_values)
	 * @desc					Set editor selected value(s)
	 * @param {anything}		arg_values	editor value(s)
	 * @return {boolean}		true:success,false:failure
	 */
	set_editor_selected_values: function(arg_values)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'set_editor_selected_values(values)';
		self.enter(context, '');
		
		
		// NOTHING TO DO
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorString
	 * @method					get_editor_selected_values()
	 * @desc					Get editor selected value(s)
	 * @return {anything}		Editor value(s)
	 */
	get_editor_selected_values: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'get_editor_selected_values()';
		self.enter(context, '');
		
		
		var value = self.get_editor_values();
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return value;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorString
	 * @method					draw_editor(arg_container_jqo, arg_init_value)
	 * @desc					Draw the editor
	 * @param {object}			arg_container_jqo		jQuery container object
	 * @param {string}			arg_name				editor name
	 * @param {anything}		arg_values				editor value(s)
	 * @param {boolean}			arg_is_readonly			editor is read only?
	 * @return {object}			jQuery object
	 */
	draw_editor: function(arg_container_jqo, arg_name, arg_values, arg_is_readonly)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'draw_editor(jqo,name,value,ro)';
		self.enter(context, '');
		
		
		// DRAW INPUT TAG
		var jqo_str	= $('<INPUT class="input-text" type="TEXT" name="' + arg_name + '" value="' + Libapt.to_string(arg_values) + (arg_is_readonly ? '" readonly' : '"') + ' />');
		var jqo		= $(jqo_str);
		jqo.css('min-width', '50px');
		if ( ! Libapt.is_null(arg_container_jqo) )
		{
			arg_container_jqo.append(jqo);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return jqo;
	}
};
