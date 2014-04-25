<?php
/**
 * @version		$Id: class_csv_loader.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/loaders
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class CsvLoader
{
	// STATIC ATTRIBUTES
	static public $TRACE_CSV_LOADER = true;
	

	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// LOAD OBJECTS DEFINITIONS FROM A CSV FILE
	static public function loadCsvFile($arg_file_path_name, $arg_header_definition_name, $arg_adapter)
	{
		$context = "CsvLoader.loadCsvFile";
		
		// CHECK ADAPTER
		if ( is_null($arg_adapter) or ! $arg_adapter instanceof AbstractLoaderAdapter )
		{
			return TRACE::leaveko($context, "loadCsvFile", "bad loader adapter", false, self::$TRACE_CSV_LOADER);
		}
		
		// LOAD A CSV FILE
		$has_header = true;
		$model = new CsvModel("loadCsvFile", $arg_file_path_name, true, ";", $has_header);
		if ( is_null($model) )
		{
			return TRACE::leaveko($context, "failed to create a CsvModel", false, self::$TRACE_CSV_LOADER);
		}
		
		// LOAD DATAS
		if ( ! $model->isLoaded() )
		{
			if ( ! $model->loadFile() )
			{
				return TRACE::leaveko($context, "failed to load CsvModel file", false, self::$TRACE_CSV_LOADER);
			}
		}
		
		// GET THE DATAS RECORDS AND ROWS COUNT
		$records = $model->getLoadedDatas();
		$rows_count = count($records);
//		TRACE::trace_var($context, "arg_file_path_name", $arg_file_path_name, true);
//		TRACE::trace_var($context, "arg_header_definition_name", $arg_header_definition_name, true);
//		TRACE::trace_var($context, "rows", $rows_count, true);
		
		// CHECK THE ROWS COUNT
		if ($rows_count < 1)
		{
			// EMPTY CSV FILE
			return TRACE::leaveok($context, "file is empty", true, self::$TRACE_CSV_LOADER);
		}
		
		foreach($records as $key => $record)
		{
//			TRACE::trace_var($context, "loop.key", $key, true);
//			TRACE::trace_var($context, "loop.record", $record, true);
			if ( ! $arg_adapter->buildObjectFromRecord( utf8_convert($record) ) )
			{
				$row_id = $record[$arg_header_definition_name];
				return TRACE::leaveko($context, "failed to build an object for [".$row_id."]", false, self::$TRACE_CSV_LOADER);
			}
		}
		
		return true;
	}
}

?>