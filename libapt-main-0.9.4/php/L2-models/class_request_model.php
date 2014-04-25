<?php
/**
 * @file        class_request_model.php
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
class RequestModel extends AbstractModelImpl
{
	// MODEL ENGINE ATTRIBUTES
	protected $request = null;
	protected $need_init = true;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, null, null);
		
		// REQUEST INIT
		$this->request = new Request();
	}
	
	protected function init()
	{
		$context = "RequestModel.init";
		TRACE::enter($context, "", self::$TRACE_MODEL);
		
		// INIT FIELDS
		$field_object = new Field("REQUEST", "key", "String", null, "", "Request attribute key", true, true, false);
		$this->fields_set->registerField("key", $field_object);
		
		$field_object = new Field("REQUEST", "value", "String", null, "", "Request attribute value", true, true, false);
		$this->fields_set->registerField("value", $field_object);
		
		$this->need_init = false;
		
		TRACE::leaveok($context, "", null, self::$TRACE_MODEL);
	}
	
	
	// FIELDS SET
	public function getFieldsSet()
	{
		$context = "RequestModel.getFieldsSet";
		TRACE::enter($context, "", self::$TRACE_MODEL);
		
		// INIT FIELDS IF NEEDED
		if ( $this->need_init )
		{
			$this->init();
		}
		
//		TRACE::trace_var($context, "fields", $this->fields_set->getFields());
		
		TRACE::leaveok($context, "", null, self::$TRACE_MODEL);
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
		$context = "RequestModel.read";
		TRACE::enter($context, "", self::$TRACE_MODEL);
		
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
			TRACE::step($context, "READ ALL", self::$TRACE_MODEL);
			$attributes = $this->request->getParameters();
			foreach($attributes as $key=>$value)
			{
				$results[] = array("key"=> $key, "value" => $value);
			}
			return TRACE::leaveok($context, "", $results, self::$TRACE_MODEL);
		}
		
		// READ ONE ATTRIBUTE
		if ( $arg_filters instanceof AbstractFilter )
		{
			TRACE::step($context, "READ ONE ATTRIBUTE", self::$TRACE_MODEL);
			$key = $arg_filters->getOperand(1);
			$value = $this->request->getParameter($key);
			$results[] = array("key"=> $key, "value" => $value);
			return TRACE::leaveok($context, "", $results, self::$TRACE_MODEL);
		}
		if ( is_string($arg_filters) or is_numeric($arg_filters) )
		{
			$key = strval($arg_filters);
			$value = $this->request->getParameter($key);
			$results[] = array("key"=> $key, "value" => $value);
			return TRACE::leaveok($context, "", $results, self::$TRACE_MODEL);
		}
		
		// READ MANY ATTRIBUTES
		if ( is_array($arg_filters) )
		{
			TRACE::step($context, "READ MANY ATTRIBUTES", self::$TRACE_MODEL);
			foreach($arg_filters as $value)
			{
				if ( $value instanceof AbstractFilter )
				{
					$key = $value->getOperand(1);
					$value = $this->request->getParameter($key);
					$results[] = array("key"=> $key, "value" => $value);
				}
				elseif ( is_string($value) or is_numeric($value) )
				{
					$key = strval($value);
					$value = $this->request->getParameter($key);
					$results[] = array("key"=> $key, "value" => $value);
				}
			}
			return TRACE::leaveok($context, "", $results, self::$TRACE_MODEL);
		}
		
		return TRACE::leaveko($context, "bad filters", $results, self::$TRACE_MODEL);
	}
	
	public function readWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		return $this->read($arg_fields, $arg_filters, $arg_orders, $arg_options);
	}
	
	public function readAll($arg_fields, $arg_orders, $arg_options)
	{
		$context = "RequestModel.readAll";
		TRACE::enter($context, "", self::$TRACE_MODEL);
		
		$result = $this->read($arg_fields, null, $arg_orders, $arg_options);
		
		return TRACE::leave($context, "", $result, false, self::$TRACE_MODEL);
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
