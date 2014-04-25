<?php
/**
 * @defgroup    LIBAPT_MAIN_JS		Libapt-main : JS main features
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

 
/**
 * @file        libapt-main-a.b.c/js/load.php
 * @brief       Main LIBAPT javascript features
 * @details     Declare all JS files of the LIBAPT-MAIN module
 * @ingroup		LIBAPT_MAIN_JS
 * @date        2012-03-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



// ****************************************************************************************************************
// LOAD CSS AND JS RESOURCES
// ****************************************************************************************************************

/**
 * @brief		Load common JS headers
 * @return		nothing
 */
function load_main_js_common()
{
	// GET RESPONSE
	$app = Application::getInstance();
	$response = $app->getResponse();
	$path = LIBAPT_MAIN_URL."/js";
	
	// ****************************************************************************************************************
	// INIT JS PLUGINS PATH
	// ****************************************************************************************************************
	$response->addHeaderScript("js-libapt-init-path1", "var APT_LIB_URL='".LIBAPT_MAIN_URL."';", "text/javascript", true);
	$response->addHeaderScript("js-libapt-init-path2", "var APT_LIB_PLUGINS_URL='".LIBAPT_PLUGINS_URL."';", "text/javascript", true);
	$response->useHeader("js-libapt-init-path1", Response::$ORDER_MIN);
	$response->useHeader("js-libapt-init-path2", Response::$ORDER_MIN);
	
	// IMAGES URL
	define("LIBAPT_IMAGES_URL", LIBAPT_LIB_URL."libapt-images-".LIBAPT_VERSION."/images/");
	$response->addHeaderScript("js-libapt-images", "var APT_IMAGES_URL='".LIBAPT_IMAGES_URL."';", "text/javascript", true);
	$response->useHeader("js-libapt-images", Response::$ORDER_MIN);
	
	$response->addHeaderScript("js-libapt",						"$path/libapt.js");
	$response->useHeader("js-libapt", 21);
}

?>