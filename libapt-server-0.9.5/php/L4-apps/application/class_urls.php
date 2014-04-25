<?php
/**
 * @file        class_urls.php
 * @brief       URL helpers
 * @details     ...
 * @see			Application Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class URLS
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// PAGES
	static public function getPageUrl()
	{
		return Application::getInstance()->getBaseUrl()."index.php";
	}
	
	static public function getHomeUrl()
	{
		return self::getPageUrl()."?viewAction=".ViewsController::$ACTION_PREFIX_HTML_PAGE.Application::getInstance()->getHomeView();
	}
	
	static public function getViewPageUrl($arg_view_name, $arg_view_options = null)
	{
		$opt_str = (is_null($arg_view_options) || $arg_view_options == "") ? "" : "&".$arg_view_options;
		return self::getPageUrl()."?viewAction=".ViewsController::$ACTION_PREFIX_HTML_PAGE.$arg_view_name.$opt_str;
	}
	
	static public function getViewUrl($arg_view_name, $arg_view_options = null)
	{
		$opt_str = (is_null($arg_view_options) || $arg_view_options == "") ? "" : "&".$arg_view_options;
		return self::getPageUrl()."?viewAction=".ViewsController::$ACTION_PREFIX_HTML_VIEW.$arg_view_name.$opt_str;
	}
	
	
	// ACTIONS
	static public function getActionUrl($arg_model_action, $arg_view_action, $arg_vars_str)
	{
		return self::getCustom2ActionsUrl("modelAction", $arg_model_action, "viewAction", $arg_view_action, $arg_vars_str);
	}
	
	static public function getCustomActionString($arg_controller_1, $arg_action_1)
	{
		$args_string = "";
		if ( ! is_null($arg_controller_1) && ! is_null($arg_action_1) && $arg_controller_1 != "" && $arg_action_1 != "" )
		{
			$args_string = $arg_controller_1."=".$arg_action_1;
		}
		
		return $args_string;
	}
	
	static public function getCustom2ActionsUrl($arg_controller_1, $arg_action_1, $arg_controller_2, $arg_action_2, $arg_vars_str)
	{
		// ACTION 1
		$args_string = self::getCustomActionString($arg_controller_1, $arg_action_1);
		
		// ACTION 2
		$args_string .= ($args_string == "") ? "" : "&";
		$args_string .= self::getCustomActionString($arg_controller_2, $arg_action_2);
		
		// ARGS
		if ( ! is_null($arg_vars_str) && $arg_vars_str != "" )
		{
			$args_string .= ($args_string == "") ? "" : "&";
			$args_string = $args_string.$arg_vars_str;
		}
		
		return self::getPageUrl()."?".$args_string;
	}
}
?>