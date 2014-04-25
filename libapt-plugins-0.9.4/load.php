<?php
/**
 * @defgroup    LIBAPT_PLUGINS			Libapt-plugins : plugins features
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        load.php
 * @brief       Load all plugins features
 * @details     Includes all PHP plugins files, register plugins headers, init plugins traces
 * @ingroup		LIBAPT_PLUGINS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */




// LOAD REQUIRED PLUGINS
load_plugin('themes-foundation',	'3.1.1');
load_plugin('jquery-ui',			'1.9.0');

// LOAD OPTIONAL PLUGINS
load_plugin('jquery.cleditor',		'1.3.0');
load_plugin('dygraph',				'1.0.0');
load_plugin('select2',				'3.2.0');

// load_plugin('jquery.datatables',	'1.9.2');
// load_plugin('libapt-calendars',		'0.9.0');
// load_plugin('libapt-docwiki',		'0.9.0');
?>