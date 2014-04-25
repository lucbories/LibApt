<?php
/**
 * @file        class_abstract_storage_impl.php
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
abstract class AbstractStorageImpl extends AbstractStorage
{
	// STATIC ATTRIBUTES
	
	// ATTRIBUTES
	protected $need_init = true;
	protected $result_init = false;
	protected $fields_set = null;
	
	protected $last_error_code = null;
	protected $last_error_msg = null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set)
	{
		$context = get_class($this).".AbstractStorageImpl.__construct";
		TRACE::enter($context, "", self::$TRACE_STORAGE);
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_fields_set);
		
		// INIT
		$this->fields_set = $arg_fields_set;
		
		TRACE::finish($context, "", self::$TRACE_STORAGE);
	}
	
	
	// CHECKS ARRAY
	protected function checkArray($arg_datas_record)
	{
		return is_array($arg_datas_record);
	}
	
	public function checkDatasRecord($arg_datas_record)
	{
		$context = get_class($this).".AbstractStorageImpl.checkDatasRecord";
		TRACE::enter($context, "", self::$TRACE_STORAGE);
		TRACE::trace_var($context, "arg_datas_record", $arg_datas_record, self::$TRACE_STORAGE_RECORD);
		
		// GET FIELDS COUNT
		$fields_count = $this->fields_set->getFieldsCount();
		
		// RECORD IS NOT AN ARRAY
		if ( ! is_array($arg_datas_record) )
		{
			return TRACE::leaveko($context, "Bad record : not an array for fields count=[$fields_count]", false, self::$TRACE_STORAGE);
		}
		
		// RECORD IS AN ARRAY BUT HAS BAD VALUES COUNT
		if ( $fields_count != count($arg_datas_record) )
		{
			$values_count = count($arg_datas_record);
			return TRACE::leaveko($context, "Bad fields/values count : [$fields_count]/[$values_count]", false, self::$TRACE_STORAGE);
		}
		
		return TRACE::leaveok($context, "$fields_count fields", true, self::$TRACE_STORAGE);
	}
	
	public function checkRecordValue($arg_field, $arg_value)
	{
		$context = get_class($this).".AbstractStorageImpl.checkRecordValue";
		TRACE::enter($context, "", self::$TRACE_STORAGE);
		TRACE::trace_var($context, "arg_field name", $arg_field->getName(), self::$TRACE_STORAGE);
		TRACE::trace_var($context, "arg_value", $arg_value, self::$TRACE_STORAGE);
		
		// CHECK VALUE TYPE
		if ( ! $arg_field->checkValueType($arg_value) )
		{
			return TRACE::leaveko($context, "Bad value type", false, self::$TRACE_STORAGE);
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_STORAGE);
	}
	
	// INIT
	public function isReady()
	{
		$context = get_class($this).".AbstractStorageImpl.isReady";
		TRACE::trace_var($context, "result_init", $this->result_init, self::$TRACE_STORAGE);
		
		return (! $this->need_init) and $this->result_init and (! is_null($this->fields_set) );
	}
	
	
	// GENERIC DATAS STORAGE
	public function getFieldsSet()
	{
		return $this->fields_set;
	}
	
	protected function getFieldForKey($arg_key)
	{
		$context = get_class($this).".AbstractStorageImpl.getFieldForKey";
		TRACE::enter($context, "", self::$TRACE_STORAGE);
		TRACE::trace_var($context, "arg_key", $arg_key, self::$TRACE_STORAGE);
		
		// INIT RESULT FIELD
		$field = null;
		
		// KEY IS AN INDEX
		if ( is_integer($arg_key) )
		{
			$field = $this->fields_set->getFieldAt($arg_key);
		}
		
		// KEY IS A NAME
		elseif ( is_string($arg_key) )
		{
			$field = $this->fields_set->getField($arg_key);
		}
		
		// BAD KEY TYPE
		else
		{
			return TRACE::leaveko($context, "bad key type : not an integer, not a string", null, self::$TRACE_STORAGE);
		}
		
		// CHECK FIELD
		if ( is_null($field) )
		{
			return TRACE::leaveko($context, "field not found for key [$arg_key]", null, self::$TRACE_STORAGE);
		}
		
		return TRACE::leaveok($context, "", $field, self::$TRACE_STORAGE);
	}
	
	public function getRecordFromDatas($arg_datas_record)
	{
		$context = get_class($this).".AbstractStorageImpl.getRecordFromDatas";
		TRACE::enter($context, "", self::$TRACE_STORAGE);
		TRACE::trace_var($context, "arg_datas_record", $arg_datas_record, self::$TRACE_STORAGE_RECORD);
		
		// CHECK INIT : FIELDS SET...
		if ( $this->isReady() )
		{
			return TRACE::leaveko($context, "Engine is not ready", null, self::$TRACE_STORAGE);
		}
		
		// CHECK RECORD : FIELDS COUNT...
		if ( ! $this->checkDatasRecord($arg_datas_record) )
		{
			return TRACE::leaveko($context, "Bad record", false, self::$TRACE_STORAGE);
		}
		
		// RESULT
		$record = array();
		
		// CHECK FIELDS TYPES AND KEYS
		foreach($arg_datas_record as $key => $value)
		{
			// GET FIELD FOR KEY
			$field = $this->getFieldForKey($key);
			
			// CHECK FOUND FIELD
			if ( is_null($field) )
			{
				return TRACE::leaveko($context, "No field found for key", null, self::$TRACE_STORAGE);
			}
			
			// CHECK FIELD VALUE
			if ( ! $this->checkRecordValue($field, $value) )
			{
				return TRACE::leaveko($context, "Bad value type for key [$key]", null, self::$TRACE_STORAGE);
			}
			
			// REGISTER RECORD FIELD
			$record[ $field->getName() ] = $value;
		}
		
		return TRACE::leaveok($context, "", $record, self::$TRACE_STORAGE);
	}
	
	public function countDatas()
	{
		return $this->countDatasFromHandle( $this->getDatasHandle() );
	}
	
	public function freeDatas()
	{
		return $this->freeDatasFromHandle( $this->getDatasHandle() );
	}
	
	public function fetchRecords()
	{
		return $this->fetchRecordsFromHandle( $this->getDatasHandle() );
	}
	
	public function fetchRecordAt($arg_index = -1)
	{
		return $this->fetchRecordAtFromHandle( $this->getDatasHandle() );
	}
	
	
	// ERROR OPERATIONS
	public function getLastErrorCode()
	{
		return $this->last_error_code;
	}
	
	public function getLastErrorMsg()
	{
		return $this->last_error_msg;
	}
}

?>
