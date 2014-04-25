<?php
/**
 * @file        class_named_session_properties.php
 * @brief       ...
 * @details     ...
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		
 * 
 */
class NamedSessionProperties extends Named
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_name		unique name of the object
	 * @return		nothing
	 */
	public function __construct($arg_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_name);
	}
	
	
	
	// ----------------- SESSION PROPERTIES OPERATIONS -----------------
	
	/**
	 * @brief		test if a property with the given key is registered in the session
	 * @param[in]	arg_key			property key (string)
	 * @return		boolean			true : key is registered, false : key is not registered
	 */
	public function hasSessionProperty($arg_key)
	{
		$key = $this->getName() . "_" . $arg_key;
		return Application::getInstance()->hasSessionProperty($key);
	}
	
	/**
	 * @brief		get the session property with the given key
	 * @param[in]	arg_key			property key (string)
	 * @param[in]	arg_default		default property value (object)
	 * @return		object			property value
	 */
	public function getSessionProperty($arg_key, $arg_default)
	{
		$key = $this->getName() . "_" . $arg_key;
		return Application::getInstance()->getSessionPropertyWithDefault($key, $arg_default);
	}
	
	/**
	 * @brief		set the value to the session property with the given key
	 * @param[in]	arg_key			property key (string)
	 * @param[in]	arg_value		property value (object)
	 * @return		object			property value
	 */
	public function setSessionProperty($arg_key, $arg_value)
	{
		$key = $this->getName() . "_" . $arg_key;
		Application::getInstance()->setSessionProperty($key, $arg_value);
	}
	
	/**
	 * @brief		reset the value of the session property with the given key
	 * @param[in]	arg_key			property key (string)
	 * @return		nothing
	 */
	public function resetSessionProperty($arg_key)
	{
		$key = $this->getName() . "_" . $arg_key;
		Application::getInstance()->resetSessionProperty($key);
	}
}
?>