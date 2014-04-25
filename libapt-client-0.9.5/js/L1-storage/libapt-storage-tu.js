/**
 * @file        libapt-models-storage-tu.js
 * @brief       Models storage engines Test Unit
 * @details     ...
 * @see			libapt-models-storage.js libapt-models-model.js libapt-models-field.js libapt-main.js libapt-main-ajax.js
 * @ingroup     LIBAPT_MODELS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// ALL OK 23/01/2013

/**
 * @brief		Storage engine Test Unit
 * @return		boolean					true:success, false:failure
 */
function libapt_storage_proto_tu()
{
	var context = 'libapt_storage_proto_tu()';
	Libapt.trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
	
	
	Libapt.trace_step(context, 'ENGINE TO STRING WITH DEFAULT VALUES', APT_MODELS_STORAGE_TRACE);
	var engine1 = new LibaptStorageRemoteJson('json_users');
	var engine1_str = engine1.to_string();
	// console.log(engine1_str);
	
	Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	Libapt.trace_step(context, 'ENGINE TO STRING WITH CUSTOM VALUES', APT_MODELS_STORAGE_TRACE);
	engine1.is_sync					= true;
	engine1.is_cached				= false;
	engine1.url_read				= 'index.php?jsonAction=readMODEL_AUTH_USERS&';
	engine1.url_create				= 'index.php?jsonAction=createMODEL_AUTH_USERS&';
	engine1.url_update				= 'index.php?jsonAction=updateMODEL_AUTH_USERS&';
	engine1.url_delete				= 'index.php?jsonAction=deleteMODEL_AUTH_USERS&';
	engine1.http_method				= 'POST';
	engine1.http_timeout			= 5000; // milliseconds
	engine1.http_charset			= 'utf-8';
	engine1.http_format				= 'application/x-www-form-urlencoded';
	engine1.data_type				= 'json';
	engine1.data_name				= 'MODEL_AUTH_USERS_jsonData';
	engine1.ajax_last_result		= false;
	engine1.ajax_last_status		= '';
	engine1.ajax_last_datas			= null;
	engine1.ajax_last_finished		= false;
	// console.log( engine1.to_string() );
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST READ SYNC', APT_MODELS_STORAGE_TRACE);
	// var datas1 = engine1.read_sync();
	// Libapt.trace_var(context, 'datas1', datas1, APT_MODELS_STORAGE_TRACE);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST READ ASYNC', APT_MODELS_STORAGE_TRACE);
	ajax_success_callback = function(datas, textStatus, jqXHR)
		{
			// Libapt.trace_step(context, 'ajax_success_callback', APT_MODELS_STORAGE_TRACE);
			// Libapt.trace_var(context, 'engine1.ajax_last_datas', engine1.ajax_last_datas, APT_MODELS_STORAGE_TRACE);
		};
	engine1.read(ajax_success_callback);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST READ SYNC WITH FILTER', APT_MODELS_STORAGE_TRACE);
	// var filter1 = '&model_filters="field=login,type=String,op=equals,var1=application.login"';
	// var orders1 = '&model_orders="firsname=ASC|lastname=DESC"';
	// var datas2 = engine1.read_sync(filter1 + orders1);
	// Libapt.trace_var(context, 'datas2', datas2, APT_MODELS_STORAGE_TRACE);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST READ SYNC WITH ORDERS', APT_MODELS_STORAGE_TRACE);
	// var orders1 = '&model_orders="login=DESC"';
	// var datas3 = engine1.read_sync(orders1);
	// Libapt.trace_var(context, 'datas3', datas3, APT_MODELS_STORAGE_TRACE);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST INSERT ONE RECORD WITHOUT PASSWORD', APT_MODELS_STORAGE_TRACE);
	// var record1 = new Object();
	// record1.login		= 'test10';
	// record1.lastname	= 'TEST 10';
	// record1.firstname	= 'bill';
	// record1.email		= 'test10@demo.com';
	// engine1.create_records(record1);
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST INSERT ONE RECORD WITH PASSWORD', APT_MODELS_STORAGE_TRACE);
	// var record1 = new Object();
	// record1.login		= 'test11';
	// record1.lastname	= 'TEST 11';
	// record1.firstname	= 'bill 11';
	// record1.email		= 'test11@demo.com';
	// record1.password_oldhash	= '';
	// record1.password_new		= '';
	// record1.password_confirm	= '';
	// record1.password			= '418d89a45edadb8ce4da17e07f72536c';
	// engine1.create_records(record1);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST UPDATE ONE RECORD WITHOUT PASSWORD', APT_MODELS_STORAGE_TRACE);
	// var record2 = {'id_user':'5','login':'test1','lastname':'TEST 1 J. SMITHS','firstname':'John','email':'test1@demo.com'};
	// engine1.update_records(record2);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST DELETE ONE RECORD', APT_MODELS_STORAGE_TRACE);
	// var record3 = {'id_user':'22'};
	// engine1.delete_records(record3);
	
	
	// Libapt.trace_separator(APT_MODELS_STORAGE_TRACE);
	// Libapt.trace_step(context, 'TEST DELETE ONE RECORD', APT_MODELS_STORAGE_TRACE);
	// var record4 = {'id_user':'23'};
	// engine1.delete_records(record4);
	
	
	Libapt.trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
	return true;
}
