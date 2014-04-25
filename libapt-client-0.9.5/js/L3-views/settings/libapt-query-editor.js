	/**
 * @file        libapt-query_editor.js
 * @desc        Query editor class
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
 * @class					LibaptQueryEditor
 * @desc					Query editor class : a set of actions draw into a query_editor
 * @param {string}			arg_name			View name
 * @param {object}			arg_container_jqo	JQuery object to attach the view to
 * @param {object|null}		arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptQueryEditor(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptQueryEditor';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	/**
	 * @desc	Default options for the query_editor class
	 */
	var default_options = {
		'has_fields'	: true,
		'has_filters'	: true,
		'has_orders'	: true,
		'has_groups'	: true,
		'has_slice'		: true
	}
	
	// VIEW ATTRIBUTES
	this.model_view = null
	$.extend(this, default_options, get_arg_not_null(arg_options, {}));
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @desc					Draw query_editor
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		var self = this;
		
		var settings = new LibaptSettings(this.name + '_settings', this.container_jqo, { label:'Settings'} );
		
		
		// EDIT ORDERED FIELDS LIST
		if (this.has_fields)
		{
			settings.add_panel([this, this.draw_fields_editor], 'Fields');
		}
		
		// EDIT GROUPED FIELDS LIST
		if (this.has_groups)
		{
			settings.add_panel([this, this.draw_groups_editor], 'Groups');
		}
		
		// EDIT ORDERS BY LIST
		if (this.has_orders)
		{
			settings.add_panel([this, this.draw_orders_editor], 'Orders');
		}
		
		// EDIT FILTERS BY LIST
		if (this.has_filters)
		{
			settings.add_panel([this, this.draw_filters_editor], 'Filters');
		}
		
		// EDIT SLICE OFFSET AND LENGTH
		if (this.has_slice)
		{
			settings.add_panel([this, this.draw_slice_editor], 'Slice');
		}
		
		// APPLY EVENT HANDLER
		var apply_cb = function()
			{
				self.model_view.refresh();
				self.container_jqo.dialog('close');
			};
		
		// CREATE AND OPEN SETTINGS DIALOG
		settings.draw();
		var refreah_label = 'Refresh the view';
		var buttons_array = [ { text:refreah_label, click:apply_cb} ];
		settings.container_jqo.dialog( {auto:true, modal:true, buttons:buttons_array} );
		
		// settings.container_jqo.dialog('option', 'width', 600);
		settings.container_jqo.dialog('option', 'height', 400);
		
		// settings.container_jqo.dialog('option', 'minWidth', 300);
		settings.container_jqo.dialog('option', 'minHeight', 300);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @method					draw_fields_editor(arg_container_jqo)
	 * @desc					Draw fields editor
	 * @param {object}			arg_container_jqo	JQuery object to attach the view to
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw_fields_editor = function(arg_container_jqo)
	{
		return this.draw_query_fields_editor(this.model_view, arg_container_jqo);
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @method					draw_groups_editor(arg_container_jqo)
	 * @desc					Draw groups editor
	 * @param {object}			arg_container_jqo	JQuery object to attach the view to
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw_groups_editor = function(arg_container_jqo)
	{
		return this.draw_query_groups_editor(this.model_view, arg_container_jqo);
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @method					draw_orders_editor(arg_container_jqo)
	 * @desc					Draw orders editor
	 * @param {object}			arg_container_jqo	JQuery object to attach the view to
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw_orders_editor = function(arg_container_jqo)
	{
		return this.draw_query_orders_editor(this.model_view, arg_container_jqo);
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @method					draw_filters_editor(arg_container_jqo)
	 * @desc					Draw filters editor
	 * @param {object}			arg_container_jqo	JQuery object to attach the view to
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw_filters_editor = function(arg_container_jqo)
	{
		return this.draw_query_filters_editor(this.model_view, arg_container_jqo);
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @method					draw_slice_editor(arg_container_jqo)
	 * @desc					Draw slice editor
	 * @param {object}			arg_container_jqo	JQuery object to attach the view to
	 * @return {boolean}		true:success,false:failure
	 */
	this.draw_slice_editor = function(arg_container_jqo)
	{
		return this.draw_query_slice_editor(this.model_view, arg_container_jqo);
	}
	
	
	/**
	 * @public
	 * @memberof				LibaptQueryEditor
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return
			  this.to_string_value('has_fields',  this.has_fields)
			+ this.to_string_value('has_filters', this.has_filters)
			+ this.to_string_value('has_orders',  this.has_orders)
			+ this.to_string_value('has_groups',  this.has_groups)
			+ this.to_string_value('has_slice',   this.has_slice)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
	
	// MIXINS
	this.register_mixin_method(LibaptMixinQueryEditorFields);
	this.register_mixin_method(LibaptMixinQueryEditorGroups);
	this.register_mixin_method(LibaptMixinQueryEditorOrders);
	this.register_mixin_method(LibaptMixinQueryEditorFilters);
	this.register_mixin_method(LibaptMixinQueryEditorSlice);
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptQueryEditor, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'Model view query editor view.');


// INTROSPETION : REGISTER OPTIONS


