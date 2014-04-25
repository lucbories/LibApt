<?php
/**
 * @file        class_abstract_file_storage.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L1_STORAGE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
abstract class AbstractFileStorageImpl extends AbstractFileStorage
{
	// ATTRIBUTES
	protected $file_path_name = null;
	protected $datas_handle = null;
	protected $is_read_only = true;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set, $arg_file_path_name)
	{
		$context = get_class($this).".AbstractFileStorageImpl.__construct";
		TRACE::enter($context, "", self::$TRACE_FILE_STORAGE);
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_fields_set);
		
		// INIT
		$this->file_path_name = $arg_file_path_name;
		$this->result_init = $this->init();
		
		TRACE::finish($context, "", self::$TRACE_FILE_STORAGE);
	}
	
	
	// CHECKS
	protected function checkFileName()
	{
		return ! is_null($this->file_path_name) or $this->file_path_name == "";
	}
	
	protected function checkFileExist()
	{
		return is_file($this->file_path_name);
	}
	
	protected function checkFilePermissions()
	{
		// READ ONLY FILE
		if ( $this->is_read_only )
		{
			return is_readable($this->file_path_name);
		}
		
		// READ WRITE FILE
		return is_readable($this->file_path_name) and is_writable($this->file_path_name);
	}
	
	protected function checkFileCreationPermissions()
	{
		// READ ONLY FILE
		if ( $this->is_read_only )
		{
			return false;
		}
		
		// READ WRITE FILE
		return is_readable( dirname($this->file_path_name) ) and is_writable( dirname($this->file_path_name) );
	}
	
	
	// INIT
	public function init()
	{
		$context = get_class($this).".AbstractFileStorageImpl.init";
		TRACE::enter($context, "", self::$TRACE_FILE_STORAGE);
		
		TRACE::trace_var($context, "file_path_name", $this->file_path_name, self::$TRACE_FILE_STORAGE);
		TRACE::trace_var($context, "is_read_only", $this->is_read_only, self::$TRACE_FILE_STORAGE);
		TRACE::trace_var($context, "need_init", $this->need_init, self::$TRACE_FILE_STORAGE);
		
		$this->need_init = false;
		
		// CHECK FILE NAME
		if ( ! $this->checkFileName() )
		{
			$this->file_path_name = null;
			return TRACE::leaveko($context, "bad file name (null or empty)", false, self::$TRACE_FILE_STORAGE);
		}
		
		// CHECK IF FILE EXISTS THEN CHECK PERMISSIONS
		if ( $this->checkFileExist() )
		{
			if ( ! $this->checkFilePermissions() )
			{
				$this->file_path_name = null;
				return TRACE::leaveko($context, "bad file permissions", false, self::$TRACE_FILE_STORAGE);
			}
			return TRACE::leaveok($context, "file exists", true, self::$TRACE_FILE_STORAGE);
		}
		
		// CHECK FILE CREATION PERMISSIONS
		if ( ! $this->checkFileCreationPermissions() )
		{
			$this->file_path_name = null;
			return TRACE::leaveko($context, "bad directory permissions for creating file", false, self::$TRACE_FILE_STORAGE);
		}
		
		return TRACE::leaveok($context, "file doesn't exists but directory permissions are ok for creating file", true, self::$TRACE_FILE_STORAGE);
	}
	
	
	// FILE STORAGE ENGINE
	public function getFilePathName()
	{
		return $this->file_path_name;
	}
	
	public function isReadOnly()
	{
		return $this->is_read_only;
	}
	
	public function loadFile()
	{
		$context = get_class($this).".AbstractFileStorageImpl.init";
		TRACE::enter($context, "", self::$TRACE_FILE_STORAGE);
		
		if ( ! $this->loadFileHeaders() )
		{
			return TRACE::leaveko($context, "load file headers failed", false, self::$TRACE_FILE_STORAGE);
		}
		if ( ! $this->loadFileDatas() )
		{
			return TRACE::leaveko($context, "load file datas failed", false, self::$TRACE_FILE_STORAGE);
		}
		
		return TRACE::leaveok($context, "load file success", true, self::$TRACE_FILE_STORAGE);
	}
}

?>
