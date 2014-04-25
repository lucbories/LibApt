<?php
/**
 * @file        class_filters_chain.php
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
class FiltersChain extends NamedSessionProperties
{
	// STATIC ATTRIBUTES
	static public $TRACE = false;
	
	static protected $KEY_FILTERS_COUNT = "filters_count";
	static protected $KEY_FILTER_PREFIX = "filter_";
	
	// ATTRIBUTES
	protected $filters = null;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_load_from_session = true)
	{
		parent::__construct($arg_unique_name);
//		TRACE::trace_var("FiltersChain.constructor.arg_unique_name", $arg_unique_name);
//		TRACE::trace_var("FiltersChain.constructor.this->name", $this->name);
//		TRACE::trace_var("FiltersChain.constructor.this->getName", $this->getName());
		if ($arg_load_from_session)
		{
			$this->loadFromSession();
		}
	}
	
	
	// FILTERS OPERATIONS
	public function hasFilters()
	{
		return (! is_null($this->filters) ) and ( count($this->filters) > 0 );
	}
	
	public function getFilters()
	{
		return $this->filters;
	}
	
	public function setFilters($arg_filters)
	{
		if ( ! is_null($arg_filters) )
		{
			$this->filters = array();
			foreach($arg_filters as $key => $filter)
			{
				if ( ! is_null($filter) )
				{
					$this->addFilter($filter);
				}
				else
				{
					TRACE::addAlertMsg("FiltersChain.setFilters", "filter is null at key [$key]");
				}
			}
		}
	}
	
	public function getFiltersForField($arg_field_name)
	{
		$found_filters = array();
		
		// CHECK FILTETS ARRAY
		if ( ! is_null($this->filters) )
		{
			// SEARCH FILTERS
			foreach($this->filters as $filter)
			{
				if ( $filter->getFieldName() == $arg_field_name )
				{
					$found_filters[] = $filter;
				}
			}
		}
		
		return $found_filters;
	}
	
	public function getFiltersForFieldAndOp($arg_field_name, $arg_op)
	{
		$found_filters = array();
		
		// CHECK FILTETS ARRAY
		if ( ! is_null($this->filters) )
		{
			// SEARCH FILTERS
			foreach($this->filters as $filter)
			{
				if ( $filter->getFieldName() == $arg_field_name && $filter->getOperator() == $arg_op )
				{
					$found_filters[] = $filter;
				}
			}
		}
		
		return $found_filters;
	}
	
	public function getFilterAt($arg_index)
	{
		$context = "FiltersChain.getFilterAt";
		
		if ( is_null($this->filters) )
		{
			TRACE::leaveko($context, "Filter is null");
			return null;
		}
		
		$count = count($this->filters);
		if ($arg_index >= 0 and $arg_index < $count)
		{
			return $this->filters[$arg_index];
		}
		
		TRACE::leaveko($context, "Bad index [$arg_index]");
		return null;
	}
	
	public function setFilterAt($arg_index, $arg_filter)
	{
		$context = "FiltersChain.setFilterAt";
		
		if ( is_null($arg_filter) )
		{
			TRACE::leaveko($context, "Filter is null");
			return false;
		}
		
		if ( is_null($this->filters) )
		{
			TRACE::leaveko($context, "Filters array is null");
			return false;
		}
		
		$count = count($this->filters);
		if ($arg_index >= 0 and $arg_index < $count)
		{
			$this->filters[$arg_index] = $arg_filter;
		}
		else
		{
			TRACE::trace_var($context, "count", $count);
			TRACE::leaveko($context, "Bad index [$arg_index]");
			return false;
		}
		
		$key = $arg_index;
		$this->setSessionProperty(self::$KEY_FILTER_PREFIX.$key, serialize($arg_filter));
		$this->setSessionProperty(self::$KEY_FILTERS_COUNT, count($this->filters));
		return true;
	}
	
	public function removeFilterAt($arg_index)
	{
		$filters_count = count($this->filters);
		if ( ! is_null($this->filters) and $arg_index >= 0 and $arg_index < $filters_count )
		{
//			unset($this->filters[$arg_index]);
			
			$old_filters   = $this->filters;
			$this->filters = array();
			for($index = 0 ; $index < $filters_count ; $index++)
			{
				// REMOVE SESSION PROPERTY
				$key = $index;
				$this->resetSessionProperty(self::$KEY_FILTER_PREFIX.$key);
				
				// ADD FILTER
				$filter = $old_filters[$index];
				if ( ! is_null($filter) and $index != $arg_index)
				{
					$this->addFilter($filter);
				}
			}
			
			$filters_count   = count($this->filters);
			$this->setSessionProperty(self::$KEY_FILTERS_COUNT, $filters_count);
		}
	}
	
	public function addFilter($arg_filter)
	{
		$context = "FiltersChain.addFilter";
		
		// CHECK FILTER
		CONTRACT::assertInherit($context.".filter", $arg_filter, "Filter");
		
		// INIT FILTERS ARRAY
		if ( is_null($this->filters) )
		{
			$this->filters = array();
		}
		
		// ADD FILTER
		$this->filters[] = $arg_filter;
		$filters_count   = count($this->filters);
		$filter_index    = $filters_count - 1;
		$this->setSessionProperty(self::$KEY_FILTER_PREFIX.$filter_index, serialize($arg_filter));
		$this->setSessionProperty(self::$KEY_FILTERS_COUNT, $filters_count);
	}
	
	
	// LOAD FILTERS CHAIN FROM SESSION
	public function loadFromSession()
	{
		$context = "FiltersChain.loadFromSession.";
//		TRACE::enter($context);
		
//		TRACE::trace_var($context."name", $this->getName());
		if ( $this->hasSessionProperty(self::$KEY_FILTERS_COUNT) )
		{
			// LOAD FILTERS COUNT
			$filters_count = $this->getSessionProperty(self::$KEY_FILTERS_COUNT, 0);
//			TRACE::trace_var($context.self::$KEY_FILTERS_COUNT, $filters_count);
			
			// INIT FILTERS ARRAY WITH NULL
			$this->filters = array();
			for($index = 0 ; $index < $filters_count ; $index++)
			{
//				TRACE::trace_var("set null filter at", $index);
				$this->filters[$index] = null;
			}
			
			// FILL FILTERS ARRAY WITH SESSION PROPERTIES
			for($index = 0 ; $index < $filters_count ; $index++)
			{
				$filter_key = self::$KEY_FILTER_PREFIX.$index;
				if ( $this->hasSessionProperty($filter_key) )
				{
//					TRACE::trace_var($context."property found", $filter_key);
					$stream = $this->getSessionProperty($filter_key, null);
					if ( ! is_null($stream) )
					{
						$filter = unserialize($stream);
						if ( ! is_null($filter) )
						{
//							TRACE::trace_var($context."no null filter at", $index);
//							TRACE::trace_var($context."filter found", $filter->getLabel());
							$this->filters[$index] = $filter;
						}
						else
						{
							$this->resetSessionProperty($filter_key);
							TRACE::leaveko($context, "Bad filter unserialize");
							return false;
						}
					}
					else
					{
						$this->resetSessionProperty($filter_key);
						TRACE::leaveko($context, "Null filter stream");
						return false;
					}
				}
				else
				{
					TRACE::addWarningMsg($context, "filter session property not found at index (0+) $index");
				}
			}
		}
		
//		TRACE::finok($context);
		return true;
	}
	
	
	// SAVE FILTERS CHAIN TO SESSION
	public function saveToSession()
	{
		$context = "FiltersChain.saveToSession.";
//		TRACE::enter($context);
		
		// SAVE FILTERS COUNT
		$filters_count = count($this->filters);
		$this->setSessionProperty(self::$KEY_FILTERS_COUNT, $filters_count);
//		TRACE::trace_var($context.self::$KEY_FILTERS_COUNT, $filters_count);
		
		// SAVE FILTERS ARRAY TO SESSION PROPERTIES
		for($index = 0 ; $index < $filters_count ; $index++)
		{
			$filter = $this->filters[$index];
			
			if ( ! is_null($filter) )
			{
				$filter_key = self::$KEY_FILTER_PREFIX.$index;
				$stream = serialize($filter);
				if ( ! is_null($stream) )
				{
					TRACE::leaveko($context, "Null filter stream");
					return false;
				}
				$this->setSessionProperty($filter_key, $stream);
//				TRACE::trace_var($context."filter", $filter->getLabel());
			}
			else
			{
				TRACE::addWarningMsg($context, "filter is null at index (1+) $index");
			}
		}
		
//		TRACE::finok($context);
		return true;
	}
	
	
	// LOAD FILTERS CHAIN FROM STRING
	public function loadFromString($arg_string)
	{
		$context = "FiltersChain.loadFromString.";
		
		$chain_parts = explode("|", $arg_string);
		
		// LOOP ON EACH FILTER STRING
		foreach($chain_parts as $key => $value)
		{
			TRACE::trace_var($context, "key", $key);
			TRACE::trace_var($context, "value", $value);
			
			// OPEN GROUP
			if ($value == "(")
			{
			}
			// CLOSE GROUP
			elseif ($value == ")")
			{
			}
			// JOIN WITH AND
			elseif ($value == "AND")
			{
			}
			// JOIN WITH OR
			elseif ($value == "OR")
			{
			}
			
			// UNARY OPERATOR
			elseif ($value == "UNOP:")
			{
				$filter_parts = explode(",", $value);
				$filter_op = null;
				$filter_field_name = null;
				$filter_field_modifier = null;
				foreach($filter_parts AS $filter_part)
				{
					$property_parts = explode("=", $filter_part);
					if (count($property_parts) != 2)
					{
						TRACE::trace_var($context, "filter_part", $filter_part);
						TRACE::leaveko($context, "Bad property part");
						return false;
					}
					$property_left = $property_parts[0];
					$property_right = $property_parts[1];
					if ($property_left == "OP")
					{
						$filter_op = $property_right;
					}
					elseif ($property_left == "MOD")
					{
						$filter_field_modifier = $property_right;
					}
					elseif ($property_left == "FIELD")
					{
						$filter_field_name = $property_right;
					}
					else
					{
						TRACE::trace_var($context, "property_left", $property_left);
						TRACE::trace_var($context, "property_right", $property_right);
						TRACE::leaveko($context, "Bad property");
						return false;
					}
					
					// LOAD UNOP FILTER
					if ( ! loadFilterUnop($filter_field_name, $filter_field_modifier, $filter_op) )
					{
						TRACE::leaveko($context, "Load unop filter failed");
						return false;
					}
				}
			}
			
			// BINARY OPERATOR
			elseif ($value == "BINOP:")
			{
				$filter_parts = explode(",", $value);
				$filter_op = null;
				$filter_field_name = null;
				$filter_field_modifier = null;
				$filter_operand = null;
				foreach($filter_parts AS $filter_part)
				{
					$property_parts = explode("=", $filter_part);
					if (count($property_parts) != 2)
					{
						TRACE::trace_var($context, "filter_part", $filter_part);
						TRACE::leaveko($context, "Bad property part");
						return false;
					}
					$property_left = $property_parts[0];
					$property_right = $property_parts[1];
					if ($property_left == "OP")
					{
						$filter_op = $property_right;
					}
					elseif ($property_left == "MOD")
					{
						$filter_field_modifier = $property_right;
					}
					elseif ($property_left == "FIELD")
					{
						$filter_field_name = $property_right;
					}
					elseif ($property_left == "VAR")
					{
						$filter_operand = $property_right;
					}
					else
					{
						TRACE::trace_var($context, "property_left", $property_left);
						TRACE::trace_var($context, "property_right", $property_right);
						TRACE::leaveko($context, "Bad property");
						return false;
					}
					
					// LOAD BINOP FILTER
					if ( ! loadFilterBinop($filter_field_name, $filter_field_modifier, $filter_op, $filter_operand) )
					{
						TRACE::leaveko($context, "Load binop filter failed");
						return false;
					}
				}
			}
			
			// TRINARY OPERATOR
			elseif ($value == "TRIOP:")
			{
				$filter_parts = explode(",", $value);
				$filter_op = null;
				$filter_field_name = null;
				$filter_field_modifier = null;
				$filter_operand1 = null;
				$filter_operand2 = null;
				foreach($filter_parts AS $filter_part)
				{
					$property_parts = explode("=", $filter_part);
					if (count($property_parts) != 2)
					{
						TRACE::trace_var($context, "filter_part", $filter_part);
						TRACE::leaveko($context, "Bad property part");
						return;
					}
					$property_left = $property_parts[0];
					$property_right = $property_parts[1];
					if ($property_left == "OP")
					{
						$filter_op = $property_right;
					}
					elseif ($property_left == "MOD")
					{
						$filter_field_modifier = $property_right;
					}
					elseif ($property_left == "FIELD")
					{
						$filter_field_name = $property_right;
					}
					elseif ($property_left == "VAR1")
					{
						$filter_operand1 = $property_right;
					}
					elseif ($property_left == "VAR2")
					{
						$filter_operand2 = $property_right;
					}
					else
					{
						TRACE::trace_var($context, "property_left", $property_left);
						TRACE::trace_var($context, "property_right", $property_right);
						TRACE::leaveko($context, "Bad property");
						return false;
					}
					
					// LOAD BINOP FILTER
					if ( ! loadFilterTriop($filter_field_name, $filter_field_modifier, $filter_op, $filter_operand1, $filter_operand2) )
					{
						TRACE::leaveko($context, "Load triop filter failed");
						return false;
					}
				}
			}
			
			// TRINARY OPERATOR
			else
			{
				TRACE::leaveko($context, "Load filter failed : bad parts");
				return false;
			}
		}
		
		return true;
	}
	
	
	// SAVE FILTERS CHAIN TO STRING
	public function saveToString($arg_string)
	{
		return false;
	}
	
	
	// LOAD UNOP FILTER
	public function loadFilterUnop($arg_filter_field_name, $arg_filter_field_modifier, $arg_filter_op)
	{
		return true;
	}
	
	
	// LOAD BINOP FILTER
	public function loadFilterBinop($arg_filter_field_name, $arg_filter_field_modifier, $arg_filter_op, $arg_filter_operand)
	{
		return true;
	}
	
	
	// LOAD TRIOP FILTER
	public function loadFilterTriop($arg_filter_field_name, $arg_filter_field_modifier, $arg_filter_op, $arg_filter_operand1, $arg_filter_operand2)
	{
		$this->filters[] = new Filter();
		return true;
	}
}


?>
