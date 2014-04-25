<?php
/**
 * @file        class_abstract_cursor.php
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
abstract class AbstractCursor
{
	// ATTRIBUTES
	protected $name = null;
	protected $model = null;
	
	
	// CONSTRUCTEUR
	protected function __construct($arg_name, $arg_model)
	{
		$this->name    = $arg_name;
		$this->model   = $arg_model;
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
	
	abstract public function getDatas();
	abstract public function getRowsCount();
	abstract public function getNextIndex();
	
	
	// CURSOR STATE
	abstract public function start($arg_orders, $arg_filters, $arg_slide_begin = null, $arg_slide_length = null);
	abstract public function stop();	
	abstract public function getNextRecord();
//	abstract public function getNextObject();
	
}


?>
