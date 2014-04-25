<?php
/**
 * @defgroup    L3_VIEWS			Libapt-main : views features
 * @ingroup		LIBAPT_MAIN
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        includes.php
 * @brief       Views features include file
 * @details     Includes all PHP files of the LIBAPT-MAIN/L3-VIEWS module
 * @ingroup		L3_VIEWS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

$layer = "L3-views";

// API
load_class("$layer/api", "abstract_controlled_view");
load_class("$layer/api", "abstract_controlled_view_impl");

load_class("$layer/api", "abstract_view");
load_class("$layer/api", "abstract_view_impl");

load_class("$layer/api", "abstract_template_view");
load_class("$layer/api", "abstract_template_view_impl");

load_class("$layer/api", "abstract_model_view");
load_class("$layer/api", "abstract_model_view_impl");


// SIMPLE VIEWS
load_class("$layer", "js_view");
load_class("$layer", "js_model_view");
load_class("$layer", "include_view");
load_class("$layer", "template_view");

load_class("$layer", "errors_view");
load_class("$layer", "login_profile_view");


// LAYOUT VIEWS
load_class("$layer/layout", "controlled_menus_bar_view");
load_class("$layer/layout", "abstract_page_layout_view");
load_class("$layer/layout", "default_page_layout_view");


// MODEL VIEWS - TABLES
// load_class("$layer/examples/tables", "abstract_table_model_view");
// load_class("$layer/examples/tables", "table_model_view");


// MODEL VIEWS - SELECTOR
// load_class("$layer/examples/selectors", "selector_model_view");




// ************************************************************************
// INT TRACE OF : L3-VIEWS
// ************************************************************************

AbstractTemplateView::$TRACE_TEMPLATE_VIEW			= false;
AbstractModelViewImpl::$TRACE_MODEL_VIEW			= false;
// SelectorModelView::$TRACE_SELECTOR_VIEW				= false;

?>