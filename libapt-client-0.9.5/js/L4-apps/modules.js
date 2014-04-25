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
			name: 'apps-i18n',
			file: APT_LIB_URL + '/js/L4-apps/libapt-i18n.js',
			requires: ['models-model'],
			classes: ['LibaptI18n'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-events',
			file: APT_LIB_URL + '/js/L4-apps/libapt-events.js',
			requires: ['core-event'],
			classes: ['LibaptEvents'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-windows',
			file: APT_LIB_URL + '/js/L4-apps/libapt-windows.js',
			requires: ['views-window'],
			classes: ['LibaptWindows'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-models',
			file: APT_LIB_URL + '/js/L4-apps/libapt-models.js',
			requires: ['apps-events','models-model'],
			classes: ['LibaptModels'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-views',
			file: APT_LIB_URL + '/js/L4-apps/libapt-views.js',
			requires: ['apps-events','views-view'],
			classes: ['LibaptViews'],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-views-factory',
			file: APT_LIB_URL + '/js/L4-apps/libapt-views-factory.js',
			requires: ['apps-events','views-all'],
			classes: [],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-runtime-introspect-events',
			file: APT_LIB_URL + '/js/L4-apps/libapt-runtime-introspect-events.js',
			requires: ['apps-events','core-all','apps-models','apps-views','apps-views-factory'],
			classes: [],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-runtime-introspect-classes',
			file: APT_LIB_URL + '/js/L4-apps/libapt-runtime-introspect-classes.js',
			requires: ['core-all','apps-models','apps-views','apps-views-factory'],
			classes: [],
			parent: 'apps-all'
		},
		
		{
			name: 'apps-runtime-introspect-options',
			file: APT_LIB_URL + '/js/L4-apps/libapt-runtime-introspect-options.js',
			requires: ['core-all','apps-models','apps-views','apps-views-factory'],
			classes: [],
			parent: 'apps-all'
		}
	];


Libapt.register(apps_modules);
