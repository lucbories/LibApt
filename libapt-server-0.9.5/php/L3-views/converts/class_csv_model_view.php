<?php
/**
 * @version		$Id: class_csv_model_view.php 2012-07-22 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class CsvModelView extends AbstractModelViewImpl
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		parent::__construct($arg_unique_name, null, $arg_options);
	}
	
	
	// RENDER HTML
	public function console()
	{
		$context = get_class($this).".console";
		
		if ($this->need_init)
		{
			$this->init();
		}
		
		$fields = $this->getModel()->getModel()->getFieldsSet()->getFields();
		$datas_records = $this->getModel()->readWithSlice($fields, $this->filters_chain->getFilters(), $this->orders, $this->slice_offset, $this->slice_length, null);
		
		if ( ! $datas_records )
		{
			return TRACE::leaveko($context, "read failed", null);
		}
		
		echo CsvExport::export($fields, $datas_records, ";", "\n");
	}
	
	public function htmlSelf()
	{
		$context = get_class($this).".html";
		
		$fields = $this->getModel()->getFieldsSet()->getFields();
		$datas_records = $this->getModel()->readWithSlice($fields, $this->filters_chain->getFilters(), $this->orders, $this->slice_offset, $this->slice_length, null);
		
		if ( ! $datas_records )
		{
			return TRACE::leaveko($context, "read failed", null);
		}
		
		CsvExport::htmlDownload($fields, $datas_records, ";", "\n", "application/csv", "export.csv");
	}
}
?>