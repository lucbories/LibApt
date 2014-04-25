/**
 * @file        libapt.js
 * @desc        Libapt static common features: Libapt static class, traces, errors, types, inheritance, modules, resources, utils
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @ingroup     LIBAPT_MAIN_JS
 * @public
 * @static
 * @class		Libapt
 * @desc		Provide common features : types test, modules repository, classes inheritance
 */
Libapt = function()
{
}



// --------------------------------------------- LOGS AND ERRORS ---------------------------------------------

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Log indentation string
 */
Libapt.log_indent_str = '';

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Log indentation index
 */
Libapt.log_indent_index = 0;

/**
 * @memberof	Libapt
 * @public
 * @desc		Log indentation separator
 * @static
 */
Libapt.log_indent_sep = '-';

/**
 * @memberof		Libapt
 * @public
 * @static
 * @method			Libapt.log(arg_log_obj)
 * @desc			Trace a message
 * @param {object}	arg_log_obj		log attributes	
 * @return {nothing}
 */
Libapt.log = function(arg_log_obj)
{
	if ( ! arg_log_obj )
	{
		return;
	}
	
	var level	= arg_log_obj.level   ? arg_log_obj.level   : 'UNKNOW';
	var context	= arg_log_obj.context ? arg_log_obj.context : 'UNKNOW';
	var step	= arg_log_obj.step ? arg_log_obj.step : '';
	var text	= arg_log_obj.text ? arg_log_obj.text : '';
	
	console.log(level + ' ' + Libapt.log_indent_str + step + ':' + context + ' : ' + text);
}

/**
 * @memberof	Libapt
 * @public
 * @static
 * @method		Libapt.log_indent()
 * @desc		Increment the log indentation
 * @return		nothing
 */
Libapt.log_indent = function()
{
	++Libapt.log_indent_index;
	Libapt.log_indent_str += Libapt.log_indent_sep;
}

/**
 * @memberof	Libapt
 * @public
 * @static
 * @method		Libapt.log_unindent()
 * @desc		Decrement the log indentation
 * @return {nothing}
 */
Libapt.log_unindent = function()
{
	--Libapt.log_indent_index;
	Libapt.log_indent_str = Libapt.log_indent_str.substring(0, Libapt.log_indent_index - 1);
}

/**
 * @memberof		Libapt
 * @public
 * @static
 * @method			Libapt.error(arg_error_obj)
 * @desc			Throw an error
 * @param {object}	arg_error_obj		Error attributes
 * @return {nothing}
 */
Libapt.error = function(arg_error_obj)
{
	arg_error_obj = arg_error_obj || {};
	
	if ( Libapt.is_string(arg_error_obj) )
	{
		arg_error_obj = { text: arg_error_obj };
	}
	
	var context = arg_error_obj.context ? arg_error_obj.context : null;
	var step = arg_error_obj.step ? arg_error_obj.step : null;
	
	// LOG THE ERROR
	Libapt.log( { level:'DEBUG', step:'',   context:' ',      text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' } );
	Libapt.log( { level:'ERROR', step:step, context:context, text: arg_error_obj.text, datas: arg_error_obj } );
	Libapt.log( { level:'DEBUG', step:'',   context:' ',      text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' } );
	
	// THROW AN EXCEPTION
	var error_str = 'ERROR:' + arg_error_obj;
	throw(error_str);
}



// --------------------------------------------- TYPES ---------------------------------------------

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.type_of(arg_value)
 * @desc				Get the type of a value
 * @param {anything}	arg_value		value to get the type
 * @return {string}		type name
 */
Libapt.type_of = function(arg_value)
{
	// THE VALUE IS NULL
	if (arg_value === null)
	{
		return 'null';
	}
	
	// THE VALUE HAS A SIMPLE TYPE
	var type = typeof(arg_value);
	if (type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean')
	{
		return type;
	}
	
	// THE VALUE IS A FUNCTION
	if (type === 'function') {
		return 'function';
	}
	
	// THE VALUE HAS AN STANDARD OBJECT
	var type_str = Object.prototype.toString.apply(arg_value);
	switch(type_str)
	{
		case '[object Array]':		return 'array';
		case '[object Date]':		return 'date';
		case '[object Boolean]':	return 'boolean';
		case '[object Number]':		return 'number';
		case '[object RegExp]':		return 'regexp';
	}
	
	// THE VALUE IS AN OTHER OBJECT
	if (type === 'object')
	{
		return 'object';
	}
	
	Libapt.error( { source: 'Libapt.type_of', text: 'unknow type of [' + arg_value + ']' } );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_array(arg_value)
 * @desc				Test if the value is an array
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_array = function(arg_value)
{
	return Object.prototype.toString.apply(arg_value) === '[object Array]';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_null(arg_value)
 * @desc				Test if the value is an null or undefined
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_null = function(arg_value)
{
	return arg_value == null || typeof arg_value === 'undefined';
}

/**
 * @memberof			Libapt
 * @public
 * @method				Libapt.is_undefined(arg_value)
 * @desc				Test if the value is undefined
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_undefined = function(arg_value)
{
	return typeof arg_value === 'undefined';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_object(arg_value)
 * @desc				Test if the value is an object
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_object = function(arg_value)
{
	return typeof arg_value == 'object';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_string(arg_value)
 * @desc				Test if the value is a string
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_string = function(arg_value)
{
	return typeof arg_value == 'string' || typeof arg_value == 'String';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_boolean(arg_value)
 * @desc				Test if the value is a boolean
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_boolean = function(arg_value)
{
	return typeof arg_value == 'boolean' || typeof arg_value == 'Boolean';
}

/**
 * @memberof			Libapt
 * @public
 * @method				Libapt.is_numeric(arg_value)
 * @desc				Test if the value is a number
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_numeric = function(arg_value)
{
	return typeof arg_value == 'number' || typeof arg_value == 'Number';
}

/**
 * @memberof	Libapt
 * @public
 * @static
 * @method		Libapt.is_number(arg_value)
 * @desc		Test if the value is a number
 * @param		arg_value			value to test {anything}
 * @return {boolean}
 */
Libapt.is_number = function(arg_value)
{
	return typeof arg_value == 'number' || typeof arg_value == 'Number';
}

/**
 * @memberof			Libapt
 * @public
 * @method				Libapt.is_function(arg_value)
 * @desc				Test if the value is a function
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_function = function(arg_value)
{
	return typeof arg_value == 'function';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.Libapt.is_empty_array_or_null(arg_value)
 * @desc				Test if the value is an empty array
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_empty_array = function(arg_value)
{
	return Libapt.is_array(arg_value) && (arg_value.length == 0);
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_empty_array_or_null(arg_value)
 * @desc				Test if the value is an empty array or null or undefined
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_empty_array_or_null = function(arg_value)
{
	return Libapt.is_null(arg_value) || ( Libapt.is_array(arg_value) && (arg_value.length == 0) );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_not_empty_array(arg_value)
 * @desc				Test if the value is a not empty array
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_not_empty_array = function(arg_value)
{
	return Libapt.is_array(arg_value) && (arg_value.length > 0);
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_empty_str_or_null(arg_value)
 * @desc				Test if the value is an empty string
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_empty_str = function(arg_value)
{
	return Libapt.is_string(arg_value) && arg_value == '';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_empty_str_or_null(arg_value)
 * @desc				Test if the value is an empty string or null or undefined
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_empty_str_or_null = function(arg_value)
{
	return Libapt.is_null(arg_value) || ( Libapt.is_string(arg_value) && arg_value == '' );
}

/**
 * @memberof		Libapt
 * @public
 * @static
 * @method				Libapt.is_not_empty_str(arg_value)
 * @desc				Test if the value is a not empty string
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_not_empty_str = function(arg_value)
{
	return ! Libapt.is_empty_str_or_null(arg_value);
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_empty_int(arg_value)
 * @desc				Test if the value is an empty integer
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_empty_int = function(arg_value)
{
	return Libapt.is_number(arg_value) && arg_value == 0;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_empty_int(arg_value)
 * @desc				Test if the value is an empty integer or null or undefined
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_empty_int_or_null = function(arg_value)
{
	return Libapt.is_null(arg_value) || ( Libapt.is_number(arg_value) && arg_value == 0 );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.in_array(arg_array, arg_needle, arg_strict)
 * @desc				Test a value is contained in an array
 *
 * Examples :
 *	var myArray = new Array('test1', 'test3', 4);
 *	in_array(myArray, '4'); // true
 *	in_array(myArray, '4', true); // false
 *	in_array(myArray, 4, true); // true
 * 
 * @param {array}		varArray le tableau de référence
 * @param {string}		needle l'élément à vérifier
 * @param {boolean}		strict vérification strict selon le type de variable
 * @return {boolean}
 */
Libapt.in_array = function(arg_array, arg_needle, arg_strict)
{
	arg_strict = !!arg_strict || false;

	for(var key in arg_array)
	{
		if (arg_strict)
		{
		
			if (arg_array[key] === arg_needle)
			{
			
				return true;
			}
		}
		else if (arg_array[key] == arg_needle)
		{
		
			return true;
		}
	}
	return false;
}

// BUG ???
// Array.prototype.contains = function(thLibapt.is_array, value)
// {
	// return in_array(thLibapt.is_array, value);
// }

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_value_str(arg_value)
 * @desc				Dump a value into a string
 * @param {anything}	arg_value			value to dump
 * @return {string}
 */
Libapt.get_value_str = function(arg_value)
{
	if ( Libapt.is_null(arg_value) )
	{
		return 'null';
	}
	
	if ( Libapt.is_function(arg_value) )
	{
		return 'function:' + arg_value.name;
	}
	
	if ( Libapt.is_object(arg_value) )
	{
		var str = '{';
		for(key in arg_value)
		{
			var member = arg_value[key];
			if ( ! Libapt.is_function(member) )
			{
				str += '\n  ' + key + '=' + Libapt.get_value_str(member);
			}
		}
		return str + '\n}';
	}
	
	if ( Libapt.is_array(arg_value) )
	{
		var str = '[';
		for(key in arg_value)
		{
			str += key + '=' + Libapt.get_value_str( arg_value[key] );
		}
		return str + ']';
	}
	
	return arg_value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_boolean(arg_value, arg_default_value)
 * @desc				Convert the value to a boolean
 * @param {anything}	arg_value			value to convert
 * @param {boolean}		arg_default_value	default value
 * @return {boolean}
 */
Libapt.to_boolean = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? false : arg_default_value;
	
	if ( Libapt.is_boolean(arg_value) )
	{
		return arg_value;
	}
	if ( Libapt.is_string(arg_value) )
	{
		var str_value = arg_value.toLowerCase();
		if (str_value == 'true' || str_value == 'on' || str_value == '1')
		{
			return true;
		}
		return default_value;
	}
	
	return default_value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_numeric(arg_value, arg_default_value)
 * @desc				Convert the value to a boolean
 * @param {anything}	arg_value			value to convert
 * @param {number}		arg_default_value	default value
 * @return {number}
 */
Libapt.to_number = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? 0 : arg_default_value;
	
	if ( Libapt.is_number(arg_value) )
	{
		return arg_value;
	}
	if ( Libapt.is_string(arg_value) )
	{
		var str_value = arg_value.toLowerCase();
		var value = eval(str_value);
		if ( Libapt.is_number(value) )
		{
			return value;
		}
	}
	
	return default_value;
}



// --------------------------------------------- CLASSES INHERITANCE ---------------------------------------------

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Inheritance tree
 */
Libapt.inheritances = {};

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_inheritance(arg_class_proto, arg_class_proto_inherited)
 * @desc				Register an inheritance edge
 * @param {object}		arg_class_proto				class to test
 * @param {object}		arg_class_proto_inherited	inherited class
 * @return {nothing}
 */
Libapt.register_inheritance = function(arg_class_proto, arg_class_proto_inherited)
{
	Libapt.inheritances[arg_class_proto.name] = { parents:[], current:arg_class_proto, inherited: arg_class_proto_inherited};
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.test_inheritance(arg_class_proto, arg_class_proto_inherited)
 * @desc				Test an inheritance
 * @param {object}		arg_class_proto				class to test
 * @param {object}		arg_class_proto_inherited	inherited class
 * @return {boolean}
 */
Libapt.test_inheritance = function(arg_class_proto, arg_class_proto_inherited)
{
	if ( Libapt.is_null(arg_class_proto) || Libapt.is_null(arg_class_proto_inherited) )
	{
		return false;
	}
	
	var class_name = null;
	if ( Libapt.is_string(arg_class_proto) )
	{
		class_name = arg_class_proto;
		if (class_name == arg_class_proto_inherited.name)
		{
			console.log('test_inheritance: is string : class name == proto');
			return true;
		}
	}
	else
	{
		if ( Libapt.is_function(arg_class_proto) )
		{
			if (arg_class_proto == arg_class_proto_inherited)
			{
				// console.log('test_inheritance: is function : proto == proto');
				return true;
			}
			class_name = arg_class_proto.name;
		}
		else
		{
			if ( ! Libapt.is_object(arg_class_proto) )
			{
				// console.log('test_inheritance: arg is not string/function/object');
				return false
			}
			if (arg_class_proto.class_name == arg_class_proto_inherited.name || arg_class_proto instanceof arg_class_proto_inherited)
			{
				// console.log('test_inheritance: is object : object == proto');
				return true;
			}
			class_name = arg_class_proto.class_name;
		}
	}
	// console.log('test_inheritance: ' + class_name + ' inherits ' + arg_class_proto_inherited.name + '?' + '(' + typeof(arg_class_proto) + ',' + typeof(arg_class_proto_inherited) + ')');
	
	var record = Libapt.inheritances[class_name];
	if ( Libapt.is_null(record) )
	{
		// console.log('test_inheritance: no record found');
		return false;
	}
	
	if (record.inherited == arg_class_proto_inherited)
	{
		return true;
	}
	
	return Libapt.test_inheritance(record.inherited, arg_class_proto_inherited);
}

/**
 * @memberof	Libapt
 * @public
 * @static
 * @method				Libapt.is_a(arg_class_proto, arg_class_proto_inherited)
 * @desc				Test an inheritance (alias of test_inheritance)
 * @param {object}		arg_class_proto				class to test
 * @param {object}		arg_class_proto_inherited	inherited class
 * @return {boolean}
 */
Libapt.is_a = function(arg_class_proto, arg_class_proto_inherited)
{
	return Libapt.test_inheritance(arg_class_proto, arg_class_proto_inherited);
}



// --------------------------------------------- REMOTE JAVASCRIPT LOADING ---------------------------------------------

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		is ajax request asynchronous default flag
 */
var LIBAPT_LOAD_SCRIPT_ASYNC = false;

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		is ajax result cached default flag
 */
var LIBAPT_LOAD_SCRIPT_CACHE = false;

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		ajax request default type name
 */
var LIBAPT_LOAD_SCRIPT_RESULT_TYPE = 'script';

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		ajax request default timeout
 */
var LIBAPT_LOAD_SCRIPT_TIMEOUT = 5;


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.load_script(arg_script_url, arg_async, arg_cache, arg_ok_cb, arg_ko_cb, arg_result_type)
 * @desc				Load a remote script
 * @param {string}		arg_script_url		url of the script to load
 * @param {boolean}		arg_async			is ajax request asynchronous flag
 * @param {boolean}		arg_cache			is ajax result cached flag
 * @param {function}	arg_ok_cb			callback on ajax request success
 * @param {function}	arg_ko_cb			callback on ajax request failure
 * @param {string}		arg_result_type		ajax result data type
 * @return {boolean}
 */
Libapt.load_script = function(arg_script_url, arg_async, arg_cache, arg_ok_cb, arg_ko_cb, arg_result_type)
{
	// console.log('Libapt.load_script [' + arg_script_url + '] begin');
	$.ajax(
		{
			async		: Libapt.is_null(arg_async) ? LIBAPT_LOAD_SCRIPT_ASYNC : arg_async,
			cache		: Libapt.is_null(arg_cache) ? LIBAPT_LOAD_SCRIPT_CACHE : arg_cache,
			type		: 'GET',
			dataType	: Libapt.is_null(arg_result_type) ? LIBAPT_LOAD_SCRIPT_RESULT_TYPE : arg_result_type,
			url			: arg_script_url,
			timeout		: LIBAPT_LOAD_SCRIPT_TIMEOUT,
			data		: null,
			
			success : function(datas, textStatus, jqXHR)
				{
					// var context = 'Libapt.load_script.ajax_request.success(...)';
					// console.log(context);
					
					if (arg_ok_cb)
					{
						arg_ok_cb(datas);
					}
				},
			
			error : function(jqXHR, textStatus, errorThrown)
				{
					var context = 'Libapt.load_script.ajax_request.error(' + arg_script_url + ')';
					console.log(context);
					console.log(textStatus);
					
					if (arg_ko_cb)
					{
						arg_ko_cb(textStatus);
					}
				}
		}
	);
	
	// console.log('Libapt.load_script [' + arg_script_url + '] end');
}



// --------------------------------------------- MODULES LOADING ---------------------------------------------

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Registered modules associative array
 */
Libapt.modules = {};

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Loaded modules associative array
 */
Libapt.loaded_modules = {};

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Registered modules by class name associative array
 */
Libapt.modules_by_class = {};


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register(arg_modules)
 * @desc				Register a module definition
 * @param {object}		arg_modules			module object to register
 * @return {nothing}
 */
Libapt.register = function(arg_modules)
{
	// console.log('Libapt.register modules');
	
	// CHECK MODULES ARRAY
	var modules_array = arg_modules;
	if ( ! Libapt.is_array(arg_modules) )
	{
		modules_array = [ arg_modules ];
	}
	
	// LOOP ON MODULES
	for(module_index in modules_array)
	{
		var module = modules_array[module_index];
		
		// CHECK IF ALREADY REGISTERED
		if ( Libapt.modules[module.name] )
		{
			return;
		}
		
		// INIT MODULE
		module.state = 'not_loaded';
		Libapt.modules[module.name] = module;
		// console.log('Libapt.register module [' + module.name + ']');
		
		// LOOP ON CLASSES
		for(class_index in module.classes)
		{
			var class_name = module.classes[class_index];
			Libapt.modules_by_class[class_name] = module;
		}
		
		// REGISTER MODULE IN ITS PARENT
		if (module.parent)
		{
			var parent_module = Libapt.modules[module.parent];
			if (parent_module)
			{
				if ( ! Libapt.is_array(parent_module.childs) )
				{
					parent_module.childs = [];
				}
				parent_module.childs.push(module);
			}
		}
		
		// REGISTER SUB MODULES
		var modules_file = module.modules_file;
		if (modules_file)
		{
			Libapt.load_script(modules_file);
		}
	}
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.use(arg_module_name, arg_force_reload, arg_reload_depth, arg_loaded_modules)
 * @desc				Use a registered module by the module name or the module class name
 * @param {string}		arg_module_name			module name or class name to use and load if needed
 * @param {boolean}		arg_force_reload		force module reloading
 * @param {boolean}		arg_reload_depth		depth of modules reloading in the depencies tree
 * @param {object}		arg_loaded_modules		associative array of current loaded modules
 * @return {nothing}
 */
Libapt.use = function(arg_module_name, arg_force_reload, arg_reload_depth, arg_loaded_modules)
{
	// console.log('Libapt.use module [' + arg_module_name + '] force[' + arg_force_reload + '] depth[' + arg_reload_depth + ']');
	
	// INIT RELOAD DEPTH
	if ( arg_force_reload && ! Libapt.is_numeric(arg_reload_depth) )
	{
		arg_reload_depth = 99;
	}
	
	// INIT RELOAD STACK
	if ( arg_force_reload && ! Libapt.is_object(arg_loaded_modules) )
	{
		arg_loaded_modules = {};
	}
	
	// MODULE ALREADY LOADED
	if ( Libapt.loaded_modules[arg_module_name] )
	{
		if ( ! (arg_force_reload && arg_reload_depth > 0) )
		{
			return;
		}
	}
	if ( arg_force_reload && ! Libapt.is_null( arg_loaded_modules[arg_module_name] ) )
	{
		return;
	}
	
	// GET MODULE BY NAME
	var module = Libapt.modules[arg_module_name];
	
	// CHECK MODULE
	if (! module)
	{
		// USE A CLASS
		module = Libapt.modules_by_class[arg_module_name];
		if (! module)
		{
			console.log('ERROR Libapt.use module not found [' + arg_module_name + ']');
			return;
		}
		
		// MODULE ALREADY LOADED
		if ( module.state != 'not_loaded' && Libapt.loaded_modules[module.name] )
		{
			if ( ! (arg_force_reload && arg_reload_depth > 0) )
			{
				return;
			}
			if ( arg_force_reload && ! Libapt.is_null( arg_loaded_modules[arg_module_name] ) )
			{
				return;
			}
		}
	}
	
	// MODULE ALREADY LOADED
	if (module.state == 'loading')
	{
		return;
	}
	
	// REGISTER MODULE AS LOADED
	module.state = 'loading';
	Libapt.loaded_modules[arg_module_name] = module;
	if (arg_force_reload)
	{
		arg_loaded_modules[arg_module_name] = true;
	}
	
	// LOAD REQUIRED MODULES
	for(required_module_index in module.requires)
	{
		var require_module_name = module.requires[required_module_index];
		if ( ! arg_force_reload || (arg_force_reload && Libapt.is_null( arg_loaded_modules[require_module_name] ) ) )
		{
			Libapt.use(require_module_name, arg_force_reload, arg_reload_depth - 1, arg_loaded_modules);
		}
	}
	
	// LOAD MODULE CSS FILES
	var css_files = module.css_files;
	if (css_files)
	{
		// CHECK ARRAY
		if ( Libapt.is_string(css_files) )
		{
			css_files = [ css_files ];
		}
		
		// LOOP ON MODULE CSS FILES
		for(css_file_index in css_files)
		{
			var url = css_files[css_file_index];
			$('head').append('<link>');
			var css = $('head').children(':last');
			css.attr(
				{
					rel:  "stylesheet",
					type: "text/css",
					href: url,
					media: 'all'
				}
			);
		}
	}
	
	// LOAD MODULE JS FILES
	var js_files = module.js_files;
	if (js_files)
	{
		// CHECK ARRAY
		if ( Libapt.is_string(js_files) )
		{
			js_files = [ js_files ];
		}
		
		// LOOP ON MODULE CSS FILES
		for(js_file_index in js_files)
		{
			var url = js_files[js_file_index];
			Libapt.load_script(url);
		}
	}
	
	// LOAD MODULE MAIN SCRIPT
	var url = module.file;
	if (url)
	{
		Libapt.load_script(url);
	}
	
	// LOAD CHILDS MODULES
	if (module.childs)
	{
		for(child_index in module.childs)
		{
			var child_module = module.childs[child_index];
			Libapt.use(child_module.name, arg_force_reload, arg_reload_depth - 1, arg_loaded_modules);
		}
	}
	
	module.state = 'loaded';
}




// --------------------------------------------- RESOURCES INIT ---------------------------------------------


/**
 * @memberof			Libapt
 * @public
 * @static
 * @desc				Array of resources init callbacks
 */
Libapt.init_resources_by_index	= [];

/**
 * @memberof			Libapt
 * @public
 * @static
 * @desc				Associative array of resources init callbacks by name
 */
Libapt.init_resources_by_name	= {};

/**
 * @memberof			Libapt
 * @public
 * @static
 * @desc				Array of resources after init callbacks
 */
Libapt.init_after_resources		= [];


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.init_resource(arg_init_name, arg_init_cb)
 * @desc				Register a callback to init some resource at the end of the page loading
 * @param {string}		arg_init_name			name of the init operation
 * @param {function}	arg_init_cb				resource init callback
 * @return {nothing}
 */
Libapt.init_resource = function(arg_init_name, arg_init_cb)
{
	console.log('Libapt.init_resource [' + arg_init_name + ']');
	
	if ( Libapt.init_resources_by_name[arg_init_name] )
	{
		return;
	}
	
	Libapt.init_resources_by_name[arg_init_name] = arg_init_cb;
	Libapt.init_resources_by_index.push(arg_init_cb);
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.after_resource(arg_init_name, arg_init_cb)
 * @desc				Register a callback to execute after the resources init at the end of the page loading
 * @param {string}		arg_init_name			name of the init operation
 * @param {function}	arg_init_cb				resource init callback
 * @return {nothing}
 */
Libapt.after_resource = function(arg_init_name, arg_init_cb)
{
	console.log('Libapt.after_resource [' + arg_init_name + ']');
	
	Libapt.init_after_resources.push(arg_init_cb);
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.init()
 * @desc				Execute the registered callbacks at the end of the page loading
 * @return {nothing}
 */
Libapt.init = function()
{
	console.info('Libapt: init');
	
	console.info('Libapt: Executing resources init functions');
	for(resource_index in Libapt.init_resources_by_index)
	{
		var init_cb = Libapt.init_resources_by_index[resource_index];
		init_cb();
	}
	
	console.info('Libapt: Executing last init functions');
	for(after_index in Libapt.init_after_resources)
	{
		var init_cb = Libapt.init_after_resources[after_index];
		init_cb();
	}
}



// --------------------------------------------- UTILS ---------------------------------------------

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_main_icon_url(arg_icon_relative_path_name)
 * @desc				Get the standard icon url
 * @param {string}		arg_icon_relative_path_name		relative path name of the icon
 * @return {string}		icon url
 */
Libapt.get_main_icon_url = function(arg_icon_relative_path_name)
{
	return APT_IMAGES_URL + arg_icon_relative_path_name;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.go_to_view(arg_view, arg_options)
 * @desc				Go to the given view page
 * @param {string}		arg_view			view name
 * @param {object}		arg_options			view options
 * @return {nothing}
 */
Libapt.go_to_view = function(arg_view, arg_options)
{
	// GET VIEW OBJECT
	var view_obj = arg_view;
	if ( Libapt.is_string(arg_view) )
	{
		view_obj = LibaptViews.get(arg_view);
	}
	
	// CHECK VIEW OBJECT
	if (! view_obj.is_view)
	{
		Libapt.error( {context:'Libapt.go_to_view', step:'check view', text:'View object is not a LibaptView subclass'} );
		return;
	}
	
	// GET URL BASE
	var url = 'index.php?viewAction=displayHtmlPage' + view_obj.name;
	
	// GET URL QUERY OPTIONS
	if (arg_options instanceof LibaptQuery)
	{
		url += '&' + arg_options.get_url_string();
	}
	else
	// GET URL STRING OPTIONS
	if ( Libapt.is_string(arg_options) )
	{
		url += '&' + arg_options;
	}
	
	// GOTO URL
	window.location.assign(url);
}


/**
 * @public
 * @static
 * @method				jQuery.serializeJSON()
 * @desc				Register the json serialization of jQuery if needed
 * @return {string}		a json string
 */
if (typeof $.fn.serializeJSON == 'undefined')
{
	$.fn.serializeJSON=function()
	{
		var json = {};
		jQuery.map(
			$(this).serializeArray(),
			function(n, i)
			{
				json[n['name']] = n['value'];
			}
		);
		return json;
	};
}

/**
 * @public
 * @method				Object.keys()
 * @desc				Register the keys method if needed
 * @return {array}		array of object attributes names
 */
if (typeof Object.keys=="undefined")
{
	Object.keys = function(obj)
		{
			var props=[];
			for (var p in obj)
			{
				if (obj.propertyIsEnumerable(p))
				{
					props.push(p);
				}
			}
			return props;
		};
}



console.info('Libapt: Loading dependencies');
Libapt.load_script(APT_LIB_URL + '/js/modules.js');
