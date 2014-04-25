/**
 * @file        libapt-field.js
 * @brief       Field class
 * @details     
 * @see			libapt-models-model.js libapt-main.js libapt-main-ajax.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @class		LibaptField
 * @brief		Model field definition
 * @param[in]	arg_name			name of the field
 * @param[in]	arg_model_name		model name of the field
 * @param[in]	arg_source			source of the field datas ('inline' or 'model')
 * @param[in]	arg_value_type		value type
 * @param[in]	arg_value_default	default value
 * @param[in]	arg_value_format	value format
 * @param[in]	arg_label			label of the field
 * @param[in]	arg_visible			field could be displayed
 * @param[in]	arg_editable		field could be updated
 * @param[in]	arg_pk				field is a primary key
 * @param[in]	arg_crud			field is part of crud operations
 * @param[in]	arg_foreign_model_name			field is linked to a foreign model field
 * @param[in]	arg_foreign_key_field_name		field is linked to a foreign model field
 * @param[in]	arg_foreign_value_field_name	field is linked to a foreign model field
 * @param[in]	arg_join_model_name				join target model name (string)
 * @param[in]	arg_join_target_key_field_name	join target key field name (string)
 * @param[in]	arg_join_source_key_field_name	join source key field name (string)
 * @param[in]	arg_join_fields_names			join source fields names (array of strings)
 */
function LibaptField(
		arg_name, arg_model_name, arg_source,
		arg_value_type, arg_value_default, arg_value_format, arg_label,
		arg_visible, arg_editable, arg_pk, arg_crud,
		arg_foreign_model_name, arg_foreign_key_field_name, arg_foreign_value_field_name,
		// arg_join_model_name, arg_join_target_key_field_name, arg_join_source_key_field_name, arg_join_fields_names)
		arg_join_fields_names)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptField';
	var context			= this.class_name + '(' + arg_name + ',' + arg_model_name + ',' + arg_source + ',' + arg_value_type + '...)';
	this.enter(context, 'constructor');
	
	
	// FIELD ATTRIBUTES
	this.model_name		= arg_model_name;
	this.source			= arg_source;
	this.value_type		= arg_value_type;
	this.value_default	= arg_value_default;
	this.value_format	= arg_value_format;
	this.label			= arg_label;
	
	// FIELD OPTIONAL ATTRIBUTES
	this.is_visible		= get_arg(arg_visible, true);
	this.is_editable	= get_arg(arg_editable, true);
	this.is_pk			= get_arg(arg_pk, false);
	this.is_crud		= get_arg(arg_crud, false);
	
	this.foreign_model_name		= get_arg_not_empty_str(arg_foreign_model_name, null);
	this.foreign_key_name		= get_arg_not_empty_str(arg_foreign_key_field_name, null);
	this.foreign_value_name		= get_arg_not_empty_str(arg_foreign_value_field_name, null);
	this.is_foreign				= ! ( Libapt.is_null(this.foreign_model_name) || Libapt.is_null(this.foreign_key_name) || Libapt.is_null(this.foreign_value_name) );
	
	this.join_fields_names			= get_arg(arg_join_fields_names, []);
	this.is_part_of_join		= Libapt.is_array(this.join_fields_names) && this.join_fields_names.length > 0;
	
	// FIELD DATAS
	this.distinct_values		= null;
	this.distinct_values_max	= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	this.get_all_distinct_values = function(arg_force_read, arg_max)
	{
		var context = 'get_all_distinct_values';
		this.enter(context, '');
		this.value(context, 'max', arg_max);
		
		// INIT FORCE READ ARGUMENT
		if (arg_force_read === undefined)
		{
			arg_force_read = false;
		}
		this.value(context, 'force read', arg_force_read);
		
		// FIELD HAS INLINE DATAS
		if (this.source == 'inline')
		{
			if ( Libapt.is_numeric(arg_max) )
			{
				if (arg_max < this.distinct_values_max && arg_max > this.distinct_values.length)
				{
					this.leave(context, 'inline values found');
					return this.distinct_values;
				}
				
				this.distinct_values_max = arg_max;
				
				if (arg_max < this.distinct_values.length)
				{
					this.step(context, 'inline values found with slice 0-[' + (arg_max - 1) + ']');
					return this.distinct_values.slice(0, arg_max - 1);
				}
			}
			
			this.leave(context, 'inline values found');
			return this.distinct_values;
		}
		
		// FIELD HAS NOT INLINE DATAS AND HAS USABLE DATAS
		if ( ! arg_force_read && ! Libapt.is_null(this.distinct_values) )
		{
			if ( Libapt.is_numeric(arg_max) )
			{
				if (arg_max < this.distinct_values_max && arg_max > this.distinct_values.length)
				{
					// TODO
				}
				
				this.distinct_values_max = arg_max;
				
				if (arg_max < this.distinct_values.length)
				{
					this.leave(context, 'cached values found with slice 0-[' + (arg_max - 1) + ']');
					return this.distinct_values.slice(0, arg_max - 1);
				}
			}
			this.leave(context, 'cached values found');
			return this.distinct_values;
		}
		
		// FIELD NEED TO READ DATAS FROM A MODEL
		if (this.source == 'model')
		{
			// FOREIGN VALUES
			if (this.is_foreign)
			{
				this.distinct_values		= this.get_all_foreign_values(arg_max);
				this.distinct_values_max	= arg_max;
				
				this.leave(context, 'foreign model values found');
				return this.distinct_values;
			}
			
			// JOINED VALUES
			if (this.is_part_of_join)
			{
				this.distinct_values		= this.get_all_joined_values(arg_max);
				this.distinct_values_max	= arg_max;
				
				this.leave(context, 'foreign model values found');
				return this.distinct_values;
			}
			
			// DIRECT VALUES
			var model = LibaptModels.get(this.model_name);
			this.assertNotNull(context, 'model', model);
			
			var orders = [ new LibaptOrder(this, 'ASC') ];
			this.distinct_values		= model.read_all_distinct_sync([this.name], orders, arg_max);
			this.distinct_values_max	= arg_max;
			
			this.leave(context, 'model values found');
			return this.distinct_values;
		}
		
		this.leave(context, 'values not found : bad source');
		return null;
	}
	
	
	this.get_all_distinct_values_for_field = function(arg_force_read, arg_max)
	{
		var context = 'get_all_distinct_values_for_field';
		this.enter(context, '');
		
		var values = this.get_all_distinct_values(arg_force_read, arg_max);
		if ( Libapt.is_array(values) )
		{
			var values_for_field = [];
			for(var index = 0 ; index < values.length ; index++)
			{
				var value = values[index][this.name];
				values_for_field.push( value );
			}
			
			this.leave(context, 'values found');
			return values_for_field;
		}
		
		this.leave(context, 'values not found : bad source');
		return null;
	}
	
	
	this.get_all_foreign_values = function(arg_max)
	{
		var context = 'get_all_foreign_values';
		this.enter(context, '');
		
		if (this.source == 'model' && this.is_foreign)
		{
			var model = LibaptModels.get(this.foreign_model_name);
			this.assertNotNull(context, 'model', model);
			
			var field_key = model.fields_set.get_field(this.foreign_key_name);
			var field_value = model.fields_set.get_field(this.foreign_value_name);
			this.assertNotNull(context, 'field_key', field_key);
			this.assertNotNull(context, 'field_value', field_value);
			
			var orders = [ new LibaptOrder(field_value, 'ASC') ];
			var foreign_values = model.read_all_fields_sync([field_value.name, field_key.name], orders, arg_max);
			
			this.leave(context, 'model values found');
			return foreign_values;
		}
		
		this.leave(context, 'values not found : bad source');
		return null;
	}
	
	
	this.get_all_joined_values = function(arg_max)
	{
		var context = 'get_all_joined_values';
		this.enter(context, '');
		
		if (this.source == 'model' && this.is_part_of_join)
		{
			var model = LibaptModels.get(this.model_name);
			this.assertNotNull(context, 'model', model);
			
			var field_key = model.fields_set.get_field(this.name);
			var field_names = this.join_fields_names;
			field_names.push(field_key.name);

			this.assertNotNull(context, 'field_key', field_key);
			// this.assertNotNull(context, 'field_value', field_value);
			// this.value(context, 'field_value', field_value.name);
			this.value(context, 'field_key', field_key.name);
			
			// var orders = [ new LibaptOrder(field_value, 'ASC') ];
			var orders = null;
			var foreign_values = model.read_all_distinct_sync(field_names, orders, arg_max);
			// console.log(foreign_values);
			
			this.leave(context, 'model values found');
			return foreign_values;
		}
		
		this.leave(context, 'values not found : bad source');
		return null;
	}
	
	
	this.get_field_editor = function(arg_field_value, arg_field_visible, arg_field_editable, arg_field_selector)
	{
		var context = 'get_field_editor(value,is_visible,is_editable)';
		this.enter(context, '');
		
		var jqo = LibaptEditors.get_editor_jqo(this, arg_field_value, arg_field_visible, arg_field_editable, arg_field_selector);
		
		if ( Libapt.is_null(jqo) )
		{
			this.leave(context, 'editor not found');
			return null;
		}
		
		this.leave(context, 'success');
		return jqo;
	}
	
	
	
	this.to_string_self = function()
	{
		return this.to_string_value('model_name', this.model_name)
			+ this.to_string_value('source', this.source)
			+ this.to_string_value('value_type', this.value_type)
			+ this.to_string_value('value_default', this.value_default)
			+ this.to_string_value('value_format', this.value_format)
			+ this.to_string_value('label', this.label)
			+ this.to_string_value('is_visible', this.is_visible)
			+ this.to_string_value('is_editable', this.is_editable)
			+ this.to_string_value('is_pk', this.is_pk)
			+ this.to_string_value('foreign_model_name', this.foreign_model_name)
			+ this.to_string_value('foreign_field_name', this.foreign_field_name)
			+ this.to_string_value('is_foreign', this.is_foreign)
			;
	}
}



var LIBAPT_FIELD_TRACE = false;

LibaptField.create = function(arg_settings)
{
	var context = 'LibaptField.create(arg_settings)';
	Libapt.trace_enter(context, '', LIBAPT_FIELD_TRACE);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'model_name'	: null,
			'source'		: 'model',
			'value_type'	: 'string',
			'value_default'	: '',
			'value_format'	: '',
			'label'			: '',
			'is_visible'	: true,
			'is_editable'	: true,
			'is_pk'			: true,
			'is_crud'		: true,
			'foreign_model'			: '',
			'foreign_key_field'		: '',
			'foreign_value_field'	: '',
			'join_editor_fields'	: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_empty_str_or_null(ext_settings.name) )
	{
		Libapt.trace_error(context, 'model name definition is not valid', LIBAPT_FIELD_TRACE);
		return null;
	}
	if ( Libapt.is_empty_str_or_null(ext_settings.model_name) )
	{
		Libapt.trace_error(context, 'model model_name definition is not valid', LIBAPT_FIELD_TRACE);
		return null;
	}
	if ( Libapt.is_empty_str_or_null(ext_settings.source) || (ext_settings.source != 'model' && ext_settings.source != 'inline') )
	{
		Libapt.trace_error(context, 'model source definition is not valid', LIBAPT_FIELD_TRACE);
		return null;
	}
	if ( Libapt.is_empty_str_or_null(ext_settings.value_type) )
	{
		Libapt.trace_error(context, 'model value_type definition is not valid', LIBAPT_FIELD_TRACE);
		return null;
	}
	
	// CREATE OBJECT
	var field_obj = new LibaptField(
		ext_settings.name, ext_settings.model_name, ext_settings.source,
		ext_settings.value_type, ext_settings.value_default, ext_settings.value_format, ext_settings.label,
		ext_settings.is_visible, ext_settings.is_editable, ext_settings.is_pk, ext_settings.is_crud,
		ext_settings.foreign_model, ext_settings.foreign_key_field, ext_settings.foreign_value_field,
		ext_settings.join_editor_fields);
	
	Libapt.trace_leave(context, '', LIBAPT_FIELD_TRACE);
	return field_obj;
}




/**
 * @memberof	LibaptField
 * @public
 * @fn			get_all_distinct_values(arg_force_read, arg_max)
 * @brief		Get all distinct values of the model for the field
 * @param[in]	arg_force_read	force values reading and skip the cache (boolean)
 * @param[in]	arg_max			max returned values count (integer)
 * @return		values (array or null)
 */
/**
 * @memberof	LibaptField
 * @public
 * @fn			get_all_foreign_values(arg_max)
 * @brief		Get all distinct values of the model for the field through the foreign link
 * @param[in]	arg_max			max returned values count (integer)
 * @return		values (array or null)
 */
/**
 * @memberof	LibaptField
 * @public
 * @fn			get_all_joined_values(arg_max)
 * @brief		Get all distinct values of the model for the field through the join link
 * @param[in]	arg_max			max returned values count (integer)
 * @return		values (array or null)
 */
/**
 * @memberof	LibaptField
 * @public
 * @fn			get_field_editor(arg_field_value, arg_field_visible, arg_field_editable, arg_field_selector)
 * @brief		Get field editor dom element
 * @param[in]	arg_field_value		Field value (anything)
 * @param[in]	arg_field_visible	Field is visible (boolean)
 * @param[in]	arg_field_editable	Field is editable (boolean)
 * @param[in]	arg_field_selector	Field editor is a selector (boolean)
 * @return		jquery object
 */
/**
 * @memberof	LibaptField
 * @public
 * @fn			to_string_self()
 * @brief		Child class specific to_string part
 * @return		string
 */
