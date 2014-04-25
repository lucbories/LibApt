/**
 * @file        libapt-event.js
 * @desc        Event class
 * @see			libapt-object.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-14
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @class				LibaptEvent
 * @desc				Event class constructor
 * @method				LibaptEvent.constructor
 * @param {string}		arg_event_name				event name
 * @param {object}		arg_event_target_object		event target object
 * @param {array}		arg_event_operands			event operands
 * @return {nothing}
 */
function LibaptEvent(arg_event_name, arg_event_target_object, arg_event_operands)
{
	/**
	 * @memberof			LibaptEvent
	 * @public
	 * @method				LibaptEvent.constructor
	 * @desc				Event class constructor
	 * @param {string}		arg_event_name				event name
	 * @param {object}		arg_event_target_object		event target object
	 * @param {array}		arg_event_operands			event operands
	 * @return {nothing}
	 */
	this.LibaptEvent_constructor = function(arg_event_name, arg_event_target_object, arg_event_operands)
	{
		// INHERIT
		this.inheritFrom = LibaptObject;
		this.inheritFrom(arg_event_name, false);
		
		// CONSTRUCTOR BEGIN
		this.trace				= false;
		this.class_name			= 'LibaptEvent';
		var context				= this.class_name + '(' + arg_event_name + ')';
		this.enter(context, 'constructor');
		
		
		// EVENT ATTRIBUTES
		this.target_object		= arg_event_target_object;
		this.operands_array		= get_arg(arg_event_operands, []);
		this.fired_ts			= null;
		
		
		// CONSTRUCTOR END
		this.leave(context, 'success');
	}
	
	// CALL CONSTRUCTOR
	this.LibaptEvent_constructor(arg_event_name, arg_event_target_object, arg_event_operands);
	
	
	/**
	 * @memberof			LibaptEvent
	 * @public
	 * @method				LibaptEvent.get_target()
	 * @desc				Get event target object
	 * @return {object}
	 */
	this.get_target = function()
	{
		var context = 'get_target()';
		this.enter(context, '');
		
		
		this.leave(context, 'success');
		return this.target_object;
	}
	
	
	/**
	 * @memberof			LibaptEvent
	 * @public
	 * @method				LibaptEvent.get_target_name()
	 * @desc				Get event target object name
	 * @return {object}
	 */
	this.get_target_name = function()
	{
		var context = 'get_target()';
		this.enter(context, '');
		
		
		this.leave(context, 'success');
		return Libapt.is_null(this.target_object) ? 'null target' : this.target_object.name;
	}
	
	
	/**
	 * @memberof			LibaptEvent
	 * @public
	 * @method				LibaptEvent.fire(arg_callbacks_array)
	 * @desc				Fire event : call all callbacks
	 * @param {array}		arg_callbacks_array		callbacks
	 * @return {nothing}
	 */
	this.fire = function(arg_callbacks_array)
	{
		var context = 'fire(callbacks)';
		this.enter(context, '');
		
		this.fired_ts = Date();
		LibaptEvents.add(this);
		
		if ( ! Libapt.is_array(arg_callbacks_array) )
		{
			this.leave(context, 'not a callbacks array');
			return true;
		}
		if ( arg_callbacks_array.length <= 0 )
		{
			this.leave(context, 'no callbacks to fire');
			return true;
		}
		
		for(var cb_index = 0 ; cb_index < arg_callbacks_array.length ; cb_index++)
		{
			this.value(context, 'fired callback index', cb_index);
			var callback = arg_callbacks_array[cb_index];
			this.do_callback(callback, new Array(this.target_object).concat(this.operands_array));
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptEvent
	 * @public
	 * @method				LibaptEvent.to_string_self()
	 * @desc				Child class specific to_string part
	 * @return {string}
	 */
	this.to_string_self = function()
	{
		return
			this.to_string_value('target object', Libapt.is_null(this.target_object) ? 'null' : this.target_object.getName() )
			this.to_string_value('operands_array.length', this.operands_array.length)
			this.to_string_value('fired_ts', Libapt.is_null(fired_ts) ? 'no fired' : this.fired_ts)
			;
	}
}





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
 * @method		LibaptEvents.add(arg_event)
 * @desc		Append an fired event to the events repository (static method)
 * @return		nothing
 */
LibaptEvents.add = function(arg_event)
{
	LibaptEvents.all_events.push(arg_event);
	LibaptEvents.target_events[ arg_event.get_target_name() ] = arg_event;
	LibaptEvents.kind_events[ arg_event.name ] = arg_event;
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
