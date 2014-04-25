/**
 * @file        libapt-mixin-editor-select.js
 * @desc        Mixin of editor view for values list
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-07-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


// TODO : multiple / single select

/**
 * @mixin				LibaptMixinEditorSelect
 * @public
 * @desc				Mixin of editor view for values list
 */
var LibaptMixinEditorSelect =
{
	/**
	 * @memberof			LibaptMixinEditorSelect
	 * @public
	 * @desc				Enable/disable trace for editor operations
	 */
	mixin_editor_trace: true,
	
	
	
	/**
	 * @memberof			LibaptMixinEditorSelect
	 * @public
	 * @desc				jQuery object for the editor
	 */
	mixin_editor_jqo: true,
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorSelect
	 * @method					set_editor_values(arg_values)
	 * @desc					Set editor value(s)
	 * @param {anything}		arg_values	editor value(s): options attributes array as ['value1', 'value2',...] or [ {label:...,attr1:...}, {...} ]
	 * @return {boolean}		true:success,false:failure
	 */
	set_editor_values: function(arg_values)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'set_editor_values(values)';
		self.enter(context, '');
		
		
		// SET INPUT TAG VALUE
		if ( ! Libapt.is_null(self.content_jqo) /*&& $(self.content_jqo[0]).tagName == 'SELECT'*/)
		{
			if ( Libapt.is_array(arg_values) )
			{
				for(option_index in arg_values)
				{
					var option_jqo = $('<option>');
					var option_value = arg_values[option_index];
					if ( Libapt.is_string(option_value) || Libapt.is_number(option_value) )
					{
						option_jqo.html(option_value);
						self.content_jqo.append(option_jqo);
						continue;
					}
					if ( Libapt.is_object(option_value) )
					{
						var value = option_value['label'];
						option_jqo.html(value);
						for(value_key in option_value)
						{
							if (value_key != 'label')
							{
								option_jqo.attr(value_key, option_value[value_key]);
							}
						}
						self.content_jqo.append(option_jqo);
						continue;
					}
				}
			}
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorSelect
	 * @method					get_editor_values()
	 * @desc					Get editor value(s): get all options
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
		if ( ! Libapt.is_null(self.content_jqo) /*&& self.content_jqo.tag_name == 'SELECT'*/)
		{
			value = $('option', self.content_jqo);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return value;
	},
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorSelect
	 * @method					set_editor_selected_values(arg_values)
	 * @desc					Set editor selected value(s)
	 * @param {anything}		arg_values	editor value(s): options values or label array as ['value1', 'value2',...]
	 * @return {boolean}		true:success,false:failure
	 */
	set_editor_selected_values: function(arg_values)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'set_editor_selected_values(values)';
		self.enter(context, '');
		
		
		// SET INPUT TAG VALUE
		if ( ! Libapt.is_null(self.content_jqo) /*&& $(self.content_jqo[0]).tagName == 'SELECT'*/)
		{
			if ( Libapt.is_array(arg_values) )
			{
				// console.log(self.content_jqo);
				all_options = $('option', self.content_jqo);
				for(var all_options_index = 0 ; all_options_index < all_options.length ; all_options_index++)
				{
					var option_jqo = $(all_options[all_options_index]);
					option_jqo.removeAttr('selected');
					// console.log(option_jqo);
					
					for(select_index in arg_values)
					{
						var select_value = arg_values[select_index];
						// console.log( select_value );
						
						if ( Libapt.is_string(select_value) || Libapt.is_number(select_value) )
						{
							// console.log( option_jqo.val() );
							// console.log( option_jqo.html() );
							if ( option_jqo.val() == select_value || option_jqo.html() == select_value )
							{
								option_jqo.attr('selected', '');
							}
						}
					}
				}
			}
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorSelect
	 * @method					get_editor_selected_values()
	 * @desc					Get editor selected value(s): get selected options
	 * @return {anything}		Editor value(s)
	 */
	get_editor_selected_values: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_editor_trace);
		var context = 'get_editor_selected_values()';
		self.enter(context, '');
		
		
		// GET INPUT TAG VALUE
		var value = null;
		if ( ! Libapt.is_null(self.content_jqo) /*&& self.content_jqo.tag_name == 'SELECT'*/)
		{
			value = $('option:selected', self.content_jqo);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return value;
	},
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinEditorSelect
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
		
		
		// DRAW SELECT TAG
		var jqo	= $('<select name="' + arg_name + '" key_name="' + Libapt.to_string(arg_values) + (arg_is_readonly ? '" readonly' : '"') + '></select>');
		jqo.css('margin-left', '5px');
		jqo.css('width', 'auto');
		
		if ( ! Libapt.is_null(arg_container_jqo) )
		{
			arg_container_jqo.append(jqo);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return jqo;
	}
};


/*
var v = new LibaptEditor('editor1', $('.row:eq(2)'), {editor_type:'editor_select',editor_name:'name2',is_readonly:false})
undefined
v.draw('key1')
DEBUG ENTER:LibaptEditor.draw_editor(jqo,name,value,ro)[editor1] : 
DEBUG LEAVE:LibaptEditor.draw_editor(jqo,name,value,ro)[editor1] : success
true
v.set_editor_value(['a','b','c'])
DEBUG ENTER:LibaptEditor.set_editor_value(value)[editor1] : 
DEBUG LEAVE:LibaptEditor.set_editor_value(value)[editor1] : success
true
v.set_editor_selected_value(['b'])
DEBUG ENTER:LibaptEditor.set_editor_selected_value(value)[editor1] : 
[option, context: option, constructor: function, init: function, selector: "", jquery: "1.8.1"…]
b
a
a
[option, context: option, constructor: function, init: function, selector: "", jquery: "1.8.1"…]
b
b
b
[option, context: option, constructor: function, init: function, selector: "", jquery: "1.8.1"…]
b
c
c
[3, constructor: function, init: function, selector: "", jquery: "1.8.1", size: function…]
b
TypeError: Cann

*/