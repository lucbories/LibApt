/**
 * @file        L0-core/introspect/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var core_introspection_modules =
	[
		{
			name: 'core-introspect-compatibility',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-compatibility.js',
			requires: [],
			classes: [],
			parent: 'core-introspect-all'
		},
		
		{
			name: 'core-introspect-traces',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-traces.js',
			requires: ['libapt-console'],
			classes: [],
			parent: 'core-introspect-all'
		},
				
		{
			name: 'core-introspect-types',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-types.js',
			requires: [],
			classes: [],
			parent: 'core-introspect-all'
		},
				
		{
			name: 'core-introspect-cache',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-cache.js',
			requires: ['core-introspect-compatibility'],
			classes: [],
			parent: 'core-introspect-all'
		},
		
		{
			name: 'core-introspect-init',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-init.js',
			requires: ['core-introspect-traces','core-introspect-types'],
			classes: [],
			parent: 'core-introspect-all'
		},
		
		{
			name: 'core-introspect-utils',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-utils.js',
			requires: [],
			classes: [],
			parent: 'core-introspect-all'
		},
		
		{
			name: 'core-introspect-classes',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-classes.js',
			requires: ['core-introspect-traces','core-introspect-types'],
			classes: ['core-introspect-cache','core-introspect-compatibility','core-introspect-traces','core-introspect-utils','core-introspect-types'],
			parent: 'core-introspect-all'
		},
		
		{
			name: 'core-introspect-inheritance',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-inheritance.js',
			requires: ['core-introspect-traces','core-introspect-types'],
			classes: [],
			parent: 'core-introspect-all'
		},
		
		{
			name: 'core-introspect-options',
			file: APT_LIB_URL + '/js/L0-core/introspect/libapt-introspect-options.js',
			requires: ['core-introspect-traces','core-introspect-types','core-introspect-inheritance'],
			classes: [],
			parent: 'core-introspect-all'
		}
	];


Libapt.register(core_introspection_modules);
