/**
 * @file        libapt-table.js
 * @brief       Table class
 * @details     ...
 * @see			libapt-grid.js libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Table class
 * @param[in]	arg_name			Table name (string)
 * @param[in]	arg_jquery_obj		JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptTable(arg_name, arg_jquery_obj, arg_options)
{
	var self = this;
	
	// INHERIT
	this.inheritFrom = LibaptGridTable;
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
	
	// if (this.table_fill_on_load == '0' || this.table_fill_on_load == false || this.table_fill_on_load == 'false')
	// {
		// this.fill_on_load = false;
	// }
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Draw grid header fields
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_header_fields = function()
	{
		var self = this;
		var context = 'draw_header_fields()';
		this.enter(context, '');
		
		
		// CREATE ROW NODE
		var node_tr = $('<tr class="libapt_header_fields"></tr>');
		var table_id = this.table_jqo.attr('id');
		
		// LOOP ON GRID FIELDS
		for(field_index in this.visible_fields)
		{
			var field = this.visible_fields[field_index];
			this.assertNotNull(context, 'field at [' + field_index + ']', field);
			
			// CREATE FIELD NODE
			var node_a_jqo = $('<a href="#">' + field.label + '</a>');
			var node_th_jqo = $('<th></th>');
			node_th_jqo.css('text-align', 'center');
			var node_selector = '#' + table_id + ' th';
			node_th_jqo.append(node_a_jqo);
			node_th_jqo.data('field', field);
			
			// SET FIELD WIDTH OPTION
			if ( ! Libapt.is_null(this.css_fields_widths) )
			{
				if (this.css_fields_widths[field.name])
				{
					node_th_jqo.css('width', this.css_fields_widths[field.name]);
				}
			}
			
			// SET ORDER ARROWS OPTION
			if (this.has_order_column_arrows)
			{
				var asc_jqo  = $('<span class="ui-icon ui-icon-carat-1-n" />');
				var desc_jqo = $('<span class="ui-icon ui-icon-carat-1-s" />');
				node_th_jqo.append(asc_jqo);
				node_th_jqo.append(desc_jqo);
				
				asc_jqo.css('float', 'left');
				desc_jqo.css('float', 'right');
				asc_jqo.click(  function() { var field = $(this).parent('th').data('field'); self.on_set_order(field, 'ASC'); self.refresh(); } );
				desc_jqo.click( function() { var field = $(this).parent('th').data('field'); self.on_set_order(field, 'DESC');self.refresh(); } );
			}
			
			// SET SWITCHABLE OPTION
			if (this.can_switch_columns)
			{
				node_th_jqo.draggable( { axis:'x' } );
				node_th_jqo.droppable(
					{
						accept:			node_selector,
						greedy:			true,
						containment:	'th',
						tolerance:		'fit',
						hoverClass:		'ui-selected',
						activeClass:	'ui-state-highlight',
						drop:			function( event, ui ) { self.on_switch_columns(ui.helper, ui.draggable); }
					}
				);
			}
			
			// APPEND FIELD TO THE CURRENT ROW
			node_tr.append(node_th_jqo);
			
			// THE FIELD IS NOT VISIBLE
			if ( ! field.is_visible)
			{
				node_th_jqo.css('display', 'none');
			}
		}
		this.table_head_jqo.prepend(node_tr);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw grid header
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_header = function()
	{
		var self = this;
		var context = 'draw_header()';
		self.enter(context, '');
		
		
		// REMOVE EXISTING HEADERS
		self.table_head_jqo.children('.libapt_header_fields').remove();
		
		// APPEND HEADER ROW
		self.draw_header_fields();
		
		// SET HEADER DRAG AND DROP TO SWITCH COLUMNS
		// ...
		
		if (self.toolbars_jqo)
		{
			self.leave(context, 'only update table header');
			return true;
		}
		
		
		var colspan = self.visible_fields.length;
		var actions_options = null;
		
		
		// CREATE TOOLBARS TR
		self.toolbars_jqo = $('<tr></tr>');
		self.table_head_jqo.append(self.toolbars_jqo);
		
		var jqo_toolbars_th = $('<th colspan="' + colspan + '"></th>');
		self.toolbars_jqo.append(jqo_toolbars_th);
		
		self.toolbars_jqo.hide();
		
		
		// EDIT TOOLBAR
		var edit_toolbar_options = null;
		if (self.has_toolbar_crud)
		{
			self.edit_toolbar = self.create_edit_toolbar(jqo_toolbars_th, edit_toolbar_options, actions_options);
			
			var pager_options = null;
			self.pager.set_container(jqo_toolbars_th);
			
			// INIT AND DRAW VIEW
			self.edit_toolbar.draw();
			self.edit_toolbar.disable();
			
			self.edit_toolbar.enable_action('refresh');
			self.edit_toolbar.enable_action('create');
			
			self.pager.draw();
			
			self.toolbars_jqo.show();
		}
		
		
		// EXPORT TOOLBAR
		var export_toolbar_options = null;
		if (self.has_toolbar_export)
		{
			self.export_toolbar = self.create_export_toolbar(jqo_toolbars_th, export_toolbar_options, actions_options);
			self.toolbars_jqo.append(jqo_toolbars_th);
			
			// INIT AND DRAW VIEW
			self.export_toolbar.draw();
			// self.export_toolbar.disable();
			
			self.toolbars_jqo.show();
		}
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw grid row
	 * @param[in]	arg_row_index	row index
	 * @param[in]	arg_row_record	row values record
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_row = function(arg_row_index, arg_row_record)
	{
		var context = 'draw_row(arg_row_index, arg_row_record)';
		// this.enter(context, '');
		
		// CREATE ROW NODE
		var node_tr = $('<tr></tr>');
		
		// LOOP ON GRID FIELDS
		for(field_index in this.visible_fields)
		{
			var field = this.visible_fields[field_index];
			var value = arg_row_record[field.name];
			if ( Libapt.is_null(value) )
			{
				value = field.default_value;
			}
			var node_td = $('<td class="content_td">' + value + '</td>');
			node_tr.append(node_td);
			
			// THE FIELD IS NOT VISIBLE
			if ( ! field.is_visible)
			{
				node_td.css('display', 'none');
			}
		}
		
		this.table_body_jqo.append(node_tr);
		
		// this.leave(context, 'success');
		return true;
	}
	
	this.before_refresh = function()
	{
		var self = this;
		var context = 'before_refresh()';
		self.enter(context, '');
		
		
		// UNSELECT ALL / DISABLE SELECT
		self.selected_first_row = null;
		self.unselectable('tbody', 'tr');
		
		// DISABLE TOOLBAR REFRESH ACTION
		// if (self.edit_toolbar)
		// {
			// this.edit_toolbar.disable_action('refresh');
		// }
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	this.after_refresh = function()
	{
		var self = this;
		var context = 'after_refresh()';
		self.enter(context, '');
		
		
		// ENABLE SELECT
		// self.init_selectable();
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Add a new record to the view
	 * @param[in]	arg_record		field values record (object)
	 * @return		boolean			true:success,false:failure
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
	 * @brief		Update an existing record
	 * @param[in]	arg_record		field values record (object)
	 * @return		boolean			true:success,false:failure
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
					var header = self.table_head_jqo.find('th')[index];
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
	 * @brief		Delete an existing record
	 * @param[in]	arg_record		field values record (object)
	 * @return		boolean			true:success,false:failure
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
	
	
	this.on_set_order = function(arg_field_obj, arg_mode_str)
	{
		var self = this;
		var context = 'on_set_order(' + arg_field_obj.name + ',' + arg_mode_str + ')';
		self.enter(context, '');
		
		self.query.orders_set.remove_all_orders();
		self.query.orders_set.replace_or_add_order(arg_field_obj, arg_mode_str);
		
		self.leave(context, '');
	}
	
	
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
			this.leave(context, 'a column of the table body is selected');
			return;
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
					return;
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
	}
	
	
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
			this.leave(context, 'a column of the table body is unselected');
			return;
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
					return;
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
	}
	
	
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
	}
	
	
	this.on_switch_columns = function(arg_column1, arg_column2)
	{
		var context = 'on_switch_columns(column1,column2)';
		this.enter(context, '');
		
		this.step(context, 'fired');
		// console.log(arg_column1[0]);
		// console.log(arg_column2[0]);
		console.log($(arg_column1[0]));
		console.log($(arg_column2[0]));
		this.value(context, 'column1', $(arg_column1[0]).data('field').name );
		this.value(context, 'column2', $(arg_column2[0]).data('field').name );
		
		this.leave(context, '');
	}
	
	
	/**
	 * @brief		On filled event
	 * @return		boolean				true:success,false:failure
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
	
	
	this.on_pager_updated = function(arg_operands)
	{
		var context = 'on_pager_updated(operands)';
		this.enter(context, '');
		
		this.value(context, 'pager', this.pager.to_string());
		
		// CALCULATE FIRST AND LAST VISIBLE ROWS
		var pages_current_first_row	= (this.pager.current_page) * this.pager.current_pages_size;
		var pages_current_last_row	= (this.pager.current_page + 1) * this.pager.current_pages_size - 1;
		
		// UPDATE TABLE ROWS
		this.table_body_jqo.children().filter('tr').show();
		this.table_body_jqo.children().filter('tr:lt(' + pages_current_first_row + ')').hide();
		this.table_body_jqo.children().filter('tr:gt(' + pages_current_last_row  + ')').hide();
		
		this.leave(context, '');
	}
	
	
	// TABLE EVENTS
	this.add_event_callback('filled', [this, this.on_filled]);
	if (this.has_pager)
	{
		this.pager.add_event_callback('updated', [this, this.on_pager_updated]);
		// this.add_event_callback('updated', [this, this.on_pager_updated]);
		this.pager.add_event_callback('current_page_changed', [this, this.on_pager_updated]);
	}
	
	// ON READY HANDLER
	this.on_ready();
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(LibaptMixinViewTableSelect);
	
}

Libapt.register_inheritance(LibaptTable, LibaptGridTable);




/**
 * @brief		Table class unit tests
 * @return		nothing
 */
LibaptTable.tu_profiles_users_roles_1 = function()
{
	var context = 'LibaptTable.tu_profiles_users_roles_1()';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var field1 = null;
	var field2 = null;
	var field3 = null;
	try
	{
		// GET MODEL
		model = LibaptModels.get('MODEL_AUTH_PROFILES_USERS_ROLES');
		
		// CREATE VIEW
		var view_options =
			{
				'model': model,
				'query_fields':['profile', 'login', 'role']
			};
		var jqo = $('.row:eq(1)');
		jqo.append( $('<hr>') );
		view = new LibaptTable('table_1', jqo, view_options);
		
		// INIT AND DRAW
		view.draw();
		
		// CELL DOUBLE CLICKABLE
		var callback2 = [view, view.on_double_clicked_cell];
		view.double_clickable('tbody tr td', callback2);
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(model);
		console.log(view);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}
