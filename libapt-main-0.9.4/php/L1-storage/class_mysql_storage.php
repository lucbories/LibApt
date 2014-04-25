<?php
/**
 * @file        class_mysql_storage.php
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
class MySQLStorage extends AbstractSQLStorageImpl
{
	// CONNECTION ATTRIBUTES
	protected $sgbd_connection;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set, $arg_connection_handle)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_fields_set);
		
		$this->sgbd_connection = $arg_connection_handle;
	}
	
	
	// SPECIFIC STORAGE ENGINE
	public function escape($arg_str)
	{
		return mysql_real_escape_string($arg_str, $this->sgbd_connection);
	}
	
	public function executeSQL($arg_sql)
	{
		$context = get_class($this).".MySQLStorage.executeSQL";
		
		// TODO : DB results cache
/*		if ( $this->hasCacheEngine() and $this->getCacheEngine()->contains($query) )
		{
			return $this->getCacheEngine()->fetch($query);
		}*/
		
		// DEBUG TRACE
		TRACE::addDebugMsg("MySQLStorage.executeSQL", $arg_sql, self::$TRACE_SQL_STORAGE_QUERY);
		
		// MYSQL ENGINE
		$db_resource_or_false = mysql_query($arg_sql, $this->sgbd_connection);
		
		// DEBUG TRACE
		$count_str = "";
		if (self::$TRACE_SQL_STORAGE == true)
		{
			if ( ! is_bool($db_resource_or_false) )
			{
				$count_str = "count=".mysql_num_rows($db_resource_or_false);
			}
		}
		
		// NULL RESULT : SHOULD NEVER APPEAR
		if ( is_null($db_resource_or_false) )
		{
			return TRACE::leaveko($context, "MYSQL result is null", null, self::$TRACE_SQL_STORAGE);
		}
		
		// FAILED RESULT (false)
		if ($db_resource_or_false === FALSE)
		{
			// ERROR
			$this->last_error_code = mysql_errno($this->sgbd_connection);
			$this->last_error_msg = mysql_error($this->sgbd_connection);
			
			return TRACE::leaveko($context, "MYSQL result is failed[$count_str]", null, self::$TRACE_SQL_STORAGE);
		}
		
		// SUCCESS RESULT (true or records)
		return TRACE::leaveok($context, "MYSQL result is OK[$count_str]", $db_resource_or_false, self::$TRACE_SQL_STORAGE);
	}
	
	
	public function getDatasHandle()
	{
		return $this->sgbd_connection;
	}
	
	
	public function countDatasFromHandle($arg_datas_handle)
	{
		return mysql_num_rows($arg_datas_handle);
	}
	
	public function freeDatasFromHandle($arg_datas_handle)
	{
		mysql_free_result($arg_datas_handle);
	}
	
	public function fetchRecordsFromHandle($arg_datas_handle)
	{
		if ( is_null($arg_datas_handle) )
		{
			return null;
		}
		if ( $this->countDatasFromHandle($arg_datas_handle) == 0 )
		{
			return array();
		}
		
		$results_array = array();
		while ($record = $this->fetchNextRecordFromHandle($arg_datas_handle))
		{
			$results_array[] = $record;
		}
		return $results_array;
	}
	
	public function fetchRecordAtFromHandle($arg_datas_handle, $arg_index = -1)
	{
		// TODO : CsvStorage.fetchRecord
	}
	
	
	public function fetchNextRecordFromHandle($arg_datas_handle)
	{
		$result = mysql_fetch_assoc($arg_datas_handle);
		TRACE::trace_var("MySQLStorage.fetchNextRecordFromHandle", "mysql_fetch_assoc", $result, self::$TRACE_SQL_STORAGE);
		return $result;
	}
	
	public function fetchNextObjectFromHandle($arg_datas_handle)
	{
		return mysql_fetch_object($arg_datas_handle);
	}
	
	public function fetchObjectsFromHandle($arg_datas_handle)
	{
		if ( is_null($arg_datas_handle) )
		{
			return null;
		}
		if ( $this->countDatasFromHandle($arg_datas_handle) == 0 )
		{
			return array();
		}
		
		$results_array = array();
		while ($record = $this->fetchNextObjectFromHandle($arg_datas_handle))
		{
			$results_array[] = $record;
		}
		return $results_array;
	}
	
	
	// ERROR OPERATIONS
	public function isDuplicateError()
	{
		return $this->getLastErrorCode() == 1022 or $this->getLastErrorCode() == 1060 or $this->getLastErrorCode() == 1061 or $this->getLastErrorCode() == 1062;
	}
	
	public function isKeyNotFoundError()
	{
		return $this->getLastErrorCode() == 1032;
	}
	
	public function isAccessDeniedError()
	{
		return $this->getLastErrorCode() == 1044;
	}
	
	public function isNullColumnError()
	{
		return $this->getLastErrorCode() == 1048;
	}
	
	public function isUnknowColumnError()
	{
		return $this->getLastErrorCode() == 1054;
	}
}
?>