/**
 * @file        L0-core/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var core_modules =
	[
		{
			name: 'libapt-externals',
			modules_file: APT_LIB_URL + '/js/L0-core/externals/modules.js',
			requires: [],
			classes: [],
			parent: 'core-all'
		},
		
		{
			name: 'libapt-main',
			file: APT_LIB_URL + '/js/L0-core/libapt-main.js',
			requires: ['libapt-md5','libapt-base64','libapt-console','libapt-console-details'],
			classes: [],
			parent: 'core-all'
		},
		
		{
			name: 'core-mixin-assertion',
			file: APT_LIB_URL + '/js/L0-core/mixins/libapt-mixin-assertion.js',
			requires: [],
			classes: ['LibaptMixinAssertion'],
			parent: 'core-all'
		},
		
		{
			name: 'core-mixin-trace',
			file: APT_LIB_URL + '/js/L0-core/mixins/libapt-mixin-trace.js',
			requires: [],
			classes: ['LibaptMixinTrace'],
			parent: 'core-all'
		},
		
		{
			name: 'core-mixin-callback',
			file: APT_LIB_URL + '/js/L0-core/mixins/libapt-mixin-callback.js',
			requires: [],
			classes: ['LibaptMixinCallback'],
			parent: 'core-all'
		},
		
		{
			name: 'core-mixin-event-listener',
			file: APT_LIB_URL + '/js/L0-core/mixins/libapt-mixin-event-listener.js',
			requires: [],
			classes: ['LibaptMixinEventListener'],
			parent: 'core-all'
		},
		
		{
			name: 'core-mixin-event-sender',
			file: APT_LIB_URL + '/js/L0-core/mixins/libapt-mixin-event-sender.js',
			requires: [],
			classes: ['LibaptMixinEventSender'],
			parent: 'core-all'
		},
		
		{
			name: 'core-object',
			file: APT_LIB_URL + '/js/L0-core/libapt-object.js',
			requires: ['libapt-main','core-mixin-assertion','core-mixin-trace','core-mixin-callback','core-mixin-event-listener','core-mixin-event-sender'],
			classes: ['LibaptObject'],
			parent: 'core-all'
		},
		
		{
			name: 'core-action',
			file: APT_LIB_URL + '/js/L0-core/libapt-action.js',
			requires: ['core-object'],
			classes: ['LibaptAction'],
			parent: 'core-all'
		},
		
		{
			name: 'core-editors',
			file: APT_LIB_URL + '/js/L0-core/libapt-editors.js',
			requires: ['core-object'],
			classes: ['LibaptEditors'],
			parent: 'core-all'
		},
		
		{
			name: 'core-event',
			file: APT_LIB_URL + '/js/L0-core/libapt-event.js',
			requires: ['core-object'],
			classes: ['LibaptEvent'],
			parent: 'core-all'
		}
	];

Libapt.register(core_modules);

