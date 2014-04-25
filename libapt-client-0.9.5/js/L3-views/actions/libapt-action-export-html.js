/**
 * @file        libapt-action-export-html.js
 * @desc        HTML export action class
 * @see			libapt-action.js libapt-object.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @desc		Default options of the action
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
 * @public
 * @class					LibaptLibaptActionExportHTML
 * @desc					Export to HTML file action class
 * @param {string}			arg_name			action name
 * @param {string}			arg_model_view		model view object
 * @param {object|null}		arg_options			associative array of name/value options
 */
function LibaptActionExportHTML(arg_name, arg_model_view, arg_options)
{
	var options = Libapt.is_null(arg_options) ? LibaptActionExportHTML.default_options :  $.extend(LibaptActionExportHTML.default_options, arg_options);
	
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportHTML';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptActionExportHTML
	 * @desc				Do the action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}
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
		
		if ( ! this.model_view.mixin_view_table_head_jqo )
		{
			this.leave(context, 'the model view is not a table view');
			return true;
		}
		
		
		// CREATE AND OPEN DIALOG
		var wdialog = $('<div><div>');
		
		// var wdialog_label = 'HTML Export';
		// var buttons_array = [ { text:wdialog_label, click:apply_cb} ];
		wdialog.dialog( {auto:true, modal:false, buttons:null} );
		
		// wdialog.dialog('option', 'width', 600);
		// wdialog.dialog('option', 'height', 400);
		
		// wdialog.dialog('option', 'minWidth', 300);
		// wdialog.dialog('option', 'minHeight', 300);
		
		
		// CREATE WINDOW TABLE
		var table = $('<table></table>');
		var thead = $('<thead></thead>');
		var tbody = $('<tbody></tbody>');
		var tfoot = $('<tfoot></tfoot>');
		table.append(thead);
		table.append(tbody);
		table.append(tfoot);
		wdialog.append(table);
		// console.log(this.model_view.mixin_view_table_head_jqo.html());
		
		// FILL WINDOW WITH EXPORT
		$('tr.libapt_header_fields:visible', this.model_view.mixin_view_table_head_jqo).each(
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
		
		$('tr', this.model_view.mixin_view_table_body_jqo).each(
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
							td.html( $(td_item).text() );
						}
					}
				);
			}
		);
		
		$('tr:visible', this.model_view.mixin_view_table_foot_jqo).each(
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
			// TODO : assume callback result is not boolean
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptActionExportHTML
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return '';
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptActionExportHTML, ['LibaptAction'], 'Luc BORIES', '2013-08-21', 'Action to export datas to HTML file.');


// INTROSPETION : REGISTER OPTIONS
