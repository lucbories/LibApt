/**
 * @file        libapt-introspect-classes.js
 * @desc        Libapt static classes features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method					Libapt.get_class_name(arg_class_proto)
 * @desc					Get a class name from a class prototype, a class object, a class name
 * @param {object|string}	arg_class_value			A class name, a class instance, a class prototype
 * @return {string}
 */
Libapt.get_class_name = function(arg_class_value)
{
	// CHECK ARGS
	if ( Libapt.is_null(arg_class_value) )
	{
		return null;
	}
	
	// GET CLASS NAME FROM A STRING
	if ( Libapt.is_string(arg_class_value) )
	{
		// console.log('arg_class_value:' + arg_class_value);
		return arg_class_value;
	}
	
	// GET CLASS NAME FROM A FUNCTION
	if ( Libapt.is_function(arg_class_value) )
	{
		// console.log('Libapt.get_class_name : from a function');
		if ( Libapt.is_string(arg_class_value.name) )
		{
			// console.log('Libapt.get_class_name : from a function : with .name');
			// console.log('arg_class_value.name:' + arg_class_value.name);
			return arg_class_value.name;
		}
		else
		{
			// console.log('Libapt.get_class_name : from a function : without .name');
			if (arg_class_value.prototype.name !== undefined)
			{
				// console.log('arg_class_value.prototype.name:' + class_name);
				return arg_class_value.prototype.name;
			}
			else
			{
				var func_name_regex = /function\s+(.{1,})\s*\(/;
				var src_code = arg_class_value.toString();
				var results = func_name_regex.exec(src_code);
				var class_name = (results && results.length > 1) ? results[1] : "";
				// console.log(src_code);
				// console.log(resuls);
				// console.log('class_name:' + class_name);
				return class_name;
			}
		}
	}
	
	// GET CLASS NAME FROM A LibaptObject OR PARENT CLASS INSTANCE
	if ( Libapt.is_object(arg_class_value) )
	{
		if ( Libapt.is_string(arg_class_value.class_name) )
		{
			// console.log('arg_class_value.class_name:' + arg_class_value.class_name);
			return arg_class_value.class_name;
		}
	}
	
	// console.log( Libapt.get_prototype_name(arg_class_value.prototype) );
	// console.log('no class name');
	return null;
}



/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Classes array os class record
 * 				 class record is an object as :
 *					{
 * 						name: '...',
 * 						proto: LibaptAAA,
 *						parents_array: [],
 *						parents_by_name: {},
 * 						childs_array: [],
 * 						childs_by_name: {},
 *						options_array: [],
 * 						options_by_name: {},
 *						author: '...',
 * 						updated: '2013-08-21',
 *						description: '...'
 * 					}
 */
Libapt.introspect_classes_array = [];



/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Classes associative array
 */
Libapt.introspect_classes_by_name = {};



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_classes_array()
 * @desc				Get the classes array
 * @return {array}		Array of object
 */
Libapt.get_classes_array = function()
{
	return Libapt.introspect_classes_array;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_class_record(arg_class_obj)
 * @desc				Register a class record
 * @param {object}		arg_classe_obj
 * @return {nothing}
 */
Libapt.register_class_record = function(arg_class_obj)
{
	// CHECK CLASS RECORD
	if ( ! Libapt.is_object(arg_class_obj) )
	{
		Libapt.error('Libapt.register_class_record: bad class record');
		return;
	}
	
	// CHECK CLASS RECORD ATTRIBUTES
	if ( ! Libapt.is_string(arg_class_obj.name) )
	{
		Libapt.error('Libapt.register_class_record: bad class record name');
		return;
	}
	if ( ! Libapt.is_array(arg_class_obj.parents_array) )
	{
		Libapt.error('Libapt.register_class_record: bad class record parents');
		return;
	}
	if ( ! Libapt.is_object(arg_class_obj.parents_by_name) )
	{
		arg_class_obj.parents_by_name = {};
	}
	
	// REGISTER CLASS RECORD
	Libapt.introspect_classes_array.push(arg_class_obj);
	Libapt.introspect_classes_by_name[arg_class_obj.name] = arg_class_obj;
	
	// UPDATE INHERITANCES
	for(parent_index in arg_class_obj.parents_array)
	{
		var parent_value = arg_class_obj.parents_array[parent_index];
		if ( Libapt.is_string(parent_value) )
		{
			var class_record = Libapt.introspect_classes_by_name[parent_value];
			if ( ! Libapt.is_object(class_record) )
			{
				Libapt.error('Libapt.register_class_record: bad inherited class record [' + parent_value + ']');
				return;
			}
			
			arg_class_obj.parents_array[parent_index] = class_record;
			arg_class_obj.parents_by_name[class_record.name] = class_record;
			
			class_record.childs_array.push(arg_class_obj);
			class_record.childs_by_name[arg_class_obj.name] = arg_class_obj;
		}
	}
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_class(arg_class_proto, arg_class_parents, arg_class_author, arg_class_updated, arg_class_desc)
 * @desc				Register a class
 * @param {object}		arg_class_proto
 * @param {array}		arg_class_parents
 * @param {string}		arg_class_author
 * @param {string}		arg_class_updated
 * @param {string}		arg_class_desc
 * @return {nothing}
 */
Libapt.register_class = function(arg_class_proto, arg_class_parents, arg_class_author, arg_class_updated, arg_class_desc)
{
	// CHECK CLASS NAME
	if ( ! Libapt.is_function(arg_class_proto) )
	{
		Libapt.error('Libapt.register_class: bad class prototype');
		return;
	}
	
	// CHECK CLASS PARENTS
	if ( ! Libapt.is_array(arg_class_parents) )
	{
		arg_class_parents = [];
	}
	
	// CHECK CLASS AUTHOR
	if ( ! Libapt.is_string(arg_class_author) || arg_class_author.length == 0 )
	{
		arg_class_author = 'Luc BORIES';
	}
	
	// CHECK CLASS UPDATE DATE
	if ( ! Libapt.is_string(arg_class_updated) || arg_class_updated.length == 0 )
	{
		arg_class_updated = '2013-01-01';
	}
	
	// CHECK CLASS DESCRIPTION
	if ( ! Libapt.is_string(arg_class_desc) )
	{
		arg_class_desc = '';
	}
	
	var class_record =
		{
			name: Libapt.get_prototype_name(arg_class_proto),
			proto: arg_class_proto,
			parents_array: arg_class_parents,
			parents_by_name: {},
			childs_array: [],
			childs_by_name: {},
			options_array: [],
			options_by_name: {},
			author: arg_class_author,
			updated: arg_class_updated,
			description: arg_class_desc
		};
	
	Libapt.register_class_record(class_record);
}
