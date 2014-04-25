/**
 * @file        libapt-introspect-options.js
 * @desc        Libapt static inheritance features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Options trace enabled flag for register operation
 */
Libapt.options_register_trace = false;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Options trace enabled flag for get operation
 */
Libapt.options_get_trace = false;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Options trace enabled flag for set operation
 */
Libapt.options_set_trace = false;


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Options tree
 */
Libapt.options = {};


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Options types array
 */
Libapt.options_types = ['Boolean','Integer','Float','Date','Time','DateTime','Callback','String','Object','Array','QueryFilter','QueryMode','ViewLink'];


/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Option sample object
 */
Libapt.options_sample =
	{
		name: 'option name',
		type: 'option type',
		aliases: ['name alias 1', 'name alias 2'],
		default_value: '...',
		array_separator: 'items separator: default is coma',
		array_type: 'type of array items',
		format: 'date/time format',
		is_required: true,
		childs: {} // child options if it is an object
	};



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_option(arg_class_proto, arg_option_obj)
 * @desc				Register a class option
 * @param {object}		arg_class_proto			class
 * @param {object}		arg_option_obj			option object
 * @return {nothing}
 */
Libapt.register_option = function(arg_class_proto, arg_option_obj)
{
	var context = 'Libapt.register_option(class,option object)';
	Libapt.trace_enter(context, '', Libapt.options_register_trace);
	
	Libapt.trace_var(context, 'arg_option_obj', arg_option_obj, Libapt.options_register_trace);
	
	// CHECK ARGS
	if ( Libapt.is_null(arg_class_proto) || ! Libapt.is_object(arg_option_obj) )
	{
		Libapt.trace_leave(context, 'bad class or bad option object', Libapt.options_register_trace);
		return;
	}
	
	// GET CLASS NAME
	var class_name = Libapt.get_class_name(arg_class_proto);
	if ( Libapt.is_null(class_name) )
	{
		Libapt.trace_leave(context, 'bad class name', Libapt.options_register_trace);
		return;
	}
	
	// GET CLASS OPTIONS ARRAY
	var class_options = Libapt.options[class_name];
	if ( ! Libapt.is_object(class_options) )
	{
		Libapt.options[class_name] = {};
		class_options = Libapt.options[class_name];
	}
	
	// REGISTER OPTION
	arg_option_obj['class_name'] = class_name;
	class_options[arg_option_obj.name] = arg_option_obj;
	
	Libapt.trace_leave(context, 'success', Libapt.options_register_trace);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_simple_option(arg_class_proto, arg_option_name, arg_option_type, arg_option_default, arg_option_is_required)
 * @desc				Register a simple option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {string}		arg_option_type			option type
 * @param {anything}	arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_simple_option = function(arg_class_proto, arg_option_name, arg_option_type, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	var option =
		{
			name: arg_option_name,
			type: arg_option_type,
			aliases: arg_option_aliases ? arg_option_aliases : [],
			default_value: arg_option_default,
			array_separator: null,
			array_type: null,
			format: null,
			is_required: arg_option_is_required,
			childs: {}
		};
	Libapt.register_option(arg_class_proto, option);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_str_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple string option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {string}		arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_str_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'String', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_obj_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple object option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {object}		arg_option_default		option default value (object template)
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @param {object}		arg_object_attributes	option attributes definition
 * @return {nothing}
 */
Libapt.register_obj_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases, arg_object_attributes)
{
	if ( ! Libapt.is_object(arg_object_attributes) )
	{
		arg_object_attributes = null;
	}
	
	var option =
	{
		name: arg_option_name,
		type: 'Object',
		aliases: arg_option_aliases ? arg_option_aliases : [],
		default_value: arg_option_default,
		array_separator: null,
		array_type: null,
		format: null,
		is_required: arg_option_is_required,
		childs: arg_object_attributes
	};
	
	Libapt.register_option(arg_class_proto, option);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method					Libapt.register_cb_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc					Register a simple object option
 * @param {object}			arg_class_proto			class
 * @param {string}			arg_option_name			option name
 * @param {array|function}	arg_option_default		option default value
 * @param {boolean}			arg_option_is_required	option is required flag
 * @param {array|null}		arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_cb_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'Callback', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_bool_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple boolean option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {boolean}		arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_bool_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'Boolean', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_int_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple integer option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {integer}		arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_int_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'Integer', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_float_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple float option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {float}		arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_float_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'Float', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_date_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple date option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {date}		arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_date_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'Date', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_time_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple time option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {time}		arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_time_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'Time', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register_datetime_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
 * @desc				Register a simple datetime option
 * @param {object}		arg_class_proto			class
 * @param {string}		arg_option_name			option name
 * @param {datetime}	arg_option_default		option default value
 * @param {boolean}		arg_option_is_required	option is required flag
 * @param {array|null}	arg_option_aliases		option name aliases
 * @return {nothing}
 */
Libapt.register_datetime_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
{
	Libapt.register_simple_option(arg_class_proto, arg_option_name, 'DateTime', arg_option_default, arg_option_is_required, arg_option_aliases);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.has_option(arg_class_obj, arg_option_name)
 * @desc				Test a class option
 * @param {object}		arg_class_obj			class
 * @param {object}		arg_option_name			option name
 * @return {boolean}
 */
Libapt.has_option = function(arg_class_obj, arg_option_name)
{
	var context = 'Libapt.has_option(class,option name)';
	Libapt.trace_enter(context, '', Libapt.options_get_trace);
	
	Libapt.trace_var(context, 'arg_option_name', arg_option_name, Libapt.options_get_trace);
	
	// CHECK ARGS
	if ( ! Libapt.is_object(arg_class_obj) || ! Libapt.is_string(arg_option_name) )
	{
		Libapt.trace_leave(context, 'bad class or bad option name', Libapt.options_get_trace);
		return false;
	}
	
	// GET CLASS NAME
	var class_name = Libapt.get_class_name(arg_class_obj);
	if ( Libapt.is_null(class_name) )
	{
		Libapt.trace_leave(context, 'bad class name', Libapt.options_get_trace);
		return false;
	}
	
	// CHECK CLASS OPTIONS
	var class_options = Libapt.options[class_name];
	if ( ! Libapt.is_object(class_options) )
	{
		Libapt.trace_leave(context, 'bad class options', Libapt.options_get_trace);
		return false;
	}
	
	// CHECK OPTION
	if ( ! Libapt.is_object( class_options[arg_option_name] ) )
	{
		Libapt.trace_leave(context, 'not found', Libapt.options_get_trace);
		return false;
	}
	
	Libapt.trace_leave(context, 'found', Libapt.options_get_trace);
	return true;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_option(arg_class_obj, arg_option_name)
 * @desc				Get an option
 * @param {object}		arg_class_obj			class instance
 * @param {object}		arg_option_name			option name
 * @param {boolean}		arg_is_inherited		should search option in inheritance tree
 * @param {array}		arg_class_names_stack	inheritance tree position
 * @return {boolean}
 */
Libapt.get_option = function(arg_class_obj, arg_option_name, arg_is_inherited, arg_class_names_stack)
{
	var context = 'Libapt.get_option(obj,option,inherited,class stack)';
	Libapt.trace_enter(context, '', Libapt.options_get_trace);
	
	Libapt.trace_var(context, 'arg_class_names_stack', arg_class_names_stack ? arg_class_names_stack : 'empty', Libapt.options_get_trace);
	
	// CHECK ARGS
	if ( ! (Libapt.is_object(arg_class_obj) || Libapt.is_string(arg_class_obj)) || ! Libapt.is_string(arg_option_name) )
	{
		Libapt.trace_leave(context, 'bad class instance', Libapt.options_get_trace);
		return false;
	}
	
	// GET CLASS NAME
	var class_name = Libapt.get_class_name(arg_class_obj);
	Libapt.trace_var(context, 'class_name', class_name, Libapt.options_get_trace);
	if ( Libapt.is_null(class_name) )
	{
		Libapt.trace_leave(context, 'bad class name', Libapt.options_get_trace);
		return false;
	}
	
	// CHECK CLASS OPTIONS
	var class_options = Libapt.options[class_name];
	if ( Libapt.is_object(class_options) )
	{
		// GET OPTION
		var option_obj = class_options[arg_option_name];
		if ( ! Libapt.is_null(option_obj) )
		{
			Libapt.trace_leave(context, 'found', Libapt.options_get_trace);
			return option_obj;
		}
		
		// SEARCH OPTION NAME IN OPTIONS ALIAS
		for(option_key in class_options)
		{
			option_obj = class_options[option_key];
			if ( option_obj.aliases.indexOf(arg_option_name) >= 0 )
			{
				Libapt.trace_leave(context, 'found with alias', Libapt.options_get_trace);
				return option_obj;
			}
		}
	}
	
	// SEARCH OPTION NAME IN INHERITED CLASSES
	if (arg_is_inherited)
	{
		var inherited_classes = Libapt.get_inherited_classes(arg_class_obj);
		if ( Libapt.is_null(arg_class_names_stack) )
		{
			arg_class_names_stack = [];
		}
		for(class_index in inherited_classes)
		{
			class_name = inherited_classes[class_index];
			Libapt.trace_step(context, 'search in inherited class:[' + class_name + ']', Libapt.options_get_trace);
			if (arg_class_names_stack.indexOf(class_name) < 0)
			{
				arg_class_names_stack.push(class_name);
				option_obj = Libapt.get_option(class_name, arg_option_name, arg_is_inherited, arg_class_names_stack);
				if ( ! Libapt.is_null(option_obj) )
				{
					Libapt.trace_leave(context, 'found with inheritance', Libapt.options_get_trace);
					return option_obj;
				}
			}
		}
	}
	
	// ALWAYS TRACE THIS PROBLEM
	// class_name = Libapt.get_class_name(arg_class_obj);
	// Libapt.trace_separator(true);
	// Libapt.trace_step(context, '!!! option [' + arg_option_name + '] not found for [' + class_name + ']', Libapt.options_get_trace);
	// Libapt.trace_var(context, 'arg_class_obj', arg_class_obj, Libapt.options_get_trace);
	Libapt.trace_var(context, 'class_name', class_name, Libapt.options_get_trace);
	Libapt.trace_var(context, 'arg_option_name', arg_option_name, Libapt.options_get_trace);
	// Libapt.trace_separator(true);
	
	Libapt.trace_leave(context, 'not found', Libapt.options_get_trace);
	return null;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_option_value(arg_class_proto, arg_option_name)
 * @desc				Get an object option value
 * @param {object}		arg_class_instance		class instance
 * @param {string}		arg_option_name			option object
 * @param {boolean}		arg_is_inherited		should search option in inheritance tree
 * @return {anything}	Object value or option default value
 */
Libapt.get_option_value = function(arg_class_instance, arg_option_name, arg_is_inherited)
{
	var context = 'Libapt.get_option_value(obj,option name)';
	Libapt.trace_enter(context, '', Libapt.options_get_trace);
	
	// CHECK ARGS
	if ( ! Libapt.is_object(arg_class_instance) )
	{
		// console.log(arg_class_instance)
		Libapt.trace_leave(context, 'class instance is not an object', Libapt.options_get_trace);
		return false;
	}
	if ( ! Libapt.is_string(arg_option_name) )
	{
		// console.log(arg_option_name);
		Libapt.trace_leave(context, 'bad option name', Libapt.options_get_trace);
		return false;
	}
	
	// GET OPTION
	var option = Libapt.get_option(arg_class_instance, arg_option_name, arg_is_inherited, []);
	if ( ! Libapt.is_object(option) )
	{
		Libapt.trace_leave(context, 'bad option', Libapt.options_get_trace);
		return false;
	}
	
	// GET OBJECT ATTRIBUTE
	var object_value = arg_class_instance[arg_option_name];
	if ( Libapt.is_null(object_value) )
	{
		Libapt.trace_leave(context, 'default option', Libapt.options_get_trace);
		return option.defaut_value;
	}
	
	Libapt.trace_leave(context, 'found', Libapt.options_get_trace);
	return object_value;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.set_option_value(arg_class_proto, arg_option_name, arg_option_value)
 * @desc				Set an option value
 * @param {object}		arg_class_instance		class instance
 * @param {string}		arg_option_name			option object
 * @param {boolean}		arg_force_replace		replace an existing not null value ?
 * @param {string}		arg_option_value		option value
 * @param {boolean}		arg_is_inherited		should search option in inheritance tree
 * @param {boolean}		arg_force_replace		should replace an existing option value
 * @param {object}		arg_option_object		option definition object (optional)
 * @return {boolean}	true:success,false:failure
 */
Libapt.set_option_value = function(arg_class_instance, arg_option_name, arg_option_value, arg_is_inherited, arg_force_replace, arg_option_object)
{
	var trace_step = false;
	var context = 'Libapt.set_option_value(obj,name,value,inher,replace,obj)[' + arg_class_instance['name'] + ']';
	Libapt.trace_enter(context, '', Libapt.options_set_trace);
	
	Libapt.trace_var(context, 'arg_option_name', arg_option_name, Libapt.options_set_trace);
	Libapt.trace_var(context, 'arg_option_value', arg_option_value, Libapt.options_set_trace);
	
	Libapt.trace_step(context, arg_option_name, trace_step);
	
	
	// CHECK ARGS
	if ( ! Libapt.is_object(arg_class_instance) || ! Libapt.is_string(arg_option_name) )
	{
		Libapt.trace_leave(context, 'bad class instance', Libapt.options_set_trace);
		return false;
	}
	
	
	// GET OPTION
	var option = arg_option_object;
	if ( ! Libapt.is_object(option) )
	{
		option = Libapt.get_option(arg_class_instance, arg_option_name, arg_is_inherited, []);
		if ( ! Libapt.is_object(option) )
		{
			// console.log(arg_class_instance);
			Libapt.trace_leave(context, 'no option [' + arg_option_name + '] for this instance [' + arg_class_instance.class_name + ']', Libapt.options_set_trace);
			return false;
		}
	}
	Libapt.trace_var(context, 'class_name', option.class_name, Libapt.options_set_trace);
	
	
	// GET REAL OPTION NAME AND NOT AN ALIAS
	var option_name = option.name;
	
	
	// GET TARGET OBJECT
	var target_object = arg_class_instance;
	var objects = option_name.split('.');
	if (objects.length == 2)
	{
		target_name = objects[0];
		option_name = objects[1];
		
		Libapt.trace_step(context, 'loop on option name tree[' + target_name + ']:' + option_name, trace_step);
		
		target_object = arg_class_instance[target_name];
		if (target_object === undefined)
		{
			target_object = {};
			arg_class_instance[target_name] = target_object;
		}
	}
	else if (objects.length > 2)
	{
		var stack_objects = [];
		var stack_names = [];
		
		Libapt.trace_step(context, 'loop on option name tree[' + option_name + ']', trace_step);
		for(var object_index = 1 ; object_index < objects.length - 1 ; object_index++)
		{
			var loop_name = objects[object_index];
			Libapt.trace_var(context, 'loop_name', loop_name, Libapt.options_set_trace);
			Libapt.trace_step(context, 'loop on option name tree[' + option_name + ']:' + loop_name, trace_step);
			
			var object_attr = target_object[loop_name];
			if (object_attr === undefined )
			{
				target_object[loop_name] = {};
				object_attr = target_object[loop_name];
			}
			
			stack_objects.push(object_attr);
			stack_names.push(loop_name);
		}
		
		target_object = stack_objects[objects.length - 2];
		option_name = stack_names[objects.length - 2];
	}
	Libapt.trace_var(context, 'option_name', option_name, Libapt.options_set_trace);
	
	
	// SHOULD REPLACE AN EXISTING NOT NULL VALUE ?
	var option_value = target_object[option_name];
	Libapt.trace_var(context, 'option_value', option_value, trace_step);
	Libapt.trace_var(context, 'arg_option_value', arg_option_value, trace_step);
	var should_replace = arg_force_replace || Libapt.is_null(option_value);
	if ( ! should_replace )
	{
		Libapt.trace_leave(context, 'do not replace an existing not null value', Libapt.options_set_trace);
		return true;
	}
	
	// GET OBJECT ATTRIBUTE
	if ( Libapt.is_null(arg_option_value) )
	{
		target_object[option_name] = option.defaut_value;
		Libapt.trace_leave(context, 'set default value', Libapt.options_set_trace);
		return true;
	}
	
	// CHECK VALUE TYPE
	var option_type = option.type.toLocaleLowerCase();
	Libapt.trace_step(context, 'switch on option type[' + option_type + ']', trace_step);
	switch(option_type)
	{
		case 'boolean':		target_object[option_name] = Libapt.to_boolean(arg_option_value, option.defaut_value);
							Libapt.trace_leave(context, 'success for Boolean', Libapt.options_set_trace);
							return true;
							
		case 'integer':		target_object[option_name] = Libapt.to_integer(arg_option_value, option.defaut_value);
							Libapt.trace_leave(context, 'success for Integer', Libapt.options_set_trace);
							return true;
							
		case 'float':		target_object[option_name] = Libapt.to_float(arg_option_value, option.defaut_value);
							Libapt.trace_leave(context, 'success for Float', Libapt.options_set_trace);
							return true;
							
		case 'date':		target_object[option_name] = Libapt.to_date(arg_option_value, option.defaut_value);
							Libapt.trace_leave(context, 'success for Date', Libapt.options_set_trace);
							return true;
							
		case 'time':		target_object[option_name] = Libapt.to_time(arg_option_value);
							Libapt.trace_leave(context, 'success for Time', Libapt.options_set_trace);
							return true;
							
		case 'datetime':	target_object[option_name] = Libapt.to_datetime(arg_option_value);
							Libapt.trace_leave(context, 'success for DateTime', Libapt.options_set_trace);
							return true;
							
		case 'callback':	target_object[option_name] = Libapt.to_callback(arg_option_value);
							Libapt.trace_leave(context, 'success for Callback', Libapt.options_set_trace);
							return true;
							
		case 'string':		target_object[option_name] = Libapt.to_string(arg_option_value);
							Libapt.trace_leave(context, 'success for String', Libapt.options_set_trace);
							return true;
							
		case 'object':		Libapt.trace_step(context, 'type is object for [' + option_name + ']', trace_step);
							if ( ! Libapt.is_object(option.childs) )
							{
								Libapt.trace_step(context, 'option has no childs: get values object', trace_step);
								var values = Libapt.to_object(arg_option_value, option.defaut_value, ',', '=');
								
								if ( target_object[option_name] === undefined )
								{
									target_object[option_name] = {};
								}
								
								Libapt.trace_step(context, 'Loop on object values', trace_step);
								for(value_key in values)
								{
									var loop_value	= values[value_key];
									var loop_option = null;
									Libapt.trace_var(context, 'loop value_key', value_key, trace_step);
									var loop_result = Libapt.set_option_value(arg_class_instance, option_name + '.' + value_key, loop_value, arg_is_inherited, arg_force_replace, loop_option);
									if (!loop_result)
									{
										Libapt.trace_leave(context, 'failure for Object option [' + option_name + '.' + value_key + ']', Libapt.options_set_trace);
										return false;
									}
								}
							}
							else
							{
								Libapt.trace_step(context, 'option has childs: to_object', trace_step);
								
								// GET ATTRIBUTES VALUES
								var attributes_values = {};
								if ( Libapt.is_string(arg_option_value) )
								{
									Libapt.trace_step(context, 'get attributes values from string', trace_step);
									arg_attributes_separator	= ',';
									arg_name_value_separator	= '=';
									
									var attributes = arg_option_value.split(arg_attributes_separator);
									if ( Libapt.is_array(attributes) )
									{
										for(var attr_index = 0 ; attr_index < attributes.length ; attr_index++)
										{
											var attribute = attributes[attr_index].split(arg_name_value_separator);
											
											if ( Libapt.is_array(attribute) && attribute.length == 2 )
											{
												var attr_key	= attribute[0];
												var attr_value	= attribute[1];
												attributes_values[attr_key]	= attr_value;
												
												Libapt.trace_step(context, arg_option_name + '.' + attr_key + '=' + attr_value, trace_step);
											}
										}
									}
								}
								
								// LOOP ON CHILD OPTIONS
								Libapt.trace_step(context, 'loop on childs', trace_step);
								target_object[option_name] = {};
								for(child_key in option.childs)
								{
									var loop_option = option.childs[child_key];
									Libapt.trace_var(context, 'loop_option.name', loop_option.name, Libapt.options_set_trace);
									
									var loop_value	= attributes_values[child_key];
									Libapt.trace_var(context, 'loop_value', loop_value, Libapt.options_set_trace);
									
									Libapt.trace_step(context, arg_option_name + '.childs[' + child_key + ']=' + loop_value, trace_step);
									
									var loop_result = Libapt.set_option_value(target_object, child_key, loop_value, arg_is_inherited, arg_force_replace, loop_option);
									if (!loop_result)
									{
										Libapt.trace_leave(context, 'failure for Object option [' + child_key + ']', Libapt.options_set_trace);
										return false;
									}
								}
							}
							
							Libapt.trace_leave(context, 'success for Object', Libapt.options_set_trace);
							return true;
							
		case 'array':		
							target_object[option_name] = Libapt.to_array(arg_option_value, option.default_value, option.array_separator, option.array_type);
							Libapt.trace_leave(context, 'success for Array', Libapt.options_set_trace);
							return true;
	}
	
	Libapt.trace_leave(context, 'bad option type[' + option.type + ']', Libapt.options_set_trace);
	return false;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.set_options_values(arg_class_proto, arg_option_name, arg_option_value)
 * @desc				Set options values
 * @param {object}		arg_class_instance		class instance
 * @param {string}		arg_option_name			option object
 * @param {string}		arg_option_value		option value
 * @param {boolean}		arg_is_inherited		should search option in inheritance tree
 * @param {boolean}		arg_force_replace		replace an existing not null value ?
 * @return {boolean}	true:success,false:failure
 */
Libapt.set_options_values = function(arg_class_instance, arg_options_obj, arg_is_inherited, arg_force_replace)
{
	var trace_step = false;
	var context = 'Libapt.set_options_values(obj,opt)';
	Libapt.trace_enter(context, '', Libapt.options_set_trace);
	
	// CHECK ARGS
	if ( ! Libapt.is_object(arg_class_instance) )
	{
		Libapt.trace_leave(context, 'class instance is not an object', Libapt.options_set_trace);
		return false;
	}
	if ( Libapt.is_null(arg_options_obj) )
	{
		Libapt.trace_leave(context, 'no options', Libapt.options_set_trace);
		return true;
	}
	if ( ! Libapt.is_object(arg_options_obj) )
	{
		Libapt.trace_leave(context, 'options is not null and not an object', Libapt.options_set_trace);
		return false;
	}
	if ( Libapt.is_null(arg_is_inherited) )
	{
		arg_is_inherited = false;
	}
	if ( Libapt.is_null(arg_force_replace) )
	{
		arg_force_replace = false;
	}
	
	// SET DEFAULT OPTIONS VALUES
	var class_name		= arg_class_instance.class_name;
	var class_options	= Libapt.options[class_name];
	var filled_options	= {};
	Libapt.trace_var(context, 'class_name', class_name, Libapt.options_set_trace);
	if ( Libapt.is_object(class_options) )
	{
		Libapt.trace_step(context, 'set options default values:', trace_step);
		Libapt.trace_separator(trace_step);
		
		// LOOP ON SELF CLASS OPTIONS
		for(option_key in class_options)
		{
			var option_obj		= class_options[option_key];
			var option_name		= option_obj.name;
			var option_alias	= null;
			
			// GET POTENTIAL GIVEN VALUE FOR OPTION NAME AND ALIAS
			var given_value		= arg_options_obj[option_obj.name];
			if (given_value === undefined && Libapt.is_array(option_obj.aliases) )
			{
				for(var alias_index = 0 ; alias_index < option_obj.aliases.length ; alias_index++)
				{
					option_alias	= option_obj.aliases[alias_index];
					given_value		= arg_options_obj[option_alias];
					if (given_value !== undefined)
					{
						alias_index = option_obj.aliases.length;
					}
				}
			}
			
			// GET OPTION VALUE
			var default_value	= option_obj.default_value;
			var option_value	= given_value === undefined ? default_value : given_value;
			
			// SET OPTION VALUE
			if ( ! Libapt.set_option_value(arg_class_instance, option_name, option_value, false, false, option_obj) )
			{
				var saved = Libapt.options_set_trace;
				Libapt.options_set_trace = true;
				Libapt.trace_error(context, 'failed to set default value for option [' + option_name + ']', Libapt.options_set_trace);
				Libapt.options_set_trace = saved;
				Libapt.trace_separator(trace_step);
				return false;
			}
			
			filled_options[option_name] = option_obj;
			if (option_alias)
			{
				filled_options[option_alias] = option_obj;
			}
		}
		Libapt.trace_separator(trace_step);
	}
	
	// SET GIVEN OPTIONS VALUES
	Libapt.trace_step(context, 'set options given values:', trace_step);
	Libapt.trace_separator(trace_step);
	for(option_key in arg_options_obj)
	{
		Libapt.trace_var(context, 'loop on given key', option_key, Libapt.options_set_trace);
		
		if ( ! Libapt.is_string(option_key) || Libapt.is_object(filled_options[option_key]) )
		{
			if ( filled_options[option_key].type != 'Object' )
			{
				Libapt.trace_step(context, 'option name [' + option_key + '] is not a string or option was already set [' + filled_options[option_key].name + ']', Libapt.options_set_trace);
				continue;
			}
		}
		
		var class_has_option = Libapt.has_option(arg_class_instance, option_key);
		if ( ! class_has_option && ! arg_is_inherited)
		{
			Libapt.trace_step(context, 'class has not option and option should not be set on inherited classes', Libapt.options_set_trace);
			continue;
		}
		
		Libapt.trace_step(context, 'Option is processed', Libapt.options_set_trace);
		var given_value		= arg_options_obj[option_key];
		
		Libapt.trace_var(context, 'given_value', given_value, Libapt.options_set_trace);
		var result = Libapt.set_option_value(arg_class_instance, option_key, given_value, arg_is_inherited, arg_force_replace, filled_options[option_key]);
		
		// TODO: IGNORE RESULT OR NOT
		if (! result)
		{
			var saved = Libapt.options_set_trace;
			Libapt.options_set_trace = true;
			Libapt.trace_step(context, 'set option value failure', Libapt.options_set_trace);
			Libapt.options_set_trace = saved;
			Libapt.trace_error(context, 'failed to set given value for option [' + option_name + ']', Libapt.options_set_trace);
			Libapt.trace_separator(trace_step);
			return false;
		}
	}
	Libapt.trace_separator(trace_step);
	
	
	Libapt.trace_leave(context, 'success', Libapt.options_set_trace);
	return true;
}
