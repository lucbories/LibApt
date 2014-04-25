/**
 * @file        libapt-action-export-print.js
 * @brief       CSV export action class
 * @details     
 * @see			libapt-action.js libapt-object.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Default options of the action
 */
LibaptActionExportPrint.default_options = {
	'label'				: 'Print',
	'icon_size'			: 32,
	
	'tooltip_label'		: 'Display and print',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 64,
	
	'is_enabled'		: true,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: 'print/print_16.png',
	'icon_name_24'		: null,
	'icon_name_32'		: 'print/print_32.png',
	'icon_name_48'		: 'print/print_48.png',
	'icon_name_64'		: 'print/print_64.png',
	'icon_name_96'		: null,
	'icon_name_128'		: null
}


/**
 * @brief		Action class
 * @param[in]	arg_name			action name (string)
 * @param[in]	arg_model_view		model view object (object)
 * @param[in]	arg_options			associative array of name/value options (object or null)
 */
function LibaptActionExportPrint(arg_name, arg_model_view, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportPrint';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	if ( Libapt.is_null(arg_options) )
	{
		$.extend(this, LibaptActionExportPrint.default_options);
	}
	else
	{
		$.extend(this, LibaptActionExportPrint.default_options, arg_options);
	}
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Do the action
	 * @param[in]	arg_operands	array of action operands (array)
	 * @return		boolean
	 */
	this.do_action = function(arg_operands)
	{
		var context = 'do_action(operands)';
		this.enter(context, '');
		
		
		if ( ! this.is_enabled )
		{
			this.leave(context, 'action is disabled');
			return true;
		}
		if ( ! this.model_view.table_head_jqo )
		{
			this.leave(context, 'the model view is not a table view');
			return true;
		}
		
		
		// CREATE AND OPEN DIALOG
		var wdialog = $('<div><div>');
		
		var button_label = 'Print';
		var buttons_array = [ { text:button_label, click: function() { window.print(); } } ];
		wdialog.dialog( {auto:true, modal:false, buttons:buttons_array} );
		
		wdialog.dialog('option', 'width', 600);
		wdialog.dialog('option', 'height', 400);
		
		wdialog.dialog('option', 'minWidth', 300);
		wdialog.dialog('option', 'minHeight', 300);
		
		
		// FINAL CALLBACK
		if ( this.do_cb )
		{
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		
		this.leave(context, '');
		return true;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return '';
	}
}

Libapt.register_inheritance(LibaptActionExportPrint, LibaptAction);


