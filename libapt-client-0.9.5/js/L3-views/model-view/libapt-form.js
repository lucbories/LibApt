/**
 * @file        libapt-form.js
 * @desc        Form lodel view class to generate model crud form 
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @group       LIBAPT_VIEWS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



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
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptView;
	self.inheritFrom(arg_name, arg_jquery_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptForm';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// FORM ATTRIBUTES
	self.model_view			= arg_model_view_obj;
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptForm
	 * @method				get_fields_editors(arg_fields_values, arg_form_is_editable, arg_field_selector)
	 * @desc				Get fields editors dom element
	 * @param {array}		arg_fields_values		Fields values record (array of values)
	 * @return {array}		array of jquery objects
	 */
	this.get_fields_editors = function(arg_fields_values, arg_form_is_editable, arg_field_selector)
	{
		var self = this;
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
	 * @memberof			LibaptForm
	 * @method				get_record()
	 * @desc				Get fields values record
	 * @return {object}		associative array of values (object)
	 */
	this.get_record = function()
	{
		var self = this;
		var context = 'get_record()';
		this.enter(context, '');
		
		
		var record = this.content_jqo.serializeJSON();
		
		this.content_jqo.find('select').each(
			function(index, node, nodes)
			{
				record[$(node).attr('name')] = $(node).val();
			}
		);
		
		this.value(context, 'record', record);
		
		
		this.leave(context, 'success');
		return record;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptForm
	 * @method				draw_one_record(arg_fields_values, arg_format)
	 * @desc				Draw one record fields
	 * @param {array}		arg_fields_values	one record fields values associative array field name/field value
	 * @param {string}		arg_format			display format
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw_one_record = function(arg_fields_values, arg_format)
	{
		var self = this;
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
	 * @memberof			LibaptForm
	 * @method				to_string_self()
	 * @desc				Dump this object
	 * @return {string}		Dump string
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


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptForm, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'A form view class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_str_option(LibaptForm, 'format',				'list', false, []);
Libapt.register_bool_option(LibaptForm, 'is_editable',			true, false, []);
Libapt.register_bool_option(LibaptForm, 'is_selector',			false, false, []);
Libapt.register_int_option(LibaptForm, 'max_cols',				5, false, []);



/**
 * @desc				Update password values on change
 * @param {object}		arg_jqo_old			Previous password jQuery object
 * @param {object}		arg_jqo_new			New password jQuery object
 * @param {object}		arg_jqo_confirm		Confirmed new password jQuery object
 * @param {object}		arg_jqo_newhash		New password hash jQuery object
 * @return {nothing}
 * @todo				Check password rules
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
