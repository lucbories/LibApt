<?php
/**
 * @file        class_map_role_authorization.php
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
final class MapRoleAuthorization extends AbstractRoleAuthorization
{
	// ATTRIBUTES
	static private $MODEL_ACTION          = "modelAction";
	static private $ROLES_KEY_FIELD_NAME  = "resource_access";
	static private $ROLES_ROLE_FIELD_NAME = "role";
	static public $TRACE_MAP_ROLE_AUTH = false;
	
	private $roles_accesses_map = array();
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	// REGISTER ROLE ACCESSES
	protected function getResourceAccessKey($arg_resource_name, $arg_access)
	{
		return $arg_resource_name."/".$arg_access;
	}
	
	public function registerRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		if ( is_null($arg_resource_name) or is_null($arg_access) or is_null($arg_role) )
		{
			return TRACE::leaveko("Authorization.registerRoleAccess", "resource[$arg_resource_name] or access[$arg_access] or role[$arg_role]", false, self::$TRACE_MAP_ROLE_AUTH);
		}
		
		$key = $this->getResourceAccessKey($arg_resource_name, $arg_access);
		$this->roles_accesses_map[$key] = $arg_role;
		
		return true;
	}
	
	public function unregisterRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		if ( is_null($arg_resource_name) or is_null($arg_access) or is_null($arg_role) )
		{
			return false;
		}
		$key = $this->getResourceAccessKey($arg_resource_name, $arg_access);
		unset($this->roles_accesses_map[$key]);
		
		return true;
	}
	
	public function getRegisteredRoleAccess($arg_resource_name, $arg_access)
	{
		if ( is_null($arg_resource_name) or is_null($arg_access) )
		{
			return TRACE::leaveko("Authorization.getRegisteredRoleAccess", "resource[$arg_resource_name] or access[$arg_access]", null, self::$TRACE_MAP_ROLE_AUTH);
		}
		$key = $this->getResourceAccessKey($arg_resource_name, $arg_access);
		if ( array_key_exists($key, $this->roles_accesses_map) )
		{
			return $this->roles_accesses_map[$key];
		}
		
		return TRACE::leaveko("Authorization.getRegisteredRoleAccess", "resource access not found ($arg_resource_name, $arg_access)", null, self::$TRACE_MAP_ROLE_AUTH);
	}
	
	
	// AUTHORIZATION FOR THE GIVEN REQUESTING OBJECT NAME
	public function check($arg_resource_name, $arg_requesting, $arg_access)
	{
		$role = self::getRegisteredRoleAccess($arg_resource_name, arg_access);
		$roles = Authentication::getRolesForLogin($arg_requesting);
		if (is_null($role) or is_null($roles) )
		{
			return TRACE::leaveko("Authorization.check", "role is null or roles is null", false, self::$TRACE_MAP_ROLE_AUTH);
		}
		return array_key_exists($role, $roles);
	}
	
	public function allow($arg_resource_name, $arg_requesting, $arg_access)
	{
		return false;
	}
	
	public function deny($arg_resource_name, $arg_requesting, $arg_access)
	{
		return false;
	}
	
	
	// AUTHORIZATION FOR THE LOGGED USER
	public function checkLogged($arg_resource_name, $arg_access)
	{
		$context = get_class($this)."checkLogged($arg_resource_name, $arg_access)";
		
		$role = self::getRegisteredRoleAccess($arg_resource_name, $arg_access);
		$roles = Authentication::getLoginRoles();
		if ( is_null($role) )
		{
			TRACE::addAlertMsg("MapRoleAuthorization.checkLogged", "role is null ($arg_resource_name, $arg_access)", self::$TRACE_MAP_ROLE_AUTH);
			return false;
		}
		if ( is_null($roles) )
		{
			TRACE::addAlertMsg("MapRoleAuthorization.checkLogged", "login roles array is null ($arg_resource_name, $arg_access)", self::$TRACE_MAP_ROLE_AUTH);
			return false;
		}
		if ( ! is_array($roles) )
		{
			TRACE::addAlertMsg("MapRoleAuthorization.checkLogged", "login roles is not an array ($arg_resource_name, $arg_access, $roles)", self::$TRACE_MAP_ROLE_AUTH);
			return false;
		}
		TRACE::trace_var($context, "role", $role, self::$TRACE_MAP_ROLE_AUTH);
		TRACE::trace_var($context, "roles", $roles, self::$TRACE_MAP_ROLE_AUTH);
		$result = array_key_exists($role, $roles);
		if (! array_key_exists($role, $roles))
		{
			TRACE::addAlertMsg("MapRoleAuthorization.checkLogged", "no authorization for ($arg_resource_name, $arg_access, $role)", self::$TRACE_MAP_ROLE_AUTH);
		}
		else
		{
			TRACE::addAlertMsg("MapRoleAuthorization.checkLogged", "valid authorization for ($arg_resource_name, $arg_access, $role)", self::$TRACE_MAP_ROLE_AUTH);
		}
		return $result;
	}
	
	public function allowLogged($arg_resource_name, $arg_access)
	{
		return false;
	}
	
	public function denyLogged($arg_resource_name, $arg_access)
	{
		return false;
	}
	
}
?>
