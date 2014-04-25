/**
 * @file        libapt-action-export-html.js
 * @brief       HTML export action class
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
LibaptActionExportHTML.default_options = {
	'label'				: 'HTML export',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Export the view datas in a HTML file',
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
	
	'icon_name_16'		: 'files/html_file-16.png',
	'icon_name_24'		: 'files/html_file-24.png',
	'icon_name_32'		: 'files/html_file-32.png',
	'icon_name_48'		: 'files/html_file-48.png',
	'icon_name_64'		: 'files/html_file-64.png',
	'icon_name_96'		: 'files/html_file-96.png',
	'icon_name_128'		: 'files/html_file-128.png'
}


/**
 * @brief		Action class
 * @param[in]	arg_name			action name (string)
 * @param[in]	arg_model_view		model view object (object)
 * @param[in]	arg_options			associative array of name/value options (object or null)
 */
function LibaptActionExportHTML(arg_name, arg_model_view, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportHTML';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	if ( Libapt.is_null(arg_options) )
	{
		$.extend(this, LibaptActionExportHTML.default_options);
	}
	else
	{
		$.extend(this, LibaptActionExportHTML.default_options, arg_options);
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
		
		// var wdialog_label = 'HTML Export';
		// var buttons_array = [ { text:wdialog_label, click:apply_cb} ];
		wdialog.dialog( {auto:true, modal:false, buttons:null} );
		
		wdialog.dialog('option', 'width', 600);
		wdialog.dialog('option', 'height', 400);
		
		wdialog.dialog('option', 'minWidth', 300);
		wdialog.dialog('option', 'minHeight', 300);
		
		
		// CREATE WINDOW TABLE
		var table = $('<table></table>');
		var thead = $('<thead></thead>');
		var tbody = $('<tbody></tbody>');
		var tfoot = $('<tfoot></tfoot>');
		table.append(thead);
		table.append(tbody);
		table.append(tfoot);
		wdialog.append(table);
		// console.log(this.model_view.table_head_jqo.html());
		
		// FILL WINDOW WITH EXPORT
		$('tr.libapt_header_fields:visible', this.model_view.table_head_jqo).each(
			function(tr_index, tr_item)
			{
				var tr = $('<tr></tr>');
				thead.append(tr);
				
				$('th:visible', tr_item).each(
					function(th_index, th_item)
					{
						var th = $('<th></th>');
						tr.append(th);
						
						th.text( $(th_item).text() );
					}
				);
			}
		);
		
		$('tr', this.model_view.table_body_jqo).each(
			function(tr_index, tr_item)
			{
				var tr = $('<tr></tr>');
				tbody.append(tr);
				
				$('td', tr_item).each(
					function(td_index, td_item)
					{
						if ($(td_item).css('display') != 'none')
						{
							var td = $('<td></td>');
							tr.append(td);
							
							// var img = $('');
							// td.append(img);
							
							td.html( '<img src="/libapt-demo-0.9.4/../libapt-images-0.9.4/images/files/csv_file-128.png"/> ' + $(td_item).text() );
						}
					}
				);
			}
		);
		
		$('tr:visible', this.model_view.table_foot_jqo).each(
			function(tr_index, tr_item)
			{
				var tr = $('<tr></tr>');
				tfoot.append(tr);
				
				$('th:visible', tr_item).each(
					function(th_index, th_item)
					{
						var th = $('<th></th>');
						tr.append(th);
						
						th.text( $(th_item).text() );
					}
				);
			}
		);
		
		
		
		// window.open(url_str, "image", window_sizes);
		
		var http_header = 'data:application/html;charset=utf-8,';
		var html_str = wdialog.html();
		var url_str = encodeURI(http_header + html_str);
		
		var link = document.createElement("a");
		link.setAttribute("href", url_str);
		link.setAttribute("download", "export.html");
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

Libapt.register_inheritance(LibaptActionExportHTML, LibaptAction);


