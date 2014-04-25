	/**
 * @file        libapt-mixin-query-editor-filters.js
 * @desc        Query filters editor
 * @see			libapt-action.js libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinQueryEditorFilters
 * @public
 * @desc				Mixin of query editor for filters
 */
var LibaptMixinQueryEditorFilters =
{
	/**
	 * @memberof			LibaptMixinQueryEditorFilters
	 * @public
	 * @method				draw_select_editor(arg_options_array, arg_current_value)
	 * @desc				Draw a select tag
	 * @param {array}		arg_options_array			select options
	 * @param {string}		arg_current_value			selected value
	 * @return {object}		JQuery object of the created select yag
	 */
	draw_select_editor: function(arg_options_array, arg_current_value)
	{
		var select_jqo = $('<select></select>');
		
		for(option_index in arg_options_array)
		{
			var option_obj = arg_options_array[option_index];
			var option_jqo = $('<option></option>');
			
			option_jqo.val(option_obj.value);
			option_jqo.html(option_obj.label);
			
			if (option_obj.value == arg_current_value)
			{
				option_jqo.attr('selected', '');
			}
			
			select_jqo.append(option_jqo);
		}
		
		return select_jqo;
	},
	
	
	/**
	 * @memberof			LibaptMixinQueryEditorFilters
	 * @public
	 * @method				draw_query_filter_editor(arg_model_view_obj, arg_tr_jqo, arg_filter_obj, arg_filter_index)
	 * @desc				Draw a query filter editor
	 * @param {object}		arg_model_view_obj			Model view containing the query to edit
	 * @param {object}		arg_tr_jqo					JQuery object of the filter row
	 * @param {object}		arg_filter_obj				Filter object
	 * @param {integer}		arg_filter_index			Filter index
	 * @return {boolean}	true:success,false:failure
	 */
	draw_query_filter_editor: function(arg_model_view_obj, arg_tr_jqo, arg_filter_obj, arg_filter_index)
	{
		var self = this;
		var context = 'draw_query_filter_editor(container,filter)';
		self.enter(context, '');
		
		
		// ATTACH THE FILTER OBJECT TO THE CELL
		arg_tr_jqo.data('filter', arg_filter_obj);
		
		// INIT CELL VARIABLES
		var td_jqo			= null;
		var options_array	= null;
		
		// JOIN MODE: 'and' or 'or'
		td_jqo			= $('<td></td>');
		options_array	= [ { value:'', label:'none'}, { value:'and', label:'AND'}, { value:'or', label:'OR'} ];
		td_jqo.append( self.draw_select_editor(options_array, Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.join_mode) );
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '40px');
		var td_join_value_jqo = td_jqo.children('select:eq(0)')[0];
		$(td_join_value_jqo).change(
			function()
			{
				var value = $('option:selected', td_join_value_jqo).val();
				self.value(context, 'join-mode.change.value', value);
				arg_filter_obj.join_mode = get_arg_not_null(value, '');
			}
		);
		
		// GROUP MODE: '(' or ')' or none
		td_jqo			= $('<td></td>');
		options_array	= [ { value:'', label:'none'}, { value:'(', label:'('}, { value:')', label:')'} ];
		td_jqo.append( self.draw_select_editor(options_array, Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.group_mode) );
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '40px');
		var td_group_value_jqo = td_jqo.children('select:eq(0)')[0];
		$(td_group_value_jqo).change(
			function()
			{
				var value = $('option:selected', td_group_value_jqo).val();
				self.value(context, 'group-mode.change.value', value);
				arg_filter_obj.group_mode = get_arg_not_null(value, '');
			}
		);
		
		// FIELD NAME
		td_jqo			= $('<td></td>');
		options_array	= [];
		$( arg_model_view_obj.query.fields_set.fields ).each(
			function(index, item)
			{
				options_array.push( {value:item.name, label:item.label} );
			}
		);
		td_jqo.append( self.draw_select_editor(options_array, Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.field.name) );
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '50px');
		var td_field_value_jqo = td_jqo.children('select:eq(0)')[0];
		$(td_field_value_jqo).change(
			function()
			{
				var value = $('option:selected', td_field_value_jqo).text();
				self.value(context, 'field.change.value', value);
				var field = arg_model_view_obj.query.fields_set.get_field_by_label(value);
				if ( ! Libapt.is_null(field) )
				{
					arg_filter_obj.type = field.value_type;
					arg_filter_obj.field = field;
				}
			}
		);
		
		// MODEL VALUE MODIFIER: 'lower' or 'upper' or ...
		td_jqo			= $('<td></td>');
		options_array	=
			[
				{value:'', label:'none'},
				// STRING OPERATORS
				{value:'lower', label:'LOWER'},
				{value:'upper', label:'UPPER'},
				{value:'ltrim', label:'LTRIM'},
				{value:'ltrim', label:'RTRIM'},
				{value:'aes_encrypt', label:'AES_ENCRYPT'},
				{value:'aes_decrypt', label:'AES_DECRYPT'},
				{value:'md5', label:'MD5'},
				// NUMBER OPERATORS
				{value:'md5', label:'ABS'},
				{value:'md5', label:'FLOOR'},
				// DATE TIME
				{value:'date', label:'DATE'},
				{value:'day', label:'DAY'},
				{value:'week', label:'WEEK'},
				{value:'month', label:'MONTH'},
				{value:'year', label:'YEAR'},
				{value:'day of week', label:'DAY OF WEEK'},
				{value:'day of month', label:'DAY OF MONTH'},
				{value:'day of year', label:'DAY OF YEAR'},
				{value:'last day of month', label:'LAST DAY OF MONTH'},
				{value:'quarter', label:'QUARTER'},
				// DATE TIME
				{value:'time', label:'TIME'},
				{value:'hour', label:'HOUR'},
				{value:'minute', label:'MINUTE'},
				{value:'second', label:'SECOND'}
			];
		td_jqo.append( self.draw_select_editor(options_array, Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.modifier) );
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '40px');
		var td_modifier_value_jqo = td_jqo.children('select:eq(0)')[0];
		$(td_modifier_value_jqo).change(
			function()
			{
				var value = $('option:selected', td_modifier_value_jqo).val();
				self.value(context, 'modifier.change.value', value);
				arg_filter_obj.modifier = get_arg_not_null(value, '');
			}
		);
		
		// FILTER OPERATOR: 'equals' or 'in' or ...
		td_jqo			= $('<td></td>');
		options_array	=
			[
				{value:'', label:'none'},
				// ALL OPERATORS
				{value:'isnull', label:'IS NULL'},
				{value:'isnotnull', label:'IS NOT NULL'},
				// STRING OPERATORS
				{value:'equals', label:'EQUALS'},
				{value:'notequals', label:'NOT EQUALS'},
				{value:'begins with', label:'BEGINS WITH'},
				{value:'contains', label:'CONTAINS'},
				{value:'ends with', label:'ENDS WITH'},
				{value:'min length', label:'MIN LENGTH'},
				{value:'max length', label:'MAX LENGTH'},
				{value:'length between', label:'LENGTH BETWEEN'},
				{value:'in', label:'IN'},
				// NUMBER OPERATORS
				{value:'gt', label:'GREATER THAN'},
				{value:'ge', label:'GREATER OR EQUAL'},
				{value:'lt', label:'LESSER THAN'},
				{value:'le', label:'LESSER OR EQUAL'},
				{value:'between', label:'BETWEEN'}
			];
		td_jqo.append( self.draw_select_editor(options_array, Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.operator) );
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '40px');
		var td_operator_value_jqo = td_jqo.children('select:eq(0)')[0];
		$(td_operator_value_jqo).change(
			function()
			{
				var value = $(':selected', td_operator_value_jqo).val();
				self.value(context, 'operator.change.value', value);
				arg_filter_obj.operator = get_arg_not_null(value, '');
			}
		);
		
		// FILTER OPERAND1
		td_jqo		= $('<td></td>');
		var input1	= $('<input type="TEXT"/>');
		input1.val(Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.var1);
		td_jqo.append(input1);
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '50px');
		var td_var1_value_jqo = td_jqo.children('input:eq(0)')[0];
		$(td_var1_value_jqo).change(
			function()
			{
				var value = $(td_var1_value_jqo).val();
				self.value(context, 'var1.change.value', value);
				arg_filter_obj.var1 = value;
			}
		);
		
		// FILTER OPERAND2
		td_jqo		= $('<td></td>');
		var input2	= $('<input type="TEXT"/>');
		input2.val(Libapt.is_null(arg_filter_obj) ? '' : arg_filter_obj.var2);
		td_jqo.append(input2);
		arg_tr_jqo.append(td_jqo);
		td_jqo.css('min-width', '50px');
		var td_var2_value_jqo = td_jqo.children('input:eq(0)')[0];
		$(td_var2_value_jqo).change(
			function()
			{
				var value = $(td_var2_value_jqo).val();
				self.value(context, 'var2.change.value', value);
				arg_filter_obj.var2 = value;
			}
		);
		
		
		// BUTTONS
		var self = this;
		td_jqo	= $('<td></td>');
		arg_tr_jqo.append(td_jqo);
		
		// INSERT BUTTON
		var add_icon_url		= Libapt.get_main_icon_url('edit/add_24.png');
		var add_icon_tooltip	= 'Insert a filter after the current line';
		var add_img_jqo			= $('<img src="' + add_icon_url + '" alt="' + add_icon_tooltip + '" width="24" height="24" title="' + add_icon_tooltip + '"></img>');
		var add_div_jqo	= $('<div class="ui-button-text libapt_refresh_button"></div>');
		add_div_jqo.append(add_img_jqo);
		td_jqo.append(add_div_jqo);
		
		// DELETE BUTTON
		var delete_icon_url		= Libapt.get_main_icon_url('edit/delete_24.png');
		var delete_icon_tooltip	= 'Delete the current line';
		var delete_img_jqo			= $('<img src="' + delete_icon_url + '" alt="' + delete_icon_tooltip + '" width="24" height="24" title="' + delete_icon_tooltip + '"></img>');
		var delete_div_jqo	= $('<div class="ui-button-text libapt_refresh_button"></div>');
		delete_div_jqo.append(delete_img_jqo);
		td_jqo.append(delete_div_jqo);
		
		// INSERT BUTTON EVENT
		add_div_jqo.click(
			function()
			{
				self.enter(context, 'insert button.click');
				
				var filter_tr_jqo = $('<tr></tr>');
				arg_tr_jqo.after(filter_tr_jqo);
				
				self.assertTrue(context, 'fields length', arg_model_view_obj.query.fields_set.fields.length > 0);
				var first_field = arg_model_view_obj.query.fields_set.fields[0];
				
				var filter = new LibaptFilter(first_field, first_field.value_type, '', 'equals', '', '');
				self.assertTrue(context, 'draw filter', self.draw_query_filter_editor(arg_model_view_obj, filter_tr_jqo, filter, filter_tr_jqo.index() ) );
				
				arg_model_view_obj.query.filters_set.add_filter(filter);
				
				self.leave(context, 'insert button.click');
			}
		);
		
		// DELETE BUTTON EVENT
		delete_div_jqo.click(
			function()
			{
				self.enter(context, 'delete button.click');
				
				var filter = arg_tr_jqo.data('filter');
				arg_model_view_obj.query.filters_set.remove_filter(filter);
				
				arg_tr_jqo.remove();
				
				self.leave(context, 'delete button.click');
			}
		);
		
		this.leave(context, 'success');
		return true;
	},
	
	
	/**
	 * @memberof			LibaptMixinQueryEditorFilters
	 * @public
	 * @method				draw_query_filters_editor(arg_model_view_obj, arg_container_jqo)
	 * @desc				Draw query filters editor
	 * @param {object}		arg_model_view_obj			Model view containing the query to edit
	 * @param {object}		arg_container_jqo			JQuery object to attach the editor to
	 * @return {boolean}	true:success,false:failure
	 */
	draw_query_filters_editor: function(arg_model_view_obj, arg_container_jqo)
	{
		var self = this;
		var context = 'draw_query_filters_editor()';
		this.enter(context, '');
		
		
		// CHECK VIEW AND CONTAINER
		self.assertNotNull(context, 'view', arg_model_view_obj);
		self.assertNotNull(context, 'jqo', arg_container_jqo);
		
		// CREATE CONTAINER LABEL
		var label_jqo = $('<span>Edit the filters of the query</span>');
		arg_container_jqo.append(label_jqo);
		
		// ADD BUTTON
		var add_icon_url		= Libapt.get_main_icon_url('edit/add_24.png');
		var add_icon_tooltip	= 'Create a filter after the last filter';
		var add_img_jqo			= $('<img src="' + add_icon_url + '" alt="' + add_icon_tooltip + '" width="24" height="24" title="' + add_icon_tooltip + '"></img>');
		var add_div_jqo	= $('<div class="ui-button-text libapt_refresh_button"></div>');
		add_div_jqo.append(add_img_jqo);
		arg_container_jqo.append(add_div_jqo);
		
		// CREATE TABLE
		var table_jqo = $('<table></table>');
		table_jqo.addClass('ui-widget ui-widget-content ui-widget ui-widget-content');
		table_jqo.uniqueId();
		
		var table_head = $('<thead></thead>');
		table_head.addClass('ui-widget-header ui-widget-header');
		
		var table_body = $('<tbody></tbody>');
		var table_foot = $('<tfoot></tfoot>');
		
		// DRAW TABLE HEADERS
		table_head.append( $('<th>and / or</th>') );
		table_head.append( $('<th>( / )</th>') );
		table_head.append( $('<th>Field</th>') );
		table_head.append( $('<th>Modifier</th>') );
		table_head.append( $('<th>Operator</th>') );
		table_head.append( $('<th>Operand 1</th>') );
		table_head.append( $('<th>Operand 2</th>') );
		table_head.append( $('<th></th>') );
		$('th', table_head).css('font-size', '0.8em').css('font-weight', 'bold').css('min-width', '40px');
		
		table_jqo.append(table_head).append(table_body).append(table_foot);
		arg_container_jqo.append(table_jqo);
		
		
		// ADD BUTTON EVENT
		add_div_jqo.click(
			function()
			{
				self.enter(context, 'add button.click');
				
				var filter_tr_jqo = $('<tr></tr>');
				table_body.append(filter_tr_jqo);
				
				self.assertTrue(context, 'fields length', arg_model_view_obj.query.fields_set.fields.length > 0);
				var first_field = arg_model_view_obj.query.fields_set.fields[0];
				
				var filter = new LibaptFilter(first_field, first_field.value_type, '', 'equals', '', '');
				self.assertTrue(context, 'draw filter', self.draw_query_filter_editor(arg_model_view_obj, filter_tr_jqo, filter, filter_tr_jqo.index() ) );
				
				arg_model_view_obj.query.filters_set.add_filter(filter);
				
				self.leave(context, 'add button.click');
			}
		);
		
		
		// LOOP ON VIEW QUERY FILTERS
		for(filter_index in arg_model_view_obj.query.filters_set.filters)
		{
			this.step(context, 'loop on filters: at ' + filter_index);
			var filter = arg_model_view_obj.query.filters_set.filters[filter_index];
			this.assertNotNull(context, 'filter', filter);
			
			var filter_tr_jqo = $('<tr></tr>');
			table_body.append(filter_tr_jqo);
			this.assertTrue(context, 'draw filter', this.draw_query_filter_editor(arg_model_view_obj, filter_tr_jqo, filter, filter_index) );
		}
		$('td', table_body).children().css('margin', '0px').css('padding', '0px');
		$('td', table_body).css('font-size', '0.8em').css('font-weight', 'normal').css('padding', '5px');
		
		this.leave(context, 'success');
		return true;
	}
};
