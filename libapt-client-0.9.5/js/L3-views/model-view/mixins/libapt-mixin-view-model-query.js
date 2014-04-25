/**
 * @file        libapt-mixin-view-model-query.js
 * @desc        Mixin of model view query operations
 * @see			libapt-model-view.js libapt-model.js libapt-query.js
 * @group       LIBAPT_VIEWS
 * @date        2013-07-24
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewModelQuery
 * @public
 * @desc				Mixin of view visible operations
 */
var LibaptMixinViewModelQuery =
{
	/**
	 * @memberof			LibaptMixinViewModelQuery
	 * @public
	 * @desc				Enable/disable trace for visible operations
	 */
	mixin_view_model_query_trace: false,
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelQuery
	 * @method				create_query(arg_settings)
	 * @desc				Create the query object
	 * @param {object}		arg_model
	 * @param {object}		arg_settings
	 * @return {object}		Query object
	 */
	create_query: function(arg_model, arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_query_trace);
		var context = 'create_query(model,settings)';
		self.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertNotNull(context, 'model', arg_model);
		self.assertNotNull(context, 'settings', arg_settings);
		
		// CREATE QUERY
		self.step(context, 'Init query option');
		var init_fields		= self.init_query_fields(arg_model, arg_settings);
		var init_filters	= self.init_query_filters(arg_model, arg_settings);
		var init_orders		= self.init_query_orders(arg_model, arg_settings);
		var init_groups		= self.init_query_groups(arg_model, arg_settings);
		var init_slice		= self.init_query_slice(arg_model, arg_settings);
		
		var query = new LibaptQuery(self.name + '_query', init_fields, init_filters, init_orders, init_groups, init_slice, arg_model);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return query;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelQuery
	 * @method				init_query_fields(arg_model, arg_settings)
	 * @desc				Init the query fields
	 * @param {object}		arg_model
	 * @param {object}		arg_settings
	 * @return {array}		LibaptField array
	 */
	init_query_fields: function(arg_model, arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_query_trace);
		var context = 'init_query_fields(model,settings)';
		self.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertNotNull(context, 'model', arg_model);
		self.assertNotNull(context, 'settings', arg_settings);
		
		// GET FIELDS
		var init_fields = null;
		if ( Libapt.is_array(arg_settings.query_fields) && arg_settings.query_fields.length > 0 )
		{
			init_fields = arg_settings.query_fields;
		}
		else
		{
			init_fields = arg_model.fields_set.fields;
		}

		
		self.leave(context, 'success');
		self.pop_trace();
		return init_fields;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelQuery
	 * @method				init_query_filters(arg_model, arg_settings)
	 * @desc				Init the query filters
	 * @param {object}		arg_model
	 * @param {object}		arg_settings
	 * @return {array}		LibaptFilter array
	 */
	init_query_filters: function(arg_model, arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_query_trace);
		var context = 'init_query_filters(model,settings)';
		self.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertNotNull(context, 'model', arg_model);
		self.assertNotNull(context, 'settings', arg_settings);
		
		// GET FILTERS
		var init_filters = [];
		if ( Libapt.is_string(arg_settings.query_filters) )
		{
			arg_settings.query_filters = arg_settings.query_filters.split('|');
		}
		if ( Libapt.is_array(arg_settings.query_filters) )
		{
			self.step(context, 'Init filters option');
			for(filter_index in arg_settings.query_filters)
			{
				var filter_value = arg_settings.query_filters[filter_index];
				var filter = null;
				if ( filter_value instanceof LibaptFilter )
				{
					filter = filter_value;
				}
				if ( Libapt.is_string(filter_value) )
				{
					filter = LibaptFilter.create_from_string(filter_value, arg_model);
				}
				else if ( Libapt.is_object(filter_value) )
				{
					filter = LibaptFilter.create(filter_value);
				}
				
				if (filter)
				{
					init_filters.push(filter);
				}
			}
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return init_filters;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelQuery
	 * @method				init_query_orders(arg_model, arg_settings)
	 * @desc				Init the query orders
	 * @param {object}		arg_model
	 * @param {object}		arg_settings
	 * @return {array}		LibaptOrder array
	 */
	init_query_orders: function(arg_model, arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_query_trace);
		var context = 'init_query_orders(model,settings)';
		self.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertNotNull(context, 'model', arg_model);
		self.assertNotNull(context, 'settings', arg_settings);
		
		// GET ORDERS
		var init_orders = [];
		if ( Libapt.is_string(arg_settings.query_orders) )
		{
			arg_settings.query_orders = arg_settings.query_orders.split('|');
		}
		if ( Libapt.is_array(arg_settings.query_orders) )
		{
			self.step(context, 'Init orders option');
			for(order_index in arg_settings.query_orders)
			{
				var order_value = arg_settings.query_orders[order_index];
				var order = null;
				if ( order_value instanceof LibaptOrder )
				{
					order = order_value;
				}
				if ( Libapt.is_string(order_value) )
				{
					order = LibaptOrder.create_from_string(order_value, arg_model);
				}
				else if ( Libapt.is_object(order_value) )
				{
					order = LibaptOrder.create(order_value);
				}
				
				if (order)
				{
					init_orders.push(order);
				}
			}
		}
		
		self.leave(context, 'success');
		self.pop_trace();
		return init_orders;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelQuery
	 * @method				init_query_groups(arg_model, arg_settings)
	 * @desc				Init the query groups
	 * @param {object}		arg_model
	 * @param {object}		arg_settings
	 * @return {array}		LibaptGroup array
	 */
	init_query_groups: function(arg_model, arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_query_trace);
		var context = 'init_query_groups(model,settings)';
		self.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertNotNull(context, 'model', arg_model);
		self.assertNotNull(context, 'settings', arg_settings);
		
		// GET GROUPS
		var init_groups = [];
		if ( Libapt.is_string(arg_settings.query_groups) )
		{
			arg_settings.query_groups = arg_settings.query_groups.split('|');
		}
		if ( Libapt.is_array(arg_settings.query_groups) )
		{
			self.step(context, 'Init groups option');
			for(group_index in arg_settings.query_groups)
			{
				var group_value = arg_settings.query_groups[group_index];
				var group = null;
				if ( group_value instanceof LibaptGroup )
				{
					group = group_value;
				}
				if ( Libapt.is_string(group_value) )
				{
					group = LibaptGroup.create_from_string(group_value, arg_model);
				}
				else if ( Libapt.is_object(group_value) )
				{
					group = LibaptGroup.create(group_value);
				}
				
				if (group)
				{
					init_groups.push(group);
				}
			}
		}

		
		self.leave(context, 'success');
		self.pop_trace();
		return init_groups;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewModelQuery
	 * @method				init_query_slice(arg_model, arg_settings)
	 * @desc				Init the query slice
	 * @param {object}		arg_model
	 * @param {object}		arg_settings
	 * @return {object}		Slice object {offset:xxx, length:xxx}
	 */
	init_query_slice: function(arg_model, arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_model_query_trace);
		var context = 'init_query_slice(model,settings)';
		self.enter(context, '');
		
		
		// CHECK ARGUMENTS
		self.assertNotNull(context, 'model', arg_model);
		self.assertNotNull(context, 'settings', arg_settings);
		
		// GET SLICE
		var init_slice = null;
		if ( Libapt.is_object(arg_settings.query_slice) )
		{
			self.step(context, 'Init slice option');
			var init_offset	= Libapt.to_integer(arg_settings.query_slice.offset);
			var init_length	= Libapt.to_integer(arg_settings.query_slice.length);
			
			init_slice = {offset:init_offset, length:init_length};
		}
		else if ( Libapt.is_integer(arg_settings.query_slice_offset) && Libapt.is_integer(arg_settings.query_slice_length) )
		{
			self.step(context, 'Init slice option');
			var init_offset	= Libapt.to_integer(arg_settings.query_slice_offset);
			var init_length	= Libapt.to_integer(arg_settings.query_slice_length);
			
			init_slice = {offset:init_offset, length:init_length};
		}

		
		self.leave(context, 'success');
		self.pop_trace();
		return init_slice;
	}
};
