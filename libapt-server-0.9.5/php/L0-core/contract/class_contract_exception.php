<?php
/**
 * @file        class_contract_exception.php
 * @brief       Exception of the contract adapter
 * @details     Exception of the contract adapter
 * @see			Contract ContractExceptionAdapter AbstractAssert Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ContractException extends Exception
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_context		context of the contract exception
	 * @return		nothing
	 */
	public function __construct($arg_context)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_context);
	}
	
	/**
	 * @brief		get the context of the contract exception
	 * @return		context			(string)
	 */
	public function getContext()
	{
		return $this->getMessage();
	}
}
?>