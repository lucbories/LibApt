/**
 * @file        L3-views/simple-view/modules.js
 * @desc        javascript modules declaration
 * @group       LIBAPT_VIEWS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_simple_modules =
	[
		// L3-VIEWS SIMPLE VIEWS
		{
			name: 'views-editor',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-editor.js',
			requires: ['views-view'],
			classes: ['LibaptEditor'],
			parent: 'views-simple-all'
		},
		
		{
			name: 'views-context-menu',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-context-menu.js',
			requires: ['views-view'],
			classes: ['LibaptContextMenu'],
			parent: 'views-simple-all'
		},
		
		{
			name: 'views-settings',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-settings.js',
			requires: ['views-view'],
			classes: ['LibaptSettings'],
			parent: 'views-simple-all'
		},
		
		{
			name: 'views-toolbar',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-toolbar.js',
			requires: ['views-view'],
			classes: ['LibaptToolbar'],
			parent: 'views-simple-all'
		},
		
		{	
			name: 'views-titlebar',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-titlebar.js',
			requires: ['views-view'],
			classes: ['LibaptTitlebar'],
			parent: 'views-simple-all'
		},
		
		{
			name: 'views-window',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-window.js',
			requires: ['views-view'],
			classes: ['LibaptWindow'],
			parent: 'views-simple-all'
		},
		
		{
			name: 'views-progress-window',
			file: APT_LIB_URL + '/js/L3-views/simple-view/libapt-progress-window.js',
			requires: ['views-window'],
			classes: ['LibaptProgressWindow'],
			parent: 'views-simple-all'
		}
	];


Libapt.register(views_simple_modules);

