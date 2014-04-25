<?php
/**
 * @file        class_abstract_controlled.php
 * @brief       Abstract class for controllers managed objects (api)
 * @details     define managed object interfaces
 * @see			NamedSessionProperties Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * @todo		check if the subaction is used
 */
abstract class AbstractControlled extends NamedSessionProperties
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Option record : name of the option (string)
	static public $OPTION_RECORD_NAME			= "name";
	
	/// @brief		Option record : type of the option value (string)
	/// @see		Type
	static public $OPTION_RECORD_TYPE			= "type";
	
	/// @brief		Option record : is the option required (boolean)
	/// @see		AbstractControlled::$OPTION_REQUIRED AbstractControlled::$OPTION_NOT_REQUIRED
	static public $OPTION_RECORD_REQUIRED		= "required";
	
	/// @brief		Option record : is the option saved on the server session (boolean)
	static public $OPTION_RECORD_STORE_SESSION	= "store_session";
	
	/// @brief		Option record : default value of the option (string)
	static public $OPTION_RECORD_DEFAULT		= "default";
	
	/// @brief		Option is required (boolean)
	static public $OPTION_REQUIRED				= true;
	
	/// @brief		Option is not required (boolean)
	static public $OPTION_NOT_REQUIRED			= false;
	
	/// @brief		Option is saved on the server session (boolean)
	static public $OPTION_STORE_SESSION			= true;
	
	/// @brief		Option is not saved on the server session (boolean)
	static public $OPTION_NOT_STORE_SESSION		= false;
	
	/// @brief		Trace are enabled for this class (boolean)
	/// @see		init_trace.php
	static public $TRACE_CONTROLLED				= true;
	
	/// @brief		Sub-option key (string)
	/// @deprecated	do not use, should be removed
	static public $SUBACTION_KEY				= "subAction";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
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
	}
	
	
	
	// ----------------- REGISTERED OPTIONS -----------------
	/**
	 * @brief		register an option
	 * @param[in]	arg_option_name		unique name of the option (string)
	 * @param[in]	arg_type			type name (string) (see Type)
	 * @param[in]	arg_required		is the option required (optional, default value: true)
	 * @param[in]	arg_store_session	is the option saved on the server session (optional, default value: false)
	 * @param[in]	arg_default			default value of the option (optional, default value: null)
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function registerOption($arg_option_name, $arg_type, $arg_required = true, $arg_store_session = false, $arg_default = null);
	
	/**
	 * @brief		test if an option is registered
	 * @param[in]	arg_option_name		unique name of the option (string)
	 * @return		boolean				true : option is registered, false : option is not registered
	 */
	abstract public function hasRegisteredOption($arg_option_name);
	
	/**
	 * @brief		get the registered option record
	 * @param[in]	arg_option_name		unique name of the option (string)
	 * @return		array of strings	option definition record
	 */
	abstract public function getRegisteredOption($arg_option_name);
	
	
	
	// ----------------- RUNTIME OPTIONS -----------------
	/**
	 * @brief		get the runtime (registered and runtime defined) options
	 * @return		array of strings arrays		option records array
	 */
	abstract public function getRuntimeOptions();
	
	/**
	 * @brief		set the runtime options array
	 * @param[in]	arg_options			options objects array
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function setRuntimeOptions($arg_options);
	
	/**
	 * @brief		append the given runtime options array to the existing array
	 * @param[in]	arg_options			options objects array
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function appendRuntimeOptions($arg_options);
	
	
	
	// ----------------- REGISTERED / RUNTIME / SESSION / REQUEST OPTIONS -----------------
	/**
	 * @brief		set the a runtime option value
	 * @param[in]	arg_option_name		option unique name (string)
	 * @param[in]	arg_option_value	option value (string/boolean/array...)
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function setOption($arg_option_name, $arg_option_value);
	
	/**
	 * @brief		test if a runtime option exists with the given name
	 * @param[in]	arg_option_name			options objects array
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function hasOption($arg_option_name);
	
	/**
	 * @brief		check if all registered required options have a runtime value
	 * @param		nothing
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function checkRequiredOptions();
	
	/**
	 * @brief		check if the given options names array ...
	 * @param		nothing
	 * @return		boolean				true : success, false : failure
	 */
	abstract public function checkOptions($arg_option_names);
	
	
	
	// ----------------- TYPED OPTION VALUE -----------------
	/**
	 * @brief		get the option record with the given name
	 * @param		arg_option_name		option name (string)
	 * @return		option record		(associative array of values)
	 */
	abstract public function getOption($arg_option_name);
	
	/**
	 * @brief		set an option value of the given name and the given value
	 * @param		arg_option_name		option name (string)
	 * @param		arg_value			option value (boolean)
	 * @return		nothing
	 */
	abstract public function setBooleanOption($arg_option_name, $arg_value);
	
	/**
	 * @brief		get an option value with the given name
	 * @param		arg_option_name		option name (string)
	 * @return		option value		(boolean)
	 */
	abstract public function getBooleanOption($arg_option_name);
	
	/**
	 * @brief		set an option value of the given name and the given value
	 * @param		arg_option_name		option name (string)
	 * @param		arg_value			option value (integer)
	 * @return		nothing
	 */
	abstract public function setIntegerOption($arg_option_name, $arg_value);
	
	/**
	 * @brief		get an option value with the given name
	 * @param		arg_option_name		option name (string)
	 * @return		option value		(boolean)
	 */
	abstract public function getIntegerOption($arg_option_name);
	
	/**
	 * @brief		get a non empty string option value
	 * @param		arg_option_name		option name (string)
	 * @param		arg_empty			(anything)
	 * @return		option value		(non empty string or arg_empty)
	 */
	abstract public function getNonEmptyStringOption($arg_option_name, $arg_empty = null);
	
	/**
	 * @brief		get an array of strings option value
	 * @param		arg_option_name		option name (string)
	 * @param		arg_separator		string separator (string)
	 * @return		option value		(array of strings)
	 */
	abstract public function getStringsArrayOption($arg_option_name, $arg_separator = ",");
	
	/**
	 * @brief		get an array of non empty strings option value
	 * @param		arg_option_name		option name (string)
	 * @param		arg_separator		string separator (string)
	 * @return		option value		(array of strings)
	 */
	abstract public function getNonEmptyStringsArrayOption($arg_option_name, $arg_separator = ",");
}
?>