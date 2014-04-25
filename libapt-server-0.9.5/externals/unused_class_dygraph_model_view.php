<?php
/**
 * @version		$Id: class_dygraph_model_view.php 2012-07-22 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-demo/graphs
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class DygraphModelView extends AbstractModelViewImpl
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		// ADD HEADER
		Application::getInstance()->getResponse()->addHeaderScript("dygraph", "./graphs/dygraph-combined.js");
		
	}
	
	
	// RENDER HTML
	public function declareHtmlHeadersSelf()
	{
		// GET RESPONSE AN SET USED HEADERS
		$response = Application::getInstance()->getResponse();
		$response->useHeader("js-dygraph");
	}
	
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
		
		return "NOTHING TO DO";
	}
	
	public function htmlSelf()
	{
		$context = get_class($this).".htmlSelf";
		
		// GET FIELDS AND DATAS
		// TODO
		$fields = $this->getModel()->getFieldsSet()->getFields();
		// TODO DygraphModelView.htmlSelf : datas_records = model.readAll to replace by model.readSlice(filters...)
//		$datas_records = $this->getModel()->readWithSlice($fields, $this->filters_chain->getFilters(), $this->orders, $this->slice_offset, $this->slice_length, null);
		$datas_records = $this->getModel()->readAll($fields, null, null);
		
		// CHECK DATAS
		if ( is_null($datas_records) )
		{
			return TRACE::leaveko($context, "read failed", null);
		}
		
		// CHECK FIELDS
		if ( is_null($fields)  or count($fields) < 1 )
		{
			return TRACE::leaveko($context, "fields are empty", null);
		}
		
		// EXPORT DATAS TO CSV FORMAT
		$records_count = count($datas_records);
		$fields_count = count($fields);
		$datas = "";
		for($index = 0 ; $index < $records_count ; $index++)
		{
			$current_record = $datas_records[$index];
			$current_record_count = count($current_record);
//			TRACE::trace_var($context, "fields_count", $fields_count);
//			TRACE::trace_var($context, "current_record_count", $current_record_count);
//			TRACE::trace_var($context, "current_record", $current_record);
			$field_index = 0;
			foreach($current_record as $cell_value)
			{
				$datas .= ($field_index > 0 ? "," : "") . $cell_value;
				$field_index++;
			}
			$datas .= "\\n";
		}
		
		// GET FIELDS LABELS
		$labels = "";
		foreach($fields as $field_name => $field)
		{
			if ($labels != "")
			{
				$labels .= ",";
			}
			$labels .= $field->getLabel();
		}
		
		// GENERATE JS CODE
		$tag_name = $this->getName();
		$js_datas = "var datas ='".$labels."\\n".$datas."';\n";
		$js_div   = "var div = document.getElementById(\"$tag_name\");";
		$js_dygraph = "g = new Dygraph(div,datas);\n";
		
		$js_code  = "";
		// $js_code .= "<script type=\"text/javascript\">\n";
		$js_code .= $js_datas."\n";
		$js_code .= $js_div."\n";
		$js_code .= $js_dygraph."\n";
		// $js_code .= "</script>\n";
		
		// GENERATE HTML CODE
		HTML::addBuffer("\n<DIV id=\"$tag_name\" style=\"width:600px; height:300px; position:relative;\"></DIV>\n");
		$this->appendOnReadyCode($js_code);
	}
}
?>