/**
 * @file        L1-storage/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var storage_modules =
	[
		// QUERY ITEMS
		{
			name: 'storage-query-field',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-field.js',
			requires: ['core-object'],
			classes: ['LibaptField'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-fieldsset',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-fieldsset.js',
			requires: ['core-object', 'storage-query-field'],
			classes: ['LibaptFieldsSet'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-filter',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-filter.js',
			requires: ['core-object', 'storage-query-field'],
			classes: ['LibaptFilter'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-filtersset',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-filtersset.js',
			requires: ['core-object', 'storage-query-filter'],
			classes: ['LibaptFiltersSet'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-group',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-group.js',
			requires: ['core-object', 'storage-query-field'],
			classes: ['LibaptGroup'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-groupsset',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-groupsset.js',
			requires: ['core-object', 'storage-query-group'],
			classes: ['LibaptGroupsSet'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-order',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-order.js',
			requires: ['core-object', 'storage-query-field'],
			classes: ['LibaptOrder'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-query-ordersset',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-ordersset.js',
			requires: ['core-object', 'storage-query-order'],
			classes: ['LibaptOrdersSet'],
			parent: 'storage-all'
		},
		
		
		// QUERY OBJECT
		{
			name: 'storage-query',
			file: APT_LIB_URL + '/js/L1-storage/query/libapt-query.js',
			requires: ['storage-query-fieldsset', 'storage-query-filtersset', 'storage-query-ordersset', 'storage-query-groupsset'],
			classes: ['LibaptQuery'],
			parent: 'storage-all'
		},
		
		
		// STORAGE ENGINES
		{
			name: 'storage-api',
			file: APT_LIB_URL + '/js/L1-storage/libapt-storage-api.js',
			requires: ['storage-query'],
			classes: ['LibaptStorage'],
			parent: 'storage-all'
		},
		
		{
			name: 'storage-remote-json',
			file: APT_LIB_URL + '/js/L1-storage/libapt-storage-json.js',
			requires: ['storage-api'],
			classes: ['LibaptStorageRemoteJson'],
			parent: 'storage-all'
		}
	];


Libapt.register(storage_modules);
