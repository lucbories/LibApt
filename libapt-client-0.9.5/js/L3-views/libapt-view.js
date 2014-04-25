/**
 * @file        libapt-view.js
 * @desc        View class
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @class				LibaptView
 * @desc				View class
 * @param {string}		arg_name			View name (string)
 * @param {object}		arg_container_jqo	JQuery object to attach the view to
 * @param {object|null}	arg_options			Associative array of options
 * @return {nothing}
 * @mixes				LibaptMixinViewLink
 * @mixes				LibaptMixinViewSize
 * @mixes				LibaptMixinViewSelect
 * @mixes				LibaptMixinToolbars
 * @mixes				LibaptMixinViewVisible
 * @mixes				LibaptMixinViewTitlebar
 */
function LibaptView(arg_name, arg_container_jqo, arg_options)
{
	var self = this;
	
	
	// INHERIT
	self.inheritFrom = LibaptObject;
	self.inheritFrom(arg_name, false, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptView';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// VIEW ATTRIBUTES
	self.is_view			= true;
	self.container_jqo		= get_arg_not_null(arg_container_jqo, $('<div>') );
	self.content_jqo		= null;
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	// PARENT VIEW ATTRIBUTES
	if ( ! ( Libapt.is_object(self.parent_view) && self.parent_view.is_view ) )
	{
		self.parent_view	= null;
		if ( Libapt.is_not_empty_str(self.parent_view_name) )
		{
			self.parent_view	= LibaptViews.get(self.parent_view_name);
		}
	}
	self.content_childs_jqo		= [];
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	
	// LINKS MIXIN
	self.register_mixin(LibaptMixinViewLink);
	self.links = get_arg_not_null(self.links, []);

	self.register_mixin(LibaptMixinViewSize);
	self.register_mixin(LibaptMixinViewSelect);
	self.register_mixin(LibaptMixinToolbars);
	
	// VISIBLE MIXN
	self.register_mixin(LibaptMixinViewVisible);
	self.set_visible( Libapt.to_boolean(self.is_visible, true) );
	
	// TITLEBAR MIXIN
	self.register_mixin(LibaptMixinViewTitlebar);
	self.mixin_view_titlebar_enabled = Libapt.to_boolean(self.has_title_bar, true);
	self.init_title_bar( { label:self.label } );
	
	/* --------------------------------------------------------------------------------------------- */
	
	
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
	 * @memberof			LibaptView
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
		self.container_jqo.data('libapt_view', self);
		if ( Libapt.is_not_empty_str(self.html_id) )
		{
			self.container_jqo.attr('id', self.html_id);
		}
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			LibaptView
	 * @desc				Draw view
	 * @return {boolean}	true:success,false:failure
	 */
	self.draw = function()
	{
		var self = this;
		var context = 'draw()';
		self.enter(context, '');
		
		self.step(context, 'not implemented in this base class : implement in child classes');
		self.draw_title_bar();
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			LibaptView
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
	 * @public
	 * @memberof			LibaptView
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
	 * @public
	 * @memberof			LibaptView
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
	 * @public
	 * @memberof			LibaptView
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
	 * @public
	 * @memberof			LibaptView
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
	 * @public
	 * @memberof			LibaptView
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
	 * @public
	 * @memberof			LibaptView
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
	
	
	/**
	 * @public
	 * @memberof			LibaptView
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	self.to_string_self = function()
	{
		var self = this;
		return '';
		// return self.to_string_value('model.name', self.model.name);
	}
	
	
	// REGISTER WROWSER EVENTS
	$(window).resize( function() { self.adjust_sizes(); } );
	
	
	// ON READY HANDLER
	if ( Libapt.is_null(arg_options) || arg_options.class_name == 'LibaptView')
	{
		this.on_ready();
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptView, ['LibaptObject'], 'Luc BORIES', '2013-08-21', 'All views base class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_str_option(LibaptView, 'parent_view_name',		null, false, ['view_parent_view_name']);
Libapt.register_str_option(LibaptView, 'html_id',				null, false, ['view_html_id']);
Libapt.register_str_option(LibaptView, 'label',					null, false, ['view_label']);
Libapt.register_str_option(LibaptView, 'tooltip',				null, false, ['view_tooltip']);

Libapt.register_bool_option(LibaptView, 'template_enabled',		true, false, ['view_template_enabled']);
Libapt.register_str_option(LibaptView, 'template_string',		null, false, ['view_template_string']);
Libapt.register_str_option(LibaptView, 'template_file_name',	null, false, ['view_template_file_name']);
Libapt.register_str_option(LibaptView, 'template_tags',			null, false, ['view_template_tags']);
Libapt.register_str_option(LibaptView, 'template_bindings',		null, false, ['view_template_bindings']);

Libapt.register_option(LibaptView, {
		name: 'links',
		type: 'array',
		aliases: ['view_links'],
		default_value: [],
		array_separator: ',',
		array_type: 'String',
		format: '',
		is_required: false,
		childs: {}
	}
);

Libapt.register_bool_option(LibaptView, 'has_title_bar',	true, false, ['view_has_title_bar']);
Libapt.register_bool_option(LibaptView, 'has_edit_toolbar',	true, false, ['view_has_edit_toolbar']);
Libapt.register_bool_option(LibaptView, 'is_collapsable',	true, false, ['view_is_collapsable']);
Libapt.register_bool_option(LibaptView, 'is_resizable',		true, false, ['view_is_resizable']);
Libapt.register_bool_option(LibaptView, 'is_visible',		true, false, ['view_is_visible']);
Libapt.register_bool_option(LibaptView, 'is_editable',		true, false, ['view_is_editable']);
Libapt.register_bool_option(LibaptView, 'is_portlet',		false, false, ['view_is_portlet']);
Libapt.register_bool_option(LibaptView, 'has_hscrollbar',	false, false, ['view_has_hscrollbar']);
Libapt.register_bool_option(LibaptView, 'has_vscrollbar',	false, false, ['view_has_vscrollbar']);

Libapt.register_str_option(LibaptView, 'css_styles',		null, false, ['view_css_styles']);
Libapt.register_str_option(LibaptView, 'css_classes',		null, false, ['view_css_classes']);

Libapt.register_str_option(LibaptView, 'js_on_ready',		null, false, ['view_js_on_ready']);
Libapt.register_str_option(LibaptView, 'js_on_change',		null, false, ['view_js_on_change']);
Libapt.register_str_option(LibaptView, 'js_on_filled',		null, false, ['view_js_on_filled']);
Libapt.register_str_option(LibaptView, 'js_on_refresh',		null, false, ['view_js_on_refresh']);
