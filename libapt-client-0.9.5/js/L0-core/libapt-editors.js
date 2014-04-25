/**
 * @file        libapt-editors.js
 * @desc        Data value editor
 * @see			libapt-object.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @static
 * @class		LibaptEditors
 * @desc		Editors static class
 * @return		nothing
 */
function LibaptEditors()
{
}


/**
 * @memberof	LibaptEditors
 * @public
 * @property	trace
 * @desc		Trace or not (boolean)
**/
LibaptEditors.trace = false;


/**
 * @memberof			LibaptEditors
 * @public
 * @method				get_editor_jqo(arg_field_object, arg_record_values, arg_is_visible, arg_is_editable, arg_is_selector)
 * @desc				Get value editor jquery object (static method)
 * @param {object}		arg_field_object	Field object (object)
 * @param {array}		arg_record_values	Record values (array or object)
 * @param {boolean}		arg_is_visible		Editor is visible (boolean)
 * @param {boolean}		arg_is_editable		Editor is editable (boolean)
 * @param {boolean}		arg_is_selector		Editor is a selector (boolean)
 * @return {object}		jquery object
 */
LibaptEditors.get_editor_jqo = function(arg_field_object, arg_record_values, arg_is_visible, arg_is_editable, arg_is_selector)
{
	var context = 'LibaptEditors.get_editor_jqo(value,is_visible,is_editable)';
	Libapt.trace_enter(context, get_arg_not_null(arg_field_object.name, 'null field'), LibaptEditors.trace);
	
	// CHECK ARGUMENTS
	if ( Libapt.is_null(arg_field_object) )
	{
		Libapt.trace_error(context, 'field is null', LibaptEditors.trace);
		return null;
	}
	arg_record_values	= get_arg_not_null(arg_record_values, []);
	arg_is_visible	= get_arg_not_null(arg_is_visible, true);
	arg_is_editable	= get_arg_not_null(arg_is_editable, true);
	arg_is_selector	= get_arg_not_null(arg_is_selector, false);
	
	
	// FIELD IS NOT VISIBLE
	if ( ! arg_is_visible && ! arg_field_object.is_part_of_join )
	{
		Libapt.trace_step(context, 'field is not visible', LibaptEditors.trace);
		var value_str = get_arg_not_null(arg_record_values[arg_field_object.name], '');
		jqo_str = $('<INPUT class="" type="HIDDEN" name="' + arg_field_object.name + '" value="' + value_str + '" readonly' + ' />\n');
		
		Libapt.trace_leave(context, 'hidden field', LibaptEditors.trace);
		return $(jqo_str);
	}
	// console.log(arg_field_object);
	
	// FIELD HAS A FOREIGN LINK TO AN OTHER MODEL
	if (arg_field_object.is_foreign)
	{
		Libapt.trace_step(context, 'field has a foreign link', LibaptEditors.trace);
		if ( ! arg_is_editable )
		{
			Libapt.trace_step(context, 'field is not editable', LibaptEditors.trace);
			var value_str = get_arg_not_null(arg_record_values[arg_field_object.name], '');
			var jqo = $('<INPUT class="" type="TEXT" name="' + arg_field_object.name + '" key_name="' + arg_field_object.foreign_key_name + '" value="' + value_str + '" readonly' + ' />\n');
			jqo.css('min-width', '50px');
			
			Libapt.trace_leave(context, 'visible not editable foreign field', LibaptEditors.trace);
			return jqo;
		}
		
		var jqo = LibaptEditors.get_select_editor_jqo(arg_field_object, arg_record_values, arg_field_object.foreign_key_name, [arg_field_object.foreign_value_name], 'concat', ' ');
		
		Libapt.trace_leave(context, 'visible editable foreign field', LibaptEditors.trace);
		return jqo;
	}
	
	
	// FIELD IS PART OF A JOIN
	if (arg_field_object.is_part_of_join)
	{
		Libapt.trace_step(context, 'field is part of join', LibaptEditors.trace);
		
		if ( ! arg_is_editable )
		{
			Libapt.trace_step(context, 'field is not editable', LibaptEditors.trace);
			
			// GET RECORD VALUES
			var record_values		= LibaptEditors.get_field_values(arg_field_object, arg_record_values, arg_field_object.name, arg_field_object.join_fields_names);
			var selected_value		= record_values;
			var record_values_str	= LibaptEditors.get_field_values_str(arg_field_object, record_values, selected_value, 'concat', ' ');
			var jqo = $('<INPUT class="" type="TEXT" name="' + arg_field_object.name + '" key_name="' + arg_field_object.name + '" value="' + record_values_str + '" readonly' + ' />\n');
			jqo.css('min-width', '50px');
			
			Libapt.trace_leave(context, 'visible not editable join field', LibaptEditors.trace);
			return jqo;
		}
		
		// GET RECORD VALUES
		var jqo = LibaptEditors.get_select_editor_jqo(arg_field_object, arg_record_values, arg_field_object.name, arg_field_object.join_fields_names, 'concat', ' ');
		
		Libapt.trace_leave(context, 'visible editable join field', LibaptEditors.trace);
		return jqo;
	}
	
	
	// FIELD IS READ ONLY
	if ( ! arg_is_editable )
	{
		Libapt.trace_step(context, 'field is not editable', LibaptEditors.trace);
		var value_str = get_arg_not_null(arg_record_values[arg_field_object.name], '');
		jqo_str = $('<INPUT class="" type="TEXT" name="' + arg_field_object.name + '" value="' + value_str + '" readonly' + ' />\n');
		jqo = $(jqo_str);
		jqo.css('min-width', '50px');
		
		Libapt.trace_leave(context, 'visible not editable field', LibaptEditors.trace);
		return $(jqo_str);
	}
	
	
	// FIELD EDITOR IS A SELECTOR
	if (arg_is_selector)
	{
		Libapt.trace_step(context, 'field editor should be a selector', LibaptEditors.trace);
		var jqo = LibaptEditors.get_select_editor_jqo(arg_field_object, arg_record_values, arg_field_object.name, [arg_field_object.name], 'concat', ' ');
		
		Libapt.trace_leave(context, 'visible editable field selector', LibaptEditors.trace);
		return jqo;
	}
	
	
	// SIMPLE FIELD
	var field_name = arg_field_object.name;
	var jqo = null;
	var jqo_str	= '';
	var value = get_arg_not_null(arg_record_values[arg_field_object.name], '');
	arg_field_object.value(context, 'field.type', this.value_type);
	arg_field_object.value(context, 'field.name', field_name);
	
	switch(arg_field_object.value_type)
	{
		// Text types
		case 'String':
			jqo_str		= $('<INPUT class="input-text" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.css('min-width', '50px');
			break;
		case 'Url':
			jqo_str		= $('<INPUT class="input-text url" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.css('min-width', '100px');
			break;
		case 'Email':
			jqo_str		= $('<INPUT class="input-text email" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.css('min-width', '100px');
			break;
		case 'Password':
			if (arg_is_editable)
			{
				var jqo_old		= $('<INPUT class="input-text apt_password_oldhash" type="HIDDEN"   subtype="OLDHASH" name="' + field_name + '_oldhash" value="' + value + '" readonly />');
				var jqo_new		= $('<INPUT class="input-text apt_password_new"     type="PASSWORD" subtype="NEW"     name="' + field_name + '_new"     value="" />');
				var jqo_confirm	= $('<INPUT class="input-text apt_password_confirm" type="PASSWORD" subtype="CONFIRM" name="' + field_name + '_confirm" value="" />');
				var jqo_newhash	= $('<INPUT class="input-text apt_password_newhash" type="HIDDEN"   subtype="NEWHASH" name="' + field_name + '"         value="' + value + '" />');
				jqo_new.css('min-width', '50px');
				jqo_confirm.css('min-width', '50px');
				jqo_confirm.change( function() { LibaptForm.on_password_change(jqo_old, jqo_new, jqo_confirm, jqo_newhash); } );
				
				jqo = $('<div></div>').append(jqo_old).append(jqo_new).append(jqo_confirm).append(jqo_newhash);
			}
			else
			{
				jqo_str = '<INPUT class="input-text" type="PASSWORD" name="' + field_name + '" value="' + value + '" readonly/>';
				jqo = $(jqo_str);
				jqo.css('min-width', '50px');
			}
			break;
		case 'RichText':
			jqo_str = '<TEXTAREA class="input-text" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + '>' + value + '</TEXTAREA>';
			jqo = $(jqo_str);
			jqo.css('min-width', '100px');
			break;
		
		// Numeric types
		case 'Integer':
			jqo_str		= $('<INPUT class="input-text digits" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.css('min-width', '50px');
			break;
		case 'Float':
			jqo_str		= $('<INPUT class="input-text digits" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			break;
		
		// Time types
		case 'Date':
			jqo_str		= $('<INPUT class="input-text datepicker" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.datepicker(
				{
					dateFormat: "yy-mm-dd"
				}
			);
			break;
		case 'DateTime':
			jqo_str		= $('<INPUT class="input-text datetimepicker" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.datetimepicker(
				{
					dateFormat: "yy-mm-dd",
					timeFormat: "hh:mm:ss",
					hourGrid: 4,
					minuteGrid: 10
				}
			);
			break;
		case 'Time':
			jqo_str		= $('<INPUT class="input-text timepicker" type="TEXT" name="' + field_name+ '" value="' + value  + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.timepicker(
				{
					timeFormat: "hh:mm:ss"
				}
			);
			break;
		
		// Default
		default:
			arg_field_object.assert(context, 'unknow type[' + arg_field_object.value_type + '] for name[' + arg_field_object.name + ']', false);
			jqo_str		= $('<INPUT class="input-text" type="TEXT" name="' + field_name + '" value="' + value + (arg_is_editable ? '"' : '" readonly') + ' />');
			jqo = $(jqo_str);
			jqo.css('min-width', '50px');
	}
	
	Libapt.trace_leave(context, 'success', LibaptEditors.trace);
	return jqo;
}


/**
 * @memberof			LibaptEditors
 * @public
 * @method				get_select_editor_jqo = function(arg_field_object, arg_field_value, arg_key_field_name, arg_values_fields_names, arg_values_format, arg_values_separator)
 * @desc				Get value select editor jquery object (static method)
 * @param {object}		arg_field_object			Field object
 * @param {object}		arg_record_values			Record values (array or object)
 * @param {array}		arg_key_field_name			key field name
 * @param {object}		arg_values_fields_names		values fields names 
 * @param {string}		arg_values_format			values format type, default 'concat'
 * @param {string}		arg_values_separator		values separator, default 'space'
 * @return {object}		jquery object
 */
LibaptEditors.get_select_editor_jqo = function(arg_field_object, arg_record_values, arg_key_field_name, arg_values_fields_names, arg_values_format, arg_values_separator, arg_model_view, arg_all_label, arg_all_value, arg_add_label, arg_add_value)
{
	var context = 'LibaptEditors.get_select_editor_jqo(field,value,key field name, values fields names, values format, values separator)';
	Libapt.trace_enter(context, '', LibaptEditors.trace);
	
	// CHECK ARGUMENTS
	if ( Libapt.is_null(arg_field_object) )
	{
		Libapt.trace_error(context, 'field is null', LibaptEditors.trace);
		return null;
	}
	arg_record_values	= get_arg_not_null(arg_record_values, []);
	if ( Libapt.is_empty_str_or_null(arg_key_field_name) )
	{
		Libapt.trace_error(context, 'key field name is empty', LibaptEditors.trace);
		return null;
	}
	if ( ! Libapt.is_array(arg_values_fields_names) )
	{
		Libapt.trace_error(context, 'values fields names is not an array', LibaptEditors.trace);
		return null;
	}
	arg_values_format		= get_arg_not_null(arg_values_format, 'concat');
	arg_values_separator	= get_arg_not_null(arg_values_separator, ' ');
	
	// DEBUG
	// Libapt.trace_var(context, 'arg_model_view', Libapt.is_null(arg_model_view) ? 'null' : arg_model_view.name, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_record_values', arg_record_values, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_key_field_name', arg_key_field_name, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_values_fields_names.length', arg_values_fields_names.length, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_values_fields_names', arg_values_fields_names, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_values_format', arg_values_format, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_values_separator', arg_values_separator, LibaptEditors.trace);
	
	// CREATE SELECT
	var jqo_select = $('<select name="' + arg_field_object.name + '" key_name="' + arg_key_field_name + '"></select>');
	jqo_select.css('margin-left', '5px');
	jqo_select.css('width', 'auto');
	var jqo_div_select = $('<div></div>');
	jqo_div_select.append(jqo_select);
	
	// CREATE REFRESH BUTTON
	var icon_url = Libapt.get_main_icon_url('refresh/refresh_24.png');
	var icon_tooltip = 'Refresh the list';
	var jqo_refresh_button_img	= $('<img src="' + icon_url + '" alt="' + icon_tooltip + '" width="24" height="24" title="' + icon_tooltip + '"></img>');
	var jqo_refresh_div	= $('<div class="ui-button-text libapt_refresh_button"></div>');
	jqo_refresh_div.append(jqo_refresh_button_img);
	jqo_refresh_div.css('float', 'left');
	
	// CREATE ADD RECORD BUTTON
	// var jqo_add_record_link = $('<a href="#" class="libapt_i18n">Add</a>');
	
	// CREATE DIV CONTAINER
	var jqo_div = $('<div></div>');
	jqo_div.css('display', 'block');
	jqo_div.css('width', 'auto');
	
	// APPEND ITEMS TO CONTAINER
	jqo_div.append(jqo_refresh_div);
	// jqo_div.append(jqo_add_record_link);
	jqo_div.append(jqo_div_select);
	
	// REFRESH BUTTON EVENT
	jqo_refresh_div.click(
		function()
		{
			Libapt.trace_enter(context + '.refresh_button.click', '', LibaptEditors.trace);
			jqo_select.find('option').remove();
			
			var force_read = true;
			var max_select_values = 1000;
			var records = null;
			if ( ! Libapt.is_null(arg_model_view) )
			{
				Libapt.trace_step(context + '.refresh_button.click', 'arg_model_view is not null and is instance of LibaptModelView', LibaptEditors.trace);
				var groups = null;
				records = arg_model_view.model.read_distinct_one_sync(arg_field_object, arg_model_view.query.fields_set.fields, arg_model_view.query.filters_set.filters, arg_model_view.query.orders_set.orders, groups, max_select_values, null, null);
			}
			else
			{
				Libapt.trace_step(context + '.refresh_button.click', 'arg_model_view is null or not instance of arg_model_view', LibaptEditors.trace);
				records = arg_field_object.get_all_distinct_values(force_read, max_select_values);
			}
			
			for(record_index in records)
			{
				// GET RECORD
				var record		= records[record_index];
				var selected	= (arg_record_values == [] && record_index == 0);
				// Libapt.trace_var(context, 'record', record, LibaptEditors.trace);
				// Libapt.trace_var(context, 'selected', selected, LibaptEditors.trace);
				
				// GET RECORD VALUE
				var key_value	= record[arg_key_field_name];
				// Libapt.trace_var(context, 'key_value', key_value, LibaptEditors.trace);
				
				// GET RECORD VALUES STRING
				var selected_value	= arg_record_values[arg_field_object.name];
				
				// ESCAPE IN OPERATOR SEPARATOR ':'
				// var regexp = /:/gi;
				// selected_value = selected_value.replace(regexp, '\\doublepoint');
				
				// GET ALL VALUES
				var record_values = LibaptEditors.get_field_values(arg_field_object, record, arg_key_field_name, arg_values_fields_names);
				// Libapt.trace_var(context, 'record_values', record_values, LibaptEditors.trace);
				
				// GET ONE STRING FOR ALL VALUES
				var record_values_str = key_value;
				var has_only_key_field = arg_values_fields_names.length < 1;
				has_only_key_field = has_only_key_field || (arg_values_fields_names.length == 1 && arg_values_fields_names[0] == arg_key_field_name);
				if ( ! has_only_key_field )
				{
					record_values_str = LibaptEditors.get_field_values_str(arg_field_object, record_values, null, arg_values_format, arg_values_separator);
				}
				
				// CREATE OPTION NODE
				var jqo_option = $('<option>' + record_values_str + '</option>');
				jqo_option.attr('key_name', arg_key_field_name);
				jqo_option.attr('key_value', key_value);
				jqo_option.attr('field', arg_field_object);
				
				// TEST SELECTED
				selected = (record_values_str == selected_value);
				if ( ! selected && arg_values_format == 'concat')
				{
					for(record_value_key in record)
					{
						var current_record_value = record[record_value_key];
						// Libapt.trace_var(context, 'selected? concat loop record value', current_record_value, LibaptEditors.trace);
						
						var value = Libapt.is_object(selected_value) ? selected_value[record_value_key] : selected_value;
						
						if (current_record_value == value)
						{
							Libapt.trace_step(context, 'current value is selected', LibaptEditors.trace);
							selected = true;
						}
					}
				}
				
				if (selected)
				{
					jqo_option.attr('selected', '');
				}
				
				// APPEND OPTION NODE TO THE SELECT NODE
				jqo_select.append(jqo_option);
			}
			
			// APPEND THE 'SELECT ADD' VALUE IF NEEDED
			if (arg_add_label && arg_add_value)
			{
				jqo_select.prepend( $('<option value="' + arg_add_value + '">' + arg_add_label + '</option>' ) );
			}
			
			// APPEND THE 'SELECT ALL' VALUE IF NEEDED
			if (arg_all_label && arg_all_value)
			{
				jqo_select.prepend( $('<option value="' + arg_all_value + '">' + arg_all_label + '</option>' ) );
			}
			
			Libapt.trace_leave(context + '.refresh_button.click', '', LibaptEditors.trace);
			return this;
		}
	);
	
	// INIT THE SELECT WITH DATAS
	jqo_refresh_div.trigger('click');
	jqo_refresh_div.hide();
	
	Libapt.trace_leave(context, 'success', LibaptEditors.trace);
	return jqo_div;
}



/**
 * @memberof			LibaptEditors
 * @public
 * @method				get_field_values = function(arg_field_object, arg_record_values, arg_key_field_name, arg_values_fields_names)
 * @desc				Get field values (static method)
 * @param {object}		arg_field_object			Field object (object)
 * @param {array}		arg_record_values			values record (array)
 * @param {string}		arg_key_field_name			key field name (string)
 * @param {array}		arg_values_fields_names		values fields names (array)
 * @return {array}		array of strings
 */
LibaptEditors.get_field_values = function(arg_field_object, arg_record_values, arg_key_field_name, arg_values_fields_names)
{
	var context = 'LibaptEditors.get_field_values(field,key field name, values fields names)';
	// Libapt.trace_enter(context, '', LibaptEditors.trace);
	
	Libapt.trace_var(context, 'arg_record_values', arg_record_values, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_key_field_name', arg_key_field_name, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_values_fields_names', arg_values_fields_names, LibaptEditors.trace);
	
	// GET RECORD VALUES
	var record_values		= new Array();
	var value_field_index	= 0;
	for(value_field_name_key in arg_values_fields_names)
	{
		// GET CURRENT VALUE FIELD NAME
		var value_field_name		= null;
		if ( arg_values_fields_names.indexOf(value_field_name_key) )
		{
			value_field_name = arg_values_fields_names[value_field_name_key];
		}
		else
		{
			value_field_name = arg_values_fields_names[value_field_index];
		}
		// Libapt.trace_var(context, 'value_field_name', value_field_name, LibaptEditors.trace);
		
		// GET CURRENT RECORD VALUE
		var current_record_value	= null;
		if ( ! Libapt.is_null( arg_record_values[value_field_name] ) )
		{
			current_record_value = arg_record_values[value_field_name];
		}
		else
		{
			current_record_value = arg_record_values[value_field_index];
		}
		// Libapt.trace_var(context, 'current_record_value', current_record_value, LibaptEditors.trace);
		
		// SAVE RECORD VALUE IF NOT NULL
		if ( value_field_name != arg_key_field_name && ! Libapt.is_null(current_record_value) )
		{
			record_values.push(current_record_value);
		}
		
		++value_field_index;
	}
	
	// Libapt.trace_leave(context, 'success', LibaptEditors.trace);
	return record_values;
}




/**
 * @memberof			LibaptEditors
 * @public
 * @method				get_field_values_str = function(arg_field_object, arg_record_values, arg_selected_value, arg_values_format, arg_values_separator)
 * @desc				Get field values string (static method)
 * @param {object}		arg_field_object			Field object (object)
 * @param {array}		arg_record_values			record values (array of strings)
 * @param {string}		arg_selected_value			selected value (string)
 * @param {string}		arg_values_format			values format type, default 'concat' (string)
 * @param {string}		arg_values_separator		values separator, default 'space' (string)
 * @return {string}		field values string
 */
LibaptEditors.get_field_values_str = function(arg_field_object, arg_record_values, arg_selected_value, arg_values_format, arg_values_separator)
{
	var context = 'LibaptEditors.get_field_values_str(field,values,selected value,format,separator)';
	Libapt.trace_enter(context, '', LibaptEditors.trace);
	
	// DEBUG
	// Libapt.trace_var(context, 'arg_selected_value', arg_selected_value, LibaptEditors.trace);
	// Libapt.trace_var(context, 'arg_record_values', arg_record_values, LibaptEditors.trace);
	
	// GET RECORD VALUES STRING
	var record_value_str = '';
	if (arg_record_values.length == 1)
	{
		if ( ! Libapt.is_null(arg_record_values[0]) )
		{
			record_value_str = arg_record_values[0];
		}
		else
		{
			record_value_str = arg_record_values[arg_field_object.name];
		}
	}
	else
	{
		switch(arg_values_format)
		{
			case 'concat':
				for(record_value_key in arg_record_values)
				{
					var current_record_value = arg_record_values[record_value_key];
					// Libapt.trace_var(context, 'current_record_value', current_record_value, LibaptEditors.trace);
					
					record_value_str = (record_value_str == '' ? '' : arg_values_separator) + current_record_value;
				}
				break;
		}
	}
	
	// Libapt.trace_leave(context, 'success', LibaptEditors.trace);
	return record_value_str;
}
