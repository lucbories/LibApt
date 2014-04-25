/**
 * @file        L3-views/modules.js
 * @desc        javascript modules declaration
 * @group       LIBAPT_VIEWS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_modules =
	[
		// L3-VIEWS BASIC MIXINS
		{
			name: 'views-mixins-all',
			modules_file: APT_LIB_URL + '/js/L3-views/mixins/modules.js',
			requires: ['core-object'],
			classes: [],
			parent: 'views-all'
		},
		
		
		// L3-VIEWS BASE VIEW
		{
			name: 'views-view',
			file: APT_LIB_URL + '/js/L3-views/libapt-view.js',
			requires: ['views-mixins-all'],
			classes: ['LibaptView'],
			parent: 'views-all'
		},
		
		
		// L3-VIEWS SIMPLE VIEWS
		{
			name: 'views-simple-all',
			modules_file: APT_LIB_URL + '/js/L3-views/simple-view/modules.js',
			requires: ['views-view'],
			classes: [],
			parent: 'views-all'
		},
		
		
		// OTHERS
		{
			name: 'views-pager',
			file: APT_LIB_URL + '/js/L3-views/libapt-pager.js',
			requires: ['views-view'],
			classes: ['LibaptPager'],
			parent: 'views-all'
		},
		
		
		// L3-VIEWS MODEL VIEWS
		{
			name: 'views-model-all',
			modules_file: APT_LIB_URL + '/js/L3-views/model-view/modules.js',
			requires: ['core-object'],
			classes: [],
			parent: 'views-all'
		},
		
		{
			name: 'views-query-editor-fields',
			file: APT_LIB_URL + '/js/L3-views/settings/libapt-mixin-query-editor-fields.js',
			requires: ['views-model-view'],
			classes: ['LibaptMixinQueryEditorFields'],
			parent: 'views-all'
		},
		
		{
			name: 'views-query-editor-groups',
			file: APT_LIB_URL + '/js/L3-views/settings/libapt-mixin-query-editor-groups.js',
			requires: ['views-model-view'],
			classes: ['LibaptMixinQueryEditorGroups'],
			parent: 'views-all'
		},
		
		{
			name: 'views-query-editor-orders',
			file: APT_LIB_URL + '/js/L3-views/settings/libapt-mixin-query-editor-orders.js',
			requires: ['views-model-view'],
			classes: ['LibaptMixinQueryEditorOrders'],
			parent: 'views-all'
		},
		
		{
			name: 'views-query-editor-filters',
			file: APT_LIB_URL + '/js/L3-views/settings/libapt-mixin-query-editor-filters.js',
			requires: ['views-model-view'],
			classes: ['LibaptMixinQueryEditorFilters'],
			parent: 'views-all'
		},
		
		{
			name: 'views-query-editor-slice',
			file: APT_LIB_URL + '/js/L3-views/settings/libapt-mixin-query-editor-slice.js',
			requires: ['views-model-view'],
			classes: ['LibaptMixinQueryEditorSlicz'],
			parent: 'views-all'
		},
		
		
		// ACTIONS
		{
			name: 'views-pager-sizes-action',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-pager-sizes.js',
			requires: ['core-action', 'views-model-view'],
			classes: ['LibaptActionPagerSizes'],
			parent: 'views-all'
		},
		
		{
			name: 'views-pager-action-pages',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-pager-pages.js',
			requires: ['core-action', 'views-model-view'],
			classes: ['LibaptActionPagerPages'],
			parent: 'views-all'
		},
		
		{
			name: 'views-crud-action',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-crud.js',
			requires: ['core-action', 'views-model-view'],
			classes: ['LibaptCrudAction'],
			parent: 'views-all'
		},
		
		{
			name: 'views-action-export-csv',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-export-csv.js',
			requires: ['core-action', 'views-model-view'],
			classes: ['LibaptActionExportCSV'],
			parent: 'views-all'
		},
		
		{
			name: 'views-action-export-html',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-export-html.js',
			requires: ['core-action', 'views-model-view'],
			classes: ['LibaptActionExportHTML'],
			parent: 'views-all'
		},
		
		{
			name: 'views-action-export-print',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-export-print.js',
			requires: ['libapt-prettify','core-action','views-model-view'],
			classes: ['LibaptActionExportPrint'],
			parent: 'views-all'
		},
		
		{
			name: 'views-action-export-image',
			file: APT_LIB_URL + '/js/L3-views/actions/libapt-action-export-image.js',
			requires: ['libapt-prettify','libapt-canvas2image','libapt-html2canvas','core-action','views-model-view'],
			classes: ['LibaptActionExportImage'],
			parent: 'views-all'
		},
		
		
		// OTHERS
		{
			name: 'views-query-editor',
			file: APT_LIB_URL + '/js/L3-views/settings/libapt-query-editor.js',
			requires: ['views-view','views-model-view','views-query-editor-groups','views-query-editor-fields','views-query-editor-orders','views-query-editor-filters','views-query-editor-slice'],
			classes: ['LibaptQueryEditor'],
			parent: 'views-all'
		}
	];


Libapt.register(views_modules);

