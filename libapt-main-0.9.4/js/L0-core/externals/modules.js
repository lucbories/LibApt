/**
 * @file        L0-core/externals/modules.js
 * @desc        javascript modules declaration for externals libs
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-19
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var core_exernals_modules =
	[
		// EXTERNALS LIBS : HASH AND ENCRYPTION
		{
			name: 'libapt-md5',
			file: APT_LIB_URL + '/js/L0-core/externals/md5.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		{
			name: 'libapt-base64',
			file: APT_LIB_URL + '/js/L0-core/externals/base64.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		{
			name: 'libapt-aes',
			file: APT_LIB_URL + '/js/L0-core/externals/aes.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		
		// EXTERNALS LIBS : CANVAS AND IMAGE MANIPULATION
		{
			name: 'libapt-canvas2image',
			file: APT_LIB_URL + '/js/L0-core/externals/canvas2image.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		{
			name: 'libapt-html2canvas',
			file: APT_LIB_URL + '/js/L0-core/externals/html2canvas.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		{
			name: 'libapt-prettify',
			file: APT_LIB_URL + '/js/L0-core/externals/prettify.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		
		// EXTERNALS LIBS : CONSOLE
		{
			name: 'libapt-console',
			file: APT_LIB_URL + '/js/L0-core/externals/consolelog.min.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		},
		
		{
			name: 'libapt-console-details',
			file: APT_LIB_URL + '/js/L0-core/externals/consolelog.detailprint.min.js',
			requires: [],
			classes: [],
			parent: 'core-externals-all'
		}
	];

Libapt.register(core_exernals_modules);

