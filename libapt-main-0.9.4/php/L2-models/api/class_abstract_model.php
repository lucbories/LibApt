<?php
/**
 * @file        class_abstract_model.php
 * @brief       Base class for all models (api)
 * @details     Provides common options and helpers
 * @see			AbstractControlledImpl Trace Type
 * @ingroup     L3_VIEWS
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractModel extends AbstractControlledImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_MODEL = false;
	
	
	/// @brief		Option : declare an array of joins between datas sets
	static public $OPTION_INNER_JOINS			= "model_inner_joins";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name		unique name of the object
	 * @return		nothing
	 */
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
		
		// OPTIONS DECLARATION
		$this->registerOption(self::$OPTION_INNER_JOINS,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
	}
	
	
	
	// ----------------- INIT MODEL -----------------
	
	/**
	 * @brief		Init the model with the given options
	 * @param[in]	arg_options		associative array of options (string key/value pairs)
	 * @return		boolean			true:init succeed, false:init failed
	 */
	abstract protected function initOptions($arg_options);
	
	
	
	// ----------------- CACHE OPERATIONS -----------------
	
	/**
	 * @brief		Test if the model has a cache engine
	 * @return		boolean
	 */
	abstract protected function hasCacheEngine();
	
	/**
	 * @brief		Get the model cache engine
	 * @return		cache engine
	 */
	abstract protected function getCacheEngine();
	
	
	
	// ----------------- FIELDS AND STORAGE OPERATIONS -----------------
	
	/**
	 * @brief		Get the model fields set
	 * @return		boolean
	 */
	abstract public function getFieldsSet();
	
	
	/**
	 * @brief		Test if the model has a storage engine
	 * @return		boolean
	 */
	abstract public function hasStorageEngine();
	
	/**
	 * @brief		Get the model storage engine
	 * @return		storage engine
	 */
	abstract public function getStorageEngine();
	
	
	
	// ----------------- CRUD OPERATIONS -----------------
	// CRUD OPERATIONS - CREATE
	abstract public function create($arg_fields, $arg_values, $arg_options);
	
	// CRUD OPERATIONS - READ
	abstract public function read($arg_fields, $arg_filters, $arg_orders, $arg_options);
	abstract public function readWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options);
	abstract public function readAll($arg_fields, $arg_orders, $arg_options);
	abstract public function readDistinct($arg_fields, $arg_filters, $arg_orders, $arg_options);
	abstract public function readDistinctForeignKeys($arg_fields, $arg_filters, $arg_orders, $arg_options);
	abstract public function readDistinctForeignKeysWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options);
	abstract public function readCount($arg_filters, $arg_options);
	abstract public function readHas($arg_filters, $arg_options);
	
	// CRUD OPERATIONS - UPDATE
	abstract public function update($arg_fields, $arg_values, $arg_filters, $arg_options);
	
	// CRUD OPERATIONS - DELETE
	abstract public function delete($arg_filters, $arg_options);
	
	
	// CURSOR OPERATIONS
	// abstract public function createCursor($arg_cursor_name);
	// abstract public function getCursor($arg_cursor_name);
	// abstract public function deleteCursor($arg_cursor_name);
	
	
	// ----------------- JOINS OPERATIONS -----------------
	// JOINS CONFIGURATION
	abstract public function hasJoins();
	abstract public function getJoins();
	abstract public function addJoinRecord($arg_join_record);
	abstract public function addJoin($arg_join_db, $arg_join_table, $arg_join_table_alias, $arg_join_column, $arg_db, $arg_table, $arg_column);
}
?>