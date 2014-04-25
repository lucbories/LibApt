/**
 * @file        libapt-introspect-types.js
 * @desc        Libapt static common features: Libapt static types operations
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



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
 * @static
 * @method				Libapt.are_null(arg_values)
 * @desc				Test if an array of value are null or undefined
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_null = function(arg_values)
{
	return arg_values.every( Libapt.is_null );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_not_null(arg_value)
 * @desc				Test if the value is a not null and not undefined
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_not_null = function(arg_value)
{
	return ! Libapt.is_null(arg_value);
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.are_not_null(arg_values)
 * @desc				Test if an array of value are not null and not undefined
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_not_null = function(arg_values)
{
	return arg_values.every( Libapt.is_not_null );
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
	return ! Libapt.is_null(arg_value) && typeof arg_value == 'object';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.are_objectg(arg_values)
 * @desc				Test if an array of value are object
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_object = function(arg_values)
{
	return arg_values.every( Libapt.is_object );
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
 * @method				Libapt.are_string(arg_values)
 * @desc				Test if an array of value are string
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_string = function(arg_values)
{
	return arg_values.every( Libapt.is_string );
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
 * @static
 * @method				Libapt.are_boolean(arg_values)
 * @desc				Test if an array of value are boolean
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_boolean = function(arg_values)
{
	return arg_values.every( Libapt.is_boolean );
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
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_number(arg_value)
 * @desc				Test if the value is a number
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_number = function(arg_value)
{
	return typeof arg_value == 'number' || typeof arg_value == 'Number';
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.are_number(arg_values)
 * @desc				Test if an array of value are number
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_number = function(arg_values)
{
	return arg_values.every( Libapt.is_number );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_integer(arg_value)
 * @desc				Test if the value is a integer
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_integer = function(arg_value)
{
	if ( Libapt.is_number(arg_value) || Libapt.is_string(arg_value) )
	{
		return parseInt(arg_value) != Number.NaN;
	}
	return false;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.are_integer(arg_values)
 * @desc				Test if an array of value are integers
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_integer = function(arg_values)
{
	return arg_values.every( Libapt.is_integer );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_float(arg_value)
 * @desc				Test if the value is a float
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_float = function(arg_value)
{
	if ( Libapt.is_number(arg_value) || Libapt.is_string(arg_value) )
	{
		return parseFloat(arg_value) != Number.NaN;
	}
	return false;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.are_float(arg_values)
 * @desc				Test if an array of value are floats
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_float = function(arg_values)
{
	return arg_values.every( Libapt.is_float );
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
 * @method				Libapt.function(arg_values)
 * @desc				Test if an array of value are function
 * @param {array}		arg_values			values to test
 * @return {boolean}
 */
Libapt.are_function = function(arg_values)
{
	return arg_values.every( Libapt.is_function );
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.is_function(arg_value)
 * @desc				Test if the value is a callback (a function or a object/function array.
 * @param {anything}	arg_value			value to test
 * @return {boolean}
 */
Libapt.is_callback = function(arg_value)
{
	if ( Object.prototype.toString.apply(arg_value) === '[object Array]' )
	{
		if (arg_value.length < 2)
		{
			return false;
		}
		if ( ! Libapt.is_object(arg_value[0]) )
		{
			return false;
		}
		if ( ! Libapt.is_function(arg_value[1]) )
		{
			return false;
		}
		return true;
	}
	return Libapt.is_function(arg_value);
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
 * @param {anything}	arg_stack_count		stack calls count
 * @return {string}
 */
Libapt.get_value_str = function(arg_value, arg_stack_count)
{
	var max_calls = 10;
	
	if (arg_stack_count === undefined)
	{
		arg_stack_count = 0;
	}
	
	if (arg_stack_count > max_calls)
	{
		return 'more than ' + max_calls + ' calls stack';
	}
	
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
				str += '\n  ' + key + '=' + Libapt.get_value_str(member, arg_stack_count + 1);
			}
		}
		return str + (str == '{' ? '' : '\n') + '}';
	}
	
	if ( Libapt.is_array(arg_value) )
	{
		var str = '[';
		for(key in arg_value)
		{
			str += key + '=' + Libapt.get_value_str( arg_value[key], arg_stack_count + 1);
		}
		return str + ']';
	}
	
	return arg_value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_string(arg_value, arg_default_value)
 * @desc				Convert the value to a string
 * @param {anything}	arg_value			value to convert
 * @param {string}		arg_default_value	default value
 * @return {string}
 */
Libapt.to_string = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? false : arg_default_value;
	
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
			return new Boolean(true).valueOf();
		}
		return new Boolean(false).valueOf();
	}
	
	return new Boolean(default_value).valueOf();
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_number(arg_value, arg_default_value)
 * @desc				Convert the value to a number
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

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_integer(arg_value, arg_default_value)
 * @desc				Convert the value to a integer
 * @param {anything}	arg_value			value to convert
 * @param {integer}		arg_default_value	default value
 * @return {integer}
 */
Libapt.to_integer = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? 0 : arg_default_value;
	
	var value = default_value;
	if ( Libapt.is_string(arg_value) || Libapt.is_number(arg_value) )
	{
		value = parseInt(arg_value);
		if (value == Number.NaN)
		{
			value = default_value;
		}
	}
	
	return value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_float(arg_value, arg_default_value)
 * @desc				Convert the value to a float
 * @param {anything}	arg_value			value to convert
 * @param {float}		arg_default_value	default value
 * @return {float}
 */
Libapt.to_float = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? 0.0 : arg_default_value;
	
	var value = default_value;
	if ( Libapt.is_string(arg_value) || Libapt.is_number(arg_value) )
	{
		value = parseFloat(arg_value);
		if (value == Number.NaN)
		{
			value = default_value;
		}
	}
	
	return value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_date(arg_value, arg_default_value)
 * @desc				Convert the value to a date
 * @param {anything}	arg_value			value to convert
 * @param {date}		arg_default_value	default value
 * @return {date}
 */
Libapt.to_date = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? new Date() : arg_default_value;
	
	var value = default_value;
	if ( Libapt.is_string(arg_value) )
	{
		value = new Date( Date.parse(arg_value) );
		
	}
	else if ( Libapt.is_number(arg_value) )
	{
		value = new Date(arg_value);
	}
	if ( Libapt.is_null(value) )
	{
		value = default_value;
	}
	else
	{
		value = value.toLocaleDateString();
	}
	
	return value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_time(arg_value, arg_default_value)
 * @desc				Convert the value to a time
 * @param {anything}	arg_value			value to convert
 * @param {time}		arg_default_value	default value
 * @return {time}
 */
Libapt.to_time = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? new Date() : arg_default_value;
	
	var value = default_value;
	if ( Libapt.is_string(arg_value) )
	{
		value = new Date( Date.parse(arg_value) );
		
	}
	else if ( Libapt.is_number(arg_value) )
	{
		value = new Date(arg_value);
	}
	if ( Libapt.is_null(value) )
	{
		value = default_value;
	}
	else
	{
		value = value.toLocaleTimeString();
	}
	
	return value;
}

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_datetime(arg_value, arg_default_value)
 * @desc				Convert the value to a datetime
 * @param {anything}	arg_value			value to convert
 * @param {datetime}	arg_default_value	default value
 * @return {datetime}
 */
Libapt.to_datetime = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? new Date() : arg_default_value;
	
	var value = default_value;
	if ( Libapt.is_string(arg_value) )
	{
		value = new Date( Date.parse(arg_value) );
		
	}
	else if ( Libapt.is_number(arg_value) )
	{
		value = new Date(arg_value);
	}
	
	if ( Libapt.is_null(value) )
	{
		value = default_value;
	}
	else
	{
		value = value.toLocaleString();
	}
	
	return value;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_string(arg_value, arg_default_value)
 * @desc				Convert the value to a string
 * @param {anything}	arg_value			value to convert
 * @param {string}		arg_default_value	default value
 * @return {string}
 */
Libapt.to_string = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? '' : arg_default_value;
	
	if ( Libapt.is_string(arg_value) )
	{
		return arg_value;
	}
	
	return default_value;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_array(arg_value, arg_default_value)
 * @desc				Convert the value to an array
 * @param {anything}	arg_value				value to convert
 * @param {array}		arg_default_value		default value
 * @param {string}		arg_items_separator		items separator of array string (default=',')
 * @param {string}		arg_items_type			items type (default:string) (unused)
 * @todo check array items types if a valid type is given
 * @return {array}
 */
Libapt.to_array = function(arg_value, arg_default_value, arg_items_separator, arg_items_type)
{
	var default_value = Libapt.is_array(arg_default_value) ? arg_default_value : [];
	
	var value = default_value;
	
	if ( Libapt.is_array(arg_value) )
	{
		value = arg_value;
	}
	else if ( Libapt.is_string(arg_value) )
	{
		arg_items_separator	= Libapt.is_not_empty_str(arg_items_separator) ? arg_items_separator : ',';
		
		value = arg_value.split(arg_items_separator);
		if ( ! Libapt.is_array(value) )
		{
			arg_class_instance[option_name] = arg_default_value;
		}
	}
	else if ( Libapt.is_object(arg_value) )
	{
		value = Object.values(arg_value);
	}
	
	if ( ! Libapt.is_array(value) )
	{
		value = default_value;
	}
	
	return value;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_object(arg_value, arg_default_value)
 * @desc				Convert the value to an object
 * @param {anything}	arg_value					value to convert
 * @param {array}		arg_default_value			object template and default value
 * @param {string}		arg_attributes_separator	attributes separator of object string (default=',')
 * @param {string}		arg_name_value_separator	attributes name/value separator of object string (default='=')
 * @return {array}
 */
Libapt.to_object = function(arg_value, arg_default_value, arg_attributes_separator, arg_name_value_separator)
{
	var default_value = Libapt.is_object(arg_default_value) ? arg_default_value : {};
	
	var value = default_value;
	
	if ( Libapt.is_object(arg_value) )
	{
		value = arg_value;
	}
	else if ( Libapt.is_string(arg_value) )
	{
		arg_attributes_separator	= Libapt.is_not_empty_str(arg_attributes_separator) ? arg_attributes_separator : ',';
		arg_name_value_separator	= Libapt.is_not_empty_str(arg_name_value_separator) ? arg_name_value_separator : '=';
		
		var attributes = arg_value.split(arg_attributes_separator);
		if ( Libapt.is_array(attributes) )
		{
			value = {};
			for(var attr_index = 0 ; attr_index < attributes.length ; attr_index++)
			{
				var attribute = attributes[attr_index].split(arg_name_value_separator);
				if ( Libapt.is_array(attribute) && attribute.length == 2 )
				{
					var attr_key	= attribute[0];
					var attr_value	= attribute[1];
					value[attr_key]	= attr_value;
				}
			}
		}
	}
	
	// CHECK VALUE
	if ( ! Libapt.is_object(value) )
	{
		value = default_value;
	}
	
	// APPEND MISSING ATTRIBUTES
	if ( Libapt.is_object(value) && Libapt.is_object(default_value) && value !== default_value )
	{
		for(loop_key in default_value)
		{
			var loop_default_value = default_value[loop_key];
			var loop_value = value[loop_key];
			if ( Libapt.is_null(loop_value) )
			{
				value[loop_key] = loop_default_value;
			}
		}
	}
	
	return value;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.to_callback(arg_value, arg_default_value)
 * @desc				Convert the value to a callback
 * @param {anything}		arg_value			value to convert
 * @param {function|array}	arg_default_value	default value
 * @return {function|array}
 */
Libapt.to_callback = function(arg_value, arg_default_value)
{
	var default_value = Libapt.is_undefined(arg_default_value) ? null : arg_default_value;
	
	// CALLBACK IS A FUNCTION
	if ( Libapt.is_function(arg_value) )
	{
		return arg_value;
	}
	
	// CALLBACK IS A METHOD CALL
	if ( Libapt.is_array(arg_value) && arg_value.length >= 2 && Libapt.is_object(arg_value[0]) && Libapt.is_function(arg_value[1]) )
	{
		return arg_value;
	}
	
	// CALLBACK IS A FUNCTION CONTENT
	if ( Libapt.is_string(arg_value) )
	{
		var cb = function()
			{
				eval(arg_value);
			};
		return cb;
	}
	
	return default_value;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.lpad(arg_padding_str, arg_padding_length)
 * @desc				Append padding string at the left of the self string if needed
 * @param {string}		arg_padding_str			padding string
 * @param {integer}		arg_padding_length		padding length
 * @return {string}
 */
String.prototype.lpad = function(arg_padding_str, arg_padding_length)
{
	var str = this;
	while (str.length < arg_padding_length)
	{
		str = arg_padding_str + str;
	}
	return str;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.rpad(arg_padding_str, arg_padding_length)
 * @desc				Append padding string at the right of the self string if needed
 * @param {string}		arg_padding_str			padding string
 * @param {integer}		arg_padding_length		padding length
 * @return {string}
 */
String.prototype.rpad = function(arg_padding_str, arg_padding_length)
{
	var str = this;
	while (str.length < arg_padding_length)
	{
		str += arg_padding_str;
	}
	return str;
}
