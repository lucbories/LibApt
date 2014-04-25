<?php
/**
 * @file        class_session_model.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class SessionModel extends AbstractModelImpl
{
	// MODEL ENGINE ATTRIBUTES
	protected $need_init = true;
	protected $trace = false;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, null, null);
	}
	
	protected function init()
	{
		$context = "SessionModel.init";
		TRACE::enter($context, null, $this->trace);
		
		// INIT FIELDS
		$field_object = new Field("SESSION", "key", "String", null, "", "Session attribute key", true, true, false);
		$this->fields_set->registerField("key", $field_object);
		
		$field_object = new Field("SESSION", "value", "String", null, "", "Session attribute value", true, true, false);
		$this->fields_set->registerField("value", $field_object);
		
		$this->need_init = false;
		
		TRACE::leaveok($context, null, null, $this->trace);
	}
	
	
	// FIELDS SET
	public function getFieldsSet()
	{
		$context = "SessionModel.getFieldsSet";
		TRACE::enter($context, null, $this->trace);
		
		// INIT FIELDS IF NEEDED
		if ( $this->need_init )
		{
			$this->init();
		}
		
		TRACE::leaveok($context, null, null, $this->trace);
		return $this->fields_set;
	}
	
	
	// CRUD OPERATIONS - CREATE
	public function create($arg_fields, $arg_values, $arg_options)
	{
		// NOTHING TO DO
		return false;
	}
	
	
	// CRUD OPERATIONS - READ
	public function read($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		$context = "SessionModel.read";
		TRACE::enter($context, null, $this->trace);
		
		// UNUSED ARGS : $arg_fields, $arg_orders, $arg_options
		
		// INIT FIELDS IF NEEDED
		if ( $this->need_init )
		{
			$this->init();
		}
		
		// INIT RESULTS ARRAY
		$results = array();
		
		// READ ALL
		if ( is_null($arg_filters) )
		{
			TRACE::step($context, "READ ALL", $this->trace);
			$attributes = Application::getInstance()->getSessionProperties();
			foreach($attributes as $key=>$value)
			{
				if ( is_array($value) )
				{
					$value = implode($value, ",");
				}
				$results[] = array("key"=> $key, "value" => $value);
			}
			return TRACE::leaveok($context, count($results), $results, $this->trace);
		}
		
		// READ ONE ATTRIBUTE
		if ( $arg_filters instanceof AbstractFilter )
		{
			TRACE::step($context, "READ ONE ATTRIBUTE", $this->trace);
			$key = $arg_filters->getOperand(1);
			$value = Application::getInstance()->getSessionProperty($key);
			if ( is_array($value) )
			{
				$value = implode($value, ",");
			}
			$results[] = array("key"=> $key, "value" => $value);
			return TRACE::leaveok($context, count($results), $results, $this->trace);
		}
		if ( is_string($arg_filters) or is_numeric($arg_filters) )
		{
			$key = strval($arg_filters);
			$value = Application::getInstance()->getSessionProperty($key);
			$results[] = array("key"=> $key, "value" => $value);
			return TRACE::leaveok($context, count($results), $results, $this->trace);
		}
		
		// READ MANY ATTRIBUTES
		if ( is_array($arg_filters) )
		{
			TRACE::step($context, "READ MANY ATTRIBUTES", $this->trace);
			foreach($arg_filters as $value)
			{
				if ( $value instanceof AbstractFilter )
				{
					$key = $value->getOperand(1);
					$value = Application::getInstance()->getSessionProperty($key);
					$results[] = array("key"=> $key, "value" => $value);
				}
				elseif ( is_string($value) or is_numeric($value) )
				{
					$key = strval($value);
					$value = Application::getInstance()->getSessionProperty($key);
					$results[] = array("key"=> $key, "value" => $value);
				}
			}
			return TRACE::leaveok($context, count($results), $results, $this->trace);
		}
		
		return TRACE::leaveko($context, "bad filters", null, $this->trace);
	}
	
	public function readWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		return $this->read($arg_fields, $arg_filters, $arg_orders, $arg_options);
	}
	
	public function readAll($arg_fields, $arg_orders, $arg_options)
	{
		$context = "SessionModel.readAll";
		TRACE::enter($context, null, $this->trace);
		
		$results = $this->read($arg_fields, null, $arg_orders, $arg_options);
		
		if ( is_null($results) )
		{
			return TRACE::leaveok($context, "no results", null, $this->trace);
		}
		
		return TRACE::leaveok($context, count($results), $results, $this->trace);
	}
	
	public function readDistinct($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		// NOTHING TO DO
		return null;
	}
	
	public function readDistinctForeignKeys($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		// NOTHING TO DO
		return null;
	}
	
	public function readDistinctForeignKeysWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		// NOTHING TO DO
		return null;
	}
	
	public function readCount($arg_filters, $arg_options)
	{
		// NOTHING TO DO
		return 0;
	}
	
	public function readHas($arg_filters, $arg_options)
	{
		// NOTHING TO DO
		return false;
	}
	
	
	// CRUD OPERATIONS - UPDATE
	public function update($arg_fields, $arg_values, $arg_filters, $arg_options)
	{
		// NOTHING TO DO
		return false;
	}
	
	
	// CRUD OPERATIONS - DELETE
	public function delete($arg_filters, $arg_options)
	{
		// NOTHING TO DO
		return false;
	}
	
	
	// CURSOR OPERATIONS
	public function createCursor($arg_cursor_name)
	{
		return new Cursor($arg_cursor_name, $this);
	}
}

?>
