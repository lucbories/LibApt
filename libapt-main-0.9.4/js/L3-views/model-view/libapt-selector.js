/**
 * @file        libapt-selector.js
 * @brief       Selector class
 * @details     ...
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Selector class
 * @param[in]	arg_name			Selector name (string)
 * @param[in]	arg_jqo				JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptSelector(arg_name, arg_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptModelView;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptSelector';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// SELECTOR ATTRIBUTES
	this.editor_jqo		 		= null;
	this.refresh_fired_views	= true;
	this.has_multiple_selection	= this.selector_type == 'select_multiple';
	this.value(context, 'selector_type', this.selector_type);
	
	// INIT OPTIONS
	if ( ! Libapt.is_boolean(this.has_all_item) )
	{
		var str = this.has_all_item.toLocaleLowerCase();
		this.has_all_item = false;
		switch (str)
		{
			case '1':
			case 'true':
			case 'on':
				this.has_all_item = true;
				break;
		}
	}
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Draw selector
	 * @param[in]	arg_values_record	Record of values as an associative array (object)
	 * @return		boolean				true:success,false:failure
	 */
	this.draw = function(arg_values_record)
	{
		var context = 'draw(record)';
		this.enter(context, '');
		
		// INIT
		this.has_multiple_selection	= this.selector_type == 'select_multiple';
		
		// GET SELECTOR FIELDS
		var field = this.get_selected_field();
		
		// GET THE CURRENT FIELD
		this.assertNotNull(context, 'field', field);
		
		// GET THE CURRENT FIELD VALUE IN THE 'SELECTED VALUES' RECORD
		var value = Libapt.is_null(arg_values_record) ? null : arg_values_record[field.name];
		
		// CREATE THE FIELD EDITOR
		if ( ! field.is_visible || ! field.is_editable)
		{
			this.step(context, 'selector is not visible or not editable');
			this.editor_jqo = field.get_field_editor(value, field.is_visible, field.is_editable, true);
		}
		else
		{
			this.step(context, 'selector is visible and editable');
			var all_label	= this.has_all_item ? (this.all_item_label ? this.all_item_label : 'all') : null;
			var all_value	= this.has_all_item ? 'selector_all' : null;
			// var all_fields_names	= this.query.fields_set.get_fields_name();
			var all_fields_names	= [];
			this.editor_jqo = LibaptEditors.get_select_editor_jqo(field, [value], field.name, all_fields_names, 'concat', '.', this, all_label, all_value);
			
			if (this.has_multiple_selection)
			{
				if ( this.editor_jqo.find('SELECT').length > 0 )
				{
					this.editor_jqo.find('SELECT').attr('multiple', 'multiple');
				}
			}
		}
		this.assertNotNull(context, 'editor', this.editor_jqo);
		this.editor_jqo.uniqueId();
		this.on_refresh();
		
		// APPEND EDITOR LABEL AND TAG TO THE SELECTOR CONTAINER
		this.container_jqo.append('<label for="' + this.editor_jqo.attr('id') + '">' + field.label + '</label>');
		this.container_jqo.append(this.editor_jqo);
		
		
		// HANDLE EDITOR CHANGE EVENT
		var self = this;
		this.editor_jqo.change(
			function()
			{
				var context = 'editor_jqo.change()';
				self.enter(context, 'on jqo change');
				
				// ON CHANGE HANDLER
				self.on_change();
				
				self.leave(context, 'success');
			}
		);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Get the selected field
	 * @return		object				selected field LibaptField object
	 */
	this.get_selected_field = function()
	{
		var context = 'get_selected_field()';
		this.enter(context, '');
		
		// GET EDITOR SELECTED FIELD
		var field = this.query.fields_set.fields[0];
		this.value(context, 'field.name', field.name);
		
		this.leave(context, 'success');
		return field;
	}
	
	
	/**
	 * @brief		Get the selected value
	 * @return		string				selected value string
	 */
	this.get_selected_values = function()
	{
		var context = 'get_selected_values()';
		this.enter(context, '');
		
		// GET EDITOR TAG VALUE
		var editor_values = this.editor_jqo.val();
		
		// GET EDITOR SELECT VALUE
		var editor_children = this.editor_jqo.find('SELECT');
		if (editor_children.length > 0)
		{
			var select_jqo = $( editor_children[0] );
			editor_values = select_jqo.val();
		}
		
		this.value(context, 'editor.values', editor_values);
		
		this.leave(context, 'success');
		return editor_values;
	}
	
	
	/**
	 * @brief		On change event
	 * @return		boolean				true:success,false:failure
	 */
	this.on_change = function()
	{
		var context = 'on_change()';
		this.enter(context, '');
		
		
		// FIRE 'UPDATED' EVENT
		this.fire_event("updated");
		
		
		// GET SELECTED VALUES
		var editor_field = this.get_selected_field();
		var editor_values = this.get_selected_values();
		if ( ! Libapt.is_array(editor_values) )
		{
			editor_values = [editor_values];
		}
		
		// REMOVE PREVIOUS FILTERS
		this.fire_unlinks(this.query.fields_set, false);
		
		
		// LOOP ON SELECTED VALUES
		var all_is_selected = false;
		var editor_values_records = [];
		
		this.step(context, 'loop on selected [' + editor_values.length + '] values');
		for(selected_value_index in editor_values)
		{
			// GET CURRENT SELECTED VALUE
			var editor_value = editor_values[selected_value_index];
			this.value(context, 'current selected value', editor_value);
			
			// CREATE CURRENT SELECTED RECORD
			var editor_values_record = {};
			editor_values_record[editor_field.name] = editor_value;
			
			// APPEND CURRENT SELECTED RECORD TO ALL SELECTED RECORDS
			editor_values_records.push(editor_values_record);
			
			// ALL IS SELECTED : REMOVE LINKS FILTERS ON TARGET VIEWS
			if (editor_value == "selector_all")
			{
				all_is_selected = true;
				this.fire_unlinks(this.query.fields_set, this.refresh_fired_views);
				break;
			}
		}
		
		// ONE OR MORE VALUES ARE SELECTED : APPEND/UPDATE FILTERS ON TARGET VIEWS
		if (!all_is_selected)
		{
			this.fire_links(this.query.fields_set, editor_values_records, this.refresh_fired_views, this.has_multiple_selection, true);
		}
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(this.js_on_change) )
		{
			eval(this.js_on_change);
		}
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Refresh the view
	 * @return		boolean			true:success,false:failure
	 */
	this.refresh = function()
	{
		var context = 'refresh()';
		this.enter(context, '');
		
		this.editor_jqo.children('.libapt_refresh_button').trigger('click');
		
		// ON REFRESH HANDLER
		this.on_refresh();
		
		// ON CHANGE HANDLER
		this.on_change();
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		On refresh event
	 * @return		boolean				true:success,false:failure
	 */
	this.on_refresh = function()
	{
		var context = 'on_refresh()';
		this.enter(context, '');
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(this.js_on_refresh) )
		{
			eval(this.js_on_refresh);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return
			this.to_string_value('all_groups', this.all_groups)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptSelector, LibaptModelView);
