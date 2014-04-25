/**
 * @file        libapt-model-view.js
 * @desc        Model view class
 * @see			libapt-view.js libapt-model.js libapt-fieldsset.js libapt-field.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @class					LibaptModelView
 * @desc					Model view class
 * @param {string}			arg_name			Table name
 * @param {object}			arg_jquery_obj		JQuery object to attach the view to
 * @param {object|null}		arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptModelView(arg_name, arg_jquery_obj, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptView;
	self.inheritFrom(arg_name, arg_jquery_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptModelView';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	// MODEL VIEW ATTRIBUTES
	self.is_model_view		= true;
	this.query				= null;
	this.model				= null;
	this.pager			 	= null;
	
	// INIT EVENT HANDLERS
	this.js_on_read			= null;
	this.js_on_create		= null;
	this.js_on_update		= null;
	this.js_on_delete		= null;
	
	
	// INIT PAGER
	this.has_pager			= Libapt.to_boolean(this.has_pager, true);
	if (this.has_pager)
	{
		this.pager			= new LibaptPager(this.name + '_pager', null, arg_options);
	}
	
	// INIT MODEL
	if ( ! Libapt.is_a(this.model, LibaptModel) && Libapt.is_string(this.model_name) )
	{
		this.model = LibaptModels.get(this.model_name);
	}
	this.assertNotNull(context, 'model', this.model);
	
	// INIT TOOLBARS
	self.init_toolbars(this);
	
	// INIT QUERY
	self.register_mixin(LibaptMixinViewModelQuery);
	self.query = self.create_query(self.model, self);
	this.assertNotNull(context, 'query', this.query);
	
	// SET VISIBLE FIELDS
	if ( Libapt.is_null(this.visible_fields) )
	{
		this.visible_fields = this.query.fields_set.fields;
	}
	// TODO hidden_fields
	
	// this.css_fields_widths		= null;
	this.fill_on_load			= Libapt.to_boolean(this.fill_on_load, true);
	
	// CHECK FIELDS
	this.assert(context, 'fields', this.visible_fields.length > 0);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				set_hidden_fields(arg_hidden_fields)
	 * @desc				Set the hidden fields
	 * @param {array}		arg_hidden_fields	hidden fields
	 * @return {boolean}	true:success,false:failure
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
	 * @public
	 * @memberof			LibaptModelView
	 * @method				edit_settings()
	 * @desc				Edit view settings
	 * @return {boolean}	true:success,false:failure
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
	 * @public
	 * @memberof			LibaptModelView
	 * @method				add_record(arg_record)
	 * @desc				Add a new record to the view (to implement in child classes)
	 * @param {object}		arg_record		field values record
	 * @return {boolean}	true:success,false:failure
	 */
	this.add_record = function(arg_record)
	{
		var context = 'add_record()';
		this.enter(context, '');
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				add_record(arg_record)
	 * @desc				Update an existing record (to implement in child classes)
	 * @param {object}		arg_record		field values record
	 * @return {boolean}	true:success,false:failure
	 */
	this.update_record = function(arg_record)
	{
		var context = 'update_record(record)';
		this.enter(context, '');
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				delete_record(arg_record)
	 * @desc				Delete an existing record (to implement in child classes)
	 * @param {object}		arg_record		field values record
	 * @return {boolean}	true:success,false:failure
	 */
	this.delete_record = function(arg_record)
	{
		var context = 'delete_record()';
		this.enter(context, '');
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				has_selected_records()
	 * @desc				Test if at least a record is selected (to implement in child classes)
	 * @return {boolean}	true:success,false:failure
	 */
	this.has_selected_records = function()
	{
		var context = 'has_selected_records()';
		this.enter(context, '');
		this.leave(context, 'not implemented');
		return false;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method					get_first_selected_record()
	 * @desc					Get first selected record (to implement in child classes)
	 * @return {object|null}	Selected record
	 */
	this.get_first_selected_record = function()
	{
		var context = 'get_first_selected_record()';
		this.enter(context, '');
		this.leave(context, 'not implemented');
		return null;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				draw()
	 * @desc				Draw records
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw = function()
	{
		var self = this;
		var context = 'draw()';
		this.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-begin');
		
		// DRAW TITLE BAR
		self.draw_title_bar();
		
		// DRAW CONTENT
		self.draw_empty();
		self.draw_headers();
		self.draw_toolbars();
		self.adjust_sizes();
		
		// FILL THE GRID ON LOAD IF NEEDED
		if (self.fill_on_load)
		{
			self.load_records();
		}
		
		// FIRE EVENT (END)
		self.fire_event('draw-end');
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				load_records()
	 * @desc				Load and draw records
	 * @return {boolean}	true:success,false:failure
	 */
	this.load_records = function()
	{
		var self = this;
		var context = 'load_records()';
		self.enter(context, '');
		
		
		// REMOVE CONTENT ROWS
		self.remove_records();
		
		// CURRENT PAGE DATAS ARE ALREADY LOADED
		var records = self.pager ? self.get_current_page_datas(self.pager) : self.get_datas();
		if ( Libapt.is_array(records) )
		{
			self.draw_records(records);
			self.leave(context, '');
			return true;
		}
		
		// LOAD CURRENT PAGE DATAS
		var ok_cb = [self, self.draw_records];
		var ko_cb = null;
		var bool_result = self.load_datas(self.model, self.query, self.pager, null, null, ok_cb, ko_cb, true);
		self.assert(context, 'read', bool_result);
		
		
		self.leave(context, '');
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				refresh()
	 * @desc				Refresh the view : erase, load and draw datas records
	 * @return {boolean}	true:success,false:failure
	 */
	this.refresh = function()
	{
		var self = this;
		var context = 'refresh()';
		self.enter(context, '');
		
		
		self.free_datas();
		self.load_records();
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			LibaptModelView
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return
			this.to_string_value('model.name', this.model.name)
			this.to_string_value('visible_fields', this.visible_fields)
			this.to_string_value('query', this.query.to_string())
			// this.to_string_value('datas_records.length', Libapt.is_null(this.datas_records) ? 'null' : this.datas_records.length)
			;
	}
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(LibaptMixinViewLoader);
	self.register_mixin(LibaptMixinViewModelLoad);
	// self.register_mixin(LibaptMixinViewModelQuery);
	
	// INIT OPTION : LOAD STRATEGY
	if (self.model_load_strategy && self.model_load_strategy != '')
	{
		// self.trace = true;
		var option_obj = self.get_option_from_plain_object_string(self.model_load_strategy, ['mode','max_count','pages_before','pages_after']);
		self.assertNotNull(context, 'init model_load_strategy', option_obj);
		self.mixin_view_model_load_strategy = option_obj;
		
		// self.trace = false;
	}
	else
	{
		self.mixin_view_model_load_strategy = { mode:'all', max_count:10000 };
		// self.mixin_view_model_load_strategy = { mode:'pages', pages_before:1, pages_after:1, max_count:100 };
		// self.mixin_view_model_load_strategy = { mode:'range', range_offset:0, range_length:40, max_count:100 };
	}
	
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptModelView, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'All model view class.');


// INTROSPECTION : REGISTER OPTIONS
Libapt.register_str_option(LibaptModelView, 'model_name',	null, true, []);

Libapt.register_str_option(LibaptModelView, 'js_on_read',	null, false, []);
Libapt.register_str_option(LibaptModelView, 'js_on_create',	null, false, []);
Libapt.register_str_option(LibaptModelView, 'js_on_update',	null, false, []);
Libapt.register_str_option(LibaptModelView, 'js_on_delete',	null, false, []);

Libapt.register_bool_option(LibaptModelView, 'has_pager',	true, false, []);

Libapt.register_option(LibaptModelView, {
		name: 'query_fields',
		type: 'Array',
		aliases: ['model_fields'],
		default_value: [],
		array_separator: ',',
		array_type: 'String',
		format: '',
		is_required: true,
		childs: {}
	}
);

Libapt.register_option(LibaptModelView, {
		name: 'query_filters',
		type: 'Array',
		aliases: ['model_filters'],
		default_value: [],
		array_separator: '|',
		array_type: 'String',
		format: '',
		is_required: false,
		childs: {}
	}
);

Libapt.register_option(LibaptModelView, {
		name: 'query_orders',
		type: 'Array',
		aliases: ['model_orders'],
		default_value: [],
		array_separator: '|',
		array_type: 'String',
		format: '',
		is_required: false,
		childs: {}
	}
);

Libapt.register_option(LibaptModelView, {
		name: 'query_groups',
		type: 'Array',
		aliases: ['model_groups'],
		default_value: [],
		array_separator: '|',
		array_type: 'String',
		format: '',
		is_required: false,
		childs: {}
	}
);

Libapt.register_obj_option(LibaptModelView, 'query_slice',			null, false, ['model_slice']);
Libapt.register_int_option(LibaptModelView, 'query_slice.length',	1000, false, ['query_slice_length', 'model_slice_length']);
Libapt.register_int_option(LibaptModelView, 'query_slice.offset',	0, false, ['query_slice_offset', 'model_slice_offset']);

Libapt.register_str_option(LibaptModelView, 'model_load_strategy',	null, false, ['load_strategy']);


Libapt.register_bool_option(LibaptView, 'has_toolbar_pager',		true, false, ['view_has_toolbar_pager']);

Libapt.register_bool_option(LibaptView, 'has_toolbar_crud',			true, false, ['view_has_toolbar_crud']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_crud_refresh',	true, false, ['view_has_toolbar_crud_refresh']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_crud_create',	true, false, ['view_has_toolbar_crud_create']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_crud_update',	true, false, ['view_has_toolbar_crud_update']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_crud_delete',	true, false, ['view_has_toolbar_crud_delete']);

Libapt.register_bool_option(LibaptView, 'has_toolbar_export',		true, false, ['view_has_toolbar_export']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_export_csv',	true, false, ['view_has_toolbar_export_csv']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_export_html',	true, false, ['view_has_toolbar_export_html']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_export_jpeg',	true, false, ['view_has_toolbar_export_jpeg']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_export_png',	true, false, ['view_has_toolbar_export_png']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_export_bmp',	true, false, ['view_has_toolbar_export_bmp']);
Libapt.register_bool_option(LibaptView, 'has_toolbar_export_print',	true, false, ['view_has_toolbar_export_print']);

	

/**
 * @desc		Model view class unit tests
 * @return {nothing}
 */
LibaptModelView.tu_profiles_users_1 = function()
{
	Libapt.trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
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
