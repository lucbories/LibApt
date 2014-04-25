/**
 * @file        L4-apps/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var apps_modules =
	[
		{
			name: 'apps-models-plugin',
			file: APT_LIB_URL + '/js/L4-apps/libapt-models-plugin.js',
			requires: ['models-model'],
			classes: ['LibaptModels'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-views-plugin',
			file: APT_LIB_URL + '/js/L4-apps/libapt-views-plugin.js',
			requires: ['views-view'],
			classes: ['LibaptViews'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-views-factory',
			file: APT_LIB_URL + '/js/L4-apps/libapt-views-factory.js',
			requires: ['views-all'],
			classes: [],
			parent: 'apps-all'
		}
	];


Libapt.register(apps_modules);
