/**
 * @file        libapt-introspect-traces.js
 * @desc        Libapt static common features: Libapt static traces operations
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



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
	
	var level	= Libapt.is_string(arg_log_obj.level)	? arg_log_obj.level + ' '		: '';
	var context	= Libapt.is_string(arg_log_obj.context)	? arg_log_obj.context + ' : '	: '';
	var step	= Libapt.is_string(arg_log_obj.step)	? arg_log_obj.step + ' '	: '';
	var text	= Libapt.is_string(arg_log_obj.text)	? arg_log_obj.text : '';
	var indent	= Libapt.log_indent_str.rpad(' ', 10);
	
	console.log(level + indent + context + step + text);
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
	Libapt.log( { level:'DEBUG', step:'',   context:'',      text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' } );
	Libapt.log( { level:'ERROR', step:step, context:context, text: arg_error_obj.text, datas: arg_error_obj } );
	Libapt.log( { level:'DEBUG', step:'',   context:'',      text:'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' } );
	
	// THROW AN EXCEPTION
	var error_str = 'ERROR:' + arg_error_obj;
	throw(error_str);
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.trace_enter(arg_context, arg_msg, arg_trace_enabled)
 * @desc				Trace: enter code block
 * @param {string}		arg_context			trace context
 * @param {string}		arg_msg				trace message
 * @param {boolean}		arg_trace_enabled	trace is enabled flag
 * @return				nothing
 */
Libapt.trace_enter = function(arg_context, arg_msg, arg_trace_enabled)
{
	var trace_enabled = arg_trace_enabled;
	var msg = arg_msg;
	if ( Libapt.is_boolean(arg_msg) && ! Libapt.is_boolean(arg_trace_enabled) )
	{
		trace_enabled = arg_msg;
		msg = '';
	}
	
	if (trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'ENTER', context:arg_context, text:arg_msg } );
	}
	Libapt.log_indent();
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.trace_separator(arg_trace_enabled)
 * @desc				Trace a separator line
 * @param {boolean}		arg_trace_enabled	trace is enabled flag
 * @return				nothing
 */
Libapt.trace_separator = function(arg_trace_enabled)
{
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:null, context:null, text:'*****************************************************************' } );
	}
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.trace_step(arg_context, arg_msg, arg_trace_enabled)
 * @desc				Trace a step into a code block
 * @param {string}		arg_context			trace context
 * @param {string}		arg_step			trace message
 * @param {boolean}		arg_trace_enabled	trace is enabled flag
 * @return				nothing
 */
Libapt.trace_step = function(arg_context, arg_step, arg_trace_enabled)
{
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'', context:arg_context, text:arg_step } );
	}
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.trace_leave(arg_context, arg_msg, arg_trace_enabled)
 * @desc				Trace: leave code block
 * @param {string}		arg_context			trace context
 * @param {string}		arg_msg				trace message
 * @param {boolean}		arg_trace_enabled	trace is enabled flag
 * @return				nothing
 */
Libapt.trace_leave = function(arg_context, arg_msg, arg_trace_enabled)
{
	Libapt.log_unindent();
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'LEAVE', context:arg_context, text:arg_msg } );
	}
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.trace_error(arg_context, arg_msg, arg_trace_enabled)
 * @desc				Trace: error
 * @param {string}		arg_context			trace context
 * @param {string}		arg_msg				trace message
 * @param {boolean}		arg_trace_enabled	trace is enabled flag
 * @return				nothing
 */
Libapt.trace_error = function(arg_context, arg_msg, arg_trace_enabled)
{
	Libapt.error( { context:arg_context, text:arg_msg } );
	Libapt.log_unindent();
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.trace_var(arg_context, arg_label, arg_value, arg_trace_enabled)
 * @desc				Trace: variable
 * @param {string}		arg_context			trace context
 * @param {string}		arg_label			trace variable label
 * @param {string}		arg_value			trace variable value
 * @param {boolean}		arg_trace_enabled	trace is enabled flag
 * @return				nothing
 */
Libapt.trace_var = function(arg_context, arg_label, arg_value, arg_trace_enabled)
{
	if (arg_trace_enabled)
	{
		// console.log('Libapt.trace_var:'+arg_trace_enabled);
		Libapt.log( { level:'DEBUG', step:null, context:arg_context, text:arg_label + '=[' + Libapt.get_value_str(arg_value) + ']' } );
	}
}

