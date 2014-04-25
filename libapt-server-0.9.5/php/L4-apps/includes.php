<?php
/**
 * @defgroup    L4_APPS			Libapt-main : application features
 * @ingroup		LIBAPT_MAIN
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        includes.php
 * @brief       Application features include file
 * @details     Includes all PHP files of the LIBAPT-MAIN/L4-APPS module
 * @ingroup		L4_APPS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

$layer = "L4-apps";

// API
load_class("$layer/api", "abstract_controller");
load_class("$layer/api", "abstract_crud_controller");
load_class("$layer/api", "abstract_application_session");
load_class("$layer/api", "abstract_application");


// CONTROLLERS
load_class("$layer/controller", "js_wrapper");
load_class("$layer/controller", "models_controller");
load_class("$layer/controller", "views_controller");
load_class("$layer/controller", "jsons_controller");
load_class("$layer/controller", "menus_controller");
load_class("$layer/controller", "connections_controller");
load_class("$layer/controller", "resources_controller");


// RESSOURCES LOADERS
load_class("$layer/loader", "csv_loader");
load_class("$layer/loader", "ini_loader");
load_class("$layer/loader", "connections_loader_adapter");
load_class("$layer/loader", "menus_loader_adapter");
load_class("$layer/loader", "models_loader_adapter");
load_class("$layer/loader", "views_loader_adapter");
load_class("$layer/loader", "ressources");


// LE SINGLETON DE L APPLICATION
load_class("$layer/application", "urls");
// load_class("$layer/application", "forms");
load_class("$layer/application", "controllers");
load_class("$layer/application", "errors");
load_class("$layer/application", "application");
load_class("$layer/application", "model_authentication");
load_class("$layer/application", "model_role_authorization");


// INIT CONTROLLERS
Controllers::init();
Controllers::registerController		("menuAction",		new MenusController() );
Controllers::registerModelController("modelAction",		new ModelsController() );
Controllers::registerViewController	("viewAction",		new ViewsController() );
Controllers::registerJsonController	("jsonAction",		new JsonsController());
Controllers::registerController		("connection",		new ConnectionsController() );
Controllers::registerController		("resourceAction",	new ResourcesController());



// ************************************************************************
// INT TRACE OF : L4-APPS
// ************************************************************************

	// API
AbstractController::$TRACE_CONTROLLER				= false;
AbstractController::$TRACE_CONTROLLER_STEP			= false;
AbstractController::$TRACE_CONTROLLER_OK			= false;


	// LOADER
CsvLoader::$TRACE_CSV_LOADER						= false;
IniLoader::$TRACE_INI_LOADER						= false;

MenusLoaderAdapter::$TRACE_MENUS_LOADER				= false;

ModelsLoaderAdapter::$TRACE_MODELS_LOADER			= false;
ModelsLoaderAdapter::$TRACE_MODELS_LOADER_OK		= false;

ViewsLoaderAdapter::$TRACE_VIEWS_LOADER				= false;
ViewsLoaderAdapter::$TRACE_VIEWS_LOADER_OK			= false;

	// CONTROLLERS
Controllers::$TRACE_CONTROLLERS						= false;

ModelsController::$TRACE_MODELS_CONTROLLER			= false;
ViewsController::$TRACE_VIEWS_CONTROLLER			= false;

JsonsController::$TRACE_JSON_CONTROLLER				= false;
JsonsController::$TRACE_JSON_CONTROLLER_STEP		= false;
JsonsController::$TRACE_JSON_CONTROLLER_OK			= false;

ResourcesController::$TRACE_RESOURCES_CONTROLLER	= false;

JSWRAPPER::$TRACE_JS_WRAPPER						= false;

	// APPLICATIONS
Application::$TRACE_APPLICATION						= false;
Controllers::$TRACE_CONTROLLERS						= false;
ModelAuthentication::$TRACE_MODEL_AUTH				= false;

?>