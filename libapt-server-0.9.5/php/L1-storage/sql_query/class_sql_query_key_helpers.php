<?php
/**
 * @file        class_sql_query_key_helpers.php
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
class SQLQueryKeyHelpers
{
	static public function getOrdersKeyString($arg_orders)
	{
		// PREPARE ORDERS STRING KEY
		$orders_key = "ORDERS{";
		if ($arg_orders != null)
		{
			foreach($arg_orders AS $key => $order)
			{
				if ($order instanceof Order)
				{
					$orders_key .= $order->getStringKey();
				}
			}
		}
		$orders_key .= "}";
		return $orders_key;
	}
	
	static public function getGroupsKeyString($arg_groups)
	{
		// PREPARE GROUPS STRING KEY
		$groups_key = "GROUPS{";
		if ($arg_groups != null)
		{
			foreach($arg_groups AS $key => $group)
			{
				if ($group instanceof Group)
				{
					$groups_key .= $group->getStringKey();
				}
			}
		}
		$groups_key .= "}";
		return $groups_key;
	}
	
	static public function getFiltersKeyString($arg_filters)
	{
		// PREPARE FILTERS STRING KEY
		$filters_key = "FILTERS{";
		if ($arg_filters != null)
		{
			foreach($arg_filters AS $key => $filter)
			{
				if ($filter instanceof Filter)
				{
					$filters_key .= $filter->getStringKey();
				}
			}
		}
		$filters_key .= "}";
		return $filters_key;
	}
	
	static public function getQueryKeyString($arg_query, $arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_fields_key, $arg_slice_offset = null, $arg_slice_length = null)
	{
		// PREPARE ORDERS STRING KEY
		$orders_key = "ORDERS{";
		if ($arg_orders != null)
		{
			foreach($arg_orders AS $key => $order)
			{
				if ($order instanceof Order)
				{
					$orders_key .= $order->getStringKey();
				}
			}
		}
		$orders_key .= "}";
		
		// PREPARE GROUPS STRING KEY
		$groups_key = "GROUPS{";
		if ($arg_groups != null)
		{
			foreach($arg_groups AS $key => $group)
			{
				if ($group instanceof Group)
				{
					$groups_key .= $group->getStringKey();
				}
			}
		}
		$groups_key .= "}";
		
		// PREPARE FILTERS STRING KEY
		$filters_key = "FILTERS{";
		if ($arg_filters != null)
		{
			foreach($arg_filters AS $key => $filter)
			{
				if ($filter instanceof Filter)
				{
					$filters_key .= $filter->getStringKey();
				}
			}
		}
		$filters_key .= "}";
		
		// PREPARE FIELDS STRING KEY
		$fields_key = $arg_fields_key;
		if ($arg_fields_key == null)
		{
			$fields_key = "FIELDS{";
			if ($arg_fields != null)
			{
				foreach($arg_fields AS $key => $field)
				{
					if ($field instanceof Field)
					{
						$fields_key .= $field->getStringKey();
					}
				}
			}
			$fields_key .= "}";
		}
		
		// SLICE (LIMIT)
		$slice_key = "no slice";
		if ( ! is_null($arg_slice_offset) and ! is_null($arg_slice_length) )
		{
			$slice_key = "$arg_slice_offset, $arg_slice_length";
		}
		
		// PREPARE QUERY STRING KEY
		return $arg_query."{".$fields_key.",".$filters_key.",".$orders_key.",".$groups_key.",".$slice_key."}";
	}
}


?>
