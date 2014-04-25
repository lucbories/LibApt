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
abstract class AbstractFileStorage extends AbstractStorageImpl
{
	// STATIC ATTRIBUTES
	static public $TRACE_FILE_STORAGE			= false;
	static public $TRACE_FILE_STORAGE_RECORD	= false;
	
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	
	
	// FILE STORAGE ENGINE
	abstract public function getFilePathName();
	abstract public function isReadOnly();
	abstract public function loadFileHeaders();
	abstract public function loadFileDatas();
	abstract public function loadFile();
	abstract public function saveFile();
}

?>