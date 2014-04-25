	/**
 * @file        libapt-mixin-axis-editor-fields.js
 * @desc        Pivot axis fields editor
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinAxisEditorFields
 * @public
 * @desc				Mixin of axis editor for fields
 */
var LibaptMixinAxisEditorFields =
{
	/**
	 * @memberof			LibaptMixinAxisEditorFields
	 * @public
	 * @method				draw_axis_editor(arg_callback, arg_container_jqo)
	 * @desc				Draw query fields editor
	 * @param {object}		arg_model_view_obj			Model view containing the axis to edit
	 * @param {object}		arg_axis_obj				Axis object
	 * @param {object}		arg_container_jqo			JQuery object to attach the editor to
	 * @return {boolean}	true:success,false:failure
	 */
	draw_axis_editor: function(arg_model_view_obj, arg_axis_obj, arg_container_jqo)
	{
		var self = this;
		// self.trace = true;
		
		var context = 'draw_axis_editor(view,axis,container)';
		self.enter(context, '');
		
		
		// CHECK VIEW AND CONTAINER
		self.assertNotNull(context, 'axis', arg_axis_obj);
		self.assertNotNull(context, 'jqo', arg_container_jqo);
		
		// CREATE SELECT2 INPUT CONTAINER
		var label_jqo = $('<span>Edit the ordered fields of the axis</span>');
		arg_container_jqo.append(label_jqo);
		
		// CREATE SELECT2 HIDDEN INPUT
		var input_jqo = $('<input type="hidden"/>')
		arg_container_jqo.append(input_jqo);
		
		
		// LOOP ON QUERY FIELDS
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
			
			// REGISTER TAGS
			all_tags_array.push(field.label);
			all_tags_map[field.label] = field;
		}
		self.value(context, 'all_tags_array', all_tags_array);
		self.value(context, 'all_tags_map', all_tags_map);
		
		
		// LOOP ON GROUPS FIELDS
		var selected_tags_str	= '';
		for(group_key in arg_axis_obj.groups_array)
		{
			// GET THE CURRENT FIELD
			var group = arg_axis_obj.groups_array[group_key];
			var field = group.field;
			
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
		
		// self.trace = false;
		
		// SET SELECT2 CHANGE EVENT HANDLER
		input_jqo.on("change", function()
			{
				// self.trace = true;
				self.enter(context, '');
				
				// RESET AXIS
				arg_axis_obj.reset();
				
				// GET SELECTED TAGS
				var selected_fields_labels_str = input_jqo.val();
				var selected_fields_labels_array = selected_fields_labels_str.split(',');
				
				// NO SELECTED FIELDS
				if (selected_fields_labels_array.length == 0 || selected_fields_labels_str == '')
				{
					self.leave(context, 'no selected value');
					return;
				}
				
				// REMOVE ALL EXISTING VISIBLE FIELDS
				arg_axis_obj.remove_all_groups;
				
				// LOOP ON SELECTED TAGS
				for(var index = 0 ; index < selected_fields_labels_array.length ; index++)
				{
					var field_label = selected_fields_labels_array[index];
					self.value(context, 'field_label', field_label);
					
					var field = all_tags_map[field_label];
					self.assertNotNull(context, 'field', field);
					
					if (field && field.is_visible)
					{
						self.step(context, 'group added for field.name=[' + field.name + ']');
						arg_axis_obj.add_group(field, field.label);
					}
				}
				
				// REFRESH AXIS
				self.assertTrue(context, 'refresh_axis', arg_model_view_obj.refresh_axis());
				
				self.leave(context, 'selected values=[' + selected_fields_labels_array.length + ']');
				// self.trace = false;
			}
		);
		
		input_jqo.css('margin', '10px');
		
		this.leave(context, 'success');
		return true;
	}
};
