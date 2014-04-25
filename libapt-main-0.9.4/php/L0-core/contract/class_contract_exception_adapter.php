<?php
/**
 * @file        class_contract_exception_adapter.php
 * @brief       Abstract class for unit tests
 * @details     define many unit test methods
 * @see			ContractException Contract AbstractAssert Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ContractExceptionAdapter extends AbstractAssertImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_name		name of the object
	 * @return		nothing
	 */
	public function __construct()
	{
		// PARENT CONSTRUCTOR
		parent::__construct("");
	}
	
	
	
	// ----------------- ASSERTION FAILURE OR SUCCESS -----------------
	/**
	 * @brief		do an action on assertion success
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @return		object			this object
	 */
	public function assertSuccess($arg_context)
	{
		return $this;
	}
	
	/**
	 * @brief		do an action on assertion failure
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @return		object			this object
	 */
	public function assertFailure($arg_context)
	{
		throw new ContractException($arg_context);
		return $this;
	}
}
?>