/**
 * @file        libapt-introspect-init.js
 * @desc        Libapt static init features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



// --------------------------------------------- RESOURCES INIT ---------------------------------------------


/**
 * @memberof			Libapt
 * @public
 * @static
 * @desc				Array of resources init callbacks
 */
Libapt.init_resources_by_index	= [];

/**
 * @memberof			Libapt
 * @public
 * @static
 * @desc				Associative array of resources init callbacks by name
 */
Libapt.init_resources_by_name	= {};

/**
 * @memberof			Libapt
 * @public
 * @static
 * @desc				Array of resources after init callbacks
 */
Libapt.init_after_resources		= [];


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.init_resource(arg_init_name, arg_init_cb)
 * @desc				Register a callback to init some resource at the end of the page loading
 * @param {string}		arg_init_name			name of the init operation
 * @param {function}	arg_init_cb				resource init callback
 * @return {nothing}
 */
Libapt.init_resource = function(arg_init_name, arg_init_cb)
{
	console.log('Libapt.init_resource [' + arg_init_name + ']');
	
	if ( Libapt.init_resources_by_name[arg_init_name] )
	{
		return;
	}
	
	Libapt.init_resources_by_name[arg_init_name] = arg_init_cb;
	Libapt.init_resources_by_index.push(arg_init_cb);
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.after_resource(arg_init_name, arg_init_cb)
 * @desc				Register a callback to execute after the resources init at the end of the page loading
 * @param {string}		arg_init_name			name of the init operation
 * @param {function}	arg_init_cb				resource init callback
 * @return {nothing}
 */
Libapt.after_resource = function(arg_init_name, arg_init_cb)
{
	console.log('Libapt.after_resource [' + arg_init_name + ']');
	
	Libapt.init_after_resources.push(arg_init_cb);
}


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.init()
 * @desc				Execute the registered callbacks at the end of the page loading
 * @return {nothing}
 */
Libapt.init = function()
{
	console.info('Libapt: init');
	
	console.info('Libapt: Executing resources init functions');
	for(resource_index in Libapt.init_resources_by_index)
	{
		var init_cb = Libapt.init_resources_by_index[resource_index];
		init_cb();
	}
	
	console.info('Libapt: Executing last init functions');
	for(after_index in Libapt.init_after_resources)
	{
		var init_cb = Libapt.init_after_resources[after_index];
		init_cb();
	}
}
