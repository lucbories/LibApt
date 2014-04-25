<?php
/**
 * @version		$Id: class_abstract_application_seesion.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L4-app/api
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractApplicationSession
{
	// ATTRIBUTES
	protected $session_engine = null;
	
	
	// CONSTRUCTOR
	protected function __construct($arg_session_engine)
	{
		$this->session_engine = $arg_session_engine;
	}
	
	
	// STORAGE ENGINE OPERATIONS
	public function startSession()
	{
		return $this->session_engine->startStorageEngine();
	}
	
	public function unlockSession()
	{
		return $this->session_engine->unlockStorageEngine();
	}
	
	public function resetSession()
	{
		return $this->session_engine->resetStorageEngine();
	}
	
	public function stopSession()
	{
		return $this->session_engine->stopStorageEngine();
	}
	
	
	// SESSION ID OPERATIONS
	public function getSessionId()
	{
		return $this->session_engine->getId();
	}
	
	public function setSessionId($arg_id)
	{
		$this->session_engine->setId($arg_id);
	}
	
	public function getSessionName()
	{
		return $this->session_engine->getName();
	}
	
	public function setSessionName($arg_name)
	{
		return $this->session_engine->setName($arg_name);
	}
	
	
	// SESSION ATRIBUTTES OPERATIONS
	public function getSessionProperties()
	{
		return $this->session_engine->getAttributes();
	}
	
	public function hasSessionProperty($arg_property_name)
	{
		return $this->session_engine->hasAttribute($arg_property_name);
	}
	
	public function getSessionProperty($arg_property_name)
	{
		return $this->session_engine->getAttribute($arg_property_name);
	}
	
	public function getSessionPropertyWithDefault($arg_property_name, $arg_default_value)
	{
		if ( $this->session_engine->hasAttribute($arg_property_name) )
		{
			return $this->session_engine->getAttribute($arg_property_name);
		}
		
		return $arg_default_value;
	}
	
	public function setSessionProperty($arg_property_name, $arg_property_value)
	{
		$this->session_engine->setAttribute($arg_property_name, $arg_property_value);
	}
	
	public function resetSessionProperty($arg_property_name)
	{
		$this->session_engine->removeAttribute($arg_property_name);
	}
	
	
	// ----------------- APPLICATION REQUEST/RESPONSE -----------------
	
	/**
	 * @brief		Application request singleton
	 * @return		object		instance of the Request class
	 */
	public abstract function getRequest();
	
	/**
	 * @brief		Application response singleton
	 * @return		object		instance of the Response class
	 */
	public abstract function getResponse();
	
	
	
	// ----------------- APPLICATION PROPERTIES -----------------
	
	/**
	 * @brief		Get an application property (session, constant, default value)
	 * @param[in]	arg_session_name		name of the session property
	 * @param[in]	arg_constant_name		name of the constant property, default null
	 * @param[in]	arg_default_value		default value of the property, default null
	 * @return		mixin					property value : session value or constant value or default value
	 */
	public function getApplicationProperty($arg_session_name, $arg_constant_name = null, $arg_default_value = null)
	{
		// GET REQUEST VALUE
		if ( $this->getRequest()->hasParameter($arg_session_name) )
		{
			$value = $this->getRequest()->getParameter($arg_session_name);
			$this->setSessionProperty($arg_session_name, $value);
			return $value;
		}
		
		// GET SESSION VALUE
		$session_started = isset($_SESSION);
		if ( function_exists("session_status") )
		{
			$session_started = session_status() == PHP_SESSION_ACTIVE;
		}
		if ( $session_started && $this->hasSessionProperty($arg_session_name) )
		{
			return $this->getSessionProperty($arg_session_name);
		}
		
		// GET CONSTANT VALUE
		if ( ! is_null($arg_constant_name) && defined($arg_constant_name) )
		{
			return constant($arg_constant_name);
		}
		
		// GET DEFAULT VALUE
		return $arg_default_value;
	}
	
	
	/**
	 * @brief		Get an application boolean property (session, constant, default value)
	 * @param[in]	arg_session_name		name of the session property
	 * @param[in]	arg_constant_name		name of the constant property, default null
	 * @param[in]	arg_session_name		default value of the property, default false
	 * @return		boolean					property value : session value or constant value or default value
	 */
	public function getApplicationBooleanProperty($arg_session_name, $arg_constant_name = null, $arg_default_value = false)
	{
		$value = $this->getApplicationProperty($arg_session_name, $arg_constant_name, $arg_default_value);
		return TYPE::getBooleanValue($value, $arg_default_value);
	}
}
?>