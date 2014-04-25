/**
 * @file        libapt-models-storage-array.js
 * @desc        Storage engines for models on client side
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-08-19
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

 
 
/**
 * @public
 * @class				LibaptStorageLocalArray
 * @desc				Storage engine for local array access
 * @param {string}		arg_name			name of the storage engine
 * @param {string}		arg_url_read		URL to read datas
 * @param {string}		arg_url_create		URL to create datas
 * @param {string}		arg_url_update		URL to update datas
 * @param {string}		arg_url_delete		URL to delete datas
 * @return {nothing}	
 */
function LibaptStorageLocalArray(arg_name, arg_datas_array)
{
	var self = this;
	
	// INHERIT
	this.inheritFrom = LibaptStorage;
	this.inheritFrom(arg_name);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	var context			= 'LibaptStorageLocalArray(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// STORAGE ENGINE ATTRIBUTES
	this.class_name		= 'LibaptStorageLocalArray';
	this.name			= arg_name;
	this.is_valid		= true;
	this.is_sync		= true;
	this.is_cached		= true;
	this.datas_array	= Libapt.is_array(arg_datas_array) ? arg_datas_array : [];
	
	this.is_flat_array			= false;
	this.flat_array_field_name	= null;
	this.get_records_cb			= null;
	
	
	// CONSTRUCTOR END
	self.leave(context, 'constructor');
	
	
	
	/**
	 * @public
	 * @method				set_datas_array(arg_datas_array)
	 * @desc				Set engine datas array
	 * @param {array}		arg_datas_array
	 * @return {object}		This
	 */
	this.set_datas_array = function(arg_datas_array)
	{
		var self = this;
		var context = 'set_datas_array(arg_datas_array)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		if ( ! Libapt.is_array(arg_datas_array) && ! Libapt.is_callback( self.get_records_cb ))
		{
			self.error(context, 'arg_datas_array is not an array');
			return self;
		}
		
		// SET DATAS
		self.datas_array = arg_datas_array;
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	
	/**
	 * @public
	 * @method					read_all_records(arg_success_callback, arg_error_callback)
	 * @desc					Read asynchronously all available datas records and execute a callback on success or on failure
	 * @param {function|array}	arg_success_callback	Callback on success
	 * @param {function|array}	arg_error_callback		Callback on failure
	 * @return {boolean}		true:success,false:failure
	 */
	this.read_all_records = function(arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'read_all_records(ok_cb,ko_cb)';
		self.enter(context, '');
		
		
		// SUCCESS
		var datas_records = self.datas_array;
		
		if (self.is_flat_array && Libapt.is_string(self.flat_array_field_name))
		{
			datas_records = [];
			// GET RECORDS FROM FLAT ARRAY
			for(var index = 0 ; index < self.datas_array.length ; index++)
			{
				var record = {};
				record[self.flat_array_field_name] = self.datas_array[index];
				datas_records.push(record);
			}
		}
		else if ( Libapt.is_callback( self.get_records_cb ) )
		{
			// GET RECORDS FROM FLAT ARRAY
			datas_records = self.do_callback(self.get_records_cb, [self.datas_array]);
		}
		// console.log(datas_records);
		
		if ( Libapt.is_array(datas_records) )
		{
			// EXECUTE SUCCESS CALLBACK
			self.do_callback(arg_success_callback, [datas_records]);
			
			self.leave(context, 'success');
			return true;
		}
		
		// EXECUTE FAILURE CALLBACK
		self.do_callback(arg_error_callback);
		
		
		self.leave(context, 'failure');
		return false;
	}
	
	
	
	/**
	 * @public
	 * @method					read_all_records_sync(arg_success_callback, arg_error_callback)
	 * @desc					Read synchronously all available datas records and execute a callback on success or on failure
	 * @param {function|array}	arg_success_callback	Callback on success
	 * @param {function|array}	arg_error_callback		Callback on failure
	 * @return {boolean}		true:success,false:failure
	 */
	this.read_all_records_sync = function(arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'read_all_records_sync(ok_cb,ko_cb)';
		self.enter(context, '');
		
		
		var bool_result = self.read_all_records(arg_success_callback, arg_error_callback);
		
		
		self.leave(context, bool_result ? 'success' : 'failure');
		return bool_result;
	}
	
	
	/**
	 * @public
	 * @method					read(arg_query, arg_success_callback, arg_error_callback)
	 * @desc					Read asynchronously all filtered datas records and execute a callback on success or on failure
	 * @param {object}			arg_query				LibaptQuery object
	 * @param {function|array}	arg_success_callback	Callback on success
	 * @param {function|array}	arg_error_callback		Callback on failure
	 * @return {boolean}		true:success,false:failure
	 */
	this.read = function(arg_query, arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'read(query,ok_cb,ko_cb)';
		self.enter(context, '');
		
		
		var bool_result = self.read_all_records(arg_success_callback, arg_error_callback);
		
		
		self.leave(context, bool_result ? 'success' : 'failure');
		return bool_result;
	}
	
	
	/**
	 * @public
	 * @method					read(arg_query, arg_success_callback, arg_error_callback)
	 * @desc					Read synchronously all filtered datas records and execute a callback on success or on failure
	 * @param {object}			arg_query				LibaptQuery object
	 * @param {function|array}	arg_success_callback	Callback on success
	 * @param {function|array}	arg_error_callback		Callback on failure
	 * @return {boolean}		true:success,false:failure
	 */
	this.read_sync = function(arg_query, arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'read_sync(query,ok_cb,ko_cb)';
		self.enter(context, '');
		
		
		var bool_result = self.read_all_records(arg_success_callback, arg_error_callback);
		
		
		self.leave(context, bool_result ? 'success' : 'failure');
		return bool_result;
	}
	
	
	// PUBLIC METHOD : INSERT A NEW RECORD
	this.create_records = function(arg_records, arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'create_records(records,ok_cb,ko_cb)';
		self.enter(context, '');
		
		var bool_result = false;
		
		self.leave(context, bool_result ? 'success' : 'failure');
		return bool_result;
	}
	
	
	// PUBLIC METHOD : UPDATE AN EXISTING RECORD
	this.update_records = function(arg_records, arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'update_records(records,ok_cb,ko_cb)';
		self.enter(context, '');
		
		var bool_result = false;
		
		self.leave(context, bool_result ? 'success' : 'failure');
		return bool_result;
	}
	
	
	// PUBLIC METHOD : DELETE AN EXISTING RECORD
	this.delete_records = function(arg_records, arg_success_callback, arg_error_callback)
	{
		var self = this;
		var context = 'delete_records(records,ok_cb,ko_cb)';
		self.enter(context, '');
		
		var bool_result = false;
		
		self.leave(context, bool_result ? 'success' : 'failure');
		return bool_result;
	}
}
