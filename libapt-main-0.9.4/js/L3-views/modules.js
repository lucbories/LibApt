/**
 * @file        L3-views/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_modules =
	[
		// L3-VIEWS BASIC VIEWS
		{
			name: 'views-view-mixin-link',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-link.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewLink'],
			parent: 'views-all'
		},
		
		{
			name: 'views-view-mixin-size',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-size.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewSize'],
			parent: 'views-all'
		},
		
		{
			name: 'views-view-mixin-select',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-select.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewSelect'],
			parent: 'views-all'
		},
		
		{
			name: 'views-view-mixin-table-select',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-table-select.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewTableSelect'],
			parent: 'views-all'
		},
		
		{
			name: 'views-view-mixin-loader',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-loader.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewLoader'],
			parent: 'views-all'
		},
		
		{
			name: 'views-view',
			file: APT_LIB_URL + '/js/L3-views/libapt-view.js',
			requires: ['core-object','core-event','core-editors','views-view-mixin-link','views-view-mixin-size','views-view-mixin-select','views-titlebar'],
			classes: ['LibaptView'],
			parent: 'views-all'
		},
		
		{
			name: 'views-pager',
			file: APT_LIB_URL + '/js/L3-views/libapt-pager.js',
			requires: ['views-view'],
			classes: ['LibaptPager'],
			parent: 'views-all'
		},
		
		{
			name: 'views-settings',
			file: APT_LIB_URL + '/js/L3-views/libapt-settings.js',
			requires: ['views-view'],
			classes: ['LibaptSettings'],
			parent: 'views-all'
		},
		
		{
			name: 'views-toolbar',
			file: APT_LIB_URL + '/js/L3-views/libapt-toolbar.js',
			requires: ['views-view'],
			classes: ['LibaptToolbar'],
			parent: 'views-all'
		},
		
		{	
			name: 'views-titlebar',
			file: APT_LIB_URL + '/js/L3-views/libapt-titlebar.js',
			requires: ['views-view'],
			classes: ['LibaptTitlebar'],
			parent: 'views-all'
		},
		
		{
			name: 'views-window',
			file: APT_LIB_URL + '/js/L3-views/libapt-window.js',
			requires: ['views-view'],
			classes: ['LibaptWindow'],
			parent: 'views-all'
		},
		
		
		// L3-VIEWS MODEL VIEWS
		{
			name: 'views-model-view',
			file: APT_LIB_URL + '/js/L3-views/model-view/libapt-model-view.js',
			requires: ['views-view','views-view-mixin-loader','models-model'],
			classes: ['LibaptModelView'],
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
		
		{
			name: 'views-form',
			file: APT_LIB_URL + '/js/L3-views/libapt-form.js',
			requires: ['views-view', 'views-model-view'],
			classes: ['LibaptForm'],
			parent: 'views-all'
		},
		
		// ACTIONS
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
		},
		
		{
			name: 'views-selector',
			file: APT_LIB_URL + '/js/L3-views/model-view/libapt-selector.js',
			requires: ['views-model-view'],
			classes: ['LibaptSelector'],
			parent: 'views-all'
		},
		
		
		// L3-VIEWS GRID VIEWS
		{
			name: 'views-grid-all',
			modules_file: APT_LIB_URL + '/js/L3-views/model-view/grid/modules.js',
			requires: ['views-model-view','views-grid','views-grid-table','views-table'],
			classes: [],
			parent: 'views-all'
		}
	];


Libapt.register(views_modules);

