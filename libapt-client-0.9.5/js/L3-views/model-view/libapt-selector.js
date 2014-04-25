/**
 * @file        libapt-selector.js
 * @desc       Selector class
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @class					LibaptSelector
 * @desc					Selector class
 * @param {string}			arg_name			Selector name
 * @param {object}			arg_jqo				JQuery object to attach the view to
 * @param {object|null}		arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptSelector(arg_name, arg_jqo, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptModelView;
	self.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace					= false;
	self.class_name				= 'LibaptSelector';
	var context					= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	// Libapt.options_set_trace = true;
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	// Libapt.options_set_trace = false;
	
	// SELECTOR ATTRIBUTES
	self.editor_jqo		 		= null;
	this.has_multiple_selection	= this.selector_type == 'select_multiple';
	this.value(context, 'selector_type', this.selector_type);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	/**
	 * @public
	 * @memberof			LibaptSelector
	 * @desc				Draw selector
	 * @param {object}		arg_values_record	Record of values as an associative array
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw = function(arg_values_record)
	{
		var self = this;
		var context = 'draw(record)';
		this.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-begin');
		
		// DRAW TITLE BAR
		// self.draw_title_bar();
		
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
			console.log(field);
			this.step(context, 'selector is not visible or not editable');
			this.editor_jqo = field.get_field_editor(value, field.is_visible, field.is_editable, true);
		}
		else
		{
			this.step(context, 'selector is visible and editable');
			var selector_all_label	= this.has_all_item ? this.all_label : null;
			var selector_all_value	= this.has_all_item ? 'selector_all' : null;
			// var all_fields_names	= this.query.fields_set.get_fields_name();
			var all_fields_names	= [];
			var selected_records	= [];
			if ( Libapt.is_string(selector_all_label) )
			{
				var selected_record		= {};
				selected_record[field.name] = selector_all_label;
				selected_records.push(selected_record);
			}
			this.editor_jqo = LibaptEditors.get_select_editor_jqo(field, selected_records, field.name, all_fields_names, 'concat', '.', this, selector_all_label, selector_all_value);
			
			if (this.has_multiple_selection)
			{
				if ( this.editor_jqo.find('SELECT').length > 0 )
				{
					this.editor_jqo.find('SELECT').attr('multiple', 'multiple');
				}
			}
			
			if ( ! this.has_refresh_button)
			{
				$('.libapt_refresh_button', this.editor_jqo).hide();
			}
			else
			{
				$('.libapt_refresh_button', this.editor_jqo).show();
			}
			
			if ( ! this.has_add_record_button)
			{
				$('.libapt_add_record_button', this.editor_jqo).hide();
			}
			else
			{
				$('.libapt_add_record_button', this.editor_jqo).show();
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
		
		
		// FIRE EVENT (END)
		self.fire_event('draw-end');
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptSelector
	 * @desc				Get the selected field
	 * @return {object}		selected field LibaptField object
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
	 * @public
	 * @memberof			LibaptSelector
	 * @desc				Get the selected value
	 * @return {string}		selected value string
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
	 * @public
	 * @memberof			LibaptSelector
	 * @desc				On change event
	 * @return {boolean}	true:success,false:failure
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
			var escaped_value = editor_value;
			if ( ! Libapt.is_null(editor_value) )
			{
				var editor_values_record = {};
				var regexp = /:/gi;
				escaped_value = editor_value.replace(regexp, '\\doublepoint');
			}
			this.value(context, 'current selected escaped value', escaped_value);
			editor_values_record[editor_field.name] = escaped_value;
			
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
	 * @public
	 * @memberof			LibaptSelector
	 * @desc				Refresh the view
	 * @return {boolean}	true:success,false:failure
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
	 * @public
	 * @memberof			LibaptSelector
	 * @desc				On refresh event
	 * @return {boolean}	true:success,false:failure
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
	
	
	/**
	 * @public
	 * @memberof			LibaptSelector
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return
			this.to_string_value('all_groups', this.all_groups)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptSelector, ['LibaptModelView'], 'Luc BORIES', '2013-08-21', 'Dygraoh view class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_str_option(LibaptSelector, 'selector_type',					'select_one', true, []);
Libapt.register_str_option(LibaptSelector, 'all_label',						'all', false, ['all_item_label', 'selector_all_label']);

Libapt.register_bool_option(LibaptSelector, 'has_all_item',					false, false, ['selector_has_all_item']);
Libapt.register_bool_option(LibaptSelector, 'has_refresh_button',			false, false, ['selector_has_refresh_button']);
Libapt.register_bool_option(LibaptSelector, 'has_add_record_button',		true, false, ['selector_has_add_record_button']);
Libapt.register_bool_option(LibaptSelector, 'refresh_fired_views',			false, false, ['selector_refresh_fired_views']);
Libapt.register_bool_option(LibaptSelector, 'save_selection',				false, false, ['selector_save_selection']);
