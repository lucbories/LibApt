<?php
/**
 * @file        class_cursor.php
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
class Cursor extends AbstractCursor
{
	// STATIC ATTRIBUTES
	static public $TRACE_CURSOR = false;
	
	// ATTRIBUTES
	protected $datas = null;
	
	protected $rows_count = null;
	protected $next_index = null;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_name, $arg_model)
	{
		parent::__construct($arg_name, $arg_model);
	}
	
	
	// ATTRIBUTES ACCESSORS
	public function getName()
	{
		return $this->name;
	}
	
	public function getModel()
	{
		return $this->model;
	}
	
	public function getDatas()
	{
		return $this->datas;
	}
	
	public function getRowsCount()
	{
		return $this->rows_count;
	}
	
	public function getNextIndex()
	{
		return $this->next_index;
	}
	
	
	// CURSOR STATE
	public function start($arg_orders, $arg_filters, $arg_slice_begin = null, $arg_slice_length = null)
	{
		$context = get_class($this).".Cursor.start";
		
		TRACE::enter($context, "", self::$TRACE_CURSOR);
		
		// READ DATAS RECORDS
		$options = array();
		if ( ! ( is_null($arg_slice_begin) or is_null($arg_slice_length) ) )
		{
			$options[AbstractQuery::$OPTION_SLICE_OFFSET] = $arg_slice_begin;
			$options[AbstractQuery::$OPTION_SLICE_LENGTH] = $arg_slice_length;
		}
		$fields = $this->model->getFieldsSet()->getFields();
		$this->datas = $this->model->read($fields, $arg_filters, $arg_orders, $options);
		
		// CHECK RECORDS COUNT
		if ( ! is_null($this->datas) )
		{
			$this->rows_count = count($this->datas);
			$this->next_index = ($this->rows_count > 0 ? 0 : -1);
			return TRACE::leaveok($context, "rows=[".$this->rows_count."]", true, self::$TRACE_CURSOR);
		}
		
		$this->rows_count = 0;
		$this->next_index = -1;
		return TRACE::leaveko($context, "no datas found", false, self::$TRACE_CURSOR);
	}
	
	public function stop()
	{
		$this->datas = null;
		$this->rows_count = 0;
		$this->next_index = -1;
	}
	
	public function getNextRecord()
	{
		$context = get_class($this).".Cursor.getNextRecord";
		
		TRACE::enter($context, "", self::$TRACE_CURSOR);
		
		if ( ! is_null($this->datas) and $this->next_index >= 0 and $this->next_index < $this->rows_count)
		{
			$result = $this->datas[$this->next_index];
			$this->next_index += 1;
			$this->next_index = $this->next_index < $this->rows_count ? $this->next_index : -1;
			return TRACE::leaveok($context, "next found", $result, self::$TRACE_CURSOR);
		}
		
		TRACE::addDebugMsg($context, "no next record", self::$TRACE_CURSOR);
		$this->next_index = -1;
		return TRACE::leaveok($context, "null result", null, self::$TRACE_CURSOR);
	}
	
}


?>
