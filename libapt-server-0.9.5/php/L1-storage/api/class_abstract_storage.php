<?php
/**
 * @file        class_abstract_storage.php
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
abstract class AbstractStorage extends Named
{
	// STATIC ATTRIBUTES
	static public $TRACE_STORAGE		= true;
	static public $TRACE_STORAGE_RECORD	= false;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
	}
	
	
	// INIT
	abstract public function init();
	abstract public function isReady();
	
	
	// GENERIC DATAS STORAGE
	abstract public function escape($arg_str);
	
	abstract public function getDatasHandle();
	
	abstract public function checkDatasRecord($arg_datas_record);
	abstract public function getRecordFromDatas($arg_datas_record);
	
	abstract public function countDatasFromHandle($arg_datas_handle);
	abstract public function freeDatasFromHandle($arg_datas_handle);
	abstract public function fetchRecordsFromHandle($arg_datas_handle);
	abstract public function fetchRecordAtFromHandle($arg_datas_handle, $arg_index = -1);
	
	abstract public function countDatas();
	abstract public function freeDatas();
	abstract public function fetchRecords();
	abstract public function fetchRecordAt($arg_index = -1);
	
	
	// GENERIC STORAGE QUERY
	abstract public function executeQuery($arg_query);
	
	
	// CRUD OPERATIONS
	abstract public function hasCreate();
	abstract public function hasRead();
	abstract public function hasUpdate();
	abstract public function hasDelete();
	
	abstract public function create($arg_values, $arg_options);
	abstract public function read($arg_options);
	abstract public function update($arg_values, $arg_options);
	abstract public function delete($arg_values, $arg_options);
	
	
	// ERROR OPERATIONS
	abstract public function getLastErrorCode();
	abstract public function getLastErrorMsg();
}
?>