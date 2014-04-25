<?php
/**
 * @file        class_contract.php
 * @brief       Contract static class
 * @details     call constract adapter
 * @see			AbstractAssert Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class CONTRACT
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	static protected $contract_adapter = null;
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR (protected)
	 * @return		nothing
	 */
	protected function __construct()
	{
	}
	
	
	
	// ----------------- ASSERTION ADAPTER -----------------
	static function getAdapter()
	{
		return self::$contract_adapter;
	}
	
	static function setAdapter($arg_adapter)
	{
		self::$contract_adapter = null;
		if ($arg_adapter instanceof AbstractAssert)
		{
			self::$contract_adapter = $arg_adapter;
		}
	}
	
	static function init($arg_adapter)
	{
		self::setAdapter($arg_adapter);
	}
	
	
	
	// ----------------- ASSERTION METHODS : OBJECT, CLASS -----------------
	/**
	 * @brief		assert if the given value is true
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value to test (boolean)
	 * @return		object			this object
	 */
	static public function assert($arg_context, $arg_value)
	{
		return self::$contract_adapter->assert($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is an object
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertObject($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertObject($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is a class name
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (string)
	 */
	static public function assertClassName($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertClassName($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is an interface name
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (string)
	 */
	public function assertInterfaceName($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertInterfaceName($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is an instance of the given class
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_class		class name (string)
	 * @return		object			this object
	 */
	static public function assertClass($arg_context, $arg_value, $arg_class)
	{
		return self::$contract_adapter->assertClass($arg_context, $arg_value, $arg_class);
	}
	
	/**
	 * @brief		assert if the given value is an object which inherits the given class
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_class		class name (string)
	 * @return		object			this object
	 */
	static public function assertInherit($arg_context, $arg_value, $arg_class)
	{
		return self::$contract_adapter->assertInherit($arg_context, $arg_value, $arg_class);
	}
	
	
	
	// ----------------- ASSERTION METHODS : ARRAY, STRING, NUMBER, BOOLEAN -----------------
	/**
	 * @brief		assert if the given value is an array
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertArray($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertArray($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given array has a given key
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		array (array)
	 * @param[in]	arg_key			array key (string)
	 * @return		object			this object
	 */
	static public function assertArrayHasKey($arg_context, $arg_value, $arg_key)
	{
		return self::$contract_adapter->assertArray($arg_context, $arg_value, $arg_key);
	}
	
	/**
	 * @brief		assert if the given value is a non empty array
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertNotEmptyArray($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertNotEmptyArray($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is an array min < size < max
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_min			min size (integer)
	 * @param[in]	arg_max			max size (integer)
	 * @return		object			this object
	 */
	static public function assertArrayCount($arg_context, $arg_value, $arg_min, $arg_max)
	{
		return self::$contract_adapter->assertArrayCount($arg_context, $arg_value, $arg_min, $arg_max);
	}
	
	/**
	 * @brief		assert if the given value is a string
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertString($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertString($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is a non empty string
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertNotEmptyString($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertNotEmptyString($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is numeric
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertNumeric($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertNumeric($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is a boolean
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertBoolean($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertBoolean($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is an integer
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertInteger($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertInteger($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is a float
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertFloat($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertFloat($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is null
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertNull($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertNull($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is true
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertTrue($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertTrue($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is false
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertFalse($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertFalse($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given value is not null
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	static public function assertNotNull($arg_context, $arg_value)
	{
		return self::$contract_adapter->assertNotNull($arg_context, $arg_value);
	}
	
	/**
	 * @brief		assert if the given values are equals
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value1		value (everything)
	 * @param[in]	arg_value2		value (everything)
	 * @return		object			this object
	 */
	static public function assertEquals($arg_context, $arg_value1, $arg_value2)
	{
		return self::$contract_adapter->assertEquals($arg_context, $arg_value1, $arg_value2);
	}
	
	/**
	 * @brief		assert if the given values are equivalent
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value1		value (everything)
	 * @param[in]	arg_value2		value (everything)
	 * @return		object			this object
	 */
	static public function assertEquiv($arg_context, $arg_value1, $arg_value2)
	{
		return self::$contract_adapter->assertEquiv($arg_context, $arg_value1, $arg_value2);
	}
}
?>