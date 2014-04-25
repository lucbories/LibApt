<?php
/**
 * @file        class_sql_select_helpers.php
 * @brief       SQL select query compilation
 * @details     ...
 * @see			GenericQuery Trace Type
 * @ingroup     L1_STORAGE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class SQLSelectHelpers
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_SELECT = false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Get a compiled select SQL sting
	 * @param[in]	arg_fields				array of AbstractField objects
	 * @param[in]	arg_orders				array of Order objects
	 * @param[in]	arg_groups				array of Group objects
	 * @param[in]	arg_slice_offset		slice offset, default null (integer)
	 * @param[in]	arg_slice_length		slice length, default null (integer)
	 * @param[in]	arg_distinct			select distinct values ? (boolean)
	 * @param[in]	arg_count				select count values ? (boolean)
	 * @param[in]	arg_foreign_keys		select has foreign keys ? (boolean)
	 * @return		string
	 */
	static public function getSelectString($arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset = null, $arg_slice_length = null, $arg_distinct = false, $arg_count = false, $arg_foreign_keys = false, $arg_joins = null, $arg_distinct_one_field = null)
	{
		$context = "SQLSelectHelpers.getSelectString";
		
		TRACE::trace_var($context, "arg_fields", $arg_fields, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_filters", $arg_filters, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_orders", $arg_orders, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_groups", $arg_groups, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_slice_offset", $arg_slice_offset, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_slice_length", $arg_slice_length, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_joins.count", count($arg_joins), self::$TRACE_SELECT);
		
		TRACE::trace_var($context, "arg_distinct?", $arg_distinct, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_count?", $arg_count, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_foreign_keys?", $arg_foreign_keys, self::$TRACE_SELECT);
		
		TRACE::trace_var($context, "arg_distinct_one_field", $arg_distinct_one_field, self::$TRACE_SELECT);
		TRACE::trace_var($context, "arg_distinct_one_field.name", is_null($arg_distinct_one_field) ? "null" : $arg_distinct_one_field->getName(), self::$TRACE_SELECT);
		
		
		$query_string = "";
		$tables	= array();
		$foreign_tables_aliases = array();
		$select	= "";
		$from	= "";
		$where	= "";
		$filter	= "";
		$order	= "";
		$group	= "";
		$slice	= "";
		
		
		// CHECK FIELDS
		if ( is_null($arg_fields) )
		{
			return "";
		}

		
		// PROCESS JOINS
		if( ! is_null($arg_joins) && count($arg_joins) > 0)
		{
			$join_record = $arg_joins[0];
			
			$first_table = $join_record["db"].".".$join_record["table"];
			$tables[$first_table] = $first_table;
			$from .= $first_table." ";
			TRACE::trace_var($context, "first_table", $first_table, self::$TRACE_SELECT);
			
			foreach($arg_joins as $join_record)
			{
				$table = $join_record["db"].".".$join_record["table"];
				$table_field = $join_record["table"].".".$join_record["column"];
				$tables[$table] = $table;
				TRACE::trace_var($context, "table", $table, self::$TRACE_SELECT);
				
				$join_table = $join_record["join_db"].".".$join_record["join_table"];
				$join_table_alias = $join_record["join_table_alias"];
				$join_table_field = $join_table_alias.".".$join_record["join_column"];
				$join_table2 = $join_record["join_db"].".".$join_table_alias;
				
				$tables[$join_table] = $join_table;
				$tables[$join_table2] = $join_table2;
				TRACE::trace_var($context, "join_table", $join_table, self::$TRACE_SELECT);
				TRACE::trace_var($context, "join_table2", $join_table2, self::$TRACE_SELECT);
				
				$from .= "INNER JOIN $join_table AS $join_table_alias ON $table_field = $join_table_field \n";
			}
		}
		
		
		// LOOP ON FIELDS VALUES
		$fields_index = 0;
		$has_distinct_one_field = $arg_distinct && ! is_null($arg_distinct_one_field);
		TRACE::trace_var($context, "has_distinct_one_field", $has_distinct_one_field, self::$TRACE_SELECT);
		foreach($arg_fields AS $key => $field)
		{
			$filter_field_name = $field->getName();
			$is_distinct_one_field = $has_distinct_one_field && $arg_distinct_one_field->getName() == $filter_field_name;
			$use_in_select = $is_distinct_one_field || ! $has_distinct_one_field;
			TRACE::trace_var($context, "filter_field_name", $filter_field_name, self::$TRACE_SELECT);
			TRACE::trace_var($context, "is_distinct_one_field", $is_distinct_one_field, self::$TRACE_SELECT);
			TRACE::trace_var($context, "use_in_select", $use_in_select, self::$TRACE_SELECT);
			
			if ($arg_count && $fields_index > 0)
			{
//				TRACE::step($context, "break loop", self::$TRACE_SELECT);
				break;
			}
			++$fields_index;
			$record = $field->getAttributes();
			
			// SEPARATEUR DE COLONNES
			if ($use_in_select && $select != "")
			{
				$select .= ", ";
			}
			
			// UTILISATION D UNE JOINTURE
			if ( (! $arg_foreign_keys) && $record["sql_foreign_db"] !== null && $record["sql_foreign_table"] !== null && $record["sql_foreign_key"] !== null && $record["sql_foreign_column"] !== null)
			{
				// GET OR CREATE FOREIGN TABLE ALIAS
				$sql_foreign_table = $record["sql_foreign_table"]."_".$filter_field_name;
				if ( array_key_exists($sql_foreign_table, $foreign_tables_aliases) )
				{
					$foreign_tables_aliases[$sql_foreign_table] = $foreign_tables_aliases[$sql_foreign_table] + 1;
				}
				else
				{
					$foreign_tables_aliases[$sql_foreign_table] = 0;
				}
				$sql_foreign_table = $sql_foreign_table."_".$foreign_tables_aliases[$sql_foreign_table];
				TRACE::trace_var($context, "sql_foreign_table?", $sql_foreign_table, self::$TRACE_SELECT);
				
				
				// FILL WHERE
				if ($where != "")
				{
					$where .= " AND ";
				}
				$where .= $record["sql_table"].".".$record["sql_column"]." = ".$sql_foreign_table.".".$record["sql_foreign_key"];
				
				// FILL SELECT
				if ($use_in_select)
				{
					$select .= $sql_foreign_table.".".$record["sql_foreign_column"]." AS ".$record["sql_alias"];
				}
				
				// FILL FROM WITH TABLE
				$db = $record["sql_db"];
				$table = $db.".".$record["sql_table"];
				if ( ! array_key_exists($table, $tables) )
				{
					$tables[$table] = $table;
					if ($from != "")
					{
						$from .= ", ";
					}
					$from .= $table;
				}
				
				// FILL FROM WITH FOREIGN TABLE
				$db = $record["sql_foreign_db"];
				$table = $db.".".$record["sql_foreign_table"]." AS ".$sql_foreign_table;
				if ( ! array_key_exists($table, $tables) )
				{
					$tables[$table] = $table;
					if ($from != "")
					{
						$from .= ", ";
					}
					$from .= $table;
				}
			}
			
			// UTILISATION D UN CHAMP SIMPLE
			else
			{
				if ( ! $arg_foreign_keys )
				{
					// FILL FROM WITH TABLE
					$db = $record["sql_db"];
					$table = $db.".".$record["sql_table"];
					if ( $table != "" && ! array_key_exists($table, $tables) )
					{
						$tables[$table] = $table;
						if ($from != "")
						{
							$from .= ", ";
						}
						$from .= $table;
					}
					
					// FILL SELECT
					if ($use_in_select)
					{
						if ($record["sql_is_expression"] == "1")
						{
							$select .= "(".$record["sql_column"].") AS ".$record["sql_alias"];
						}
						else
						{
							// APPEND SELECT FIELD
							$table = $record["sql_table"];
							if ($arg_count)
							{
								$select .= $table.".".$record["sql_column"];
							}
							else
							{
								$select .= $table.".".$record["sql_column"]." AS ".$record["sql_alias"];
							}
						}
					}
				}
				else
				{
					// GET OR CREATE FOREIGN TABLE ALIAS
					$sql_foreign_table = $record["sql_foreign_table"]."_".$filter_field_name;
					if ( array_key_exists($sql_foreign_table, $foreign_tables_aliases) )
					{
						$foreign_tables_aliases[$sql_foreign_table] = $foreign_tables_aliases[$sql_foreign_table] + 1;
					}
					else
					{
						$foreign_tables_aliases[$sql_foreign_table] = 0;
					}
					$sql_foreign_table = $sql_foreign_table."_".$foreign_tables_aliases[$sql_foreign_table];
					TRACE::trace_var($context, "sql_foreign_table?", $sql_foreign_table, self::$TRACE_SELECT);
					
					// FILL SELECT
					if ($use_in_select)
					{
						$select .= $sql_foreign_table.".".$record["sql_foreign_column"]." AS ".$record["sql_alias"];
					}
					
					// FILL FROM WITH FOREIGN TABLE
					$db = $record["sql_foreign_db"];
					$table = $db.".".$record["sql_foreign_table"]." AS ".$sql_foreign_table;
					if ( ! array_key_exists($table, $tables) )
					{
						$tables[$table] = $table;
						if ($from != "")
						{
							$from .= ", ";
						}
						$from .= $table;
					}
				}
			}
		}
		
		// FILL QUERY STRING WITH SELECT AND FROM
		$sql_distinct		= $arg_distinct ? "DISTINCT " : "";
		$sql_count_before	= $arg_count ? "COUNT(" : "";
		$sql_count_after	= $arg_count ? ") AS count" : "";
//		TRACE::trace_var($context, "distinct?", $arg_distinct ? "1" : "0", self::$TRACE_SELECT);
//		TRACE::trace_var($context, "sql_distinct", $sql_distinct, self::$TRACE_SELECT);
		$query_string = "SELECT ".$sql_count_before.$sql_distinct.$select.$sql_count_after." FROM ".$from;
		if ($where != "")
		{
			$query_string .= " WHERE ".$where;
		}
		
		// FILL QUERY STRING WITH FILTERS
		TRACE::step($context, "Process filters", self::$TRACE_SELECT);
		TRACE::trace_var($context, "filters.count", count($arg_filters), self::$TRACE_SELECT);
		TRACE::trace_var($context, "filters	", $arg_filters, self::$TRACE_SELECT);
		$filter = SQLFiltersHelpers::getFilterSQLString($arg_fields, $arg_filters);
		TRACE::trace_var($context, "filters.str", $filter, self::$TRACE_SELECT);
		if ($filter != "")
		{
			if ($where != "")
			{
				$query_string .= " AND (".$filter.")";
			} else {
				$query_string .= " WHERE ".$filter;
			}
		}
		
		
		// FILL QUERY STRING WITH GROUP BY
		TRACE::step($context, "Process groups", self::$TRACE_SELECT);
		$group = SQLGroupsHelpers::getGroupSQLString($arg_fields, $arg_groups);
		if ($group != "")
		{
			$query_string .= " GROUP BY ".$group;
			TRACE::trace_var($context, "group", $group, self::$TRACE_SELECT);
		}
		
		
		// FILL QUERY STRING WITH ORDER BY
		TRACE::step($context, "Process orders", self::$TRACE_SELECT);
		$order = SQLOrdersHelpers::getOrderSQLString($arg_fields, $arg_orders);
		if ($order != "")
		{
			$query_string .= " ORDER BY ".$order;
		}
		
		
		// SLICE (LIMIT)
		$slice_offset = TYPE::getIntegerValue($arg_slice_offset, 0);
		$slice_length = TYPE::getIntegerValue($arg_slice_length, 0);
		if ($slice_length > 0)
		{
			$slice = " LIMIT $arg_slice_offset, $arg_slice_length";
			$query_string .= $slice;
		}
		// else
		// {
			// TRACE::trace_var($context, "bad slice", "$arg_slice_offset / $arg_slice_length", self::$TRACE_SELECT);
		// }
		
		$query_string .= ";";
		
		return $query_string;
	}
	
	static public function getSelectKeyString($arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_fields_key, $arg_slice_offset = null, $arg_slice_length = null, $arg_distinct = false, $arg_count = false, $arg_foreign_keys = false)
	{
		$sql_distinct = $arg_distinct ? " DISTINCT " : "";
		$sql_foreign  = $arg_foreign_keys ? " FOREIGN KEYS " : "";
		if ($arg_count)
		{
			return SQLQueryKeyHelpers::getQueryKeyString("SELECT COUNT".$sql_distinct, $arg_fields, $arg_orders, $arg_filters, $arg_fields_key, $arg_slice_offset, $arg_slice_length);
		}
		return SQLQueryKeyHelpers::getQueryKeyString("SELECT".$sql_distinct.$sql_foreign, $arg_fields, $arg_orders, $arg_filters, $arg_fields_key, $arg_slice_offset, $arg_slice_length);
	}
}
?>