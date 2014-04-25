/**
 * @file        libapt-events.js
 * @desc        Events repository
 * @see			libapt-event.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-14
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @class		LibaptEvents
 * @desc		Events repository static class
 * @return		nothing
 */
function LibaptEvents()
{
}


/**
 * @memberof	LibaptEvents
 * @public
 * @property	LibaptEvents.all_events
 * @desc		Fired Events repository array (static method)
 */
LibaptEvents.all_events = [];


/**
 * @memberof	LibaptEvents
 * @public
 * @property	LibaptEvents.target_events
 * @desc		Fired Events repository associative array by target name (static method)
 */
LibaptEvents.target_events = new Object();


/**
 * @memberof	LibaptEvents
 * @public
 * @property	LibaptEvents.kind_events
 * @desc		Fired Events repository associative array by kind of event (static method)
 */
LibaptEvents.kind_events = new Object();


/**
 * @memberof	LibaptEvents
 * @public
 * @property	LibaptEvents.add_event_callbacks
 * @desc		Callbacks to call on each new event into the repository
 */
LibaptEvents.add_event_callbacks = [];


/**
 * @memberof				LibaptEvents
 * @public
 * @method					LibaptEvents.append_callback_on_add(arg_callback_function)
 * @desc					Append a new callback to call on each new event
 * @param {function}		arg_callback_function
 * @return {nothing}
 */
LibaptEvents.append_callback_on_add = function(arg_callback_function)
{
	if ( Libapt.is_function(arg_callback_function) )
	{
		LibaptEvents.add_event_callbacks.push(arg_callback_function);
	}
}


/**
 * @memberof				LibaptEvents
 * @public
 * @method					LibaptEvents.remove_callback_on_add(arg_callback_function)
 * @desc					Remove an existing callback to call on each new event
 * @param {function}		arg_callback_function
 * @return {nothing}
 */
LibaptEvents.remove_callback_on_add = function(arg_callback_function)
{
	if ( Libapt.is_function(arg_callback_function) )
	{
		var tmp_callbacks = [];
		for(cb_index in LibaptEvents.add_event_callbacks)
		{
			var all_cb = LibaptEvents.add_event_callbacks[cb_index];
			if (all_cb != arg_callback_function)
			{
				tmp_callbacks.push(all_cb);
			}
		}
		LibaptEvents.add_event_callbacks = tmp_callbacks;
	}
}


/**
 * @memberof	LibaptEvents
 * @public
 * @method		LibaptEvents.add(arg_event)
 * @desc		Append an fired event to the events repository (static method)
 * @return		nothing
 */
LibaptEvents.add = function(arg_event)
{
	LibaptEvents.all_events.push(arg_event);
	LibaptEvents.target_events[ arg_event.get_target_name() ] = arg_event;
	LibaptEvents.kind_events[ arg_event.name ] = arg_event;
	
	if (LibaptEvents.add_event_callbacks.length > 0)
	{
		for(cb_index in LibaptEvents.add_event_callbacks)
		{
			var all_cb = LibaptEvents.add_event_callbacks[cb_index];
			all_cb.apply(null, [arg_event]);
		}
	}
}


/**
 * @memberof	LibaptEvents
 * @public
 * @method		LibaptEvents.reset()
 * @desc		Remove all fired events of the repository (static method)
 * @return		nothing
 */
LibaptEvents.reset = function()
{
	LibaptEvents.all_events = [];
	LibaptEvents.target_events = new Object();
	LibaptEvents.kind_events = new Object();
}
