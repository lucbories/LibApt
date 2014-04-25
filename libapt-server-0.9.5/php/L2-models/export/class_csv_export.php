<?php
/**
 * @version		$Id: class_csv_export.php 2012-07-22 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-models/export
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class CsvExport extends AbstractExport
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	protected function __construct()
	{
	}
	
	
	// EXPORT
	static public function htmlDownload($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_ct = null, $arg_file = null)
	{
		if ( is_null($arg_file) )
		{
			$arg_file = "export.csv";
		}
		if ( is_null($arg_ct) )
		{
			$arg_ct = "application/csv";
		}
		header("Content-type : $arg_ct");
		header('Content-Disposition: attachment; filename="'.$arg_file.'"');
		echo self::export($arg_fields, $arg_datas_records, $arg_fs, $arg_eol);
	}
	
	static public function html($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_ct = null)
	{
		if ( is_null($arg_ct) )
		{
			$arg_ct = "application/csv";
		}
		header("Content-type : $arg_ct");
		echo self::export($arg_fields, $arg_datas_records, $arg_fs, $arg_eol);
	}
	
	static public function export($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_export_header = true)
	{
		$buffer = "";
		
		// HEADER
		if ($arg_export_header)
		{
			$cells_count = 0;
			foreach($arg_fields as $field_name => $field)
			{
				$buffer .= ($cells_count > 0 ? $arg_fs : "") . $field_name;
				$cells_count++;
			}
			$buffer .= $arg_eol;
		}
		
		// LOOP ON RECORDS
		$records_count = count($arg_datas_records);
		for($index = 0 ; $index < $records_count ; $index++)
		{
			$current_record = $arg_datas_records[$index];
			$cells_count = 0;
			foreach($arg_fields as $field_name => $field)
			{
				$cell_value = "";
				if ( array_key_exists($field_name, $current_record) )
				{
					$cell_value = $current_record[$field_name];
				}
				$buffer .= ($cells_count > 0 ? $arg_fs : "") . $cell_value;
				$cells_count++;
			}
			$buffer .= $arg_eol;
		}
		
		return $buffer;
	}
}
?>
