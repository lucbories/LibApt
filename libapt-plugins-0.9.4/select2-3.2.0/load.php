<?php
/**
 * @file        load.php
 * @brief       Load DYGRAPH plugin features
 * @details     Includes all PHP plugins files, register plugins headers, init plugins traces
 * @ingroup		LIBAPT_PLUGINS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// PLUGIN DEFINITION
$plugin_name		= "select2";
$plugin_version		= "3.2.0";
$plugin_file_name	= LIBAPT_PLUGINS_PHP_ROOT."/".$plugin_name."-".$plugin_version;
$plugin_url_name	= LIBAPT_PLUGINS_URL."/".$plugin_name."-".$plugin_version;

// GET RESPONSE
$app = Application::getInstance();
$response = $app->getResponse();
$media = $app->getDefaultPageLayoutCssMedia();


// LOAD PLUGINS PHP RESOURCES


// LOAD PLUGINS JS RESOURCES
$response->addHeaderScript("js-select2",	$plugin_url_name.'/js/select2.js');
$response->useHeader("js-select2", 20);

// LOAD PLUGINS CSS RESOURCES
$response->addHeaderCss("css-select2",	$plugin_url_name.'/css/select2.css', $media);
$response->useHeader("css-select2", 20);
?>