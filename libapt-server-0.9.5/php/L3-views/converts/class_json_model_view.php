<?php
/**
 * @version		$Id: class_json_model_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class JsonModelView extends AbstractModelViewImpl
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
		
		// TODO JsonModelView.console : use groups clause
		$fields = $this->getModel()->getModel()->getFieldsSet()->getFields();
		$datas_records = $this->getModel()->readWithSlice($fields, $this->filters_chain->getFilters(), $this->orders, $this->slice_offset, $this->slice_length, null);
		
		if ( ! $datas_records )
		{
			return TRACE::leaveko($context, "read failed", null);
		}
		
//		echo JsonExport::export($fields, array("aaData" => $datas_records) );
		echo JsonExport::export($fields, $datas_records );
	}
	
	public function htmlSelf()
	{
		$context = get_class($this).".htmlSelf";
		
		// TODO JsonModelView.html : use groups clause
		$fields = $this->getModel()->getFieldsSet()->getFields();
		$datas_records = $this->getModel()->readWithSlice($fields, $this->filters_chain->getFilters(), $this->orders, $this->slice_offset, $this->slice_length, null);
		
		if ( ! $datas_records )
		{
			return TRACE::leaveko($context, "read failed", null);
		}
		
		JsonExport::htmlDownload($fields, $datas_records);
	}
}
?>
