/**
 * @file        libapt-grid-table.js
 * @brief       Grid table class
 * @details     ...
 * @see			libapt-grid.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Grid table class
 * @param[in]	arg_name			Table name (string)
 * @param[in]	arg_jquery_obj		JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptGridTable(arg_name, arg_jquery_obj, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptGrid;
	this.inheritFrom(arg_name, arg_jquery_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace					= false;
	this.class_name				= 'LibaptGridTable';
	var context					= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// TABLE ATTRIBUTES
	this.content_jqo			= null;
	
	this.table_jqo				= null;
	this.table_head_jqo			= null;
	this.table_body_jqo			= null;
	this.table_foot_jqo			= null;
	
	this.css_fields_widths		= null;
	this.fill_on_load			= Libapt.to_boolean(this.fill_on_load, true);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Draw initialisation
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_init = function()
	{
		var context = 'draw_init()';
		this.enter(context, '');
		
		
		// FIRE EVENT
		this.fire_event('draw-init-begin');
		
		// CREATE MAIN TABLE NODES
		this.content_jqo = $('<div></div>');
		
		this.table_jqo = $('<table></table>');
		this.table_jqo.uniqueId();
		this.table_jqo.addClass('ui-widget ui-widget-content ui-widget ui-widget-content');
		this.table_jqo.css('margin-bottom', '0px');
		this.content_jqo.append(this.table_jqo);
		this.content_childs_jqo.push(this.table_jqo);
		
		this.table_head_jqo = $('<thead></thead>');
		this.table_head_jqo.addClass('ui-widget-header ui-widget-header');
		
		this.table_body_jqo = $('<tbody></tbody>');
		
		this.table_foot_jqo = $('<tfoot></tfoot>');
		
		this.table_jqo.append(this.table_head_jqo).append(this.table_body_jqo).append(this.table_foot_jqo);
		this.container_jqo.append(this.content_jqo);
		
		// FIRE EVENT
		this.fire_event('draw-init-end');
		
		
		this.leave(context, 'success');
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
		
		// this.refresh();
		
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
		var context = 'delete_record()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @brief		On filled event
	 * @return		boolean				true:success,false:failure
	 */
	this.on_filled = function()
	{
		var context = 'on_filled()';
		this.enter(context, '');
		
		// ON CHANGE HANDLER
		if ( ! Libapt.is_null(this.js_on_change) )
		{
			eval(this.js_on_change);
		}
		
		this.leave(context, '	');
		return true;
	}
	
	
	// TABLE EVENTS
	this.add_event_callback('filled', [this, this.on_filled]);
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptGridTable, LibaptGrid);
