/**
 * @file        libapt-ordersset.js
 * @brief       Orders set class
 * @details     
 * @see			libapt-order.js
 * @ingroup     LIBAPT_CORE
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Orders set class
 * @param[in]	arg_name			name of the object
 * @param[in]	arg_orders			orders array
 */
function LibaptOrdersSet(arg_name, arg_orders)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptOrdersSet';
	var context			= '(' + arg_name + ',arg_orders)';
	this.enter(context, 'constructor');
	
	
	// ORDERS SET ATTRIBUTES
	this.orders		= get_arg(arg_orders, []);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// PUBLIC METHOD : GET A FIELD
	this.get_orders_for_field = function(arg_field_name)
	{
		var context = 'get_orders_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var field_orders = [];
		for(order_index in this.orders)
		{
			var order = this.orders[order_index];
			if (order.field.name == arg_field_name)
			{
				field_orders.push(order);
			}
		}
		
		this.leave(context, 'orders found:' + field_orders.length);
		return field_orders;
	}
	
	
	// PUBLIC METHOD : HAS A FIELD
	this.has_order_for_field = function(arg_field_name, arg_mode)
	{
		var context = 'has_order_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		for(order_index in this.orders)
		{
			var order = this.orders[order_index];
			if (order.field.name == arg_field_name)
			{
				
				if ( Libapt.is_null(arg_mode) )
				{
					this.leave(context, 'found (no mode)');
					return true;
				}
				if (arg_mode != order.mode)
				{
					continue;
				}
				this.leave(context, 'found');
				return true;
			}
		}
		
		this.leave(context, 'not found');
		return false;
	}
	
	
	// PUBLIC METHOD : GET URL STRING
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		var url_str = '';
		for(order_index in this.orders)
		{
			var order = this.orders[order_index];
			url_str += order.get_url_string() + '|';
		}
		
		this.leave(context, '');
		return url_str;
	}
	
	
	// ORDERS METHOD - ADD
	this.add_order = function(arg_order)
	{
		var context = 'add_order(' + arg_order + ')';
		this.enter(context, '');
		
		if ( ! arg_order instanceof LibaptOrder )
		{
			this.error(context, 'order is not a LibaptOrder');
			return this;
		}
		if ( ! arg_order.field instanceof LibaptField )
		{
			this.error(context, 'order.field is not a LibaptField');
			return this;
		}
		
		this.orders.push(arg_order);
		
		this.leave(context, '');
		return this;
	}
	
	// ORDERS METHOD - ADD MANY
	this.add_orders = function(arg_orders)
	{
		var context = 'add_order(' + arg_orders.length + ')';
		this.enter(context, '');
		
		if ( ! Libapt.is_array(arg_orders) )
		{
			arg_orders = [arg_orders];
		}
		
		for(key in arg_orders)
		{
			var order = arg_orders[key];
			if ( ! Libapt.is_null(order) )
			{
				if ( ! order instanceof LibaptOrder )
				{
					this.error(context, 'order is not a LibaptOrder');
					return this;
				}
				if ( ! order.field instanceof LibaptField )
				{
					this.error(context, 'order.field is not a LibaptField');
					return this;
				}
				this.orders.push(order);
			}
		}
		
		this.leave(context, '');
		return this;
	}
	
	// ORDERS METHOD - REPLACE AND ADD ORDER ON A FIELD
	this.replace_or_add_order = function(arg_field_obj, arg_mode_str)
	{
		var context = 'replace_or_add_order(field,mode)';
		this.enter(context, '');
		
		this.remove_orders_for_field(arg_field_obj.name);
		order = new LibaptOrder(arg_field_obj, arg_mode_str);
		this.orders.push(order);
		
		this.leave(context, '');
		return this;
	}
	
	// ORDERS METHOD - REMOVE
	this.remove_order = function(arg_order)
	{
		var context = 'remove_order(' + arg_order + ')';
		this.enter(context, '');
		
		var index = this.orders.lastIndexOf(arg_order);
		if (index >= 0)
		{
			this.orders.splice(index, 1);
		}
		
		this.leave(context, '');
		return this;
	}
	
	// ORDERS METHOD - REMOVE GROUPS OF A FIELD
	this.remove_orders_for_field = function(arg_field_name)
	{
		var context = 'remove_orders_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		for(key in this.orders)
		{
			var order = this.orders[key];
			if ( ! Libapt.is_null(order) && order.field.name == arg_field_name )
			{
				var index = this.orders.lastIndexOf(order);
				if (index >= 0)
				{
					this.orders.splice(index, 1);
				}
			}
		}
		
		this.leave(context, '');
		return this;
	}
	
	// ORDERS METHOD - REMOVE ALL
	this.remove_all_orders = function()
	{
		var context = 'remove_order()';
		this.enter(context, '');
		
		this.orders = new Array();
		
		this.leave(context, '');
		return this;
	}
	
	// ORDERS METHOD - GET GROUPS OF A FIELD
	this.get_orders_for_field = function(arg_field_name)
	{
		var context = 'get_orders_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in this.orders)
		{
			var order = this.orders[key];
			if (order instanceof LibaptOrder)
			{
				if (order.field instanceof LibaptField)
				{
					if ( order.field.name == arg_field_name )
					{
						results_array.push(order);
					}
				}
				else
				{
					this.error(context, 'order.field is not a LibaptField');
					return results_array;
				}
			}
			else
			{
				this.error(context, 'order is not a LibaptOrder');
				return results_array;
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	
	// ORDERS METHOD - TOGGLE ASC/DESC ORDER FOR A FIELD
	this.toggle_order_for_field = function(arg_field, arg_remove_all)
	{
		var context = 'toggle_order_for_field(' + arg_field.name + ',' + arg_remove_all + ')';
		this.enter(context, '');
		
		var orders = this.get_orders_for_field(arg_field.name);
		
		var order = orders.length > 0 ? orders[orders.length - 1] : new LibaptOrder(arg_field, 'DESC');
		var toggled_mode = order.mode == 'ASC' ? 'DESC' : 'ASC';
		order.mode = toggled_mode;
		
		if (arg_remove_all)
		{
			this.remove_all_orders();
		}
		else
		{
			this.remove_orders_for_field(arg_field.name);
		}
		
		this.add_orders(order);
		
		this.leave(context, '');
		return order;
	}
	
	// ORDERS METHOD - GET ALL GROUPS FIELDS
	this.get_orders_fields = function()
	{
		var context = 'get_orders_fields()';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in arg_orders)
		{
			var order = arg_orders[key];
			if ( ! Libapt.is_null(order) )
			{
				results_array.push(order.field);
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('orders.count', this.orders.length);
	}
}



LibaptOrdersSet.create = function(arg_settings)
{
	var context = 'LibaptOrdersSet.create(arg_settings)';
	trace_enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'orders'		: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_empty_str_or_null(ext_settings.name) )
	{
		this.error(context, 'object name is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var field_obj = new LibaptOrdersSet(ext_settings.name, ext_settings.orders);
	
	trace_leave(context, '', true);
	return field_obj;
}
