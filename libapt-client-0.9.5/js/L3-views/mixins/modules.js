/**
 * @file        L3-views/mixins/modules.js
 * @desc        javascript modules declaration
 * @group       LIBAPT_VIEWS
 * @date        2013-07-21
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_mixins_modules =
	[
		// L3-VIEWS EDITOR MIXINS
		{
			name: 'views-mixin-editor-string',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-editor-string.js',
			requires: ['core-object'],
			classes: ['LibaptMixinEditorString'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-mixin-editor-integer',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-editor-integer.js',
			requires: ['core-object'],
			classes: ['LibaptMixinEditorString'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-mixin-editor-select',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-editor-select.js',
			requires: ['core-object'],
			classes: ['LibaptMixinEditorSelect'],
			parent: 'views-mixins-all'
		},
		
		
		// L3-VIEWS BASIC MIXINS
		{
			name: 'views-view-mixin-link',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-link.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewLink'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-size',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-size.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewSize'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-select',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-select.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewSelect'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-table',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-table.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewTable'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-table-select',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-table-select.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewTableSelect'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-toolbars',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-toolbars.js',
			requires: ['core-object'],
			classes: ['LibaptMixinToolbars'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-loader',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-loader.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewLoader'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-visible',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-visible.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewVisible'],
			parent: 'views-mixins-all'
		},
		
		{
			name: 'views-view-mixin-titlebar',
			file: APT_LIB_URL + '/js/L3-views/mixins/libapt-mixin-view-titlebar.js',
			requires: ['core-object'],
			classes: ['LibaptMixinViewTitlebar'],
			parent: 'views-mixins-all'
		}
	];


Libapt.register(views_mixins_modules);

