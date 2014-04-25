/**
 * @file        libapt-crud-action.js
 * @desc        Crud action class
 * @see			libapt-action.js libapt-object.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @desc		Default options for the refresh action
 */
LibaptCrudAction.default_options_refresh = {
	'label'				: 'Refresh',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Refresh the view',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 128,
	
	'is_enabled'		: true,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: 'refresh/refresh_16.png',
	'icon_name_24'		: 'refresh/refresh_24.png',
	'icon_name_32'		: 'refresh/refresh_32.png',
	'icon_name_48'		: 'refresh/refresh_48.png',
	'icon_name_64'		: 'refresh/refresh_64.png',
	'icon_name_96'		: 'refresh/refresh_96.png',
	'icon_name_128'		: 'refresh/refresh_128.png'
}

/**
 * @desc		Default options for the create action
 */
LibaptCrudAction.default_options_create = {
	'label'				: 'Create',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Create a new record',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 128,
	
	'is_enabled'		: true,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: 'edit/add_16.png',
	'icon_name_24'		: 'edit/add_24.png',
	'icon_name_32'		: 'edit/add_32.png',
	'icon_name_48'		: 'edit/add_48.png',
	'icon_name_64'		: 'edit/add_64.png',
	'icon_name_96'		: 'edit/add_96.png',
	'icon_name_128'		: 'edit/add_128.png'
}

/**
 * @desc		Default options for the update action
 */
LibaptCrudAction.default_options_update = {
	'label'				: 'Update',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Update an existing record',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 128,
	
	'is_enabled'		: true,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: 'edit/tools_16.png',
	'icon_name_24'		: 'edit/tools_24.png',
	'icon_name_32'		: 'edit/tools_32.png',
	'icon_name_48'		: 'edit/tools_48.png',
	'icon_name_64'		: 'edit/tools_64.png',
	'icon_name_96'		: 'edit/tools_96.png',
	'icon_name_128'		: 'edit/tools_128.png'
}

/**
 * @desc		Default options for the delete action
 */
LibaptCrudAction.default_options_delete = {
	'label'				: 'Delete',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Delete an existing record',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 128,
	
	'is_enabled'		: true,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: 'edit/delete_16.png',
	'icon_name_24'		: 'edit/delete_24.png',
	'icon_name_32'		: 'edit/delete_32.png',
	'icon_name_48'		: 'edit/delete_48.png',
	'icon_name_64'		: 'edit/delete_64.png',
	'icon_name_96'		: 'edit/delete_96.png',
	'icon_name_128'		: 'edit/delete_128.png'
}


/**
 * @public
 * @class					LibaptCrudAction
 * @desc					Action class
 * @param {string}			arg_name			action name
 * @param {object}			arg_model_view		model view object
 * @param {string}			arg_action_type		action type: refresh/create/update/delete
 * @param {object|null}		arg_options			associative array of name/value options (unused)
 */
function LibaptCrudAction(arg_name, arg_model_view, arg_action_type, arg_options)
{
	var self = this;
	
	// GET OPTIONS
	var tmp_options = null;
	switch(arg_action_type)
	{
		case 'refresh': tmp_options = LibaptCrudAction.default_options_refresh; break;
		case 'create':  tmp_options = LibaptCrudAction.default_options_create; break;
		case 'update':  tmp_options = LibaptCrudAction.default_options_update; break;
		case 'delete':  tmp_options = LibaptCrudAction.default_options_delete; break;
	}
	
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, tmp_options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptCrudAction';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	this.action_type	= arg_action_type;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptCrudAction
	 * @desc				Do the refresh action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
	 */
	this.do_refresh = function(arg_operands)
	{
		var self = this;
		var context = 'do_refresh(operands)';
		this.enter(context, '');
		
		// CHECK ACCESS
		if (this.model_view.model.read)
		{
			this.leave(context, 'no acces to read on this model');
			return true;
		}
		
		this.model_view.refresh();
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptCrudAction
	 * @desc				Do the create action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
	 */
	this.do_create = function(arg_operands)
	{
		var self = this;
		var context = 'do_create(operands)';
		self.enter(context, '');
		
		// CHECK ACCESS
		if (self.model_view.model.create)
		{
			self.leave(context, 'no acces to create on this model');
			return true;
		}
		
		// GET RECORD VALUES
		var record = null;
		if ( self.model_view.has_selected_records() )
		{
			record = self.model_view.get_first_selected_record();
		}
		if ( ! Libapt.is_null(record) && Libapt.is_object(record) )
		{
			var pk_name = self.model_view.model.fields_set.get_pk_field().name;
			record[pk_name] = '';
		}
		
		// GET FORM OPTIONS
		var form_options = {'is_editable':true, 'format':'table', 'max_cols':4};
		
		// CREATE FORM
		var form = new LibaptForm(context + '.form', self.model_view, null, form_options);
		self.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW
		form.draw_one_record(record);
		
		// WINDOW OPTIONS
		var view		= self.model_view;
		var model		= self.model_view.model;
		var new_record	= null;
		
		var crud_ok_cb = function()
			{
				self.step(context, 'CRUD OK CALLBACK');
				view.add_record(new_record);
			};
		var crud_ko_cb = function()
			{
				self.step(context, 'CRUD KO CALLBACK');
			};
		
		var do_cb = function()
			{
				self.step(context, 'DO CALLBACK');
				new_record = form.get_record();
				return model.create_one_record(new_record, crud_ok_cb, crud_ko_cb);
			};
		var cancel_cb = function()
			{
				self.step(context, 'CANCEL CALLBACK');
				return true;
			};
		var window_options = { 'format':'window_yes_no', 'yes_cb':do_cb, 'no_cb':cancel_cb, 'yes_label':'Create', 'no_label':'Cancel' };
		
		// CREATE WINDOW VIEW
		var window = new LibaptWindow(context + '.window', form.content_jqo, window_options);
		window.draw();
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptCrudAction
	 * @desc				Do the uodate action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
	 */
	this.do_update = function(arg_operands)
	{
		var self = this;
		var context = 'do_update(operands)';
		this.enter(context, '');
		
		// CHECK ACCESS
		if (this.model_view.model.update)
		{
			this.leave(context, 'no acces to update on this model');
			return true;
		}
		
		// GET RECORD VALUES
		var record = this.model_view.get_first_selected_record();
		// console.log(record);
		if ( Libapt.is_null(record) )
		{
			this.error(context, 'no selected record');
			return false;
		}
		
		// GET FORM OPTIONS
		var form_options = {'is_editable':true, 'format':'table', 'max_cols':4};
		
		// CREATE FORM
		var form_container = $('<div></div>');
		var form = new LibaptForm(context + '.form', self.model_view, form_container, form_options);
		this.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW
		form.draw_one_record(record);
		
		// WINDOW OPTIONS
		var view		= this.model_view;
		var model		= this.model_view.model;
		var do_cb		= function()
			{
				console.log('DO');
				var new_record=form.get_record();
				return model.update_one_record(new_record) && view.update_record(new_record);
			};
		var cancel_cb	= function(){ console.log('CANCELED'); return true; };
		var window_options = { 'format':'window_yes_no', 'yes_cb':do_cb, 'no_cb':cancel_cb, 'yes_label':'Update', 'no_label':'Cancel' };
		
		// CREATE WINDOW VIEW
		var window = new LibaptWindow(context + '.window', form.content_jqo, window_options);
		window.draw();
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptCrudAction
	 * @desc				Do the delete action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
	 */
	this.do_delete = function(arg_operands)
	{
		var self = this;
		var context = 'do_delete(operands)';
		this.enter(context, '');
		
		// CHECK ACCESS
		if (this.model_view.model.delete)
		{
			this.leave(context, 'no acces to delete on this model');
			return true;
		}
		
		// GET RECORD VALUES
		var record = this.model_view.get_first_selected_record();
		if ( Libapt.is_null(record) )
		{
			this.error(context, 'no selected record');
			return false;
		}
		
		// GET FORM OPTIONS
		var form_options = {'is_editable':false, 'format':'table', 'max_cols':4};
		
		// CREATE FORM
		var form = new LibaptForm(context + '.form', this.model_view, this.model_view.jqo, form_options);
		this.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW
		form.draw_one_record(record);
		
		// WINDOW OPTIONS
		var view		= this.model_view;
		var model		= this.model_view.model;
		var do_cb		= function(){ console.log('DO'); return model.delete_one_record(record) && view.delete_record(record); };
		var cancel_cb	= function(){ console.log('CANCELED'); return true; };
		var window_options = { 'format':'window_yes_no', 'yes_cb':do_cb, 'no_cb':cancel_cb, 'yes_label':'Delete', 'no_label':'Cancel' };
		
		// CREATE WINDOW VIEW
		var window = new LibaptWindow(context + '.window', form.content_jqo, window_options);
		window.draw();
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptCrudAction
	 * @desc				Do the action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
	 */
	this.do_action = function(arg_operands)
	{
		var self = this;
		var context = 'do_action(operands)';
		this.enter(context, '');
		
		
		if ( ! this.is_enabled )
		{
			this.leave(context, 'action is disabled');
			return true;
		}
		
		this.value(context, 'type', this.action_type);
		switch(this.action_type)
		{
			case 'refresh': this.do_refresh(arg_operands); break;
			case 'create':  this.do_create(arg_operands); break;
			case 'update':  this.do_update(arg_operands); break;
			case 'delete':  this.do_delete(arg_operands); break;
		}
		if ( this.do_cb )
		{
			// TODO : assume callback result is not boolean
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptCrudAction
	 * @desc				Dump the object attributes
	 * @return {string}		Object dump
	 */
	this.to_string_self = function()
	{
		return this.to_string_value('field.name', this.field.name)
			+ this.to_string_value('mode', this.mode)
			;
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptCrudAction, ['LibaptAction'], 'Luc BORIES', '2013-08-21', 'Crud actions class.');


// INTROSPETION : REGISTER OPTIONS
// NO OPTIONS