/**
 * @file        L5-addons/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-06-08
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var addons_modules =
	[
		// CLEDITOR ADDON
		{
			name: 'addons-cleditor-all',
			js_files: [APT_LIB_URL + '/js/L5-addons/jquery.cleditor-1.3.0/js/jquery.cleditor.min.js', APT_LIB_URL + '/js/L5-addons/jquery.cleditor-1.3.0/js/jquery.cleditor.advancedtable.min.js', , APT_LIB_URL + '/js/L5-addons/jquery.cleditor-1.3.0/js/jquery.cleditor.icon.min.js'],
			css_files: [APT_LIB_URL + '/js/L5-addons/jquery.cleditor-1.3.0/css/jquery.cleditor.css'],
			requires: ['views-all'],
			classes: [],
			parent: 'addons-all'
		},
		
		
		// DYGRAPH ADDON
		{
			name: 'addons-dygraph-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/dygraph-1.0.0/modules.js',
			requires: ['views-all'],
			classes: [],
			parent: 'addons-all'
		},
		
		
		// FLOT ADDON
		{
			name: 'addons-flot-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/flot-0.8.1/modules.js',
			requires: ['views-all'],
			classes: [],
			parent: 'addons-all'
		},
		
		
		// PIVOT ADDON
		{
			name: 'addons-pivot-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/pivot/modules.js',
			requires: ['views-all'],
			classes: [],
			parent: 'addons-all'
		},
		
		
		// DATATABLES ADDON
		{
			name: 'addons-datatables-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/datatables-1.9.2/modules.js',
			requires: ['views-all'],
			classes: [],
			parent: 'addons-all'
		}
	];


Libapt.register(addons_modules);

