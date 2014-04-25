	/**
 * @file        libapt-pivot-grid-editor.js
 * @desc       Pivot grid editor class
 * @details     ...
 * @see			libapt-view.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-06-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @desc		Query editor class : a set of actions draw into a query_editor
 * @param {}	arg_name			View unique name (string)
 * @param {}	arg_container_jqo	JQuery object to attach the view to (object)
 * @param {}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptPivotGridEditor(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptPivotGridEditor';
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
		'has_slice'		: true,
		'has_haxis'		: true,
		'has_vaxis'		: true
	};
	
	// VIEW ATTRIBUTES
	this.model_view = null
	$.extend(this, default_options, get_arg_not_null(arg_options, {}));
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @desc		Draw query_editor
	 * @return {boolean}			true:success,false:failure
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
		
		
		// EDIT FILTERS BY LIST
		if (this.has_haxis)
		{
			settings.add_panel([this, this.draw_haxis_fields_editor], 'H axis fields');
		}
		
		// EDIT FILTERS BY LIST
		if (this.has_vaxis)
		{
			settings.add_panel([this, this.draw_vaxis_fields_editor], 'V axis fields');
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
		
		settings.container_jqo.dialog('option', 'width', 600);
		settings.container_jqo.dialog('option', 'height', 400);
		
		settings.container_jqo.dialog('option', 'minWidth', 300);
		settings.container_jqo.dialog('option', 'minHeight', 300);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	this.draw_fields_editor = function(arg_container_jqo)
	{
		return this.draw_query_fields_editor(this.model_view, arg_container_jqo);
	}
	
	this.draw_groups_editor = function(arg_container_jqo)
	{
		return this.draw_query_groups_editor(this.model_view, arg_container_jqo);
	}
	
	this.draw_orders_editor = function(arg_container_jqo)
	{
		return this.draw_query_orders_editor(this.model_view, arg_container_jqo);
	}
	
	this.draw_filters_editor = function(arg_container_jqo)
	{
		return this.draw_query_filters_editor(this.model_view, arg_container_jqo);
	}
	
	this.draw_slice_editor = function(arg_container_jqo)
	{
		return this.draw_query_slice_editor(this.model_view, arg_container_jqo);
	}
	
	this.draw_haxis_fields_editor = function(arg_container_jqo)
	{
		return this.draw_axis_editor(this.model_view, this.model_view.haxis_object, arg_container_jqo);
	}
	
	this.draw_vaxis_fields_editor = function(arg_container_jqo)
	{
		return this.draw_axis_editor(this.model_view, this.model_view.vaxis_object, arg_container_jqo);
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
	
	// MIXINS
	this.register_mixin_method(LibaptMixinQueryEditorFields);
	this.register_mixin_method(LibaptMixinQueryEditorGroups);
	this.register_mixin_method(LibaptMixinQueryEditorOrders);
	this.register_mixin_method(LibaptMixinQueryEditorFilters);
	this.register_mixin_method(LibaptMixinQueryEditorSlice);
	this.register_mixin_method(LibaptMixinAxisEditorFields);
}

Libapt.register_inheritance(LibaptPivotGridEditor, LibaptView);

