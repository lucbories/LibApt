/**
 * @file        libapt-introspect-inheritance.js
 * @desc        Libapt static inheritance features
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
 * @param {object|string}	arg_class_proto			Value
 * @return {string}
 */
/*Libapt.get_class_name = function(arg_class_proto)
{
	// CHECK ARGS
	if ( Libapt.is_null(arg_class_proto) )
	{
		return null;
	}
	
	// GET CLASS NAME
	var class_name = null;
	if ( Libapt.is_string(arg_class_proto) )
	{
		class_name = arg_class_proto;
	}
	else
	{
		if ( Libapt.is_string(arg_class_proto.class_name) )
		{
			class_name = arg_class_proto.class_name;
		}
		else
		{
			if ( Libapt.is_string(arg_class_proto.name) )
			{
				class_name = arg_class_proto.name;
			}
			else
			{
				if ( Libapt.is_object(arg_class_proto) )
				{
					class_name = arg_class_proto.prototype.name;
				}
			}
		}
	}
	
	return class_name;
}*/


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
 * @method				Libapt.get_inheritance(arg_class_proto, arg_class_proto_inherited)
 * @desc				Get the inheritances array
 * @return {array}		Array of object {current:class_proto, inherited: class_proto_inherited}
 */
Libapt.get_inheritances = function()
{
	return Libapt.inheritances;
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_inheritance(arg_class_proto, arg_class_proto_inherited)
 * @desc				Get the classes names
 * @return {array}		Array of string
 */
Libapt.get_classes = function()
{
	return Object.keys( Libapt.inheritances );
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_inheritance(arg_class_proto, arg_class_proto_inherited)
 * @desc				Register an inheritance edge
 * @param {object}		arg_class_proto				child class
 * @param {object}		arg_class_proto_inherited	inherited class
 * @return {nothing}
 */
Libapt.register_inheritance = function(arg_class_proto, arg_class_proto_inherited)
{
	Libapt.inheritances[arg_class_proto.name] = {current:arg_class_proto, inherited: arg_class_proto_inherited};
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_inherited_classes(arg_class_proto)
 * @desc				Get all inherited classes
 * @param {object}		arg_class_proto				class prototype
 * @return {nothing}
 */
Libapt.get_inherited_classes = function(arg_class_proto)
{
	var context = 'Libapt.get_inherited_classes(class)';
	Libapt.trace_enter(context, '', Libapt.options_trace);
	
	var inherited_classes = [];
	var class_name = Libapt.get_class_name(arg_class_proto);
	Libapt.trace_var(context, 'class_name', class_name, Libapt.options_trace);
	while( ! Libapt.is_null( Libapt.inheritances[class_name] ) )
	{
		inherited_classes.push( Libapt.inheritances[class_name].inherited.name );
		class_name = Libapt.inheritances[class_name].inherited.name;
		Libapt.trace_var(context, 'class_name', class_name, Libapt.options_trace);
	}
	
	Libapt.trace_leave(context, '', Libapt.options_trace);
	return inherited_classes;
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
			// console.log('test_inheritance: is string : class name == proto');
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

