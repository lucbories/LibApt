<?php
/**
 * @file        class_abstract_field_impl.php
 * @brief       Abstract class for fields (implementation)
 * @details     ...
 * @see			AbstractField TRACE Type
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */
abstract class AbstractFieldImpl extends AbstractField
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		key of the field in a string format
	protected $string_key = null;
	
	/// @brief		key of the field
	protected $key = null;
	
	/// @brief		field attributes record
	protected $record = null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	protected function __construct()
	{
		$this->record = array();
	}
	
	
	
	// ----------------- FIELD ATTRIBUTES -----------------
	
	/**
	 * @brief		test if a field has the given attribute
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @return		boolean				true : field has attribute, false : field haven't attribute
	 */
	public function hasAttribute($arg_attribute)
	{
		return array_key_exists($arg_attribute, $this->record);
	}
	
	
	/**
	 * @brief		test if a field has the given attributes values list
	 * @param[in]	arg_attributes_values	field attributes values key/value (array)
	 * @return		boolean					true : field has all attributes, false : field haven't all attributes
	 */
	public function hasAttributesValues($arg_attributes_values)
	{
		foreach($arg_attributes_values as $attribute_name=>$attribute_value)
		{
			if ( ! $this->hasAttribute($attribute_name) )
			{
				return false;
			}
			
			if ( $this->getAttribute($attribute_name) != $attribute_value )
			{
				return false;
			}
		}
		return true;
	}
	
	
	/**
	 * @brief		Get field attributes list
	 * @return		associative array of string/value
	 */
	public function getAttributes()
	{
		return $this->record;
	}
	
	
	/**
	 * @brief		Get a field attribute value
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @return		attribute value		field attribute value
	 */
	public function getAttribute($arg_attribute)
	{
		return $this->record[$arg_attribute];
	}
	
	
	/**
	 * @brief		Set a field attribute value
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @param[in]	arg_value			field attribute value (anything)
	 * @return		nothing
	 */
	public function setAttribute($arg_attribute, $arg_value)
	{
		if ( $arg_attribute == self::$ATTRIBUTE_NAME )
		{
			return false;
		}
		if ( $arg_attribute == self::$ATTRIBUTE_SOURCE and ! in_array($arg_value, self::getSources()) )
		{
			return false;
		}
		if ( $arg_attribute == self::$ATTRIBUTE_TYPE and ! in_array($arg_value, self::getTypes()) )
		{
			return false;
		}
		
		$this->record[$arg_attribute] = $arg_value;
		$this->string_key = null;
		$this->key = null;
		
		return true;
	}
	
	
	
	// ----------------- FIELD STRING KEY -----------------
	
	/**
	 * @brief		Get field ley
	 * @return		string
	 */
	public function getKey()
	{
		if ($this->key == null)
		{
			$this->updateKey();
		}
		return $this->key;
	}
	
	
	/**
	 * @brief		Get field string key
	 * @return		string
	 */
	public function getStringKey()
	{
		if ($this->key == null)
		{
			$this->updateKey();
		}
		return $this->string_key;
	}
	
	
	/**
	 * @brief		Get field attributes into a URL string
	 * @return		string
	 */
	public function getURLAttributes()
	{
		return http_build_query($this->record);
	}
	
	
	/**
	 * @brief		Update field key
	 * @return		nothing
	 */
	protected function updateKey()
	{
		$this->string_key = "FIELD{".$this->getURLAttributes()."}";
		$this->key = md5($this->string_key);
	}
	
	
	
	// ----------------- CHECK FIELD VALUE TYPE -----------------
	
	/**
	 * @brief		Check if given value is compatble with field type
	 * @param[in]	arg_value			target field value (anything)
	 * @return		value is compatible with field (boolean)
	 */
	public function checkValueType($arg_value)
	{
		$context = "AbstractField.checkValueType";
		
		// GET FIELD TYPE
		$field_type = $this->record[self::$ATTRIBUTE_TYPE];
		if ( is_null($field_type) )
		{
			return TRACE::leaveko($context, "No field type defined", false, self::$TRACE_FIELD);
		}
		
		// GET VALUE TYPE
		$value_type = Type::getValueType($arg_value);
		if ( is_null($value_type) )
		{
			return false;
		}
//		TRACE::trace_var($context, "value", "$arg_value", self::$TRACE_FIELD);
//		TRACE::trace_var($context, "value_type", "$value_type", self::$TRACE_FIELD);
		
		// COMPARE FIELD AND VALUE TYPE
		switch($field_type)
		{
			case Type::$TYPE_EXPRESSION:
			case Type::$TYPE_LOGIN:
			case Type::$TYPE_EMAIL:
			case Type::$TYPE_PASSWORD:
				return $value_type == Type::$TYPE_STRING;
			
			case Type::$TYPE_STRING:
				return $value_type == Type::$TYPE_STRING
					|| $value_type == Type::$TYPE_INTEGER
					|| $value_type == Type::$TYPE_BOOLEAN
					|| $value_type == Type::$TYPE_FLOAT
					|| $value_type == Type::$TYPE_DATE
					|| $value_type == Type::$TYPE_TIME
					|| $value_type == Type::$TYPE_DATETIME;
			
			case Type::$TYPE_BOOLEAN:
				return $value_type == Type::$TYPE_BOOLEAN;
			
			case Type::$TYPE_INTEGER:
				return $value_type == Type::$TYPE_INTEGER;
			
			case Type::$TYPE_FLOAT:
				return $value_type == Type::$TYPE_FLOAT;
			
			case Type::$TYPE_DATE:
				return $value_type == Type::$TYPE_STRING && Type::checkValueTypeDate($arg_value);
				
			case Type::$TYPE_TIME:
				return $value_type == Type::$TYPE_STRING && Type::checkValueTypeTime($arg_value);
				
			case Type::$TYPE_DATETIME:
				return $value_type == Type::$TYPE_STRING && Type::checkValueTypeDateTime($arg_value);
		}
		
		return false;
	}
}
?>