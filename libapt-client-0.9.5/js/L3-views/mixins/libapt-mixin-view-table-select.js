	/**
 * @file        libapt-mixin-view-table-select.js
 * @desc        Mixin of table view select operations
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewTableSelect
 * @public
 * @desc				Mixin of view select operations
 */
var LibaptMixinViewTableSelect =
{
	/**
	 * @memberof			LibaptMixinViewTableSelect
	 * @public
	 * @desc				Enable/disable trace for select operations
	 */
	mixin_view_table_select_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTableSelect
	 * @public
	 * @desc				Multiple selection is enabled or not
	 */
	has_multiple_selection: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTableSelect
	 * @public
	 * @desc				First selected row
	 */
	selected_first_row: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTableSelect
	 * @public
	 * @method				init_selectable()
	 * @desc				enable selectable feature
	 * @return {boolean}
	 */
	init_selectable: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_select_trace);
		var context = 'init_selectable()';
		self.enter(context, '');
		
		// ROW SELECTABLE
		var callback_row_selected	= [self, self.on_selected_row];
		var callback_row_unselected	= [self, self.on_unselected_row];
		self.selectable('tbody', 'tr', callback_row_selected, callback_row_unselected);
		
		// COL SELECTABLE
		// var callback_col_selected	= [self, self.on_selected_col];
		// var callback_col_unselected	= [self, self.on_unselected_col];
		// self.selectable('thead tr:eq(0)', 'th', callback_col_selected, callback_col_unselected);
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewSelect
	 * @public
	 * @method				has_selected_records()
	 * @desc				Test if at least a record is selected
	 * @return {boolean}
	 */
	has_selected_records: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_select_trace);
		var context = 'has_selected_records()';
		self.enter(context, '');
		
				
		self.leave(context, '');
		self.pop_trace();
		return Libapt.is_array(self.selected_first_row);
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewSelect
	 * @public
	 * @method				free_selection()
	 * @desc				Unselect all selections
	 * @return {object}		This
	 */
	free_selection: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_select_trace);
		var context = 'free_selection()';
		self.enter(context, '');
		
		
		self.selected_first_row = null;
		self.unselectable('tbody', 'tr');
		
		
		self.leave(context, '');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewSelect
	 * @public
	 * @method				get_first_selected_record()
	 * @desc				Get first selected record
	 * @return {object}		first selected row record
	 */
	get_first_selected_record: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_select_trace);
		var context = 'get_first_selected_record()';
		self.enter(context, '');
		
		
		var record = null;
		if (self.selected_first_row)
		{
			record = {};
			self.selected_first_row.find('td').each(
				function(index, cell, cells)
				{
					var header = self.mixin_view_table_jqo.find('th')[index];
					self.assertNotNull(context, 'header[' + index + ']', header);
					
					var field = $(header).data('field');
					self.assertNotNull(context, 'header field[' + index + ']', field);
					
					record[field.name] = $(cell).text();
				}
			);
		}
		
		self.leave_or_error(context, 'success', 'no selected row', ! Libapt.is_null(record) );
		self.pop_trace();
		return record;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewSelect
	 * @public
	 * @method				on_selected_row(arg_operands)
	 * @desc				Do an action on a selected row event
	 * @param {array}		arg_operands	event handle arguments
	 * @return {nothing}
	 */
	on_selected_row: function(arg_operands)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_select_trace);
		var context = 'on_selected_row(operands)';
		self.enter(context, '');
		
		// var arg_target_obj	= arg_operands[0];
		var selected_jqo	= arg_operands[1];
		// var jq_event		= arg_operands[2];
		
		// CHECK SELECTED ROW
		if ( Libapt.is_null(selected_jqo) )
		{
			self.leaveko(context, 'no selected row');
			return false;
		}
		
		if ( selected_jqo.parent('tbody').length != 1 )
		{
			self.leave(context, 'a row of the table header is selected');
			return;
		}
		
		
		// DEBUG
		self.value(context, 'row', selected_jqo.index() );
		self.value(context, 'text', selected_jqo.text() );
		
		// A ROW IS ALREADY SELECTED
		if ( ! Libapt.is_null(self.selected_first_row) )
		{
			self.step(context, 'selected_first_row is not null');
			// console.log(self.selected_first_row);
			
			// THE CURRENT SELECTED ROW IS ALREADY SELECTED
			if (! self.has_multiple_selection || self.selected_first_row.index() == selected_jqo.index())
			{
				self.step(context, 'select a selected row');
				self.selected_first_row.removeClass('ui-selected');
				
				if (self.edit_toolbar)
				{
					self.edit_toolbar.disable_action('update');
					self.edit_toolbar.disable_action('delete');
				}
				self.fire_unlinks(self.model.fields_set, true);
				
				$('tr', selected_jqo.parent('tbody')).removeClass('selected');
				
				if (self.selected_first_row.index() == selected_jqo.index())
				{
					self.selected_first_row = null;
					self.leave(context, '');
					self.pop_trace();
					return;
				}
				
				self.selected_first_row = null;
			}
		}
		
		
		self.selected_first_row = selected_jqo;
		
		if (self.edit_toolbar)
		{
			self.edit_toolbar.enable_action('update');
			self.edit_toolbar.enable_action('delete');
		}
		
		// FIRE LINKS
		var record = self.get_first_selected_record();
		self.fire_links(self.model.fields_set, record, true, true);
		
		
		self.leave(context, '');
		self.pop_trace();
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewSelect
	 * @public
	 * @method				on_unselected_row(arg_operands)
	 * @desc				Do an action on a unselected row event
	 * @param {array}		arg_operands	event handle arguments
	 * @return {object}		first selected row record
	 */
	on_unselected_row: function(arg_operands)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_table_select_trace);
		var context = 'on_unselected_row(operands)';
		this.enter(context, '');
		
		// var arg_target_obj	= arg_operands[0];
		var selected_jqo	= arg_operands[1];
		// var jq_event		= arg_operands[2];
		
		// CHECK SELECTED ROW
		if ( Libapt.is_null(selected_jqo) )
		{
			this.leaveko(context, 'no selected row');
			return false;
		}
		
		if ( selected_jqo.parent('tbody').length != 1 )
		{
			this.leave(context, 'a row of the table header is unselected');
			return;
		}
		
		if ( ! Libapt.is_null(selected_jqo) )
		{
			// THE CURRENT SELECTED ROW SHOULD BE UNSELECTED
			if ( this.selected_first_row && ! self.has_multiple_selection && this.selected_first_row.index() == selected_jqo.index())
			{
				this.step(context, 'selected_first_row == selected_jqo');
				
				this.step(context, 'select a selected row');
				this.selected_first_row.removeClass('ui-selected');
				// this.selected_first_row = null;
				
				if (this.has_edit_toolbar)
				{
					this.edit_toolbar.disable_action('update');
					this.edit_toolbar.disable_action('delete');
				}
				this.fire_unlinks(this.model.fields_set, true);
			}
		}
		
		this.selected_first_row = null;
		$('tr', selected_jqo.parent('tbody')).removeClass('selected');
		selected_jqo.addClass('selected');
		
		this.value(context, 'row', selected_jqo.index() );
		this.value(context, 'text', selected_jqo.text() );
		
		if (this.has_edit_toolbar)
		{
			this.edit_toolbar.disable_action('update');
			this.edit_toolbar.disable_action('delete');
		}
		
		this.leave(context, '');
		self.pop_trace();
	}
};
