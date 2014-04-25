/**
 * @file        libapt-cache.js
 * @desc        Cache feature: use jStorage (localStorage or globalStorage['domain'])
 * @see			jStorage(http://www.jstorage.info/)
 * @ingroup     LIBAPT_CORE_JS
 * @date        2013-09-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @class		LibaptCache
 * @public
 * @static
 * @desc		Cache manager static class
 * @return		nothing
 */
function LibaptCache()
{
}



/**
 * @memberof	LibaptCache
 * @public
 * @static
 * @desc		Trace flag
 */
LibaptCache.trace = false;



/**
 * @memberof			LibaptCache
 * @public
 * @static
 * @method				LibaptCache.get(arg_key, arg_default)
 * @desc				Get a cached value if available with the given key
 * @param {string}					arg_key				The cached value key
 * @param {string|object|array}		arg_default			The result default value
 * @return {string|object|array}	The cached value
 */
LibaptCache.get = function (arg_key, arg_default)
{
	var context = 'LibaptCache.get(key,default)';
	Libapt.trace_enter(context, '', LibaptCache.trace);
	
	var value = $.jStorage.get(arg_key, arg_default);
	if (!value)
	{
		Libapt.trace_leave(context, 'not found', LibaptCache.trace);
		return false;
	}
	
	Libapt.trace_leave(context, 'found', LibaptCache.trace);
	return value;
}



/**
 * @memberof			LibaptCache
 * @public
 * @static
 * @method				LibaptCache.has(arg_key)
 * @desc				Test if a value for the given key is cached
 * @param {string}		arg_key				The cached value key
 * @return {boolean}	true:found,false:not found
 */
LibaptCache.has = function(arg_key)
{
	var context = 'LibaptCache.has(key)';
	Libapt.trace_enter(context, '', LibaptCache.trace);
	
	var value = $.jStorage.get(arg_key, null);
	
	Libapt.trace_leave(context, '', LibaptCache.trace);
	return ! Libapt.is_null(value);
}



/**
 * @memberof			LibaptCache
 * @public
 * @static
 * @method				LibaptCache.set(arg_key, arg_value, arg_ttl)
 * @desc				Set a cached value if available with the given key
 * @param {string}					arg_key				The cached value key
 * @param {string|object|array}		arg_value			The cached value
 * @param {object}					arg_ttl				TTL (not required)
 * @return {boolean}				true:success,false:failure
 */
LibaptCache.set = function (arg_key, arg_value, arg_ttl)
{
	var context = 'LibaptCache.set(key,value,options)';
	Libapt.trace_enter(context, '', LibaptCache.trace);
	
	var options = arg_ttl ? { 'TTL':arg_ttl } : null;
	var result = $.jStorage.set(arg_key, arg_value, options);
	if (!result)
	{
		Libapt.trace_leave(context, 'failure', LibaptCache.trace);
		return false;
	}
	
	Libapt.trace_leave(context, 'success', LibaptCache.trace);
	return true;
}



/**
 * @memberof			LibaptCache
 * @public
 * @static
 * @method				LibaptCache.remove(arg_key)
 * @desc				Remove a value from the cache with the given key
 * @param {string}		arg_key				The cached value key
 * @return {boolean}	true:success,false:failure
 */
LibaptCache.remove = function (arg_key)
{
	var context = 'LibaptCache.remove(key)';
	Libapt.trace_enter(context, '', LibaptCache.trace);
	
	$.jStorage.deleteKey(arg_key);
	
	Libapt.trace_leave(context, '', LibaptCache.trace);
	return true;
}
