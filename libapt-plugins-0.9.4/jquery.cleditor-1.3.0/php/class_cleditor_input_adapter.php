<?php
/**
 * @version		$Id: class_ckeditor_input_adapter.php 2012-10-16 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-plugins-php/ckeditor
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 */
class CLEditorInputAdapter extends AbstractHtmlInputAdapter
{
	// STATIC ATTRIBUTES
	
	public function useStandardHeaders()
	{
	}
	
	// CONSTRUCTOR
	public function __construct()
	{
		// USE HEADERS
		$response = Application::getInstance()->getResponse();
		$response->useHeader("js-jquery-cleditor", 30);
		$response->useHeader("js-jquery-cleditor-advtable", 30);
		$response->useHeader("js-jquery-cleditor-icon", 30);
		$response->useHeader("css-jquery-cleditor", 30);
		
		// $js_code = "$('.cleditor').cleditor();\n";
		// $response->addScript(Response::$JS_DOC_READY, $js_code);
	}
	
	
	// HTML INPUT
	public function getInputTypes()
	{
		return array(Type::$TYPE_RICHTEXT);
	}
	
	public function htmlInputModelField($arg_id, $arg_name, $arg_label, $arg_readonly, $arg_hidden, $arg_form_id, $arg_model_object, $arg_field_object, $arg_field_value, $arg_classes = "", $arg_opts = "")
	{
		return true;
	}
	
	public function htmlInput($arg_id, $arg_name, $arg_label, $arg_type, $arg_value, $arg_readonly, $arg_classes = "", $arg_opts = "")
	{
		$context = "CLEditorInputAdapter::htmlInput";
		TRACE::enterWithArgs($context, "", self::$TRACE_ABSTRACT_INPUT_ADAPTER, $arg_id, $arg_name, $arg_label, $arg_type, $arg_value,  $arg_readonly, $arg_classes, $arg_opts);
		
		
		// CHECK TYPE AND NAME
		if ($arg_type === null || $arg_name === null || $arg_type == "" || $arg_name == "")
		{
			return TRACE::leaveko($context, "type || name is null || empty", false, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		}
		
		// LABEL TAG
		if ($arg_id !== null && $arg_id != "" && $arg_label !== null && $arg_label != "")
		{
			if ($arg_type != Type::$TYPE_HIDDEN && $arg_type != Type::$TYPE_BUTTON
				and $arg_type != Type::$TYPE_SUBMIT && $arg_type != Type::$TYPE_RESET && $arg_type != Type::$TYPE_CANCEL)
			{
				HTML::addBufferLine("<LABEL for='".$arg_id."'>".$arg_label."</LABEL>");
			}
		}
		
		// PROCESSING
		$result = false;
		switch($arg_type)
		{
			case Type::$TYPE_RICHTEXT: $result = $this->htmlInputRichText($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			default : return TRACE::leaveko($context, "type not processed [$arg_type]", false, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		}
		
		// CHECK PROCESSING RESULT
		if ( ! $result )
		{
			return TRACE::leaveko($context, "error during type processing [$arg_type]", false, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		}
		
		return TRACE::leaveok($context, "type processed [$arg_type]", true, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
	}
	
	
	// INTERNAL PROCESSING
	protected function htmlInputRichText($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_value	= ($arg_value !== null && $arg_value != "")	? $arg_value : "";
		$str_read	= ($arg_readonly !== null && Type::getBooleanValue($arg_readonly, false) )? " readonly" : "";
		
		if ( ! is_null($arg_id) && $arg_id != "" )
		{
			$str = "<TEXTAREA class='cleditor $arg_classes' $str_id $str_name>$str_value</TEXTAREA><BR>";
			HTML::addBufferLine($str);
		}
		else
		{
			$str = "<TEXTAREA class='$arg_classes input-text' $str_id $str_name $str_read ".$arg_opts.">$str_value</TEXTAREA>";
			HTML::addBufferLine($str);
		}
		return true;
	}
}
?>