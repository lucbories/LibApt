<?php
/**
 * @file        load.php
 * @brief       Load CLEDITOR plugin features
 * @details     Includes all PHP plugins files, register plugins headers, init plugins traces
 * @ingroup		LIBAPT_PLUGINS
 * @date        2012-12-28
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// PLUGIN DEFINITION
$plugin_name		= "jquery.cleditor";
$plugin_version		= "1.3.0";
$plugin_file_name	= LIBAPT_PLUGINS_PHP_ROOT."/".$plugin_name."-".$plugin_version;
$plugin_url_name	= LIBAPT_PLUGINS_URL."/".$plugin_name."-".$plugin_version;

// GET RESPONSE
$app = Application::getInstance();
$response = $app->getResponse();
$media = $app->getDefaultPageLayoutCssMedia();


// LOAD PLUGINS PHP RESOURCES
require_once($plugin_file_name."/php/class_cleditor_input_adapter.php");

// LOAD PLUGINS JS RESOURCES
$response->addHeaderScript("js-jquery-cleditor",			$plugin_url_name.'/js/jquery.cleditor.min.js');
$response->addHeaderScript("js-jquery-cleditor-advtable",	$plugin_url_name.'/js/jquery.cleditor.advancedtable.min.js');
$response->addHeaderScript("js-jquery-cleditor-icon",		$plugin_url_name.'/js/jquery.cleditor.icon.min.js');

// LOAD PLUGINS CSS RESOURCES
$response->addHeaderCss("css-jquery-cleditor",		$plugin_url_name.'/css/jquery.cleditor.css', $media);



?>