/**
 * @file        L5-addons/pivot/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_pivot_modules =
	[
		// L3-VIEWS PIVOT VIEWS
		{
			name: 'pivot-group',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-group.js',
			requires: ['core-object','storage-query-field'],
			classes: ['LibaptPivotGroup'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-axis',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-axis.js',
			requires: ['core-object','pivot-group'],
			classes: ['LibaptPivotAxis'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-axis-editor-fields',
			file: APT_LIB_URL + '/js/L5-addons/pivot/settings/libapt-mixin-axis-editor-fields.js',
			requires: ['core-object','pivot-group'],
			classes: ['LibaptMixinAxisEditorFields'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-grid-editor',
			file: APT_LIB_URL + '/js/L5-addons/pivot/settings/libapt-pivot-grid-editor.js',
			requires: ['core-object','pivot-group','pivot-axis-editor-fields'],
			classes: ['LibaptPivotGridEditor'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-axis-iterator',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-axis-iterator.js',
			requires: ['core-object','pivot-axis'],
			classes: ['LibaptPivotAxisIterator'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-axis-position',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-axis-position.js',
			requires: ['core-object','pivot-axis'],
			classes: ['LibaptPivotAxisPosition'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-grid-position',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-grid-position.js',
			requires: ['core-object','pivot-axis'],
			classes: ['LibaptPivotGridPosition'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-table-render',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-table-render.js',
			requires: ['core-object'],
			classes: ['LibaptPivotTableRender'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-grid',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-grid.js',
			requires: ['views-grid-all','pivot-table-render','pivot-axis','pivot-axis-position','pivot-axis-iterator','pivot-grid-position','pivot-grid-editor'],
			classes: ['LibaptPivotGrid'],
			parent: 'addons-pivot-all'
		},
		
		{
			name: 'pivot-grid-checkbox',
			file: APT_LIB_URL + '/js/L5-addons/pivot/libapt-pivot-grid-checkbox.js',
			requires: ['pivot-grid'],
			classes: ['LibaptPivotGridCheckbox'],
			parent: 'addons-pivot-all'
		}
	];


Libapt.register(views_pivot_modules);
