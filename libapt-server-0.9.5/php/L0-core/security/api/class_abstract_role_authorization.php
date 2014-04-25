<?php
/**
 * @file        class_abstract_role_authorization.php
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
 * @todo		write api documentation
 * 
 */
abstract class AbstractRoleAuthorization extends AbstractAuthorization
{
	// ATTRIBUTES
	private $registered_role_accesses = array();
	
	
	// REGISTER ROLE ACCESSES
	abstract protected function getResourceAccessKey($arg_resource_name, $arg_access);
	abstract public function registerRoleAccess     ($arg_resource_name, $arg_access, $arg_role);
	abstract public function unregisterRoleAccess   ($arg_resource_name, $arg_access, $arg_role);
	abstract public function getRegisteredRoleAccess($arg_resource_name, $arg_access);
}
?>
