<?php
/**
 * @file        class_resources_controller.php
 * @brief       Controller to get/set resources from the client side
 * @details     
 * @see			AbstractController Response Trace
 * @ingroup     L4_APPS
 * @date        2013-06-02
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ResourcesController extends AbstractController
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_RESOURCES_CONTROLLER	= false;
	
	
	/// @brief		Action prefix given by the client to get a model from the server side
	static public $ACTION_GET_MODEL				= "getModel";
	
	/// @brief		Action prefix given by the client to set a model on the server side
	static public $ACTION_SET_MODEL				= "setModel";
	
	/// @brief		Action prefix given by the client to get a view from the server side
	static public $ACTION_GET_VIEW				= "getView";
	
	/// @brief		Action prefix given by the client to set a view on the server side
	static public $ACTION_SET_VIEW				= "setView";
	
	/// @brief		Action prefix given by the client to get a menubar from the server side
	static public $ACTION_GET_MENUBAR			= "getMenubar";
	
	/// @brief		Action prefix given by the client to set a menubar on the server side
	static public $ACTION_SET_MENUBAR			= "setMenubar";
	
	
	
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
		return TRACE::leaveko("ResourcesController.checkObject", "not implemented class for [$name]", false, self::$TRACE_RESOURCES_CONTROLLER);
	}
	
	
	protected function checkAuthorization($arg_action_name)
	{
		$context = "ResourcesController.checkObject($arg_action_name)";
		return TRACE::leaveok($context, "no specific authorization to get resources", true, self::$TRACE_RESOURCES_CONTROLLER);
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
		$context = "ResourcesController.doActionSelf";
		TRACE::enter($context, "", self::$TRACE_RESOURCES_CONTROLLER);
		
		// TRACE ARGS
		TRACE::trace_var($context, "action", $arg_action_name, self::$TRACE_RESOURCES_CONTROLLER);
		TRACE::trace_var($context, "parameters", $arg_url_parameters, self::$TRACE_RESOURCES_CONTROLLER);
		
		
		// GET A MODEL RESOURCE DECLARATION
		$target_prefix = self::$ACTION_GET_MODEL;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			$this->replyJsonResourceDeclaration($target_prefix, $arg_action_name, "modelAction");
			return TRACE::leaveok($context, "response a resource declaration", true, self::$TRACE_RESOURCES_CONTROLLER);
		}
		
		// GET A VIEW RESOURCE DECLARATION
		$target_prefix = self::$ACTION_GET_VIEW;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			$this->replyJsonResourceDeclaration($target_prefix, $arg_action_name, "viewAction");
			return TRACE::leaveok($context, "response a resource declaration", true, self::$TRACE_RESOURCES_CONTROLLER);
		}
		
		// GET A MENUBAR RESOURCE DECLARATION
		$target_prefix = self::$ACTION_GET_MENUBAR;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			$this->replyJsonResourceDeclaration($target_prefix, $arg_action_name, "menuAction");
			return TRACE::leaveok($context, "response a resource declaration", true, self::$TRACE_RESOURCES_CONTROLLER);
		}
		
		
		return TRACE::leaveko("$context", "prefixe de l'action inconnu =[$action_prefix]", false, self::$TRACE_RESOURCES_CONTROLLER);
	}
	
	
	/**
	 * @brief		Reply the resource declaration in a json string
	 * @param[in]	arg_action_prefix		prefix of the requested action
	 * @param[in]	arg_action_name			name of the request action
	 * @param[in]	arg_controller_action	name of the action in which is registered the controller
	 * @return		boolean					true:success, false:failure
	 */
	protected function replyJsonResourceDeclaration($arg_action_prefix, $arg_action_name, $arg_controller_action)
	{
		$context = "ResourcesController.replyJsonResourceDeclaration($arg_action_prefix, $arg_action_name, $arg_controller_action)";
		TRACE::step($context, $arg_action_prefix, self::$TRACE_RESOURCES_CONTROLLER);
		
		$controller = Controllers::getController($arg_controller_action);
		CONTRACT::assertNotNull($context.".controller for [$arg_action_prefix]", $controller);
		
		$resource_name = substr($arg_action_name, strlen($arg_action_prefix) );
		TRACE::trace_var($context, "resource_name", $resource_name, self::$TRACE_RESOURCES_CONTROLLER);
		
		$resource = $controller->getObject($resource_name);
		CONTRACT::assertNotNull($context.".resource for [$arg_action_prefix]", $resource);
		TRACE::trace_var($context, "resource", $resource, self::$TRACE_RESOURCES_CONTROLLER);
		
		// $resource_declaration_array = ($resource instanceof LazyObject) ? $resource->getOptionsRecord() : $resource->getRuntimeOptions();
		// TRACE::trace_var($context, "resource_declaration_array", $resource_declaration_array, self::$TRACE_RESOURCES_CONTROLLER);
		
		$resource_declaration_array = JSWRAPPER::getResourceDeclarationsArray($resource);
		TRACE::trace_var($context, "resource_declaration_array", $resource_declaration_array, self::$TRACE_RESOURCES_CONTROLLER);
		
		$resource_declaration_json = JSWRAPPER::arrayToJson($resource_declaration_array);
		CONTRACT::assertString($context.".resource_declaration_json", $resource_declaration_json);
		
		CONTRACT::assertString($context.".resource_declaration_json", $resource_declaration_json);	
		echo $resource_declaration_json;
		
		return TRACE::leaveok($context, "response a resource declaration", true, self::$TRACE_RESOURCES_CONTROLLER);
	}
}
?>