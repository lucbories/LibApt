<?php
/**
 * @version		$Id: class_abstract_sql_model.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L2-models/api
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractSQLModel extends AbstractDBModel
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
	abstract public function registerQuery($arg_query_name, $arg_query_type, $arg_fields = null);
	abstract public function createQuery($arg_query_type, $arg_fields = null);
	abstract public function prepareQuery($arg_query_name, $arg_sql);
	abstract public function getQuery($arg_query_name);
	abstract public function deleteQuery($arg_query_name);
	abstract public function executeQuery($arg_query);
	

	
	// CRUD OPERATIONS - CREATE
//	abstract public function create($arg_fields, $arg_values, $arg_options);
	
	// CRUD OPERATIONS - READ
//	protected function fetchSqlResults($arg_orders, $arg_filters, $arg_slice_offset, $arg_slice_length);
//	abstract public function readWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options);
//	public function read($arg_fields, $arg_filters, $arg_orders, $arg_options);
//	public function readRecords($arg_fields, $arg_filters, $arg_orders, $arg_options);
//	public function readAll($arg_fields, $arg_orders, $arg_options);
	abstract public function readAllWithSlice($arg_fields, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options);
//	public function readAllRecords($arg_fields, $arg_orders, $arg_options);
//	public function readDistinct($arg_fields, $arg_filters, $arg_orders, $arg_options);
	abstract public function readDistinctWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options);
//	public function readCount($arg_filters, $arg_options);
//	public function readHas($arg_filters, $arg_options);
	
	// CRUD OPERATIONS - UPDATE
//	abstract public function update($arg_fields, $arg_values, $arg_filters, $arg_options);
	
	// CRUD OPERATIONS - DELETE
//	abstract public function delete($arg_filters, $arg_options);
	
	
	// CURSOR OPERATIONS
//	public function createCursor($arg_cursor_name);
//	public function getCursor($arg_cursor_name);
//	public function deleteCursor($arg_cursor_name);
	
	
	// ACCES AUX DONNEES SANS CURSEUR
	abstract public function hasRecordWithPK($arg_field_primary_key_value);
	abstract public function hasRecordWithField($arg_field_name, $arg_field_value);
	abstract public function hasRecordWithFields($arg_field_names, $arg_field_values);
	abstract public function fetchDistinctValuesForField($arg_field_name, $arg_orders, $arg_filters, $arg_slice_offset, $arg_slice_length);
	
	// ACCES AUX DONNEES : CREATION, MODIFICATION, SUPPRESSION
	abstract public function createItem($arg_fields_values);
	abstract public function deleteItemById($arg_id);
}
?>
