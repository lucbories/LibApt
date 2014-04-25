/**
 * @file        L5-addons/dygraph-1.0.0/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_dygraph_modules =
	[
		// DYGRAPH
		{
			name:		'dygraph-external',
			file:		APT_LIB_URL + '/js/L5-addons/dygraph-1.0.0/externals/dygraph-combined.js',
			requires:	[],
			classes:	[],
			parent:		'addons-dygraph-all'
		},
		
		// DYGRAPH VIEW
		{
			name:		'dygraph-view',
			file:		APT_LIB_URL + '/js/L5-addons/dygraph-1.0.0/js/libapt-dygraph.js',
			requires:	['views-all','dygraph-external'],
			classes:	['LibaptDygraph'],
			parent:		'addons-dygraph-all'
		}
	];


Libapt.register(views_dygraph_modules);



