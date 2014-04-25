<?php
/**
 * @file        class_abstract_authorization.php
 * @brief       Abstract class for authorization
 * @details     define authorization interfaces
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractAuthorization
{
	/**
	 * @brief		Verify if the requesting object has the authorization for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	abstract public function check($arg_resource_name, $arg_requesting, $arg_access);
	
	/**
	 * @brief		Allow the requesting object for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	abstract public function allow($arg_resource_name, $arg_requesting, $arg_access);
	
	/**
	 * @brief		Deny the requesting object for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	abstract public function deny ($arg_resource_name, $arg_requesting, $arg_access);
	
	
	
	/**
	 * @brief		Verify if the logged user has the authorization for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function checkLogged($arg_resource_name, $arg_access)
	{
		return $this->check($arg_resource_name, Authentication::getLogin(), $arg_access);
	}
	
	/**
	 * @brief		Allow the logged user for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function allowLogged($arg_resource_name, $arg_access)
	{
		return $this->allow($arg_resource_name, Authentication::getLogin(), $arg_access);
	}
	
	/**
	 * @brief		Deny the logged user for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function denyLogged($arg_resource_name, $arg_access)
	{
		return $this->deny($arg_resource_name, Authentication::getLogin(), $arg_access);
	}
}
?>