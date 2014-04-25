<?php
/**
 * @file        class_mysqli_storage.php
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
class MySQLiStorage extends AbstractSQLStorageImpl
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
		return mysqli_real_escape_string($this->sgbd_connection, $arg_str);
	}
	
	public function executeSQL($arg_sql)
	{
		// TODO : DB results cache
/*		if ( $this->hasCacheEngine() and $this->getCacheEngine()->contains($query) )
		{
			return $this->getCacheEngine()->fetch($query);
		}*/
		
		// DEBUG TRACE
		if (self::$TRACE_SQL_STORAGE == true)
		{
			TRACE::addDebugMsg("MySQLiStorage.executeSQL", $arg_sql);
		}
		
		// MYSQL ENGINE
		$result = mysqli_query($this->sgbd_connection, $arg_sql);
		
		// DEBUG TRACE
		if (self::$TRACE_SQL_STORAGE == true)
		{
			if (is_null($result))
			{
				TRACE::addDebugMsg("MySQLiStorage.executeSQL", "MYSQL result is null");
			}
			if ( is_bool($result) )
			{
				if ($result)
				{
					TRACE::addDebugMsg("MySQLiStorage.executeSQL", "result OK");
				}
				else
				{
					TRACE::addDebugMsg("MySQLiStorage.executeSQL", "result KO");
				}
			}
			else
			{
				TRACE::addDebugMsg("MySQLiStorage.executeSQL", "results set is OK");
			}
		}
		
		return $result;
	}
	
	
	public function getDatasHandle()
	{
		return null;
	}
	
	public function countDatasFromHandle($arg_datas_handle)
	{
		return mysqli_num_rows($arg_datas_handle);
	}
	
	public function freeDatasFromHandle($arg_datas_handle)
	{
		mysqli_free_result($arg_datas_handle);
	}
	
	public function fetchNextRecordFromHandle($arg_datas_handle)
	{
		return mysqli_fetch_assoc($arg_datas_handle);
	}
	
	public function fetchNextObjectFromHandle($arg_datas_handle)
	{
		return mysqli_fetch_object($arg_datas_handle);
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
		return $this->fetchNextRecordFromHandle($arg_datas_handle);
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