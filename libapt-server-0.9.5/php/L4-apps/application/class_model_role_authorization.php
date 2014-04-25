<?php
/**
 * @file        class_model_role_authorization.php
 * @brief       Role based authorization adapter using a model
 * @details     ...
 * @see			AbstractRoleAuthorization Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class ModelRoleAuthorization extends AbstractRoleAuthorization
{
	// ATTRIBUTES
	static private $MODEL_ACTION          = "modelAction";
	static private $ROLES_KEY_FIELD_NAME  = "resource_access";
	static private $ROLES_ROLE_FIELD_NAME = "role";
	
	private $roles_model_name   = null;
	private $roles_model_object = null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_registered_roles_accesses_model_name)
	{
		$this->init($arg_registered_roles_accesses_model_name);
	}
	
	
	// AUTHORIZATION MODEL INIT
	protected function init($arg_registered_roles_accesses_model_name)
	{
//		$context = "ModelAuthentication.init($arg_registered_roles_accesses_model_name)";
//		echo "$context";
		
		$this->roles_model_name = $arg_registered_roles_accesses_model_name;
	}
	
	protected function getRolesModel()
	{
		if ( is_null($this->roles_model_name) )
		{
			return null;
		}
		
		if ( is_null($this->roles_model_object) )
		{
			$model_controller = Controllers::getController(self::$MODEL_ACTION);
			if ( is_null($model_controller) )
			{
				return null;
			}
			$this->roles_model_object = $model_controller->getObject($this->roles_model_name);
		}
		
		return $this->roles_model_object;
	}
	
	
	// REGISTER ROLE ACCESSES
	protected function getResourceAccessKey($arg_resource_name, $arg_access)
	{
		return $arg_resource_name."/".$arg_access;
	}
	
	public function registerRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		$role_model = $this->getRolesModel();
		
		if ( is_null($arg_resource_name) or is_null($arg_access) or is_null($arg_role) or is_null($role_model) )
		{
			$role_mode_is_null = is_null($role_model) ? "NULL" : "NOT NULL";
			return TRACE::leaveko("Authorization.registerRoleAccess", "resource[$arg_resource_name] or access[$arg_access] or role[$arg_role] or role_model[$role_mode_is_null]", false);
		}
		
		$key = $this->getResourceAccessKey($arg_resource_name, $arg_access);
		
		$result = $role_model->createItem( array(self::$ROLES_KEY_FIELD_NAME => $key, self::$ROLES_ROLE_FIELD_NAME => $arg_role) );
		if ( ! $result)
		{
			return TRACE::leaveko("Authorization.registerRoleAccess", "model.create_item failed for key[$key] role[$arg_role]", false);
		}
		
		return true;
	}
	
	public function unregisterRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		$role_model = $this->getRolesModel();
		if ( is_null($arg_resource_name) or is_null($arg_access) or is_null($arg_role) or is_null($role_model) )
		{
			return false;
		}
		$key = $this->getResourceAccessKey($arg_resource_name, $arg_access);
		return $role_model->deleteItem( array($key, $arg_role) );
	}
	
	public function getRegisteredRoleAccess($arg_resource_name, $arg_access)
	{
		$role_model = $this->getRolesModel();
		if ( is_null($arg_resource_name) or is_null($arg_access) or is_null($role_model) )
		{
			$role_mode_is_null = is_null($role_model) ? "NULL" : "NOT NULL";
			return TRACE::leaveko("Authorization.getRegisteredRoleAccess", "resource[$arg_resource_name] or access[$arg_access] or role[$arg_role] or role_model[$role_mode_is_null]", null);
		}
		$key = $this->getResourceAccessKey($arg_resource_name, $arg_access);
		$record = $role_model->fetchRecordWithField(self::$ROLES_KEY_FIELD_NAME, $key);
		if ( is_null($record) )
		{
			return TRACE::leaveko("Authorization.getRegisteredRoleAccess", "fetched record is null($arg_resource_name, $arg_access)", null);
		}
		return $record[self::$ROLES_ROLE_FIELD_NAME];
	}
	
	
	// AUTHORIZATION FOR THE GIVEN REQUESTING OBJECT NAME
	public function check($arg_resource_name, $arg_requesting, $arg_access)
	{
		$role = self::getRegisteredRoleAccess($arg_resource_name, arg_access);
		$roles = Authentication::getRolesForLogin($arg_requesting);
		if (is_null($role) or is_null($roles) )
		{
			return TRACE::leaveko("Authorization.check", "role is null or roles is null", false);
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
		$role = self::getRegisteredRoleAccess($arg_resource_name, $arg_access);
		$roles = Authentication::getLoginRoles();
		if ( is_null($role) )
		{
			TRACE::addAlertMsg("ModelRoleAuthorization.checkLogged", "role is null ($arg_resource_name, $arg_access)");
			return false;
		}
		if ( is_null($roles) )
		{
			TRACE::addAlertMsg("ModelRoleAuthorization.checkLogged", "login roles array is null ($arg_resource_name, $arg_access)");
			return false;
		}
		
		$result = in_array($role, $roles);
		if ($result == false)
		{
			TRACE::addAlertMsg("ModelRoleAuthorization.checkLogged", "no authorization for ($arg_resource_name, $arg_access, $role)");
		}
		else
		{
			TRACE::addAlertMsg("ModelRoleAuthorization.checkLogged", "valid authorization for ($arg_resource_name, $arg_access, $role)");
		}
//		var_dump($roles);
//		echo "<HR>";
//		TRACE::debug_var("ModelRoleAuthorization.checkLogged.result($arg_resource_name, $arg_access, $role)", in_array($role, $roles) == true ? "1" : "0");
//		echo "ModelRoleAuthorization.checkLogged.result($arg_resource_name, $arg_access, $role)" . (in_array($role, $roles) == true ? "1" : "0")."<HR>";
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
