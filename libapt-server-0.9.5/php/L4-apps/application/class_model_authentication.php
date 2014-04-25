<?php
/**
 * @file        class_model_authentication.php
 * @brief       Authentication adapter based on a model
 * @details     ...
 * @see			AbstractAuthentication Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class ModelAuthentication extends AbstractAuthentication
{
	// STATIC ATTRIBUTES
	static public $TRACE_MODEL_AUTH = true;
	
	static public  $SESSION_LOGIN_KEY   = "LIBAPT_LOGIN";
	static public  $SESSION_ROLES_KEY   = "LIBAPT_ROLES";
	
	static private $LOGIN_FIELD_NAME    = "login";
	static private $PASSWORD_FIELD_NAME = "password";
	static private $ROLE_FIELD_NAME     = "role";
	static private $ROLE_MAX_VALUES     = 100;
	static private $MODEL_ACTION        = "modelAction";
	
	private $users_model_name   = null;
	private $users_model_object = null;
	
	private $roles_model_name   = null;
	private $roles_model_object = null;
	
	private $profiles_roles_model_name   = null;
	private $profiles_roles_model_object = null;
	
	private $login = null;
	private $login_roles = null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_users_model_name, $arg_roles_model_name, $arg_profile_roles_model_name)
	{
//		$context = "ModelAuthentication._construct($arg_users_model_name, $arg_roles_model_name)";
//		echo "$context";
		$this->init($arg_users_model_name, $arg_roles_model_name, $arg_profile_roles_model_name);
	}
	
	
	// AUTHENTICATION MODEL INIT
	protected function init($arg_users_model_name, $arg_roles_model_name, $arg_profile_roles_model_name)
	{
//		$context = "ModelAuthentication.init($arg_users_model_name, $arg_roles_model_name)";
//		echo "$context";
		
		$this->users_model_name				= $arg_users_model_name;
		$this->roles_model_name				= $arg_roles_model_name;
		$this->profiles_roles_model_name	= $arg_profile_roles_model_name;
		
		if ( Application::getInstance()->hasSessionProperty(self::$SESSION_LOGIN_KEY) )
		{
			$this->login = Application::getInstance()->getSessionProperty(self::$SESSION_LOGIN_KEY);
		}
		
		if ( Application::getInstance()->hasSessionProperty(self::$SESSION_ROLES_KEY) )
		{
			$this->login_roles = Application::getInstance()->getSessionProperty(self::$SESSION_ROLES_KEY);
		}
	}
	
	protected function getUsersModel()
	{
		$context = "ModelAuthentication.getUsersModel";
		
		// CHECK MODEL NAME
		if ( is_null($this->users_model_name) )
		{
			return TRACE::leaveko($context, "user model name is null", null, self::$TRACE_MODEL_AUTH);
		}
		
		// CHECK MODEL OBJECT
		if ( is_null($this->users_model_object) )
		{
			// GET MODELS CONTROLLER
			$model_controller = Controllers::getController(self::$MODEL_ACTION);
			if ( is_null($model_controller) )
			{
				return TRACE::leaveko($context, "model controller is null", null, self::$TRACE_MODEL_AUTH);
			}
			
			// GET MODEL OBJECT
			$this->users_model_object = $model_controller->getObject($this->users_model_name);
			if ( is_null($this->users_model_object) )
			{
				return TRACE::leaveko($context, "users model is null [$this->users_model_name]", null, self::$TRACE_MODEL_AUTH);
			}
		}
		
		return $this->users_model_object;
	}
	
	protected function getRolesModel()
	{
		$context = "ModelAuthentication.getRolesModel";
		
		// CHECK MODEL NAME
		if ( is_null($this->roles_model_name) or $this->roles_model_name == ""  )
		{
			return TRACE::leaveko($context, "role model name is null", null, self::$TRACE_MODEL_AUTH);
		}
		
		// CHECK MODEL OBJECT
		if ( is_null($this->roles_model_object) )
		{
			// GET MODELS CONTROLLER
			$model_controller = Controllers::getController(self::$MODEL_ACTION);
			if ( is_null($model_controller) )
			{
				return TRACE::leaveko($context, "model controller is null", null, self::$TRACE_MODEL_AUTH);
			}
			
			// GET MODEL OBJECT
			$this->roles_model_object = $model_controller->getObject($this->roles_model_name);
			if ( is_null($this->roles_model_object) )
			{
				return TRACE::leaveko($context, "roles model is null [$this->roles_model_name]", null, self::$TRACE_MODEL_AUTH);
			}
		}
		
		return $this->roles_model_object;
	}
	
	protected function getProfilesRolesModel()
	{
		$context = "ModelAuthentication.getProfilesRolesModel";
		
		// CHECK MODEL NAME
		if ( is_null($this->profiles_roles_model_name) or $this->profiles_roles_model_name == "" )
		{
			return TRACE::leaveko($context, "profiles roles model name is null", null, self::$TRACE_MODEL_AUTH);
		}
		
		// CHECK MODEL OBJECT
		if ( is_null($this->profiles_roles_model_object) )
		{
			// GET MODELS CONTROLLER
			$model_controller = Controllers::getController(self::$MODEL_ACTION);
			if ( is_null($model_controller) )
			{
				return TRACE::leaveko($context, "model controller is null", null, self::$TRACE_MODEL_AUTH);
			}
			
			// GET MODEL OBJECT
			$this->profiles_roles_model_object = $model_controller->getObject($this->profiles_roles_model_name);
			if ( is_null($this->profiles_roles_model_object) )
			{
				return TRACE::leaveko($context, "roles model is null [$this->profiles_roles_model_name]", null, self::$TRACE_MODEL_AUTH);
			}
		}
		
		return $this->profiles_roles_model_object;
	}
	
	
	// AUTHENTICATION METHODS
	public function isLogged()
	{
		return ! is_null($this->login);
	}
	
	public function getLogin()
	{
		return $this->login;
	}
	
	public function getLoginRoles()
	{
		$context = "ModelAuthentication.getLoginRoles()";
		
		if ( is_null($this->login) )
		{
			TRACE::addErrorMsg("$context", "login is null");
			return null;
		}
		
		if ( is_null($this->login_roles) )
		{
			$this->updateLoginRoles();
		}
		
		return $this->login_roles;
	}
	
	protected function updateUsersRoles()
	{
		$context = "ModelAuthentication.updateUsersRoles()";
		
		// GET THE USERS/ROLES MODEL
		$model  = self::getRolesModel();
		if ( is_null($model) )
		{
			TRACE::addErrorMsg($context, "model is null", self::$TRACE_MODEL_AUTH);
			return;
		}
		
		// GET THE LOGGED USER ROLES
		$orders  = array( new Order("ASC", self::$ROLE_FIELD_NAME) );
		$filter1 = new Filter("", "", self::$LOGIN_FIELD_NAME, "String", "lower", "equals", $this->login, null);
		$filters = array($filter1);
		$fields  = $model->getFieldsSet()->getFields();
		$options = array("slice_offset"=>0, "slice_length"=>self::$ROLE_MAX_VALUES);
		$roles_records = $model->read($fields, $filters, $orders, $options);
		
		// FILL LOGGED USER ROLES CACHE
		if ( ! is_null($roles_records) )
		{
			foreach($roles_records as $record)
			{
	//			TRACE::trace_var($context, "roles_records", $record);
				$role = $record[self::$ROLE_FIELD_NAME];
				$this->login_roles[$role] = $role;
			}
		}
	}
	
	protected function updateProfilesRoles()
	{
		$context = "ModelAuthentication.updateProfilesRoles()";
		
		// GET THE USERS/ROLES MODEL
		$model  = self::getProfilesRolesModel();
		if ( is_null($model) )
		{
			TRACE::addErrorMsg($context, "model is null", self::$TRACE_MODEL_AUTH);
			return;
		}
		
		// GET THE LOGGED USER ROLES
		$orders  = array( new Order("ASC", self::$ROLE_FIELD_NAME) );
		$filter1 = new Filter("", "", self::$LOGIN_FIELD_NAME, "String", "lower", "equals", $this->login, null);
		$filters = array($filter1);
		$fields  = $model->getFieldsSet()->getFields();
		$options = array("slice_offset"=>0, "slice_length"=>self::$ROLE_MAX_VALUES);
		$roles_records = $model->read($fields, $filters, $orders, $options);
		
		// FILL LOGGED USER ROLES CACHE
		if ( ! is_null($roles_records) )
		{
			foreach($roles_records as $record)
			{
	//			TRACE::trace_var($context, "roles_records", $record);
				$role = $record[self::$ROLE_FIELD_NAME];
				$this->login_roles[$role] = $role;
			}
		}
	}
	
	public function updateLoginRoles()
	{
		$context = "ModelAuthentication.updateLoginRoles()";
//		TRACE::enter($context);
		
		$this->login_roles = array();
		$this->updateUsersRoles();
		$this->updateProfilesRoles();
		
		Application::getInstance()->setSessionProperty(self::$SESSION_ROLES_KEY, $this->login_roles);
	}
	
	public function hasLoginRole($arg_role)
	{
		$context = "ModelAuthentication.hasLoginRole($arg_role)";
		$roles = $this->getLoginRoles();
		if ( is_null($roles) or empty($roles) )
		{
			return TRACE::leave("$context", "roles are null or empty", false, self::$TRACE_MODEL_AUTH);
		}
		
		return array_key_exists($arg_role, $roles);
	}
	
	public function getRolesForLogin($arg_login)
	{
		$context = "ModelAuthentication.getRolesForLogin($arg_login)";
		
		if ( is_null($arg_login) )
		{
			TRACE::addErrorMsg("$context", "login is null");
			return null;
		}
		
		$model   = self::getRolesModel();
		if ( is_null($model) )
		{
			TRACE::addErrorMsg("$context", "model is null");
			return null;
		}
		$orders  = array( new Order(self::$ROLE_FIELD_NAME, "ASC") );
		$filter1 = new Filter("", "", self::$LOGIN_FIELD_NAME, "String", "lower", "equals", $arg_login, null);
		$filters = array($filter1);
		
		$fields = $this->getFieldsSet()->getFields();
		$roles_records = $this->readWithSlice($fields, $filters, $orders, 0, self::$ROLE_MAX_VALUES, null);
		
		$roles = array();
		foreach($roles_records as $record)
		{
			$roles[] = $record[self::$ROLE_FIELD_NAME];
		}
		return $roles;
	}
	
	public function login($arg_login, $arg_password)
	{
		$context = "ModelAuthentication.login($arg_login, 'password')";
//		TRACE::enter($context);
		
		if ( is_null($arg_login) or is_null($arg_password) )
		{
			TRACE::addErrorMsg("$context", "login or password is null");
			return false;
		}
		
		$model   = self::getUsersModel();
		if ( is_null($model) )
		{
			TRACE::addErrorMsg("$context", "model is null");
			return false;
		}
		
		$fields = array(self::$LOGIN_FIELD_NAME, self::$PASSWORD_FIELD_NAME);
		$values  = array($arg_login, self::hashPassword($arg_password));
		$found = $model->hasRecordWithFields($fields, $values);
		
		if ($found == true)
		{
			$this->login = $arg_login;
			$this->roles = null;
			
			Application::getInstance()->setSessionProperty(self::$SESSION_LOGIN_KEY, $this->login);
			Application::getInstance()->resetSessionProperty(self::$SESSION_ROLES_KEY);
		}
		
		return $found;
	}
	
	public function logout()
	{
		$this->login = null;
		$this->roles = null;
		
		Application::getInstance()->resetSessionProperty(self::$SESSION_LOGIN_KEY);
		Application::getInstance()->resetSessionProperty(self::$SESSION_ROLES_KEY);
	}
	
	public function hashPassword($arg_password)
	{
		return md5($arg_password);
	}
}

?>