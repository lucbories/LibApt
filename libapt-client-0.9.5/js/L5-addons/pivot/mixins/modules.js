/**
 * @file        L5-addons/pivot/mixins/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-08-01
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var addons_pivot_mixins_modules =
	[
		// L5-ADDONS PIVOT MIXINS
		{
			name: 'pivot-mixin-table',
			file: APT_LIB_URL + '/js/L5-addons/pivot/mixins/libapt-mixin-pivot-table.js',
			requires: ['core-all'],
			classes: ['LibaptMixinViewTablePivot'],
			parent: 'pivot-mixins-all'
		},
		
		{
			name: 'pivot-mixin-members',
			file: APT_LIB_URL + '/js/L5-addons/pivot/mixins/libapt-mixin-pivot-members.js',
			requires: ['core-all','libapt-tjs'],
			classes: ['LibaptMixinPivotMembers'],
			parent: 'pivot-mixins-all'
		},
		
		{
			name: 'pivot-mixin-init',
			file: APT_LIB_URL + '/js/L5-addons/pivot/mixins/libapt-mixin-pivot-init.js',
			requires: ['core-all'],
			classes: ['LibaptMixinPivotInit'],
			parent: 'pivot-mixins-all'
		},
		
		{
			name: 'pivot-mixin-init-axis',
			file: APT_LIB_URL + '/js/L5-addons/pivot/mixins/libapt-mixin-pivot-init-axis.js',
			requires: ['core-all'],
			classes: ['LibaptMixinPivotInitAxis'],
			parent: 'pivot-mixins-all'
		}
	];


Libapt.register(addons_pivot_mixins_modules);

