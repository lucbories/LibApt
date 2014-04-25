/**
 * @file        libapt-settings.js
 * @brief       Settings class
 * @details     ...
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Settings class
 * @param[in]	arg_name			Settings name (string)
 * @param[in]	arg_jquery_obj		JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptSettings(arg_name, arg_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptSettings';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// VIEW ATTRIBUTES
	this.format = 'tabs';
	this.panels = [];
	this.label	= get_arg(this.label, null);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Draw view
	 * @return		boolean				true:success,false:failure
	 */
	this.add_panel = function(arg_panel_cb, arg_panel_label)
	{
		var context = 'add_panel(panel_cb, label)';
		this.enter(context, '');
		
		var panel = { panel_cb:arg_panel_cb, panel_label:arg_panel_label };
		this.panels.push(panel);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw view
	 * @return		boolean				true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		// SET LABEL
		if ( ! Libapt.is_null(this.label) )
		{
			this.container_jqo.attr('title', this.label);
		}
		
		// DEBUG
		this.value(context, 'format', this.format);
		this.value(context, 'panels.length', this.panels.length);
		
		// DRAW SETTINGS IN TABS
		if (this.format == 'tabs')
		{
			this.step(context, 'format is tabs');
			
			var ul_jqo = $('<ul></ul>');
			this.container_jqo.append(ul_jqo);
			
			for(var panel_index = 0 ; panel_index < this.panels.length ; panel_index++)
			{
				var panel = this.panels[panel_index];
				this.step(context, 'panel:' + panel.panel_label);
				
				var div_jqo	= $('<div></div>');
				div_jqo.uniqueId();
				this.container_jqo.append(div_jqo);
				
				var li_jqo	= $('<li><a href="#' + div_jqo.attr('id') + '">' + panel.panel_label + '</a></li>');
				ul_jqo.append(li_jqo);
				
				var cb_array = panel.panel_cb;
				var obj = cb_array.shift();
				var method = cb_array.shift();
				var args = cb_array;
				
				method.call(obj, div_jqo, args);
			}
			
			this.container_jqo.tabs();
			$("ul.ui-tabs-nav li a", this.container_jqo).addClass('libapt_tabs_dense');
			$("ul.ui-tabs-nav li a", this.container_jqo).css('padding', '0.1em');
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return
			  this.to_string_value('format', this.format)
			+ this.to_string_value('panels.length', this.panels.length)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptSettings, LibaptView);
