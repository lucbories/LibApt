/**
 * @file        modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var libaptmain_modules =
	[
		// L0-CORE
		{
			name: 'core-all',
			modules_file: APT_LIB_URL + '/js/L0-core/modules.js',
			requires: ['core-object','core-event','core-action','core-editors'],
			classes: [],
			parent: null
		},
		
		// L1-STORAGE
		{
			name: 'storage-all',
			modules_file: APT_LIB_URL + '/js/L1-storage/modules.js',
			requires: ['core-all'],
			classes: [],
			parent: null
		},
		
		// L2-MODELS
		{
			name: 'models-all',
			modules_file: APT_LIB_URL + '/js/L2-models/modules.js',
			requires: ['storage-all'],
			classes: [],
			parent: null
		},
		
		// L3-VIEWS
		{
			name: 'views-all',
			modules_file: APT_LIB_URL + '/js/L3-views/modules.js',
			requires: ['models-all'],
			classes: [],
			parent: null
		},
		
		// L4-APPS
		{
			name: 'apps-all',
			modules_file: APT_LIB_URL + '/js/L4-apps/modules.js',
			requires: ['views-all'],
			classes: [],
			parent: null
		},
		
		// L5-ADDONS
		{
			name: 'addons-all',
			modules_file: APT_LIB_URL + '/js/L5-addons/modules.js',
			requires: ['apps-all'],
			classes: [],
			parent: null
		}
	];

Libapt.register(libaptmain_modules);