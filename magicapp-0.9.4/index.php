<?php
/**
 * @defgroup    LIBAPT_DEMO		Libapt-demo : demo application
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        index.php
 * @brief       LIBAPT-DEMO main file
 * @details     Define and load all application resources
 * @ingroup		LIBAPT_DEMO
 * @date        2013-01-04
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// ------------ LOAD APPLICATION CONFIGURATION ------------
define('LIBAPT_APP_ROOT',	dirname(__FILE__));
require_once(LIBAPT_APP_ROOT."/app_cfg.php");


// ------------ LOAD FRAMEWORK RESSOURCES ------------
require_once(LIBAPT_MAIN_ROOT."/load.php");


// ------------ INIT FRAMEWORK RESSOURCES ------------
CONTRACT::init( new ContractExceptionAdapter() );
CACHE::init( new FileCacheAdapter(LIBAPT_CACHE_ROOT, LIBAPT_CACHE_PAGES_TTL) );


// GET PAGE KEY AND CACHE BUFFER IF A CACHED PAGE EXIST
$page_key = Application::getInstance()->getRequest()->getPageKey();
$buffer = CACHE::fetch($page_key, false);

// A CACHED PAGE IS FOUND
if ($buffer)
{
	echo $buffer;
	exit;
}

// NO CACHED PAGE FOUND : CREATE IT
CACHE::startPhpCache();

// START APPLICATION SESSION
Application::getInstance()->startSession();

try
{
	// LOAD FRAMEWORK PLUGINS RESSOURCES
	require_once(LIBAPT_PLUGINS_PHP_ROOT."/load.php");

	// LOAD APPLICATION RESSOURCES
	include(LIBAPT_APP_ROOT."/load.php");
}
catch(Exception $e)
{
	ERRORS::errorApplicationInit($e->getMessage());
}


// NO ERROR OCCURES DURING RESOURCES LOADING
if ( ! ERRORS::hasErrors() )
{
	$result = true;
	
	// RUN APPLICATIONS IN TEST UNIT MODE
	if ( Application::getInstance()->hasRunTU() )
	{
		$result = Application::getInstance()->runTU();
	}
	// RUN APPLICATIONS IN NORMAL MODE
	else
	{
		$result = Application::getInstance()->run();
	}
	if ( ! $result )
	{
		ERRORS::errorApplication("Run failed");
	}
}



// DISPLAY ERRORS
if ( ERRORS::hasErrors() )
{
	$response = $app->getResponse();
	$response->setStatus('400');
	$response->generateHtmlStatus();
	$response->generateHtmlErrorPage();
}

$page_is_cachable = false;
if ($page_is_cachable)
{
	$buffer = CACHE::stopPhpCache($page_key);
	$search_patterns	= array('/\>[^\S ]+/s','/[^\S ]+\</s','/(\s)+/s');
	$replace_patterns	= array('>','<','\\1');
	$compressed_buffer	= preg_replace($search_patterns, $replace_patterns, $buffer);
	echo $compressed_buffer;
}
else
{
	// TODO
}
?>