/**
 * @file        libapt-model-view.js
 * @brief       Model view class
 * @details     ...
 * @see			libapt-view.js libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Model view class
 * @param[in]	arg_name			View name (string)
 * @param[in]	arg_jquery_obj		JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptModelView(arg_name, arg_jquery_obj, arg_options)
{
	var self = this;
	
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_jquery_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptModelView';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// MODEL VIEW ATTRIBUTES
	this.query				= null;
	this.model				= null;
	this.datas_records		= null;
	
	// INIT OPTION: HAS PAGER
	this.has_pager			= Libapt.to_boolean(this.has_pager, true);
	
	// CREATE PAGER
	if (this.has_pager)
	{
		this.pager			= new LibaptPager(this.name + '_pager', null, this.pager_options);
	}
	
	this.js_on_read			= null;
	this.js_on_create		= null;
	this.js_on_update		= null;
	this.js_on_delete		= null;
	
	// INIT OPTION: HAS TOOLBAR CRUD
	this.has_toolbar_crud	= Libapt.to_boolean(this.has_toolbar_crud, true);
	if (this.table_headers_has_toolbar)
	{
		this.has_toolbar_crud	= Libapt.to_boolean(this.table_headers_has_toolbar, true);
	}
	this.has_toolbar_crud_refresh	= true;
	this.has_toolbar_crud_create	= true;
	this.has_toolbar_crud_update	= true;
	this.has_toolbar_crud_delete	= true;
	
	// INIT OPTION: HAS TOOLBAR EXPORT
	this.has_toolbar_export			= Libapt.to_boolean(this.has_toolbar_export, true);
	this.has_toolbar_export_csv		= true;
	this.has_toolbar_export_html	= true;
	this.has_toolbar_export_jpeg	= true;
	this.has_toolbar_export_png		= true;
	this.has_toolbar_export_bmp		= true;
	this.has_toolbar_export_print	= false;
	
	// INIT OPTIONS
	this.set_options(arg_options, true);
	
	// INIT MODEL
	if ( ! Libapt.is_a(this.model, LibaptModel) && Libapt.is_string(this.model_name) )
	{
		this.model = LibaptModels.get(this.model_name);
	}
	this.assertNotNull(context, 'model', this.model);
	// this.assertInherit(context, 'model', this.model, LibaptModel);
	
	this.has_toolbar_crud_refresh	= this.has_toolbar_crud_refresh && this.model.access.refresh;
	this.has_toolbar_crud_create	= this.has_toolbar_crud_create && this.model.access.create;
	this.has_toolbar_crud_update	= this.has_toolbar_crud_update && this.model.access.update;
	this.has_toolbar_crud_delete	= this.has_toolbar_crud_delete && this.model.access.delete;
	
	
	// INIT FILTERS
	var filters = [];
	if ( Libapt.is_string(this.query_filters) )
	{
		this.query_filters = this.query_filters.split('|');
	}
	if ( Libapt.is_array(this.query_filters) )
	{
		this.step(context, 'Init filters option');
		for(filter_index in this.query_filters)
		{
			var filter_value = this.query_filters[filter_index];
			var filter = null;
			if ( filter_value instanceof LibaptFilter )
			{
				filter = filter_value;
			}
			if ( Libapt.is_string(filter_value) )
			{
				filter = LibaptFilter.create_from_string(filter_value);
			}
			else if ( Libapt.is_object(filter_value) )
			{
				filter = LibaptFilter.create(filter_value);
			}
			
			if (filter)
			{
				filters.push(filter);
			}
		}
	}
	
	
	// INIT ORDERS
	var orders = [];
	if ( Libapt.is_string(this.query_orders) )
	{
		this.query_orders = this.query_orders.split('|');
	}
	if ( Libapt.is_array(this.query_orders) )
	{
		this.step(context, 'Init orders option');
		for(order_index in this.query_orders)
		{
			var order_value = this.query_orders[order_index];
			var order = null;
			if ( order_value instanceof LibaptOrder )
			{
				order = order_value;
			}
			if ( Libapt.is_string(order_value) )
			{
				order = LibaptOrder.create_from_string(order_value, this.model);
			}
			else if ( Libapt.is_object(order_value) )
			{
				order = LibaptOrder.create(order_value);
			}
			
			if (order)
			{
				orders.push(order);
			}
		}
	}
	
	
	// INIT GROUPS
	var groups = [];
	if ( Libapt.is_string(this.query_groups) )
	{
		this.query_groups = this.query_groups.split('|');
	}
	if ( Libapt.is_array(this.query_groups) )
	{
		this.step(context, 'Init groups option');
		for(group_index in this.query_groups)
		{
			var group_value = this.query_groups[group_index];
			var group = null;
			if ( group_value instanceof LibaptGroup )
			{
				group = group_value;
			}
			if ( Libapt.is_string(group_value) )
			{
				group = LibaptGroup.create_from_string(group_value, this.model);
			}
			else if ( Libapt.is_object(group_value) )
			{
				group = LibaptGroup.create(group_value);
			}
			
			if (group)
			{
				groups.push(group);
			}
		}
	}
	
	// SET THE QUERY
	if ( Libapt.is_null(this.query) )
	{
		this.step(context, 'Init query option');
		if ( ! Libapt.is_array(this.query_fields) || this.query_fields.length == 0 )
		{
			this.query_fields = this.model.fields_set.fields;
		}
		this.query = new LibaptQuery(this.name + '_query', this.query_fields, filters, orders, groups, this.query_slice, this.model);
	}
	this.assertNotNull(context, 'query', this.query);
	
	// INIT SLICE
	if ( Libapt.is_object(this.query_slice) )
	{
		this.step(context, 'Init slice option');
		// if ( Libapt.is_numeric(this.query_slice.offset) && Libapt.is_numeric(this.query_slice.length) )
		{
			this.query.set_slice(this.query_slice.offset, this.query_slice.length);
		}
	}
	// this.query.set_slice(0, 10);
	// console.log(this.query);
	
	// SET VISIBLE FIELDS
	if ( Libapt.is_null(this.visible_fields) )
	{
		this.visible_fields = this.query.fields_set.fields;
	}
	// TODO hidden_fields
	
	
	// CHECK FIELDS
	this.assert(context, 'fields', this.query.fields_set.fields.length > 0);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Set the hidden fields
	 * @param[in]	arg_hidden_fields	hidden fields (array)
	 * @return		boolean				true:success,false:failure
	 */
	this.set_hidden_fields = function(arg_hidden_fields)
	{
		var context = 'set_hidden_fields(fields names)';
		this.enter(context, '');
		
		this.assertArray(context, 'arg_hidden_fields', arg_hidden_fields);
		
		this.visible_fields = [];
		for(field_key in this.query.fields_set.fields)
		{
			var field = this.query.fields_set.fields[field_key];
			if ( arg_hidden_fields.indexOf(field.name) < 0 )
			{
				this.visible_fields.push(field);
			}
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Refresh the view
	 * @return		boolean			true:success,false:failure
	 */
	this.refresh = function()
	{
		var context = 'refresh()';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @brief		Edit view settings
	 * @return		boolean			true:success,false:failure
	 */
	this.edit_settings = function()
	{
		var context = 'edit_settings()';
		this.enter(context, '');
		
		
		// SETTINGS CONTAINER
		var container_jqo = $('<div></div>');
		
		// CREATE SETTINGS EDITOR VIEW
		var query_editor_options = { has_fields:true, has_slice:true };
		var query_editor = new LibaptQueryEditor(this.name + '_query_editor', container_jqo, query_editor_options);
		query_editor.model_view = this;
		
		// EDIT FIELDS ORDERED LIST
		query_editor.draw();
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Add a new record to the view
	 * @param[in]	arg_record		field values record (object)
	 * @return		boolean			true:success,false:failure
	 */
	this.add_record = function(arg_record)
	{
		var context = 'add_record()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @brief		Update an existing record
	 * @param[in]	arg_record		field values record (object)
	 * @return		boolean			true:success,false:failure
	 */
	this.update_record = function(arg_record)
	{
		var context = 'update_record(record)';
		this.enter(context, '');
		
		
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @brief		Delete an existing record
	 * @param[in]	arg_record		field values record (object)
	 * @return		boolean			true:success,false:failure
	 */
	this.delete_record = function(arg_record)
	{
		var context = 'delete_record()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @brief		Test if at least a record is selected
	 * @return		boolean			true:success,false:failure
	 */
	this.has_selected_records = function()
	{
		var context = 'has_selected_records()';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return false;
	}
	
	
	/**
	 * @brief		Get first selected record
	 * @return		boolean			true:success,false:failure
	 */
	this.get_first_selected_record = function()
	{
		var context = 'get_first_selected_record()';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return null;
	}
	
	
	/**
	 * @brief		Draw view
	 * @return		boolean			true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Create edit toolbar actions
	 * @return		boolean			true:success,false:failure
	 */
	this.create_edit_toolbar = function(arg_toolbar_container_jqo, arg_toolbar_options, arg_actions_options)
	{
		var context = 'create_edit_toolbar(jqo,toolbar_options,actions_options)';
		this.enter(context, '');
		
		if (! this.has_toolbar_crud)
		{
			this.leave(context, 'success');
			return null;
		}
		
		var toolbar = new LibaptToolbar(this.name + '_edit_toolbar', arg_toolbar_container_jqo, arg_toolbar_options);
		
		if (this.has_toolbar_crud_refresh)
		{
			var action2 = new LibaptCrudAction('refresh', this, 'refresh', arg_actions_options);
			toolbar.add_action(action2);
		}
		
		if (this.is_editable)
		{
			if (this.has_toolbar_crud_create)
			{
				var action1 = new LibaptCrudAction('create',  this, 'create',  arg_actions_options);
				toolbar.add_action(action1);
			}
			
			if (this.has_toolbar_crud_update)
			{
				var action3 = new LibaptCrudAction('update',  this, 'update',  arg_actions_options);
				toolbar.add_action(action3);
			}
			
			if (this.has_toolbar_crud_delete)
			{
				var action4 = new LibaptCrudAction('delete',  this, 'delete',  arg_actions_options);
				toolbar.add_action(action4);
			}
		}
		
		
		this.leave(context, 'success');
		return toolbar;
	}
	
	
	/**
	 * @brief		Create export toolbar actions
	 * @return		boolean			true:success,false:failure
	 */
	this.create_export_toolbar = function(arg_toolbar_container_jqo, arg_toolbar_options, arg_actions_options)
	{
		var context = 'create_export_toolbar(jqo,toolbar_options,actions_options)';
		this.enter(context, '');
		
		
		if (! this.has_toolbar_export)
		{
			this.leave(context, 'success');
			return null;
		}
		
		var toolbar = new LibaptToolbar(this.name + '_export_toolbar', arg_toolbar_container_jqo, arg_toolbar_options);
		
		if (this.has_toolbar_export_csv)
		{
			var action_csv = new LibaptActionExportCSV('export_CSV', this, 'CSV export', arg_actions_options);
			toolbar.add_action(action_csv);
		}
		
		if (this.has_toolbar_export_html)
		{
			var action_html = new LibaptActionExportHTML('export_HTML', this, 'HTML export', arg_actions_options);
			toolbar.add_action(action_html);
		}
		
		
		if ( Libapt.is_null(arg_actions_options) )
		{
			arg_actions_options = {};
		}
		
		
		if (this.has_toolbar_export_jpeg)
		{
			arg_actions_options.image_format = 'jpeg';
			var action_image1 = new LibaptActionExportImage('export_Image1', this, arg_actions_options);
			toolbar.add_action(action_image1);
		}
		
		if (this.has_toolbar_export_bmp)
		{
			arg_actions_options.image_format = 'bmp';
			var action_image2 = new LibaptActionExportImage('export_Image2', this, arg_actions_options);
			toolbar.add_action(action_image2);
		}
		
		if (this.has_toolbar_export_png)
		{
			arg_actions_options.image_format = 'png';
			var action_image3 = new LibaptActionExportImage('export_Image3', this, arg_actions_options);
			toolbar.add_action(action_image3);
		}
		
		arg_actions_options.image_format = null;
		
		if (this.has_toolbar_export_print)
		{
			var action_print = new LibaptActionExportPrint('export_Print', this, arg_actions_options);
			toolbar.add_action(action_print);
		}
		
		this.leave(context, 'success');
		return toolbar;
	}
	
	
	
	/**
	 * @brief		Create import toolbar actions
	 * @return		boolean			true:success,false:failure
	 */
	this.create_import_toolbar = function(arg_toolbar_container_jqo, arg_toolbar_options, arg_actions_options)
	{
		var context = 'create_import_toolbar(jqo,toolbar_options,actions_options)';
		this.enter(context, '');
		
		
		// var toolbar = new LibaptToolbar(this.name + '_import_toolbar', arg_toolbar_container_jqo, arg_toolbar_options);
		
		// var action_csv = new LibaptActionImportCSV('import_CSV', this, 'CSV import', arg_actions_options);
		// toolbar.add_action(action_csv);
		
		this.leave(context, 'success');
		return toolbar;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return
			this.to_string_value('model.name', this.model.name)
			this.to_string_value('visible_fields', this.visible_fields)
			this.to_string_value('query', this.query.to_string())
			this.to_string_value('datas_records.length', Libapt.is_null(this.datas_records) ? 'null' : this.datas_records.length)
			;
	}
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(LibaptMixinViewLoader);
	
}

Libapt.register_inheritance(LibaptModelView, LibaptView);



/**
 * @brief		Model view class unit tests
 * @return		nothing
 */
LibaptModelView.tu_profiles_users_1 = function()
{
	trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptModelView.tu_profiles_users_1: MODEL_AUTH_PROFILES_USERS');
	
	// GET MODEL
	var model = LibaptModels.get('MODEL_AUTH_PROFILES_USERS');
	
	// CREATE TEST VIEW
	var view_options = null;
	var view_jqo = $('.row:eq(1)');
	var view = new LibaptModelView('view_1', model, ['id_profile_user', 'profile', 'login']);
	view.draw = function(arg_jquery_obj)
	{
		view.datas_records = view.model.read_sync(view.query);
		console.log(view.datas_records);
	}
	
	// INIT VIEW
	view.assert('LibaptModelView.tu_profiles_users_1', 'view.init', view.init_view(view_jqo, view_options) );
	
	// DRAW VIEW
	view.draw(view_jqo);
}
