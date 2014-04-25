<?php
/**
 * @file        load.php
 * @brief       LIBAPT-DEMO resources main loader
 * @details     Init application and load modules resources
 * @ingroup		LIBAPT_DEMO
 * @date        2013-01-04
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

// GET RESPONSE
$app = Application::getInstance();
$response = $app->getResponse();
$media = $app->getDefaultPageLayoutCssMedia();

// APT DEMO RESOURCES
$response->setPredefinedContentType("html");

// $response->addHeaderCss("css-libapt-demo", LIBAPT_APP_URL.'/css/libapt-demo.css', $media);
// $response->useHeader("css-libapt-demo", 8);

// $response->addHeaderScript("js-libapt-demo", LIBAPT_APP_URL.'/js/libapt-demo.js');
// $response->useHeader("js-libapt-demo", 50);


// INFOS OF THIS SITE
$response->addHeader("meta-author",	"<META name='AUTHOR' content='Luc BORIES'>");
$response->addHeader("meta-desc",	"<META name='DESCRIPTION' content='A tutorial simple application for the LIBAPT project.'>");
$response->addHeader("meta-copy",	"<META name='COPYRIGHT' content='Luc BORIES, Licence Apache 2'>");
$response->useHeader("meta-author");
$response->useHeader("meta-desc");
$response->useHeader("meta-copy");

// CACHE CONTROL : ENABLE CACHE
$response->addHeader("cache-control",	"<META http-equiv='Cache-Control' content='public'>"); 
$response->useHeader("cache-control");

// DISABLE INDEX OF THIS SITE
$response->addHeader("robots-none",	"<META name='ROBOTS' content='NONE'>");
$response->useHeader("robots-none");

// CACHE CONTROL
// $response->addHeader("no-cache-control",	"<META http-equiv='Cache-Control' content='no-cache'>"); 
// $response->addHeader("no-cache-pragma",		"<META http-equiv='Pragma' content='no-cache'>");
// $response->addHeader("no-cache-expires",	"<META http-equiv='Expires' content='0'>");
// $response->useHeader("no-cache-control");
// $response->useHeader("no-cache-pragma");
// $response->useHeader("no-cache-expires");


// SET TIMEZONE
date_default_timezone_set(LIBAPT_APP_DEFAULT_LOCAL);
	
// INIT THEME HTML ADAPTER
HTML::init(
	new JQueryUIHtmlAccordionAdapter(),
	// new FoundationHtmlAccordionAdapter(),
	new FoundationHtmlTableAdapter(),
	new FoundationHtmlGridLayoutAdapter(),
	new JQueryUIHtmlPortletAdapter(),
	array( new DefaultInputAdapter(), new JQueryUIHtmlInputAdapter(), new CLEditorInputAdapter() )
	);

// CONNECTION, AUTHENTICATION AND AUTHORIZATION RESOURCES
Authorization::init( new MapRoleAuthorization() );

// DB CONNECTIONS
// RESSOURCES::loadConnectionsFromCsvFile(LIBAPT_APP_MODULES_PATH."/common/db_connexions.csv");

// LOAD MODULES RESOURCES
include(LIBAPT_APP_ROOT."/modules/load.php");

?>