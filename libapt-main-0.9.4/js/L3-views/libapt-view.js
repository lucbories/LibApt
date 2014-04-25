/**
 * @file        libapt-view.js
 * @desc        View class
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @memberof	LibaptView
 * @public
 * @static
 * @desc		Default options for the view class
 */
LibaptView.default_options = {
	html_id				: null,
	label				: null,
	tooltip				: null,
	links				: null,
	
	has_title_bar		: true,
	has_edit_toolbar	: true,
	
	is_collapsable		: true,
	is_resizable		: false,
	is_visible			: true,
	is_editable			: true,
	is_portlet			: false,
	
	has_hscrollbar		: false,
	has_vscrollbar		: false,
	
	css_styles			: null,
	css_classes			: null,
	
	js_on_ready			: null,
	js_on_change		: null,
	js_on_filled		: null,
	js_on_refresh		: null
}


/**
 * @public
 * @class				LibaptView
 * @desc				View class
 * @param {string}		arg_name			View name (string)
 * @param {object}		arg_container_obj	JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptView(arg_name, arg_container_obj, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptObject;
	self.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptView';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// STATIC VIEW ATTRIBUTES
	self.is_view			= true;
	
	// INIT OPTIONS
	var options = $.extend({}, LibaptView.default_options, arg_options);
	this.set_options(options, true);
	
	// VIEW ATTRIBUTES
	self.parent_view		= null;
	self.container_jqo		= get_arg_not_null(arg_container_obj, $('<div></div>') );
	self.content_jqo		= null;
	self.parent_view		= Libapt.is_string(self.parent_view) ? LibaptViews.get(self.parent_view) : self.parent_view;
	
	if (self.has_title_bar)
	{
		self.titlebar_view		= new LibaptTitlebar(self.name + '_titlebar', self.container_jqo, arg_options);
		self.titlebar_view.parent_view = this;
	}
	 // = Libapt.to_boolean(this.vaxis_is_sparse, false);
	
	// TODO
/*	has_title_bar		: true,
	has_edit_toolbar	: true,
	
	is_collapsable		: true,
	is_resizable		: false,
	is_visible			: true,
	is_editable			: true,
	is_portlet			: false,
	
	has_hscrollbar		: false,
	has_vscrollbar		: false,
	*/
	self.content_childs_jqo		= [];
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(LibaptMixinViewLink);
	self.register_mixin(LibaptMixinViewSize);
	self.register_mixin(LibaptMixinViewSelect);
	
	self.links = get_arg_not_null(self.links, []);
	
	
	
	// INIT VIEW
	if ( ! Libapt.is_null(self.container_jqo) )
	{
		// ATTACH THIS VIEW TO THE JQUERY OBJECT
		self.container_jqo.data('libapt_view', self);
		if ( Libapt.is_not_empty_str(self.html_id) )
		{
			self.container_jqo.attr('id', self.html_id);
		}
	}
	
	
	// REGISTER THE VIEW TO THE REPOSITORY
	LibaptViews.add(self);
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @desc				Draw view
	 * @param {object}		arg_jquery_object	JQuery object to attach the view to (object)
	 * @return {boolean}	true:success,false:failure
	 */
	self.set_container = function(arg_jquery_object)
	{
		var self = this;
		var context = 'set_container()';
		self.enter(context, '');
		
		// CHECK NEW CONTAINER
		self.assertNotNull(context, 'arg_jquery_object', arg_jquery_object);
		
		// DETACH FROM EXISTING CONTAINER
		if (self.container_jqo)
		{
			self.container_jqo.removeData('libapt_view');
		}
		
		// ATTACH TO NEW CONTAINER
		self.container_jqo = arg_jquery_object;
		self.container_jqo.data('libapt_view', this);
		if ( Libapt.is_not_empty_str(self.html_id) )
		{
			self.container_jqo.attr('id', self.html_id);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				Draw view
	 * @return {boolean}	true:success,false:failure
	 */
	self.draw = function()
	{
		var self = this;
		var context = 'draw()';
		self.enter(context, '');
		
		self.step(context, 'not implemented in this base class : implement in child classes');
		self.assert(context, 'draw_title_bar', self.draw_title_bar());
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				Edit view settings
	 * @return {boolean}	true:success,false:failure
	 */
	self.edit_settings = function()
	{
		var self = this;
		var context = 'edit_settings()';
		self.enter(context, '');
		
		self.step(context, 'not implemented in this base class : implement in child classes');
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @desc				Toggle show/hide view
	 * @return {boolean}	true:success,false:failure
	 */
	self.toggle_visible = function()
	{
		var self = this;
		var context = 'toggle_visible()';
		self.enter(context, '');
		
		if ( self.content_jqo )
		{
			self.content_jqo.toggle();
		}
		else
		{
			self.step(context, 'no content to show/hide');
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @desc				Draw view
	 * @return {boolean}	true:success,false:failure
	 */
	self.draw_title_bar = function()
	{
		var self = this;
		var self = this;
		var context = 'draw_title_bar()';
		self.enter(context, '');
		
		
		// HAS TITLE BAR ?
		if ( ! self.has_title_bar )
		{
			self.leave(context, 'no title bar');
			return true;
		}
		
		// CREATE TITLE BAR
		self.titlebar_view.container_jqo = self.container_jqo;
		self.titlebar_view.draw();
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				Template feature : Compile template string with bindings and tags
	 * @param {string}		arg_template_str	Template string
	 * @param {object}		arg_tags			Tags associative array as string key/string value
	 * @param {object}		arg_bindings		Tags associative array as string key/view object value
	 * @return {string}		Compiled string
	 */
	self.compile_template = function(arg_template_str, arg_tags, arg_bindings)
	{
		var self = this;
		var context = 'compile_template(template,tags,bindings)';
		self.enter(context, '');
		
		self.step(context, 'not yet implemented');
		
		self.leave(context, 'success');
		return arg_template_str;
	}
	
	
	
	/**
	 * @desc				Translation feature : Translate given string in active language
	 * @param {string}		arg_sentance_str		String to translate
	 * @param {string}		arg_translation_context	Tags associative array as string key/string value
	 * @return {string}		Translated string
	 */
	self.translate = function(arg_sentance_str, arg_translation_context)
	{
		var self = this;
		var context = 'translate(sentance,translation context)';
		self.enter(context, '');
		
		self.step(context, 'not yet implemented');
		
		self.leave(context, 'success');
		return arg_sentance_str;
	}
	
	
	
	/**
	 * @desc				On change event
	 * @return {boolean}	true:success,false:failure
	 */
	self.on_toggle_toolbar = function(arg_toolbar)
	{
		var self = this;
		var context = 'on_toggle_toolbar(toolbar)';
		self.enter(context, '');
		
		// ON CHANGE HANDLER
		if ( Libapt.is_string(arg_toolbar) )
		{
			if (arg_toolbar == 'edit_toolbar' && self.edit_toolbar instanceof LibaptToolbar)
			{
				self.edit_toolbar.toggle_visible();
			}
			if (arg_toolbar == 'pager_toolbar' && self.pager instanceof LibaptPager)
			{
				self.pager.toggle_visible();
			}
			if (arg_toolbar == 'export_toolbar' && self.export_toolbar instanceof LibaptToolbar)
			{
				self.export_toolbar.toggle_visible();
			}
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				On change event
	 * @return {boolean}	true:success,false:failure
	 */
	self.on_change = function()
	{
		var self = this;
		var context = 'on_change()';
		self.enter(context, '');
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(self.js_on_change) )
		{
			eval(self.js_on_change);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				On refresh event
	 * @return {boolean}	true:success,false:failure
	 */
	self.on_refresh = function()
	{
		var self = this;
		var context = 'on_refresh()';
		self.enter(context, '');
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(self.js_on_refresh) )
		{
			eval(self.js_on_refresh);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				On filled event
	 * @return {boolean}	true:success,false:failure
	 */
	self.on_filled = function()
	{
		var self = this;
		var context = 'on_filled()';
		self.enter(context, '');
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(self.js_on_filled) )
		{
			eval(self.js_on_filled);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @desc				On ready
	 * @return {boolean}	true:success,false:failure
	 */
	self.on_ready = function()
	{
		var self = this;
		var context = 'on_ready()';
		self.enter(context, '');
		
		// ON READY HANDLER
		if ( ! Libapt.is_null(self.js_on_ready) )
		{
			eval(self.js_on_ready);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	// TRACE METHOD : TO STRING
	self.to_string_self = function()
	{
		var self = this;
		return '';
		// return self.to_string_value('model.name', self.model.name);
	}
	
	
	// REGISTER WROWSER EVENTS
	$(window).resize( function() { self.adjust_sizes(); } );
	
}

Libapt.register_inheritance(LibaptView, LibaptObject);
