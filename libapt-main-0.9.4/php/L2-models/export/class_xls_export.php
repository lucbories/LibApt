<?php
/**
 * @version		$Id: class_xls_export.php 2012-07-22 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-models/export
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class XlsExport extends AbstractExport
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
			$arg_file = "export.xls";
		}
		if ( is_null($arg_ct) )
		{
			$arg_ct = "application/vnd.ms-xls";
		}
		header("Content-type : $arg_ct");
		header("Content-Type: application/force-download");
		header("Content-Type: application/octet-stream");
		header("Content-Type: application/download");;
		header("Content-Transfer-Encoding: binary ");
		header('Content-Disposition: attachment; filename="'.$arg_file.'"');
		echo self::export($arg_fields, $arg_datas_records, $arg_fs, $arg_eol);
	}
	
	static public function html($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_ct = null)
	{
		if ( is_null($arg_ct) )
		{
			$arg_ct = "application/vnd.ms-xls";
		}
		header("Content-type : $arg_ct");
		echo self::export($arg_fields, $arg_datas_records, $arg_fs, $arg_eol);
	}
	
	static public function export($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_export_header = true)
	{
		$buffer = "";
		
		$export = new ExcelExport();
		
		// HEADER
		$export->addRow( array_keys($arg_fields) );
		
		// LOOP ON RECORDS
		$records_count = count($arg_datas_records);
		for($index = 0 ; $index < $records_count ; $index++)
		{
			$current_record = $arg_datas_records[$index];
			
			$cells = array();
			$cells_count = 0;
			foreach($arg_fields as $field_name => $field)
			{
				$cell_value = "";
				if ( array_key_exists($field_name, $current_record) )
				{
					$cell_value = $current_record[$field_name];
				}
				$cells[] = $cell_value;
				$cells_count++;
			}
			$export->addRow($cells);
		}
		
		$buffer = $export->write();
		
		return $buffer;
	}
}
?>
