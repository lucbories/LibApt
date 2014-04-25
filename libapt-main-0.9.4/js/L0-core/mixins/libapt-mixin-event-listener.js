/**
 * @file        libapt-mixin-event-listener.js
 * @desc        Mixin of methods for event listening
 * @see			LibaptEvent LibatpObject
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @mixin				LibaptMixinEventListener
 * @public
 * @desc				Mixin of methods for event listening
 */
var LibaptMixinEventListener = 
{
	/**
	 * @memberof			LibaptMixinEventListener
	 * @public
	 * @desc				Enable/disable trace for event listening operations
	 */
	trace_mixin_event_listener: false,
	
	
	/**
	 * @memberof			LibaptMixinEventListener
	 * @public
	 * @desc				List of events callbacks
	 */
	events_callbacks: new Object(),
	
	
	/**
	 * @memberof			LibaptMixinEventListener
	 * @public
	 * @method				has_event_callback(arg_event_name, arg_event_cb)
	 * @desc				Test if an event callback is registered
	 * @param {string}		arg_event_name		event name
	 * @param {function}	arg_event_cb		event callback
	 * @return {boolean}	true:success,false:failure
	 */
	has_event_callback: function(arg_event_name, arg_event_cb)
	{
		this.push_trace(this.trace, this.trace_mixin_event_listener);
		var context = 'has_event_callback(' + arg_event_name + ',callback)';
		this.enter(context, '');
		
		var event_callbacks = this.events_callbacks[arg_event_name];
		if ( Libapt.is_array(event_callbacks) )
		{
			this.step(context, 'object event has registered callbacks');
			for(event_key in event_callbacks)
			{
				var event_cb = event_callbacks[event_key];
				
				if ( Libapt.is_function(event_cb) )
				{
					this.step(context, 'object event is a function');
					if (event_cb === arg_event_cb)
					{
						this.leave(context, 'callback function found');
						this.pop_trace();
						return true;
					}
				}
				
				if ( Libapt.is_array(event_cb) )
				{
					this.step(context, 'object event is an array');
					if ( Libapt.is_array(arg_event_cb) )
					{
						this.step(context, 'arg event is an array');
						if (event_cb.length === arg_event_cb.length)
						{
							this.step(context, 'object events array have the same size');
							var found = true;
							var size = event_cb.length;
							for(var index = 0 ; index < size ; index++)
							{
								if (event_cb[index] !== arg_event_cb[index])
								{
									this.step(context, 'object event item is not equals at index[' + index + ']');
									found = false;
									break;
								}
							}
							if (found)
							{
								this.leave(context, 'callback array found');
								this.pop_trace();
								return true;
							}
						}
					}
				}
			}
		}
		
		this.leave(context, 'not found');
		this.pop_trace();
		return false;
	},
	
	
	/**
	 * @memberof			LibaptMixinEventListener
	 * @public
	 * @method				add_event_callback(arg_event_name, arg_event_cb)
	 * @desc				Register an event callback
	 * @param {string}		arg_event_name		event name
	 * @param {function}	arg_event_cb		event callback
	 * @param {boolean}		arg_unique			has unique callback for event
	 * @return {boolean}	true:success,false:failure
	 */
	add_event_callback: function(arg_event_name, arg_event_cb, arg_unique)
	{
		this.push_trace(this.trace, this.trace_mixin_event_listener);
		var context = 'add_event_callback(' + arg_event_name + ',callback)';
		this.enter(context, '');

		// CHECK EVENT NAME ARGUMENT
		this.assertNotEmptyString(context, arg_event_name);
		
		// CHECK EVENT CALLBACK ARGUMENT
		this.assertNull(context, arg_event_cb);
		
		// CHECK UNIQUE ARGUMENT
		if ( Libapt.is_null(arg_unique) )
		{
			arg_unique = true;
		}
		if (arg_unique && this.has_event_callback(arg_event_name, arg_event_cb) )
		{
			this.leave(context, 'unique event is already registered');
			this.pop_trace();
			return true;
		}
		
		// GET CALLBACKS ARRAY
		var event_callbacks = this.events_callbacks[arg_event_name];
		if ( Libapt.is_null(event_callbacks) )
		{
			event_callbacks = new Array();
			this.events_callbacks[arg_event_name] = event_callbacks;
		}
		
		// APPEND CALLBACK
		event_callbacks.push(arg_event_cb);
		
		this.leave(context, 'success');
		this.pop_trace();
		return true;
	},
	
	
	/**
	 * @memberof			LibaptMixinEventListener
	 * @public
	 * @method				remove_event_callback(arg_event_name, arg_event_cb)
	 * @desc				Unregister an event callback
	 * @param {string}		arg_event_name		event name
	 * @param {function}	arg_event_cb		event callback
	 * @return {boolean}	true:success,false:failure
	 */
	remove_event_callback : function(arg_event_name, arg_event_cb)
	{
		this.push_trace(this.trace, this.trace_mixin_event_listener);
		var context = 'remove_event_callback(' + arg_event_name + ',callback)';
		this.enter(context, '');
		
		// GET CALLBACKS ARRAY
		var event_callbacks = this.events_callbacks[arg_event_name];
		if ( Libapt.is_null(event_callbacks) )
		{
			this.leave(context, 'not found');
			this.pop_trace();
			return false;
		}
		
		// REMOVE GIVEN CALLBACK
		var index = event_callbacks.lastIndexOf(arg_event_cb);
		if (index >= 0)
		{
			event_callbacks.splice(index, 1);
		}
		else
		{
			this.leave(context, 'not found');
			this.pop_trace();
			return false;
		}
		
		this.leave(context, 'success');
		this.pop_trace();
		return true;
	}
};
