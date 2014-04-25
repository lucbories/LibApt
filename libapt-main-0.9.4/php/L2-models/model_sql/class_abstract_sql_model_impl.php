<?php
/**
 * @version		$Id: class_abstract_sql_model_impl.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L2-models
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractSQLModelImpl extends AbstractSQLModel
{
	// ATTRIBUTES
	protected $queries;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_connection_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_connection_name);
		
		$this->queries = array();
	}
	
	
	// SQL QUERY
	public function registerQuery($arg_query_name, $arg_query_type, $arg_fields = null)
	{
		$query = $this->createQuery($arg_query_type, $arg_fields);
		$this->queries[$arg_query_name] = $query;
		return $query;
	}
	
	public function createQuery($arg_query_type, $arg_fields = null)
	{
		$query = new GenericQuery($this->getFieldsSet(), $arg_query_type);
		$query->setCrudTable($this->getDatabaseName(), $this->getCrudTable());
		$query->setFields($arg_fields);
		$query->setJoins($this->getJoins());
		return $query;
	}
	
	public function prepareQuery($arg_query_name, $arg_sql)
	{
		// TODO
		return null;
	}
	
	public function getQuery($arg_query_name)
	{
		return $this->queries[$arg_query_name];
	}
	
	public function deleteQuery($arg_query_name)
	{
		unset( $this->queries[$arg_query_name] );
	}
	
	public function executeQuery($arg_query)
	{
		$context = get_class($this).".AbstractSQLModelImpl.executeQuery()[".$this->getName()."]";
		
		if ( $arg_query->isValid() )
		{
			$bool_or_handle_result = $this->getStorageEngine()->executeQuery($arg_query);
			
			if ( $bool_or_handle_result )
			{
				return TRACE::leaveok($context, "query result is OK", $bool_or_handle_result, self::$TRACE_MODEL);
			}
			
			return TRACE::leaveko($context, "query result is KO", $bool_or_handle_result, self::$TRACE_MODEL);
		}
		return TRACE::leaveko($context, "query not valid [". $query->getError() ."]", null, self::$TRACE_MODEL);
	}
	

	
	// CRUD OPERATIONS - CREATE
	public function create($arg_fields, $arg_values, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.create()[".$this->getName()."]";
		
		// TRACE::trace_var($context, "arg_fields", $arg_fields, self::$TRACE_MODEL);
		// TRACE::trace_var($context, "arg_values", $arg_values, self::$TRACE_MODEL);
		// TRACE::trace_var($context, "arg_options", $arg_options, self::$TRACE_MODEL);
		
		$query = $this->createQuery(AbstractQuery::$TYPE_INSERT, $arg_fields);
		$query->setValues($arg_values);
		$query->setOptions($arg_options);
		
		// $buffer = $query->dump();
		// TRACE::trace_var($context, "query", $buffer, self::$TRACE_MODEL);
		
		return $this->getStorageEngine()->executeQuery($query);
	}
	
	
	// CRUD OPERATIONS - READ
	public function read($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.read()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT, $arg_fields);
		$query->setFilters($arg_filters);
		$query->setOrders($arg_orders);
		$query->setOptions($arg_options);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( ! $datas_handle || is_null($datas_handle) )
		{
			// DUMP QUERY
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			// DUMP QUERY
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readWithSlice()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT, $arg_fields);
		$query->setFilters($arg_filters);
		$query->setOrders($arg_orders);
		$query->setSlice($arg_slice_offset, $arg_slice_length);
		$query->setOptions($arg_options);
		
		// DUMP QUERY
		$str = $query->dump();
		TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		TRACE::trace_var($context, "datas_handle is null ?", is_null($datas_handle), self::$TRACE_MODEL);
		if ( is_null($datas_handle) || is_bool($datas_handle) )
		{
			// DUMP QUERY
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		
		TRACE::trace_var($context, "datas_records", $datas_records, self::$TRACE_MODEL);
		TRACE::trace_var($context, "datas_records.is_array", is_array($datas_records), self::$TRACE_MODEL);
		TRACE::trace_var($context, "datas_records.is_bool", is_bool($datas_records), self::$TRACE_MODEL);
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readAll($arg_fields, $arg_orders, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readAll()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT, $arg_fields);
		$query->setOrders($arg_orders);
		$query->setOptions($arg_options);
		
		// DUMP QUERY
		$str = $query->dump();
		TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readAllWithSlice($arg_fields, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readAllWithSlice()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT, $arg_fields);
		$query->setOrders($arg_orders);
		$query->setSlice($arg_slice_offset, $arg_slice_length);
		$query->setOptions($arg_options);
		
		// DUMP QUERY
		$str = $query->dump();
		TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readDistinct($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readDistinct()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_DISTINCT, $arg_fields);
		$query->setFilters($arg_filters);
		$query->setOrders($arg_orders);
		$query->setOptions($arg_options);
		
		// DUMP QUERY
		$str = $query->dump();
		TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readDistinctOne($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readDistinctOne()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_DISTINCT_ONE, $arg_fields);
		$query->setFilters($arg_filters);
		$query->setOrders($arg_orders);
		$query->setOptions($arg_options);
		
		// DUMP QUERY
		$str = $query->dump();
		TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readDistinctOneWithSlice($arg_one_field, $arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readDistinctWithSlice()[".$this->getName()."]";
		
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_DISTINCT_ONE, $arg_fields);
		$query->setFilters($arg_filters);
		$query->setOrders($arg_orders);
		$query->setSlice($arg_slice_offset, $arg_slice_length);
		$query->setOptions($arg_options);
		$query->setOneField($arg_one_field);
		
		// CHECK QUERY
		if ( ! $query->isValid() )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "Query is not valid", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readDistinctForeignKeys($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readDistinctForeignKeys()[".$this->getName()."]";
		
		// TODO : extract slice from options
		$arg_groups		= null;
		$slice_offset	= null;
		$slice_length	= null;
		
		$sql = SQLBuilder::getSelectDistinctField($arg_fields, $arg_filters, $arg_orders, $arg_groups, $slice_offset, $slice_length, true);
		TRACE::trace_var($context, "sql", $sql, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeSQL($sql);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readDistinctForeignKeysWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readDistinctForeignKeysWithSlice()[".$this->getName()."]";
		
		// TODO Groups
		$arg_groups = null;
		
		$sql = SQLBuilder::getSelectDistinctField($arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, true);
		TRACE::trace_var($context, "sql", $sql, self::$TRACE_MODEL);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeSQL($sql);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readDistinctWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readDistinctWithSlice()[".$this->getName()."]";
		
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_DISTINCT, $arg_fields);
		$query->setFilters($arg_filters);
		$query->setOrders($arg_orders);
		$query->setSlice($arg_slice_offset, $arg_slice_length);
		$query->setOptions($arg_options);
		
		// CHECK QUERY
		if ( ! $query->isValid() )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "Query is not valid", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "datas records are OK", $datas_records, self::$TRACE_MODEL);
	}
	
	public function readCount($arg_filters, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.readCount()[".$this->getName()."]";
		
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_COUNT);
		$query->setFilters($arg_filters);
		$query->setOptions($arg_options);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( is_null($datas_handle) or is_bool($datas_handle) )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "datas handle is null", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		return TRACE::leaveok($context, "datas records are OK", $datas_records[0], self::$TRACE_MODEL);
	}
	
	public function readHas($arg_filters, $arg_options)
	{
		$count = $this->readCount($arg_filters, $arg_options);
		return $count > 0;
	}
	
	
	// CRUD OPERATIONS - UPDATE
	public function update($arg_fields, $arg_values, $arg_filters, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.update()[".$this->getName()."]";
		
		$query = $this->createQuery(AbstractQuery::$TYPE_UPDATE, $arg_fields);
		$query->setValues($arg_values);
		$query->setFilters($arg_filters);
		$query->setOptions($arg_options);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( ! $datas_handle )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str);
			return TRACE::leaveko($context, "update failed", false, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "update success", true, self::$TRACE_MODEL);
	}
	
	// CRUD OPERATIONS - DELETE
	public function delete($arg_filters, $arg_options)
	{
		$context = get_class($this).".AbstractSQLModelImpl.delete()[".$this->getName()."]";
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_DELETE);
		$fields = $this->getFieldsSet()->getFields();
		$query->setFields($fields);
		$query->setFilters($arg_filters);
		$query->setOptions($arg_options);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( ! $datas_handle )
		{
			$str = $query->dump();
			TRACE::trace_var($context, "query", $str, self::$TRACE_MODEL);
			return TRACE::leaveko($context, "delete failed", false, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "delete success", true, self::$TRACE_MODEL);
	}
	
	
	
	
	// ACCES AUX DONNEES SANS CURSEUR
	public function hasRecordWithPK($arg_field_primary_key_value)
	{
		$context = get_class($this).".AbstractSQLModelImpl.hasRecordWithPK()[".$this->getName()."]";
		
		// CHECK IF A PRIMARY KEY FIELD EXISTS
		$primary_key_field_name = $this->getFieldsSet()->getPrimaryKeyFieldName();
		if ( is_null($primary_key_field_name) )
		{
			return TRACE::leaveko($context, "no primary key found", false, self::$TRACE_MODEL);
		}
		
		$result = $this->hasRecordWithField($primary_key_field_name, $arg_field_primary_key_value);
		return TRACE::leaveok($context, "primary key found", $result, self::$TRACE_MODEL);
	}
	
	public function hasRecordWithField($arg_field_name, $arg_field_value)
	{
		$context = get_class($this).".AbstractSQLModelImpl.hasRecordWithField()[".$this->getName()."]";
		
		// CHECK IF THE GIVEN FIELD EXISTS
		if ( ! $this->getFieldsSet()->hasField($arg_field_name) )
		{
			return TRACE::leaveko($context, "no field found", false, self::$TRACE_MODEL);
		}
		
		// CREATE QUERY
		$fields = array( $this->getFieldsSet()->getField($arg_field_name) );
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_COUNT, $fields);
		$values = array( $arg_field_value );
		$query->setValues($values);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( ! $datas_handle )
		{
			return TRACE::leaveko($context, "count failed", false, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", false, self::$TRACE_MODEL);
		}
		
		$datas_count = $datas_records[0];
		return TRACE::leaveok($context, "datas records are OK", ($datas_count > 0), self::$TRACE_MODEL );
	}
	
	public function hasRecordWithFields($arg_field_names, $arg_field_values)
	{
		$context = get_class($this).".AbstractSQLModelImpl.hasRecordWithFields()[".$this->getName()."]";
//		TRACE::trace_var($context, "arg_field_names", $arg_field_names);
//		TRACE::trace_var($context, "arg_field_values", $arg_field_values);
		
		// CHECK IF THE GIVEN FIELDS EXIST
		if ( ! $this->getFieldsSet()->hasFields($arg_field_names) )
		{
			return TRACE::leaveko($context, "no fields found", false, self::$TRACE_MODEL);
		}
		
		// CREATE QUERY
		$fields = $this->getFieldsSet()->getFields($arg_field_names);
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT_COUNT, $fields);
		$query->addValuesFilter($arg_field_names, $arg_field_values);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( ! $datas_handle )
		{
			return TRACE::leaveko($context, "count failed", false, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", false, self::$TRACE_MODEL);
		}
		$datas_count = $datas_records[0]["count"];
//		TRACE::trace_var("records", $datas_records, 2);
//		TRACE::trace_var($context, "datas_count", $datas_count);
		return TRACE::leaveok($context, "datas records are OK", ($datas_count > 0), self::$TRACE_MODEL );
	}
	
	public function fetchDistinctValuesForField($arg_field_name, $arg_orders, $arg_filters, $arg_slice_offset, $arg_slice_length)
	{
		$context = get_class($this).".AbstractSQLModelImpl.fetchDistinctValuesForField()[".$this->getName()."]";
		
		// TRACE::trace_var($context, "arg_field_name", $arg_field_name, self::$TRACE_MODEL);
		$fields = array( $this->getFieldsSet()->getField($arg_field_name) );
		// TRACE::trace_var($context, "count(fields)", count($fields), self::$TRACE_MODEL);
		
		$datas_records = $this->readDistinctForeignKeysWithSlice($fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, null);
		
		if ( ! $datas_records )
		{
			return TRACE::leaveko($context, "select failed", null, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "select success", $datas_records, self::$TRACE_MODEL);
	}
	
	
	public function fetchRecordWithField($arg_field_name, $arg_field_value)
	{
		$context = get_class($this).".AbstractSQLModelImpl.fetchRecordWithField()[".$this->getName()."]";
		TRACE::trace_var($context, "arg_field_name", $arg_field_name, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_field_value", $arg_field_value, self::$TRACE_MODEL);
		
		// CHECK IF THE GIVEN FIELD EXISTS
		if ( ! $this->getFieldsSet()->hasField($arg_field_name) )
		{
			return TRACE::leaveko($context, "no field found", null, self::$TRACE_MODEL);
		}
		
		// CREATE QUERY
		$query = $this->createQuery(AbstractQuery::$TYPE_SELECT);
		$fields = $this->getFieldsSet()->getFields();
		$query->setFields($fields);
		$query->addValueFilter($arg_field_name, $arg_field_value);
		
		// GET DATAS HANDLE
		$datas_handle = $this->getStorageEngine()->executeQuery($query);
		if ( ! $datas_handle )
		{
			return TRACE::leaveko($context, "select failed", null, self::$TRACE_MODEL);
		}
		
		// GET DATAS RECORDS
		$datas_records = $this->getStorageEngine()->fetchRecordsFromHandle($datas_handle);
		$this->getStorageEngine()->freeDatasFromHandle($datas_handle);
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "datas records are null", null, self::$TRACE_MODEL);
		}
		
		// CHECK RECORDS COUNT
		if ( count($datas_records) <= 0 )
		{
			return TRACE::leaveko($context, "no record found", null, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveok($context, "datas records are OK", $datas_records[0], self::$TRACE_MODEL );
	}
	
	
	// ACCES AUX DONNEES : CREATION, MODIFICATION, SUPPRESSION
	public function createItem($arg_fields_values)
	{
		$context = "AbstractSQLModelImpl.createItem()[".$this->getName()."]";
		
		$fields_names = array_keys($arg_fields_values);
		$fields = $this->getFieldsSet()->getFields($fields_names);
		$fields_values = array();
		foreach($fields as $field_name=>$field)
		{
			$fields_values[] = $arg_fields_values[$field_name];
		}
		// TRACE::trace_var($context, "fields_names", $fields_names, self::$TRACE_MODEL);
		// TRACE::trace_var($context, "fields_values", $fields_values, self::$TRACE_MODEL);
		
		return $this->create($fields, $fields_values, null);
	}
	
	public function deleteItemById($arg_id)
	{
		$context = "AbstractSQLModelImpl.deleteItemById()[".$this->getName()."]";
		
		// CREATE FILTERS ARGUMENT
		$pk_field = $this->getFieldsSet()->getPrimaryKeyField();	
		$filter = new Filter("", "", $pk_field->getName(), $pk_field->getType(), null, "equals", $arg_id, null);
		$filters=array( $filter);
		TRACE::trace_var($context, "pk_field.name", $pk_field->getName(), self::$TRACE_MODEL);
		
		// CREATE OPTIONS ARGUMENT
		$options = null;
		
		return $this->delete($filters, $options);
	}
	
	
	
	// ----------------- JOINS OPERATIONS -----------------
	
	public function addJoinRecord($arg_join_record)
	{
		$context = "AbstractSQLModelImpl.addJoinRecord(record)[".$this->getName()."]";
		
		TRACE::trace_var($context, "arg_join_record", $arg_join_record, self::$TRACE_MODEL);
		
		// REQUIRED JOIN ATTRIBUTES
		CONTRACT::assertArrayHasKey($context.".join_table", $arg_join_record, "join_table");
		CONTRACT::assertArrayHasKey($context.".join_column", $arg_join_record, "join_column");
		CONTRACT::assertArrayHasKey($context.".db", $arg_join_record, "db");
		CONTRACT::assertArrayHasKey($context.".table", $arg_join_record, "table");
		
		// OPTIONAL JOIN ATTRIBUTES
		if ( ! array_key_exists("join_db", $arg_join_record) )
		{
			TRACE::step($context, "set default join_db", self::$TRACE_MODEL);
			$arg_join_record["join_db"] = $this->getDatabaseName();
		}
		if ( ! array_key_exists("join_table_alias", $arg_join_record) )
		{
			TRACE::step($context, "set default join_table_alias", self::$TRACE_MODEL);
			$arg_join_record["join_table_alias"] = $arg_join_record["join_table"];
		}
		if ( ! array_key_exists("db", $arg_join_record) )
		{
			TRACE::step($context, "set default db", self::$TRACE_MODEL);
			$arg_join_record["db"] = $this->getDatabaseName();
		}
		
		$this->joins[] = $arg_join_record;
		
		return true;
	}
	
	public function addJoin($arg_join_db, $arg_join_table, $arg_join_table_alias, $arg_join_column, $arg_db, $arg_table, $arg_column)
	{
		$context = "AbstractSQLModelImpl.addJoin(...)[".$this->getName()."]";
		
		TRACE::trace_var($context, "arg_join_db", $arg_join_db, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_join_table", $arg_join_table, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_join_table_alias", $arg_join_table_alias, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_join_column", $arg_join_column, self::$TRACE_MODEL);
		
		TRACE::trace_var($context, "arg_db", $arg_db, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_table", $arg_table, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_column", $arg_column, self::$TRACE_MODEL);
		
		CONTRACT::assertNotEmptyString($context.".arg_join_db", $arg_join_db);
		CONTRACT::assertNotEmptyString($context.".arg_join_table", $arg_join_table);
		CONTRACT::assertNotEmptyString($context.".arg_join_table_alias", $arg_join_table_alias);
		CONTRACT::assertNotEmptyString($context.".arg_join_column", $arg_join_column);
		
		CONTRACT::assertNotEmptyString($context.".arg_db", $arg_db);
		CONTRACT::assertNotEmptyString($context.".arg_table", $arg_table);
		CONTRACT::assertNotEmptyString($context.".arg_column", $arg_column);
		
		$this->joins[] = array(
			"join_db" => $arg_join_db,
			"join_table" => $arg_join_table,
			"join_table_alias" => $arg_join_table_alias,
			"join_column" => $arg_join_column,
			
			"db" => $arg_db,
			"table" => $arg_table,
			"column" => $arg_column
			);
		
		return true;
	}
}
?>