/**
 * @file        L5-addons/datatables/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_datatables_modules =
	[
		// DATATABLES CORE
		{
			name:		'datatables-core',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/DataTables/js/jquery.dataTables.min.js',
			css_files:	[APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/DataTables/css/jquery.dataTables.css', APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/DataTables/css/demo_table_jui.css'],
			requires:	['views-all'],
			classes:	[],
			parent:		'addons-datatables-all'
		},
		
		// DATATABLES PLUGIN : TABLETOOLS
		{
			name:		'datatables-tabletools',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/TableTools/js/TableTools.min.js',
			css_files:	[APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/TableTools/css/TableTools.css'],
			requires:	['datatables-core'],
			classes:	[],
			parent:		'addons-datatables-all'
		},
		
		// DATATABLES PLUGIN : AJAX RELOAD
		{
			name:		'datatables-ajaxreload',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/AjaxReload/js/jquery.dataTables.ajaxreload.js',
			css_files:	[],
			requires:	['datatables-core'],
			classes:	[],
			parent:		'addons-datatables-all'
		},
		
		// DATATABLES PLUGIN : GET COLUMN DATA
		{
			name:		'datatables-getcolumndata',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/GetColumnData/js/jquery.dataTables.getcolumndata.js',
			css_files:	[],
			requires:	['datatables-core'],
			classes:	[],
			parent:		'addons-datatables-all'
		},
		
		// DATATABLES PLUGIN : COLUMNS REORDER
		{
			name:		'datatables-colreorder',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/ColReorder/js/ColReorder.min.js',
			css_files:	[APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/ColReorder/css/ColReorder.css'],
			requires:	['datatables-core'],
			classes:	[],
			parent:		'addons-datatables-all'
		},
		
		// DATATABLES PLUGIN : COLUMNS VISIBILITY
		{
			name:		'datatables-colviz',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/ColVis/js/ColVis.min.js',
			css_files:	[APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/externals/ColVis/css/ColVis.css'],
			requires:	['datatables-core'],
			classes:	[],
			parent:		'addons-datatables-all'
		},
		
		// DATATABLES LIBAPT WRAPPER CLASS
		{
			name:		'datatables-libapt',
			file:		APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/js/libapt-datatables.js',
			css_files:	[],
			requires:	['datatables-core','views-grid-table'],
			classes:	['LibaptDatatables'],
			parent:		'addons-datatables-all'
		}
	];


Libapt.register(views_datatables_modules);



