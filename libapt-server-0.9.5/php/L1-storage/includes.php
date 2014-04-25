<?php
/**
 * @defgroup    L1_STORAGE			Libapt-main : storage features
 * @ingroup		LIBAPT_MAIN
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        includes.php
 * @brief       Storage features include file
 * @details     Includes all PHP files of the LIBAPT-MAIN/L1-STORAGE module
 * @ingroup		L1_STORAGE
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

$layer = "L1-storage";


// API
load_class("$layer/api", "abstract_query");
load_class("$layer/api", "abstract_storage");
load_class("$layer/api", "abstract_storage_impl");
load_class("$layer/api", "abstract_file_storage");
load_class("$layer/api", "abstract_file_storage_impl");
load_class("$layer/api", "abstract_sql_storage");
load_class("$layer/api", "abstract_sql_storage_impl");


// GENERIC SQL QUERY
load_class("$layer/sql_query", "sql_filters_helpers");
load_class("$layer/sql_query", "sql_orders_helpers");
load_class("$layer/sql_query", "sql_groups_helpers");
load_class("$layer/sql_query", "sql_query_key_helpers");
load_class("$layer/sql_query", "sql_select_helpers");
load_class("$layer/sql_query", "sql_insert_helpers");
load_class("$layer/sql_query", "sql_update_helpers");
load_class("$layer/sql_query", "sql_delete_helpers");
load_class("$layer/sql_query", "sql_builder");

load_class("$layer/sql_query", "generic_query");


// STORAGE
load_class("$layer", "csv_storage");
load_class("$layer", "mysql_storage");
load_class("$layer", "mysqli_storage");



// ************************************************************************
// INT TRACE OF : L1-STORAGE
// ************************************************************************

AbstractStorage::$TRACE_STORAGE						= false;
AbstractStorage::$TRACE_STORAGE_RECORD				= false;

AbstractFileStorageImpl::$TRACE_FILE_STORAGE		= false;
AbstractFileStorageImpl::$TRACE_FILE_STORAGE_RECORD	= false;

CSVStorage::$TRACE_CSV_STORAGE						= false;
CSVStorage::$TRACE_CSV_STORAGE_RECORD				= false;

SQLSelectHelpers::$TRACE_SELECT						= false;
GenericQuery::$TRACE_GENERIC_QUERY					= false;

AbstractSQLStorage::$TRACE_SQL_STORAGE				= false;
AbstractSQLStorage::$TRACE_SQL_STORAGE_RECORD		= false;
AbstractSQLStorage::$TRACE_SQL_STORAGE_QUERY		= false;

?>
