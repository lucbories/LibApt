<?php
/**
 * @file        class_fields_set.php
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
class FieldsSet extends Named
{
	// ATTRIBUTES
	static public $TRACE_FIELDSSET = false;
	
	protected $fields; // Assocative array of Field class
	protected $fields_by_index; // Indexed array of Field class
	protected $fields_key;
	
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
		
		$this->fields = array();
		$this->fields_by_index = array();
		$this->fields_key = null;
	}
	
	
	// REFERENTIEL DES CHAMPS UTILISES
	public function hasField($arg_field_name)
	{
		// SEARCH FIELD BY NAME
		if ( array_key_exists($arg_field_name, $this->fields) )
		{
			return true;
		}
		
		// SEARCH FIELD BY SQL COLUMN
		foreach($this->fields as $key => $field)
		{
			if ($field instanceof SQLField && $field->getAttribute(SQLField::$ATTRIBUTE_SQL_COLUMN) == $arg_field_name)
			{
				return true;
			}
		}
	}
	
	public function hasFields($arg_field_names)
	{
		foreach($arg_field_names as $key => $field_name)
		{
			if ( ! array_key_exists($field_name, $this->fields) )
			{
				return TRACE::leaveko("FieldsSet.hasFields", "field name [".$field_name."] not found in model fields list", false, self::$TRACE_FIELDSSET);
			}
		}
		return true;
	}
	
	public function registerField($arg_field_name, $arg_field_object)
	{
		if ( ! $arg_field_object instanceof Field)
		{
			TRACE::leaveko("FieldsSet.registerField", "Given object is not a Field class", null, self::$TRACE_FIELDSSET);
			return;
		}
		$this->fields_by_index[] = $arg_field_object;
		$this->fields[$arg_field_name] = $arg_field_object;
		$this->fields_key = null;
	}
	
	public function unregisterField($arg_field_name)
	{
		$this->fields[$arg_field_name] = null;
		unset($this->fields[$arg_field_name]);
		$this->fields_key = null;
		
		foreach($this->fields_by_index as $key=>$field)
		{
			$field_name = $field->getAttribute("name");
			if ($field_name == $arg_field_name)
			{
				unset($this->fields_by_index[$key]);
			}
		}
	}
	
	public function hasFieldName($arg_field_name)
	{
		return array_key_exists($arg_field_name, $this->fields);
	}
	
	public function hasFieldObject($arg_field_object)
	{
		return in_array($arg_field_object, $this->fields_by_index);
	}
	
	public function getField($arg_field_name)
	{
		if ( array_key_exists($arg_field_name, $this->fields) )
		{
			return $this->fields[$arg_field_name];
		}
		return null;
	}
	
	public function getFieldAt($arg_field_index)
	{
		if ( array_key_exists($arg_field_index, $this->fields_by_index) )
		{
			return $this->fields_by_index[$arg_field_index];
		}
		return null;
	}
	
	public function getFieldIndex($arg_field_name)
	{
		if ( array_key_exists($arg_field_name, $this->fields) )
		{
			foreach($this->fields_by_index as $key=>$field)
			{
				$field_name = $field->getAttribute("name");
				if ($field_name == $arg_field_name)
				{
					return $key;
				}
			}
		}
		return null;
	}
	
	public function getFieldNameByAttribute($arg_attribute_name, $arg_attribute_value)
	{
		foreach($this->fields_by_index as $key=>$field)
		{
			if ( $field->hasAttribute($arg_attribute_name) )
			{
				if ( $field->getAttribute($arg_attribute_name) == $arg_attribute_value )
				{
					return $field->getName();
				}
			}
		}
		return null;
	}
	
	public function getFieldNameByAttributes($arg_attributes, $arg_returns_array = false)
	{
		$context = "FieldsSet.getFieldNameByAttributes(attributes)";
		TRACE::enter($context, "", self::$TRACE_FIELDSSET);
		
		$results = array();
		foreach($this->fields_by_index as $key=>$field)
		{
			TRACE::step($context, "process field[" . $field->getName() . "]", self::$TRACE_FIELDSSET);
			
			$current_field_matches = 0;
			foreach($arg_attributes as $attribute_key=>$attribute_value)
			{
				// echo "attribute_key=$attribute_key attribute_value=$attribute_value<br>";
				TRACE::step($context, "process attribute[$attribute_key]=[$attribute_value]", self::$TRACE_FIELDSSET);
				
				if ( $field->hasAttribute($attribute_key) )
				{
					TRACE::step($context, "field [" . $field->getName() . "] has attribute [$attribute_key]", self::$TRACE_FIELDSSET);
					if ( $field->getAttribute($attribute_key) == $attribute_value )
					{
						// echo "matchs attribute_key=$attribute_key attribute_value=$attribute_value<br>";
						TRACE::step($context, "field [" . $field->getName() . "] has attribute value [$attribute_key]=[$attribute_value]", self::$TRACE_FIELDSSET);
						++$current_field_matches;
					}
				}
			}
			if ( $current_field_matches == count($arg_attributes) )
			{
				if ( ! $arg_returns_array )
				{
					TRACE::leave($context, "found for field[" . $field->getName() . "]", self::$TRACE_FIELDSSET);
					return $field->getName();
				}
				else
				{
					$results[] = $field;
				}
			}
		}
		// echo "current_field_matches=$current_field_matches<br>";
		if ( ! $arg_returns_array )
		{
			TRACE::leave($context, "not found", self::$TRACE_FIELDSSET);
			return null;
		}
		
		TRACE::leave($context, "returns array of fields", self::$TRACE_FIELDSSET);
		return $results;
	}
	
	public function getFields($arg_fields_names = null)
	{
		if ( is_null($arg_fields_names) )
		{
			return $this->fields;
		}
		
		$selected_fields = array();
		foreach($this->fields AS $key => $field)
		{
			if ( in_array($key, $arg_fields_names) )
			{
				$selected_fields[$key] = $field;
			}
		}
		return $selected_fields;
	}
	
	public function getFieldsCount()
	{
		return count($this->fields);
	}
	
	public function getFieldsByIndex()
	{
		return $this->fields_by_index;
	}
	
	
	// FIELDS OPERATIONS
	public function getFieldsNames()
	{
		$names = array();
		foreach($this->fields AS $key => $field)
		{
			$name = $field->getAttribute("name");
			$names[] = $name;
		}
		return $names;
	}
	
	public function hasFieldsOfTypes($arg_type)
	{
		foreach($this->fields AS $key => $field)
		{
			if ($field->getAttribute("type") == $arg_type)
			{
				return true;
			}
		}
		return false;
	}
	
	public function getFirstFieldOfTypes($arg_type)
	{
		foreach($this->fields AS $key => $field)
		{
			if ($field->getAttribute("type") == $arg_type)
			{
				return $field;
			}
		}
		return null;
	}
	
	public function getVisibleFieldsNames()
	{
		$names = array();
		foreach($this->fields AS $key => $field)
		{
			if ($field->isVisible())
			{
				$name = $field->getAttribute("name");
				$names[] = $name;
			}
		}
		return $names;
	}
	
	public function getEditableFieldsNames()
	{
		$names = array();
		foreach($this->fields AS $key => $field)
		{
			if ($field->isEditable())
			{
				$name = $field->getAttribute("name");
				$names[] = $name;
			}
		}
		return $names;
	}
	
	public function getFieldsValues($arg_url_parameters)
	{
		$values = array();
		foreach($arg_url_parameters AS $key => $value)
		{
			if ($this->hasField($key))
			{
				$values[$key] = $value;
			}
		}
		return $values;
	}
	
	public function getEditableFieldsValues($arg_url_parameters)
	{
		$values = array();
		foreach($this->fields AS $key => $field)
		{
			if ( $field->isEditable() )
			{
				$field_name = $field->getAttribute("name");
				if ( array_key_exists($field_name, $arg_url_parameters) )
				{
					$values[$field_name] = $arg_url_parameters[$field_name];
				}
			}
		}
		return $values;
	}
	
	public function getPrimaryKeyFieldsValues($arg_url_parameters)
	{
		$context = "FieldsSet.getPrimaryKeyFieldsValues";
//		TRACE::trace_var($context, "arg_url_parameters", $arg_url_parameters, self::$TRACE_FIELDSSET);
		
		$pk_fields_names = array();
		foreach($this->fields AS $key => $field)
		{
//			TRACE::trace_var($context, "key/name/isPk/isPk", $key."/".$field->getAttribute("name")."/".$field->getAttribute("is_primary_key")."/".( $field->isPrimaryKey() ? "1" : "0" ), self::$TRACE_FIELDSSET);
			if ( $field->isPrimaryKey() )
			{
				$field_name = $field->getAttribute("name");
				if ( array_key_exists($field_name, $arg_url_parameters) )
				{
					$pk_fields_names[$field_name] = $arg_url_parameters[$field_name];
//					TRACE::trace_var($context, "pk value", $arg_url_parameters[$field_name]);
				}
			}
		}
//		TRACE::trace_var($context, "pk_fields_names", $pk_fields_names, self::$TRACE_FIELDSSET);
		return $pk_fields_names;
	}
	
	public function getPrimaryKeyField()
	{
		// RECHERCHE DU CHAMP CLE PRIMAIRE
		foreach($this->fields as $key => $field_object)
		{
			if ( $field_object instanceof Field)
			{
				if ($field_object->isPrimaryKey())
				{
					return $field_object;
				}
			}
		}
		
		// PAS DE CHAMP CLE PRIMAIRE TROUVE
		return null;
	}
	
	public function getPrimaryKeyFieldName()
	{
		$field_object = $this->getPrimaryKeyField();
		
		if ( ! is_null($field_object) )
		{
			return $field_object->getAttribute("name");
		}
		
		// PAS DE CHAMP CLE PRIMAIRE TROUVE
		return null;
	}
}
?>