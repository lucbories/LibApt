/**
 * @file        L2-models/modules.js
 * @desc        javascript modules declaration
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


var models_modules =
	[
		{
			name: 'models-model',
			file: APT_LIB_URL + '/js/L2-models/libapt-model.js',
			requires: ['core-object','storage-remote-json'],
			classes: ['LibaptModel'],
			parent: 'models-all'
		}
	];


Libapt.register(models_modules);
