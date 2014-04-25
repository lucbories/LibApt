/**
 * @file        libapt-titlebar.js
 * @desc        Titlebar class
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
 * @class					LibaptTitlebar
 * @desc					Titlebar class : a set of actions draw into a titlebar
 * @param {string}			arg_name			View unique name
 * @param {object}			arg_container_obj	JQuery object to attach the view to
 * @param {object|null}	arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptTitlebar(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptTitlebar';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	/**
	 * @desc		Default options for the titlebar class
	 */
	var default_options = {};
	
	// VIEW ATTRIBUTES
	this.actions = {};
	$.extend(this, default_options, get_arg_not_null(arg_options, {}));
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @desc		Draw titlebar
	 * @return {boolean}			true:success,false:failure
	 */
	this.draw = function()
	{
		var self = this;
		var context = 'draw()';
		this.enter(context, '');
		
		this.content_jqo = $('<div></div>');
		this.content_jqo.css('display', 'block');
		this.content_jqo.addClass('ui-widget-header');
		
		var span_css_left	= ' style="float:left;"';
		var span_css_right	= ' style="float:right;"';
		var span_css_center	= ' style="float:center;"';
		
		// LEFT : APPEND COLLAPSE/EXPAND FEATURE
		var collapse_jqo = $('<span class="ui-icon ui-icon-triangle-1-s"' + span_css_left + '></span>');
		collapse_jqo.click(
			function()
			{
				collapse_jqo.toggleClass('ui-icon-triangle-1-s').toggleClass('ui-icon-triangle-1-e');
				self.parent_view.toggle_visible();
			}
		);
		this.content_jqo.append(collapse_jqo);
		
		
		// MIDDLE : APPEND LABEL FEATURE
		var label = Libapt.is_empty_str_or_null(this.label) ? '...' : this.label;
		var jqo_label = $('<span' + span_css_center + '>' + label + '</span>');
		this.content_jqo.append(jqo_label);
		
		
		// RIGHT : APPEND REFRESH FEATURE
		var refresh_jqo = $('<span class="ui-icon ui-icon-refresh"' + span_css_right + '></span>');
		refresh_jqo.click(
			function()
			{
				refresh_jqo.fadeToggle('fast', function() { refresh_jqo.fadeToggle(); } );
				self.parent_view.refresh();
			}
		);
		this.content_jqo.append(refresh_jqo);
		
		// APPEND EXTRACT FEATURE
		var extend_jqo = $('<span class="ui-icon ui-icon-extlink"' + span_css_right + '></span>');
		extend_jqo.click(
			function()
			{
				// extend_jqo.fadeToggle('fast', function() { extend_jqo.fadeToggle(); } );
				self.parent_view.content_jqo.detach();
				
				var new_container = $('<div></div>');
				new_container.append(self.parent_view.content_jqo);
				var on_closed_cb = function()
					{
						self.parent_view.content_jqo.detach();
						self.parent_view.container_jqo.append(self.parent_view.content_jqo);
						new_container.dialog('close');
						extend_jqo.show();
					};
				
				extend_jqo.hide(); 
				
				new_container.dialog(
					{
						title:		get_arg(self.parent_view.label, ''),
						resizable:	true,
						autoOpen:	true,
						modal:		false,
						maxHeight:	document.height*0.95,
						maxWidth:	document.width*0.95,
						height:		document.height*0.6,
						width:		document.width*0.6,
						close:		on_closed_cb,
						buttons:
						{
							'Close': on_closed_cb
						}
					}
				);
				
				// TODO
				// ADJUST SIZE
				// var container_width		= new_container.css('width');
				// var container_height	= new_container.css('height');
				// this.step(context, 'container_width', container_width);
				// this.step(context, 'container_height', container_height);
				
				// if (container_width != '0px')
				// {
					// this.content_jqo.css('width', container_width);
					// this.content_jqo.css('width', 	container_width);
				// }
				
				// this.content_jqo.css('height',	container_height);
			}
		);
		self.content_jqo.append(extend_jqo);
		
		// RIGHT : APPEND SETTINGS FEATURE
		var settings_jqo = $('<span class="ui-icon ui-icon-gear" style="float:right;"></span>');
		settings_jqo.click(
			function()
			{
				settings_jqo.fadeToggle('fast', function() { settings_jqo.fadeToggle(); } );
				self.parent_view.edit_settings();
			}
		);
		this.content_jqo.append(settings_jqo);
		
		// RIGHT : APPEND SHOW/HIDE EDIT TOOLBAR FEATURE
		var edit_toolbar_jqo = $('<span class="ui-icon ui-icon-pencil" style="float:right;"></span>');
		edit_toolbar_jqo.click(
			function()
			{
				edit_toolbar_jqo.fadeToggle('fast', function() { edit_toolbar_jqo.fadeToggle(); } );
				self.parent_view.on_toggle_toolbar('edit_toolbar');
				self.parent_view.on_toggle_toolbar('pager_toolbar');
			}
		);
		this.content_jqo.append(edit_toolbar_jqo);
		
		// RIGHT : APPEND SHOW/HIDE IMPPORT TOOLBAR FEATURE
		var import_toolbar_jqo = $('<span class="ui-icon ui-icon-folder-open" style="float:right;"></span>');
		import_toolbar_jqo.click(
			function()
			{
				import_toolbar_jqo.fadeToggle('fast', function() { import_toolbar_jqo.fadeToggle(); } );
				self.parent_view.on_toggle_toolbar('import_toolbar');
			}
		);
		this.content_jqo.append(import_toolbar_jqo);
		
		// RIGHT : APPEND SHOW/HIDE EXPORT TOOLBAR FEATURE
		var export_toolbar_jqo = $('<span class="ui-icon ui-icon-disk" style="float:right;"></span>');
		export_toolbar_jqo.click(
			function()
			{
				export_toolbar_jqo.fadeToggle('fast', function() { export_toolbar_jqo.fadeToggle(); } );
				self.parent_view.on_toggle_toolbar('export_toolbar');
			}
		);
		this.content_jqo.append(export_toolbar_jqo);
		
		
		/*
		// RIGHT : APPEND SHOW/HIDE INFOS FEATURE
		var settings_jqo = $('<span class="ui-icon ui-icon-info" style="float:right;"></span>');
		settings_jqo.click(
			function()
			{
				settings_jqo.fadeToggle('fast', function() { settings_jqo.fadeToggle(); } );
				self.edit_settings();
			}
		);
		this.title_bar_jqo.append(settings_jqo);
		
		// RIGHT : APPEND SHOW/HIDE WARNINGS FEATURE
		var settings_jqo = $('<span class="ui-icon ui-icon-alert" style="float:right;"></span>');
		settings_jqo.click(
			function()
			{
				settings_jqo.fadeToggle('fast', function() { settings_jqo.fadeToggle(); } );
				self.edit_settings();
			}
		);
		this.title_bar_jqo.append(settings_jqo);
		
		// RIGHT : APPEND SHOW/HIDE ERRORS FEATURE
		var settings_jqo = $('<span class="ui-icon ui-icon-notice" style="float:right;"></span>');
		settings_jqo.click(
			function()
			{
				settings_jqo.fadeToggle('fast', function() { settings_jqo.fadeToggle(); } );
				self.edit_settings();
			}
		);
		this.title_bar_jqo.append(settings_jqo);
		*/
		
		
		// ADJUST TITLE BAR
		this.container_jqo.append(this.content_jqo);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return '';
	}
}

// Libapt.register_inheritance(LibaptTitlebar, LibaptToolbar);
