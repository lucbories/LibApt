<?php
/**
 * @file        class_order.php
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
class Order
{
	// STATIC ATTRIBUTES
	static public $TRACE		= false;
	
	static public $MODES		= array("ASC", "DESC");
	static public $MODE_ASC		= "ASC";
	static public $MODE_DESC	= "DESC";
	
	// FIELD DEFINITION ITEMS
	protected $order_mode = null;
	protected $order_field_name = null;
	protected $string_key = null;
	protected $key = null;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_mode, $arg_field_name)
	{
		if ( in_array($arg_mode, self::$MODES) )
		{
			$this->order_mode = $arg_mode;
		} else {
			$this->order_mode = null;
		}
		$this->order_field_name = $arg_field_name;
	}
	
	
	// STATIC ATTRIBUTES
	static public function getModes()
	{
		return self::$MODES;
	}
	
	
	// FIELDS
	public function getModeKey()
	{
		return "order_mode";
	}
	
	public function getMode()
	{
		return $this->order_mode;
	}
	
	public function getFieldNameKey()
	{
		return "order_field_name";
	}
	
	public function getFieldName()
	{
		return $this->order_field_name;
	}
	
	
	// STRING KEY
	public function getKey()
	{
		if ($this->key == null)
		{
			$this->updateKey();
		}
		return $this->key;
	}
	
	public function getStringKey()
	{
		if ($this->key == null)
		{
			$this->updateKey();
		}
		return $this->string_key;
	}
	
	public function getURLAttributes()
	{
		return http_build_query( array("order_mode" => $this->order_mode, "order_field_name" => $this->order_field_name) );
	}
	
	protected function updateKey()
	{
		$this->string_key = "ORDER{".$this->getURLAttributes()."}";
		$this->key = md5($this->string_key);
	}
	
	
	// BUILD FROM STRING
	public static function buildOrderFromString($arg_string)
	{
		$context = "Order.buildOrdersFromString($arg_string)";
		
		// GET GROUP ATTRIBUTES
		$order_attributes		= explode("=", $arg_string);
		$order_attributes_count	= count($order_attributes);
		CONTRACT::assertTrue($context.".attributes_count", $order_attributes_count == 2); 
		
		// GET FIELD ATTRIBUTE
		$field_name	= $order_attributes[0];
		CONTRACT::assertNotEmptyString($context.".field_name", $field_name);
		
		// GET MODE ATTRIBUTE
		$mode		= $order_attributes[1];
		CONTRACT::assertNotEmptyString($context.".mode", $mode);
		CONTRACT::assertTrue($context.".mode[$mode] == 'ASC' or 'DESC'", $mode == "ASC" || $mode == "DESC" ); 
		
		TRACE::trace_var($context, "mode", $mode, Order::$TRACE );
		TRACE::trace_var($context, "field_name", $field_name, Order::$TRACE );
		
		return new Order($mode, $field_name);
	}
	
	public static function buildOrdersFromString($arg_string)
	{
		$orders_strings = explode("|", $arg_string);
		$orders = array();
		
		foreach($orders_strings as $key => $order_string)
		{
			if ( ! is_null($order_string) and $order_string != "" )
			{
				TRACE::trace_var("buildOrdersFromString", "order_string", $order_string, Order::$TRACE );
				$order = Order::buildOrderFromString($order_string);
				if ( ! is_null($order) )
				{
					$orders[] = $order;
				}
			}
		}
		
		return $orders;
	}
}
?>