<?php
/**
 * @version		$Id: class_abstract_controller.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/control
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractController
{
	// STATIC ATTRIBUTES
	static public $TRACE_CONTROLLER			= false;
	static public $TRACE_CONTROLLER_STEP	= false;
	static public $TRACE_CONTROLLER_OK		= false;
	
	// ATTRIBUTES
	protected $objects = null;
	private $map_actions_resources_accesses = null;
	
	
	// CONSTRUCTOR
	public function __construct()
	{
		$this->objects = array();
		$this->map_actions_resources_accesses = array();
	}
	
	
	// REFERENCEMENT DES OBJETS
	abstract public function checkObject($arg_named_object);
	
	public function registerObject($arg_named_object)
	{
		$context = get_class($this).".AbstractController.registerObject";
		TRACE::enter($context, "", self::$TRACE_CONTROLLER);
		
		if ( ! is_null($arg_named_object) and $this->checkObject($arg_named_object) )
		{
			$object_name = $arg_named_object->getName();
			if ( ! is_null($object_name) and $object_name != "" )
			{
				TRACE::addDebugMsg($context, "$object_name class:".get_class($arg_named_object), self::$TRACE_CONTROLLER);
				$this->objects[$object_name] = $arg_named_object;
			}
			else
			{
				TRACE::addDebugMsg($context, "object_class=[$arg_named_object]", self::$TRACE_CONTROLLER);
				return TRACE::leaveko($context, "Object name is null or empty", false, self::$TRACE_CONTROLLER);
			}
		}
		else
		{
			return TRACE::leaveko($context, "Object is not valid", false, self::$TRACE_CONTROLLER);
		}
		return TRACE::leaveok($context, "Object is valid", true, self::$TRACE_CONTROLLER);
	}
	
	public function unregisterObject($arg_unique_ame)
	{
		unset($this->objects[$arg_unique_ame]);
	}
	
	public function hasObject($arg_unique_name)
	{
		return array_key_exists($arg_unique_name, $this->objects);
	}
	
	public function getObject($arg_unique_ame)
	{
		$context = get_class($this).".AbstractController.getObject($arg_unique_ame)";
		
		if ( array_key_exists($arg_unique_ame, $this->objects) )
		{
			$object = $this->objects[$arg_unique_ame];
			
			if ($object instanceof LazyObject)
			{
				TRACE::step($context, "lazy object found", self::$TRACE_CONTROLLER_STEP);
				return $object->getCreatedObject();
			}
			
			TRACE::step($context, "object found", self::$TRACE_CONTROLLER_STEP);
			return $object;
		}

		TRACE::step($context, "object not found", self::$TRACE_CONTROLLER_STEP);
		return null;
	}
	
	public function getLazyObject($arg_unique_ame)
	{
		$context = get_class($this).".AbstractController.getLazyObject($arg_unique_ame)";
		
		if ( array_key_exists($arg_unique_ame, $this->objects) )
		{
			$object = $this->objects[$arg_unique_ame];
			if ($object instanceof LazyObject)
			{
				return $object;
			}
			
			return TRACE::leaveko($context, "object found but not a lazy object for name [$arg_unique_ame]", null, self::$TRACE_CONTROLLER);
		}
		
		return TRACE::leaveko($context, "no lazy object nor object found for name [$arg_unique_ame]", null, self::$TRACE_CONTROLLER);
	}
	
	public function getLazyOrNotObject($arg_unique_ame)
	{
		$context = get_class($this).".AbstractController.getLazyOrNotObject($arg_unique_ame)";
		
		if ( array_key_exists($arg_unique_ame, $this->objects) )
		{
			$object = $this->objects[$arg_unique_ame];
			return $object;
		}
		
		return TRACE::leaveko($context, "no lazy object nor object found for name [$arg_unique_ame]", null, self::$TRACE_CONTROLLER);
	}
	
	
	// REFERENCEMENT DES ACTIONS
	public function registerAction($arg_action_name, $arg_named_object, $arg_access)
	{
		$context = get_class($this).".AbstractController.registerAction";
		$this->map_actions_resources_accesses[$arg_action_name] = array("resource" => $arg_named_object, "access" => $arg_access);
		TRACE::addDebugMsg($context, "($arg_action_name, ".$arg_named_object->getName().", $arg_access)", self::$TRACE_CONTROLLER);
	}
	
	public function unregisterAction($arg_action_name)
	{
		unset($this->map_actions_resources_accesses[$arg_action_name]);
	}
	
	
	// OBJECT FOR ACTION
	public function getActionObject($arg_action_name)
	{
		if ( array_key_exists($arg_action_name, $this->map_actions_resources_accesses) )
		{
			$object = $this->map_actions_resources_accesses[$arg_action_name]["resource"];
			if ($object instanceof LazyObject)
			{
				return $object->getCreatedObject();
			}
			return $object;
		}
		return null;
	}
	
	public function hasActionObject($arg_action_name)
	{
		return array_key_exists($arg_action_name, $this->map_actions_resources_accesses);
	}
	
	
	// EXECUTION D'UNE ACTION AVEC LES OPERANDES FOURNIES
	protected function checkAuthorization($arg_action_name)
	{
		// TODO Audit ACCESSES
		
		// TODO !!!!
	//	return true;
		
		
		if ( ! Authentication::isEnabled() )
		{
			return true;
		}
		
		if ( ! Authentication::isLogged() )
		{
			Errors::errorDispatcherControllerNotLogged(get_class($this), $arg_action_name);
			return false;
		}
		
		if ( ! $this->hasActionObject($arg_action_name) )
		{
			Errors::errorDispatcherActionNotFound(get_class($this), $arg_action_name);
			return false;
		}
		
		// CHECK AUTHORIZATION FOR THE LOGGED USER
		$record = $this->map_actions_resources_accesses[$arg_action_name];
		if ( is_null($record) )
		{
			Errors::errorDispatcherNoDefinedAccess(get_class($this),$arg_action_name);
			return false;
		}
		
		$resource_object = $record["resource"];
		$resource_name = $resource_object->getName();
		$access = $record["access"];
		$result = Authorization::checkLogged($resource_name, $access);
		if ( $result == true )
		{
			// AUDIT ACCESS
			return true;
		}
		
		Errors::errorDispatcherNoAuthorization($arg_action_name, $resource_name, $access);
		return false;
	}
	
	protected function getUrlParameter($arg_prefix, $arg_parameters)
	{
		// WITHOUT PREFIX
		if (is_null($arg_prefix) or $arg_prefix == "")
		{
			return $arg_parameters;
		}
		
		// WITH PREFIX
		$url_parameters = array();
		$prefix_len = strlen($arg_prefix."_");
		foreach($arg_parameters as $key=>$value)
		{
			$key2 = substr($key, $prefix_len );
			if ( is_null($key2) or $key2 == "" )
			{
				$key2 = $key;
			}
			$url_parameters[$key2] = $value;
		}
		return $url_parameters;
	}
	
	public function doAction($arg_action_name, $arg_url_parameters)
	{
		$context = get_class($this).".AbstractController.doAction";
		TRACE::enter($context, "", self::$TRACE_CONTROLLER);
		
		TRACE::trace_var($context, "action", $arg_action_name, self::$TRACE_CONTROLLER);
		TRACE::trace_var($context, "parameters", $arg_url_parameters, self::$TRACE_CONTROLLER);
		
		if ( $this->checkAuthorization($arg_action_name) )
		{
			TRACE::step($context, "checkAuthorization is ok : doActionSelf", self::$TRACE_CONTROLLER);
			$result = $this->doActionSelf($arg_action_name, $arg_url_parameters);
			if ($result)
			{
				return TRACE::leaveok($context, "doActionSelf success", true, self::$TRACE_CONTROLLER);
			}
			return TRACE::leaveko($context, "doActionSelf failed", false, self::$TRACE_CONTROLLER);
		}
		
		return TRACE::leaveok($context, "", false, self::$TRACE_CONTROLLER);
	}
	
	abstract protected function doActionSelf($arg_action_name, $arg_url_parameters);
}

?>
