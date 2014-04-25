/**
 * @file        L5-addons/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-08
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var addons_modules =
	[
		// PIVOT ADDON
		{
			name: 'addons-pivot-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/pivot/modules.js',
			requires: ['pivot-grid-checkbox'],
			classes: [],
			parent: 'addons-all'
		},
		
		
		// DATATABLES ADDON
		{
			name: 'addons-datatables-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/datatables/modules.js',
			requires: ['views-all'],
			classes: [],
			parent: 'addons-all'
		}
	];


Libapt.register(addons_modules);

