<?php
/**
 * @file        class_sql_filters_helpers.php
 * @brief       ...
 * @details     ...
 * @see			Field Filter Trace Type
 * @ingroup     L1_STORAGE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class SQLFiltersHelpers
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_FILTERS_HELPERS = false;
	
	
	
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
	 * @brief		Get the SQL string (where part) of an ordered set of filters
	 * @param[in]	arg_fields			associative array of fields as name string/field object (array)
	 * @param[in]	arg_filters			an ordered set of filters (array)
	 * @return		string
	 */
	static public function getFilterSQLString($arg_fields, $arg_filters)
	{
		$context = "SQLFiltersHelpers.getFilterSQLString";
		
		$filter_string = "";
		if ( ! is_null($arg_filters) )
		{
			foreach($arg_filters AS $key => $filter_object)
			{
				// CHECK FILTER OBJECT
				CONTRACT::assertNotNull($context." filter object for [$key]", $filter_object);
				
				
				// FILTER ATTRIBUTE
				$filter_group		= $filter_object->getAttribute("group_mode");
				$filter_join		= $filter_object->getAttribute("join_mode");
				$filter_field_name	= $filter_object->getAttribute("field_name");
				$filter_type		= $filter_object->getAttribute("filter_type");
				$filter_op			= $filter_object->getAttribute("filter_op");
				$filter_modifier	= $filter_object->getAttribute("filter_modifier");
				$filter_var1		= $filter_object->getOperand(1);
				$filter_var2		= $filter_object->getOperand(2);
				TRACE::trace_var($context, "filter_field_name", $filter_field_name, self::$TRACE_FILTERS_HELPERS);
				
				
				// FIELD RECORD
				CONTRACT::assertArrayHasKey($context." filter field [$filter_field_name] not found for [$key]", $arg_fields, $filter_field_name);
				$field_object = $arg_fields[$filter_field_name];
				CONTRACT::assertInherit($context." filter for field [$filter_field_name] for [$key] not a Field class", $field_object, "Field");
				
				
				// GET FIELD ATTRIBUTES
				$field_is_expression	= (boolean) $field_object->getAttribute("sql_is_expression");
				$field_table			= $field_object->getAttribute("sql_table");
				$field_column			= $field_object->getAttribute("sql_column");
				$field_foreign_db		= $field_object->getAttribute("sql_foreign_db");
				$field_foreign_table	= $field_object->getAttribute("sql_foreign_table");
				$field_foreign_key		= $field_object->getAttribute("sql_foreign_key");
				$field_foreign_column	= $field_object->getAttribute("sql_foreign_column") !== null;
				
				// GET FOREIGN TABLE AND COLUMN
				if ( ( ! is_null($field_foreign_db) ) && ( ! is_null($field_foreign_table) ) && ( ! is_null($field_foreign_key) ) && ( ! is_null($field_foreign_column) ) )
				{
					$field_column = $field_object->getAttribute("sql_foreign_column");
					$field_table = $field_object->getAttribute("sql_foreign_table")."_".$filter_field_name."_0";
					TRACE::trace_var($context, "field_table", $field_table, self::$TRACE_FILTERS_HELPERS);
				}
				
				// GET COLUMN
				$filter_column = $field_table.".".$field_column;
				if ($field_is_expression)
				{
					$filter_column = $field_column;
				}
				
				// FIELD MODIFIER
				if ($filter_modifier != null)
				{
					$filter_column = self::getModifierSQLString($filter_modifier, $filter_column);
				}
				
				
				// FILTER STRING
				$filter = self::getOperatorSQLString($filter_op, $filter_type, $filter_column, $filter_var1, $filter_var2);
				
				
				
				// TODO
				
				// UPDATE FILTERS STRING
				if ( ! is_null($filter) && $filter_string != "")
				{
					$join = ( is_null($filter_join) || $filter_join == "" ) ? "AND" : $filter_join;
					$filter_string .= " $join ";
				}
				
				if ($filter_group == "(")
				{
					$filter_string .= "(".$filter;
				}
				elseif ($filter_group == ")")
				{
					$filter_string .= $filter.")";
				}
				else
				{
					$filter_string .= $filter;
				}
				
			}
		}
		
		return $filter_string;
	}
	
	
	
	/*
		MODIFIERS :
			"nothing",
			// STRING OPERATORS
			"upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5",
			// NUMBER OPERATORS
			"abs", "floor",
			// DATE
			"week", "month", "year", "date", "day of month", "day of week", "day of year", "last day", "quarter",
			// TIME
			"time", "hour", "minute", "second"
	*/
	
	/**
	 * @brief		Get the SQL string of a column with a modifier
	 * @param[in]	arg_modifier		column modifier name (string)
	 * @param[in]	arg_column			column name (string)
	 * @return		string
	 */
	static public function getModifierSQLString($arg_modifier, $arg_column)
	{
		if ($arg_modifier == "nothing")
		{
			return $arg_column;
		}
		
		// STRING OPERATORS
		elseif ($arg_modifier == "upper")
		{
			return "UPPER(".$arg_column.")";
		}
		elseif ($arg_modifier == "lower")
		{
			return "LOWER(".$arg_column.")";
		}
		elseif ($arg_modifier == "ltrim")
		{
			return "LTRIM(".$arg_column.")";
		}
		elseif ($arg_modifier == "rtrim")
		{
			return "RTRIM(".$arg_column.")";
		}
		elseif ($arg_modifier == "aes_encrypt")
		{
			return "AES_ENCRYPT(".$arg_column.", 'AES_ENCRYPT')";
		}
		elseif ($arg_modifier == "aes_decrypt")
		{
			return "AES_DECRYPT(".$arg_column.", 'AES_ENCRYPT')";
		}
		elseif ($arg_modifier == "md5")
		{
			return "MD5(".$arg_column.")";
		}
		
		// NUMBER OPERATORS
		elseif ($arg_modifier == "abs")
		{
			return "ABS(".$arg_column.")";
		}
		elseif ($arg_modifier == "floor")
		{
			return "FLOOR(".$arg_column.")";
		}
		
		// DATE
		elseif ($arg_modifier == "date")
		{
			return "DATE(".$arg_column.")";
		}
		elseif ($arg_modifier == "day")
		{
			return "DAY(".$arg_column.")";
		}
		elseif ($arg_modifier == "week")
		{
			return "WEEK(".$arg_column.")";
		}
		elseif ($arg_modifier == "month")
		{
			return "MONTH(".$arg_column.")";
		}
		elseif ($arg_modifier == "year")
		{
			return "YEAR(".$arg_column.")";
		}
		elseif ($arg_modifier == "day of week")
		{
			return "DAYOFWEEK(".$arg_column.")";
		}
		elseif ($arg_modifier == "day of month")
		{
			return "DAYOFMONTH(".$arg_column.")";
		}
		elseif ($arg_modifier == "day of year")
		{
			return "DAYOFYEAR(".$arg_column.")";
		}
		elseif ($arg_modifier == "last day of month")
		{
			return "LAST_DAY(".$arg_column.")";
		}
		elseif ($arg_modifier == "quarter")
		{
			return "QUARTER(".$arg_column.")";
		}
		
		// TIME
		elseif ($arg_modifier == "time")
		{
			return "TIME(".$arg_column.")";
		}
		elseif ($arg_modifier == "hour")
		{
			return "HOUR(".$arg_column.")";
		}
		elseif ($arg_modifier == "minute")
		{
			return "MINUTE(".$arg_column.")";
		}
		elseif ($arg_modifier == "second")
		{
			return "SECOND(".$arg_column.")";
		}
		
		return TRACE::leaveko("SQLFiltersHelpers.getModifierSQLString", "bad modifier [$arg_modifier]", $arg_column, true);
	}
	
	
	/**
	 * @brief		Get the SQL string of an operator
	 * @param[in]	arg_operator		operator name (string)
	 * @param[in]	arg_type			values type name (string)
	 * @param[in]	arg_column			column name (string)
	 * @param[in]	arg_var1			operand value 1 (string)
	 * @param[in]	arg_var2			operand value 2 (string)
	 * @return		string
	 */
	static public function getOperatorSQLString($arg_operator, $arg_type, $arg_column, $arg_var1, $arg_var2)
	{
		// echo "arg_var1=$arg_var1 arg_type=$arg_type arg_operator=$arg_operator <BR>";
		// STRING OPERATORS
		if ( (! is_null($arg_var1) ) && $arg_type == "String")
		{
			if ($arg_operator == "equals" || $arg_operator == "==")
			{
				return $arg_column." = '".$arg_var1."'";
			}
			elseif ($arg_operator == "begins with")
			{
				return "LEFT(".$arg_column.", LENGTH('".$arg_var1."') ) = '".$arg_var1."'";
			}
			elseif ($arg_operator == "contains")
			{
				return "LOCATE('".$arg_var1."', ".$arg_column.") > 0";
			}
			elseif ($arg_operator == "ends with")
			{
				return "RIGHT(".$arg_column.", LENGTH('".$arg_var1."') ) = '".$arg_var1."'";
			}
			elseif ($arg_operator == "min length")
			{
				$filter = "LENGTH('".$filter_column."') >= ".$arg_var1;
			}
			elseif ($arg_operator == "max length")
			{
				$filter = "LENGTH('".$filter_column."') <= ".$arg_var1;
			}
			elseif ($arg_operator == "length between" && $arg_var2 != null)
			{
				$filter = "LENGTH('".$filter_column."') >= ".$arg_var1." AND LENGTH('".$filter_column."') <= ".$arg_var2;
			}
			elseif ($arg_operator == "in" || $arg_operator == "IN")
			{
				$str_array = explode(":", $arg_var1);
				if ( ! is_array($str_array) && ! is_null($arg_var1) && $arg_var1 != "")
				{
					$str_array = array($arg_var1);
				}
				$str = "'".implode("','", $str_array)."'";
				return $arg_column." IN (".$str.")";
			}
		}
		
		// INTEGER FILTERS
		elseif ( (! is_null($arg_var1) ) && $arg_type == "Integer")
		{
			if ($arg_operator == "equals" || $arg_operator == "==")
			{
				return $arg_column." = ".$arg_var1;
			}
			elseif ($arg_operator == "gt")
			{
				return $arg_column." > ".$arg_var1;
			}
			elseif ($arg_operator == "ge")
			{
				return $arg_column." >= ".$arg_var1;
			}
			elseif ($arg_operator == "lt")
			{
				return $arg_column." < ".$arg_var1;
			}
			elseif ($arg_operator == "le")
			{
				return $arg_column." <= ".$arg_var1;
			}
			elseif ($arg_operator == "between" && $arg_var2 != null)
			{
				return $arg_column." >= ".$arg_var1." AND ".$filter_column." <= ".$arg_var2;
			}
		}
		
		// DATE, TIME, DATETIME FILTERS
		elseif ( (! is_null($arg_var1) ) && ($arg_type == "Date" || $arg_type == "Time" || $arg_type == "DateTime") )
		{
			if ($arg_operator == "equals")
			{
				return $arg_column." = '".$arg_var1."'";
			}
			elseif ($arg_operator == "gt")
			{
				return $arg_column." > '".$arg_var1."'";
			}
			elseif ($arg_operator == "ge")
			{
				return $arg_column." >= '".$arg_var1."'";
			}
			elseif ($arg_operator == "lt")
			{
				return $arg_column." < '".$arg_var1."'";
			}
			elseif ($arg_operator == "le")
			{
				return $arg_column." <= '".$arg_var1."'";
			}
			elseif ($arg_operator == "between" && $arg_var2 != null)
			{
				return $arg_column." >= '".$arg_var1."' AND ".$filter_column." <= '".$arg_var2."'";
			}
		}
		
		return TRACE::leaveko("SQLFiltersHelpers.getOperatorSQLString", "bad operator [$arg_operator] for type [$arg_type] with var1 null?[".(is_null($arg_var1) ? "1" : "0"), null, true);
	}
}
?>