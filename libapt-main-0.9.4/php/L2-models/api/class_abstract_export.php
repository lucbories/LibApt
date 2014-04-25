<?php
/**
 * @version		$Id: class_abstract_export.php 2012-07-22 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-models/export
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractExport
{
	static public function htmlDownload($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_ct = null, $arg_file = null)
	{
		echo "HTML DOWNLOAD";
	}
	
	static public function html($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_ct = null)
	{
		echo "HTML";
	}
	
	static public function export($arg_fields, $arg_datas_records, $arg_fs = ";", $arg_eol = "\n", $arg_export_header = true)
	{
		return "CSV BUFFER";
	}
}
?>