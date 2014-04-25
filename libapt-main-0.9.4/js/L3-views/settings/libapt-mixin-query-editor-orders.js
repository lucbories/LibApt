	/**
 * @file        libapt-mixin-query-editor-orders.js
 * @desc        Query orders editor
 * @see			libapt-action.js libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinQueryEditorOrders
 * @public
 * @desc				Mixin of query editor for orders
 */
var LibaptMixinQueryEditorOrders =
{
	/**
	 * @memberof			LibaptMixinQueryEditorOrders
	 * @public
	 * @method				draw_query_orders_editor(arg_model_view_obj, arg_container_jqo)
	 * @desc				Draw query orders editor
	 * @param {object}		arg_model_view_obj			Model view containing the query to edit
	 * @param {object}		arg_container_jqo			JQuery object to attach the editor to
	 * @return {boolean}	true:success,false:failure
	 */
	draw_query_orders_editor: function(arg_model_view_obj, arg_container_jqo)
	{
		var self = this;
		var context = 'draw_query_orders_editor()';
		this.enter(context, '');
		
		
		// CHECK VIEW AND CONTAINER
		self.assertNotNull(context, 'view', arg_model_view_obj);
		this.assertNotNull(context, 'jqo', arg_container_jqo);
		
		// CREATE SELECT2 INPUT CONTAINER
		var label_jqo = $('<span>Edit the fields orders of the query</span>');
		arg_container_jqo.append(label_jqo);
		
		// CREATE SELECT2 HIDDEN INPUT
		var input_jqo = $('<input type="hidden"/>')
		arg_container_jqo.append(input_jqo);
		
		// LOOP ON VIEW QUERY FIELDS
		var selected_tags_str		= '';
		var all_tags_array	= [];
		var all_tags_map	= new Object();
		for(field_key in arg_model_view_obj.query.fields_set.fields)
		{
			// GET THE CURRENT FIELD
			var field = arg_model_view_obj.query.fields_set.fields[field_key];
			
			// DO NOTHING IF THE FIELD IS NOT VISIBLE IN THE MODEL VIEW
			if (! field.is_visible)
			{
				continue;
			}
			
			// CREATE ORDER FOR FIELD (ASC)
			var tag_obj_asc =
				{
					id:field.label + ' ASC',
					text: field.label + ' ASC',
					mode: 'ASC',
					field: field
				}
			all_tags_array.push(tag_obj_asc);
			all_tags_map[tag_obj_asc.id] = tag_obj_asc;
			if ( arg_model_view_obj.query.orders_set.has_order_for_field(field.name, 'ASC') )
			{
				selected_tags_str += (selected_tags_str == '') ? '' : ',';
				selected_tags_str += tag_obj_asc.text;
			}
			
			// CREATE ORDER FOR FIELD (DESC)
			var tag_obj_desc =
				{
					id:field.label + ' DESC',
					text: field.label + ' DESC',
					mode: 'DESC',
					field: field
				}
			all_tags_array.push(tag_obj_desc);
			all_tags_map[tag_obj_desc.id] = tag_obj_desc;
			if ( arg_model_view_obj.query.orders_set.has_order_for_field(field.name, 'DESC') )
			{
				selected_tags_str += (selected_tags_str == '') ? '' : ',';
				selected_tags_str += tag_obj_desc.text;
			}
		}
		
		
		// ORDER VALUE RENDER
		function order_render_result(arg_tag_obj, arg_tag_jqo, arg_query_obj)
		{
			return arg_tag_obj.text;
		}
		
		function order_render_selection(arg_tag_obj, arg_tag_jqo, arg_query_obj)
		{
			return arg_tag_obj.text;
		}
		
		// INIT SELECT2 INPUT
		input_jqo.attr('value', selected_tags_str);
		input_jqo.select2(
			{
				formatResult: order_render_result,
				formatSelection: order_render_selection,
				escapeMarkup: function(m) { return m; },
				tags:all_tags_array,
				containerCss:'min-width:100px;'
			}
		);
		input_jqo.select2('container').find('ul.select2-choices').sortable(
			{
				containment: 'parent',
				start: function() { input_jqo.select2("onSortStart"); },
				update: function() { input_jqo.select2("onSortEnd"); }
			}
		);
		input_jqo.parent().children('.select2-container').css('min-width', '150px');
		
		// INIT SELECT2 LABEL
		label_jqo.css('margin-right', '20px');
		label_jqo.css('margin-top', '10px');
		label_jqo.css('margin-bottom', '10px');
		
		
		// SET SELECT2 CHANGE EVENT HANDLER
		input_jqo.on("change", function()
			{
				// GET SELECTED TAGS
				var selected_fields_labels_str = input_jqo.val();
				var selected_fields_labels_array = selected_fields_labels_str.split(',');
				
				// REMOVE ALL EXISTING ORDERS
				arg_model_view_obj.query.orders_set.remove_all_orders();
				
				// LOOP ON SELECTED TAGS
				for(var index = 0 ; index < selected_fields_labels_array.length ; index++)
				{
					var field_label = selected_fields_labels_array[index];
					self.value(context + 'on change', 'field_label', field_label);
					
					var tag_obj = all_tags_map[field_label];
					self.value(context + 'on change', 'tag_obj', tag_obj);
					
					if ( ! arg_model_view_obj.query.orders_set.has_order_for_field(tag_obj.field.name) )
					{
						arg_model_view_obj.query.orders_set.add_order( new LibaptOrder(tag_obj.field,tag_obj.mode) );
					}
				}
				
				// arg_model_view_obj.adjust_sizes();
			}
		);
		
		input_jqo.css('margin', '10px');
		
		this.leave(context, 'success');
		return true;
	}
};
