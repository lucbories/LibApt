<?php
/**
 * @defgroup    L2_MODELS			Libapt-main : models features
 * @ingroup		LIBAPT_MAIN
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        includes.php
 * @brief       Models features include file
 * @details     Includes all PHP files of the LIBAPT-MAIN/L2-MODELS module
 * @ingroup		L2_MODELS
 * @date        2012-11-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

$layer = "L2-models";


// API
load_class("$layer/api", "abstract_model");
load_class("$layer/api", "abstract_model_impl");
load_class("$layer/api", "abstract_export");
load_class("$layer/api", "abstract_cursor");
load_class("$layer/api", "abstract_db_model");
load_class("$layer/api", "abstract_sql_model");


// EXPORTS
load_class("$layer/export", "csv_export");
load_class("$layer/export", "json_export");
load_class("$layer/export", "export_xls");
load_class("$layer/export", "xls_export");


// MODELS
load_class("$layer", "cursor");
load_class("$layer", "request_model");
load_class("$layer", "session_model");

// CSV MODELS
load_class("$layer/model_csv", "csv_model");


// SQL MODELS
load_class("$layer/model_sql", "abstract_sql_model_impl");
load_class("$layer/model_sql", "mysql_sql_model");
load_class("$layer/model_sql", "mysqli_sql_model");



// ************************************************************************
// INT TRACE OF : L2-MODELS
// ************************************************************************

AbstractModel::$TRACE_MODEL				= false;
CsvModel::$TRACE_CSV_MODEL				= false;

?>