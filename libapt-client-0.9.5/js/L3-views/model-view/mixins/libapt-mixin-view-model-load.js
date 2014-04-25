/**
 * @file        libapt-mixin-view-model-load.js
 * @desc        Mixin of model view load operations
 * @see			libapt-model-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-07-21
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewModelLoad
 * @public
 * @desc				Mixin of view visible operations
 */
var LibaptMixinViewModelLoad =
{
	/**
	 * @memberof			LibaptMixinViewModelLoad
	 * @public
	 * @desc				Enable/disable trace for visible operations
	 */
	mixin_view_model_load_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewModelLoad
	 * @public
	 * @desc				Loaded datas records
	 */
	mixin_view_model_load_records: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewModelLoad
	 * @public
	 * @desc				Load strategy object
	 *							mode: 'all', 'pages', 'range', 'parts' (strategy name)
	 *							max_count:    integer  (for every strategy : max records count to load for each request)
	 *							pages_before: integer  ('pages' strategy: pages count to load before the pager current page)
	 *							pages_after:  integer  ('pages' strategy: pages count to load after the pager current page)
	 *							range_offset: integer  ('range' strategy: first record index)
	 *							range_length: integer  ('range' strategy: records count)
	 *							parts_count:  integer  ('parts' strategy: loading parts count)
	 *							parts_cb:     callback ('parts' strategy: code to call on each loaded part)
	 */
	mixin_view_model_load_strategy: { mode:'all', max_count:10000 },
	
	
	
	/**
	 * @memberof			LibaptMixinViewModelLoad
	 * @public
	 * @desc				Loaded datas offset of the first record
	 */
	mixin_view_model_load_absolute_offset: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewModelLoad
	 * @public
	 * @desc				Loaded datas count of records
	 */
	mixin_view_model_load_absolute_length: null,
	
	
	/**
	 * @memberof			LibaptMixinViewModelLoad
	 * @public
	 * @desc				Real datas count of records
	 */
	mixin_view_model_load_real_length: null,
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinViewModelLoad
	 * @method					get_datas()
	 * @desc					Get the datas records
	 * @param {integer|null}	arg_offset	relative offset
	 * @param {integer|null}	arg_length	relative length
	 * @return {array}			Records datas
	 */
	get_datas: function(arg_offset, arg_length)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_load_trace);
		var context = 'get_datas(offset,length)';
		self.enter(context, '');
		
		if (self.mixin_view_model_load_records)
		{
			self.value(context, 'self.mixin_view_model_load_records.length', self.mixin_view_model_load_records.length);
		}
		else
		{
			self.value(context, 'self.mixin_view_model_load_records.length', 0);
		}
		self.value(context, 'given offset', arg_offset);
		self.value(context, 'given length', arg_length);
		self.value(context, 'absolute offset', self.mixin_view_model_load_absolute_offset);
		self.value(context, 'absolute length', self.mixin_view_model_load_absolute_length);
		
		
		// NO GIVEN RANGE
		if ( ! Libapt.are_number( [arg_offset, arg_length] ) )
		{
			// DATAS ARE ALREADY LOADED
			if ( Libapt.is_array(self.mixin_view_model_load_records) )
			{
				self.value(context, 'records count', self.mixin_view_model_load_records.length);
				
				self.leave(context, 'success (no given range, datas are already loaded)');
				self.pop_trace();
				return self.mixin_view_model_load_records;
			}
			
			// DATAS ARE NOT LOADED
			self.leave(context, 'no loaded datas');
			self.pop_trace();
			return null;
		}
		
		
		// A GIVEN RANGE EXISTS
		if ( Libapt.are_number( [arg_offset, arg_length] ) )
		{
			// GIVEN RANGE IS OUT OF LOADED DATAS RANGE
			var bool_out_range = (arg_offset + arg_length) > (self.mixin_view_model_load_absolute_offset + self.mixin_view_model_load_absolute_length);
			bool_out_range = bool_out_range || arg_offset < self.mixin_view_model_load_absolute_offset;
			if (bool_out_range)
			{
				self.leave(context, 'given range is out of loaded datas range');
				self.pop_trace();
				return null;
			}
			
			// GIVEN RANGE IS EQUAL TO LOADED DATAS RANGE
			if (arg_offset == self.mixin_view_model_load_absolute_offset && arg_length == self.mixin_view_model_load_absolute_length)
			{
				if ( Libapt.is_array(self.mixin_view_model_load_records) )
				{
					self.value(context, 'records count', self.mixin_view_model_load_records.length);
					
					self.leave(context, 'success (given range is loaded range, datas are already loaded)');
					self.pop_trace();
					return self.mixin_view_model_load_records;
				}
				
				// DATAS ARE NOT LOADED
				self.leave(context, 'no loaded datas');
				self.pop_trace();
				return null;
			}
			
			if ( Libapt.is_array(self.mixin_view_model_load_records) )
			{
				// GIVEN RANGE IS INTO LOADED DATAS RANGE
				var relative_offset	= arg_offset - self.mixin_view_model_load_absolute_offset;
				var records			= self.mixin_view_model_load_records.slice(relative_offset, relative_offset + arg_length);
				self.value(context, 'records count', records.length);
				
				self.leave(context, 'success (given range is into loaded range, datas are already loaded)');
				self.pop_trace();
				return records;
			}
			
			// DATAS ARE NOT LOADED
			self.leave(context, 'no loaded datas');
			self.pop_trace();
			return null;
		}
		
		
		self.leave(context, 'failure');
		self.pop_trace();
		return null;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelLoad
	 * @method				get_current_page_datas()
	 * @desc				Get the datas records of the pager currennt page
	 * @param {object}		arg_pager		LibaptPager object
	 * @return {array}		Records datas
	 */
	get_current_page_datas: function(arg_pager)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_load_trace);
		var context = 'get_current_page_datas(pager)';
		self.enter(context, '');
		
		
		// CHECK PAGER
		self.assertNotNull(context, 'pager', arg_pager);
		
		// GET PAGE ABSOLUTE OFFSET
		var current_page_slice = arg_pager.get_page_slice(arg_pager.current_page);
		self.value(context, 'current_page_slice', current_page_slice);
		
		var absolute_length = current_page_slice.offset + current_page_slice.length;
		self.value(context, 'absolute_length', absolute_length);
		self.value(context, 'load_absolute_length', self.mixin_view_model_load_absolute_length);
		
		if (absolute_length > self.mixin_view_model_load_absolute_length)
		{
			if (absolute_length - self.mixin_view_model_load_absolute_length < arg_pager.current_pages_size)
			{
				current_page_slice.length = self.mixin_view_model_load_absolute_length - current_page_slice.offset;
			}
			self.value(context, 'current_page_slice', current_page_slice);
		}
		
		// GET RECORDS
		var records = self.get_datas(current_page_slice.offset, current_page_slice.length);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return records;
	},
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelLoad
	 * @method				has_datas()
	 * @desc				Has loaded datas
	 * @return {boolean}
	 */
	has_datas: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_load_trace);
		var context = 'is_visible()';
		self.enter(context, '');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return Libapt.is_array( self.mixin_view_model_load_records );
	},
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelLoad
	 * @method				free_datas()
	 * @desc				Free loaded datas
	 * @return {object}		This
	 */
	free_datas: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_load_trace);
		var context = 'free_datas()';
		self.enter(context, '');
		
		
		self.mixin_view_model_load_records = null;
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelLoad
	 * @method				load_datas()
	 * @desc				Load datas records
	 * @return {object}		this
	 */
	load_datas: function(arg_model, arg_query, arg_pager, arg_load_offset, arg_load_length, arg_ok_cb, arg_ko_cb, arg_update_pager)
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_model_load_trace);
		var context = 'load_datas(model,query,pager,offset,length)';
		self.enter(context, '');
		
		
		// CHECK SELF
		self.assertTrue(context, 'is_model_view', self.is_model_view);
		self.assertNotNull(context, 'model', self.model);
		
		// CHECK ARGS
		arg_update_pager = Libapt.to_boolean(arg_update_pager, true);
		
		// FIRE EVENT
		self.fire_event('load-datas-begin');
		
		// SHOW LOADER
		if ( Libapt.is_function(self.enable_loader) )
		{
			self.step(context, 'enable loader');
			self.enable_loader();
		}
		
		// UPDATE INDEXES
		self.mixin_view_model_load_absolute_offset	= -1;
		self.mixin_view_model_load_absolute_length	= -1;
		var slice = arg_query.get_slice();
		if ( Libapt.is_object(slice) )
		{
			self.mixin_view_model_load_absolute_offset	= slice.offset;
			self.mixin_view_model_load_absolute_length	= slice.length;
		}
		
		// PREPARE QUERY
		var load_query = arg_query;
		var load_query_is_a_clone = false;
		
		// LOAD STRATEGY
		self.mixin_view_model_load_strategy.max_count	= Libapt.to_number(self.mixin_view_model_load_strategy.max_count, 10000);
		self.mixin_view_model_load_strategy.mode		= Libapt.to_string(self.mixin_view_model_load_strategy.mode, 'all');
		self.value(context, 'strategy', self.mixin_view_model_load_strategy);
		self.value(context, 'max_count', self.mixin_view_model_load_strategy.max_count);
		self.value(context, 'mode', self.mixin_view_model_load_strategy.mode);
		switch(self.mixin_view_model_load_strategy.mode)
		{
			case 'all':
				break;
				
			case 'pages':
				self.mixin_view_model_load_strategy.pages_before	= Libapt.to_number(self.mixin_view_model_load_strategy.pages_before, 0);
				self.mixin_view_model_load_strategy.pages_after		= Libapt.to_number(self.mixin_view_model_load_strategy.pages_after, 0);
				if ( ! Libapt.is_null(arg_pager) )
				{
					// LOAD CURRENT PAGE ONLY
					if (self.mixin_view_model_load_strategy.pages_before == 0 && self.mixin_view_model_load_strategy.pages_after == 0)
					{
						// GET PAGE ABSOLUTE SLICE
						var current_page_slice = arg_pager.get_page_slice(arg_pager.current_page);
						current_page_slice.offset += arg_query.get_slice().offset;
						self.value(context, 'current_page_slice', current_page_slice);
						
						self.mixin_view_model_load_absolute_offset = current_page_slice.offset;
						self.mixin_view_model_load_absolute_length = current_page_slice.length;
						
						// CLONE AND UPDATE QUERY
						load_query				= self.clone_object(arg_query);
						load_query_is_a_clone	= true;
						load_query.slice		= current_page_slice;
					}
					else
					{
						// CHECK PAGES COUNT BEFORE CURRENT PAGE
						if (arg_pager.items_count > 0 && arg_pager.current_page - self.mixin_view_model_load_strategy.pages_before < 0)
						{
							self.mixin_view_model_load_strategy.pages_before = arg_pager.current_page;
						}
						
						// CHECK PAGES COUNT AFTER CURRENT PAGE
						if (arg_pager.items_count > 0 && arg_pager.current_page + self.mixin_view_model_load_strategy.pages_after > arg_pager.last_page)
						{
							self.mixin_view_model_load_strategy.pages_after = arg_pager.last_page - arg_pager.current_page;
						}
						self.value(context, 'last_page', arg_pager.last_page);
						self.value(context, 'current_page', arg_pager.current_page);
						
						// PAGES COUNT TO LOAD
						var pages_count			= self.mixin_view_model_load_strategy.pages_before + 1 + self.mixin_view_model_load_strategy.pages_after;
						
						// GET PAGES RANGE ABSOLUTE SLICE
						var first_page_index	= arg_pager.items_count == 0 ? 0 : (arg_pager.current_page - self.mixin_view_model_load_strategy.pages_before);
						var last_page_index		= arg_pager.items_count == 0 ? 0 : (arg_pager.current_page + self.mixin_view_model_load_strategy.pages_after);
						var range_slice			= arg_pager.get_range_slice(first_page_index, last_page_index);
						range_slice.offset += arg_query.get_slice().offset;
						self.value(context, 'first_page_index', first_page_index);
						self.value(context, 'last_page_index', last_page_index);
						self.value(context, 'range_slice', range_slice);
						
						self.mixin_view_model_load_absolute_offset = range_slice.offset;
						self.mixin_view_model_load_absolute_length = range_slice.length;
						
						// CLONE AND UPDATE QUERY
						load_query				= self.clone_object(arg_query);
						load_query_is_a_clone	= true;
						load_query.slice		= range_slice;
					}
				}
				break;
				
		/*	case 'range':
				self.mixin_view_model_load_strategy.range_offset	= Libapt.to_number(self.mixin_view_model_load_strategy.range_offset, 0);
				self.mixin_view_model_load_strategy.range_length	= Libapt.to_number(self.mixin_view_model_load_strategy.range_length, 10);
				self.mixin_view_model_load_strategy.range_offset	+= arg_query.get_slice().offset;
				
				self.mixin_view_model_load_absolute_offset = self.mixin_view_model_load_strategy.range_offset;
				self.mixin_view_model_load_absolute_length = self.mixin_view_model_load_strategy.range_length;
				
				// CLONE AND UPDATE QUERY
				load_query				= self.clone_object(arg_query);
				load_query_is_a_clone	= true;
				load_query.slice.offset	= self.mixin_view_model_load_strategy.range_offset;
				load_query.slice.length	= self.mixin_view_model_load_strategy.range_length;
				break;*/
				
			case 'parts':
				self.mixin_view_model_load_strategy.parts_count		= Libapt.to_number(self.mixin_view_model_load_strategy.parts_count, 10);
				self.mixin_view_model_load_strategy.parts_cb		= Libapt.to_number(self.mixin_view_model_load_strategy.parts_cb, 0);
				// TODO
				break;
		}
		
		// CHECK MAX COUNT
		if (load_query.slice.length > self.mixin_view_model_load_strategy.max_count)
		{
			if ( ! load_query_is_a_clone)
			{
				load_query = self.clone_object(arg_query);
			}
			load_query.slice.length = self.mixin_view_model_load_strategy.max_count;
			self.mixin_view_model_load_absolute_length = self.mixin_view_model_load_strategy.max_count;
		}
		
		
		// DISABLE TOOLBAR REFRESH ACTION
		self.step(context, 'disble refresh action');
		if ( Libapt.is_object(self.edit_toolbar) )
		{
			self.edit_toolbar.disable_action('refresh');
		}
		
		// DEFINE SUCCESS CALLBACK
		var ok_cb = function(datas)
			{
				self.enter(context, 'OK CALLBACK');
				var ok_cb_result = true;
				
				
				// STORE DATAS
				self.mixin_view_model_load_records = datas;
				
				// UDPATE COUNT
				self.mixin_view_model_load_real_length = arg_query.slice.length;
				if (self.mixin_view_model_load_strategy.mode == 'all')
				{
					self.mixin_view_model_load_real_length = datas.length;
				}
				
				// UPDATE PAGER
				if (arg_pager && arg_update_pager)
				{
					self.step(context, 'OK CALLBACK update pager');
					if (self.mixin_view_model_load_strategy.mode == 'all')
					{
						// UPDATE PAGER
						arg_pager.update_items_count(self.mixin_view_model_load_real_length);
						
						// UPDATE PAGES BUTTON LABEL
						var action_pages	= self.pager_toolbar.get_action('pager_pages');
						if (action_pages)
						{
							action_pages.update_button_label();
						}
					}
					else
					{
						// READ REAL DATAS COUNT
						self.step(context, 'read real datas count');
						if (self.mixin_view_model_load_strategy.mode != 'all')
						{
							self.load_datas_count(arg_model, arg_query, arg_pager);
						}
					}
				}
				
		
				
				// ENABLE TOOLBAR REFRESH ACTION
				if ( Libapt.is_object(self.edit_toolbar) )
				{
					self.edit_toolbar.enable_action('refresh');
				}
				
				// OK CALLBACK
				if ( Libapt.is_function(arg_ok_cb) || Libapt.is_array(arg_ok_cb) )
				{
					self.step(context, 'OK CALLBACK arg ok callback');
					if (arg_pager)
					{
						datas = self.get_current_page_datas(arg_pager);
					}
					
					ok_cb_result = self.do_callback(arg_ok_cb, [datas]);
				}
				
				// HIDE LOADER
				if ( Libapt.is_function(self.disable_loader) )
				{
					self.step(context, 'OK CALLBACK disable loader');
					self.disable_loader();
				}
				
				// FIRE EVENT
				self.fire_event('load-datas-success', self.mixin_view_model_load_records);
				
				
				self.leave(context, 'OK CALLBACK');
				return ok_cb_result;
			};
		
		// DEFINE FAILURE CALLBACK
		var ko_cb = function()
			{
				self.enter(context, 'KO CALLBACK');
				
				
				// ENABLE TOOLBAR REFRESH ACTION
				if ( Libapt.is_object(self.edit_toolbar) )
				{
					self.edit_toolbar.enable_action('refresh');
				}
				
				// KO CALLBACK
				if ( Libapt.is_function(arg_ko_cb) || Libapt.is_array(arg_ko_cb) )
				{
					self.step(context, 'KO CALLBACK arg ok callback');
					self.do_callback(arg_ko_cb);
				}
				
				// HIDE LOADER
				if ( Libapt.is_function(self.disable_loader) )
				{
					self.step(context, 'KO CALLBACK disable loader');
					self.disable_loader();
				}
				
				// FIRE EVENT
				self.fire_event('load-datas-failure');
				
				
				self.leave(context, 'KO CALLBACK');
				return false;
			};
		
		// READ DATAS
		self.step(context, 'read datas');
		var bool_result = arg_model.read(load_query, ok_cb, ko_cb);
		self.assert(context, 'read', bool_result);
		
		// FIRE EVENT
		this.fire_event('load-datas-end');
		
		
		self.leave(context, '');
		self.pop_trace();
		return this;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelLoad
	 * @method				load_datas_count()
	 * @desc				Load datas records count
	 * @return {object}		this
	 */
	load_datas_count: function(arg_model, arg_query, arg_pager)
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_model_load_trace);
		var context = 'load_datas_count(model,query,pager)';
		self.enter(context, '');
		
		
		// CHECK SELF
		self.assertTrue(context, 'is_model_view', self.is_model_view);
		self.assertNotNull(context, 'model', self.model);
		
		var ok_cb = function(datas)
			{
				self.assertNotNull(context, 'datas.count', datas.count);
				
				var items_count = parseInt(datas.count);
				self.assertTrue(context, 'items_count', items_count != NaN);
				
				self.mixin_view_model_load_real_length = items_count;
				self.value(context, 'items_count', items_count);
				
				if (arg_pager)
				{
					self.step(context, 'OK CALLBACK update pager');
					
					// UPDATE PAGER
					arg_pager.update_items_count(items_count);
					
					// UPDATE PAGES BUTTON LABEL
					var action_pages	= self.pager_toolbar.get_action('pager_pages');
					if (action_pages)
					{
						action_pages.update_button_label();
					}
				}
			};
		var count_query = self.clone_object(arg_query);
		count_query.set_select_count();
		var bool_result = arg_model.read(count_query, ok_cb, null);
		self.assert(context, 'read datas count', bool_result);
		
		
		self.leave(context, '');
		self.pop_trace();
		return this;
	}
};
