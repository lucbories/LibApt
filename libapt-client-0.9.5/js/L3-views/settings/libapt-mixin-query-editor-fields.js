/**
 * @file        libapt-mixin-query-editor-fields.js
 * @desc        Query fields editor
 * @see			libapt-action.js libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinQueryEditorFields
 * @public
 * @desc				Mixin of query editor for fields
 */
var LibaptMixinQueryEditorFields =
{
	/**
	 * @memberof			LibaptMixinQueryEditorFields
	 * @public
	 * @method				draw_query_fields_editor(arg_callback, arg_container_jqo)
	 * @desc				Draw query fields editor
	 * @param {object}		arg_model_view_obj			Model view containing the query to edit
	 * @param {object}		arg_container_jqo			JQuery object to attach the editor to
	 * @return {boolean}	true:success,false:failure
	 */
	draw_query_fields_editor: function(arg_model_view_obj, arg_container_jqo)
	{
		var self = this;
		var context = 'draw_query_fields_editor(view,container)';
		self.enter(context, '');
		
		
		// CHECK VIEW AND CONTAINER
		self.assertNotNull(context, 'view', arg_model_view_obj);
		self.assertNotNull(context, 'jqo', arg_container_jqo);
		
		// CREATE SELECT2 INPUT CONTAINER
		var label_jqo = $('<span>Edit the ordered fields of the query</span>');
		arg_container_jqo.append(label_jqo);
		
		// CREATE SELECT2 HIDDEN INPUT
		var input_jqo = $('<input type="hidden"/>')
		arg_container_jqo.append(input_jqo);
		
		// LOOP ON VIEW QUERY FIELDS
		var selected_tags_str	= '';
		var all_tags_array		= [];
		var all_tags_map		= new Object();
		for(field_key in arg_model_view_obj.query.fields_set.fields)
		{
			// GET THE CURRENT FIELD
			var field = arg_model_view_obj.query.fields_set.fields[field_key];
			
			// DO NOTHING IF THE FIELD IS NOT VISIBLE IN THE MODEL VIEW
			if (! field.is_visible)
			{
				continue;
			}
			
			// TEST IF THE FIELD IS HIDDEN
			var field_is_hidden = arg_model_view_obj.visible_fields.indexOf(field) < 0;
			if (! field_is_hidden)
			{
				selected_tags_str += (selected_tags_str == '') ? '' : ',';
				selected_tags_str += field.label;
			}
			
			// REGISTER TAGS
			all_tags_array.push(field.label);
			all_tags_map[field.label] = field;
		}
		
		
		// INIT SELECT2
		input_jqo.attr('value', selected_tags_str);
		input_jqo.select2( { tags:all_tags_array, containerCss:'min-width:100px;' } );
		input_jqo.select2('container').find('ul.select2-choices').sortable(
			{
				containment: 'parent',
				start:  function() { input_jqo.select2("onSortStart"); },
				update: function() { input_jqo.select2("onSortEnd"); }
			}
		);
		
		input_jqo.parent().children('.select2-container').css('min-width', '150px');
		
		label_jqo.css('margin-right', '20px');
		label_jqo.css('margin-top', '10px');
		label_jqo.css('margin-bottom', '10px');
		
		
		// SET SELECT2 CHANGE EVENT HANDLER
		input_jqo.on("change", function()
			{
				// GET SELECTED TAGS
				var selected_fields_labels_str = input_jqo.val();
				var selected_fields_labels_array = selected_fields_labels_str.split(',');
				
				// REMOVE ALL EXISTING VISIBLE FIELDS
				arg_model_view_obj.visible_fields = [];
				
				// LOOP ON SELECTED TAGS
				for(var index = 0 ; index < selected_fields_labels_array.length ; index++)
				{
					var field_label = selected_fields_labels_array[index];
					var field = all_tags_map[field_label];
					if (field && field.is_visible)
					{
						arg_model_view_obj.visible_fields.push(field);
					}
				}
				
				arg_model_view_obj.adjust_sizes();
			}
		);
		
		input_jqo.css('margin', '10px');
		
		this.leave(context, 'success');
		return true;
	}
};
