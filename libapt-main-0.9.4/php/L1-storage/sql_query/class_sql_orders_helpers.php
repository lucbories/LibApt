<?php
/**
 * @file        class_sql_orders_helpers.php
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
class SQLOrdersHelpers
{
	private static $context = "SQLOrdersHelpers.getOrderSQLString";
	
	// SQL ORDER STRING
	static public function getOrderSQLString($arg_fields, $arg_orders)
	{
		$order = "";
		if ( ! is_null($arg_orders) )
		{
			foreach($arg_orders AS $key => $order_object)
			{
				if ($order_object instanceof Order)
				{
					$order_mode = $order_object->getMode();
					if ($order_mode == "ASC" || $order_mode == "DESC")
					{
						$order_field_name = $order_object->getFieldName();
						
						if ( ! array_key_exists($order_field_name, $arg_fields) )
						{
							return TRACE::leaveko(self::$context, "order field [$order_field_name] not found in fields array keys", null);
						}
						$field_object = $arg_fields[$order_field_name];
						if ( (! is_null($field_object) ) && $field_object instanceof Field)
						{
							$order_column = $field_object->getAttribute("sql_alias");
							if ($order != "")
							{
								$order .= ", ";
							}
							$order .= $order_column." ".$order_mode;
						}
						else
						{
							return TRACE::leaveko(self::$context, "order field is null or isn't a Field class or subclass", null);
						}
					}
					else
					{
						return TRACE::leaveko(self::$context, "order mode [$order_mode] isn't ASC or DESC", null);
					}
				}
				else
				{
					return TRACE::leaveko(self::$context, "order object isn't an Order class or subclass", null);
				}
			}
		}
		return $order;
	}
}


?>
