/**
 * @file        libapt-models-storage-taffy.js
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
 * @brief		Storage engine for local TAFFY database access
 * @param[in]	arg_name			name of the storage engine
 */
function LibaptStorageTaffy(arg_name)
{
	// CONSTRUCTOR BEGIN
	var context = 'LibaptStorageTaffy(' + arg_name + ')';
	trace_enter(context, 'constructor', APT_MODELS_STORAGE_TRACE);
	
	// INHERIT
	this.inheritFrom = LibaptStorage;
	this.inheritFrom(arg_name);
	
	// FIELD ATTRIBUTES
	this.class_name		= 'LibaptStorageTaffy';
	this.name			= arg_name;
	this.is_valid		= true;
	this.is_cached		= false;
	this.data_base		= TAFFY();
	
	// CONSTRUCTOR END
	trace_leave(context, 'constructor', APT_MODELS_STORAGE_TRACE);
	
	
	// PUBLIC METHOD : READ ALL EXISTING RECORDS
	this.read_all_records = function(arg_order_asc)
	{
		var context = this.class_name + '.read_all_records()';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var datas = this.data_base();
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return datas;
	}
	
	
	// PUBLIC METHOD : READ FILTERED EXISTING RECORDS
	this.read = function(arg_filters)
	{
		var context = this.class_name + '.read(arg_filters)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var datas = this.data_base(arg_filters);
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return datas;
	}
	
	
	// PUBLIC METHOD : READ FILTERED DISTINCT EXISTING FIELD VALUES
	this.read_distinct = function(arg_field_name, arg_filters)
	{
		var context = this.class_name + '.read_distinct(arg_field_name, arg_filters)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var datas = this.data_base(arg_filters).distinct(arg_field_name);
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return datas;
	}
	
	
	// PUBLIC METHOD : READ ALL DISTINCT EXISTING FIELD VALUES
	this.read_all_distinct = function(arg_field_name)
	{
		var context = this.class_name + '.read_all_distinct(arg_field_name)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var datas = this.data_base().distinct(arg_field_name);;
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return datas;
	}
	
	
	// PUBLIC METHOD : READ FILTERED EXISTING RECORDS (FORCE SYNC MODE)
	this.read_sync = function(arg_filters)
	{
		var context = this.class_name + '.read_sync(arg_filters)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		var datas = this.data_base(arg_filters);
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return datas;
	}
	
	
	// PUBLIC METHOD : INSERT A NEW RECORD
	this.create_records = function(arg_records)
	{
		var context = this.class_name + '.create_records(arg_records)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		this.data_base.insert(arg_records);
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return true;
	}
	
	
	// PUBLIC METHOD : UPDATE AN EXISTING RECORD
	this.update_records = function(arg_filters, arg_updates)
	{
		var context = this.class_name + '.update_records(arg_records)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		this.data_base(arg_filters).update(arg_updates);
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return true;
	}
	
	
	// PUBLIC METHOD : DELETE AN EXISTING RECORD
	this.delete_records = function(arg_records)
	{
		var context = this.class_name + '.delete_records(arg_records)';
		trace_enter(context, '', APT_MODELS_STORAGE_TRACE);
		
		this.data_base(arg_records).remove();
		
		trace_leave(context, '', APT_MODELS_STORAGE_TRACE);
		return true;
	}
}