<?php
/**
 * @file        class_sql_builder.php
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
final class SQLBuilder
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_BUILDER = false;
	
	// @brief	cache of queries strings (string)	
	static protected $sql_string_caches = array();
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	// BUILD SELECT SQL STRING
	static public function getSelectFields($arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset = null, $arg_slice_length = null, $arg_joins = null)
	{
		// PREPARE QUERY KEY
		$field_key = null;
		$query_key = SQLSelectHelpers::getSelectKeyString($arg_fields, $arg_filters, $arg_orders, $arg_groups, $field_key, $arg_slice_offset, $arg_slice_length, false);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}
		
		// PREPARE QUERY STRING
		$has_distinct		= false;
		$has_count			= false;
		$has_foreign_keys	= false;
		$query =  SQLSelectHelpers::getSelectString($arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, $has_distinct, $has_count, $has_foreign_keys, $arg_joins);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	
	// BUILD SELECT DISTINCT SQL STRING
	public function getSelectDistinctSQLString($arg_distinct_field_name, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset = null, $arg_slice_length = null, $arg_joins = null)
	{
		if ( ! array_key_exists($arg_distinct_field_name, $this->fields) )
		{
			TRACE::leaveko("getSelectDistinctSQLString", "the given field [$arg_distinct_field_name] doesn't exists in the model", SQLBuilder::$TRACE_BUILDER);
			return null;
		}
		if ( ! $this->fields[$arg_distinct_field_name]->hasSQLForeignAttributes() )
		{
			return SQLBuilder::getSelectDistinctField($this->fields[$arg_distinct_field_name], $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, false, $arg_joins);
		}
		else
		{
			$record = $this->fields[$arg_distinct_field_name]->getAttributes();
			
			$field_source   = $record["source"];
			$field_type     = $record["type"];
			$field_format	= $record["format"];
			$field_label    = $record["label"];
			
			$foreign_db     = $record["sql_foreign_db"];
			$foreign_table  = $record["sql_foreign_table"];
			$foreign_key    = $record["sql_foreign_key"];
			$foreign_column = $record["sql_foreign_column"];
			
			$foreign_field = new Field($field_source, $arg_distinct_field_name, $field_type, $field_format, "", $field_label);
			$foreign_field->setSQLAttributes($foreign_db, $foreign_table, $foreign_column, $foreign_column, false, false);
			
			return SQLBuilder::getSelectDistinctField($foreign_field, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, false, $arg_joins);			
		}
	}
	
	public function getSelectCountSQLString($arg_distinct_field_name, $arg_filters, $arg_slice_offset = null, $arg_slice_length = null)
	{
		if ( ! array_key_exists($arg_distinct_field_name, $this->fields) )
		{
			TRACE::finko("getSelectDistinctSQLString", "the given field [$arg_distinct_field_name] doesn't exists in the model");
			return null;
		}
		
		return SQLBuilder::getSelectCountField($this->fields[$arg_distinct_field_name], $arg_filters, $arg_slice_offset, $arg_slice_length);
	}
	
	static public function getSelectDistinctField($arg_distinct_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset = null, $arg_slice_length = null, $arg_foreign_keys = false, $arg_joins = null)
	{
		$context = "SQLBuilder::getSelectDistinctField";
		
		// SET FIELDS ARRAY
		$arg_fields = null;
		if ( ! is_array($arg_distinct_fields) )
		{
			if ( ! $arg_distinct_fields instanceof AbstractField )
			{
				return TRACE::leaveko($context, "field is not an instance of AbstractField [" + get_class($arg_distinct_fields) + "]", SQLBuilder::$TRACE_BUILDER);
			}
			$arg_fields = array($arg_distinct_fields->getName() => $arg_distinct_fields);
		}
		else
		{
			foreach($arg_distinct_fields as $value)
			{
				if ( ! $value instanceof AbstractField )
				{
					return TRACE::leaveko($context, "a field is not an instance of AbstractField [" + get_class($value) + "]", SQLBuilder::$TRACE_BUILDER);
				}
			}
			$arg_fields = $arg_distinct_fields;
		}
		
		
		// PREPARE QUERY KEY
		$field_key = null;
		$query_key = SQLSelectHelpers::getSelectKeyString($arg_fields, $arg_filters, $arg_orders, $arg_groups, $field_key, $arg_slice_offset, $arg_slice_length, true, false, $arg_foreign_keys);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}

		// PREPARE QUERY STRING
		$has_distinct		= true;
		$has_count			= false;
		$query = SQLSelectHelpers::getSelectString($arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, $has_distinct, $has_count, $arg_foreign_keys, $arg_joins);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	static public function getSelectDistinctOneField($arg_distinct_field, $arg_fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset = null, $arg_slice_length = null, $arg_foreign_keys = false, $arg_joins = null)
	{
		$context = "SQLBuilder::getSelectDistinctOneField";
		
		// CHECK DISTINTC FIELD
		if ( ! $arg_distinct_field instanceof AbstractField )
		{
			return TRACE::leaveko($context, "distinct field is not an instance of AbstractField [" + get_class($arg_distinct_field) + "]", SQLBuilder::$TRACE_BUILDER);
		}
		
		// SET FIELDS ARRAY
		$all_field = null;
		if ( ! is_array($arg_fields) )
		{
			if ( ! $arg_fields instanceof AbstractField )
			{
				return TRACE::leaveko($context, "field is not an instance of AbstractField [" + get_class($arg_fields) + "]", SQLBuilder::$TRACE_BUILDER);
			}
			$all_field = array($arg_fields->getName() => $arg_fields);
		}
		else
		{
			$all_field = array();
			foreach($arg_fields as $value)
			{
				if ( ! $value instanceof AbstractField )
				{
					return TRACE::leaveko($context, "a field is not an instance of AbstractField [" + get_class($value) + "]", SQLBuilder::$TRACE_BUILDER);
				}
				$all_field[$value->getName()] = $value;
			}
		}
		
		
		// PREPARE QUERY KEY
		$field_key = null;
		// $all_field = $arg_fields;
		// $all_field[$arg_distinct_field] = $arg_distinct_field;
		$query_key = SQLSelectHelpers::getSelectKeyString($all_field, $arg_filters, $arg_orders, $arg_groups, $field_key, $arg_slice_offset, $arg_slice_length, true, false, $arg_foreign_keys);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}

		// PREPARE QUERY STRING
		$has_distinct		= true;
		$has_count			= false;
		TRACE::trace_var($context, "has_distinct", $has_distinct, SQLBuilder::$TRACE_BUILDER);
		TRACE::trace_var($context, "arg_fields", $arg_fields, SQLBuilder::$TRACE_BUILDER);
		TRACE::trace_var($context, "arg_distinct_field", $arg_distinct_field, SQLBuilder::$TRACE_BUILDER);
		$query = SQLSelectHelpers::getSelectString($all_field, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, $has_distinct, $has_count, $arg_foreign_keys, $arg_joins, $arg_distinct_field);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	static public function getSelectCountField($arg_distinct_field, $arg_filters, $arg_slice_offset = null, $arg_slice_length = null, $arg_joins = null)
	{
		$arg_groups = null;
		$arg_orders = null;
		
		$fields = null;
		// SET FIELDS ARRAY
		if ( ! is_array($arg_distinct_field) )
		{
			if ($arg_distinct_field instanceof AbstractField)
			{
				$fields = array($arg_distinct_field->getName() => $arg_distinct_field);
			}
			else
			{
				return null;
			}
		}
		else
		{
			$fields = $arg_distinct_field;
		}
		
		// PREPARE QUERY KEY
		$field_key = null;
		$query_key = SQLSelectHelpers::getSelectKeyString($fields, $arg_filters, $arg_orders, $arg_groups, $field_key, $arg_slice_offset, $arg_slice_length, false, true);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}
		
		// PREPARE QUERY STRING
		$has_distinct		= false;
		$has_count			= true;
		$has_foreign_keys	= false;
		$query = SQLSelectHelpers::getSelectString($fields, $arg_filters, $arg_orders, $arg_groups, $arg_slice_offset, $arg_slice_length, $has_distinct, $has_count, $has_foreign_keys, $arg_joins);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	
	// BUILD INSERT SQL STRING
	static public function getInsertRow($arg_fields, $arg_fields_values, $arg_sgbd_crud_db, $arg_sgbd_crud_table, $arg_ignore = false, $arg_replace = false)
	{
		// CHECK CRUD
		if ( is_null($arg_sgbd_crud_db) or is_null($arg_sgbd_crud_table) or $arg_sgbd_crud_db == "" or $arg_sgbd_crud_table == "" )
		{
			TRACE::finko("getInsertRow", "crub db et/ou table est null ou vide");
			return null;
		}
		
		// PREPARE QUERY KEY
		$query_key = SQLInsertHelpers::getInsertKeyString($arg_fields, $arg_sgbd_crud_db, $arg_sgbd_crud_table, $arg_fields_values, $arg_ignore, $arg_replace);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}
		
		// PREPARE QUERY STRING
		$query = SQLInsertHelpers::getInsertString($arg_fields, $arg_sgbd_crud_db, $arg_sgbd_crud_table, $arg_fields_values, $arg_ignore, $arg_replace);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	
	// BUILD UPDATE SQL STRING
	static public function getUpdateRows($arg_fields, $arg_filters, $arg_fields_values, $arg_sgbd_crud_db, $arg_sgbd_crud_table)
	{
		// CHECK CRUD
		if ( is_null($arg_sgbd_crud_db) or is_null($arg_sgbd_crud_table) or $arg_sgbd_crud_db == "" or $arg_sgbd_crud_table == "" )
		{
			TRACE::finko("getUpdateRows", "crub db et/ou table est null ou vide");
			return null;
		}
		
		// PREPARE QUERY KEY
		$query_key = SQLUpdateHelpers::getUpdateKeyString($arg_fields, $arg_filters, $arg_sgbd_crud_db, $arg_sgbd_crud_table, $arg_fields_values);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}
		
		// PREPARE QUERY STRING
		$query = SQLUpdateHelpers::getUpdateString($arg_fields, $arg_filters, $arg_sgbd_crud_db, $arg_sgbd_crud_table, $arg_fields_values);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	
	// BUILD DELETE SQL STRING
	static public function getDeleteRows($arg_fields, $arg_filters, $arg_sgbd_crud_db, $arg_sgbd_crud_table)
	{
		// CHECK CRUD
		if ( is_null($arg_sgbd_crud_db) or is_null($arg_sgbd_crud_table) or $arg_sgbd_crud_db == "" or $arg_sgbd_crud_table == "" )
		{
			TRACE::finko("getDeleteRows", "crub db et/ou table est null ou vide");
			return null;
		}
		
		// PREPARE QUERY KEY
		$query_key = SQLDeleteHelpers::getDeleteKeyString($arg_fields, $arg_filters, $arg_sgbd_crud_db, $arg_sgbd_crud_table);
		
		// QUERY STRING ALREADY EXISTS
		if ( array_key_exists($query_key, self::$sql_string_caches) )
		{
			return self::$sql_string_caches[$query_key];
		}
		
		// PREPARE QUERY STRING
		$query = SQLDeleteHelpers::getDeleteString($arg_fields, $arg_filters, $arg_sgbd_crud_db, $arg_sgbd_crud_table);
		
		// CACHE QUERY STRING
		self::$sql_string_caches[$query_key] = $query;
		
		return $query;
	}
	
	
	// BUILD SELECT SQL STRING WITH ONE FIELD VALUE
	static public function getSelectWithOneFieldValue($arg_fields, $arg_field_name, $arg_field_value, $arg_joins = null)
	{
		// RECHERCHE DU CHAMP AVEC LE NOM DONNE
		if ( ! array_key_exists($arg_field_name, $arg_fields) )
		{
			return null;
		}
		
		// CREATION DE LA REQUETE
		$orders = null;
		$filters = array();
		$slice_offset = null;
		$slice_length = null;
		
//		$field_type = $arg_fields[$arg_field_name]->getAttribute("type");
		$field_type = "String";
		$pk_filter = new Filter("", "", $arg_field_name, $field_type, null, "equals", $arg_field_value, null);
		$filters[] = $pk_filter;
		
		$query = self::getSelectFields($arg_fields, $orders, $filters, null, $slice_offset, $slice_length, $arg_joins);
		
		return $query;
	}
	
	
	// BUILD SELECT SQL STRING WITH ONE FIELD VALUE
	static public function getSelectWithManyFieldsValues($arg_fields, $arg_field_names, $arg_field_values)
	{
		// VERIFICATION DES NOMS DES CHAMPS DONNES
		foreach($arg_field_names as $key => $field_name )
		{
			if ( ! array_key_exists($field_name, $arg_fields) )
			{
				TRACE::finko("getSelectWithManyFieldsValues", "field name [".$field_name."] not found in model fields list");
				return null;
			}
		}
		
		// CREATION DE LA REQUETE
		$orders = null;
		$filters = array();
		$slice_offset = null;
		$slice_length = null;
		
		foreach($arg_field_names as $key => $field_name )
		{
			// CREATION DU FILTRE
			$value = $arg_field_values[$key];
//			$field_type = $arg_fields[$arg_field_name]->getAttribute("type");
			$field_type = "String";
			$filter = new Filter("", "", $field_name, $field_type, null, "equals", $value, null);
			$filters[] = $filter;
		}
		
		$query = self::getSelectFields($arg_fields, $orders, $filters, null, $slice_offset, $slice_length);
		
		return $query;
	}
}
?>