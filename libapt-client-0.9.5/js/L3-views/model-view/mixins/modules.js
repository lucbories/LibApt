/**
 * @file        L3-views/model_view/mixins/modules.js
 * @desc        javascript modules declaration
 * @group       LIBAPT_VIEWS
 * @date        2013-07-21
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var views_model_mixins_modules =
	[
		// L3-VIEWS MODEL VIEW MIXINS
		{
			name: 'views-model-mixin-load',
			file: APT_LIB_URL + '/js/L3-views/model-view/mixins/libapt-mixin-view-model-load.js',
			requires: ['models-all'],
			classes: ['LibaptMixinViewModeLoad'],
			parent: 'views-model-mixins-all'
		},
		
		{
			name: 'views-model-mixin-query',
			file: APT_LIB_URL + '/js/L3-views/model-view/mixins/libapt-mixin-view-model-query.js',
			requires: ['models-all'],
			classes: ['LibaptMixinViewModeQuery'],
			parent: 'views-model-mixins-all'
		}
	];


Libapt.register(views_model_mixins_modules);

