<?php
/**
 * @file        class_field.php
 * @brief       ...
 * @details     ...
 * @see			AbstractFieldImpl Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class Field extends AbstractFieldImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	public function __construct($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label, $arg_is_editable = true, $arg_is_visible = true, $arg_is_primary_key = false)
	{
		// PARENT CONSTRUCTOR
		parent::__construct();
		
		// SET FIELD ATTRIBUTES
		$this->resetAttributes($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label, $arg_is_editable, $arg_is_visible, $arg_is_primary_key);
	}
	
	
	
	// ----------------- FIELD ATTRIBUTES -----------------
	
	/**
	 * @brief		Get field attributes names list
	 * @return		array of strings
	 */
	public function getAttributesList()
	{
		return array(
			self::$ATTRIBUTE_SOURCE, self::$ATTRIBUTE_NAME,
			self::$ATTRIBUTE_TYPE, self::$ATTRIBUTE_FORMAT,
			self::$ATTRIBUTE_DEFAULT, self::$ATTRIBUTE_LABEL,
			self::$ATTRIBUTE_IS_EDITABLE, self::$ATTRIBUTE_IS_VISIBLE, self::$ATTRIBUTE_IS_PK);
	}
	
	/**
	 * @brief		Set a field attribute value
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @param[in]	arg_value			field attribute value (anything)
	 * @return		nothing
	 */
	public function setAttribute($arg_attribute, $arg_value)
	{
		if ( $arg_attribute == self::$ATTRIBUTE_IS_PK)
		{
			$this->setPrimaryKey($arg_value);
			return true;
		}
		return parent::setAttribute($arg_attribute, $arg_value);
	}
	
	/**
	 * @brief		Get a field attribute value
	 * @param[in]	arg_source			field attribute source (string)
	 * @param[in]	arg_name			field attribute name (string)
	 * @param[in]	arg_type			field attribute type (string)
	 * @param[in]	arg_format			field attribute format (string)
	 * @param[in]	arg_default			field attribute default value (anything)
	 * @param[in]	arg_label			field attribute label (string)
	 * @param[in]	arg_is_editable		field attribute is editable (boolean)
	 * @param[in]	arg_is_visible		field attribute is visible (boolean)
	 * @param[in]	arg_is_primary_key	field attribute is primary key (boolean)
	 * @return		nothing
	 */
	public function resetAttributes($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label, $arg_is_editable, $arg_is_visible, $arg_is_primary_key, $arg_is_crud = true)
	{
		if ( ! in_array($arg_type, $this->getTypes()) )
		{
			return false;
		}
		if ( ! in_array($arg_source, self::$SOURCES) )
		{
			return false;
		}
		
		$this->record[self::$ATTRIBUTE_SOURCE]  = $arg_source;
		$this->record[self::$ATTRIBUTE_NAME]    = $arg_name;
		$this->record[self::$ATTRIBUTE_TYPE]    = $arg_type;
		$this->record[self::$ATTRIBUTE_FORMAT]  = $arg_format;
		$this->record[self::$ATTRIBUTE_DEFAULT] = $arg_default;
		$this->record[self::$ATTRIBUTE_LABEL]   = $arg_label;
		
		$this->setEditable($arg_is_editable);
		$this->setVisible($arg_is_visible);
		$this->setPrimaryKey($arg_is_primary_key);
		$this->setCrud($arg_is_crud);
		
		$this->updateKey();
		
		return true;
	}
	
	
	/**
	 * @brief		Get field attribute source
	 * @return		field source (string)
	 */
	public function getSource()
	{
		return $this->record[self::$ATTRIBUTE_SOURCE];
	}
	
	/**
	 * @brief		Get field attribute name
	 * @return		field name (string)
	 */
	public function getName()
	{
		return $this->record[self::$ATTRIBUTE_NAME];
	}
	
	/**
	 * @brief		Get field attribute type
	 * @return		field type (string)
	 */
	public function getType()
	{
		return $this->record[self::$ATTRIBUTE_TYPE];
	}
	
	/**
	 * @brief		Get field attribute format
	 * @return		field format (string)
	 */
	public function getFormat()
	{
		return $this->record[self::$ATTRIBUTE_FORMAT];
	}
	
	/**
	 * @brief		Get field attribute default value
	 * @return		field default value (anything)
	 */
	public function getDefault()
	{
		return $this->record[self::$ATTRIBUTE_DEFAULT];
	}
	
	/**
	 * @brief		Get field attribute label
	 * @return		field label (string)
	 */
	public function getLabel()
	{
		return $this->record[self::$ATTRIBUTE_LABEL];
	}
	
	/**
	 * @brief		Get field attribute is editable
	 * @return		field is editable (boolean)
	 */
	public function isEditable()
	{
		return (boolean) $this->record[self::$ATTRIBUTE_IS_EDITABLE];
	}
	
	/**
	 * @brief		Get field attribute is part of crud operations
	 * @return		field is crud (boolean)
	 */
	public function isCrud()
	{
		return (boolean) $this->record[self::$ATTRIBUTE_IS_CRUD];
	}
	
	/**
	 * @brief		Get field attribute is visible
	 * @return		field is visible (boolean)
	 */
	public function isVisible()
	{
		return (boolean) $this->record[self::$ATTRIBUTE_IS_VISIBLE];
	}
	
	/**
	 * @brief		Set field attribute is editable
	 * @param[in]	arg_value			field is editable (boolean)
	 * @return		nothing
	 */
	public function setEditable($arg_value)
	{
		$this->record[self::$ATTRIBUTE_IS_EDITABLE] = (boolean) Type::getBooleanValue($arg_value);
//		TRACE::trace_var("Field", "setEditable", ($this->record[self::$ATTRIBUTE_IS_EDITABLE]) ? "1" : "0");
		return true;
	}
	
	/**
	 * @brief		Set field attribute is crud
	 * @param[in]	arg_value			field is crud (boolean)
	 * @return		nothing
	 */
	public function setCrud($arg_value)
	{
		$this->record[self::$ATTRIBUTE_IS_CRUD] = (boolean) Type::getBooleanValue($arg_value);
//		TRACE::trace_var("Field", "setEditable", ($this->record[self::$ATTRIBUTE_IS_EDITABLE]) ? "1" : "0");
		return true;
	}
	
	/**
	 * @brief		Set field attribute is visible
	 * @param[in]	arg_value			field is visible (boolean)
	 * @return		nothing
	 */
	public function setVisible($arg_value)
	{
		$this->record[self::$ATTRIBUTE_IS_VISIBLE] = (boolean) Type::getBooleanValue($arg_value);
//		TRACE::trace_var("Field", "setVisible", ($this->record[self::$ATTRIBUTE_IS_VISIBLE]) ? "1" : "0");
		return true;
	}
	
	
	/**
	 * @brief		Set field attribute is primary key to true
	 * @return		nothing
	 */
	public function enablePrimaryKey()
	{
		$this->record[self::$ATTRIBUTE_IS_PK] = (boolean) true;
//		TRACE::trace_var("Field", "enablePrimaryKey", ($this->record[self::$ATTRIBUTE_IS_PK]) ? "1" : "0");
		return true;
	}
	
	/**
	 * @brief		Set field attribute is primary key to false
	 * @return		nothing
	 */
	public function disablePrimaryKey()
	{
		$this->record[self::$ATTRIBUTE_IS_PK] = (boolean) false;
//		TRACE::trace_var("Field", "disablePrimaryKey", ($this->record[self::$ATTRIBUTE_IS_PK]) ? "1" : "0");
		return true;
	}
	
	/**
	 * @brief		Set field attribute is primary key
	 * @param[in]	arg_value			field is primary key (boolean)
	 * @return		nothing
	 */
	public function setPrimaryKey($arg_value)
	{
		$this->record[self::$ATTRIBUTE_IS_PK] = (boolean) Type::getBooleanValue($arg_value);
//		TRACE::trace_var("Field", "setPrimaryKey", ($this->record[self::$ATTRIBUTE_IS_PK]) ? "1" : "0");
		return true;
	}
	
	/**
	 * @brief		Get field attribute is primary key
	 * @return		is primary key (boolean)
	 */
	public function isPrimaryKey()
	{
		return (boolean) $this->record[self::$ATTRIBUTE_IS_PK];
	}
	
	/**
	 * @brief		Set field attribute is part of a join
	 * @param[in]	arg_value			field is part of a join (boolean)
	 * @return		nothing
	 */
	public function setPartOfJoin($arg_value)
	{
		$this->record[self::$ATTRIBUTE_IS_JOIN] = (boolean) Type::getBooleanValue($arg_value);
//		TRACE::trace_var("Field", "setPrimaryKey", ($this->record[self::$ATTRIBUTE_IS_JOIN]) ? "1" : "0");
		return true;
	}
	
	/**
	 * @brief		Get field attribute is part of a join
	 * @return		is part of a join (boolean)
	 */
	public function isPartOfJoin()
	{
		return (boolean) $this->record[self::$ATTRIBUTE_IS_JOIN];
	}
	
	
	
	// ----------------- FIELD STRING KEY -----------------
	
}
?>