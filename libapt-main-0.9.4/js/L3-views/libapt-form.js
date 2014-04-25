/**
 * @file        libapt-form.js
 * @brief       Form lodel view class to generate model crud form 
 * @details     ...
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @memberof	LibaptForm
 * @public
 * @static
 * @brief		Default options for the form class
 */
LibaptForm.default_options = {
	'is_editable'	: true,
	'is_selector'	: false,
	'format'		: 'list',
	'max_cols'		: 5
}


/**
 * @public
 * @class					LibaptForm
 * @desc					Form view class
 * @param {string}			arg_name			View name
 * @param {object}			arg_model_view_obj	Model view
 * @param {object}			arg_jquery_obj		JQuery object to attach the view to
 * @param {object|null}		arg_options			associative array of options
 * @return {nothing}
 */
function LibaptForm(arg_name, arg_model_view_obj, arg_jquery_obj, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_jquery_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptForm';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// FORM ATTRIBUTES
	this.model_view			= arg_model_view_obj;
	$.extend(this, LibaptForm.default_options, arg_options);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @method				get_fields_editors(arg_fields_values, arg_form_is_editable, arg_field_selector)
	 * @desc				Get fields editors dom element
	 * @param {array}		arg_fields_values		Fields values record (array of values)
	 * @return {array}		array of jquery objects
	 */
	this.get_fields_editors = function(arg_fields_values, arg_form_is_editable, arg_field_selector)
	{
		var context = 'get_fields_editors(values,is_editable,selector)';
		this.enter(context, '');
		
		this.value(context, 'arg_fields_values', arg_fields_values);
		this.value(context, 'arg_form_is_editable', arg_form_is_editable);
		this.value(context, 'arg_field_selector', arg_field_selector);
		
		// CHECK EDITABLE
		if ( Libapt.is_null(arg_form_is_editable) )
		{
			arg_form_is_editable = true;
		}
		
		var editors = [];
		var fields = this.model_view.query.fields_set.fields;
		for(var field_index = 0 ; field_index < fields.length ; field_index++)
		{
			var field = fields[field_index];
			this.assertNotNull(context, 'field', field);
			this.step(context, 'loop on field [' + field.name + '] at index [' + field_index + ']');
			
			if (field.is_crud)
			{
				this.step(context, 'field [' + field.name + '] is crud');
				
				// var value = Libapt.is_null(arg_fields_values) ? null : arg_fields_values[field.name];
				var is_visible	= field.is_part_of_join ? true : field.is_visible;
				
				var editor = field.get_field_editor(arg_fields_values, is_visible, field.is_editable && arg_form_is_editable, arg_field_selector);
				this.assertNotNull(context, 'editor', editor);
			
				editor.uniqueId();
				editors.push( {'editor':editor, 'visible':is_visible, 'label':field.label} );
			}
		}
		
		this.leave(context, 'success');
		return editors;
	}
	
	
	/**
	 * @public
	 * @method				get_record()
	 * @desc				Get fields values record
	 * @return {object}		associative array of values (object)
	 */
	this.get_record = function()
	{
		var context = 'get_record()';
		this.enter(context, '');
		
		var jqo_form = $( this.container_jqo.children('form')[0] );
		// console.log(jqo_form);
		var record = jqo_form.serializeJSON();
		
		jqo_form.find('select').each(
			function(index, node, nodes)
			{
				record[$(node).attr('name')] = $(node).val();
			}
		);
		
		this.value(context, 'record', record);
		// console.log(record);
		
		this.leave(context, 'success');
		return record;
	}
	
	
	/**
	 * @public
	 * @method				draw_one_record(arg_fields_values, arg_format)
	 * @desc				Draw one record fields
	 * @param {array}		arg_fields_values	one record fields values associative array field name/field value
	 * @param {string}		arg_format			display format
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw_one_record = function(arg_fields_values, arg_format)
	{
		var context = 'draw_one_record(values_record, format)';
		this.enter(context, '');
		
		// RESET EXISTING FORM
		var existing_forms = this.container_jqo.find('form');
		if ( ! Libapt.is_null(existing_forms) )
		{
			existing_forms.remove();
		}
		
		// CREATE FIELDS EDITORS WITH GIVEN VALUES
		var editors = this.get_fields_editors(arg_fields_values, this.is_editable, this.is_selector);
		// console.log(editors);
		
		// CREATE FORM
		this.content_jqo = $('<form></form>');
		this.container_jqo.append(this.content_jqo);
		this.content_jqo.validate();
		
		// CREATE FIELDS SET
		var jqo_fieldsset = $('<fieldsset></fieldsset>');
		this.content_jqo.append(jqo_fieldsset);
		
		// DISPLAY
		arg_format = get_arg(arg_format, this.format);
		switch(arg_format)
		{
			case'list':
			{
				for(editor_index in editors)
				{
					var current_editor = editors[editor_index];
					if ( ! current_editor.visible)
					{
						current_editor.editor.css('display', 'none');
					}
					else
					{
						if ( ! Libapt.is_empty_str_or_null(current_editor.label) )
						{
							jqo_fieldsset.append('<label for="' + current_editor.editor.attr('id') + '">' + current_editor.label + '</label>');
						}
					}
					jqo_fieldsset.append(current_editor.editor);
				}
				break;
			}
			case 'table':
			{
				var table = $('<table></table>');
				var tbody = $('<tbody></tbody>');
				table.append(tbody);
				jqo_fieldsset.append(table);
				var tr = $('<tr></tr>');
				tbody.append(tr);
				
				var td_counter_max_per_tr = this.max_cols;
				var td_counter = 0;
				for(editor_index in editors)
				{
					var current_editor = editors[editor_index];
					if (current_editor.visible)
					{
						var td = $('<td></td>');
						
						if ( ! Libapt.is_empty_str_or_null(current_editor.label) )
						{
							td.append('<label for="' + current_editor.editor.attr('id') + '">' + current_editor.label + '</label>');
						}
						
						td.append(current_editor.editor);
						
						if (td_counter == td_counter_max_per_tr)
						{
							td_counter = 0;
							tr = $('<tr></tr>');
							tbody.append(tr);
						}
						tr.append(td);
						td_counter++;
					}
					else
					{
						current_editor.editor.css('display', 'none');
						jqo_fieldsset.append(current_editor.editor);
					}
				}
				break;
			}
			default:
				this.assert(context, 'bad form format[' + arg_format + ']', arg_format);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method				to_string_self()
	 * @desc				Dump this class
	 * @return {string}
	 */
	this.to_string_self = function()
	{
		return
			this.to_string_value('model_view.name', this.model_view.name)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptForm, LibaptView);




/**
 * @brief		Update password values on change
 * @param[in]	arg_jqo_old
 * @param[in]	arg_jqo_new
 * @param[in]	arg_jqo_confirm
 * @param[in]	arg_jqo_newhash
 * @return		nothing
 * @todo		Check password rules
 */
LibaptForm.on_password_change = function(arg_jqo_old, arg_jqo_new, arg_jqo_confirm, arg_jqo_newhash)
{
	// GET INPUTS FIELDS VALUES
	var input_oldhash_value	= arg_jqo_old.val();
	var input_new_value		= arg_jqo_new.val();
	var input_confirm_value = arg_jqo_confirm.val();
	
	// CHECK EMPTY VALUE
	if (input_new_value == '')
	{
		arg_jqo_new.val('');
		arg_jqo_confirm.val('');
		arg_jqo_newhash.val('');
		msgbox_alert('PASSWORD SHOULD NOT BE EMPTY');
		return;
	}
	
	// CHECK NEW AND CONFIRM
	if (input_new_value != input_confirm_value)
	{
		arg_jqo_new.val('');
		arg_jqo_confirm.val('');
		arg_jqo_newhash.val('');
		msgbox_alert('NEW AND CONFIRM PASSWORD ARE NOT THE SAME');
		return;
	}
	
	// HASH NEW PASSWORD
	arg_jqo_new.val('');
	arg_jqo_confirm.val('');
	arg_jqo_newhash.val( MD5(input_new_value) );
}



/**
 * @brief		Form class unit tests with users model
 * @param[in]	arg_optional_target_jqo		JQuery object to attach the view to (object)
 * @return		nothing
 */
LibaptForm.tu_users_1 = function(arg_optional_target_jqo)
{
	var context = 'LibaptForm.tu_users_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get('VIEW_AUTH_USERS');
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) );
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, no_options);
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0]);
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}



/**
 * @brief		Form class unit tests with users roles model
 * @param[in]	arg_optional_target_jqo		JQuery object to attach the view to (object)
 * @return		nothing
 */
LibaptForm.tu_users_roles_1 = function(arg_optional_target_jqo)
{
	var context = 'LibaptTable.tu_users_roles_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get('VIEW_AUTH_USERS_ROLES');
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) );
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, {'format':'table', 'max_cols':4} );
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0], 'table');
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}



/**
 * @brief		Form class unit tests with activities model
 * @param[in]	arg_optional_target_jqo		JQuery object to attach the view to (object)
 * @return		nothing
 */
LibaptForm.tu_activities_1 = function(arg_optional_target_jqo)
{
	var context = 'LibaptTable.tu_activities_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get('VIEW_CALENDARS_DOM_ACTIVITIES_TABLE');
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) );
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, {'format':'table', 'max_cols':4} );
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0], 'table');
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}
