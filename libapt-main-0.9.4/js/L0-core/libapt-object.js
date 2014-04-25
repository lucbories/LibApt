/**
 * @file        libapt-object.js
 * @desc        Base class
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @class				LibaptObject
 * @desc				Libapt base class
 * @param {string}		arg_name				name of the object
 * @param {boolean}		arg_trace_constructor	enable the trace of the constructors chain
 * @return {nothing}
 */
function LibaptObject(arg_name, arg_trace_constructor)
{
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptObject';
	var context			= this.class_name + '(' + arg_name + ')';
	trace_enter(context, 'constructor', arg_trace_constructor);
	
	// FIELD ATTRIBUTES
	this.name				= get_arg(arg_name, 'no name');
	
	// CONSTRUCTOR END
	trace_leave(context, 'success', arg_trace_constructor);
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	/**
	 * @public
	 * @method				is_a(arg_proto)
	 * @desc				Test class inheritance
	 * @param {object}		arg_proto	prototype
	 * @return {boolean}
	 */
	this.is_a = function(arg_proto)
	{
		return Libapt.is_a(this, arg_proto);
	}
	
	/**
	 * @public
	 * @method				set_options(arg_options, arg_replace)
	 * @desc				Merge settings
	 * @param {object}		arg_options		settings
	 * @param {boolean}		arg_replace		should replace existing setting flag
	 * @return {boolean}
	 */
	this.set_options = function(arg_options, arg_replace)
	{
		var context = 'set_options(options)';
		this.enter(context, '');
		
		if ( Libapt.is_object(arg_options) )
		{
			this.step(context, 'options are a valid object');
			
			for(option_key in arg_options)
			{
				this.step(context, option_key);
				
				var option = arg_options[option_key];
				
				if ( ! Libapt.is_null(this[option_key]) )
				{
					this.step(context, 'this has an existing option');
					if ( Libapt.is_null(this[option_key]) )
					{
						this.step(context, 'update this null option with given option');
						this[option_key] = option;
					}
					else
					{
						this.step(context, 'skip given option because existing option is not null');
						if (arg_replace)
						{
							this[option_key] = option;
						}
					}
				}
				else
				{
					this.step(context, 'append the given option');
					this[option_key] = option;
				}
			}
		}
		else
		{
			this.step(context, 'options are not a valid object');
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	this.register_mixin_proxy_method = function(arg_method_name, arg_mixin_callback)
	{
		var self = this;
		var context = 'register_mixin_proxy_method(method name,callback)';
		this.enter(context, '');
		
		
		var proxied = this[arg_method_name];
		this[arg_method_name] = function()
			{
				self.enter('mixin', arg_method_name);
				
				arg_mixin_callback.apply(self, arguments);
				var result = proxied.apply(self, arguments);
				
				self.leave('mixin', arg_method_name);
				return result;
			};
		this[arg_method_name].proxied = proxied;
		

		this.leave(context, 'success');
		return true;
	}
	
	this.unregister_mixin_proxy_method = function(arg_method_name)
	{
		var context = 'unregister_mixin_proxy_method(method name)';
		this.enter(context, '');
		
		this[arg_method_name] = this[arg_method_name].proxied;
		
		this.leave(context, 'success');
		return true;
	}
	
	
	this.clone_object = function(arg_object_to_clone)
	{
		// NULL OR SIMPLE TYPE (NOT OBJECT)
		if (arg_object_to_clone == null || typeof(arg_object_to_clone) != 'object')
		{
			return arg_object_to_clone;
		}
		
		// ARRAY
		if ( Libapt.is_array(arg_object_to_clone) )
		{
			var tmp = new Array();
			for(key in arg_object_to_clone)
			{
				tmp.push(arg_object_to_clone[key]);
			}
			return tmp;
		}
		
		return jQuery.extend(true, {}, arg_object_to_clone);
	}
	
	
	this.register_mixin = function(arg_mixin_proto, arg_mixin_attr_names)
	{
		var self = this;
		var context = 'register_mixin(proto,attributes names)';
		if (self.enter)
		{
			self.enter(context, '');
		}
		else if (self.trace)
		{
			Libapt.log( { level:'DEBUG', step:'ENTER', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
			Libapt.log_indent();
		}
		
		if ( Libapt.is_null(arg_mixin_attr_names) )
		{
			arg_mixin_attr_names = [];
			for(key in arg_mixin_proto)
			{
				arg_mixin_attr_names.push(key);
			}
		}
		
		if ( ! Libapt.is_array(arg_mixin_attr_names) )
		{
			arg_mixin_attr_names = [arg_mixin_attr_names];
		}
		
		for(attr_name_key in arg_mixin_attr_names)
		{
			var attr_name	= arg_mixin_attr_names[attr_name_key];
			var attr_obj	= arg_mixin_proto[attr_name];
			if ( Libapt.is_string(attr_name) && ! Libapt.is_null(attr_obj) )
			{
				if ( Libapt.is_function(attr_obj) )
				{
					self[attr_name] = attr_obj;
				}
				else
				{
					self[attr_name] = this.clone_object(attr_obj);
					// console.log('clone of ' + this.name + ' : ' + attr_name);
					// console.log(self[attr_name]);
				}
			}
		}
		
		
		if (self.leave)
		{
			self.leave(context, 'success');
		}
		else if (self.trace)
		{
			Libapt.log_unindent();
			Libapt.log( { level:'DEBUG', step:'LEAVE', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
		}
		return true;
	}
	
	
	this.register_mixin_method = function(arg_mixin_proto, arg_mixin_method_names)
	{
		var self = this;
		var context = 'register_mixin_method(method name,proto,method)';
		if (self.enter)
		{
			self.enter(context, '');
		}
		else if (self.trace)
		{
			Libapt.log( { level:'DEBUG', step:'ENTER', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
			Libapt.log_indent();
		}
		
		if ( Libapt.is_null(arg_mixin_method_names) )
		{
			arg_mixin_method_names = [];
			for(key in arg_mixin_proto)
			{
				arg_mixin_method_names.push(key);
			}
		}
		
		if ( ! Libapt.is_array(arg_mixin_method_names) )
		{
			arg_mixin_method_names = [arg_mixin_method_names];
		}
		
		for(method_name_key in arg_mixin_method_names)
		{
			var method_name = arg_mixin_method_names[method_name_key];
			var method_func = arg_mixin_proto[method_name];
			if ( Libapt.is_string(method_name) && Libapt.is_function(method_func) )
			{
				self[method_name] = method_func;
			}
		}
		
		
		if (self.leave)
		{
			self.leave(context, 'success');
		}
		else if (self.trace)
		{
			Libapt.log_unindent();
			Libapt.log( { level:'DEBUG', step:'LEAVE', context:self.class_name + '.' + arg_context + '[' + self.name + ']', text:arg_msg } );
		}
		return true;
	}
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	this.register_mixin(LibaptMixinTrace);
	this.register_mixin(LibaptMixinAssertion);
	this.register_mixin(LibaptMixinCallback);
	this.register_mixin(LibaptMixinEventSender);
	this.register_mixin(LibaptMixinEventListener);
}




LibaptObject.create = function(arg_settings)
{
	var context = 'LibaptObject.create(arg_settings)';
	trace_enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'trace'			: false
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CREATE OBJECT
	var obj = new LibaptObject(ext_settings.name);
	obj.trace = ext_settings.trace;
	
	trace_leave(context, '', true);
	return obj;
}




/**
 * @fn			register_mixin_method(arg_method_name, arg_mixin_callback)
 * @brief		Register mixin method
 * @memberof	LibaptObject
 * @public
 * @param[in]	arg_method_name			method name to update (string)
 * @param[in]	arg_mixin_callback		mixin callback to include in the method (function)
 * @return		boolean					true:success,false:failure
 */

/**
 * @fn			remove_event_callback(arg_event_name, arg_event_cb)
 * @brief		Unregister an event callback
 * @memberof	LibaptObject
 * @public
 * @param[in]	arg_event_name		event name (string)
 * @param[in]	arg_event_cb		event callback (function)
 * @return		boolean				true:success,false:failure
 */

/**
 * @fn			set_options(arg_options)
 * @brief		Init options
 * @memberof	LibaptObject
 * @public
 * @param[in]	arg_options			object init options (object)
 * @return		boolean
 */

/**
 * @fn			unregister_mixin_method(arg_method_name)
 * @brief		Unregister mixin method
 * @memberof	LibaptObject
 * @public
 * @param[in]	arg_method_name		method name to update (string)
 * @return		boolean				true:success,false:failure
 */



/**
 * @fn			LibaptObject::create(arg_settings)
 * @brief		LibaptObject creation (class static method)
 * @memberof	LibaptObject
 * @public
 * @param[in]	arg_settings		creation settings (object)
 * @return		object
 */
 
 
 