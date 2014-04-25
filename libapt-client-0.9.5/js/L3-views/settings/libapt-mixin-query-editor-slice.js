	/**
 * @file        libapt-mixin-query-editor-slice.js
 * @desc        Query slice editor
 * @see			libapt-action.js libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinQueryEditorSlice
 * @public
 * @desc				Mixin of query editor for slice
 */
var LibaptMixinQueryEditorSlice =
{
	/**
	 * @memberof			LibaptMixinQueryEditorSlice
	 * @public
	 * @method				draw_query_orders_editor(arg_callback, arg_container_jqo)
	 * @desc				Draw query slice editor
	 * @param {object}		arg_model_view_obj			Model view containing the query to edit
	 * @param {object}		arg_container_jqo			JQuery object to attach the editor to
	 * @return {boolean}	true:success,false:failure
	 */
	draw_query_slice_editor: function(arg_model_view_obj, arg_container_jqo)
	{
		var self = this;
		var context = 'draw_query_slice_editor()';
		this.enter(context, '');
		
		
		// CHECK VIEW AND CONTAINER
		self.assertNotNull(context, 'view', arg_model_view_obj);
		this.assertNotNull(context, 'jqo', arg_container_jqo);
		
		var slice_object = arg_model_view_obj.query.get_slice();
		var default_min	= Libapt.is_null(slice_object) ? 0 : slice_object.offset;
		var default_max	= Libapt.is_null(slice_object) ? 1000 : slice_object.length;
		
		// CHECK VIEW AND CONTAINER
		self.assertNotNull(context, 'view', arg_model_view_obj);
		this.assertNotNull(context, 'jqo', arg_container_jqo);
		
		// CREATE RANGE MIN
		var range_min_value_jqo = $('<input type="text" class="input-text digits" value="' + default_min + '"/>');
		range_min_value_jqo.uniqueId();
		
		// CREATE RANGE MAX
		var range_max_value_jqo = $('<input type="text" class="input-text digits" value="' + default_max + '"/>');
		range_max_value_jqo.uniqueId();
		
		// CREATE RANGE MIN LIMIT
		var range_min_limit_jqo = $('<input type="text" class="input-text digits" value="0"/>');
		range_min_limit_jqo.uniqueId();
		
		// CREATE RANGE MAX LIMIT
		var range_max_limit_jqo = $('<input type="text" class="input-text digits" value="10000"/>');
		range_max_limit_jqo.uniqueId();
		
		// CREATE RANGE SLIDER
		var slice_settings_label = 'Edit the slice of the query';
		arg_container_jqo.append('<span>' + slice_settings_label + '</span>');
		var slider_jqo = $('<div></div>');
		arg_container_jqo.append(slider_jqo);
		slider_jqo.slider(
			{
				range: true,
				min: 0,
				max: 10000,
				step: 10,
				values: [ default_min, default_max ],
				slide: function( event, ui )
					{
						var offset	= ui.values[0];
						var length	= ui.values[1] - offset;
						offset = offset >= 0 ? offset : 0;
						length = length >= 0 ? length : 10;
						arg_model_view_obj.query.set_slice(offset, length);
						range_min_value_jqo.val(offset);
						range_max_value_jqo.val(length);
					}
			}
		);
		slider_jqo.css('margin', '10px');
		
		
		// CREATE FORM
		var form = $('<form></form>');
		arg_container_jqo.append(form);
		
		
		// SLICE VALUES
		var fieldset_values_legend = 'Slice values';
		var fieldset_values = $('<fieldset></fieldset>');
		fieldset_values.append( $('<legend>' + fieldset_values_legend + '</legend>') );
		form.append(fieldset_values);
		
		var range_min_value_label = 'Min';
		fieldset_values.append('<label for="' + range_min_value_jqo.attr('id') + '">' + range_min_value_label + '</label>');
		fieldset_values.append(range_min_value_jqo);
		range_min_value_jqo.css('width', '100px');
		
		var range_max_value_label = 'Max';
		fieldset_values.append('<label for="' + range_max_value_jqo.attr('id') + '">' + range_max_value_label + '</label>');
		fieldset_values.append(range_max_value_jqo);
		range_max_value_jqo.css('width', '100px');
		
		
		// SLICE LIMITS
		var fieldset_limits_legend = 'Range limits';
		var fieldset_limits = $('<fieldset></fieldset>');
		fieldset_limits.append( $('<legend>' + fieldset_limits_legend + '</legend>') );
		form.append(fieldset_limits);
		
		var range_min_limit_label = 'Min';
		fieldset_limits.append('<label for="' + range_min_limit_jqo.attr('id') + '">' + range_min_limit_label + '</label>');
		fieldset_limits.append(range_min_limit_jqo);
		range_min_limit_jqo.css('width', '100px');
		
		var range_max_limit_label = 'Max';
		fieldset_limits.append('<label for="' + range_max_limit_jqo.attr('id') + '">' + range_max_limit_label + '</label>');
		fieldset_limits.append(range_max_limit_jqo);
		range_max_limit_jqo.css('width', '100px');
		
		
		// ENABLE FORM VALIDATION
		form.validate();
		
		
		// RANGE MIN VALUE EVENT HANDLER
		range_min_value_jqo.on("change", function()
			{
				var min_value = parseInt( range_min_value_jqo.val() );
				var max_value = parseInt( range_max_value_jqo.val() );
				if (min_value >= 0)
				{
					slider_jqo.slider('values', 0, min_value);
					arg_model_view_obj.query.set_slice(min_value, max_value - min_value);
				}
			}
		);
		
		// RANGE MAX VALUE EVENT HANDLER
		range_max_value_jqo.on("change", function()
			{
				var min_value = parseInt( range_min_value_jqo.val() );
				var max_value = parseInt( range_max_value_jqo.val() );
				if (max_value >= 0)
				{
					slider_jqo.slider('values', 1, max_value);
					arg_model_view_obj.query.set_slice(min_value, max_value - min_value);
				}
			}
		);
		
		// RANGE MIN LIMIT EVENT HANDLER
		range_min_limit_jqo.on("change", function()
			{
				var min_limit = parseInt( range_min_limit_jqo.val() );
				if (min_limit >= 0)
				{
					slider_jqo.slider('option', 'min', min_limit);
				}
			}
		);
		
		// RANGE MAX LIMIT EVENT HANDLER
		range_max_limit_jqo.on("change", function()
			{
				var max_limit = parseInt( range_max_limit_jqo.val() );
				if (max_limit > 0)
				{
					slider_jqo.slider('option', 'max', max_limit);
				}
			}
		);
		
		
		this.leave(context, 'success');
		return true;
	}
};
