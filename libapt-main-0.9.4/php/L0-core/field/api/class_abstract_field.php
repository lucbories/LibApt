<?php
/**
 * @file        class_abstract_field.php
 * @brief       Abstract class for fields (api)
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractField
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	/// @brief		Trace or not (boolean)
	static public $TRACE_FIELD = false;
	
	
	/// @brief		Field predefined sources (array of strings)
	static public $SOURCES = array("PHP", "SQL", "LDAP", "CSV", "REQUEST", "SESSION", "RESPONSE");
	
	/// @brief		Field predefined source PHP
	static public $SOURCE_PHP				= "PHP";
	
	/// @brief		Field predefined source SQL
	static public $SOURCE_SQL				= "SQL";
	
	/// @brief		Field predefined source LDAP
	static public $SOURCE_LDAP				= "LDAP";
	
	/// @brief		Field predefined source CSV
	static public $SOURCE_CSV				= "CSV";
	
	/// @brief		Field predefined source REQUEST
	static public $SOURCE_REQUEST			= "REQUEST";
	
	/// @brief		Field predefined source SESSION
	static public $SOURCE_SESSION			= "SESSION";
	
	/// @brief		Field predefined source RESPONSE
	static public $SOURCE_RESPONSE			= "RESPONSE";
	
	
	/// @brief		Field attribute name for source 
	static public $ATTRIBUTE_SOURCE			= "source";
	
	/// @brief		Field attribute name for name
	static public $ATTRIBUTE_NAME			= "name";
	
	/// @brief		Field attribute name for type
	static public $ATTRIBUTE_TYPE			= "type";
	
	/// @brief		Field attribute name for default value
	static public $ATTRIBUTE_DEFAULT		= "default";
	
	/// @brief		Field attribute name for label
	static public $ATTRIBUTE_LABEL			= "label";
	
	/// @brief		Field attribute name for format
	static public $ATTRIBUTE_FORMAT			= "format";
	
	/// @brief		Field attribute name for is editable
	static public $ATTRIBUTE_IS_EDITABLE	= "is_editable";
	
	/// @brief		Field attribute name for is crud
	static public $ATTRIBUTE_IS_CRUD		= "is_crud";
	
	/// @brief		Field attribute name for is visible
	static public $ATTRIBUTE_IS_VISIBLE		= "is_visible";
	
	/// @brief		Field attribute name for is primary key
	static public $ATTRIBUTE_IS_PK			= "is_primary_key";
	
	/// @brief		Field attribute name for is part of a join
	static public $ATTRIBUTE_IS_JOIN		= "is_part_of_join";
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	protected function __construct()
	{
	}
	
	
	
	// ----------------- FIELD PREDEFINED VALUES -----------------
	/**
	 * @brief		Get field predefined types
	 * @return		array of strings
	 */
	static public function getTypes()
	{
		return Type::getTypes();
	}
	
	/**
	 * @brief		Get field predefined sources
	 * @return		array of strings
	 */
	static public function getSources()
	{
		return self::$SOURCES;
	}
	
	
	
	// ----------------- FIELD ATTRIBUTES -----------------
	/**
	 * @brief		Get field attributes names list
	 * @return		array of strings
	 */
	abstract public function getAttributesList();
	
	/**
	 * @brief		test if a field has the given attribute
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @return		boolean				true : field has attribute, false : field haven't attribute
	 */
	abstract public function hasAttribute($arg_attribute);
	
	/**
	 * @brief		Get field attributes list
	 * @return		associative array of string/value
	 */
	abstract public function getAttributes();
	
	/**
	 * @brief		Get a field attribute value
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @return		attribute value		field attribute value
	 */
	abstract public function getAttribute($arg_attribute);
	
	/**
	 * @brief		Set a field attribute value
	 * @param[in]	arg_attribute		field attribute name (string)
	 * @param[in]	arg_value			field attribute value (anything)
	 * @return		nothing
	 */
	abstract public function setAttribute($arg_attribute, $arg_value);
	
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
	abstract public function resetAttributes($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label, $arg_is_editable, $arg_is_visible, $arg_is_primary_key);
	
	/**
	 * @brief		Get field attribute source
	 * @return		field source (string)
	 */
	abstract public function getSource();
	
	/**
	 * @brief		Get field attribute name
	 * @return		field name (string)
	 */
	abstract public function getName();
	
	/**
	 * @brief		Get field attribute type
	 * @return		field type (string)
	 */
	abstract public function getType();
	
	/**
	 * @brief		Get field attribute format
	 * @return		field format (string)
	 */
	abstract public function getFormat();
	
	/**
	 * @brief		Get field attribute default value
	 * @return		field default value (anything)
	 */
	abstract public function getDefault();
	
	/**
	 * @brief		Get field attribute label
	 * @return		field label (string)
	 */
	abstract public function getLabel();
	
	/**
	 * @brief		Get field attribute is editable
	 * @return		field is editable (boolean)
	 */
	abstract public function isEditable();
	
	/**
	 * @brief		Get field attribute is part of crud operations
	 * @return		field is crud (boolean)
	 */
	abstract public function isCrud();
	
	/**
	 * @brief		Get field attribute is visible
	 * @return		field is visible (boolean)
	 */
	abstract public function isVisible();
	
	/**
	 * @brief		Set field attribute is editable
	 * @param[in]	arg_value			field is editable (boolean)
	 * @return		nothing
	 */
	abstract public function setEditable($arg_value);
	
	/**
	 * @brief		Set field attribute is visible
	 * @param[in]	arg_value			field is visible (boolean)
	 * @return		nothing
	 */
	abstract public function setVisible($arg_value);
	
	/**
	 * @brief		Set field attribute is primary key to true
	 * @return		nothing
	 */
	abstract public function enablePrimaryKey();
	
	/**
	 * @brief		Set field attribute is primary key to false
	 * @return		nothing
	 */
	abstract public function disablePrimaryKey();
	
	/**
	 * @brief		Set field attribute is primary key
	 * @param[in]	arg_value			field is primary key (boolean)
	 * @return		nothing
	 */
	abstract public function setPrimaryKey($arg_value);
	
	/**
	 * @brief		Get field attribute is primary key
	 * @return		is primary key (boolean)
	 */
	abstract public function isPrimaryKey();
	
	/**
	 * @brief		Set field attribute is part of a join
	 * @param[in]	arg_value			field is part of a join (boolean)
	 * @return		nothing
	 */
	abstract public function setPartOfJoin($arg_value);
	
	/**
	 * @brief		Get field attribute is part of a join
	 * @return		is part of a join (boolean)
	 */
	abstract public function isPartOfJoin();
	
	
	// ----------------- FIELD STRING KEY -----------------
	/**
	 * @brief		Get field ley
	 * @return		string
	 */
	abstract public function getKey();
	
	/**
	 * @brief		Get field string key
	 * @return		string
	 */
	abstract public function getStringKey();
	
	/**
	 * @brief		Get field attributes into a URL string
	 * @return		string
	 */
	abstract public function getURLAttributes();
	
	/**
	 * @brief		Update field key
	 * @return		nothing
	 */
	abstract protected function updateKey();
	
	
	
	// ----------------- CHECK FIELD VALUE TYPE -----------------
	/**
	 * @brief		Check if given value is compatble with field type
	 * @param[in]	arg_value			target field value (anything)
	 * @return		value is compatible with field (boolean)
	 */
	abstract public function checkValueType($arg_value);
}
?>