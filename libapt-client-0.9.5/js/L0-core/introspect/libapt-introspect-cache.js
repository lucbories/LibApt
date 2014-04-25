/**
 * @file        libapt-introspect-cache.js
 * @desc        Libapt static cache features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.get_from_cache(arg_key, arg_default)
 * @desc				Get a value from cache
 * @param {string}		arg_key			name of the value
 * @param {mixed}		arg_default		default value
 * @return {mixed}		Found value or default value
 */
Libapt.get_from_cache = function(arg_key, arg_default)
{
	return $.jStorage.get(arg_key);
}




/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.set_into_cache(arg_key, arg_value, arg_ttl)
 * @desc				Register a value into cache
 * @param {string}		arg_key			name of the value
 * @param {mixed}		arg_value		value
 * @param {integer}		arg_ttl			remaining TTL (in milliseconds) or 0 for no TTL
 * @return {boolean}
 */
Libapt.set_into_cache = function(arg_key, arg_value, arg_ttl)
{
	var options = Libapt.is_number(arg_ttl) ? { 'TTL': arg_ttl } : { 'TTL': 0 };
	$.jStorage.set(arg_key, arg_value, options);
	return true;
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.set_into_cache(arg_key, arg_value, arg_ttl)
 * @desc				Register a value into cache
 * @param {string}		arg_key			name of the value
 * @param {integer}		arg_ttl			remaining TTL (in milliseconds) or 0 for no TTL
 * @return {boolean}
 */
Libapt.set_ttl_into_cache = function(arg_key, arg_ttl)
{
	return $.jStorage.setTTL(arg_key, arg_ttl);
}



/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.delete_from_cache(arg_key)
 * @desc				Delete a value from cache
 * @param {string}		arg_key			name of the value
 * @return {boolean}
 */
Libapt.delete_from_cache = function(arg_key)
{
	return $.jStorage.deleteKey(arg_key);
}
