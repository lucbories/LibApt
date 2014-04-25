/**
 * @file        libapt-models-storage-api.js
 * @brief       Storage engines for models on client side
 * @details     
 * @see			libapt-models-model.js libapt-main.js libapt-main-ajax.js
 * @ingroup     LIBAPT_MODELS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

var APT_MODELS_STORAGE_TRACE = false;



/**
 * @brief		Abstract storage engine
 * @param[in]	arg_name			name of the storage engine
 */
function LibaptStorage(arg_name)
{
	// CONSTRUCTOR BEGIN
	var context = 'LibaptStorage(' + arg_name + ')';
	trace_enter(context, 'constructor', APT_MODELS_STORAGE_TRACE);
	
	// FIELD ATTRIBUTES
	this.class_name = 'LibaptStorage';
	this.name = arg_name;
	this.is_valid = false;
	
	// CONSTRUCTOR END
	trace_leave(context, 'constructor', APT_MODELS_STORAGE_TRACE);
	
	
	// PUBLIC METHOD : TO STRING
	this.toString = function()
	{
		// return 'name=' + this.name;
		var str = this.class_name + '[';
		for(attribute_key in this)
		{
			var attribute = this[attribute_key];
			if (typeof attribute == 'function')
			{
				attribute = 'method';
			}
			str += '\n' + attribute_key + '=' + attribute;
		}
		str += '\n]';
		return str;
	}
	
	this.to_string = function()
	{
		return this.toString();
	}
	
	// PUBLIC METHOD : THE STORAGE ENGINE IS VALID ?
	this.is_valid = function()
	{
		return this.is_valid;
	}
	
	
	/**
	 * @brief		PUBLIC METHOD : READ ALL EXISTING RECORDS WITH A MAX RECORDS COUNT
	 * @return		boolean			true:success, false:failure
	 */
	this.read_all_records = function (arg_success_callback, arg__error_callback)
	{
	}
	
	
	/**
	 * @brief		PUBLIC METHOD : READ ALL EXISTING RECORDS WITH A MAX RECORDS COUNT
	 * @return		boolean			true:success, false:failure
	 */
	this.read = function (arg_query, arg_success_callback, arg__error_callback)
	{
	}
	
	
	/**
	 * @brief		PUBLIC METHOD : READ FILTERED EXISTING RECORDS (FORCE SYNC MODE)
	 * @return		boolean			true:success, false:failure
	 */
	this.read_sync = function(arg_settings, arg_success_callback, arg__error_callback)
	{
	}
	
	
	/**
	 * @brief		PUBLIC METHOD : INSERT A NEW RECORD
	 * @return		boolean			true:success, false:failure
	 */
	this.create_records = function (arg_records, arg_success_callback, arg__error_callback)
	{
	}
	
	
	/**
	 * @brief		PUBLIC METHOD : UPDATE AN EXISTING RECORD
	 * @return		boolean			true:success, false:failure
	 */
	this.update_records = function (arg_records, arg_success_callback, arg__error_callback)
	{
	}
	
	
	/**
	 * @brief		PUBLIC METHOD : DELETE AN EXISTING RECORD
	 * @return		boolean			true:success, false:failure
	 */
	this.delete_records = function (arg_records, arg_success_callback, arg__error_callback)
	{
	}
}