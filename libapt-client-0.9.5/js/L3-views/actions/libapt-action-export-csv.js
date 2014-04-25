/**
 * @file        libapt-action-export-csv.js
 * @desc        CSV export action class
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
 * @public
 * @class					LibaptLibaptActionExportCSV
 * @desc					Export to CSV file action class
 * @param {string}			arg_name			action name
 * @param {string}			arg_model_view		model view object
 * @param {object|null}		arg_options			associative array of name/value options
 */
function LibaptActionExportCSV(arg_name, arg_model_view, arg_options)
{
	var options = Libapt.is_null(arg_options) ? LibaptActionExportCSV.default_options :  $.extend(LibaptActionExportCSV.default_options, arg_options);
	
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportCSV';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	this.eol			= '\n';
	this.fs				= ';';
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptActionExportCSV
	 * @desc				Do the action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
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
		if ( ! self.model_view.mixin_view_table_head_jqo )
		{
			self.leave(context, 'the model view is not a table view');
			return true;
		}
		
		
		var csv_str = '';
		
		// FILL WINDOW WITH EXPORT
		$('tr.libapt_header_fields', self.model_view.mixin_view_table_head_jqo).each(
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
		
		$('tr', self.model_view.mixin_view_table_body_jqo).each(
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
		
		$('tr', self.model_view.mixin_view_table_foot_jqo).each(
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
			// TODO : assume callback result is not boolean
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptActionExportCSV
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
Libapt.register_class(LibaptActionExportCSV, ['LibaptAction'], 'Luc BORIES', '2013-08-21', 'Action to export datas to CSV file.');


// INTROSPETION : REGISTER OPTIONS



