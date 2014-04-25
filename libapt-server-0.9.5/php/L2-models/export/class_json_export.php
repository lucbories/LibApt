<?php
/**
 * @version		$Id: class_json_export.php 2012-07-22 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-models/export
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class JsonExport extends AbstractExport
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	protected function __construct()
	{
	}
	
	
	// EXPORT
	static public function htmlDownload($arg_fields, $arg_datas_records, $arg_fs = null, $arg_eol = null, $arg_ct = null, $arg_file = null)
	{
		if ( is_null($arg_file) )
		{
			$arg_file = "export.json";
		}
		if ( is_null($arg_ct) )
		{
			$arg_ct = "application/json";
		}
		header("Content-type : $arg_ct");
		header('Content-Disposition: attachment; filename="'.$arg_file.'"');
		
		
		// TODO
		
		$datas = array("aaData" => $arg_datas_records);
		echo self::export($arg_fields, $datas, $arg_fs, $arg_eol);
	}
	
	static public function html($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_ct = null)
	{
		if ( is_null($arg_ct) )
		{
			$arg_ct = "application/json";
		}
		header("Content-type : $arg_ct");
		echo self::export($arg_fields, $arg_datas_records, $arg_fs, $arg_eol);
	}
	
	static public function export($arg_fields, $arg_datas_records, $arg_fs = null, $arg_eol = null, $arg_export_header = true)
	{
		return json_encode($arg_datas_records);
	}
}
?>
