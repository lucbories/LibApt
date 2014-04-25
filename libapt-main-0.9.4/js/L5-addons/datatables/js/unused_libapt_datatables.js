/**
 * @version		$Id: apt_databases.js 2012-08-27 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-plugins/jquery.datatables/libapt
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/*
 * DATATABLES OPERATIONS
 *  
 *  APT_DATATABLES_PATH
 *
 *  apt_datatables_on_filters_update(arg_view_name, arg_model_name)
 *
 *  apt_datables_reload(arg_view_name)
 *  apt_datables_on_row_selected(arg_selected_node)
 *  apt_datables_on_row_deselected(arg_selected_node)
 *
 *  apt_datables_button_create_on_click(arg_view_name)
 *  apt_datables_button_delete_on_click(arg_view_name)
 *  apt_datables_button_update_on_click(arg_view_name)
 *
 *  apt_datatable_on_create_success(arg_html_table_id, arg_form_id)
 *  apt_datatable_on_delete_success(arg_html_table_id, arg_form_id)
 *  apt_datatable_on_update_success(arg_html_table_id, arg_form_id)
 *
 *  fnCreateSelect( aData )
 *  apt_datatables_init_select_filters(arg_table_object)
 *  apt_datatables_init_input_filters(arg_table_object)
 *
 *  apt_datatables_init_options(arg_view_name, arg_model_name, arg_columns_def, arg_can_reload, arg_can_create, arg_can_delete, arg_can_update, arg_can_export)
 *  apt_datatable_create(arg_view_name, arg_html_table_id, arg_model_name, arg_columns_def, options)
 *  apt_datatable_init_form(arg_table_id, arg_model_name, arg_form_id, arg_action_name, arg_action_handler, arg_form_div_id)
 *  apt_datatable_init(arg_table_id, arg_model_name, arg_form_create, arg_form_delete, arg_form_update) *  
 *  
*/
 
var APT_DATATABLES_PATH = APT_LIB_PLUGINS_URL + '/jquery.datatables-1.9.2';


$.fn.dataTableExt.oApi.fnSetAjaxSource = function ( oSettings, sNewSource, fnCallback, bStandingRedraw )
  {
	var context = "$.fn.dataTableExt.oApi.fnSetAjaxSource";
	
	if ( is_null(oSettings) )
	{
		trace_error(context, "oSettings is null");
		return;
	}
	
	if ( ! is_null(sNewSource) )
//    if ( typeof sNewSource != 'undefined' && sNewSource != null )
    {
        oSettings.sAjaxSource = sNewSource;
    }
    /* Callback user function - for event handlers etc */
    if ( typeof fnCallback == 'function' && fnCallback != null )
    {
        fnCallback( oSettings );
    }
  }



function apt_datatables_on_filters_update(arg_view_name, arg_model_name)
{
	var new_url = 'index.php?datatablesJsonAction=read' + arg_model_name + '&' + libapt_main_ajax_get_options_url(arg_view_name);
	apt_datatables_options_update_ajax(arg_view_name, new_url);
	apt_datables_reload(arg_view_name);
}

function apt_datables_reload(arg_view_name)
{
	var table_id = "#" + arg_view_name + "_table_id";
	var table = $(table_id).dataTable();
	table.fnReloadAjax();
}

function apt_datables_on_row_selected(arg_selected_node)
{
//	alert("selected :" + arg_selected_node);
}

/*
	
	ARG : HTML Table Row Element
*/
function apt_datables_on_row_deselected(arg_selected_node)
{
//	alert("deselected :" + arg_selected_node);
}


function apt_datables_button_create_on_click(arg_view_name)
{
	var table_id = "#" + arg_view_name + "_table_id";
	var form_id = "#" + arg_view_name + "_delete_form";
	var modal_id = "#" + arg_view_name + "_create_form_modal";
	var oTable = $(table_id).dataTable();
	
	$(modal_id).reveal();
	$(form_id + " :input:first").focus();
}

function apt_datables_button_delete_on_click(arg_view_name)
{
	context = "apt_datables_button_delete_on_click(" + arg_view_name + ")";
	trace_enter(context);
	
	var table_id = "#" + arg_view_name + "_table_id";
	var form_id = "#" + arg_view_name + "_delete_form";
	var modal_id = form_id + "_modal";
	var oTable = $(table_id).dataTable();
	
	// CHECK IF A ROW IS SELECTED
	trace_step(context, 'CHECK IF A ROW IS SELECTED');
	var selected_rows_count = $(table_id + " tr.DTTT_selected").length;
	if (selected_rows_count != 1)
	{
		msgbox_alert('Select a row before to click the delete button !');
		return;
	}
	
	// INIT FORM FIELDS
	trace_step(context, 'INIT FORM FIELDS');
	var form_fields = $(form_id + " :input[type!='HIDDEN']").not(":submit");
	var form_fields_count = form_fields.length;
	form_fields.removeAttr('checked');
	form_fields.removeAttr('selected');
	
	// LOOP ON FIELDS
	trace_step(context, 'LOOP ON FIELDS: ' + form_fields_count);
	var index = 0;
	for(index = 0; index < form_fields_count; index++)
	{
		var cell_value = $(table_id + " tr.DTTT_selected td")[index].innerHTML;
		var form_item = form_fields[index];
		var form_item_tag = form_item.tagName;
		
		trace_var(context, "form_item_tag", form_item_tag);
		apt_form_update_input(form_id, form_item, cell_value);
	}
	
	$(modal_id).reveal();
	$(form_id + " :input:first").focus();
	
	trace_leave(context);
}

function apt_datables_button_update_on_click(arg_view_name)
{
	context = "apt_datables_button_update_on_click(" + arg_view_name + ")";
	trace_enter(context);
	
	var table_id = "#" + arg_view_name + "_table_id";
	var form_id = "#" + arg_view_name + "_update_form";
	var modal_id = "#" + arg_view_name + "_update_form_modal";
	var oTable = $(table_id).dataTable();
	
	// CHECK IF A ROW IS SELECTED
	trace_step(context, 'CHECK IF A ROW IS SELECTED');
	var selected_rows = $(table_id + " tr.DTTT_selected");
	if ( is_null(selected_rows) )
	{
		msgbox_alert('Select a row before to click the update button !');
		return;
	}
	var selected_rows_count = selected_rows.length;
	trace_var(context, "selected_rows_count", selected_rows_count);
	if ( selected_rows_count != 1)
	{
		msgbox_alert('Select a row before to click the update button !');
		return;
	}
	trace_var(context, "selected_rows[0]", selected_rows[0]);
	
	// INIT FORM FIELDS
	trace_step(context, 'INIT FORM FIELDS');
	var form_fields = $(form_id + " :input[subtype!='OLDHASH'][subtype!='CONFIRM'][subtype!='NEWHASH']").not(':submit');
	if ( is_null(form_fields) )
	{
		msgbox_alert('No field to update !');
		return;
	}
	var form_fields_count = form_fields.length;
	form_fields.removeAttr('checked');
	form_fields.removeAttr('selected');
	
	// INIT SELECTED ROW FIELDS
	var selected_fields = oTable.fnGetData( selected_rows[0] );
	
	// LOOP ON FIELDS
	trace_step(context, 'LOOP ON FIELDS: ' + form_fields_count);
	var index = 0;
	for(index = 0; index < form_fields_count; index++)
	{
		trace_var(context, "field index", index);
		// var cell_value = $(table_id + " tr.DTTT_selected td")[index].innerHTML;
		
		var form_item = form_fields[index];
		var form_item_tag = form_item.tagName;
		var form_item_name = form_item.name;
		trace_var(context, "form_item", form_item);
		trace_var(context, "form_item_tag", form_item_tag);
		trace_var(context, "form_item_name", form_item_name);
		
		var cell_value = selected_fields[form_item_name];
		trace_var(context, "cell_value", cell_value);
		
		apt_form_update_input(form_id, form_item, cell_value);
	}
	
	$(modal_id).reveal();
	$(form_id + " :input:first").focus();
	
	trace_leave(context);
}


function apt_datatable_on_create_success(arg_html_table_id, arg_form_id)
{
	var table_id = '#' + arg_html_table_id;
	
	msgbox_success('JSON call create (' + status + ')');
	
	var table = $(table_id).dataTable();
	table.fnReloadAjax();
}


function apt_datatable_on_delete_success(arg_html_table_id, arg_form_id)
{
	var table_id = '#' + arg_html_table_id;
	
	msgbox_success('JSON call delete (' + status + ')');
	
	var table = $(table_id).dataTable();
//	var selected_row = table.$('tr.row_selected');
//	table.fnDeleteRow(selected_row);
//	table.fnDraw();
	table.fnReloadAjax();
}


function apt_datatable_on_update_success(arg_html_table_id, arg_form_id)
{
	var table_id = '#' + arg_html_table_id;
	var table = $(table_id).dataTable();
	var box = $('#apt_msg_box_success');
	
	msgbox_success('JSON call update (' + status + ')');
	
	table.fnReloadAjax();
}


/*
	DATATABLES PLUGIN : SELECT FILTERS - CREATE SELECT
*/
function fnCreateSelect( aData )
{
	var r = '<select><option value=""></option>';
	var i;
	var iLen = aData.length;
	for(i = 0 ; i < iLen ; i++)
	{
		r += '<option value="' + aData[i] + '">' + aData[i] + '</option>';
	}
	return r + '</select>';
};

/*
	DATATABLES PLUGIN : SELECT FILTERS
*/
function apt_datatables_init_select_filters(arg_table_object)
{
	/* Add a select menu for each TH element in the table footer */
	var oTable = arg_table_object;
	$("tfoot th").each(
			function ( i )
			{
				this.innerHTML = fnCreateSelect( oTable.fnGetColumnData(i) );
				$('select', this).change(
						function ()
						{
							oTable.fnFilter( $(this).val(), i );
						}
					);
			}
		);
}

function apt_datatables_init_input_filters(arg_table_object)
{
	var asInitVals = new Array();
	var oTable = arg_table_object;
	
	$("tfoot input").keyup(
			function ()
			{
				/* Filter on the column (the index) of this element */
				oTable.fnFilter( this.value, $("tfoot input").index(this) );
			}
		);
	
	/*
	 * Support functions to provide a little bit of 'user friendlyness' to the textboxes in 
	 * the footer
	 */
	$("tfoot input").each(
			function (i)
			{
				asInitVals[i] = this.value;
			}
		);
	
	$("tfoot input").focus(
			function ()
			{
				if ( this.className == "search_init" )
				{
					this.className = "";
					this.value = "";
				}
			}
		);
	
	$("tfoot input").blur(
			function (i)
			{
				if ( this.value == "" )
				{
					this.className = "search_init";
					this.value = asInitVals[$("tfoot input").index(this)];
				}
			}
		);
};


/*
	APT - DATATABLES
	UPDATE DATABLE OPTIONS : AJAX SOURCE
*/
function apt_datatables_options_update_ajax(arg_view_name, arg_url)
{
	context = "apt_datatables_options_update_ajax(" + arg_view_name + "," + arg_url + ")";
	trace_enter(context);
	
	var table_id = '#' + arg_view_name + '_table_id';
	var table = $(table_id).dataTable();
	if ( is_null(table) )
	{
		trace_error(context, "table is null : bad id ?");
		return false;
	}
	
	table.fnSetAjaxSource(arg_url);
	trace_leave(context);
	return true;
}


/*
	APT - DATATABLES
	INIT DATABLE OPTIONS
*/
function apt_datatables_init_options(arg_view_name, arg_model_name, arg_columns_def, arg_can_reload, arg_can_create, arg_can_delete, arg_can_update, arg_can_export)
{
	context = "apt_datatables_init_options(" + arg_view_name + "," + arg_model_name + "," + arg_columns_def + "," + arg_can_reload + "," + arg_can_create + "," + arg_can_delete + "," + arg_can_update + "," + arg_can_export + ")";
	trace_enter(context);
	
	
	// CREATE READ URL
	var url_view_filters_string = '&' + libapt_main_ajax_get_options_url(arg_view_name);
	trace_var(context, "url_view_filters_string", url_view_filters_string);
	
	var url_view_orders_string = "&orders=\"login=DESC\"";
	var url_view_orders_slice = "&slice_offset=0&slice_length=20";
	url_view_orders_string = "";
	url_view_orders_slice = "";
	trace_var(context, "url_view_orders_string", url_view_orders_string);
	trace_var(context, "url_view_orders_slice", url_view_orders_slice);
	
	var read_url = 'index.php?datatablesJsonAction=read'  + arg_model_name + url_view_filters_string + url_view_orders_string + url_view_orders_slice;
	trace_var(context, "read_url", read_url);
	
	var options_base =
		{
			"bPaginate": true,
			"bLengthChange": true,
			"bFilter": true,
			"bSort": true,
			"bInfo": false,
			"bAutoWidth": false,
			
			"bJQueryUI": true,
			"bServerSide": false,
			"bProcessing": false,
			
			"sServerMethod": "POST",
			"sAjaxSource": read_url,
            "fnServerData": function (url, data, callback)
				{
					$.ajax(
						{
							"url": url,
							"data": data,
							"success": callback,
							"contentType": "application/x-www-form-urlencoded; charset=utf-8",
							"dataType": "json",
							"type": "POST",
							"cache": false,
							"error": function ()
								{
									alert("DataTables warning: JSON data from server failed to load or be parsed with\n" +
										" url=[" + url + "]\n data=[" + data + "]");
								}
						}
					);
				},
			
			"sPaginationType": "full_numbers",	// 'two_button' or 'full_numbers'
			
			"aoColumns": arg_columns_def,
			
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
	
	// BUG : the sub button click is not sync with the button position !
/*	var options_tabletools_export =
		{
			"sExtends":    "collection",
			"sButtonText": "Exports",
			"aButtons":
				[
					{
						"sExtends": "copy",			// button type
						"sButtonText": "Copy",		// button label
						"sFieldSeperator": "	",	// fields separator
						"sFieldBoundary": '',		// field boundary
						"bHeader": true,			// export header
						"bFooter": false,			// export footer
						"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
					},
					{
						"sExtends": "csv",			// button type
						"sButtonText": "CSV",		// button label
						"sFieldSeperator": ";",		// fields separator
						"sFieldBoundary": '"',		// field boundary
						"bHeader": true,			// export header
						"bFooter": false,			// export footer
						"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
					},
					{
						"sExtends": "pdf",			// button type
						"sButtonText": "PDF",		// button label
						"sFieldSeperator": "	",	// fields separator
						"sFieldBoundary": '',		// field boundary
						"bHeader": true,			// export header
						"bFooter": true,			// export footer
						"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
					},
					{
						"sExtends": "print",		// button type
						"sButtonText": "Print",		// button label
						"sFieldSeperator": "	",	// fields separator
						"sFieldBoundary": '',		// field boundary
						"bHeader": true,			// export header
						"bFooter": false,			// export footer
						"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
					}
				]
		};*/
	
	var options_tabletools_buttons = new Array();
	
	if (arg_can_reload == true)
	{
		options_tabletools_buttons.push
			(
				{
					"sExtends": "div",			// button type
					"sButtonText": "Reload",	// button label
					"fnClick": function ( nButton, oConfig, oFlash )
						{
							apt_datables_reload(arg_view_name);
						}
				}
			);
	}
	
	if (arg_can_create == true)
	{
		options_tabletools_buttons.push
			(
				{
					"sExtends": "div",			// button type
					"sButtonText": "Create",	// button label
					"fnClick": function ( nButton, oConfig, oFlash )
						{
							apt_datables_button_create_on_click(arg_view_name);
						}
				}
			);
	}
	
	if (arg_can_delete == true)
	{
		options_tabletools_buttons.push
			(
				{
					"sExtends": "select_single",	// button type
					"sButtonText": "Delete",		// button label
					"fnClick": function ( nButton, oConfig, oFlash )
						{
							apt_datables_button_delete_on_click(arg_view_name);
						}
				}
			);
	}
	
	if (arg_can_update == true)
	{
		options_tabletools_buttons.push
			(
				{
					"sExtends": "select_single",	// button type
					"sButtonText": "Update",		// button label
					"fnClick": function ( nButton, oConfig, oFlash )
						{
							apt_datables_button_update_on_click(arg_view_name);
						}
				}
			);
	}
	
	if (arg_can_export == true)
	{
		options_tabletools_buttons.push(
			{
				"sExtends": "copy",			// button type
				"sButtonText": "Copy",		// button label
				"sFieldSeperator": "	",	// fields separator
				"sFieldBoundary": '',		// field boundary
				"bHeader": true,			// export header
				"bFooter": false,			// export footer
				"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
			}
		);
		options_tabletools_buttons.push(
			{
				"sExtends": "csv",			// button type
				"sButtonText": "CSV",		// button label
				"sFieldSeperator": ";",		// fields separator
				"sFieldBoundary": '"',		// field boundary
				"bHeader": true,			// export header
				"bFooter": false,			// export footer
				"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
			}
		);
		options_tabletools_buttons.push(
			{
				"sExtends": "pdf",			// button type
				"sButtonText": "PDF",		// button label
				"sFieldSeperator": "	",	// fields separator
				"sFieldBoundary": '',		// field boundary
				"bHeader": true,			// export header
				"bFooter": true,			// export footer
				"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
			}
		);
		options_tabletools_buttons.push(
			{
				"sExtends": "print",		// button type
				"sButtonText": "Print",		// button label
				"sFieldSeperator": "	",	// fields separator
				"sFieldBoundary": '',		// field boundary
				"bHeader": true,			// export header
				"bFooter": false,			// export footer
				"mColumns": "visible"		//or [ 0, 1, 4 ] => columns to export
			}
		);
	}

	var options_tabletools =
		{
			// PLUGIN TABLETOOLS
			// sDom = 'T*'
			"oTableTools":
				{
					"sSwfPath": APT_DATATABLES_PATH + "/media/swf/copy_csv_xls_pdf.swf",
					
					"sRowSelect": "single",
					"fnRowSelected": apt_datables_on_row_selected, // function (node){...}
					"fnRowDeselected": apt_datables_on_row_deselected, // function (node){...}
					
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
	
	trace_leave(context, "");
	return options;
}

/*
	APT - DATATABLES
	CREATE DATABLE
*/
function apt_datatable_create(arg_view_name, arg_html_table_id, arg_model_name, arg_columns_def, options)
{
	var table_id = '#' + arg_html_table_id;
	
	var form_create_modal_id = "#" + arg_view_name + "_create_form_modal";
	var form_delete_modal_id = "#" + arg_view_name + "_delete_form_modal";
	var form_update_modal_id = "#" + arg_view_name + "_update_form_modal";
	
	var arg_can_reload = ( typeof(options['can_reload']) == "undefined" ) ? false : (options['can_reload'] == "true");
	var arg_can_create = ( typeof(options['can_create']) == "undefined" ) ? false : (options['can_create'] == "true");
	var arg_can_delete = ( typeof(options['can_delete']) == "undefined" ) ? false : (options['can_delete'] == "true");
	var arg_can_update = ( typeof(options['can_update']) == "undefined" ) ? false : (options['can_update'] == "true");
	var arg_can_export = ( typeof(options['can_export']) == "undefined" ) ? false : (options['can_export'] == "true");
	
	// CREATE DATATABLES OPTIONS
	var datables_options = apt_datatables_init_options(arg_view_name, arg_model_name, arg_columns_def, arg_can_reload, arg_can_create, arg_can_delete, arg_can_update, arg_can_export);
	
	// CREATE DATATABLES OBJECT
	var oTable = $(table_id).dataTable(datables_options);
	
	// INIT COLUMN FOOTER FILTERS
	apt_datatables_init_input_filters(oTable);
//	apt_datatables_init_select_filters(oTable);
};

function apt_datatable_init_form(arg_table_id, arg_model_name, arg_form_id, arg_action_name, arg_action_handler, arg_form_div_id)
{
	$(arg_form_id).submit(
		function()
		{
			var context = "form.submit";
			trace_enter(context);
			
			// UPDATE CKEDITOR TEXTAREAS
			trace_step(context, 'update ckeditor textareas');
			var ckeditors_nb = $("textarea ckeditor").length;
			if (ckeditors_nb > 0)
			{
				for ( instance in CKEDITOR.instances )
				{
					CKEDITOR.instances[instance].updateElement();
				}
			}
			
			// SEND AJAX ACTION TO THE SERVER
			trace_step(context, 'send ajax action');
			$.ajax(
				{
					type: 'POST',
					url: 'index.php?jsonAction=' + arg_action_name + arg_model_name,
					data: 'jsonData=' + JSON.stringify( $(arg_form_id).serializeJSON() ),
					success:
						function(data, textStatus, jqXHR)
						{
							trace_var(context, "datas", JSON.stringify( $(arg_form_id).serializeJSON() ) );
							arg_action_handler(arg_table_id, arg_form_id);
							
//							console.log("data:" +  JSON.stringify( $(arg_form_id).serializeJSON()) );
							
							$(arg_form_id).each(
								function()
								{
									this.reset();
								}
							);
							
//							msgbox_info("Action success : " + arg_action_name);
						},
					error:
						function(jqXHR, textStatus, errorThrown)
						{
							msgbox_alert("Action failure : " + arg_action_name);
						}
				}
			);
			
			// CLOSE THE MODAL WINDOW
			$(arg_form_div_id).trigger('reveal:close');
			
			// STOP LISTENING THIS EVENT
			trace_leave(context);
			return false;
		}
	);
};

function apt_datatable_init(arg_table_id, arg_model_name, arg_form_create, arg_form_delete, arg_form_update)
{
	var form_id = '';
	var div_id  = '';
	
	// INIT CREATE FORM
	form_id = '#' + arg_form_create;
	div_id  = form_id + "_modal";
	apt_datatable_init_form(arg_table_id, arg_model_name, form_id, 'create', apt_datatable_on_create_success, div_id);
	
	// INIT DELETE FORM
	form_id = '#' + arg_form_delete;
	div_id  = form_id + "_modal";
	apt_datatable_init_form(arg_table_id, arg_model_name, form_id, 'delete', apt_datatable_on_delete_success, div_id);
	
	// INIT UPDATE FORM
	form_id = '#' + arg_form_update;
	div_id  = form_id + "_modal";
	apt_datatable_init_form(arg_table_id, arg_model_name, form_id, 'update', apt_datatable_on_update_success, div_id);
};






