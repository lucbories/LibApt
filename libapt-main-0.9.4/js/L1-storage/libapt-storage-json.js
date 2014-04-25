/**
 * @file        libapt-models-storage-json.js
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

/**
 * @brief		Storage engine for remote JSON server access
 * @param[in]	arg_name			name of the storage engine
 * @param[in]	arg_url_read			name of the field
 */
function LibaptStorageRemoteJson(arg_name, arg_url_read, arg_url_create, arg_url_update, arg_url_delete)
{
	// INHERIT
	this.inheritFrom = LibaptStorage;
	this.inheritFrom(arg_name);
	
	// CONSTRUCTOR BEGIN
	var context = 'LibaptStorageRemoteJson(' + arg_name + ')';
	trace_enter(context, 'constructor', APT_MODELS_STORAGE_TRACE);
	
	
	// STORAGE ENGINE ATTRIBUTES
	this.class_name		= 'LibaptStorageRemoteJson';
	this.name			= arg_name;
	this.is_valid		= true;
	this.is_sync		= false;
	this.is_cached		= false;
	this.url_read		= arg_url_read;
	this.url_create		= arg_url_create;
	this.url_update		= arg_url_update;
	this.url_delete		= arg_url_delete;
	this.http_method	= 'POST';
	this.http_timeout	= 5000; // milliseconds
	this.http_charset	= 'utf-8';
	this.http_format	= 'application/x-www-form-urlencoded';
	this.data_type		= 'jsonp';
	this.data_name		= 'json_datas';
	// this.ajax_success_callback	= null;
	// this.ajax_error_callback	= null;
	this.ajax_last_result	= false;
	this.ajax_last_status	= '';
	this.ajax_last_datas	= null;
	this.ajax_last_finished	= false;
	
	// CONSTRUCTOR END
	trace_leave(context, 'constructor', APT_MODELS_STORAGE_TRACE);
	
	
	// PRIVATE METHOD : AJAX JSON REQUEST STATE RESET
	function ajax_reset()
	{
		this.ajax_last_result	= false;
		this.ajax_last_status	= '';
		this.ajax_last_datas	= null;
		this.ajax_last_finished	= false;
	}
	
	// PRIVATE METHOD : AJAX JSON REQUEST
	function ajax_request_read(arg_engine, arg_url, arg_json_datas, arg_success_callback, arg_error_callback, arg_has_result)
	{
		var context = 'LibaptStorageRemoteJson.ajax_request_read(...)';
		trace_enter(context, 'use cache', APT_MODELS_STORAGE_TRACE);
		
		var cache_key = MD5('LIBAPT_CACHE_' + arg_url);
		var has_cache = typeof ( $(window).data(cache_key) ) != 'undefined';
		
		trace_var(context, "cache_key", cache_key, APT_MODELS_STORAGE_TRACE);
		trace_var(context, "has_cache", has_cache, APT_MODELS_STORAGE_TRACE);
		trace_var(context, "is_cached", arg_engine.is_cached, APT_MODELS_STORAGE_TRACE);
		
		// DO NOT USE CACHE
		if ( ! arg_engine.is_cached || ! has_cache )
		{
			trace_step(context, 'do not use cache', APT_MODELS_STORAGE_TRACE);
			if (has_cache)
			{
				$(window).removeData(cache_key);
			}
			var result = ajax_request(arg_engine, arg_url, arg_json_datas, arg_success_callback, arg_error_callback, arg_has_result);
			trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
			return result;
		}
		
		// USE CACHE
		trace_step(context, 'use cache', APT_MODELS_STORAGE_TRACE);
		trace_var(context, "url", arg_url, APT_MODELS_STORAGE_TRACE);
		
		var datas = $(window).data(cache_key);
		trace_var(context, "datas", datas, APT_MODELS_STORAGE_TRACE);
		
		
		// CALL SUCCESS CALLBACK IF DEFINED
		if ( ! Libapt.is_null(arg_success_callback) )
		{
			trace_step(context, 'ajax_success_callback', APT_MODELS_STORAGE_TRACE);
			arg_success_callback(datas, 'cached', null);
		}
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return true;
	}
	
	function ajax_request(arg_engine, arg_url, arg_json_datas, arg_success_callback, arg_error_callback, arg_has_result)
	{
		var context = 'ajax_request(engine,url,json_datas)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		// TRACE
		trace_var(context, 'url', arg_url, APT_MODELS_STORAGE_TRACE);
		trace_var(context, 'arg_json_datas', Libapt.is_null(arg_json_datas) ? 'null' : (Libapt.is_array(arg_json_datas) ? 'length=' + arg_json_datas.length : (Libapt.is_string(arg_json_datas)?arg_json_datas : 'unknow') ), APT_MODELS_STORAGE_TRACE);
		
		// CREATE AJAX REQUEST
		ajax_reset();
		$.ajax(
			{
				contentType	: arg_engine.http_format + '; charset=' + arg_engine.http_charset,
				dataType	: arg_has_result ? arg_engine.data_type : null,
				async		: ! arg_engine.is_sync,
				cache		: arg_engine.is_cached,
				type		: arg_engine.is_cached ? 'GET' : arg_engine.http_method,
				url			: arg_url,
				timeout		: arg_engine.http_timeout,
				data		: arg_json_datas,
				
				success : function(datas, textStatus, jqXHR)
					{
						var context = 'LibaptStorageRemoteJson.ajax_request.success(...)';
						trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
						
						// TRACE
						trace_var(context, "url", arg_url, APT_MODELS_STORAGE_TRACE);
						trace_var(context, "textStatus", textStatus, APT_MODELS_STORAGE_TRACE);
						
						// UPDATE AJAX REQUEST STATE
						arg_engine.ajax_last_result		= true;
						arg_engine.ajax_last_status		= textStatus;
						arg_engine.ajax_last_datas		= datas;
						arg_engine.ajax_last_finished	= true;
						// trace_var(context, "datas", datas, APT_MODELS_STORAGE_TRACE);
						// trace_var(context, "arg_engine.ajax_last_datas", arg_engine.ajax_last_datas, APT_MODELS_STORAGE_TRACE);
						
						// CACHE RESULT
						var cache_key = MD5('LIBAPT_CACHE_' + arg_url);
						$(window).data(cache_key, datas);
						
						// CALL SUCCESS CALLBACK IF DEFINED
						if ( ! Libapt.is_null(arg_success_callback) )
						{
							trace_step(context, 'ajax_success_callback', APT_MODELS_STORAGE_TRACE);
							arg_success_callback(datas, textStatus, jqXHR);
						}
						
						trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
					},
				
				error : function(jqXHR, textStatus, errorThrown)
					{
						var context = 'LibaptStorageRemoteJson.ajax_request.error(...)';
						trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
						
						// TRACE
						trace_var(context, "url", arg_url, APT_MODELS_STORAGE_TRACE);
						trace_var(context, "textStatus", textStatus, APT_MODELS_STORAGE_TRACE);
						
						// UPDATE AJAX REQUEST STATE
						arg_engine.ajax_last_result	= false;
						arg_engine.ajax_last_status	= textStatus;
						arg_engine.ajax_last_datas	= null;
						arg_engine.ajax_last_finished	= true;
						
						// CALL ERROR CALLBACK IF DEFINED
						if ( ! Libapt.is_null(arg_error_callback) )
						{
							trace_step(context, 'arg_error_callback', APT_MODELS_STORAGE_TRACE);
							arg_error_callback(jqXHR, textStatus, errorThrown);
						}
						
						trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
					}
			}
		);
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return true;
	}
	
	
	// PUBLIC METHOD : READ ALL EXISTING RECORDS
	this.read_all_records = function(arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.read_all_records()';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var url = this.url_read;
		var bool_result = ajax_request_read(this, url, null, arg_success_callback, arg_error_callback, true);
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : READ ALL EXISTING RECORDS
	this.read_all_records_sync = function(arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.read_all_records_sync()';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		
		// FORCE SYNC MODE
		var sync = this.is_sync;
		this.is_sync = true;
		
		var url = this.url_read;
		var bool_result = ajax_request_read(this, url, null, arg_success_callback, arg_error_callback, true);
		
		// RESTORE SYNC MODE
		this.is_sync = sync;
		
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : READ FILTERED EXISTING RECORDS
	this.read = function(arg_query, arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.read(arg_settings,arg_success_callback,arg_error_callback)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		// GET URL
		var url = this.url_read + arg_query.get_url_string();
		
		// GET DATAS
		var bool_result = ajax_request_read(this, url, null, arg_success_callback, arg_error_callback, true);
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : READ FILTERED EXISTING RECORDS (FORCE SYNC MODE)
	this.read_sync = function(arg_query, arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.read_sync(arg_query,arg_success_callback,arg_error_callback)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		
		// FORCE SYNC MODE
		var sync = this.is_sync;
		this.is_sync = true;
		
		// GET URL
		var url = this.url_read + arg_query.get_url_string();
		
		// GET DATAS
		var bool_result = ajax_request_read(this, url, null, arg_success_callback, arg_error_callback, true);
		
		// RESTORE SYNC MODE
		this.is_sync = sync;
		
		
		trace_leave(context, '(sync request is finished now)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : INSERT A NEW RECORD
	this.create_records = function(arg_records, arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.create_records(arg_records,arg_success_callback,arg_error_callback)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var json_datas = this.data_name +'=' + JSON.stringify(arg_records);
		// var json_datas = this.data_name +'=' + arg_records;
		trace_var(context, "json_datas", json_datas);
		var bool_result = ajax_request(this, this.url_create, json_datas, arg_success_callback, arg_error_callback, false);
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : UPDATE AN EXISTING RECORD
	this.update_records = function(arg_records, arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.update_records(arg_records,arg_success_callback,arg_error_callback)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var json_datas = this.data_name +'=' + JSON.stringify(arg_records);
		trace_var(context, "json_datas", json_datas);
		var bool_result = ajax_request(this, this.url_update, json_datas, arg_success_callback, arg_error_callback, false);
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : DELETE AN EXISTING RECORD
	this.delete_records = function(arg_records, arg_success_callback, arg_error_callback)
	{
		var context = this.class_name + '.delete_records(arg_records,arg_success_callback,arg_error_callback)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var json_datas = this.data_name +'=' + JSON.stringify(arg_records);
		trace_var(context, "json_datas", json_datas);
		var bool_result = ajax_request(this, this.url_delete, json_datas, arg_success_callback, arg_error_callback, false);
		
		trace_leave(context, '(async request maybe not finished yet)', APT_MODELS_STORAGE_TRACE);
		return bool_result;
	}
}
