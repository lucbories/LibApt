<?php
/**
 * @version		$Id: class_abstract_model_impl.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L2-model
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractModelImpl extends AbstractModel
{
	// ATTRIBUTES
	private $cache_engine;     // AbstractCache child class
	protected $fields_set;     // FieldsSet class
	protected $storage_engine; // AbstractStorage child class
	
	protected $joins = array();
	
	protected $is_cached = false;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name, $arg_storage_engine = null, $arg_cache_engine = null, $arg_options = null)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
		
		// CACHE ENGINE INIT
		if ( ! is_null($arg_cache_engine) )
		{
			if ($arg_cache_engine instanceof AbstractCache)
			{
				$this->cache_engine = $arg_cache_engine;
			} else {
				TRACE::addErrorMsg("AbstractModel::constructor", "bad cache engine class [".get_class($arg_cache_engine)."]", true);
			}
		}
		
		// FIELDS SET INIT
		$this->fields_set = new FieldsSet($arg_unique_name);
		
		// STORAGE ENGINE
		if ( ! is_null($arg_storage_engine) )
		{
			if ($arg_storage_engine instanceof AbstractStorage)
			{
				$this->storage_engine = $arg_storage_engine;
			} else {
				TRACE::addErrorMsg("AbstractModel::constructor", "bad storage engine class [".get_class($arg_storage_engine)."]", true);
			}
		} else {
//			TRACE::addErrorMsg("AbstractModel::constructor", "null storage engine");
		}
		
		// CURSORS ARRAY INIT
		// $this->cursors = array();
		
		$this->initOptions($arg_options);
	}
	
	
	
	// ----------------- INIT MODEL -----------------
	
	/**
	 * @brief		Init the model with the given options
	 * @param[in]	arg_options		associative array of options (string key/value pairs)
	 * @return		boolean			true:init succeed, false:init failed
	 */
	protected function initOptions($arg_options)
	{
		// NOTHING TO DO HERE
	}
	
	
	
	// ----------------- CACHE OPERATIONS -----------------
	
	/**
	 * @brief		Test if the model has a cache engine
	 * @return		boolean
	 */
	protected function hasCacheEngine()
	{
		return ! is_null($this->cache_engine);
	}
	
	/**
	 * @brief		Get the model cache engine
	 * @return		cache engine
	 */
	protected function getCacheEngine()
	{
		return $this->cache_engine;
	}
	
	/**
	 * @brief		Get the model cached flag
	 * @return		boolean
	 */
	public function getIsCached()
	{
		return $this->is_cached;
	}
	
	/**
	 * @brief		Set the model cached flag
	 * @param[in]	arg_is_cached	Cached flag
	 * @return		nothing
	 */
	public function setIsCached($arg_is_cached)
	{
		$this->is_cached = $arg_is_cached;
	}
	
	
	
	// ----------------- FIELDS AND STORAGE OPERATIONS -----------------
	
	/**
	 * @brief		Get the model fields set
	 * @return		boolean
	 */
	public function getFieldsSet()
	{
		return $this->fields_set;
	}
	
	
	/**
	 * @brief		Test if the model has a storage engine
	 * @return		boolean
	 */
	public function hasStorageEngine()
	{
		return ! is_null($this->storage_engine);
	}
	
	/**
	 * @brief		Get the model storage engine
	 * @return		storage engine
	 */
	public function getStorageEngine()
	{
		return $this->storage_engine;
	}
	
	
	
	// ----------------- JOINS OPERATIONS -----------------
	
	// JOINS CONFIGURATION
	public function hasJoins()
	{
		$context = "AbstractModelImpl.hasJoins()[".$this->getName()."]";
		TRACE::trace_var($context, "joins.count", count($this->joins), self::$TRACE_MODEL);
		return count($this->joins) > 0;
	}
	
	public function getJoins()
	{
		return $this->joins;
	}
	
	public function addJoinRecord($arg_join_record)
	{
		$context = "AbstractModelImpl.addJoinRecord(record)[".$this->getName()."]";
		
		TRACE::trace_var($context, "arg_join_record", $arg_join_record, self::$TRACE_MODEL);
		
		CONTRACT::assertFalse($context.".not yet implemented", true);
		
		return false;
	}
	
	public function addJoin($arg_join_db, $arg_join_table, $arg_join_table_alias, $arg_join_column, $arg_db, $arg_table, $arg_column)
	{
		$context = "AbstractModelImpl.addJoin(...)[".$this->getName()."]";
		
		TRACE::trace_var($context, "arg_join_db", $arg_join_db, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_join_table", $arg_join_table, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_join_table_alias", $arg_join_table_alias, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_join_column", $arg_join_column, self::$TRACE_MODEL);
		
		TRACE::trace_var($context, "arg_db", $arg_db, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_table", $arg_table, self::$TRACE_MODEL);
		TRACE::trace_var($context, "arg_column", $arg_column, self::$TRACE_MODEL);
		
		CONTRACT::assertFalse($context.".not yet implemented", true);
		
		return false;
	}
}
?>