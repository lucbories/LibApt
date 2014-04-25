<?php
/**
 * @file        class_abstract_session_engine.php
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
abstract class AbstractSessionEngine
{
	// ATTRIBUTES
	static public $TRACE_SESSION_ENGINE = false;
	
	protected $engine_is_started = false;
	
	
	// CONSTRUCTOR
	protected function __construct()
	{
	}
	
	// STORAGE ENGINE OPERATIONS
	abstract public function startStorageEngine();
	abstract public function unlockStorageEngine();
	abstract public function resetStorageEngine();
	abstract public function stopStorageEngine();
	
	// SESSION ID OPERATIONS
	abstract public function getId();
	abstract public function setId($arg_id);
	abstract public function getName();
	abstract public function setName($arg_name);
	abstract public function resetId($arg_delete_all = false);
	
	// SESSION ATRIBUTTES OPERATIONS
	abstract public function getAttributes();
	abstract public function hasAttribute($arg_key);
	abstract public function getAttribute($arg_key, $arg_default = null);
	abstract public function setAttribute($arg_key, $arg_value);
	abstract public function removeAttribute($arg_key);
	abstract public function serializeAttributes();
	abstract public function unserializeAttributes($arg_session_encoded);
}

?>
