<?php
/**
 * @file        class_lazy_object.php
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
class LazyObject extends Named
{
	// STATIC ATTRIBUTES
	static public $TRACE_LAZY_OBJECT		= true;
	static public $TRACE_LAZY_OBJECT_ERROR	= true;
	
	// ATTRIBUTES
	protected $class_name		= null;
	protected $options_record	= null;
	protected $loader_adapter	= null;
	protected $created_object	= null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_class_name, $arg_loader_adapter, $arg_options_record)
	{
		$context = "LazyObject.__construct";
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
		
		// INIT CLASS NAME
		if ( ! is_null($arg_class_name) && $arg_class_name != "" )
		{
			$this->class_name = $arg_class_name;
		}
		else
		{
			TRACE::trace_var($context, "arg_class_name", $arg_class_name, self::$TRACE_LAZY_OBJECT_ERROR);
			TRACE::addErrorMsg($context, "bad class name", self::$TRACE_LAZY_OBJECT_ERROR);
		}
		
		// INIT ADAPTER
		if ( ! is_null($arg_loader_adapter) && $arg_loader_adapter instanceof AbstractLoaderAdapter )
		{
			$this->loader_adapter = $arg_loader_adapter;
		}
		else
		{
			TRACE::trace_var($context, "adapter class", get_class($arg_loader_adapter), self::$TRACE_LAZY_OBJECT_ERROR);
			TRACE::addErrorMsg($context, "bad adapter", self::$TRACE_LAZY_OBJECT_ERROR);
		}
		
		// INIT OPTIONS
		if ( ! is_null($arg_options_record) && is_array($arg_options_record) )
		{
			$this->options_record = $arg_options_record;
		}
		else
		{
			TRACE::trace_var($context, "arg_options_record", $arg_options_record, self::$TRACE_LAZY_OBJECT_ERROR);
			TRACE::addErrorMsg($context, "bad options", self::$TRACE_LAZY_OBJECT_ERROR);
		}
	}
	
	
	// LAZY OPERATIONS
	public function dump($arg_context, $arg_trace)
	{
		TRACE::trace_var($arg_context, "name", $this->name, $arg_trace);
		TRACE::trace_var($arg_context, "class_name", $this->class_name, $arg_trace);
		TRACE::trace_var($arg_context, "loader_adapter class", get_class($this->loader_adapter), $arg_trace);
		TRACE::trace_var($arg_context, "options_record", $this->options_record, $arg_trace);
	}
	
	public function isReady()
	{ 
		return ! is_null($this->name) && $this->name != "" && ! is_null($this->class_name) && $this->class_name != "" && ! is_null($this->loader_adapter) && ! is_null($this->options_record) && is_array($this->options_record);
	}
	
	public function getClassName()
	{
		return $this->class_name;
	}
	
	public function getLoaderAdapter()
	{
		return $this->loader_adapter;
	}
	
	public function getOptionsRecord()
	{
		return $this->options_record;
	}
	
	public function setOptionsRecord($arg_options_record)
	{
		$context = "LazyObject.setOptionsRecord";
		
		if ( ! is_null($arg_options_record) && is_array($arg_options_record) )
		{
			$this->options_record = $arg_options_record;
			return false;
		}
		
		TRACE::trace_var($context, "arg_options_record", $arg_options_record, self::$TRACE_LAZY_OBJECT_ERROR);
		TRACE::addErrorMsg($context, "bad options", self::$TRACE_LAZY_OBJECT_ERROR);
		
		return true;
	}
	
	public function isCreated()
	{ 
		return ! is_null($this->created_object);
	}
	
	public function getCreatedObject()
	{
		if ( ! $this->isCreated() )
		{
			return $this->buidlObject();
		}
		return $this->created_object;
	}
	
	protected function buidlObject()
	{
		$context = "LazyObject.buidlObject";
		
		// CHECK PREREQUISITES
		$name = $this->getName();
		if ( is_null($this->loader_adapter) || is_null($name) || $name == "" || is_null($this->options_record) )
		{
			TRACE::trace_var($context, "name", $name, self::$TRACE_LAZY_OBJECT_ERROR);
			TRACE::addErrorMsg($context, "bad prerequisites", self::$TRACE_LAZY_OBJECT_ERROR);
		}
		
		// CREATE OBJECT
		$this->created_object = $this->loader_adapter->buildObjectFromLazy($this);
		
		return $this->created_object;
	}
}