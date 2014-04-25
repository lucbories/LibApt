<?php
/**
 * @defgroup    LIBAPT_MAIN		Libapt-main : main features
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        includes.php
 * @brief       Main LIBAPT features
 * @details     Includes all PHP files of the LIBAPT-MAIN module
 * @ingroup		LIBAPT_MAIN
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


// ****************************************************************************************************************
// LOAD PHP RESOURCES
// ****************************************************************************************************************
require_once(LIBAPT_FRAMEWORK_SERVER_ROOT."/php/L0-core/lib/load_resources.php");
require_once(LIBAPT_FRAMEWORK_SERVER_ROOT."/php/L0-core/includes.php");
require_once(LIBAPT_FRAMEWORK_SERVER_ROOT."/php/L1-storage/includes.php");
require_once(LIBAPT_FRAMEWORK_SERVER_ROOT."/php/L2-models/includes.php");
require_once(LIBAPT_FRAMEWORK_SERVER_ROOT."/php/L3-views/includes.php");
require_once(LIBAPT_FRAMEWORK_SERVER_ROOT."/php/L4-apps/includes.php");




// GET RESPONSE
$app = Application::getInstance();
$response = $app->getResponse();
$media = $app->getDefaultPageLayoutCssMedia();




// ****************************************************************************************************************
// INIT JS PATH
// ****************************************************************************************************************
$response->addHeaderScript("js-libapt-init-path1", "var APT_LIB_URL='".LIBAPT_FRAMEWORK_CLIENT_URL."';", "text/javascript", true);
$response->useHeader("js-libapt-init-path1", Response::$ORDER_MIN);

// TRANSLATION MODEL
$response->addHeaderScript("js-libapt-init-tr", "APT_LIB_TR_MODEL='".LIBAPT_APP_TRANSLATIONS_MODEL."';", "text/javascript", true);
$response->useHeader("js-libapt-init-tr", Response::$ORDER_MIN);

// IMAGES URL
$response->addHeaderScript("js-libapt-images", "var APT_IMAGES_URL='".LIBAPT_FRAMEWORK_STATIC_IMG_URL."';", "text/javascript", true);
$response->useHeader("js-libapt-images", Response::$ORDER_MIN);

$path = LIBAPT_FRAMEWORK_CLIENT_URL."/js";
$response->addHeaderScript("js-libapt", "$path/libapt.js");
$response->useHeader("js-libapt", 21);




// LOAD REQUIRED PLUGINS
load_plugin('foundation',	'3.1.1');
load_plugin('jquery-ui',	'1.9.0');




// ****************************************************************************************************************
// INIT DEFAULT MODELS
// ****************************************************************************************************************

/**
 * @brief		REGISTER DEFAULT MODELS
 * @details		Init RequestModel and SessionModel
 * @see			Init RequestModel SessionModel
 * @return		boolean
 */
function init_default_models()
{
	$models_controller = Controllers::getController("modelAction");
	if ( is_null($models_controller) )
	{
		$TRACE_ENABLED = true;
		return TRACE::leaveko("libapt-main/includes.php", "models controller is null", false, $TRACE_ENABLED);
	}
	else
	{
		// REQUEST MODEL
		$model_name = "RequestModel";
		$model = new RequestModel($model_name);
		
		$models_controller->registerAction(ModelsController::$ACTION_PREFIX_READ.$model_name,	$model, ModelsController::$READ_ACCESS);
		
		if (Authorization::hasRoleAdapter())
		{
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$READ_ACCESS,   "ROLE_AUTH_MENU_MAIN");
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$CREATE_ACCESS, "ROLE_REQUEST_CREATE");
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$UPDATE_ACCESS, "ROLE_REQUEST_UPDATE");
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$DELETE_ACCESS, "ROLE_REQUEST_DELETE");
		}
		$models_controller->registerObject($model);
		
		// SESSION MODEL
		$model_name = "SessionModel";
		$model = new SessionModel($model_name);
		
		$models_controller->registerAction(ModelsController::$ACTION_PREFIX_READ.$model_name,	$model, ModelsController::$READ_ACCESS);
		
		if (Authorization::hasRoleAdapter())
		{
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$READ_ACCESS,   "ROLE_AUTH_MENU_MAIN");
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$CREATE_ACCESS, "ROLE_SESSION_CREATE");
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$UPDATE_ACCESS, "ROLE_SESSION_UPDATE");
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$DELETE_ACCESS, "ROLE_SESSION_DELETE");
		}
		$models_controller->registerObject($model);
	}
	return true;
}
?>