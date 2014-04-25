/**
 * @file        libapt-table.js
 * @desc		Table view class
 * @see			libapt-grid.js libapt-model.js libapt-fieldsset.js libapt-field.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @class					LibaptTable
 * @desc					Table view class
 * @param {string}			arg_name			Table name
 * @param {object}			arg_jquery_obj		JQuery object to attach the view to
 * @param {object|null}		arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptTable(arg_name, arg_jquery_obj, arg_options)
{
	var self = this;
	
	// INHERIT
	this.inheritFrom = LibaptModelView;
	this.inheritFrom(arg_name, arg_jquery_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace					= false;
	this.class_name				= 'LibaptTable';
	var context					= this.class_name + '(name,jqo,settings)';
	this.enter(context, 'constructor');
	
	
	// TABLE ATTRIBUTES
	this.can_switch_columns		= false;
	this.edit_toolbar			= null;
	this.has_order_column_arrows= true;
	
	var init_option_result = Libapt.set_options_values(self, arg_options, false, true);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				add_record(arg_record)
	 * @desc				Add a new record to the view
	 * @param {object}		arg_record		field values record
	 * @return {boolean}	true:success,false:failure
	 */
	this.add_record = function(arg_record)
	{
		var context = 'add_record()';
		this.enter(context, '');
		
		this.refresh();
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				update_record(arg_record)
	 * @desc				Update an existing record
	 * @param {object}		arg_record		field values record
	 * @return {boolean}	true:success,false:failure
	 */
	this.update_record = function(arg_record)
	{
		var context = 'update_record(record)';
		this.enter(context, '');
		
		var self = this;
		
		if (this.selected_first_row)
		{
			this.selected_first_row.find('td').each(
				function(index, cell, cells)
				{
					var header = self.mixin_view_table_head_jqo.find('th')[index];
					self.assertNotNull(context, 'header[' + index + ']', header);
					
					var field = $(header).data('field');
					self.assertNotNull(context, 'header field[' + index + ']', field);
					
					var value = Libapt.is_null(arg_record[field.name]) ? field.default_value : arg_record[field.name];
					$(cell).text(value);
				}
			);
		}
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				delete_record(arg_record)
	 * @desc				Delete an existing record
	 * @param {object}		arg_record		field values record
	 * @return {boolean}	true:success,false:failure
	 */
	this.delete_record = function(arg_record)
	{
		var self = this;
		var context = 'delete_record()';
		this.enter(context, '');
		
		
		if (this.selected_first_row)
		{
			this.selected_first_row.remove();
			this.selected_first_row = null;
			this.refresh();
		}
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				on_set_order(arg_field_obj, arg_mode_str)
	 * @desc				Event handlet on table orders replacement
	 * @param {object}		arg_field_obj		LibaptField object
	 * @param {string}		arg_mode_str		Order mode string
	 * @return {boolean}	true:success,false:failure
	 */
	this.on_set_order = function(arg_field_obj, arg_mode_str)
	{
		var self = this;
		var context = 'on_set_order(' + arg_field_obj.name + ',' + arg_mode_str + ')';
		self.enter(context, '');
		
		self.query.orders_set.remove_all_orders();
		self.query.orders_set.replace_or_add_order(arg_field_obj, arg_mode_str);
		
		self.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				on_selected_col(arg_operands)
	 * @desc				Event handlet on table column selection
	 * @param {array}		arg_operands		jQuery UI event operands array
	 * @return {boolean}	true:success,false:failure
	 */
	this.on_selected_col = function(arg_operands)
	{
		var self = this;
		var context = 'on_selected_col(operands)';
		this.enter(context, '');
		
		// GET OPERANDS
		var arg_target_obj	= arg_operands[0];
		var selected_jqo	= arg_operands[1];
		var jq_event		= arg_operands[2];
		
		// CHECK PARENT PART
		if ( selected_jqo.parents('thead').length != 1 )
		{
			this.leave(context, 'Less or more than one column is requested to select');
			return false;
		}
		
		// GET ALL SELECTED ORDERS
		var selected_orders	= [];
		selected_jqo.each(
			function(index, item)
			{
				// GET TH JQO
				var column_jqo = $(item);
				// self.value(context, 'col', column_jqo.index() );
				// self.value(context, 'text', column_jqo.text() );
				
				// GET COLUMN FIELD
				var field = column_jqo.data('field');
				if ( ! field )
				{
					this.error(context, 'no field found for column header tag');
					return false;
				}
				// console.log(field);
				
				// CREATE OR UPDATE FIELD ORDER
				var order = self.query.orders_set.toggle_order_for_field(field, false);
				selected_orders.push(order);
				self.value(context, 'order.mode', order.mode);
				
				// CREATE OR REPLACE ARROW
				$('span', column_jqo).remove();
				if (order.mode == 'ASC')
				{
					column_jqo.append('<span class="ui-icon .ui-icon-carat-1-n" />');
				}
				else
				{
					column_jqo.append('<span class="ui-icon .ui-icon-carat-1-s" />');
				}
			}
		);
		
		// UPDATE QUERY ORDERS
		this.query.orders_set.remove_all_orders();
		this.query.orders_set.add_orders(selected_orders);
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				on_unselected_col(arg_operands)
	 * @desc				Event handlet on table column unselection
	 * @param {array}		arg_operands		jQuery UI event operands array
	 * @return {boolean}	true:success,false:failure
	 */
	this.on_unselected_col = function(arg_operands)
	{
		var self = this;
		var context = 'on_unselected_col(operands)';
		this.enter(context, '');
		
		// GET OPERANDS
		var arg_target_obj	= arg_operands[0];
		var selected_jqo	= arg_operands[1];
		var jq_event		= arg_operands[2];
		
		// CHECK PARENT PART
		if ( selected_jqo.parents('thead').length != 1 )
		{
			this.leave(context, 'Less or more than one column is requested to unselect');
			return false;
		}
		
		// this.value(context, 'col', selected_jqo.index() );
		// this.value(context, 'text', selected_jqo.text() );
		
		var selected_orders	= [];
		selected_jqo.each(
			function(index, item)
			{
				// GET TH JQO
				var column_jqo = $(item);
				// self.value(context, 'col', column_jqo.index() );
				// self.value(context, 'text', column_jqo.text() );
				
				// GET COLUMN FIELD
				var field = column_jqo.data('field');
				if ( ! field )
				{
					this.error(context, 'no field found for column header tag');
					return false;
				}
				
				// CREATE OR UPDATE FIELD ORDER
				var order = self.query.orders_set.toggle_order_for_field(field, false);
				selected_orders.push(order);
				
				// CREATE OR REPLACE ARROW
				$('span', column_jqo).remove();
				if (order.mode == 'ASC')
				{
					column_jqo.append('<span class="ui-icon .ui-icon-carat-1-n" />');
				}
				else
				{
					column_jqo.append('<span class="ui-icon .ui-icon-carat-1-s" />');
				}
				// self.query.orders_set.remove_orders_for_field(field.name);
				// column_jqo.remove('span');
			}
		);
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				on_double_clicked_cell(arg_operands)
	 * @desc				Event handlet on table cell double click
	 * @param {array}		arg_operands		jQuery UI event operands array
	 * @return {boolean}	true:success,false:failure
	 */
	this.on_double_clicked_cell = function(arg_operands)
	{
		var context = 'on_double_clicked_cell(target,operands)';
		this.enter(context, '');
		
		this.step(context, 'fired');
		var arg_target_obj	= arg_operands[0];
		var selected_jqo	= arg_operands[1];
		var jq_event		= arg_operands[2];
		
		this.value(context, 'row', selected_jqo.parent().index() );
		this.value(context, 'col', selected_jqo.index() );
		this.value(context, 'text', selected_jqo.text() );
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				on_switch_columns(arg_operands)
	 * @desc				Event handlet on table columns switch
	 * @param {array}		arg_operands		jQuery UI event operands array
	 * @return {boolean}	true:success,false:failure
	 */
	this.on_switch_columns = function(arg_column1, arg_column2)
	{
		var context = 'on_switch_columns(column1,column2)';
		this.enter(context, '');
		
		this.step(context, 'fired');
		// console.log(arg_column1[0]);
		// console.log(arg_column2[0]);
		// console.log($(arg_column1[0]));
		// console.log($(arg_column2[0]));
		this.value(context, 'column1', $(arg_column1[0]).data('field').name );
		this.value(context, 'column2', $(arg_column2[0]).data('field').name );
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				on_filled()
	 * @desc				On filled event
	 * @return {boolean}	true:success,false:failure
	 */
	this.on_filled = function()
	{
		var context = 'on_filled()';
		this.enter(context, '');
		
		this.init_selectable();
		
		if (this.edit_toolbar)
		{
			this.edit_toolbar.enable();
			this.edit_toolbar.disable_action('update');
			this.edit_toolbar.disable_action('delete');
		}
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(this.js_on_change) )
		{
			eval(this.js_on_change);
		}
		
		this.leave(context, '	');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptTable
	 * @method				update_tooltip()
	 * @desc				On tooltip update request
	 * @return {boolean}	true:success,false:failure
	 */
	this.update_tooltip = function()
	{
		var self = this;
		var context = 'update_tooltip()';
		self.enter(context, '');
		
		
		self.assertNotNull(context, 'load real length', self.mixin_view_model_load_real_length);
		self.assertNotNull(context, 'table_jqo', self.mixin_view_table_jqo);
		self.assertNotNull(context, 'table_body_jqo', self.mixin_view_table_body_jqo);
		
		var records_row = $('tr.libapt_table_record', self.mixin_view_table_body_jqo);
		var records_count = records_row ? records_row.length : 0;
		var tooltip = records_count + ' are visible on ' + self.mixin_view_model_load_real_length + ' available';
		self.mixin_view_table_jqo.attr('title', tooltip);
		
		
		self.leave(context, '');
		return true;
	}
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(LibaptMixinViewTable);
	self.register_mixin(LibaptMixinViewTableSelect);
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND EVENTS LISTENER
	self.add_event_callback('load-datas-success', [self, self.on_filled]);
	self.add_event_callback('load-datas-success', [self, self.update_tooltip]);
	self.add_event_callback('refresh-begin', [self, self.free_selection]);
	if (self.has_pager)
	{
		self.pager.add_event_callback('pager-page-changed', [self, self.load_records]);
		self.pager.add_event_callback('pager-size-changed', [self, self.load_records]);
		self.pager.add_event_callback('pager-page-changed', [self, self.update_tooltip]);
		self.pager.add_event_callback('pager-size-changed', [self, self.update_tooltip]);
	}
	
	
	/* --------------------------------------------------------------------------------------------- */
	// ON READY HANDLER
	self.on_ready();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptTable, ['LibaptModelView'], 'Luc BORIES', '2013-08-21', 'Table view class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_bool_option(LibaptView, 'table_headers_has_toolbar',		true, false, []);
Libapt.register_bool_option(LibaptView, 'table_headers_has_titlebar',		true, false, []);
Libapt.register_bool_option(LibaptView, 'table_fill_on_load',				true, false, []);

// Libapt.register_bool_option(LibaptView, 'table_headers_has_columns',		true, false, []); // DEPRECATED
// Libapt.register_int_option(LibaptView, 'table_headers_row_index',			0, false, []); // DEPRECATED
// Libapt.register_bool_option(LibaptView, 'table_actions_column_display',		false, false, []); // DEPRECATED
// Libapt.register_int_option(LibaptView, 'table_actions_column_index',		0, false, []); // DEPRECATED
