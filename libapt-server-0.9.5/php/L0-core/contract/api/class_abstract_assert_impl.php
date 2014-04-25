<?php
/**
 * @file        class_abstract_assert_impl.php
 * @brief       Abstract class for assertions (implemntation)
 * @details     define many kind of assertions
 * @see			AbstractAssert Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractAssertImpl extends AbstractAssert
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
	
	
	
	// ----------------- ASSERTION METHODS : OBJECT, CLASS -----------------
	/**
	 * @brief		assert if the given value is true
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value to test (boolean)
	 * @return		object			this object
	 */
	public function assert($arg_context, $arg_value)
	{
		$context = get_class($this).".assert($arg_context, value)";
		if ($arg_value)
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is an object
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertObject($arg_context, $arg_value)
	{
		$context = get_class($this).".assertObject($arg_context, value)";
		if ( is_object($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is a class name
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (string)
	 */
	public function assertClassName($arg_context, $arg_value)
	{
		$context = get_class($this).".assertClassName($arg_context, value)";
		if ( class_exists($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is an interface name
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (string)
	 */
	public function assertInterfaceName($arg_context, $arg_value)
	{
		$context = get_class($this).".assertInterfaceName($arg_context, value)";
		if ( interface_exists($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is an instance of the given class
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_class		class name (string)
	 * @return		object			this object
	 */
	public function assertClass($arg_context, $arg_value, $arg_class)
	{
		$context = get_class($this).".assertClass($arg_context, value, $arg_class)";
		if ( get_class($arg_value) == $arg_class )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is an object which inherits the given class
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_class		class name (string)
	 * @return		object			this object
	 */
	public function assertInherit($arg_context, $arg_value, $arg_class)
	{
		$context = get_class($this)."assertInherit($arg_context, value, $arg_class).";
		if ( $arg_value instanceof $arg_class )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	
	
	// ----------------- ASSERTION METHODS : ARRAY, STRING, NUMBER, BOOLEAN -----------------
	/**
	 * @brief		assert if the given value is an array
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertArray($arg_context, $arg_value)
	{
		$context = get_class($this).".assertArray($arg_context, value)";
		if ( is_array($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given array has a given key
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		array (array)
	 * @param[in]	arg_key			array key (string)
	 * @return		object			this object
	 */
	public function assertArrayHasKey($arg_context, $arg_value, $arg_key)
	{
		$context = get_class($this).".assertArrayHasKey($arg_context, array, $arg_key)";
		if ( array_key_exists($arg_key, $arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is a non empty array
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertNotEmptyArray($arg_context, $arg_value)
	{
		$context = get_class($this).".assertNotEmptyArray($arg_context, value)";
		if ( is_array($arg_value) && count($arg_value) > 0 )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is an array min < size < max
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @param[in]	arg_min			min size (integer)
	 * @param[in]	arg_max			max size (integer)
	 * @return		object			this object
	 */
	public function assertArrayCount($arg_context, $arg_value, $arg_min, $arg_max)
	{
		$context = get_class($this).".assertArrayCount($arg_context, value, $arg_min, $arg_max)";
		$size = count($arg_value);
		if ( is_array($arg_value) && $size >= $arg_min && $size <= $arg_max )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context."=>$size");
	}
	
	
	/**
	 * @brief		assert if the given value is a string
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertString($arg_context, $arg_value)
	{
		$context = get_class($this).".assertString($arg_context, value)";
		if ( is_string($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is a non empty string
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertNotEmptyString($arg_context, $arg_value)
	{
		$context = get_class($this).".assertNotEmptyString($arg_context, value)";
		if ( is_string($arg_value) && $arg_value != "" )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is numeric
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertNumeric($arg_context, $arg_value)
	{
		$context = get_class($this).".assertNumeric($arg_context, value)";
		if ( is_numeric($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is a boolean
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertBoolean($arg_context, $arg_value)
	{
		$context = get_class($this).".assertBoolean($arg_context, value)";
		if ( is_bool($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is an integer
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertInteger($arg_context, $arg_value)
	{
		$context = get_class($this).".assertInteger($arg_context, value)";
		if ( is_integer($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is a float
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertFloat($arg_context, $arg_value)
	{
		$context = get_class($this).".assertFloat($arg_context, value)";
		if ( is_float($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is null
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertNull($arg_context, $arg_value)
	{
		$context = get_class($this).".assertNull($arg_context, value)";
		if ( is_null($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is true
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertTrue($arg_context, $arg_value)
	{
		$context = get_class($this).".assertTrue($arg_context, value)";
		if ( $arg_value )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is false
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertFalse($arg_context, $arg_value)
	{
		$context = get_class($this).".assertFalse($arg_context, value)";
		if ( ! $arg_value )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given value is not null
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value		value (everything)
	 * @return		object			this object
	 */
	public function assertNotNull($arg_context, $arg_value)
	{
		$context = get_class($this).".assertNotNull($arg_context, value)";
		if ( ! is_null($arg_value) )
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given values are equals
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value1		value (everything)
	 * @param[in]	arg_value2		value (everything)
	 * @return		object			this object
	 */
	public function assertEquals($arg_context, $arg_value1, $arg_value2)
	{
		$context = get_class($this).".assertEquals($arg_context, value1, value2)";
		if ($arg_value1 == $arg_value2)
		{
			return $this->assertSuccess($context);
		}
		
		$str_a = "";
		$str_b = "";
		
		if ( is_null($arg_value1) )
		{
			$str_a = "null";
		}
		if ( is_object($arg_value1) )
		{
			$str_a = "object";
		}
		if ( is_array($arg_value1) )
		{
			$str_a = "array";
		}
		if ( is_string($arg_value1) )
		{
			$str_a = $arg_value1;
		}
		if ( is_numeric($arg_value1) )
		{
			$str_a = $arg_value1;
		}
		
		if ( is_null($arg_value2) )
		{
			$str_b = "null";
		}
		if ( is_object($arg_value2) )
		{
			$str_b = "object";
		}
		if ( is_array($arg_value2) )
		{
			$str_b = "array";
		}
		if ( is_string($arg_value2) )
		{
			$str_b = $arg_value2;
		}
		if ( is_numeric($arg_value2) )
		{
			$str_b = $arg_value2;
		}
		
		$context = get_class($this).".assertEquals($arg_context, $str_a, $str_b)";
		return $this->assertFailure($context);
	}
	
	/**
	 * @brief		assert if the given values are equivalent
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @param[in]	arg_value1		value (everything)
	 * @param[in]	arg_value2		value (everything)
	 * @return		object			this object
	 */
	public function assertEquiv($arg_context, $arg_value1, $arg_value2)
	{
		$context = get_class($this).".assertEquiv($arg_context, value1, value2)";
		if ($arg_value1 === $arg_value2)
		{
			return $this->assertSuccess($context);
		}
		return $this->assertFailure($context);
	}
}
?>