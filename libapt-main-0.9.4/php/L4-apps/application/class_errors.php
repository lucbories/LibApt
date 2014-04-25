<?php
/**
 * @file        class_errors.php
 * @brief       PHP Error management
 * @details     ...
 * @see			Errors PHPErrorException Exception Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 */
class PHPErrorException extends Exception {}
final class Errors
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Errors array
	static private $errors = array();
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		PRIVATE CONSTRUCTOR (STATIC FINAL CLASS)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	// ----------------- ERRORS REGISTRATION -----------------
	
	/**
	 * @brief		Register a new error
	 * @param[in]	arg_source		error context or source (string)
	 * @param[in]	arg_label		error labal (string)
	 * @param[in]	arg_parameters	error parameters, default is null (array or null)
	 * @return		nothing
	 */
	static public function registerError($arg_source, $arg_label, $arg_parameters = null)
	{
		if ( is_null($arg_source) || is_null($arg_label) || $arg_source == "" || $arg_label == "")
		{
			TRACE::leaveko("Errors.registerError", "Bad args");
			return;
		}
		
		self::$errors[] = array("source" => $arg_source, "label" => $arg_label, "args" => $arg_parameters);
	}
	
	
	/**
	 * @brief		Reset errors list
	 * @return		nothing
	 */
	static public function resetErrors()
	{
		self::$errors = array();
	}
	
	
	/**
	 * @brief		Test if at least one error is registered
	 * @return		boolean
	 */
	static public function hasErrors()
	{
		return ! is_null(self::$errors) and count(self::$errors) > 0;
	}
	
	
	/**
	 * @brief		Get errors list
	 * @return		array
	 */
	static public function getErrors()
	{
		return self::$errors;
	}
	
	
	
	// ----------------- STANDARD ERRORS HELPERS -----------------
	
	/**
	 * @brief		Register a CONTRACT failure
	 * @param[in]	arg_context		error context or source (string)
	 * @return		nothing
	 */
	static public function errorContract($arg_context)
	{
		self::registerError("APPLICATION", "contract failed", array($arg_context) );
	}
	
	
	/**
	 * @brief		Register an Application failure
	 * @param[in]	arg_context		error context or source (string)
	 * @return		nothing
	 */
	static public function errorApplication($arg_context)
	{
		self::registerError("APPLICATION", "application failed", array($arg_context) );
	}
	
	
	/**
	 * @brief		Register a RESOURCES loading failure for a view
	 * @param[in]	arg_context			error context or source (string)
	 * @param[in]	arg_view_class		view class (string)
	 * @param[in]	arg_view_name		view name (string)
	 * @return		nothing
	 */
	static public function errorViewBuilding($arg_msg, $arg_view_class, $arg_view_name)
	{
		self::registerError("RESOURCE", "resource loading failed for view", array($arg_msg, $arg_view_class, $arg_view_name) );
	}
	
	
	/**
	 * @brief		Register a RESOURCES loading failure
	 * @param[in]	arg_context			error context or source (string)
	 * @param[in]	arg_resource		resource name (string)
	 * @param[in]	arg_row				error information (string)
	 * @return		nothing
	 */
	static public function errorResourceLoading($arg_msg, $arg_resource, $arg_row = "")
	{
		self::registerError("RESOURCE", "resource loading failed", array($arg_msg, $arg_resource, $arg_row) );
	}
	
	
	/**
	 * @brief		Register an Application init failure
	 * @param[in]	arg_context		error context or source (string)
	 * @return		nothing
	 */
	static public function errorApplicationInit($arg_context)
	{
		self::registerError("APPINIT", "application initilization failed", array($arg_context) );
	}
	
	
	/**
	 * @brief		Register an Dispatcher failure for a controller
	 * @param[in]	arg_controller_action	dispatched action name (string)
	 * @param[in]	arg_controller_object	controller object (object)
	 * @return		nothing
	 */
	static public function errorDispatcherRegisterController($arg_controller_action, $arg_controller_object)
	{
		self::registerError("DISPATCHER", "register controller failed", array($arg_controller_action, $arg_controller_object) );
	}
	
	
	/**
	 * @brief		Register an Authorization failure for an action dispatching
	 * @param[in]	arg_action			dispatched action name (string)
	 * @param[in]	arg_resource		resource name (string)
	 * @param[in]	arg_access			requested access name (string)
	 * @return		nothing
	 */
	static public function errorDispatcherNoAuthorization($arg_action, $arg_resource, $arg_access)
	{
		self::registerError("DISPATCHER", "no authorization", array($arg_action, $arg_resource, $arg_access) );
	}
	
	
	/**
	 * @brief		Register an Authorization failure for an action dispatching
	 * @param[in]	arg_context			error context or source (string)
	 * @param[in]	arg_resource		resource name (string)
	 * @return		nothing
	 */
	static public function errorDispatcherNoDefinedAccess($arg_action, $arg_resource)
	{
		self::registerError("DISPATCHER", "no defined access", array($arg_action, $arg_resource) );
	}
	
	
	/**
	 * @brief		Register a not logged user error
	 * @param[in]	arg_context			error context or source (string)
	 * @param[in]	arg_resource		resource name (string)
	 * @return		nothing
	 */
	static public function errorDispatcherControllerNotLogged($arg_controller, $arg_action)
	{
		self::registerError("DISPATCHER", "no logged user", array($arg_controller, $arg_action) );
	}
	
	
	/**
	 * @brief		Register a not found action error
	 * @param[in]	arg_context			error context or source (string)
	 * @param[in]	arg_resource		resource name (string)
	 * @return		nothing
	 */
	static public function errorDispatcherActionNotFound($arg_controller, $arg_action)
	{
		self::registerError("DISPATCHER", "action not found", array($arg_controller, $arg_action) );
	}
	
	
	/**
	 * @brief		Register a not found controller error
	 * @param[in]	arg_controller			action controller (object)
	 * @param[in]	arg_action				action name (string)
	 * @return		nothing
	 */
	static public function errorDispatcherControllerNotFound($arg_controller, $arg_action)
	{
		self::registerError("DISPATCHER", "controller not found", array($arg_controller, $arg_action) );
	}
	
	
	/**
	 * @brief		Register an action dispatching failure
	 * @param[in]	arg_controller			action controller (object)
	 * @param[in]	arg_action				action name (string)
	 * @param[in]	arg_operands			action operands (string or array)
	 * @return		nothing
	 */
	static public function errorDispatcherControllerActionFailed($arg_controller, $arg_action, $arg_operands)
	{
		self::registerError("DISPATCHER", "controller action failed", array($arg_controller, $arg_action, $arg_operands) );
	}
	
	
	/**
	 * @brief		Register an default page failure
	 * @param[in]	arg_action_name			action name (string)
	 * @return		nothing
	 */
	static public function errorDispatcherDisplayDefaultHtmlPageFailed($arg_action_name)
	{
		self::registerError("DISPATCHER", "display default HTML page failed", array($arg_action_name) );
	}
}
?>