/**
 * @file        libapt-mixin-callback.js
 * @desc        Mixin of callback methods (static class)
 * @details     
 * @see			LibaptObject
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @mixin				LibaptMixinCallback
 * @public
 * @desc				Mixin of callback methods
 */
var LibaptMixinCallback = 
{
	/**
	 * @memberof			LibaptMixinCallback
	 * @public
	 * @desc				Enable/disable trace for callback operations
	 */
	trace_mixin_callback: false,
	
	
	
	/**
	 * @memberof			LibaptMixinCallback
	 * @public
	 * @method				do_callback(arg_callback, arg_operands_array)
	 * @desc				Run a callback function or method
	 * @param {array}		arg_callback			callback (function or method array)
	 * @param {array}		arg_operands_array		operands (array)
	 * @return {boolean}	true:success,false:failure
	 */
	do_callback: function(arg_callback, arg_operands_array)
	{
		this.push_trace(this.trace, this.trace_mixin_callback);
		var context = 'do_callback(callback,operands)';
		this.enter(context, '');
		
		if (arg_callback && typeof(arg_callback) === 'function')
		{
			this.step(context, 'call function event callback');
			arg_callback(arg_target_object, arg_operands_array);
		}
		else if (arg_callback && typeof(arg_callback) === 'object' && arg_callback.length >= 2)
		{
			this.step(context, 'call array event callback');
			var cb_object	= arg_callback[0];
			var cb_method	= arg_callback[1];
			var cb_operands	= [];
			
			if ( ! Libapt.is_null(arg_operands_array) )
			{
				for(var opd_index = 0 ; opd_index < arg_operands_array.length ; opd_index++)
				{
					cb_operands.push(arg_operands_array[opd_index]);
				}
			}
			
			for(var opd_index = 2 ; opd_index < arg_callback.length ; opd_index++)
			{
				cb_operands.push(arg_callback[opd_index]);
			}
			
			cb_method.call(cb_object, cb_operands);
		}
		else
		{
			this.leave(context, 'unknow callback type [' + typeof arg_callback + ']');
			this.pop_trace();
			return false;
		}
		
		this.leave(context, 'success');
		this.pop_trace();
		return true;
	}
};
