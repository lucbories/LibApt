<?php
/**
 * @file        class_abstract_sql_storage.php
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
abstract class AbstractSQLStorage extends AbstractStorageImpl
{
	// STATIC ATTRIBUTES
	static public $TRACE_SQL_STORAGE		= false;
	static public $TRACE_SQL_STORAGE_RECORD	= false;
	static public $TRACE_SQL_STORAGE_QUERY	= false;
	
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_fields_set);
	}
	
	
	// SQL STORAGE ENGINE
	abstract public function executeSQL($arg_sql);
	abstract public function fetchNextRecordFromHandle($arg_datas_handle);
	abstract public function fetchNextObjectFromHandle($arg_datas_handle);
	abstract public function fetchObjectsFromHandle($arg_datas_handle);
	
	
	// ERROR OPERATIONS
	abstract public function isDuplicateError();
	abstract public function isKeyNotFoundError();
	abstract public function isAccessDeniedError();
	abstract public function isNullColumnError();
	abstract public function isUnknowColumnError();
}
?>