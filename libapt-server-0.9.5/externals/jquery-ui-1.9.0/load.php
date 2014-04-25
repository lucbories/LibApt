<?php
/**
 * @file        load.php
 * @brief       Load JQUERY.UI plugin features
 * @details     Includes all PHP plugins files, register plugins headers, init plugins traces
 * @ingroup		LIBAPT_PLUGINS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// PLUGIN DEFINITION
$plugin_name		= "jquery-ui";
$plugin_version		= "1.9.0";
$plugin_file_name	= LIBAPT_FRAMEWORK_SERVER_ROOT."/externals/".$plugin_name."-".$plugin_version;
$plugin_url_name	= LIBAPT_FRAMEWORK_STATIC_URL."/externals/".$plugin_name."-".$plugin_version;

// GET RESPONSE
$app = Application::getInstance();
$response = $app->getResponse();
$media = $app->getDefaultPageLayoutCssMedia();


// LOAD PLUGINS PHP RESOURCES
require_once($plugin_file_name."/php/class_jquery-ui_html_accordion_adapter.php");
require_once($plugin_file_name."/php/class_jquery-ui_html_input_adapter.php");
require_once($plugin_file_name."/php/class_jquery-ui_html_portlet_adapter.php");

// JQUERY
$response->addHeaderScript("js-jquery-validate",	$plugin_url_name.'/js/jquery.validate.min.js');

// LOAD PLUGINS JS/CSS RESOURCES
$jquery_ui_theme = $app->getDefaultPageLayoutJQueryUITheme("smoothness");


// APT PLUGINS : JQUERY PLUGINS : JQUERY UI
$response->addHeaderCss("css-jquery-ui",		$plugin_url_name.'/css/'.$jquery_ui_theme.'/jquery-ui-'.$plugin_version.'.custom.min.css', $media);
$response->addHeaderScript("js-jquery-ui",		$plugin_url_name.'/js/jquery-ui-'.$plugin_version.'.custom.min.js');
$response->addHeaderScript("js-jquery-ui-tp",	$plugin_url_name.'/js/jquery-ui-timepicker-addon.js');

// ENANLE TOOLTIP WITH TITLE TAG
// $response->addScript(Response::$JS_DOC_READY, "$(document).tooltip();\n");
?>