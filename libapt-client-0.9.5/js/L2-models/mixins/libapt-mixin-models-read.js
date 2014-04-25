	/**
 * @file        libapt-mixin-model-read.js
 * @desc        Mixin of model for read operations
 * @see			libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-07-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinModelRead
 * @public
 * @desc				Mixin of model read operations
 */
var LibaptMixinModelRead =
{
	/**
	 * @memberof			LibaptMixinModelRead
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	mixin_model_read_trace: false,
	
	
	
	/**
	 * @memberof				LibaptMixinModelRead
	 * @public
	 * @method					read(arg_query, arg_success_callback, arg_error_callback)
	 * @desc					Read the storage engine datas with the given query and call the success or failure callback
	 * @param {object}			arg_query
	 * @param {function|null}	arg_success_callback
	 * @param {function|null}	arg_error_callback
	 * @return {boolean}		true:success,false:failure
	 */
	read: function(arg_query, arg_success_callback, arg_error_callback)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_model_read_trace);
		var context = 'read(query,ok_cb,ko_cb)';
		self.enter(context, '');
		
		
		// GET MODEL DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		var bool_result = self.engine.read(arg_query, arg_success_callback, arg_error_callback);
		
		
		self.leave_or_error(context, 'success', 'failure', bool_result);
		self.pop_trace();
		return bool_result;
	},
};
