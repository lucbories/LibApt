<?php
/**
 * @file        class_filter.php
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
class Filter
{
	// STATIC ATTRIBUTES
	static public $TRACE = false;
	
	static public $GROUP_OPERATORS = array("", "(", ")");
	static public $JOIN_OPERATORS = array("", "and", "or");
	static public $TYPES = array("String", "Integer", "Float", "Date", "Time", "DateTime", "Boolean");
	static public $OPERATORS = array(
		// ALL TYPES OPERATORS
		"equals", "notequals", "isnull", "isnotnull",
		// STRING OPERATORS
		"begins with", "contains", "ends with", "min length", "max length", "length between", "in",
		// NUMBER OPERATORS
		"gt", "ge", "lt", "le", "between"
		);
	static public $MODIFIERS = array(
		"nothing",
		// STRING OPERATORS
		"upper", "lower", "ltrim", "rtrim", "aes_encrypt", "aes_decrypt", "md5",
		// NUMBER OPERATORS
		"abs", "floor",
		// DATE TIME
		"date", "day", "week", "month", "year", "day of week", "day of month", "day of year", "last day of month", "quarter",
		// DATE TIME
		"time", "hour", "minute", "second"
		);
	
	// FIELD DEFINITION ITEMS
	protected $string_key = null;
	protected $key = null;
	protected $record = null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_group_mode, $arg_join_mode, $arg_field_name, $arg_type,
								$arg_modifier, $arg_op, $arg_var1, $arg_var2)
	{
		$this->group_mode = $arg_group_mode;
		$this->join_mode = $arg_join_mode;
		$this->record = array();
		$this->resetAttributes($arg_group_mode, $arg_join_mode, $arg_field_name, $arg_type, $arg_modifier, $arg_op, $arg_var1, $arg_var2);
	}
	
	
	// STATIC ATTRIBUTES
	static public function getTypes()
	{
		return self::$TYPES;
	}
	
	static public function getOperators()
	{
		return self::$OPERATORS;
	}
	
	static public function getModifiers()
	{
		return self::$MODIFIERS;
	}
	
	static public function getOperands($arg_operator)
	{
		// BINARY OPERATORS
		if ($arg_operator == "equals" || $arg_operator == "notequals" || $arg_operator == "length between"
			|| $arg_operator == "gt" || $arg_operator == "ge" || $arg_operator == "lt" || $arg_operator == "le" || $arg_operator == "between")
		{
			return 2;
		}
		
		// UNARY OPERATORS
		return 1;
	}
	
	
	// GET ATTRIBUTE
	public function getGroupMode()
	{
		return $this->group_mode;
	}
	
	public function getJoinMode()
	{
		return $this->join_mode;
	}
	
	public function getFieldName()
	{
		return $this->getAttribute("field_name");
	}
	
	public function getModifier()
	{
		return $this->getAttribute("filter_modifier");
	}
	
	public function getType()
	{
		return $this->getAttribute("filter_type");
	}
	
	public function getOperator()
	{
		return $this->getAttribute("filter_op");
	}
	
	public function getOperand1()
	{
		return $this->getAttribute("filter_var1");
	}
	
	public function getOperand2()
	{
		return $this->getAttribute("filter_var2");
	}
	
	
	// FIELDS
	public function getOperand($arg_index)
	{
		if ( is_numeric($arg_index) )
		{
			$operand_str = $this->getAttribute("filter_var".$arg_index);
			return $this->getOperandValue($operand_str);
		}
		if ( is_string($arg_index) )
		{
			$operand_str = $this->getAttribute($arg_index);
			return $this->getOperandValue($operand_str);
		}
		return null;
	}
	
	public function getOperandValue($arg_operand_str)
	{
		return PredefinedInputs::getInput($arg_operand_str, $arg_operand_str);
	}
	
	public function resetAttributes($arg_group_mode, $arg_join_mode, $arg_field_name, $arg_type, $arg_modifier, $arg_op, $arg_var1, $arg_var2)
	{
		$context = "Filter.resetAttributes";
		
		$this->record["group_mode"] = null;
		$this->group_mode = null;
		$this->record["join_mode"]  = null;
		$this->join_mode = null;
		
		$this->record["field_name"]  = null;
		$this->record["filter_modifier"] = null;
		$this->record["filter_type"] = null;
		
		$this->record["filter_op"]   = null;
		$this->record["filter_var1"] = null;
		$this->record["filter_var2"] = null;
		
		if ( ! in_array($arg_group_mode, self::$GROUP_OPERATORS) )
		{
			$args = array($arg_group_mode, $arg_join_mode, $arg_field_name, $arg_type, $arg_modifier, $arg_op, $arg_var1, $arg_var2);
			$args_str = implode(",", $args);
			TRACE::trace_var($context, "args", $args_str, self::$TRACE);
			return TRACE::leaveko($context, "bad group mode [$arg_group_mode]", false, self::$TRACE);
		}
		if ( ! in_array($arg_join_mode, self::$JOIN_OPERATORS) )
		{
			return TRACE::leaveko($context, "bad join mode [$arg_join_mode]", false, self::$TRACE);
		}
		if ( ! in_array($arg_type, self::$TYPES) )
		{
			return TRACE::leaveko($context, "bad type [$arg_type]", false, self::$TRACE);
		}
		if ( ! in_array($arg_op, self::$OPERATORS) )
		{
			return TRACE::leaveko($context, "bad operator [$arg_op]", false, self::$TRACE);
		}
		if ( ! is_null($arg_modifier) and $arg_modifier != "" and ! in_array($arg_modifier, self::$MODIFIERS) )
		{
			return TRACE::leaveko($context, "bad modifier [$arg_modifier]", false, self::$TRACE);
		}
		
		
		// CHECK GIVEN VALUE 1
		$to_replace = array("%", "(", ")", "\n", "\r", ";", "&", "$", "*", "'", '"');
		$arg_var1 = str_replace($to_replace, "", $arg_var1);
		$arg_var1 = htmlspecialchars($arg_var1);
		
		$to_replace = array("#39", "#34");
		$arg_var1 = str_replace($to_replace, "", $arg_var1);
		$arg_var1 = htmlspecialchars_decode($arg_var1);
		
		
		// CHECK GIVEN VALUE 2
		$to_replace = array("%", "(", ")", "\n", "\r", ";", "&", "$", "*", "'", '"');
		$arg_var2 = str_replace($to_replace, "", $arg_var2);
		$arg_var2 = htmlspecialchars($arg_var2);
		
		$to_replace = array("#39", "#34");
		$arg_var2 = str_replace($to_replace, "", $arg_var2);
		$arg_var2 = htmlspecialchars_decode($arg_var2);
		
		
		// SAVE VALUES
		$this->record["group_mode"] = $arg_group_mode;
		$this->record["join_mode"]  = $arg_join_mode;
		$this->group_mode = $arg_group_mode;
		$this->join_mode = $arg_join_mode;
		
		$this->record["field_name"]  = $arg_field_name;
		$this->record["filter_modifier"] = $arg_modifier;
		$this->record["filter_type"] = $arg_type;
		
		$this->record["filter_op"]   = $arg_op;
		$this->record["filter_var1"] = $arg_var1;
		$this->record["filter_var2"] = $arg_var2;
		
		$this->updateKey();
		
		TRACE::trace_var($context, "record", $this->record, self::$TRACE);
		return true;
	}
	
	public function hasAttributesValues($arg_group_mode, $arg_join_mode, $arg_field_name, $arg_type, $arg_op, $arg_modifier, $arg_var1, $arg_var2)
	{
		$result1 = $this->record["group_mode"] == $arg_group_mode;
		$result1 = $this->record["join_mode"]  == $arg_join_mode;
		
		$result1 = $this->record["field_name"]  == $arg_field_name;
		$result4 = $this->record["filter_modifier"] == $arg_modifier;
		$result2 = $this->record["filter_type"] == $arg_type;
		
		$result3 = $this->record["filter_op"]   == $arg_op;
		$result5 = $this->record["filter_var1"] == $arg_var1;
		$result6 = $this->record["filter_var2"] == $arg_var2;
		
		return $result1 and $result2 and $result3 and $result4 and $result5 and $result6;
	}
	
	public function hasAttribute($arg_attribute)
	{
		return array_key_exists($arg_attribute, $this->record);
	}
	
	public function getAttributes()
	{
		return $this->record;
	}
	
	public function getAttribute($arg_attribute)
	{
		return $this->record[$arg_attribute];
	}
	
	public function setAttribute($arg_attribute, $arg_value)
	{
		if ( $arg_attribute == "group_mode" and ! in_array($arg_value, self::$GROUP_OPERATORS) )
		{
//			echo "bad type : ".$arg_value."\n";
			return false;
		}
		if ( $arg_attribute == "join_mode" and ! in_array($arg_value, self::$JOIN_OPERATORS) )
		{
//			echo "bad type : ".$arg_value."\n";
			return false;
		}
		if ( $arg_attribute == "filter_type" and ! in_array($arg_value, self::$TYPES) )
		{
//			echo "bad type : ".$arg_value."\n";
			return false;
		}
		if ( $arg_attribute == "filter_op" and ! in_array($arg_value, self::$OPERATORS) )
		{
//			echo "bad mode : ".$arg_value."\n";
			return false;
		}
		if ( $arg_attribute == "filter_modifier" and ! in_array($arg_modifier, self::$MODIFIERS) )
		{
//			echo "bad modifier\n";
			return false;
		}
		if ( $arg_attribute == "filter_var1" or $arg_attribute == "filter_var2" )
		{
			// CHECK GIVEN VALUES
			$to_replace = array("%", "(", ")", "'", "\"", "\n", "\r");
			$arg_value = str_replace($to_replace, "", $arg_value);
		}
		
		$this->record[$arg_attribute] = $arg_value;
		$this->string_key = null;
		$this->key = null;
		
		if ( $arg_attribute == "group_mode" )
		{
			$this->group_mode = $arg_value;
		}
		if ( $arg_attribute == "join_mode" )
		{
			$this->join_mode = $arg_value;
		}
		
		return true;
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
		return http_build_query($this->record);
	}
	
	protected function updateKey()
	{
		$this->string_key = "FILTER{".$this->getURLAttributes()."}";
		$this->key = md5($this->string_key);
	}
	
	
	
	// BUILD A FILTER LABEL
	public function getLabel()
	{
		$group_mode = $this->record["group_mode"];
		$join_mode  = $this->record["join_mode"];
		
		$field_name = $this->record["field_name"];
		$field_modifier = $this->record["filter_modifier"];
		$field_type = $this->record["filter_type"];
		
		$op = $this->record["filter_op"];
		$var1 = $this->record["filter_var1"];
		$var2 = $this->record["filter_var2"];
		
		
		$group_mode = is_null($group_mode) ? "" : $group_mode;
		$join_mode  = is_null($join_mode)  ? "" : " ".$join_mode." ";
		
		$field_name = is_null($field_name) ? "" : $field_name;
		$field_type = is_null($field_type) ? $field_name : $field_type."(".$field_name.")";
		$field_label= is_null($field_modifier) ? $field_type : $field_modifier."(".$field_type.")";
		
		$op_label = "";
		$var1 = is_null($var1) ? "" : $var1;
		$var2 = is_null($var2) ? "" : $var2;
		
		if ( ! is_null($op) and $op != "" )
		{
			$op_label = $this->getOpLabel($op);
		}
		
		$operands_count = $this->getOperands($op);
		if ($operands_count == 1)
		{
			return $group_mode.$join_mode.$field_label."(".$var1.")";
		}
		elseif ($operands_count == 2)
		{
			return $group_mode.$join_mode.$field_label."(".$var1.",".$var2.")";
		}
		else
		{
			return $group_mode.$join_mode.$field_label."()";
		}
	}
	
	public function getOpLabel($op)
	{
		if ($op == "equals")
		{
			return "==";
		}
		if ($op == "equals")
		{
			return "!=";
		}
		if ($op == "isnull")
		{
			return "is null";
		}
		if ($op == "isnotnull")
		{
			return "is not null";
		}
		if ($op == "gt")
		{
			return ">";
		}
		if ($op == "ge")
		{
			return ">=";
		}
		if ($op == "lt")
		{
			return "<";
		}
		if ($op == "le")
		{
			return "<=";
		}
		if ($op == "between")
		{
			return "between";
		}
		if ($op == "in")
		{
			return "in";
		}
		
		if ($op == "min length")
		{
			return "min_length";
		}
		if ($op == "max length")
		{
			return "max_length";
		}
		if ($op == "length between")
		{
			return "between_length";
		}
		
		if ($op == "begins with")
		{
			return "begins_with";
		}
		if ($op == "ends with")
		{
			return "ends_with";
		}
		if ($op == "contains")
		{
			return "contains";
		}
		
		return "UNKNOW";
	}
	
	
	// BUILD FROM STRING
	// filter = field='',type='ttt',op='ooo',modifier='mm',var1='',var2=''
	public static function buildFilterFromString($arg_string)
	{
		$context = "Filter.buildFilterFromString";
		TRACE::trace_var($context, "arg_string", $arg_string, self::$TRACE);
		
		$filter_items = explode(",", $arg_string);
		
		$filter_group = null;
		$filter_join = null;
		$filter_field_name = null;
		$filter_type = null;
		$filter_op = null;
		$filter_modifier = null;
		$filter_var1 = null;
		$filter_var2 = null;
		foreach($filter_items as $item_str)
		{
			$item = explode("=", $item_str);
			$name = $item[0];
			$value= $item[1];
			TRACE::trace_var($context, "name:value", $name.":".$value, self::$TRACE);
			
			if ($name == "group")
			{
				$filter_group = $value;
			}
			elseif ($name == "join")
			{
				$filter_join = $value;
			}
			elseif ($name == "field")
			{
				$filter_field_name = $value;
			}
			elseif ($name == "type")
			{
				$filter_type = $value;
			}
			elseif ($name == "op")
			{
				$filter_op = $value;
			}
			elseif ($name == "modifier")
			{
				$filter_modifier = $value;
			}
			elseif ($name == "var1")
			{
				$filter_var1 = $value;
			}
			elseif ($name == "var2")
			{
				$filter_var2 = $value;
			}
			else
			{
				TRACE::trace_var($context, "arg_string", $arg_string, self::$TRACE);
				return TRACE::leaveko($context, "bad item name [$name]", null, self::$TRACE);
			}
		}
		if ( is_null($filter_field_name) or is_null($filter_type) or is_null($filter_op) )
		{
			return TRACE::leaveko($context, "bad format[$arg_string]", null, self::$TRACE);
		}
		
		return new self($filter_group, $filter_join, $filter_field_name, $filter_type, $filter_modifier, $filter_op, $filter_var1, $filter_var2);
	}
	
	// filters = filter|filter|filter...
	public static function buildFiltersFromString($arg_string)
	{
		$context = "Filter.buildFiltersFromString";
		TRACE::trace_var($context, "arg_string", $arg_string, self::$TRACE);
		
		$filters_strings = explode("|", $arg_string);
		$filters = array();
		TRACE::trace_var($context, "filters_strings", $filters_strings, self::$TRACE);
		
		foreach($filters_strings as $key => $filter_string)
		{
			$filter_string = ltrim($filter_string, '"');
			$filter_string = rtrim($filter_string, '"');
			if ( ! is_null($filter_string) and $filter_string != "")
			{
				$filters[] = Filter::buildFilterFromString($filter_string);
			}
		}
		
		return $filters;
	}
}


?>
