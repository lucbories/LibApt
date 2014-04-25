	/**
 * @file        libapt-mixin-view-table.js
 * @desc        Mixin of view for table operations
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewTable
 * @public
 * @desc				Mixin of view sizes operations
 */
var LibaptMixinViewTable =
{
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	mixin_view_table_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @desc				Table jQuery object
	 */
	mixin_view_table_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @desc				Table header jQuery object
	 */
	mixin_view_table_head_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @desc				Table body jQuery object
	 */
	mixin_view_table_body_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @desc				Table footer jQuery object
	 */
	mixin_view_table_foot_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				draw_empty()
	 * @desc				Draw an empty table
	 * @return {object}		This
	 */
	draw_empty: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'draw_empty()';
		self.enter(context, '');
		
		
		// CHECK CONTAINER JQO
		if ( ! self.container_jqo )
		{
			self.leave(context, 'no container jqo');
			this.pop_trace();
			return self;
		}
		
		
		// FIRE EVENT
		self.fire_event('draw-empty-begin');
		
		// CREATE MAIN TABLE NODES
		self.content_jqo = $('<div></div>');
		
		self.mixin_view_table_jqo = $('<table></table>');
		self.mixin_view_table_jqo.uniqueId();
		self.mixin_view_table_jqo.addClass('ui-widget ui-widget-content ui-widget ui-widget-content');
		self.mixin_view_table_jqo.css('margin-bottom', '0px');
		self.content_jqo.append(self.mixin_view_table_jqo);
		this.content_childs_jqo.push(this.mixin_view_table_jqo);
		
		self.mixin_view_table_head_jqo = $('<thead></thead>');
		self.mixin_view_table_head_jqo.addClass('ui-widget-header ui-widget-header');
		
		self.mixin_view_table_body_jqo = $('<tbody></tbody>');
		
		self.mixin_view_table_foot_jqo = $('<tfoot></tfoot>');
		
		self.mixin_view_table_jqo.append(self.mixin_view_table_head_jqo).append(self.mixin_view_table_body_jqo).append(self.mixin_view_table_foot_jqo);
		self.container_jqo.append(self.content_jqo);
		
		// FIRE EVENT
		self.fire_event('draw-empty-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				draw_records()
	 * @desc				Draw the table body with given records
	 * @param {array}		Table records
	 * @return {object}		This
	 */
	draw_records: function(arg_records)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'draw_records(records)';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-records-begin');
		
		// REMOVE ALL DATAS ROWS
		self.remove_records();
		
		// FILL RECORDS ROWS
		self.assertArray(context, 'datas_records', arg_records);
		for(var record_index = 0 ; record_index < arg_records.length ; record_index++)
		{
			var record = arg_records[record_index];
			self.assertNotNull(context, 'record[' + record_index + ']', record);
			self.assert(context, 'draw_row', self.draw_record(record_index, record) );
		}
		
		// ADJUST TABLE SIZE
		self.adjust_sizes();
		
		// FIRE EVENT (END)
		self.fire_event('draw-records-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				draw_record()
	 * @desc				Draw one record row
	 * @param {integer}		arg_row_index	row index
	 * @param {array}		arg_row_record	row values record
	 * @return {object}		This
	 */
	draw_record: function(arg_row_index, arg_row_record)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'draw_record(arg_row_index, arg_row_record)';
		// self.enter(context, '');
		
		
		// CREATE ROW NODE
		var node_tr = $('<tr>');
		node_tr.addClass('libapt_table_record');
		
		// LOOP ON GRID FIELDS
		var visible_fields = Libapt.is_array(self.visible_fields) ? self.visible_fields : self.query.fields_set.fields;
		for(field_index in visible_fields)
		{
			var field = visible_fields[field_index];
			var value = arg_row_record[field.name];
			var field_default = Libapt.is_null(field.value_default) ? '' : field.value_default;
			if ( Libapt.is_null(value) )
			{
				value = field_default;
			}
			var node_td = $('<td class="content_td">' + value + '</td>');
			node_tr.append(node_td);
			
			// THE FIELD IS NOT VISIBLE
			if ( ! field.is_visible)
			{
				node_td.css('display', 'none');
			}
		}
		
		self.mixin_view_table_body_jqo.append(node_tr);
		
		
		// self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				remove_records()
	 * @desc				Remove draw datas
	 * @return {object}		This
	 */
	remove_records: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'remove_records()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('remove-records-begin');
		
		self.mixin_view_table_body_jqo.find('tr.libapt_table_record').remove();
		
		// FIRE EVENT (END)
		self.fire_event('remove-records-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				draw_toolbars()
	 * @desc				Draw toolbars row
	 * @return {object}		This
	 */
	draw_toolbars: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'draw_toolbars()';
		self.enter(context, '');
		
		
		// TOOLBARS ROW EXISTS
		if (self.toolbars_jqo)
		{
			self.leave(context, 'toolbars row is already created');
			return self;
		}
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-toolbars-begin');
		
		// CREATE TOOLBARS ROW
		var visible_fields	= Libapt.is_array(self.visible_fields) ? self.visible_fields : self.query.fields_set.fields;
		var colspan			= visible_fields.length;
		
		self.toolbars_jqo = $('<tr></tr>');
		self.toolbars_jqo.addClass('libapt_toolbars');
		self.mixin_view_table_head_jqo.append(self.toolbars_jqo);
		
		var jqo_toolbars_th = $('<th colspan="' + colspan + '"></th>');
		self.toolbars_jqo.append(jqo_toolbars_th);
		
		self.toolbars_jqo.hide();
		
		
		// DEFAULT OPTIONS
		var actions_options	= null;
		
		// PAGER TOOLBAR
		var pager_toolbar_options = null;
		if (self.has_toolbar_pager)
		{
			self.pager_toolbar = self.create_toolbar_pager(jqo_toolbars_th, pager_toolbar_options, actions_options);
			self.pager_toolbar.draw();
		}
		
		// EDIT TOOLBAR
		var edit_toolbar_options = null;
		if (self.has_toolbar_crud)
		{
			self.edit_toolbar = self.create_toolbar_crud(jqo_toolbars_th, edit_toolbar_options, actions_options);
			
			self.edit_toolbar.draw();
			self.edit_toolbar.disable();
			
			self.edit_toolbar.enable_action('refresh');
			self.edit_toolbar.enable_action('create');
			
			self.toolbars_jqo.show();
		}
		
		// EXPORT TOOLBAR
		var export_toolbar_options = null;
		if (self.has_toolbar_export)
		{
			self.export_toolbar = self.create_toolbar_export(jqo_toolbars_th, export_toolbar_options, actions_options);
			
			self.export_toolbar.draw();
			
			self.toolbars_jqo.show();
		}
		
		// FIRE EVENT (END)
		self.fire_event('draw-toolbars-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				draw_headers()
	 * @desc				Draw headers row
	 * @return {object}		This
	 */
	draw_headers: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'draw_headers()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-headers-begin');
		
		// REMOVE EXISTING HEADERS
		self.remove_headers();
		
		// CREATE ROW NODE
		var node_tr = $('<tr>');
		node_tr.addClass('libapt_header_fields');
		var table_id = self.mixin_view_table_jqo.attr('id');
		
		// LOOP ON GRID FIELDS
		var visible_fields	= Libapt.is_array(self.visible_fields) ? self.visible_fields : self.query.fields_set.fields;
		for(field_index in visible_fields)
		{
			var field = visible_fields[field_index];
			self.assertNotNull(context, 'field at [' + field_index + ']', field);
			
			// CREATE FIELD NODE
			var node_a_jqo = $('<a href="#">' + field.label + '</a>');
			var node_th_jqo = $('<th></th>');
			node_th_jqo.css('text-align', 'center');
			var node_selector = '#' + table_id + ' th';
			node_th_jqo.append(node_a_jqo);
			node_th_jqo.data('field', field);
			
			// SET FIELD WIDTH OPTION
			if ( ! Libapt.is_null(self.css_fields_widths) )
			{
				if (self.css_fields_widths[field.name])
				{
					node_th_jqo.css('width', self.css_fields_widths[field.name]);
				}
			}
			
			// SET ORDER ARROWS OPTION
			if (self.has_order_column_arrows)
			{
				var asc_jqo  = $('<span class="ui-icon ui-icon-carat-1-n" />');
				var desc_jqo = $('<span class="ui-icon ui-icon-carat-1-s" />');
				node_th_jqo.append(asc_jqo);
				node_th_jqo.append(desc_jqo);
				
				asc_jqo.css('float', 'left');
				desc_jqo.css('float', 'right');
				asc_jqo.click(
					function()
					{
						var button	= $(this),
							th_jqo	= button.parent('th'),
							selected_field = th_jqo.data('field');
						// console.log(th_jqo.data());
						// console.log(selected_field);
						self.on_set_order(selected_field, 'ASC');
						self.refresh();
					}
				);
				desc_jqo.click(
					function()
					{
						var button	= $(this),
							th_jqo	= button.parent('th'),
							selected_field = th_jqo.data('field');
						self.on_set_order(selected_field, 'DESC');
						self.refresh();
					}
				);
			}
			
			// SET SWITCHABLE OPTION
			if (self.can_switch_columns)
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
		self.mixin_view_table_head_jqo.prepend(node_tr);
		
		// FIRE EVENT (END)
		self.fire_event('draw-headers-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewTable
	 * @public
	 * @method				remove_headers()
	 * @desc				Remove headers rows
	 * @return {object}		This
	 */
	remove_headers: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_trace);
		var context = 'remove_headers()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('remove-headers-begin');
		
		self.mixin_view_table_head_jqo.children('.libapt_header_fields').remove();
		
		// FIRE EVENT (END)
		self.fire_event('remove-headers-end');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	}
};
