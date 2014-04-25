/**
 * @file        L5-addons/flot-0.8.1/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_flot_modules =
	[
		// FLOT
		{
			name:		'flot-base',
			file:		APT_LIB_URL + '/js/L5-addons/flot-0.8.1/externals/jquery.flot.min.js',
			requires:	[],
			classes:	[],
			parent:		'addons-flot-all'
		},
		
		// FLOT PLUGIN : TIME
		{
			name:		'flot-plugin-time',
			file:		APT_LIB_URL + '/js/L5-addons/flot-0.8.1/externals/plugins/jquery.flot.time.min.js',
			requires:	[],
			classes:	[],
			parent:		'addons-flot-all'
		},
		
		// FLOT VIEW
		{
			name:		'flot-view',
			file:		APT_LIB_URL + '/js/L5-addons/flot-0.8.1/js/libapt-flot.js',
			requires:	['views-all','flot-base','flot-plugin-time'],
			classes:	['LibaptFlot'],
			parent:		'addons-flot-all'
		}
	];


Libapt.register(views_flot_modules);



