<?php
/**
 * @file        app_cfg.php
 * @brief       First application main file
 * @details     Define and load all application resources
 * @ingroup		LIBAPT-TUTORIAL
 * @date        2013-02-21
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// ------------ APPLICATION CONFIGURATION ------------

// LABELS AND OPTIONS
define('LIBAPT_APP_TITLE',					"MAGICAPP");
define('LIBAPT_APP_SHORT_LABEL',			"MAGICAPP");
define('LIBAPT_APP_LONG_LABEL', 			"MAGIC APPLICATION");
define('LIBAPT_APP_VERSION',				"0.9.4");
define('LIBAPT_APP_DEFAULT_LOCAL',			"Europe/Paris");
define('LIBAPT_APP_DEFAULT_CHARSET',		"WINDOWS-FR");
// define('LIBAPT_APP_DEFAULT_CHARSET',		"UTF-8");
define('LIBAPT_APP_HTML_LANGUAGE',			"FR");
define('LIBAPT_APP_HTML_CHARSET',			"UTF-8");
 
// ENVIRONNEMENT
define('LIBAPT_APP_ENV_SHORT_LABEL',		"PRO");
define('LIBAPT_APP_ENV_LONG_LABEL',			"PRODUCTION");

// AUTHORS
define('LIBAPT_APP_AUTHOR_NAME',			"!!! author name !!!");
define('LIBAPT_APP_AUTHOR_EMAIL',			"!!! author email !!!");

// SECURITY OPTIONS
define('LIBAPT_APP_HAS_AUTHENTIFICATION',	"FALSE");
define('LIBAPT_APP_HAS_AUTO_LOGIN',			"FALSE");
define('LIBAPT_APP_AUTO_LOGIN',				"");
define('LIBAPT_APP_AUTO_PASSWORD',			"");
define('LIBAPT_APP_IS_OFFLINE',				"FALSE");
define('LIBAPT_APP_IS_READONLY',			"TRUE");
define('LIBAPT_APP_RUN_TU',					"FALSE");

// TRACE OPTIONS
define('LIBAPT_APP_TRACE_ECHO',				"TRUE");
define('LIBAPT_APP_TRACE_STACK',			"TRUE");
define('LIBAPT_APP_TRACE_FILE',				"FALSE");
define('LIBAPT_APP_TRACE_FILE_NAME',		"datas/traces.log");

// SESSION OPTIONS
define('LIBAPT_APP_SESSION_FILE',			"FALSE");
define('LIBAPT_APP_SESSION_FILE_PATH',		"datas/");

// DEFAULT PAGE LAYOUT
define('LIBAPT_APP_LAYOUT_CSS_MEDIA',		"screen");	// screen / print / handheld / tty / tv / braille / all
define('LIBAPT_APP_LAYOUT_VIEW_CLASS',		"DefaultPageLayoutView");
define('LIBAPT_APP_LAYOUT_MENUS_BAR',		"MENUS_BAR");
define('LIBAPT_APP_LAYOUT_VIEW_TEMPLATE',	"{menus}{content}{this}");
define('LIBAPT_APP_LAYOUT_JQUERY_UI_THEME',	"smoothness");

// APPLICATION URL AND HOME PAGE
define('LIBAPT_APP_DOMAIN',					"www.my-domain.org");
define('LIBAPT_APP_URL',					"/magicapp-".LIBAPT_APP_VERSION."/");
define('LIBAPT_APP_HOME',					"VIEW_HOME");
define('LIBAPT_APP_MODULES_PATH',			"/../libapt-modules-".LIBAPT_APP_VERSION);
define('LIBAPT_APP_MODULES_URL',			"../libapt-modules-".LIBAPT_APP_VERSION."/");
define('LIBAPT_APP_MODULES_ROOT',			LIBAPT_APP_ROOT.LIBAPT_APP_MODULES_PATH);



// ------------ LIBAPT CONFIGURATION ------------

// LIBAPT
define('LIBAPT_VERSION',					LIBAPT_APP_VERSION);

define('LIBAPT_LIB_ROOT',					LIBAPT_APP_ROOT."/../");
define('LIBAPT_LIB_URL',					LIBAPT_APP_URL."../");


// LIBAPT-MAIN
define('LIBAPT_MAIN_NAME',					"libapt-main-".LIBAPT_VERSION);
define('LIBAPT_MAIN_ROOT',					LIBAPT_LIB_ROOT.LIBAPT_MAIN_NAME);
define('LIBAPT_MAIN_URL',					LIBAPT_LIB_URL.LIBAPT_MAIN_NAME);

// LIBAPT-MAIN-TU
define('LIBAPT_MAIN_TU_NAME',				"libapt-main-".LIBAPT_VERSION."-tu");
define('LIBAPT_MAIN_TU_ROOT',				LIBAPT_LIB_ROOT.LIBAPT_MAIN_TU_NAME);

// LIBAPT-PLUGINS
define('LIBAPT_PLUGINS_VERSION',			LIBAPT_APP_VERSION);

define('LIBAPT_PLUGINS_NAME',				"libapt-plugins-".LIBAPT_PLUGINS_VERSION);
define('LIBAPT_PLUGINS_ROOT',				LIBAPT_LIB_ROOT.LIBAPT_PLUGINS_NAME);
define('LIBAPT_PLUGINS_URL',				LIBAPT_LIB_URL.LIBAPT_PLUGINS_NAME);

define('LIBAPT_PLUGINS_PHP_NAME',			"libapt-plugins-".LIBAPT_PLUGINS_VERSION);
define('LIBAPT_PLUGINS_PHP_ROOT',			LIBAPT_LIB_ROOT.LIBAPT_PLUGINS_PHP_NAME);



// ------------ ACTIVE THEME CONFIGURATION ------------

// THEMES RESOURCES NAME
define('LIBAPT_THEMES_DEFAULT',				"foundation-3.1.1");
define('LIBAPT_THEMES_ACTIVE_WWW_NAME',		LIBAPT_PLUGINS_NAME."/themes-".LIBAPT_THEMES_DEFAULT);
define('LIBAPT_THEMES_ACTIVE_PHP_NAME',		LIBAPT_PLUGINS_PHP_NAME."/themes-".LIBAPT_THEMES_DEFAULT);

// THEMES RESOURCES URL
define('LIBAPT_THEMES_ACTIVE_WWW_URL',		LIBAPT_LIB_URL.LIBAPT_THEMES_ACTIVE_WWW_NAME);

// THEMES RESOURCES PATH
define('LIBAPT_THEMES_ACTIVE_WWW_ROOT',		LIBAPT_LIB_ROOT."/".LIBAPT_THEMES_ACTIVE_WWW_NAME."/");
define('LIBAPT_THEMES_ACTIVE_PHP_ROOT',		LIBAPT_LIB_ROOT."/".LIBAPT_THEMES_ACTIVE_PHP_NAME);



// ------------ CACHE CONFIGURATION ------------

// SERVER CACHE FILES PATHS
define('LIBAPT_CACHE_ROOT',					LIBAPT_APP_ROOT."/datas/cache");
// define('LIBAPT_CACHE_SESSIONS_ROOT',		LIBAPT_CACHE_ROOT."/cache-sessions");
// define('LIBAPT_CACHE_VIEWS_ROOT',			LIBAPT_CACHE_ROOT."/cache-views");
// define('LIBAPT_CACHE_MODELS_ROOT',			LIBAPT_CACHE_ROOT."/cache-models");
// define('LIBAPT_CACHE_PAGES_ROOT',			LIBAPT_CACHE_ROOT."/cache-pages");

// SERVER CACHE TIME TO LEAVE (TTL)
define('LIBAPT_CACHE_PAGES_TTL',			86400); // 24 hours = 24*60 minutes = 24*60*60 seconds = 86400 seconds
define('LIBAPT_CACHE_VIEWS_TTL',			86400); // 24 hours = 24*60 minutes = 24*60*60 seconds = 86400 seconds
define('LIBAPT_CACHE_MODELS_TTL',			300); // 5 minutes = 5*60 seconds = 300 seconds

// CLIENT CACHE
define('LIBAPT_CACHE_PAGES_EXPIRES',		""); // ...
define('LIBAPT_CACHE_VIEWS_EXPIRES',		""); // ...
define('LIBAPT_CACHE_MODELS_EXPIRES',		""); // ...

?>