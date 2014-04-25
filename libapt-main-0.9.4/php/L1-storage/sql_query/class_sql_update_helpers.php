<?php
/**
 * @file        class_sql_update_helpers.php
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
class SQLUpdateHelpers
{
	/*
		UPDATE db_name.table_name
			SET field1_name = field1_value [,
			SET field2_name = field2_value] ...
		WHERE
			filter1 [AND filter2] ...
	*/
	static public function getUpdateString($arg_fields, $arg_filters, $arg_sgbd_database, $arg_crud_table, $arg_fields_values)
	{
		$context = "SQLUpdateHelpers.getUpdateString";
		
		// CHECK ARGS
		if ( is_null($arg_fields) or is_null($arg_fields_values) or is_null($arg_sgbd_database) or is_null($arg_crud_table) )
		{
			return TRACE::leaveko($context, "bad null args", "");
		}
		
		// INIT TEMPORARY ARRAYS
		$sets  = array();
		$where_pk = "";
		
		// LOOP ON FIELDS VALUES
		foreach($arg_fields_values as $field_name => $field_value)
		{
			// CHECK FIELD NAME
			if ( ! array_key_exists($field_name, $arg_fields) )
			{
				return TRACE::leaveko($context, "[$field_name] field not found", null);
			}
			
			// GET FIELD OBJECT
			$field_object = $arg_fields[$field_name];
			$update_field = true;
			
			// CHECK FIELD OBJECT
			if ( ! $field_object instanceof Field )
			{
				return TRACE::leaveko($context, "[$field_name] is not a field object", null);
			}
			if ( ! $field_object->hasSQLAttributes() )
			{
				TRACE::trace_var($context, "field", $field_object->getURLAttributes(), true);
				TRACE::trace_var($context, "field", $field_object, true);
				return TRACE::leaveko($context, "[$field_name] is not a SQL field object", null);
			}
			
			// CHECK FIELD EXPRESSION
			$sql_is_expression = $field_object->getAttribute( SQLField::$ATTRIBUTE_SQL_IS_EXPR );
			if ( Type::getBooleanValue($sql_is_expression, false) )
			{
				continue;
			}
			
			// GET SQL FIELD ATTRIBUTES
			$field_is_pk = $field_object->isPrimaryKey();
			$field_db = $field_object->getAttribute("sql_db");
			$field_table = $field_object->getAttribute("sql_table");
			$field_column = $field_object->getAttribute("sql_column");
			
			// PASSWORD VALUES
			$field_value_sql = "'".$field_value."'";
			if ($field_object->getType() == Type::$TYPE_PASSWORD)
			{
				$field_value_sql = "MD5('".$field_value."')";
				if ( is_null($field_value) || $field_value == "" )
				{
					$update_field = false;
				}
			}
			
			// SKIP PRIMARY KEY FIELD
			if (! $field_is_pk)
			{
				// CHECK TABLE
				if ($field_table != $arg_crud_table)
				{
					return TRACE::leaveko($context, "[$field_name] is not a field of the given crud table", null);
				}
				
				// UTILISATION D UNE JOINTURE
				if ( $field_object->hasSQLForeignAttributes() )
				{
					// GET SQL FOREIGN FIELD ATTRIBUTES
					$field_foreign_db = $field_object->getAttribute("sql_foreign_db");
					$field_foreign_table = $field_object->getAttribute("sql_foreign_table");
					$field_foreign_key = $field_object->getAttribute("sql_foreign_key");
					$field_foreign_column = $field_object->getAttribute("sql_foreign_column");
					
					// CONSTRUCT SQL COMMAND
					$select = "SELECT ".$field_foreign_key." FROM ".$field_foreign_db.".".$field_foreign_table;
					$select .= " WHERE ".$field_foreign_column." = ".$field_value_sql." LIMIT 1";
					$sets[] = " ".$field_column."=(".$select .")";
				}
				// PAS DE JOINTURE
				else
				{
					// CONSTRUCT SQL COMMAND
					if ($update_field)
					{
						$sets[] = " ".$field_column."=".$field_value_sql;
					}
				}
			}
			else
			{
				$where_pk = $field_table.".".$field_column."=".$field_value_sql;
			}
		}
		
		// CHECK SETS COUNT
		if ( count($sets) < 1 )
		{
			return TRACE::leaveko($context, "No field to update in the given crud table [$arg_crud_table]", null);
		}
		
		
		// GET FILTERS SQL STRING
		$filter = SQLFiltersHelpers::getFilterSQLString($arg_fields, $arg_filters);
		
		
		// SQL FINAL COMMAND
		$sets_str = trim( implode(",", array_unique($sets, SORT_STRING) ) );
		$sql = "UPDATE ".$arg_sgbd_database.".".$arg_crud_table;
		$sql.= " SET ".$sets_str;
		$where = $where_pk;
		if ($filter != "")
		{
			$where .= " ".$filter;
		}
		if ($where != "")
		{
			$sql .= " WHERE ". trim($where);
		}
		$sql .= ";";
		
		return $sql;
	}
	
	static public function getUpdateKeyString($arg_fields, $arg_filters, $arg_sgbd_database, $arg_crud_table, $arg_fields_values)
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
		if ($arg_fields_values != null)
		{
			foreach($arg_fields_values AS $key => $value)
			{
				$values_key .= "[".$key."=".$value."]";
			}
		}
		$values_key .= "}";
		
		
		// PREPARE FILTERS STRING KEY
		$filters_key = "FILTERS{";
		if ($arg_filters != null)
		{
			foreach($arg_filters AS $key => $filter)
			{
				if ($filter instanceof Filter)
				{
					$filters_key .= $filter->getStringKey();
				}
			}
		}
		$filters_key .= "}";
		
		
		// PREPARE QUERY STRING KEY
		return "UPDATE"."{".$fields_key.",".$arg_sgbd_database.",".$arg_crud_table.",".$values_key.",".$filters_key."}";
	}
}


?>
