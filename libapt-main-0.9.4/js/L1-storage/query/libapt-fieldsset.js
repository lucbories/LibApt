/**
 * @file        libapt-fieldsset.js
 * @brief       Fields set class
 * @details     
 * @see			libapt-field.js
 * @ingroup     LIBAPT_CORE
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Fields set class
 * @param[in]	arg_name			name of the field
 * @param[in]	arg_fields			fields array
 */
function LibaptFieldsSet(arg_name, arg_fields)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptFieldsSet';
	var context			= 'constructor(' + arg_name + ',fields)';
	this.enter(context, 'constructor');
	
	
	// FIELDS SET ATTRIBUTES
	this.fields			= get_arg(arg_fields, []);
	this.pk_field		= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	// PUBLIC METHOD : GET URL STRING
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		var url_str = ''
		for(field_index in this.fields)
		{
			var field = this.fields[field_index];
			url_str += field.name + ',';
		}
		
		this.leave(context, 'success');
		return url_str;
	}
	
	
	// PUBLIC METHOD : ADD A FIELD
	this.add_field = function(arg_field)
	{
		var context = 'add_field(field)';
		this.enter(context, '');
		
		if ( Libapt.is_null(arg_field) )
		{
			this.leave(context, 'field is null');
			return false;
		}
		
		if ( ! arg_field instanceof LibaptField )
		{
			this.leave(context, 'field is not a LibaptField class');
			return false;
		}
		
		if ( this.has_field(arg_field.name) )
		{
			this.leave(context, 'field already exists in set');
			return true;
		}
		
		this.fields.push(arg_field);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// PUBLIC METHOD : ADD A FIELD
	this.add_fields = function(arg_fields, arg_model)
	{
		var context = 'add_fields(fields)';
		this.enter(context, '');
		// this.value(context, 'arg_fields', arg_fields);
		
		// ADD FIELDS SET
		if ( arg_fields instanceof LibaptFieldsSet )
		{
			this.step(context, 'arg_fields is a LibaptFieldsSet');
			arg_fields = arg_fields.fields;
		}
		
		// CHECK ARRAY
		if ( ! Libapt.is_array(arg_fields) )
		{
			this.step(context, 'arg_fields is not an array');
			if ( Libapt.is_string(arg_fields) && arg_model instanceof LibaptModel )
			{
				this.step(context, 'arg_fields is a string');
				var field = arg_model.fields_set.get_field(arg_fields);
				var bool_result = this.add_field(field);
				
				this.leave_or_error(context, 'fields is a string name:success', 'fields is a string name:failure', bool_result);
				return bool_result;
			}
			
			if ( arg_fields instanceof LibaptField )
			{
				this.step(context, 'arg_fields is a LibaptField');
				var bool_result = this.add_field(arg_fields);
				
				this.leave_or_error(context, 'fields is a field name:success', 'fields is a field name:failure', bool_result);
				return bool_result;
			}
			
			this.error(context, 'fields is not an array');
			return false;
		}
		
		// ADD ARRAY FIELDS
		this.step(context, 'arg_fields is an array');
		for(field_index in arg_fields)
		{
			// GET FIELDS ITEM
			var field = arg_fields[field_index];
			this.value(context, 'fields item index', field_index);
			
			// INIT BOOLEAN RESULT TEST
			var bool_result = false;
			
			
			// FIELDS ITEM IS AN OBJECT
			if ( Libapt.is_object(field) )
			{
				this.step(context, 'fields item is an object');
				this.assertNotNull(context, 'object.name', field.name);
				field = field.name;
			}
			
			// FIELDS ITEM IS A FIELD NAME
			if ( Libapt.is_string(field) )
			{
				this.step(context, 'field item is a string');
				// this.assertNotEmptyString(context, 'field item', field);
				this.assertTrue(context, 'field item', field != '');
				this.value(context, 'field item', field);
				
				// CHECK GIVEN MODEL
				this.assertNotNull(context, 'model', arg_model);
				this.value(context, 'model.name', arg_model.name);
				if  ( ! arg_model instanceof LibaptModel)
				{
					this.error(context, 'failure at field index[' + field_index + '] : item is a field name but no model given');
					return false;
				}
				
				var field = arg_model.fields_set.get_field(field);
				bool_result = this.add_field(field);
			}
			
			// FIELDS ITEM IS A FIELD OBJECT
			else if ( field instanceof LibaptField )
			{
				this.step(context, 'fields item is a field object');
				bool_result = this.add_field(field);
			}
			
			// FIELDS IS NOT A FIELD NAME NOR A FIELD OBJECT
			else
			{
				this.step(context, 'fields item is not a string nor a LibaptField instance nor an valid object');
			}
			
			// CHECK BOOLEAN RESULT TEST
			if ( ! bool_result )
			{
				this.error(context, 'failure at field index[' + field_index + ']');
				return false;
			}
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// PUBLIC METHOD : GET A FIELD WITH ITS LABEL
	this.get_field_by_label = function(arg_label)
	{
		var context = 'get_field_by_label(' + arg_label + ')';
		this.enter(context, '');
		
		for(field_index in this.fields)
		{
			var field = this.fields[field_index];
			if (field.label == arg_label)
			{
				this.leave(context, 'found');
				return field;
			}
		}
		
		this.leave(context, 'not found');
		return null;
	}
	
	
	// PUBLIC METHOD : GET A FIELD
	this.get_field = function(arg_name)
	{
		var context = 'get_field(' + arg_name + ')';
		this.enter(context, '');
		
		for(field_index in this.fields)
		{
			var field = this.fields[field_index];
			if (field.name == arg_name)
			{
				this.leave(context, 'found');
				return field;
			}
		}
		
		this.leave(context, 'not found');
		return null;
	}
	
	
	// PUBLIC METHOD : GET A FIELD
	this.get_fields = function(arg_names)
	{
		var context = 'get_fields(' + arg_names.join(',') + ')';
		this.enter(context, '');
		
		var fields = [];
		for(field_name_index in arg_names)
		{
			var name = arg_names[field_name_index];
			var field = this.get_field(name);
			if (field)
			{
				fields.push(field);
			}
			else
			{
				this.error(context, 'field name not found [' + name + ']');
			}
		}
		
		this.leave(context, 'success');
		return fields;
	}
	
	this.get_fields_name = function()
	{
		var context = 'get_fields_name()';
		this.enter(context, '');
		
		var fields_names = [];
		for(field_key in this.fields)
		{
			var field = this.fields[field_key];
			fields_names.push(field.name);
		}
		
		this.leave(context, 'success');
		return fields_names;
	}
	
	
	// PUBLIC METHOD : HAS A FIELD
	this.has_field = function(arg_name)
	{
		var context = 'has_field(' + arg_name + ')';
		this.enter(context, '');
		
		for(field_index in this.fields)
		{
			var field = this.fields[field_index];
			if (field.name == arg_name)
			{
				this.leave(context, 'found');
				return true;
			}
		}
		
		this.leave(context, 'not found');
		return false;
	}
	
	
	// PUBLIC METHOD : GET THE PRIMARY KEY FIELD
	this.get_pk_field = function()
	{
		var context = 'get_pk_field()';
		this.enter(context, '');
		
		if ( Libapt.is_null(this.pk_field) )
		{
			for(field_index in this.fields)
			{
				var field = this.fields[field_index];
				if (field.is_pk)
				{
					this.pk_field = field;
					break;
				}
			}
			if ( Libapt.is_null(this.pk_field) )
			{
				this.leave(context, 'not found');
				return null;
			}
		}
		
		this.leave(context, 'found');
		return this.pk_field;	
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('fields.count', this.fields.length);
	}
}


LibaptFieldsSet.create = function(arg_settings)
{
	var context = 'LibaptFieldsSet.create(arg_settings)';
	trace_enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'fields'		: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_empty_str_or_null(ext_settings.name) )
	{
		trace_error(context, 'object name is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var fieldsset_obj = new LibaptFieldsSet(ext_settings.name, ext_settings.fields);
	
	trace_leave(context, '', true);
	return fieldsset_obj;
}
