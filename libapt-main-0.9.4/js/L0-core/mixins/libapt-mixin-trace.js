/**
 * @file        libapt-mixin-trace.js
 * @desc        Base class for traces features
 * @see			LibaptObject
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin			LibaptMixinTrace
 * @public
 * @desc			Base class for traces features
 */
var LibaptMixinTrace =
{
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @desc				Enable or disable trace
	 */
	trace: false,
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @desc				Trace stack
	 */
	trace_stack: new Array(),
	
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				push_trace(arg_saved_trace, arg_target_trace)
	 * @desc				Save and switch the trace flag
	 * @param {boolean}		arg_saved_trace			the current trace flag to save on the stack
	 * @param {boolean}		arg_target_trace		the new trace flag
	 * @return {nothing}
	 */
	push_trace: function(arg_saved_trace, arg_target_trace)
	{
		this.trace_stack.push(arg_saved_trace);
		this.trace = arg_target_trace;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				pop_trace()
	 * @desc				Restore and switch the trace flag
	 * @return {nothing}
	 */
	pop_trace: function()
	{
		this.trace = this.trace_stack.pop();
	},
	
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				enter(arg_context, arg_msg)
	 * @desc				Trace the call stack : enter in method
	 * @param {string}		arg_context			method context
	 * @param {string}		arg_msg				information message
	 * @return {nothing}
	 */
	enter: function(arg_context, arg_msg)
	{
		if (this.trace)
		{
			Libapt.log( { level:'DEBUG', step:'ENTER', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
			Libapt.log_indent();
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				step(arg_context, arg_msg)
	 * @desc				Trace the call stack : step of a method
	 * @param {string}		arg_context			method context
	 * @param {string}		arg_msg				information message
	 * @return {nothing}
	 */
	step: function(arg_context, arg_msg)
	{
		if (this.trace)
		{
			Libapt.log( { level:'DEBUG', step:'STEP', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				leave(arg_context, arg_msg)
	 * @desc				Trace the call stack : leave the method
	 * @param {string}		arg_context			method context
	 * @param {string}		arg_msg				information message
	 * @return {nothing}
	 */
	leave: function(arg_context, arg_msg)
	{
		if (this.trace)
		{
			Libapt.log_unindent();
			Libapt.log( { level:'DEBUG', step:'LEAVE', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_msg } );
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				leave_or_error(arg_context, arg_ok_msg, arg_ko_msg, arg_bool_result)
	 * @desc				Trace the call stack :  method output (success or error check)
	 * @param {string}		arg_context			method context
	 * @param {string}		arg_ok_msg			success information message
	 * @param {string}		arg_ko_msg			error information message
	 * @param {boolean}		arg_bool_result		value to test
	 * @return {nothing}
	 */
	leave_or_error: function(arg_context, arg_ok_msg, arg_ko_msg, arg_bool_result)
	{
		if (arg_bool_result)
		{
			if (this.trace)
			{
				Libapt.log_unindent();
				Libapt.log( { level:'DEBUG', step:'LEAVE', context:this.class_name + '.' + arg_context + '[' + this.name + ']', text:arg_ok_msg } );
			}
		}
		else
		{
			Libapt.log_unindent();
			trace_error(this.class_name + '.' + arg_context + '[' + this.name + ']', arg_ko_msg, this.trace);
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				error(arg_context, arg_msg)
	 * @desc				Trace the call stack : trace error
	 * @param {string}		arg_context			method context
	 * @param {string}		arg_msg				information message
	 * @return {nothing}
	 */
	error: function(arg_context, arg_msg)
	{
		if (this.trace)
		{
			trace_error(this.class_name + '.' + arg_context + '[' + this.name + ']', arg_msg, this.trace);
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				value(arg_context, arg_name, arg_value)
	 * @desc				Trace the call stack : trace value
	 * @param {string}		arg_context			method context
	 * @param {string}		arg_name			value name
	 * @param {string}		arg_value			value
	 * @return {nothing}
	 */
	value: function(arg_context, arg_name, arg_value)
	{
		if (this.trace)
		{
			trace_var(this.class_name + '.' + arg_context + '[' + this.name + ']', arg_name, Libapt.get_value_str(arg_value), this.trace);
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				separator()
	 * @desc				Trace a line separator
	 * @return {nothing}
	 */
	separator: function()
	{
		if (this.trace)
		{
			Libapt.log( { level:'DEBUG', step:'', context:'', text:'*****************************************************************' } );
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				to_string_value(arg_name, arg_value_str)
	 * @desc				To string : Trace a value string
	 * @param {string}		arg_name			value name
	 * @param {string}		arg_value_str		value
	 * @return {nothing}
	 */
	to_string_value: function(arg_name, arg_value_str)
	{
		return arg_name + '=[' + arg_value_str + '],';
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				separator()
	 * @desc				Trace a line separator
	 * @return {nothing}
	 */
	to_string: function()
	{
		return this.class_name + '{'
			+ this.to_string_value('class', this.class_name)
			+ this.to_string_value('name',  this.name)
			+ this.to_string_value('trace', this.trace)
			+ this.to_string_value('trace_assert', this.trace_assert)
			+ this.to_string_self() + '}';
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				to_string_self()
	 * @desc				To string : Trace the child class specific content
	 * @return {nothing}
	 */
	to_string_self: function()
	{
	},
	
	
	/**
	 * @memberof			LibaptMixinTrace
	 * @public
	 * @method				toString()
	 * @desc				alias for to_string
	 * @return {nothing}
	 */
	toString: function()
	{
		return this.to_string();
	}
};
