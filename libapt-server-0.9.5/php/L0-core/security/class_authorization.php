<?php
/**
 * @file        class_authorization.php
 * @brief       Checks autorization of a requesting object name on a RESOURCE for an ACCESS.
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
final class Authorization
{
	// STATIC ATTRIBUTES
	static public $adapter = null;
	static public $role_adapter = null;
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// AUTHORIZATION ADAPTER
	static public function init($arg_adapter)
	{
		if ($arg_adapter instanceof AbstractAuthorization)
		{
			self::$adapter = $arg_adapter;
		}
		else
		{
			self::$adapter = null;
		}
		
		if ($arg_adapter instanceof AbstractRoleAuthorization)
		{
			self::$role_adapter = $arg_adapter;
		}
	}
	
	static public function hasRoleAdapter()
	{
		return ! is_null(self::$role_adapter);
	}
	
	static public function getRoleAdapter()
	{
		return self::$role_adapter;
	}
	
	
	// AUTHORIZATION METHODS
	static public function check($arg_resource_name, $arg_login, $arg_access)
	{
		return is_null(self::$adapter) ? false : self::$adapter->check($arg_resource_name, $arg_login, $arg_access);
	}
	
	static public function allow($arg_resource_name, $arg_login, $arg_access)
	{
		return is_null(self::$adapter) ? false : self::$adapter->allow($arg_resource_name, $arg_login, $arg_access);
	}
	
	static public function deny($arg_resource_name,  $arg_login, $arg_access)
	{
		return is_null(self::$adapter) ? false : self::$adapter->deny($arg_resource_name, $arg_login, $arg_access);
	}
	
	
	static public function checkLogged($arg_resource_name, $arg_access)
	{
		return is_null(self::$adapter) ? false : self::$adapter->checkLogged($arg_resource_name, $arg_access);
	}
	
	static public function allowLogged($arg_resource_name, $arg_access)
	{
		return is_null(self::$adapter) ? false : self::$adapter->allowLogged($arg_resource_name, $arg_access);
	}
	
	static public function denyLogged($arg_resource_name,  $arg_access)
	{
		return is_null(self::$adapter) ? false : self::$adapter->denyLogged($arg_resource_name, $arg_access);
	}
}
?>