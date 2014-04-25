<?php
/**
 * @file        class_abstract_controlled_impl.php
 * @brief       Abstract class for controllers managed objects (implementation)
 * @details     Implements some methods of AbstractControlled
 * @author      Luc BORIES
 * @see			AbstractControlled Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * @todo		finish checkRequiredOptions
 * 
 */
abstract class AbstractControlledImpl extends AbstractControlled
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		registered options definitions (array)
	protected $registered_options	= null;
	
	/// @brief		runtime options values (array)
	protected $runtime_options		= null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name		unique name of the object
	 * @return		nothing
	 */
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
		
		// INIT ATTRIBUTES
		if ( is_null($this->registered_options) )
		{
			$this->registered_options = array();
		}
		if ( is_null($this->runtime_options) )
		{
			$this->runtime_options = array();
		}
	}
	
	
	
	// ----------------- REGISTERED OPTIONS -----------------
	/**
	 * @brief		Register an option definition
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @param[in]	arg_type			type of the option value (string)
	 * @param[in]	arg_required		the option is required or optional, default is true (boolean)
	 * @param[in]	arg_store_session	the option is persistent into the session or not, default is false (boolean)
	 * @param[in]	arg_default			default value of the option, default is null (anything)
	 * @return		boolean				true: success, false: failure
	 */
	public function registerOption($arg_option_name, $arg_type, $arg_required = true, $arg_store_session = false, $arg_default = null)
	{
		$context = get_class($this).".AbstractControlledImpl.registerOption";
		
		// CHECK ATTRIBUTES
		if ( is_null($this->registered_options) )
		{
			$this->registered_options = array();
		}
		if ( is_null($this->runtime_options) )
		{
			$this->runtime_options = array();
		}
		
		// CHECK ARGUMENTS
		CONTRACT::assertNotEmptyString($context.".arg_option_name", $arg_option_name);
		CONTRACT::assertNotEmptyString($context.".arg_type", $arg_type);
		CONTRACT::assertBoolean($context.".arg_required", $arg_required);
		CONTRACT::assertBoolean($context.".arg_store_session", $arg_store_session);
		
		// CREATE RECORD
		$option_record = array(
			self::$OPTION_RECORD_NAME			=> $arg_option_name,
			self::$OPTION_RECORD_TYPE			=> $arg_type,
			self::$OPTION_RECORD_REQUIRED		=> $arg_required,
			self::$OPTION_RECORD_STORE_SESSION	=> $arg_store_session,
			self::$OPTION_RECORD_DEFAULT		=> $arg_default
			);
		$this->registered_options[$arg_option_name] = $option_record;
		
		// INIT VALUE
		$option_value = $arg_default;
		if ( array_key_exists($arg_option_name, $this->runtime_options) )
		{
			$option_value = $this->runtime_options[$arg_option_name];
		}
		
		// STORE SESSION
		if ( $arg_store_session )
		{
			if ( $this->hasSessionProperty($arg_option_name) )
			{
				$option_value = $this->getSessionProperty($arg_option_name, $option_value);
			}
			else
			{
				$this->setSessionProperty($arg_option_name, $option_value);
			}
		}
		
		// STORE RUNTIME
		if ($arg_required or $option_value != $arg_default)
		{
			$this->runtime_options[$arg_option_name] = $option_value;
		}
		
		return true;
	}
	
	
	/**
	 * @brief		Test if the class instance has the given option definition
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		boolean				has the option?
	 */
	public function hasRegisteredOption($arg_option_name)
	{
		return array_key_exists($arg_option_name, $this->registered_options);
	}
	
	
	/**
	 * @brief		Get the option definition
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		array				option definition record or null
	 */
	public function getRegisteredOption($arg_option_name)
	{
		return array_key_exists($arg_option_name, $this->registered_options) ? $this->registered_options[$arg_option_name] : null;
	}
	
	
	/**
	 * @brief		Test if the option is required or optional
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		boolean				is the option required?
	 */
	public function isRequiredOption($arg_option_name)
	{
		$option = $this->getRegisteredOption($arg_option_name);
		
		return is_null($option) ? false : ($option[self::$OPTION_RECORD_REQUIRED] == self::$OPTION_REQUIRED);
	}
	
	
	// ----------------- RUNTIME OPTIONS -----------------
	/**
	 * @brief		Get all options definitions with the runtime values
	 * @return		array				array of runtime options records
	 */
	public function getRuntimeOptions()
	{
		return $this->runtime_options;
	}
	
	
	/**
	 * @brief		Set all options definitions with the runtime values
	 * @return		nothing
	 */
	public function setRuntimeOptions($arg_options)
	{
		$this->runtime_options = $arg_options;
	}
	
	
	/**
	 * @brief		Append the given options definitions with the runtime values to the existing options
	 * @param[in]	arg_options			array of options records
	 * @return		nothing
	 */
	public function appendRuntimeOptions($arg_options)
	{
		$this->runtime_options = array_join($this->runtime_options, $arg_options);
	}
	
	
	
	// ----------------- REGISTERED / RUNTIME / SESSION / REQUEST OPTIONS -----------------
	/**
	 * @brief		Set the given option runtime value
	 * @param[in]	arg_option_name		option name
	 * @param[in]	arg_option_value	option value
	 * @return		boolean				true: success, false: failure
	 */
	public function setOption($arg_option_name, $arg_option_value)
	{
		$context = get_class($this).".AbstractControlledImpl.setOption";
		
		// CHECK REGISTERED OPTION
		CONTRACT::assertTrue($context.".hasRegisteredOption($arg_option_name)", $this->hasRegisteredOption($arg_option_name) );
		
		// GET OPTION RECORD
		$option_record = $this->getRegisteredOption($arg_option_name);
		CONTRACT::assertNotNull($context.".getRegisteredOption($arg_option_name)", $option_record);
		
		// CHECK STORE SESSION
		$store_session = $option_record[self::$OPTION_RECORD_STORE_SESSION];
		if ($store_session)
		{
			$this->setSessionProperty($arg_option_name, $arg_option_value);
		}
		
		// SET RUNTIME VALUE
		$this->runtime_options[$arg_option_name] = $arg_option_value;
		return true;
	}
	
	
	/**
	 * @brief		Test if the class instance has the given option definition
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		boolean				has the option?
	 */
	public function hasOption($arg_option_name)
	{
		$context = get_class($this).".AbstractControlledImpl.hasOption";
		
		// CHECK REGISTERED OPTION
		CONTRACT::assertTrue($context.".hasRegisteredOption($arg_option_name)", $this->hasRegisteredOption($arg_option_name) );
		
		// CHECK REQUEST VALUE
		$result = Application::getInstance()->getRequest()->hasParameter($arg_option_name);
		if ( $result )
		{
			return TRACE::leaveok($context, "request option value found for [$arg_option_name]", true, self::$TRACE_CONTROLLED);
		}
		
		// CHECK RUNTIME VALUE
		CONTRACT::assertNotNull($context.".runtime_options", $this->runtime_options);
		$result = array_key_exists($arg_option_name, $this->runtime_options) && ! is_null($this->runtime_options[$arg_option_name]);
		if ( $result )
		{
			return TRACE::leaveok($context, "runtime option value found for [$arg_option_name]", true, self::$TRACE_CONTROLLED);
		}
		
		// CHECK DEFAULT VALUE
		$option_record = $this->getRegisteredOption($arg_option_name);
		CONTRACT::assertNotNull($context.".option_record", $option_record);
		$default_value = $option_record[self::$OPTION_RECORD_DEFAULT];
		$result = ! is_null($default_value);
		if ( $result )
		{
			return TRACE::leaveok($context, "default option value found for [$arg_option_name]", true, self::$TRACE_CONTROLLED);
		}
		
		return  TRACE::leaveko($context, "no value found for [$arg_option_name]", false, self::$TRACE_CONTROLLED);
	}
	
	
	/**
	 * @brief		Get the option value
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		anything			option value
	 */
	public function getOption($arg_option_name)
	{
		$context = get_class($this).".AbstractControlledImpl.getOption";
		
		// CHECK REGISTERED OPTION
		CONTRACT::assertTrue($context.".hasRegisteredOption($arg_option_name)", $this->hasRegisteredOption($arg_option_name) );
		
		// CHECK RUNTIME OPTIONS ARRAY
		CONTRACT::assertNotNull($context.".runtime_options", $this->runtime_options);
		
		// GET REGISTERED OPTION RECORD
		$option_record = $this->getRegisteredOption($arg_option_name);
		CONTRACT::assertNotNull($context.".option_record", $option_record);
		
		// GET DEFAULT OPTION VALUE
		$default_value = $option_record[self::$OPTION_RECORD_DEFAULT];
		
		// GET RUNTIME OPTION VALUE
		$runtime_value = null;
		if ( array_key_exists($arg_option_name, $this->runtime_options) )
		{
			$runtime_value = $this->runtime_options[$arg_option_name];
		}
		
		// GET REQUEST VALUE
		// $option_type = "";
		$option_type = $option_record[self::$OPTION_RECORD_TYPE];
		$request_value = Application::getInstance()->getRequest()->getParameter($arg_option_name, $option_type, null);
		
		// CHOOSE REQUEST VALUE OR RUNTIME VALUE OR DEFAULT VALUE
		if ( ( ! is_null($request_value) ) && ($request_value != "") )
		{
			return TRACE::leaveok($context, "request value for option [$arg_option_name][$request_value]", $request_value, self::$TRACE_CONTROLLED);
		}
		if ( ( ! is_null($runtime_value) ) && ($runtime_value != "") )
		{
			return TRACE::leaveok($context, "runtime value for option [$arg_option_name][$runtime_value]", $runtime_value, self::$TRACE_CONTROLLED);
		}
		if ( ( ! is_null($default_value) ) && ($default_value != "") )
		{
			return TRACE::leaveok($context, "default value for option [$arg_option_name][$default_value]", $default_value, self::$TRACE_CONTROLLED);
		}
		
		return TRACE::leaveko($context, "no value found for option [$arg_option_name][null]", null, self::$TRACE_CONTROLLED);
	}
	
	
	/**
	 * @brief		Check if the required options values are set
	 * @return		boolean				true: success, false: failure
	 */
	public function checkRequiredOptions()
	{
		$context = get_class($this).".AbstractControlledImpl.checkRequiredOptions";
		TRACE::enter($context, "", self::$TRACE_CONTROLLED);
		
		foreach($this->registered_options as $name=>$option)
		{
			if ( $this->isRequiredOption($name) && ! $this->hasOption() )
			{
				// TODO
			}
		}
		
		return TRACE::leaveok($context, "all required options found", true, self::$TRACE_CONTROLLED);
	}
	
	
	/**
	 * @brief		Check if the required options values are set
	 * @param[in]	arg_option_names	names of the options (array of strings)
	 * @return		boolean				true: success, false: failure
	 */
	public function checkOptions($arg_option_names)
	{
		$context = get_class($this).".AbstractControlledImpl.checkOptions";
		
		foreach($arg_option_names as $option_key => $option_name)
		{
			if ( ! array_key_exists($option_name, $this->registered_options) )
			{
				TRACE::addAlertMsg($context, "option is not registerd [$option_name]", self::$TRACE_CONTROLLED);
				return array_key_exists($option_name, $this->runtime_options);
			}
			
			// GET REGISTERED OPTION DEFINITION
			$registered_option = $this->registered_options[$option_name];
			
			// CHECK IF REQUIRED
			$required = $registered_option["required"];
			if ( $required and ! array_key_exists($option_name, $this->runtime_options) )
			{
				TRACE::addAlertMsg($context, "option is required but not found [$option_name]", self::$TRACE_CONTROLLED);
				return false;
			}
		}
		
		return true;
	}
	
	
	
	// ----------------- TYPED OPTION VALUE -----------------
	/**
	 * @brief		Set the option boolean value
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @param[in]	arg_value			option value (string, integer or boolean)
	 * @return		boolean				true: success, false: failure
	 */
	public function setBooleanOption($arg_option_name, $arg_value)
	{
		$value = "0";
		if ($arg_value)
		{
			$value = "1";
		}
		return $this->setOption($arg_option_name, $value);
	}
	
	
	/**
	 * @brief		Get the option boolean value
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		boolean				option value
	 */
	public function getBooleanOption($arg_option_name)
	{
		$value = $this->getOption($arg_option_name);
		return Type::getBooleanValue($value);
	}
	
	
	/**
	 * @brief		Set the option integer value
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @param[in]	arg_value			option value (string, integer)
	 * @return		boolean				true: success, false: failure
	 */
	public function setIntegerOption($arg_option_name, $arg_value)
	{
		$value = $arg_value;
		if ($arg_value == "")
		{
			$value = "0";
		}
		return $this->setOption($arg_option_name, $value);
	}
	
	
	/**
	 * @brief		Get the option integer value
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		integer				option value
	 */
	public function getIntegerOption($arg_option_name)
	{
		$value = $this->getOption($arg_option_name);
		return Type::getIntegerValue($value);
	}
	
	
	/**
	 * @brief		Get the option string value if not empty
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @return		string				option value (null if the string is empty)
	 */
	public function getNonEmptyStringOption($arg_option_name, $arg_empty = null)
	{
		$value = $this->getOption($arg_option_name);
		return (is_null($value) || (! is_string($value)) || $value == "") ? null : $value;
	}
	
	
	/**
	 * @brief		Get the option strings array value if not empty
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @param[in]	arg_separator		strings separator, default is coma ',' (string)
	 * @return		array				option value (array of strings)
	 */
	public function getStringsArrayOption($arg_option_name, $arg_separator = ",")
	{
		$value = $this->getOption($arg_option_name);
		
		// PERMIT TO DEFINE AN ARRAY OPTION VALUE ON MANY LINES
		$value = str_replace(array("\n","\r","\t","\r\n"), "", $value);
		
		$ARRAY_ITEMS_LIMIT = 100;
		
		return explode($arg_separator, $value, $ARRAY_ITEMS_LIMIT);
	}
	
	
	/**
	 * @brief		Get the option value : a not empty strings array
	 * @param[in]	arg_option_name		unique name of the option for the class (string)
	 * @param[in]	arg_separator		strings separator, default is coma ',' (string)
	 * @return		array				option value (an array of strings, null if one string is empty)
	 */
	public function getNonEmptyStringsArrayOption($arg_option_name, $arg_separator = ",")
	{
		$value = $this->getOption($arg_option_name);
		
		// PERMIT TO DEFINE AN ARRAY OPTION VALUE ON MANY LINES
		$value = str_replace(array("\n","\r","\t","\r\n"), "", $value);
		
		$ARRAY_ITEMS_LIMIT = 100;
		
		$strings = explode($arg_separator, $value, $ARRAY_ITEMS_LIMIT);
		foreach($strings as $key=>$str)
		{
			if (is_null($str) || $str == "")
			{
				return null;
			}
		}
		return $strings;
	}
}
?>