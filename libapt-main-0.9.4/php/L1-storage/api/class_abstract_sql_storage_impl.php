<?php
/**
 * @file        class_abstract_sql_storage_impl.php
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
abstract class AbstractSQLStorageImpl extends AbstractSQLStorage
{
	// STATIC ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set)
	{
		$context = get_class($this).".AbstractSQLStorageImpl.__construct";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_fields_set);
		
		// INIT
		$this->result_init = $this->init();
		
		TRACE::finish($context, "", self::$TRACE_SQL_STORAGE);
	}
	
	
	// INIT
	public function init()
	{
		$context = get_class($this).".AbstractSQLStorageImpl.init";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		
		$this->need_init = false;
		
		return TRACE::leaveok($context, "", true, self::$TRACE_SQL_STORAGE);
	}
	
	
	// CRUD
	public function hasCreate()
	{
		return true;
	}
	
	public function hasRead()
	{
		return true;
	}
	
	public function hasUpdate()
	{
		return true;
	}
	
	public function hasDelete()
	{
		return true;
	}
	
	
	public function create($arg_values, $arg_options)
	{
		$context = get_class($this).".AbstractSQLStorageImpl.create";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		TRACE::trace_var($context, "arg_values", $arg_values, self::$TRACE_SQL_STORAGE_RECORD);
		TRACE::trace_var($context, "arg_options", $arg_options, self::$TRACE_SQL_STORAGE_RECORD);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_values) )
		{
			return TRACE::leaveko($context, "values argument is null", false, self::$TRACE_SQL_STORAGE); 
		}
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko($context, "options argument is null", false, self::$TRACE_SQL_STORAGE); 
		}
		
		// GET INDEXED ARRAY OF VALUES
		$values = $arg_values;
		if (! is_array($arg_values) )
		{
			$values = array($arg_values);
		}
		
		// EXECUTE SQL QUERY
		$query = new GenericQuery($this->fields_set, AbstractQuery::$TYPE_INSERT);
		$query->setOptions($arg_options);
		$query->setValues($values);
		if ( $query->checkType("create") && $query->isValid() )
		{
			$sql = $query->getSQL();
			TRACE::addDebugMsg($context, $sql, self::$TRACE_SQL_STORAGE_QUERY);
			$result = $this->executeSQL($sql);
			return TRACE::leave($context, $result, "query result", false, self::$TRACE_SQL_STORAGE);
		}
		
		return TRACE::leaveko($context, "query isn't valid [". $query->getError() ."]", false, self::$TRACE_SQL_STORAGE);
	}
	
	public function read($arg_options)
	{
		$context = get_class($this).".AbstractSQLStorageImpl.read";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		TRACE::trace_var($context, "arg_options", $arg_options, self::$TRACE_SQL_STORAGE_RECORD);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko("MySQLStorage.read", "options argument is null", false, self::$TRACE_SQL_STORAGE); 
		}
		
		// EXECUTE SQL QUERY
		$query = new GenericQuery($this->fields_set, AbstractQuery::$TYPE_SELECT);
		$query->setOptions($arg_options);
		if ( $query->checkType("read") && $query->isValid() )
		{
			$sql = $query->getSQL();
			TRACE::addDebugMsg($context, $sql, self::$TRACE_SQL_STORAGE_QUERY);
			$result = $this->executeSQL($sql);
			return TRACE::leave($context, $result, "query result", false, self::$TRACE_SQL_STORAGE);
		}
		
		return TRACE::leaveko("MySQLStorage.read", "query isn't valid [query error]", false, self::$TRACE_SQL_STORAGE);
	}
	
	public function update($arg_values, $arg_options)
	{
		$context = get_class($this).".AbstractSQLStorageImpl.update";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		TRACE::trace_var($context, "arg_values", $arg_values, self::$TRACE_SQL_STORAGE_RECORD);
		TRACE::trace_var($context, "arg_options", $arg_options, self::$TRACE_SQL_STORAGE_RECORD);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko("MySQLStorage.update", "options argument is null", false, self::$TRACE_SQL_STORAGE); 
		}
		
		// EXECUTE SQL QUERY
		$query = new GenericQuery($this->fields_set, AbstractQuery::$TYPE_UPDATE);
		$query->setOptions($arg_options);
		if ( $query->checkType("update") && $query->isValid() )
		{
			$sql = $query->getSQL();
			TRACE::addDebugMsg($context, $sql, self::$TRACE_SQL_STORAGE_QUERY);
			$result = $this->executeSQL($sql);
			return TRACE::leave($context, $result, "query result", false, self::$TRACE_SQL_STORAGE);
		}
		
		return TRACE::leaveko("MySQLStorage.update", "query isn't valid [query error]", false, self::$TRACE_SQL_STORAGE);
	}
	
	public function delete($arg_values, $arg_options)
	{
		$context = get_class($this).".AbstractSQLStorageImpl.delete";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		TRACE::trace_var($context, "arg_values", $arg_values, self::$TRACE_SQL_STORAGE_RECORD);
		TRACE::trace_var($context, "arg_options", $arg_options, self::$TRACE_SQL_STORAGE_RECORD);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko("MySQLStorage.delete", "options argument is null", false, self::$TRACE_SQL_STORAGE); 
		}
		
		// EXECUTE SQL QUERY
		$query = new GenericQuery($this->fields_set, AbstractQuery::$TYPE_DELETE);
		$query->setOptions($arg_options);
		if ( $query->checkType("delete") && $query->isValid() )
		{
			$sql = $query->getSQL();
			TRACE::trace_var($context, "sql", $sql, self::$TRACE_SQL_STORAGE_QUERY);
			$result = $this->executeSQL($sql);
			return TRACE::leave($context, $result, "query result", false, self::$TRACE_SQL_STORAGE);
		}
		
		return TRACE::leaveko("MySQLStorage.delete", "query isn't valid [query error]", false, self::$TRACE_SQL_STORAGE);
	}
	
	public function executeQuery($arg_query)
	{
		$context = get_class($this).".AbstractSQLStorageImpl.executeQuery";
		TRACE::enter($context, "", self::$TRACE_SQL_STORAGE);
		TRACE::trace_var($context, "arg_query type", $arg_query->getType(), self::$TRACE_SQL_STORAGE);
		
		// CHECK QUERY
		if ( ! $arg_query instanceof AbstractQuery )
		{
			return TRACE::leaveko($context, "query not an instance of AbstractSQLQuery", false, self::$TRACE_SQL_STORAGE);
		}
		
		// EXECUTE SQL QUERY
		$sql = $arg_query->getSQL();
		TRACE::trace_var($context, "sql", $sql, self::$TRACE_SQL_STORAGE);
		$bool_or_datas_handle = $this->executeSQL($sql);
		if ($bool_or_datas_handle)
		{
			return TRACE::leaveok($context, "query execution is OK", $bool_or_datas_handle, self::$TRACE_SQL_STORAGE);
		}
		
		return TRACE::leaveko($context, "query execution is KO", false, self::$TRACE_SQL_STORAGE);
	}
}

?>
