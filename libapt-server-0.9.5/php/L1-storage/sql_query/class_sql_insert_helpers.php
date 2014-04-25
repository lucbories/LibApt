<?php
/**
 * @file        class_sql_insert_helpers.php
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
class SQLInsertHelpers
{
	static public function getInsertString($arg_fields, $arg_sgbd_database, $arg_crud_table, $arg_fields_values, $arg_ignore = false, $arg_replace = false)
	{
		$context = "SQLInsertHelpers.getInsertString";
		
		// TRACE::trace_var($context, "arg_fields_values", $arg_fields_values, true);
		
		$columns = array();
		$values = array();
		$wheres = array();
		$froms = array();
		
		foreach($arg_fields_values as $field_name => $field_value)
		{
			// CHECK FIELD NAME
			if ( ! array_key_exists($field_name, $arg_fields) )
			{
				return TRACE::leaveko($context, "[$field_name] field not found", null);
			}
			
			// GET FIELD OBJECT
			$field_object = $arg_fields[$field_name];
			
			// CHECK FIELD OBJECT
			if ( ! $field_object instanceof Field )
			{
				return TRACE::leaveko($context, "[$field_name] is not a field object", null);
			}
			if ( ! $field_object->hasSQLAttributes() )
			{
				return TRACE::leaveko($context, "[$field_name] is not a SQL field object", null);
			}
			
			// CHECK VALUE
			if ( is_null($field_value) || $field_value == "" )
			{
				$field_value = $field_object->getDefault();
			}
			
			// CHECK FIELD EXPRESSION
			$sql_is_expression = $field_object->getAttribute( SQLField::$ATTRIBUTE_SQL_IS_EXPR );
			if ( Type::getBooleanValue($sql_is_expression, false) )
			{
				continue;
			}
			
			// PREPARE SQL ITEMS
			$field_db = $field_object->getAttribute("sql_db");
			$field_table = $field_object->getAttribute("sql_table");
			$field_column = $field_object->getAttribute("sql_column");
			
			if ($field_table != $arg_crud_table)
			{
				$froms[] = $field_db.".".$field_table;
			}
			$columns[] = $field_column;
			
			// PASSWORD VALUES
			$field_value_sql = "'".$field_value."'";
			if ($field_object->getType() == "Password")
			{
				$field_value_sql = "MD5('".$field_value."')";
			}
			
			// UTILISATION D UNE JOINTURE
			if ( $field_object->hasSQLForeignAttributes() )
			{
				$field_foreign_db = $field_object->getAttribute("sql_foreign_db");
				$field_foreign_table = $field_object->getAttribute("sql_foreign_table");
				$field_foreign_key = $field_object->getAttribute("sql_foreign_key");
				$field_foreign_column = $field_object->getAttribute("sql_foreign_column");
				
				$value_select  = "(SELECT ".$field_foreign_table.".".$field_foreign_key;
				$value_select .= " FROM ".$field_foreign_db.".".$field_foreign_table;
				$value_select .= " WHERE "."".$field_foreign_table.".".$field_foreign_column." = ".$field_value_sql;
				$value_select .= " LIMIT 1)";
				$values[] = $value_select;
			} else {
				$values[] = $field_value_sql;
			}
		}
		
		// SQL COMMAND
		$columns_str = implode(",", $columns);
		$values_str  = implode(",", $values);
		
		$cmd = $arg_replace ? "REPLACE" : ( "INSERT" . ($arg_ignore ? " IGNORE" : "") );
		$sql = $cmd." INTO ".$arg_sgbd_database.".".$arg_crud_table."(";
		$sql.= $columns_str;
		$sql.= ") ";
		$sql.= "VALUES(".$values_str.")";
		$sql .= ";";
		
		return $sql;
	}
	
	static public function getInsertKeyString($arg_fields, $arg_sgbd_database, $arg_crud_table, $arg_fields_values, $arg_ignore = false, $arg_replace = false)
	{
		// PREPARE FIELDS STRING KEY
		$fields_key = "FIELDS{";
		if ($arg_fields != null)
		{
			foreach($arg_fields AS $key => $field)
			{
				if ($field instanceof Field)
				{
					$fields_key .= $field->getStringKey();
				}
			}
		}
		$fields_key .= "}";
		
		// PREPARE FIELDS VALUES STRING KEY
		$values_key = "VALUES{";
		if ( ! is_null($arg_fields_values) and count($arg_fields_values) > 0 )
		{
			foreach($arg_fields_values AS $key => $value)
			{
				$values_key .= "[".$key."=".$value."]";
			}
		}
		$values_key .= "}";
		
		// PREPARE QUERY STRING KEY
		$cmd = $arg_replace ? "REPLACE" : ( "INSERT" . ($arg_ignore ? " IGNORE" : "") );
		return $cmd."{".$fields_key.",".$arg_sgbd_database.",".$arg_crud_table.",".$values_key."}";
	}
}


?>
