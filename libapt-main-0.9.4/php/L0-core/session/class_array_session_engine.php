<?php
/**
 * @file        class_array_session_engine.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class ArraySessionEngine extends AbstractSessionEngine
{
	// STATIC ATTRIBUTES
	
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	// STORAGE ENGINE OPERATIONS
	public function startStorageEngine()
	{
		TRACE::addInfoMsg("ArraySessionEngine", "engine starts", self::$TRACE_SESSION_ENGINE);
		
		$this->engine_is_started = session_start();
		return $this->engine_is_started;
	}
	
	public function resetStorageEngine()
	{
		TRACE::addInfoMsg("ArraySessionEngine", "engine resets", self::$TRACE_SESSION_ENGINE);
	}
	
	public function unlockStorageEngine()
	{
		session_write_close();
	}
	
	public function stopStorageEngine()
	{
		TRACE::addInfoMsg("ArraySessionEngine", "engine stops", self::$TRACE_SESSION_ENGINE);
		
		$this->engine_is_started = false;
		session_destroy();
		$_SESSION = array();
	}
	
	
	// SESSION ID OPERATIONS
	public function getId()
	{
		return session_id();
	}
	
	public function setId($arg_id)
	{
		session_id($arg_id);
	}
	
	public function getName()
	{
		return session_name();
	}
	
	public function setName($arg_name)
	{
		session_id($arg_name);
	}
	
	public function resetId($arg_delete_all = false)
	{
		TRACE::addInfoMsg("ArraySessionEngine", "engine id reset", self::$TRACE_SESSION_ENGINE);
		session_regenerate_id($arg_delete_all);
	}
	
	
	// SESSION ATRIBUTES OPERATIONS
	public function getAttributes()
	{
		return $_SESSION;
	}
	
	public function hasAttribute($arg_key)
	{
		return array_key_exists($arg_key, $_SESSION);
	}
	
	public function getAttribute($arg_key, $arg_default = null)
	{
		return array_key_exists($arg_key, $_SESSION) ? $_SESSION[$arg_key] : $arg_default;
	}
	
	public function setAttribute($arg_key, $arg_value)
	{
		$_SESSION[$arg_key] = $arg_value;
	}
	
	public function removeAttribute($arg_key)
	{
		unset($_SESSION[$arg_key]);
	}
	
	public function serializeAttributes()
	{
		return session_encode();
	}
	
	public function unserializeAttributes($arg_session_encoded)
	{
		return session_decode($arg_session_encoded);
	}
}

?>
