/**
 * @file        L3-views/model-view/modules.js
 * @desc        javascript modules declaration
 * @group       LIBAPT_VIEWS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_model_modules =
	[
		// L3-VIEWS MODEL VIEWS
		{
			name: 'views-model-mixins-all',
			modules_file: APT_LIB_URL + '/js/L3-views/model-view/mixins/modules.js',
			requires: ['models-model'],
			classes: [],
			parent: 'views-model-all'
		},
		
		{
			name: 'views-model-view',
			file: APT_LIB_URL + '/js/L3-views/model-view/libapt-model-view.js',
			requires: ['views-view','views-view-mixin-loader','models-model'],
			classes: ['LibaptModelView'],
			parent: 'views-model-all'
		},
		
		{
			name: 'views-form',
			file: APT_LIB_URL + '/js/L3-views/model-view/libapt-form.js',
			requires: ['views-view', 'views-model-view'],
			classes: ['LibaptForm'],
			parent: 'views-model-all'
		},
		
		{
			name: 'views-selector',
			file: APT_LIB_URL + '/js/L3-views/model-view/libapt-selector.js',
			requires: ['views-model-view'],
			classes: ['LibaptSelector'],
			parent: 'views-model-all'
		},
		
		{
			name: 'views-table',
			file: APT_LIB_URL + '/js/L3-views/model-view/libapt-table.js',
			requires: ['views-model-view','views-view-mixin-table','views-view-mixin-table-select'],
			classes: ['LibaptTable']
		},
		
		
		// L3-VIEWS GRID VIEWS
		{
			name: 'views-grid-all',
			modules_file: APT_LIB_URL + '/js/L3-views/model-view/grid/modules.js',
			requires: ['views-model-view','views-grid','views-grid-table','views-table'],
			classes: [],
			parent: 'views-model-all'
		}
	];


Libapt.register(views_model_modules);

