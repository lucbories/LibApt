/**
 * @file        L3-views/grid/modules.js
 * @desc        javascript modules declaration
 * @group       LIBAPT_VIEWS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_grid_modules =
	[
		// L3-VIEWS GRID VIEWS
		{
			name: 'views-grid',
			file: APT_LIB_URL + '/js/L3-views/model-view/grid/libapt-grid.js',
			requires: ['views-model-view'],
			classes: ['LibaptGrid']
		},
		
		{
			name: 'views-grid-table',
			file: APT_LIB_URL + '/js/L3-views/model-view/grid/libapt-grid-table.js',
			requires: ['views-grid'],
			classes: ['LibaptGridTable']
		}
	];


Libapt.register(views_grid_modules);
