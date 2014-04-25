/**
 * @file        L5-addons/pivot/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var addons_pivot_modules =
	[
		// PIVOT MIXINS MODULE
		{
			name: 'pivot-mixin-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/pivot/mixins/modules.js',
			requires: ['core-all'],
			classes: [],
			parent: 'pivot-all'
		},
		
		
		// PIVOT SETTINGS
		{
			name: 'pivot-axis-editor-fields',
			file: APT_LIB_URL + '/js/L5-addons/pivot/settings/libapt-mixin-axis-editor-fields.js',
			requires: ['core-object','pivot-group'],
			classes: ['LibaptMixinAxisEditorFields'],
			parent: 'pivot-all'
		},
		
		{
			name: 'pivot-grid-editor',
			file: APT_LIB_URL + '/js/L5-addons/pivot/settings/libapt-pivot-grid-editor.js',
			requires: ['core-object','pivot-group','pivot-axis-editor-fields'],
			classes: ['LibaptPivotGridEditor'],
			parent: 'pivot-all'
		},
		
		
		// PIVOT AXIS
		{
			name: 'pivot-group',
			file: APT_LIB_URL + '/js/L5-addons/pivot/axis/libapt-pivot-group.js',
			requires: ['core-object','storage-query-field'],
			classes: ['LibaptPivotGroup'],
			parent: 'pivot-all'
		},
		
		{
			name: 'pivot-axis-iterator',
			file: APT_LIB_URL + '/js/L5-addons/pivot/axis/libapt-pivot-axis-iterator.js',
			requires: ['core-object'],
			classes: ['LibaptPivotAxisIterator'],
			parent: 'pivot-all'
		},
		
		{
			name: 'pivot-axis-position',
			file: APT_LIB_URL + '/js/L5-addons/pivot/axis/libapt-pivot-axis-position.js',
			requires: ['core-object','pivot-axis'],
			classes: ['LibaptPivotAxisPosition'],
			parent: 'pivot-all'
		},
		
		{
			name: 'pivot-axis',
			file: APT_LIB_URL + '/js/L5-addons/pivot/axis/libapt-pivot-axis.js',
			requires: ['core-object','pivot-group','pivot-axis-iterator','pivot-axis-position'],
			classes: ['LibaptPivotAxis'],
			parent: 'pivot-all'
		},
		
		
		// PIVOT GRID
		{
			name: 'pivot-grid',
			file: APT_LIB_URL + '/js/L5-addons/pivot/grid/libapt-pivot-grid.js',
			requires: ['pivot-mixin-table','pivot-mixin-members','pivot-mixin-init','pivot-mixin-init-axis','views-model-view','pivot-axis','views-progress-window','pivot-grid-editor'],
			classes: ['LibaptPivotGrid'],
			parent: 'pivot-all'
		},
		
		{
			name: 'pivot-grid-checkbox',
			file: APT_LIB_URL + '/js/L5-addons/pivot/grid/libapt-pivot-grid-checkbox.js',
			requires: ['pivot-grid'],
			classes: ['LibaptPivotGridCheckbox'],
			parent: 'pivot-all'
		},
		
		{
			name: 'pivot-grid-time',
			file: APT_LIB_URL + '/js/L5-addons/pivot/grid/libapt-pivot-grid-time.js',
			requires: ['pivot-grid'],
			classes: ['LibaptPivotGridTime'],
			parent: 'pivot-all'
		}
	];


Libapt.register(addons_pivot_modules);
