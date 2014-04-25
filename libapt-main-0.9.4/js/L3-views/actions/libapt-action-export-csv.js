/**
 * @file        libapt-action-export-csv.js
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
LibaptActionExportCSV.default_options = {
	'label'				: 'CSV export',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Export the view datas in a CSV file',
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
	
	'icon_name_16'		: 'files/csv_file-16.png',
	'icon_name_24'		: 'files/csv_file-24.png',
	'icon_name_32'		: 'files/csv_file-32.png',
	'icon_name_48'		: 'files/csv_file-48.png',
	'icon_name_64'		: 'files/csv_file-64.png',
	'icon_name_96'		: 'files/csv_file-96.png',
	'icon_name_128'		: 'files/csv_file-128.png'
}


/**
 * @brief		Action class
 * @param[in]	arg_name			action name (string)
 * @param[in]	arg_model_view		model view object (object)
 * @param[in]	arg_action_type		action type: refresh/create/update/delete (string)
 * @param[in]	arg_options			associative array of name/value options (object or null)
 */
function LibaptActionExportCSV(arg_name, arg_model_view, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportCSV';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	this.eol			= '\n';
	this.fs				= ';';
	if ( Libapt.is_null(arg_options) )
	{
		$.extend(this, LibaptActionExportCSV.default_options);
	}
	else
	{
		$.extend(this, LibaptActionExportCSV.default_options, arg_options);
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
		var self = this;
		var context = 'do_action(operands)';
		this.enter(context, '');
		
		
		if ( ! self.is_enabled )
		{
			self.leave(context, 'action is disabled');
			return true;
		}
		if ( ! self.model_view.table_head_jqo )
		{
			self.leave(context, 'the model view is not a table view');
			return true;
		}
		
		
		var csv_str = '';
		
		// FILL WINDOW WITH EXPORT
		$('tr.libapt_header_fields', self.model_view.table_head_jqo).each(
			function(tr_index, tr_item, tr_array)
			{
				var th_array = $('th', tr_item);
				th_array.each(
					function(th_index, th_item)
					{
						csv_str += $(th_item).text() + (th_index < (th_array.length - 1) ? self.fs : '');
					}
				);
				
				csv_str += self.eol;
			}
		);
		
		$('tr', self.model_view.table_body_jqo).each(
			function(tr_index, tr_item)
			{
				var td_array = $('td', tr_item);
				td_array.each(
					function(td_index, td_item)
					{
						csv_str += $(td_item).text() + (td_index < (td_array.length - 1) ? self.fs : '');
					}
				);
				
				csv_str += self.eol;
			}
		);
		
		$('tr', self.model_view.table_foot_jqo).each(
			function(tr_index, tr_item)
			{
				var th_array = $('th', tr_item);
				th_array.each(
					function(th_index, th_item)
					{
						csv_str += $(th_item).text() + (th_index < (th_array.length - 1) ? self.fs : '');
					}
				);
				
				csv_str += self.eol;
			}
		);
		
		
		// DOWNLOAD LINK
		var http_header = 'data:application/csv;charset=utf-8,';
		var url_str = encodeURI(http_header + csv_str);
		
		var link = document.createElement("a");
		link.setAttribute("href", url_str);
		link.setAttribute("download", "export.csv");
		link.click();
		
		
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

Libapt.register_inheritance(LibaptActionExportCSV, LibaptAction);


