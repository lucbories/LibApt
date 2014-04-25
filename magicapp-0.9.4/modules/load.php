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

// LOAD RESOURCES
RESSOURCES::loadViewsFromIniFile("/modules/home/views.ini");
RESSOURCES::loadMenusFromIniFile("/modules/home/menus.ini");

?>