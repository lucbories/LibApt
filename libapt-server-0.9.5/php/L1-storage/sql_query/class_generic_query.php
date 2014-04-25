<?php
/**
 * @file        class_generic_query.php
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
class GenericQuery extends AbstractQuery
{
	// STATIC ATTRIBUTES
	static public $TRACE_GENERIC_QUERY = false;
	
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_fieds_set, $arg_type)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_fieds_set, $arg_type);
	}
	
	
	// COMPILE
	protected function compile()
	{
		$context = "GenericQuery.compile";
		TRACE::enter($context, "", self::$TRACE_GENERIC_QUERY);
		
		
		// CHECK INPUT VALUES
		$result = $this->checkAssocValues();
		if ( ! $result )
		{
			return TRACE::leaveko($context, "check input_values failed", false, self::$TRACE_GENERIC_QUERY);
		}
		
		// TEST QUERY TYPE
		if ($this->type == self::$TYPE_INSERT)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, false, false);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "INSERT", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_INSERT_IGNORE)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, true, false);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "INSERT IGNORE", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_REPLACE)
		{
			$this->compiled_sql = SQLBuilder::getInsertRow($this->input_fields, $this->input_values, $this->input_crud_db, $this->input_crud_table, false, true);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "REPLACE", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getSelectFields($this->input_fields, $this->input_filters, $this->input_orders, $this->input_groups, $slice_offset, $slice_length, $this->input_joins);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "SELECT", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT_DISTINCT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$has_foreign_keys = false;
			$this->compiled_sql = SQLBuilder::getSelectDistinctField($this->input_fields, $this->input_filters, $this->input_orders, $this->input_groups, $slice_offset, $slice_length, $has_foreign_keys, $this->input_joins);
			
			TRACE::trace_var($context, "TYPE_SELECT_DISTINCT - query->compiled_sql", $this->compiled_sql, self::$TRACE_GENERIC_QUERY);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "SELECT DISTINCT", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT_DISTINCT_ONE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$has_foreign_keys	= false;
			$distinct_field		= $this->input_one_field;
			$this->compiled_sql	= SQLBuilder::getSelectDistinctOneField($distinct_field, $this->input_fields, $this->input_filters, $this->input_orders, $this->input_groups, $slice_offset, $slice_length, $has_foreign_keys, $this->input_joins);
			
			TRACE::trace_var($context, "TYPE_SELECT_DISTINCT_ONE - query->compiled_sql", $this->compiled_sql, self::$TRACE_GENERIC_QUERY);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "SELECT DISTINCT ONE", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_SELECT_COUNT)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getSelectCountField($this->input_fields, $this->input_filters, $slice_offset, $slice_length, $this->input_joins);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "SELECT COUNT", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_UPDATE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getUpdateRows($this->input_fields, $this->input_filters, $this->input_values, $this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "UPDATE", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_DELETE)
		{
			$slice_offset = null;
			$slice_length = null;
			if ( ! is_null($this->input_slice) )
			{
				$slice_offset = $this->input_slice["offset"];
				$slice_length = $this->input_slice["length"];
			}
			$this->compiled_sql = SQLBuilder::getDeleteRows($this->input_fields, $this->input_filters, $this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "DELETE", true, self::$TRACE_GENERIC_QUERY);
		}
		
		if ($this->type == self::$TYPE_DELETE_ALL)
		{
			$this->compiled_sql = SQLDeleteHelpers::getDeleteAllString($this->input_crud_db, $this->input_crud_table);
			
			$result = ! is_null($this->compiled_sql);
			return TRACE::leave($context, $result, "DELETE ALL", true, self::$TRACE_GENERIC_QUERY);
		}
		
		return TRACE::leaveko($context, "failure: unknow type[".$this->type."]", false, self::$TRACE_GENERIC_QUERY);
	}
	
	
	
	
	protected function checkAssocValues()
	{
		$context = "GenericQuery.checkAssocValues";
		TRACE::enter($context, "", self::$TRACE_GENERIC_QUERY);
		
		
		// CHECK NULL ARRAYS
		if ( is_null($this->input_values) and is_null($this->input_fields) )
		{
			return TRACE::leaveok($context, "input_values and input_fields are null", true, self::$TRACE_GENERIC_QUERY);
		}
		if ( is_null($this->input_values) )
		{
			TRACE::trace_var($context, "input_fields.count", count($this->input_fields), self::$TRACE_GENERIC_QUERY);
			return TRACE::leaveok($context, "input_values is null", true, self::$TRACE_GENERIC_QUERY);
		}
		if ( is_null($this->input_fields) )
		{
			TRACE::trace_var($context, "input_values", $this->input_values, self::$TRACE_GENERIC_QUERY);
			return TRACE::leaveok($context, "input_fields is null", true, self::$TRACE_GENERIC_QUERY);
		}
		TRACE::trace_var($context, "input_values", $this->input_values, self::$TRACE_GENERIC_QUERY);
		
		// GET ARRAYS SIZE
		$input_values_count = count($this->input_values);
		$input_values_keys  = array_keys($this->input_values);
		$input_fields_count = count($this->input_fields);
		TRACE::trace_var($context, "input_values_keys", $input_values_keys, self::$TRACE_GENERIC_QUERY);
		TRACE::trace_var($context, "input_values_count", $input_values_count, self::$TRACE_GENERIC_QUERY);
		TRACE::trace_var($context, "input_fields_count", $input_fields_count, self::$TRACE_GENERIC_QUERY);
		
		// TEST IF THE ARRAY IS INDEXED BY INTEGERS
		$last_index			= $input_values_count - 1;
		$first_key			= $input_values_keys[0];
		$last_key			= $input_values_keys[$last_index];
		TRACE::trace_var($context, "last_index",					$last_index, self::$TRACE_GENERIC_QUERY);
		TRACE::trace_var($context, "first_key",						$first_key, self::$TRACE_GENERIC_QUERY);
		TRACE::trace_var($context, "last_key",						$last_key, self::$TRACE_GENERIC_QUERY);
		TRACE::trace_var($context, "first_key == 0",				($first_key == "0")?'OK':'KO', self::$TRACE_GENERIC_QUERY);
		TRACE::trace_var($context, "last_key == last_index", 		($last_key == "$last_index")?'OK':'KO', self::$TRACE_GENERIC_QUERY);
		
		$is_indexed_values_array = $first_key == "0" && $last_key == "$last_index";
		TRACE::trace_var($context, "is_indexed_values_array", $is_indexed_values_array, self::$TRACE_GENERIC_QUERY);
		
		
		// CHECK VALUES COUNT
		if ($input_values_count == 0 && $input_fields_count == 0)
		{
			return TRACE::leaveok($context, "no values to check", true, self::$TRACE_GENERIC_QUERY);
		}
		if ($input_values_count == 0 && $input_fields_count != 0)
		{
			return TRACE::leaveko($context, "bad values count ($input_values_count) for fields count ($input_fields_count)", false, self::$TRACE_GENERIC_QUERY);
		}
		
		
		// REMOVE UNUSED PASSWORD VALUES (OLDHASH, NEW, CONFIRM) AND LEAVE NEWHASH
		// INDEXED VALUES ARRAY
		if ($is_indexed_values_array)
		{
			TRACE::step($context, "input_values is an indexed array", self::$TRACE_GENERIC_QUERY);
			
			TRACE::trace_var($context, "this->input_values before remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
			
			$tmp_values = $this->input_values;
			$value_index = 0;
			$this->input_values = array();
			TRACE::trace_var($context, "this->input_values", $this->input_values, self::$TRACE_GENERIC_QUERY);
			TRACE::trace_var($context, "tmp_values", $tmp_values, self::$TRACE_GENERIC_QUERY);
			foreach($this->input_fields as $field)
			{
				TRACE::trace_var($context, "value_index", $value_index == 0 ? "0" : $value_index, self::$TRACE_GENERIC_QUERY);
				TRACE::trace_var($context, "field.name", $field->getName(), self::$TRACE_GENERIC_QUERY);
				
				if ($field->getType() == TYPE::$TYPE_PASSWORD)
				{
					// TODO : rework this part (to remove?)
					TRACE::step($context, "field type is password", self::$TRACE_GENERIC_QUERY);
					++$value_index;
					++$value_index;
					++$value_index;
				}
				
				TRACE::trace_var($context, "field value", $tmp_values[$value_index], self::$TRACE_GENERIC_QUERY);
				$this->input_values[] = $tmp_values[$value_index];
				++$value_index;
			}
			
			TRACE::trace_var($context, "this->input_values after remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
		}
		// ASSOCIATIVE VALUES ARRAY
		else
		{
			// TODO class_geenric_query checkAssocValues : REMOVE UNUSED PASSWORD VALUES for ASSOCIATIVE ARRAY
			TRACE::trace_var($context, "this->input_values remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
			
			foreach($this->input_fields as $field)
			{
				if ($field->getType() == TYPE::$TYPE_PASSWORD)
				{
					$field_name = $field->getName();
					unset($this->input_values[$field_name."_oldhash"]);
					unset($this->input_values[$field_name."_new"]);
					unset($this->input_values[$field_name."_confirm"]);
				}
			}
			
			$input_values_count = count($this->input_values);
			$input_values_keys  = array_keys($this->input_values);
			TRACE::trace_var($context, "this->input_values remove unused", $this->input_values, self::$TRACE_GENERIC_QUERY);
		}
		
		
		// CHECK VALUES COUNT
		$have_same_count = ($input_values_count > 0 && $input_values_count == $input_fields_count);
		if ($have_same_count)
		{
			// MAKE AN ASSOCIATIVE ARRAY FROM AN INDEXED ARRAY
			if ( $is_indexed_values_array )
			{
				$tmp_values = $this->input_values;
				$tmp_index  = 0;
				$this->input_values = array();
				
				foreach($this->input_fields as $field)
				{
					$this->input_values[$field->getName()] = $tmp_values[$tmp_index];
					$tmp_index += 1;
				}
				
				TRACE::trace_var($context, "input_values assoc", $this->input_values, self::$TRACE_GENERIC_QUERY);
				
				return TRACE::leaveok($context, "success", true, self::$TRACE_GENERIC_QUERY);
			}
			
			// ASSOCIATIVE VALUES ARRAY : NOTHING TO DO
			return TRACE::leaveok($context, "nothing to do for an associative array", true, self::$TRACE_GENERIC_QUERY);
		}
		
		// RESET INPUT VALUES
		$this->input_values = null;
		
		// ALWAYS TRACE THE PROBLEM
		// TRACE::addAlertMsg($context, "bad values count ($input_values_count) for fields count ($input_fields_count)", true);
		
		return TRACE::leaveko($context, "bad values count ($input_values_count) for fields count ($input_fields_count)", false, self::$TRACE_GENERIC_QUERY);
	}
}
?>