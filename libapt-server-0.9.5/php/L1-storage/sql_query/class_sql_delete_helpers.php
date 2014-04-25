<?php
/**
 * @file        class_sql_delete_helpers.php
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
class SQLDeleteHelpers
{
	/*
		DELETE table_name.*
		FROM db_name.table_name
		WHERE
			filter1 [AND filter2] ...
		;
	*/
	static public function getDeleteString($arg_fields, $arg_filters, $arg_sgbd_database, $arg_crud_table)
	{
		$context = "SQLDeleteHelpers.getDeleteString";
		
//		TRACE::enter("SQLDeleteHelpers.getDeleteString");
		
		// CHECK DB AND TABLE
		if (is_null($arg_sgbd_database) or is_null($arg_crud_table) or $arg_sgbd_database == "" or $arg_crud_table == "")
		{
			return TRACE::leaveko($context, "Bad database [$arg_sgbd_database] or tablename[$arg_crud_table]", null);
		}
		
		// GET FILTERS SQL STRING
		$filters = SQLFiltersHelpers::getFilterSQLString($arg_fields, $arg_filters);
		
		// CHECK FILTERS STRING
		if ( is_null($filters) or $filters == "" )
		{
			return TRACE::leaveko($context, "Bad empty filters string", null);
		}
		
		// GENERATE THE SQL STRING
		$sql = "DELETE FROM ".$arg_sgbd_database.".".$arg_crud_table." WHERE (".$filters.");";
		
//		TRACE::leaveok("SQLDeleteHelpers.getDeleteString for [$arg_sgbd_database].[$arg_crud_table]");
		return $sql;
	}
	
	/*
		DELETE table_name.*
		FROM db_name.table_name
		;
	*/
	static public function getDeleteAllString($arg_sgbd_database, $arg_crud_table)
	{
		$context = "SQLDeleteHelpers.getDeleteAllString";
		
//		TRACE::enter("SQLDeleteHelpers.getDeleteAllString");
		
		// CHECK ARGS
		if (is_null($arg_sgbd_database) or is_null($arg_crud_table) or $arg_sgbd_database == "" or $arg_crud_table == "")
		{
			return TRACE::leaveko($context, "Bad database [$arg_sgbd_database] or tablename[$arg_crud_table]", null);
		}
		
		// GENERATE THE SQL STRING
		$sql = "DELETE ".$arg_crud_table.".* FROM ".$arg_sgbd_database.".".$arg_crud_table.";";
		
//		TRACE::leaveok("SQLDeleteHelpers.getDeleteAllString for [$arg_sgbd_database].[$arg_crud_table]");
		return $sql;
	}
	
	static public function getDeleteKeyString($arg_fields, $arg_filters, $arg_sgbd_crud_db, $arg_crud_table)
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
		return "DELETE"."{".$fields_key.",".$arg_sgbd_crud_db.",".$arg_crud_table.",".$filters_key."}";
	}
}


?>
