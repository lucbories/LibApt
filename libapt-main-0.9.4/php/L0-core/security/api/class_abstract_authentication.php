<?php
/**
 * @file        class_abstract_authentication.php
 * @brief       Abstract class for authentication
 * @details     define authentication interfaces
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractAuthentication
{
	/**
	 * @brief		Test if a user is logged
	 * @return		boolean
	 */
	abstract public function isLogged();
	
	/**
	 * @brief		Get the logged user login
	 * @return		string
	 */
	abstract public function getLogin();
	
	/**
	 * @brief		Get the logged user roles array
	 * @return		array of strings
	 */
	abstract public function getLoginRoles();
	
	/**
	 * @brief		Test if the logged user has the given role
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	abstract public function hasLoginRole($arg_role);
	
	/**
	 * @brief		Test the authentication credentials
	 * @param[in]	arg_login		login
	 * @param[in]	arg_password	password (hashed value)
	 * @return		boolean
	 */
	abstract public function login($arg_login, $arg_password);
	
	/**
	 * @brief		Logout the logged user
	 * @return		nothing
	 */
	abstract public function logout();
	
	/**
	 * @brief		Get the hashed value of the given password
	 * @param[in]	arg_password	password string
	 * @return		strings			hashed value
	 */
	abstract public function hashPassword($arg_password);
}
?>