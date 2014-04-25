<?php
/**
 * @file        class_controllers.php
 * @brief       Controllers repository and actions dispatcher
 * @details     Register views/models/json/... controllers and dispatch request actions
 * @see			AbstractApplication Controllers FileSessionEngine ArraySessionEngine Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 */
final class Controllers
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace || not (boolean)
	static public $TRACE_CONTROLLERS		= false;
	
	
	/// @brief		Controllers repository
	static private $controllers				= null;
	
	/// @brief		Json controllers repository
	static private $json_controllers		= null;
	
	/// @brief		Models controllers repository
	static private $models_controllers		= null;
	
	/// @brief		Views controllers repository
	static private $views_controllers		= null;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	/**
	 * @brief		Init controllers class
	 * @return		nothing
	 */
	static public function init()
	{
		self::$controllers			= array();
		self::$json_controllers		= array();
		self::$models_controllers	= array();
		self::$views_controllers	= array();
	}
	
	
	
	// ----------------- CONTROLLERS REGISTRATION -----------------
	/**
	 * @brief		Register a controller
	 * @param[in]	arg_controller_action		controller action
	 * @param[in]	arg_controller_object		controller object
	 * @return		boolean		true:success, false:failure
	 */
	static public function registerController($arg_controller_action, $arg_controller_object)
	{
		$context = "Controllers.registerController";
		
		if ( is_null($arg_controller_action) || is_null($arg_controller_object) || $arg_controller_action == "" || ! $arg_controller_object instanceof AbstractController)
		{
			Errors::errorDispatcherRegisterController($arg_controller_action, $arg_controller_object);
			return TRACE::leaveko($context, "Bad args", false, self::$TRACE_CONTROLLERS);
		}
		
		TRACE::trace_var($context, "arg_controller_action", $arg_controller_action, self::$TRACE_CONTROLLERS);
		self::$controllers[$arg_controller_action] = $arg_controller_object;
		TRACE::trace_var($context, "hasController", Controllers::hasController($arg_controller_action), self::$TRACE_CONTROLLERS);
		
		return true;
	}
	
	
	/**
	 * @brief		Register a json controller
	 * @param[in]	arg_controller_action		controller action
	 * @param[in]	arg_controller_object		controller object
	 * @return		boolean		true:success, false:failure
	 */
	static public function registerJsonController($arg_controller_action, $arg_controller_object)
	{
		$context = "Controllers.registerJsonController";
		
		if ( ! self::registerController($arg_controller_action, $arg_controller_object) )
		{
			return TRACE::leaveko($context, "", false, self::$TRACE_CONTROLLERS);
		}
		
		self::$json_controllers[$arg_controller_action] = $arg_controller_object;
		
		return TRACE::leaveok($context, "", true, self::$TRACE_CONTROLLERS);
	}
	
	
	/**
	 * @brief		Register a model controller
	 * @param[in]	arg_controller_action		controller action
	 * @param[in]	arg_controller_object		controller object
	 * @return		boolean		true:success, false:failure
	 */
	static public function registerModelController($arg_controller_action, $arg_controller_object)
	{
		$context = "Controllers.registerModelController";
		
		if ( ! self::registerController($arg_controller_action, $arg_controller_object) )
		{
			return TRACE::leaveko($context, "", false, self::$TRACE_CONTROLLERS);
		}
		
		self::$models_controllers[$arg_controller_action] = $arg_controller_object;
		
		return TRACE::leaveok($context, "", true, self::$TRACE_CONTROLLERS);
	}
	
	
	/**
	 * @brief		Register a view controller
	 * @param[in]	arg_controller_action		controller action
	 * @param[in]	arg_controller_object		controller object
	 * @return		boolean		true:success, false:failure
	 */
	static public function registerViewController($arg_controller_action, $arg_controller_object)
	{
		$context = "Controllers.registerViewController";
		
		if ( ! self::registerController($arg_controller_action, $arg_controller_object) )
		{
			return TRACE::leaveko($context, "", false, self::$TRACE_CONTROLLERS);
		}
		
		self::$views_controllers[$arg_controller_action] = $arg_controller_object;
		
		return TRACE::leaveok($context, "", true, self::$TRACE_CONTROLLERS);
	}
	
	
	/**
	 * @brief		Unregister a controller
	 * @param[in]	arg_controller_action		controller action
	 * @return		boolean		true:success, false:failure
	 */
	static public function unregisterController($arg_controller_action)
	{
		unset(self::$controllers[$arg_controller_action]);
	}
	
	
	/**
	 * @brief		Test if a controller is registered for the given action  name
	 * @param[in]	arg_controller_action		controller action
	 * @return		boolean		true:success, false:failure
	 */
	static public function hasController($arg_controller_action)
	{
		return array_key_exists($arg_controller_action, self::$controllers);
	}
	
	
	/**
	 * @brief		Get the registered controller for the given action  name
	 * @param[in]	arg_controller_action		controller action
	 * @return		object		controller object || null if not found
	 */
	static public function getController($arg_controller_action)
	{
		if ( array_key_exists($arg_controller_action, self::$controllers) )
		{
			return self::$controllers[$arg_controller_action];
		}
		return null;
	}
	
	
	/**
	 * @brief		Get all registered Json controllers
	 * @return		array of object		array of controller objects
	 */
	static public function getJsonControllers()
	{
		return self::$json_controllers;
	}
	
	
	/**
	 * @brief		Get all registered Model controllers
	 * @return		array of object		array of controller objects
	 */
	static public function getModelsControllers()
	{
		return self::$models_controllers;
	}
	
	
	/**
	 * @brief		Get all registered Views controllers
	 * @return		array of object		array of controller objects
	 */
	static public function getViewsControllers()
	{
		return self::$views_controllers;
	}
	
	
	
	// ----------------- ACTIONS DISPATCHING -----------------
	
	/**
	 * @brief		Dispatch all request actions
	 * @param[in]	arg_request_parameters		request parameters array
	 * @return		boolean		true:success, false:failure
	 */
	static public function dispatchUrl($arg_request_parameters)
	{
		$context = "Controllers.dispatchUrl";
		TRACE::enter($context, "", self::$TRACE_CONTROLLERS);
		TRACE::trace_var($context, ".arg_request_parameters", $arg_request_parameters, self::$TRACE_CONTROLLERS);
		
		// CHECK ARGS
		if ( is_null($arg_request_parameters) || count($arg_request_parameters) == 0 )
		{
			TRACE::step($context, "arg_request_parameters is null || empty", self::$TRACE_CONTROLLERS);
			self::displayDefaultHtmlPage();
			return TRACE::leaveok($context, "nothing to dispatch", true, self::$TRACE_CONTROLLERS);
		}
		
		// GET REQUEST
		$request = Application::getInstance()->getRequest();
		
		// SPLIT ARGS IN ACTIONS AND OPERANDS
		$operands = array();
		$actions  = array();
		foreach($arg_request_parameters as $validate_key)
		{
			TRACE::step($context, "dispatching loop item[$validate_key]", self::$TRACE_CONTROLLERS);
			
			$validate_value = $request->getParameter($validate_key);
			TRACE::trace_var($context, ".dispatchUrl.validate_key", $validate_key, self::$TRACE_CONTROLLERS);
			TRACE::trace_var($context, ".dispatchUrl.validate_value", $validate_value, self::$TRACE_CONTROLLERS);
			
			if ( ! is_null($validate_key) && ! is_null($validate_value) )
			{
				TRACE::step($context, "parameter is valid", self::$TRACE_CONTROLLERS);
				
				if ( self::hasController($validate_key) )
				{
					TRACE::step($context, "a controller is found for the parameter", self::$TRACE_CONTROLLERS);
					TRACE::trace_var($context, ".dispatchUrl.action_key", $validate_key, self::$TRACE_CONTROLLERS);
					$actions[$validate_key] = $validate_value;
				}
				else
				{
					TRACE::step($context, "a controller is not found for the parameter", self::$TRACE_CONTROLLERS);
					TRACE::trace_var($context, ".dispatchUrl.operand key/value", $validate_key."/".$validate_value, self::$TRACE_CONTROLLERS);
					$operands[$validate_key] = $validate_value;
				}
			}
			else
			{
				TRACE::step($context, "parameter is not valid", self::$TRACE_CONTROLLERS);
			}
		}
		
		// DISPATCH ALL ACTIONS
		foreach($actions as $key=>$value)
		{
			TRACE::trace_var($context, ".dispatchUrl.action key/value", $key."/".$value, self::$TRACE_CONTROLLERS);
			if ( ! (is_null($key) || is_null($value) || $key == "" || $value == "") )
			{
				TRACE::step($context, "action is valid", self::$TRACE_CONTROLLERS);
				TRACE::trace_var($context, ".dispatchUrl.action opds", $operands, self::$TRACE_CONTROLLERS);
				if ( ! self::dispatchAction($key, $value, $operands) )
				{
					Errors::errorDispatcherControllerActionFailed($key, $value, $operands);
					return TRACE::leaveko($context.".dispatchUrl", "Dispatch action error", false, self::$TRACE_CONTROLLERS);
				}
			}
			else
			{
				TRACE::step($context, "action is not valid", self::$TRACE_CONTROLLERS);
			}
		}
		
		if (count($actions) == 0)
		{
			TRACE::step($context, "no action was processed, default page", self::$TRACE_CONTROLLERS);
			self::displayDefaultHtmlPage();
		}
		
		return TRACE::leaveok($context, "success", true, self::$TRACE_CONTROLLERS);
	}
	
	
	
	/**
	 * @brief		Dispatch an action
	 * @param[in]	arg_controller_action		controller for the action name
	 * @param[in]	arg_action_name				action name
	 * @param[in]	arg_operands				action operands
	 * @return		boolean		true:success, false:failure
	 */
	static public function dispatchAction($arg_controller_action, $arg_action_name, $arg_operands)
	{
		$context = "Controllers.dispatchAction";
		TRACE::enter($context, "", self::$TRACE_CONTROLLERS);
		
		TRACE::trace_var($context, "arg_controller_action",	$arg_controller_action, self::$TRACE_CONTROLLERS);
		TRACE::trace_var($context, "action",				$arg_action_name, self::$TRACE_CONTROLLERS);
		TRACE::trace_var($context, "opds",					$arg_operands, self::$TRACE_CONTROLLERS);
		
		// CHECK IF A CONTROLLER EXISTS
		if ( ! self::hasController($arg_controller_action) )
		{
			return TRACE::leaveko($context, "Controller not found for [$arg_controller_action]", false, self::$TRACE_CONTROLLERS);
		}
		
		// GET THE CONTROLLER
		$controller = self::getController($arg_controller_action);
		if ( is_null($controller) )
		{
			return TRACE::leaveko($context, "Controller is null for [$arg_controller_action]", false, self::$TRACE_CONTROLLERS);
		}
		
		// DO THE ACTION
		$result = $controller->doAction($arg_action_name, $arg_operands);
		TRACE::trace_var($context, "action", $arg_action_name, self::$TRACE_CONTROLLERS);
		TRACE::trace_var($context, "result", $result, self::$TRACE_CONTROLLERS);
		
		if (! $result)
		{
			return TRACE::leaveko($context, "failure", false, self::$TRACE_CONTROLLERS);
		}
		
		return TRACE::leaveok($context, "success", true, self::$TRACE_CONTROLLERS);
	}
	
	
	
	/**
	 * @brief		Display the default page
	 * @return		boolean		true:success, false:failure
	 */
	static protected function displayDefaultHtmlPage()
	{
		$context = "Controllers.displayDefaultHtmlPage";
		TRACE::enter($context, "", self::$TRACE_CONTROLLERS);
		
		// GET VIEWS CONTROLLER
		$views_controller = self::getController("viewAction");
		
		// GET THE ACTION NAME TO DISPLAY THE DEFAULT PAGE
		$arg_action_name = ViewsController::$ACTION_PREFIX_HTML_PAGE.Application::getInstance()->getHomeView();
		
		// GET THE VIEW OF THE ACTION
		$view = $views_controller->getActionObject($arg_action_name);
		if ( is_null($view) )
		{
			Errors::errorDispatcherDisplayDefaultHtmlPageFailed($arg_action_name);
			return TRACE::leaveko($context, "failure, view not found for action[$arg_action_name]", false, self::$TRACE_CONTROLLERS);
		}
		
		// DISPLAY THE DEFAULT HOME VIEW
		return $views_controller->doAction($arg_action_name, null);
	}
}
?>