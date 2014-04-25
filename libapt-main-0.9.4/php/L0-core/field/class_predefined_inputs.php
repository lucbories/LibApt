<?php
/**
 * @file        class_predefined_inputs.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class PredefinedInputs
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	protected function __construct()
	{
	}
	
	
	// SESSION INPUTS
	static public function getInput($arg_name, $arg_default = null)
	{
		// SESSION VARIABLES
		$prefix = "session.";
		$left = substr($arg_name, 0, strlen($prefix));
		if ( $left == $prefix )
		{
			$right = substr($arg_name, strlen($prefix), strlen($arg_name));
			return Application::getInstance()->getSessionProperty($right);
		}
		
		// COOKIE VARIABLES
		$prefix = "cookie.";
		$left = substr($arg_name, 0, strlen($prefix));
		if ( $left == $prefix )
		{
			$right = substr($arg_name, strlen($prefix), strlen($arg_name));
			return Application::getInstance()->getRequest()->getCookieData($right);
		}
		
		// APPLICATION VARIABLES
		$prefix = "application.";
		$left = substr($arg_name, 0, strlen($prefix));
		if ( $left == $prefix )
		{
			$right = substr($arg_name, strlen($prefix), strlen($arg_name));
			
			if ( $right == "login" )
			{
				return Authentication::getLogin();
			}
			
			if ( $right == "sessionid" )
			{
				return Application::getInstance()->getSessionId();
			}
		}
		
		return $arg_default;
	}
}
?>