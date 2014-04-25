/**
 * @file        libapt-datatables.js
 * @brief       Datatables class
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
 * @desc				Datatables wrapper class
 * @param {string}		arg_name			Datatables name (string)
 * @param {object}		arg_jqo				JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptDatatables(arg_name, arg_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptGridTable;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptDatatables';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// DATATABLES ATTRIBUTES
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		On on_draw-init-end event
	 * @return		boolean				true:success,false:failure
	 */
	this.on_draw_init_end = function()
	{
		var self = this;
		var context = 'on_draw_init_end()';
		self.enter(context, '');
		
		
		// GET COLUMNS DEFINITIONS
		var columns_def = [];
		for(field_index in self.query.fields_set.fields)
		{
			var field			= self.query.fields_set.fields[field_index];
			var field_record	= {};
			
			// COLUMN NAME
			field_record.mDataProp		= field.name;
			
			// COLUMN IS VISIBLE ?
			field_record.bVisible		= field.is_visible;
			
			// COLUMN IS SEARCHABLE
			field_record.bSearchable	= field.is_visible;
			
			// COLUMN IS SORTABLE
			field_record.bSortable		= true;
			
			// COLUMN WIDTH
			if ( ! Libapt.is_null(self.css_fields_widths) )
			{
				if (self.css_fields_widths[field.name])
				{
					field_record.sWidth = self.css_fields_widths[field.name];
				}
			}
			
			// COLUMN LABEL
			field_record.sTitle			= field.label;
			
			// COLUMN TYPE
			var type = "string";
			switch(field.type)
			{
				case "Integer" : type = "numeric"; break;
				case "Float"   : type = "numeric"; break;
				case "Date"    : type = "date"; break;
			}
			field_record.sType			= type;
			
			columns_def.push(field_record);
		}
		
		
		// RESET UNUSED
		self.edit_toolbar	= null;
		self.pager			= null;
		self.draw_header	= null;
		
		
		// SHOW LOADER
		self.step(context, 'enable loader');
		self.enable_loader();
		
		// READ IS OK CALLBACK
		var ok_cb = function(datas)
			{
				self.enter(context, 'OK CALLBACK');
				
				
				// LOAD DATAS AND UPDATE VIEW
				// var fill_result = self.draw_fill_records(datas);
				var fill_result = true;
				
				// HIDE LOADER
				self.disable_loader();
				
				// UPDATE PAGER
				if (self.pager)
				{
					self.pager.update_items_count(datas.length);
					self.pager.refresh();
				}
				
				// ENABLE TOOLBAR REFRESH ACTION
				if (self.edit_toolbar)
				{
					self.edit_toolbar.enable_action('refresh');
				}
				
				if (self.after_refresh)
				{
					self.after_refresh();
				}
				
				// ON REFRESH HANDLER
				self.step(context, 'on refresh handler');
				if ( ! Libapt.is_null(self.js_on_refresh) )
				{
					if ( Libapt.is_string(self.js_on_refresh) )
					{
						eval(self.js_on_refresh);
					}
					else if ( Libapt.is_function(self.js_on_refresh) )
					{
						self.js_on_refresh();
					}
				}
				
				// UPDATE SIZES
				self.adjust_sizes();
				
				// FIRE EVENT
				self.fire_event('refresh-end');
				
				
				self.leave(context, 'OK CALLBACK');
				return fill_result;
			};
		
		// READ IS KO CALLBACK
		var ko_cb = function()
			{
				self.enter(context, 'KO CALLBACK');
				
				
				// DISABLE LOADER
				self.disable_loader();
				
				// ENABLE TOOLBAR REFRESH ACTION
				if (self.edit_toolbar)
				{
					self.edit_toolbar.enable_action('refresh');
				}
				
				// FIRE EVENT
				self.fire_event('refresh-error');
				
				
				self.leave(context, 'KO CALLBACK');
				return false;
			};
		
		// DATATABLES BASE OPTIONS
		var options_base =
			{
				"bPaginate": true,
				"bLengthChange": true,
				"bFilter": true,
				"bSort": true,
				"bInfo": false,
				"bAutoWidth": false,
				
				"bJQueryUI": true,
				
				// GET DATAS
				"bServerSide": false,
				"bProcessing": false,
				"sServerMethod": "POST",
				"sAjaxSource": this.query.get_url_string(),"bProcessing": true,
				"fnServerData": function (query_url, query_datas, draw_cb, settings)
					{
						var success_cb = function(datas)
							{
								// REDRAW TABLE
								var datatables_datas = { 'sEcho':1, 'iTotalRecords':datas.length, 'iTotalDisplayRecords':datas.length, 'aaData':datas};
								draw_cb(datatables_datas);
								
								// STANDARD
								ok_cb(datas);
							};
						self.model.read(self.query, success_cb, ko_cb);
					},
				
				
				"sPaginationType": "full_numbers",	// 'two_button' or 'full_numbers'
				
				"aoColumns": columns_def,
				
				/*
					sDOM option:
					Hide details	This initialisation variable allows you to specify exactly where in the DOM you want DataTables to inject the various controls it adds to the page (for example you might want the pagination controls at the top of the table). DIV elements (with or without a custom class) can also be added to aid styling. The follow syntax is used:
					The following options are allowed:
						'l' - Length changing
						'f' - Filtering input
						't' - The table!
						'i' - Information
						'p' - Pagination
						'r' - pRocessing
					The following constants are allowed:
						'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')
						'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')
					The following syntax is expected:
						'<' and '>' - div elements
						'<"class" and '>' - div with a class
						'<"#id" and '>' - div with an ID
					Examples:
						'<"wrapper"flipt>'
						'<lf<t>ip>'
					Default:	lfrtip (when bJQueryUI is false) or <"H"lfr>t<"F"ip> (when bJQueryUI is true)
					Type:	string
				*/
				"sDom": 'TR<"H"Cr>t<"F"ip>', /* f: search all columns */
				
				// PLUGIN : SEARCH FILTER
				"oLanguage": {
					"sSearch": "Search all columns:"
					}
			};
			
			var options_colreorder =
				{
					// PLUGIN : COLREORDER
					// sDom = 'R*'
					"oColReorder":
						{
		//						"aiOrder": [ 4, 3, 2, 1, 0 ],
		//						"iFixedColumns": 1
						}
				};
			
			var options_colvis =
				{
					// PLUGIN : COLVIS
					// sDom = 'C<"clear">*'
					"oColVis":
						{
							"activate": "click", // "mouseover" or "click"
		//						"aiExclude": [ 0 ]
							"bRestore": true,
							"buttonText": "Afficher / Masquer les colonnes",
		//						"fnLabel": function ( index, title, th )
		//							{
		//								return (index+1) +'. '+ title;
		//							}
		//						"fnStateChange": function ( iColumn, bVisible ) {...}
		//						"iOverlayFade": 1000
							"sAlign": "right"
		//						"bRestore": true,
		//						"sRestore": "Revert to original visibility"
		//						"sSize": "css"
						}
				};
			
			
			
		var options_tabletools_buttons = new Array();
		
		if (this.model.access.reload === true)
		{
			options_tabletools_buttons.push
				(
					{
						"sExtends": "div",			// button type
						"sButtonText": "Reload",	// button label
						"fnClick": function ( nButton, oConfig, oFlash )
							{
								// apt_datables_reload(arg_view_name);
							}
					}
				);
		}
		
		if (this.model.access.create === true)
		{
			options_tabletools_buttons.push
				(
					{
						"sExtends": "div",			// button type
						"sButtonText": "Create",	// button label
						"fnClick": function ( nButton, oConfig, oFlash )
							{
								// apt_datables_button_create_on_click(arg_view_name);
							}
					}
				);
		}
		
		if (this.model.access.delete === true)
		{
			options_tabletools_buttons.push
				(
					{
						"sExtends": "select_single",	// button type
						"sButtonText": "Delete",		// button label
						"fnClick": function ( nButton, oConfig, oFlash )
							{
								// apt_datables_button_delete_on_click(arg_view_name);
							}
					}
				);
		}
		
		if (this.model.access.update === true)
		{
			options_tabletools_buttons.push
				(
					{
						"sExtends": "select_single",	// button type
						"sButtonText": "Update",		// button label
						"fnClick": function ( nButton, oConfig, oFlash )
							{
								// apt_datables_button_update_on_click(arg_view_name);
							}
					}
				);
		}
		
		var options_tabletools =
			{
				// PLUGIN TABLETOOLS
				// sDom = 'T*'
				"oTableTools":
					{
						// "sSwfPath": APT_DATATABLES_PATH + "/media/swf/copy_csv_xls_pdf.swf",
						
						"sRowSelect": "single",
						// "fnRowSelected": apt_datables_on_row_selected, // function (node){...}
						// "fnRowDeselected": apt_datables_on_row_deselected, // function (node){...}
						
						"aButtons": options_tabletools_buttons
					}
			};
		
		var options = options_base;
		
		for(var key in options_colreorder)
		{
			options[key] = options_colreorder[key];
		}
		
		for(var key in options_colvis)
		{
			options[key] = options_colvis[key];
		}
		
		for(var key in options_tabletools)
		{
			options[key] = options_tabletools[key];
		}
		
		
		// CREATE DATATABLES OBJECT
		self.datatables_obj = self.table_jqo.dataTable(options);
		
		// UPDATE RESIZING CHILDREN
		$('div.fg-toolbar', self.content_jqo).each(
			function(index, item)
			{
				self.content_childs_jqo.push( $(item) );
			}
		);
		
		self.leave(context, 'success');
		return true;
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
		this.fire_event('updated');
		
		
		
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
		
		
		// DATATABLES RELOAD
		this.datatables_obj.fnReloadAjax();
		
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
	
	
	// DECLARE EVENTS HANDLERS
	this.add_event_callback('draw-init-end', [this, this.on_draw_init_end]);
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptDatatables, LibaptGridTable);
