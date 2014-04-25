<?php
/**
 * @file        class_authentication.php
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
final class Authentication
{
	// STATIC ATTRIBUTES
	static public  $adapter = null;
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// AUTHENTICATION ADAPTER
	static public function init($arg_adapter)
	{
		if ($arg_adapter instanceof AbstractAuthentication)
		{
			self::$adapter = $arg_adapter;
		}
		else
		{
			self::$adapter = null;
		}
	}
	
	
	// AUTHENTICATION METHODS
	static public function isEnabled()
	{
		return Application::getInstance()->hasAuthentication();
	}
	
	static public function isLogged()
	{
		return is_null(self::$adapter) ? false : self::$adapter->isLogged();
	}
	
	static public function getLogin()
	{
		return is_null(self::$adapter) ? null : self::$adapter->getLogin();
	}
	
	static public function getLoginRoles()
	{
		return is_null(self::$adapter) ? null : self::$adapter->getLoginRoles();
	}
	
	static public function hasLoginRole($arg_role)
	{
		return is_null(self::$adapter) ? false : self::$adapter->hasLoginRole($arg_role);
	}
	
	static public function login($arg_login, $arg_password)
	{
//		echo "login=$arg_login, pass=$arg_password <HR>";
		return is_null(self::$adapter) ? false : self::$adapter->login($arg_login, $arg_password);
	}
	
	static public function logout()
	{
		return is_null(self::$adapter) ? false : self::$adapter->logout();
	}
	
	static public function hashPassword($arg_password)
	{
		return is_null(self::$adapter) ? null : self::$adapter->hashPassword($arg_password);
	}
}
?>