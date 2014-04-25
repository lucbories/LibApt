<?php
/**
 * @file        class_views_controller.php
 * @brief       Controller to manage view request
 * @details     Display only a view or a plain page with header, view content and footer
 * @see			AbstractController AbstractView Response Trace
 * @ingroup     L4_APPS
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ViewsController extends AbstractController
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_VIEWS_CONTROLLER	= false;
	
	/// @brief		Action prefix given by the client to display a plain page
	static public $ACTION_PREFIX_HTML_PAGE	= "displayHtmlPage";
	
	/// @brief		Action prefix given by the client to display only a view
	static public $ACTION_PREFIX_HTML_VIEW	= "displayHtmlView";
	
	/// @brief		AUTHORIZATION KEY TO DISPLAY ACCESS (used in view loader)
	static public $DISPLAY_ACCESS			= "VIEW_DISPLAY";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	public function __construct()
	{
		// PARENT CONSTRUCTOR
		parent::__construct();
	}
	
	
	
	// ----------------- CLASS CHECK -----------------
	
	/**
	 * @brief		Check if the given object is managed by this controller
	 * @param[in]	arg_named_object		the object to manage
	 * @return		boolean					true:success, false:failure
	 */
	public function checkObject($arg_named_object)
	{
		if ( is_null($arg_named_object) )
		{
			return TRACE::leaveko("ViewsController.checkObject", "null object", false, self::$TRACE_VIEWS_CONTROLLER);
		}
		
		if ($arg_named_object instanceof AbstractView or $arg_named_object instanceof LazyObject)
		{
			return true;
		}
		
		$name = "no named object";
		if ($arg_named_object instanceof Named)
		{
			$name = $arg_named_object->getName();
		}
		
		return TRACE::leaveko("ViewsController.checkObject", "bad class for [$name]", false, self::$TRACE_VIEWS_CONTROLLER);
	}
	
	
	
	// ----------------- EXECUTE CONTROLLER ACTION -----------------
	
	/**
	 * @brief		Execute an action with the given operands
	 * @param[in]	arg_action_name		the action name to execute
	 * @param[in]	arg_url_parameters	the arguments to use for the action
	 * @return		boolean					true:success, false:failure
	 */
	protected function doActionSelf($arg_action_name, $arg_url_parameters)
	{
		$context = "ViewsController.doActionSelf";
		TRACE::enter($context, "", self::$TRACE_VIEWS_CONTROLLER);
		
		// TRACE ARGS
		TRACE::trace_var($context, "action", $arg_action_name, self::$TRACE_VIEWS_CONTROLLER);
		TRACE::trace_var($context, "parameters", $arg_url_parameters, self::$TRACE_VIEWS_CONTROLLER);
		
		
		// SEARCH THE REQUESTED VIEW
		$view = $this->getActionObject($arg_action_name);
		if ( is_null($view) )
		{
			// DISPLAY THE DEFAULT HOME VIEW
			$arg_action_name = self::$ACTION_PREFIX_HTML_PAGE.Application::getInstance()->getHomeView();
			$view = $this->getActionObject($arg_action_name);
			CONTRACT::assertTrue($context.".view for action[$arg_action_name]", $view);
		}
		
		// GET RESPONSE
		$response = Application::getInstance()->getResponse();
		
		
		// DISPLAY VIEW ONLY
		$target_prefix = self::$ACTION_PREFIX_HTML_VIEW;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, $target_prefix, self::$TRACE_VIEWS_CONTROLLER);
			
			// GENERATE HTML VIEW
			$response->generateHtmlView($view);
			
			return TRACE::leaveok($context, "response a view", true, self::$TRACE_VIEWS_CONTROLLER);
		}
		
		
		// DISPLAY FULL PAGE
		$target_prefix = self::$ACTION_PREFIX_HTML_PAGE;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, $target_prefix, self::$TRACE_VIEWS_CONTROLLER);
			
			// GENERATE HTML PAGE
			$response->generateHtmlPage($view);
			
			return TRACE::leaveok($context, "response a page", true, self::$TRACE_VIEWS_CONTROLLER);
		}
		
		return TRACE::leaveko("$context", "prefixe de l'action inconnu =[$action_prefix]", false, self::$TRACE_VIEWS_CONTROLLER);
	}
	
	
	/**
	 * @brief		Redirect the client to the given view
	 * @param[in]	arg_action_view_name	the view name fro the redirection
	 * @return		nothing
	 */
	public function htmlRedirect($arg_action_view_name)
	{
		$redirect_code = '
			<script language="javascript" type="text/javascript">
			<!--
			window.location.replace("'.Urls::getPageUrl().'?viewAction='.$arg_action_view_name.'");
			-->
			</script>';
		
		echo($redirect_code);
	}
}
?>