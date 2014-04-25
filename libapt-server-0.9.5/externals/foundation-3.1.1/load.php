<?php
/**
 * @file        load.php
 * @brief       Load LIBAPT-DOCWIKI plugin features
 * @details     Includes all PHP plugins files, register plugins headers, init plugins traces
 * @ingroup		LIBAPT_PLUGINS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// PLUGIN DEFINITION
$plugin_name		= "foundation";
$plugin_version		= "3.1.1";
$plugin_file_name	= LIBAPT_FRAMEWORK_SERVER_ROOT."/externals/".$plugin_name."-".$plugin_version;
$plugin_url_name	= LIBAPT_FRAMEWORK_STATIC_URL."/externals/".$plugin_name."-".$plugin_version;

// GET RESPONSE
$app = Application::getInstance();
$response = $app->getResponse();
$media = $app->getDefaultPageLayoutCssMedia();


// LOAD PLUGINS PHP RESOURCES
require_once($plugin_file_name."/php/class_foundation_html_select_adapter.php");
require_once($plugin_file_name."/php/class_foundation_html_table_adapter.php");
require_once($plugin_file_name."/php/class_foundation_html_accordion_adapter.php");
require_once($plugin_file_name."/php/class_foundation_html_grid_layout_adapter.php");


// LOAD PLUGINS JS/CSS RESOURCES
$response->addHeaderScript("js-foundation",					$plugin_url_name.'/js/foundation.min.js');
$response->addHeaderScript("js-libapt-foundation",			$plugin_url_name.'/js/libapt_foundation.js');
$response->addHeaderCss("css-foundation",					$plugin_url_name.'/css/foundation.min.css', $media);

?>