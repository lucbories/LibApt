<?php
/**
 * @file        class_file_session_engine.php
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
final class FileSessionEngine extends AbstractSessionEngine
{
	// ATTRIBUTES
	private $engine_path = null;
	private $engine_file_name = null;
	private $engine_data = null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_path, $arg_file_name = null)
	{
		TRACE::trace_var("FileSessionEngine", "arg_path", $arg_path, self::$TRACE_SESSION_ENGINE);
		TRACE::trace_var("FileSessionEngine", "arg_file_name", $arg_file_name, self::$TRACE_SESSION_ENGINE);
		
		$this->engine_path = $arg_path;
		$this->engine_file_name = $arg_file_name;
	}
	
	protected function init()
	{
		if ( is_null($this->engine_file_name) )
		{
			$session_id = session_id();
			if ( is_null($session_id) || $session_id == "" )
			{
				TRACE::addAlertMsg("FileSessionEngine.session_id is null", $session_id, true);
				
				session_regenerate_id(false);
				$session_id = session_id();
			}
			
			TRACE::trace_var("FileSessionEngine", "session_id", $session_id, self::$TRACE_SESSION_ENGINE);
			
			$this->engine_file_name = session_id().'.session';
		}
		else
		{
			$this->engine_file_name = $arg_file_name;
			TRACE::trace_var("FileSessionEngine", "engine_file_name not null", $this->engine_file_name, self::$TRACE_SESSION_ENGINE);
		}
	}
	
	// STORAGE ENGINE OPERATIONS
	public function startStorageEngine()
	{
		TRACE::addUserMsg("FileSessionEngine", "engine starts", self::$TRACE_SESSION_ENGINE);
		
		// NOTHING TODO IF ALREADY STARTED
		if ($this->engine_is_started)
		{
			TRACE::addAlertMsg("FileSessionEngine", "engine already started", true);
			return;
		}
		
		// START THE PHP SESSION
		session_start();
		
		// SET THE SESSION PATH FILE NAME
		$this->init();
		$file_path_name = $this->engine_path.'/'.$this->engine_file_name;
		TRACE::addDebugMsg("FileSessionEngine.file", $file_path_name, self::$TRACE_SESSION_ENGINE);
		
		// LOAD THE BUFFER FROM THE EXISTING SESSIONS ATTRIBUTES
		if ( file_exists($file_path_name) )
		{
			TRACE::trace_var("FileSessionEngine", "engine_file_name exists", $this->engine_file_name, self::$TRACE_SESSION_ENGINE);
			$this->engine_data = $this->unserializeAttributes( file_get_contents($file_path_name) );
		}
		// INIT THE BUFFER
		else
		{
			TRACE::trace_var("FileSessionEngine", "engine_file_name not exists", $this->engine_file_name, self::$TRACE_SESSION_ENGINE);
			$this->engine_data = array();
		}
		
		$this->engine_is_started = true;
	}
	
	public function unlockStorageEngine()
	{
		// TODO FileSessionEngine.unlockStorageEngine()
	}
	
	public function resetStorageEngine()
	{
		TRACE::addUserMsg("FileSessionEngine", "engine reset", self::$TRACE_SESSION_ENGINE);
		$this->engine_data = array();
		$this->engine_is_started = true;
		$file_path_name = $this->engine_path.'/'.$this->engine_file_name;
		unlink($file_path_name);
	}
	
	public function stopStorageEngine()
	{
		TRACE::addUserMsg("FileSessionEngine", "engine stops", self::$TRACE_SESSION_ENGINE);
		$this->engine_data = null;
		$this->engine_is_started = false;
		$file_path_name = $this->engine_path.'/'.$this->engine_file_name;
		unlink($file_path_name);
		$_SESSION = array();
		return session_destroy();
	}
	
	
	// SESSION ID OPERATIONS
	public function getId()
	{
		if ( ! $this->engine_is_started )
		{
			return null;
		}
		
		return session_id();
	}
	
	public function setId($arg_id)
	{
		if ( ! $this->engine_is_started )
		{
			return null;
		}
		
		session_id($arg_id);
	}
	
	public function getName()
	{
		if ( ! $this->engine_is_started )
		{
			return null;
		}
		
		return session_name();
	}
	
	public function setName($arg_name)
	{
		if ( ! $this->engine_is_started )
		{
			return null;
		}
		
		session_name($arg_name);
	}
	
	public function resetId($arg_delete_all = false)
	{
		TRACE::addUserMsg("FileSessionEngine", "engine id reset");
		session_regenerate_id($arg_delete_all);
		
		if ($arg_delete_all)
		{
			$this->engine_data = array();
		}
	}
	
	
	// SESSION ATRIBUTTES OPERATIONS
	public function getAttributes()
	{
		return $this->engine_data;
	}
	
	public function hasAttribute($arg_key)
	{
		return array_key_exists($arg_key, $this->engine_data);
	}
	
	public function getAttribute($arg_key, $arg_default = null)
	{
		return array_key_exists($arg_key, $this->engine_data) ? $this->engine_data[$arg_key] : $arg_default;
	}
	
	public function setAttribute($arg_key, $arg_value)
	{
		// UPDATE THE BUFFER
		$this->engine_data[$arg_key] = $arg_value;
		
		// CREATE THE FILE DIRECTORY
		if ( ! is_dir($this->engine_path) ) {
			mkdir($this->engine_path, 0777, true);
		}
		
		// SET THE SESSION PATH FILE NAME
		$file_path_name = $this->engine_path.'/'.$this->engine_file_name;
		
		// UPDATE THE FILE
		file_put_contents($file_path_name, $this->serializeAttributes() );
	}
	
	public function removeAttribute($arg_key)
	{
		$this->setAttribute($arg_key, "");
		unset($this->engine_data[$arg_key]);
	}
	
	public function serializeAttributes()
	{
		return serialize($this->engine_data);
	}
	
	public function unserializeAttributes($arg_session_encoded)
	{
		return unserialize($arg_session_encoded);
	}
}

?>
