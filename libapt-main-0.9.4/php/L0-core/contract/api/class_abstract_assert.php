<?php
/**
 * @file        class_abstract_assert.php
 * @brief       Abstract class for assertions (api)
 * @details     define many kind of assertions
 * @see			Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractAssert extends Named
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_name		name of the object
	 * @return		nothing
	 */
	protected function __construct($arg_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_name);
	}
	
	
	
	// ----------------- ASSERTION FAILURE OR SUCCESS -----------------
	/**
	 * @brief		do an action on assertion success
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @return		object			this object
	 */
	abstract public function assertSuccess($arg_context);
	
	/**
	 * @brief		do an action on assertion failure
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @return		object			this object
	 */
	abstract public function assertFailure($arg_context);
	
	
	
	// ----------------- ASSERTION METHODS : OBJECT, CLASS -----------------
	/**
	 * @brief		assert if the given value is true
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value to test (boolean)
	 * @return		object			this object
	 */
	abstract public function assert($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is an object
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertObject($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is a class name
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (string)
	 */
	abstract public function assertClassName($arg_context, $arg_value);
	/**
	 * @brief		assert if the given value is an interface name
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (string)
	 */
	abstract public function assertInterfaceName($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is an instance of the given class
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_class		class name (string)
	 * @return		object			this object
	 */
	abstract public function assertClass($arg_context, $arg_value, $arg_class);
	
	/**
	 * @brief		assert if the given value is an object which inherits the given class
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_class		class name (string)
	 * @return		object			this object
	 */
	abstract public function assertInherit($arg_context, $arg_value, $arg_class);
	
	
	
	// ----------------- ASSERTION METHODS : ARRAY, STRING, NUMBER, BOOLEAN -----------------
	/**
	 * @brief		assert if the given value is an array
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertArray($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given array has a given key
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		array (array)
	 * @param[in]	arg_key			array key (string)
	 * @return		object			this object
	 */
	abstract public function assertArrayHasKey($arg_context, $arg_value, $arg_key);
	
	/**
	 * @brief		assert if the given value is a non empty array
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertNotEmptyArray($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is an array min < size < max
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_min			min size (integer)
	 * @param[in]	arg_max			max size (integer)
	 * @return		object			this object
	 */
	abstract public function assertArrayCount($arg_context, $arg_value, $arg_min, $arg_max);
	
	/**
	 * @brief		assert if the given value is a string
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertString($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is a non empty string
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertNotEmptyString($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is numeric
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertNumeric($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is a boolean
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertBoolean($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is an integer
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertInteger($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is a float
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertFloat($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is null
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertNull($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is true
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertTrue($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is false
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertFalse($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given value is not null
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertNotNull($arg_context, $arg_value);
	
	/**
	 * @brief		assert if the given values are equals
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value1		value (everything)
	 * @param[in]	arg_value2		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertEquals($arg_context, $arg_value1, $arg_value2);
	
	/**
	 * @brief		assert if the given values are equivalent
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value1		value (everything)
	 * @param[in]	arg_value2		value (everything)
	 * @return		object			this object
	 */
	abstract public function assertEquiv($arg_context, $arg_value1, $arg_value2);
}
?>