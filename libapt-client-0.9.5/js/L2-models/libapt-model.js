/**
 * @file        libapt-model.js
 * @brief       Model class
 * @details     ...
 * @see			libapt-query.js libapt-field.js libapt-fieldsset.js libapt-order.js libapt-ordersset.js libapt-filter.js libapt-filtersset.js
 * @ingroup     LIBAPT_MODELS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @brief		Model definition
 * @param[in]	arg_name				name of the model (string)
 * @param[in]	arg_source				source of the model datas (string)
 * @param[in]	arg_fields				fields array of the model (array of LibaptField, or LibaptFieldsSet)
 * @param[in]	arg_access				boolean array of access permissions to the model datas (object)
 *  
 *  Model definition : object with
 *  	name : string
 *      source : string ('local' or 'json', see storage engines)
 *  	fields : assoc array of { 'model_name' : string, 'name' : string, 'source' : string, 'type' : string, 'default' : string, 'format' : string, 'label' : string, 'is_visible' : boolean, 'is_editable' : boolean, 'is_pk' : boolean }
 *  	access : { 'read' : boolean, 'create' : boolean, 'update' : boolean, 'delete' : boolean }
 *  	using_views : array of view object
 *  
 */
function LibaptModel(arg_name, arg_source, arg_fields, arg_access, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptModel';
	var context				= this.class_name + '(' + arg_name + ',' + arg_source + ',fields, access)';
	this.enter(context, 'constructor');
	
	
	// MODEL REQUIRED ATTRIBUTES
	this.name				= get_arg(arg_name, null);
	this.source				= null;
	this.fields_set			= null;
	this.pk_field			= null;
	this.access				= {'create':false,'read':false,'update':false,'delete':false};
	this.engine				= null;
	this.is_cached			= false;
	this.cache_ttl			= null;
	
	// MODEL OPTIONAL ATTRIBUTES
	this.using_views		= [];
	this.events_callbacks	= null;
	this.datas				= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'constructor');
	
	
	
	// ATTRIBUTES METHOD : ENABLE CACHE
	this.enable_cache = function()
	{
		this.is_cached			= true;
		this.engine.is_cached	= true;
		this.engine.cache_ttl	= this.cache_ttl;
	}
	
	
	// ATTRIBUTES METHOD : DISABLE CACHE
	this.disable_cache = function()
	{
		this.is_cached			= false;
		this.engine.is_cached	= false;
		this.engine.cache_ttl	= null;
	}
	
	
	// ATTRIBUTES METHOD : SET SOURCE
	this.set_source = function(arg_value)
	{
		if (arg_value == 'json')
		{
			// SET SOURCE
			this.source = 'json';
			
			// INIT ENGINE
			this.engine = new LibaptStorageRemoteJson('json_' + this.name);
			
			// AJAX REQUEST
			this.engine.is_sync					= false;
			this.engine.is_cached				= this.is_cached;
			this.engine.url_read				= 'index.php?jsonAction=read' + this.name + '&';
			this.engine.url_create				= 'index.php?jsonAction=create' + this.name + '&';
			this.engine.url_update				= 'index.php?jsonAction=update' + this.name + '&';
			this.engine.url_delete				= 'index.php?jsonAction=delete' + this.name + '&';
			this.engine.http_method				= 'POST';
			this.engine.http_timeout			= 10000; // milliseconds
			this.engine.http_charset			= 'utf-8';
			this.engine.http_format				= 'application/x-www-form-urlencoded';
			this.engine.data_type				= 'json';
			this.engine.data_name				= this.name + '_jsonData';
			// AJAX REQUEST CALLBACK
			this.engine.ajax_success_callback	= null;
			this.engine.ajax_error_callback		= null;
			// AJAX REQUEST STATUS
			this.engine.ajax_last_result		= false;
			this.engine.ajax_last_status		= '';
			this.engine.ajax_last_datas			= null;
			this.engine.ajax_last_finished		= false;
		}
		else if (arg_value == 'array')
		{
			this.source = 'array';
			this.engine = new LibaptStorageLocalArray('array_' + this.name, []);
		}
		else
		{
			this.engine = null;
			this.source = (arg_value == 'local') ? arg_value : null;
		}
	}
	
	
	// ATTRIBUTES METHOD : SET FIELDS
	this.set_fields = function(arg_value)
	{
		this.fields_set = null;
		if (typeof arg_value == 'object' && arg_value instanceof LibaptFieldsSet)
		{
			this.fields_set = arg_value;
		}
		else if ( Libapt.is_array(arg_fields) )
		{
			this.fields_set = new LibaptFieldsSet(this.name, arg_fields);
		}
		else
		{
			this.fields_set = new LibaptFieldsSet(this.name, []);
		}
	}
	
	
	// ATTRIBUTES METHOD : SET ACCESS
	this.set_access = function(arg_value)
	{
		// DEFAULT ACCESSES
		var default_access =  { 'create':false, 'read':true, 'update':false, 'delete':false };
		this.access = $.extend(default_access, arg_value);
	}
	
	
	
	// CONSTRUCTOR END
	this.set_fields(arg_fields);
	this.set_access(arg_access);
	this.set_source(arg_source);
	
	
	
	// CRUD METHODS : READ
	this.read = function(arg_query, arg_success_callback, arg_error_callback)
	{
		var context = 'read(query, ok_cb, ko_cb)';
		this.enter(context, '');
		
		// GET MODEL DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		var bool_result = this.engine.read(arg_query, arg_success_callback, arg_error_callback);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	this.read_sync = function(arg_query, arg_success_callback, arg_error_callback)
	{
		var context = 'read_sync(query, ok_cb, ko_cb)';
		this.enter(context, '');
		
		// GET MODEL DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		var datas_results = null;
		var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = this.engine.read_sync(arg_query, ok_cb, arg_error_callback);
		bool_result = bool_result && Libapt.is_array(datas_results);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	this.read_all_distinct = function(arg_fields, arg_orders, arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_all_distinct(query, ok_cb, ko_cb)';
		this.enter(context, '');
		
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_read_all_distinct');
		
		// SET ACTION
		query.set_select_distinct();
		
		// SET SLICE
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			query.set_slice(0, arg_max);
		}
		
		// SET ORDERS
		if ( Libapt.is_array(arg_orders) )
		{
			query.orders_set.add_orders(arg_orders);
		}
		
		// SET FIELDS
		if ( ! query.fields_set.add_fields(arg_fields, this) )
		{
			this.error(context, 'bad fields');
			return false;
		}
		
		// GET DATAS
		var bool_result = this.engine.read_sync(query, arg_success_callback, arg_error_callback);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	this.read_all_distinct_sync = function(arg_fields, arg_orders, arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_all_distinct_sync(fields,orders,max,ok_cb,ko_cb)';
		this.enter(context, '');
		
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_read_all_distinct_sync');
		
		// SET ACTION
		query.set_select_distinct();
		
		// SET SLICE
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			query.set_slice(0, arg_max);
		}
		
		// SET ORDERS
		if ( Libapt.is_array(arg_orders) )
		{
			query.orders_set.add_orders(arg_orders);
		}
		
		// SET FIELDS
		if ( ! query.fields_set.add_fields(arg_fields, this) )
		{
			this.error(context, 'bad fields');
			return false;
		}
		
		// GET DATAS
		var datas_results = null;
		var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = this.engine.read_sync(query, ok_cb, arg_error_callback);
		bool_result = bool_result && Libapt.is_array(datas_results);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	
	this.read_distinct_sync = function(arg_fields, arg_filters, arg_orders, arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_distinct_sync(fields,orders,max,ok_cb,ko_cb)';
		this.enter(context, '');
		
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_read_distinct_sync');
		
		// SET ACTION
		query.set_select_distinct();
		
		// SET SLICE
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			query.set_slice(0, arg_max);
		}
		
		// SET ORDERS
		if ( Libapt.is_array(arg_orders) )
		{
			query.orders_set.add_orders(arg_orders);
		}
		
		// SET FILTERS
		if ( Libapt.is_array(arg_filters) )
		{
			query.filters_set.add_filters(arg_filters);
		}
		
		// SET FIELDS
		if ( ! query.fields_set.add_fields(arg_fields, this) )
		{
			this.error(context, 'bad fields');
			return false;
		}
		
		// GET DATAS
		var datas_results = null;
		var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = this.engine.read_sync(query, ok_cb, arg_error_callback);
		bool_result = bool_result && Libapt.is_array(datas_results);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	
	this.read_distinct_one = function(arg_distinct_field, arg_query, arg_success_callback, arg_error_callback, arg_max)
	{
		var context = 'read_distinct_one(distinct_field,query, ok_cb, ko_cb)';
		this.enter(context, '');
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_read_all_distinct_sync');
		
		// INIT QUERY
		query.set_select_distinct_one();
		query.fields_set.add_field(arg_distinct_field, this);
		if (arg_query)
		{
			query.filters_set.add_filters(arg_query.filters_set.filters);
			query.orders_set.add_orders(arg_query.orders_set.orders);
			query.groups_set.add_groups(arg_query.groups_set.groups);
		}
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			query.set_slice(0, arg_max);
		}
		
		// GET MODEL DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		// var datas_results = null;
		// var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = this.engine.read(query, arg_success_callback, arg_error_callback);
		// bool_result = bool_result && Libapt.is_array(datas_results);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	this.read_distinct_one_sync = function(arg_distinct_field, arg_fields, arg_filters, arg_orders, arg_groups, arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_distinct_one_sync(fields,orders,max,ok_cb,ko_cb)';
		this.enter(context, '');
		
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_read_distinct_sync');
		
		// SET ACTION
		query.set_select_distinct_one();
		
		// SET SLICE
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			query.set_slice(0, arg_max);
		}
		
		// SET ORDERS
		if ( Libapt.is_array(arg_orders) )
		{
			query.orders_set.add_orders(arg_orders);
		}
		
		// SET FILTERS
		if ( Libapt.is_array(arg_filters) )
		{
			query.filters_set.add_filters(arg_filters);
		}
		
		// SET GROUPS
		if ( Libapt.is_array(arg_groups) )
		{
			query.groups_set.add_groups(arg_groups);
		}
		
		// SET FIELDS
		if ( ! query.set_one_field(arg_distinct_field) )
		{
			this.error(context, 'bad distinct field');
			return false;
		}
		if ( ! query.fields_set.add_fields(arg_fields, this) )
		{
			this.error(context, 'bad fields');
			return false;
		}
		
		// GET DATAS
		var datas_results = null;
		var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = this.engine.read_sync(query, ok_cb, arg_error_callback);
		bool_result = bool_result && Libapt.is_array(datas_results);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	
	this.read_all_fields_sync = function(arg_fields, arg_orders, arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_all_fields_sync(fields,orders,max,ok_cb,ko_cb)';
		this.enter(context, '');
		
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_read_all_fields_sync');
		this.assertNotNull(context, 'query', query);
		
		// SET ACTION
		query.set_select();
		
		// SET SLICE
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			query.set_slice(0, arg_max);
		}
		
		// SET ORDERS
		if ( Libapt.is_array(arg_orders) )
		{
			query.orders_set.add_orders(arg_orders);
		}
		
		// SET FIELDS
		if ( ! query.fields_set.add_fields(arg_fields, this) )
		{
			this.error(context, 'bad fields');
			return false;
		}
		
		// GET DATAS
		var datas_results = null;
		var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = this.engine.read_sync(query, ok_cb, arg_error_callback);
		bool_result = bool_result && Libapt.is_array(datas_results);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	
	// PUBLIC METHOD : READ ALL EXISTING RECORDS WITH A MAX RECORDS COUNT
	this.read_all_records = function(arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_all_records(max, ok_cb, ko_cb)';
		this.enter(context, '');
		
		// READ DATAS
		var bool_result = false;
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			// CREATE QUERY OBJECT
			var query = new LibaptQuery(this.name + '_read_all_records');
			
			// SET ACTION
			query.set_select();
			
			// SET SLICE
			query.set_slice(0, arg_max);
			
			// GET DATAS
			bool_result = this.engine.read(query, arg_success_callback, arg_error_callback);
		}
		else
		{
			bool_result = this.engine.read_all_records(arg_success_callback, arg_error_callback);
		}
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : READ ALL EXISTING RECORDS WITH A MAX RECORDS COUNT
	this.read_all_records_sync = function(arg_max, arg_success_callback, arg_error_callback)
	{
		var context = 'read_all_records_sync(max, ok_cb, ko_cb)';
		this.enter(context, '');
		
		
		// READ DATAS
		var datas_results = null;
		var ok_cb = Libapt.is_null(arg_success_callback) ? function(datas) { datas_results = datas; } : arg_success_callback;
		var bool_result = false;
		if ( Libapt.is_numeric(arg_max) && arg_max > 0 )
		{
			// CREATE QUERY OBJECT
			var query = new LibaptQuery(this.name + '_read_all_records_sync');
			
			// SET ACTION
			query.set_select();
			
			// SET SLICE
			query.set_slice(0, arg_max);
			
			// GET DATAS
			bool_result = this.engine.read_sync(query, ok_cb, arg_error_callback);
		}
		else
		{
			bool_result = this.engine.read_all_records_sync(ok_cb, arg_error_callback);
		}
		bool_result = bool_result && Libapt.is_array(datas_results);
		
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	
	// PUBLIC METHOD : READ AN EXISTING RECORD WITH THE PRIMARY KEY
	this.read_record_with_pk = function(arg_pk_value, arg_success_callback, arg_error_callback)
	{
		var context = 'read_record_with_pk(arg_pk_value, ok_cb, ko_cb)';
		this.enter(context, '');
		
		// CREATE QUERY OBJECT
		var query = this.get_pk_query(arg_pk_value);
		this.assertNotNull(context, 'query', query);
		query.set_select();
		
		// READ AND RETURNS DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		var bool_result = this.engine.read(query, arg_success_callback, arg_error_callback);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : READ AN EXISTING RECORD WITH THE FIELDS VALUES FILTERS
	this.read_records_with_values = function(arg_fields_values, arg_success_callback, arg_error_callback)
	{
		var context = 'read_records_with_values(arg_fields_values, ok_cb, ko_cb)';
		this.enter(context, '');
		
		
		// CREATE QUERY OBJECT
		var query = this.get_values_query(arg_fields_values);
		this.assertNotNull(context, 'query', query);
		query.set_select();
		
		// READ AND RETURNS DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		var bool_result = this.engine.read(query, arg_success_callback, arg_error_callback);
		
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	// PUBLIC METHOD : READ AN EXISTING RECORD WITH THE FIELDS VALUES FILTERS
	this.read_records_with_values_sync = function(arg_fields_values, arg_success_callback, arg_error_callback)
	{
		var context = 'read_records_with_values_sync(arg_fields_values, ok_cb, ko_cb)';
		this.enter(context, '');
		
		// CREATE QUERY OBJECT
		var query = this.get_values_query(arg_fields_values);
		this.assertNotNull(context, 'query', query);
		query.set_select();
		
		// READ DATAS
		var datas_results = null;
		var ok_cb = function(datas)
			{
				datas_results = datas;
				if ( ! Libapt.is_null(arg_success_callback) )
				{
					arg_success_callback(datas);
				}
			};
		
		// READ AND RETURNS DATAS IF SYNCHRONOUS OR BOOLEAN IF ASYNCHRONOUS
		var bool_result = this.engine.read_sync(query, ok_cb, arg_error_callback);
		bool_result = bool_result && Libapt.is_array(datas_results);

		this.leave_or_error(context, 'success', 'failure', bool_result);
		return datas_results;
	}
	
	
	// CREATE
	this.create_one_record = function(arg_record, arg_ok_cb, arg_ko_cb)
	{
		var context = 'create_one_record(record)';
		this.enter(context, '');
		
		this.value(context, 'record', arg_record);
		var bool_result = this.engine.create_records([arg_record], arg_ok_cb, arg_ko_cb);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	// UPDATE
	this.update_one_record = function(arg_record, arg_ok_cb, arg_ko_cb)
	{
		var context = 'update_one_record(record)';
		this.enter(context, '');
		
		// CHECK RECORD FIELDS
		for(field_name in arg_record)
		{
			if ( ! this.fields_set.has_field(field_name) )
			{
				var index = arg_record.indexOf(field_name);
				if (index >= 0)
				{
					arg_record.splice(index, 1);
				}
			}
		}
		
		this.value(context, 'record', arg_record);
		var bool_result = this.engine.update_records(arg_record, arg_ok_cb, arg_ko_cb);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	// DELETE
	this.delete_one_record = function(arg_record, arg_ok_cb, arg_ko_cb)
	{
		var context = 'delete_one_record(record)';
		this.enter(context, '');
		
		this.value(context, 'record', arg_record);
		var bool_result = this.engine.delete_records(arg_record, arg_ok_cb, arg_ko_cb);
		
		this.leave_or_error(context, 'success', 'failure', bool_result);
		return bool_result;
	}
	
	
	this.remove_with_pk = function(arg_pk_value)
	{
		var context = 'read_all_records(...)';
		this.enter(context, '');
		
		var result = true;
		
		this.leave(context, 'not implemented');
		return result;
	}
	
	
	
	
	// PUBLIC METHOD : CREATE A QUERY ON THE PRIMARY KEY
	this.get_pk_query = function(arg_pk_value)
	{
		var context = 'get_pk_query(arg_pk_value)';
		this.enter(context, '');
		
		
		// CHECK PRIMARY KEY VALUE
		this.assertNotNull(context, 'arg_pk_value', arg_pk_value);
		
		// GET PRIMARY KEY FIELD
		var pk_field = this.fields_set.get_pk_field();
		this.assertNotNull(context, 'pk_field', pk_field);
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_pk');
		
		// CREATE FILTER
		var pk_filter = new LibaptFilter(pk_field, pk_field.value_type, '', 'equals', arg_pk_value);
		
		// INIT QUERY
		if ( ! query.fields_set.add_fields(this.fields_set, this) )
		{
			this.error(context, 'bad fields');
			return null;
		}
		query.filters_set.add_filter(pk_filter);
		
		
		this.leave(context, 'success');
		return query;
	}
	
	
	// PUBLIC METHOD : CREATE A QUERY ON FIELDS VALUES
	this.get_values_query = function(arg_fields_values)
	{
		var context = 'get_values_query(arg_fields_values)';
		this.enter(context, '');
		
		// CHECK PRIMARY KEY VALUE
		this.assertNotEmptyObjectOrArray(context, 'arg_fields_values', arg_fields_values);
		
		// CREATE QUERY OBJECT
		var query = new LibaptQuery(this.name + '_values');
		
		// INIT QUERY
		if ( ! query.fields_set.add_fields(this.fields_set, this) )
		{
			this.error(context, 'bad fields');
			return false;
		}
		for(field_name in arg_fields_values)
		{
			var field_value = arg_fields_values[field_name];
			var field = this.fields_set.get_field(field_name);
			this.assertNotNull(context, 'field [' + field_name + ']', field);
			this.assertNotNull(context, 'field value [' + field_name + ']', field_value);
			
			if ( Libapt.is_array(field_value) )
			{
				this.step(context, 'field filter has many values');
				for(value_index in field_value)
				{
					var value = field_value[value_index];
					query.filters_set.replace_or_add_filter_field_value(this.fields_set, field_name, value, true);
				}
			}
			else
			{
				this.step(context, 'field filter has one value');
				query.filters_set.replace_or_add_filter_field_value(this.fields_set, field_name, field_value, true);
			}
		}
		
		this.leave(context, 'success');
		return query;
	}
	
	
	// ATTACH A VIEW
	
	// DETACH A VIEW
	
	
	// PUBLIC METHOD : TO STRING
	this.toString = function()
	{
		return 'source=' + this.source + ',name=' + this.name
			+ ',fields.length=' + this.fields.length
			+ ',\naccess.read=' + this.access.read + ',access.create=' + this.access['create']
			+ ',access.update=' + this.access.update + ',access.delete=' + this.access['delete']
			+ ',\nusing_views.length=' + this.using_views.length
			+ ',\nevents_callbacks.length=' + this.events_callbacks.length
			+ ',datas=' + this.datas;
	}
}

// Libapt.register_inheritance(LibaptModel, LibaptObject);




var LIBAPT_MODELS_MODEL_TRACE = false;

LibaptModel.create = function(arg_settings)
{
	var context = 'LibaptModel.create(arg_settings)';
	Libapt.trace_enter(context, '', LIBAPT_MODELS_MODEL_TRACE);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'source' : null,
			'name'   : null,
			'fields' : [],
			'access' : { 'create':false, 'read':false, 'update':false, 'delete':false },
			'using_views' : [],
			'events_callbacks' : [],
			'is_cached' : false,
			'cache_ttl' : null,
			'datas'  : null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend({}, default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_empty_str_or_null(ext_settings.source) )
	{
		Libapt.trace_error(context, 'model source definition is not valid', LIBAPT_MODELS_MODEL_TRACE);
		return null;
	}
	if ( Libapt.is_empty_str_or_null(ext_settings.name) )
	{
		Libapt.trace_error(context, 'model name definition is not valid', LIBAPT_MODELS_MODEL_TRACE);
		return null;
	}
	if ( ! Libapt.is_array(ext_settings.fields) || ext_settings.fields.length <= 0 )
	{
		Libapt.trace_error(context, 'model fields definition is not valid', LIBAPT_MODELS_MODEL_TRACE);
		return null;
	}
	if ( typeof ext_settings.access != 'object' || ext_settings.access.length < 1 )
	{
		Libapt.trace_error(context, 'model access definition is not valid', LIBAPT_MODELS_MODEL_TRACE);
		return null;
	}
	
	// CREATE FIELDS OBJECT
	var fields_obj = [];
	for(field_index in ext_settings.fields)
	{
		var field_item = ext_settings.fields[field_index];
		
		var field_obj = null;
		Libapt.trace_var(context, 'field_item', field_item, LIBAPT_MODELS_MODEL_TRACE);
		Libapt.trace_var(context, 'typeof field_item', typeof field_item, LIBAPT_MODELS_MODEL_TRACE);
		Libapt.trace_var(context, 'field_item instanceof LibaptField', field_item instanceof LibaptField, LIBAPT_MODELS_MODEL_TRACE);
		if (typeof field_item == 'object' && field_item instanceof LibaptField)
		{
			Libapt.trace_step(context, 'already a field object', LIBAPT_MODELS_MODEL_TRACE);
			field_obj = field_item;
		}
		else if (typeof field_item == 'object' && ! (field_item instanceof LibaptField) )
		{
			Libapt.trace_step(context, 'create field from settings', LIBAPT_MODELS_MODEL_TRACE);
			field_obj = LibaptField.create(field_item);
		}
		else
		{
			Libapt.trace_error(context, 'field is not an object or a set of settings', LIBAPT_MODELS_MODEL_TRACE);
			return null;
		}
		fields_obj.push(field_obj);
	}
	
	Libapt.trace_var(context, 'fields_obj', fields_obj, LIBAPT_MODELS_MODEL_TRACE);
	var model_obj = new LibaptModel(ext_settings.name, ext_settings.source, fields_obj, ext_settings.access);
	
	
	// IS CACHED OPTION
	if ( Libapt.is_string(ext_settings.is_cached) )
	{
		switch (ext_settings.is_cached)
		{
			case '1':
			case 'true':
			case 'True':
			case 'TRUE':
			case 'on':
			case 'ON':
			case 'On':
				ext_settings.is_cached = true;
				break;
		}
	}
	if ( Libapt.is_boolean(ext_settings.is_cached) )
	{
		if (ext_settings.is_cached)
		{
			model_obj.enable_cache();
		}
		else
		{
			model_obj.disable_cache();
		}
	}
	if ( Libapt.is_integer(ext_settings.cache_ttl) )
	{
		model_obj.cache_ttl = ext_settings.cache_ttl;
	}
	
	
	Libapt.trace_leave(context, '', LIBAPT_MODELS_MODEL_TRACE);
	return model_obj;
}



LibaptModel.register = function(arg_settings)
{
	var context = 'LibaptModel.register(arg_settings)';
	Libapt.trace_enter(context, '', LIBAPT_MODELS_MODEL_TRACE);
	
	
	// CREATE MODEL
	var model = LibaptModel.create(arg_settings);
	var obj = new LibaptObject('obj', false);
	obj.assertNotNull(context, 'model', model);
	
	// REGISTER MODEL
	LibaptModels.add(model);
	
	
	Libapt.trace_leave(context, '', LIBAPT_MODELS_MODEL_TRACE);
	return true;
}
