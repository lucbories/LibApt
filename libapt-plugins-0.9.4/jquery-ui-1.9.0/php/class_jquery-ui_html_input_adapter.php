<?php
/**
 * @file        class_jquery-ui_html_input_adapter.php
 * @brief       Html input adapter class for jQueryUI
 * @details     Define input features based on the jQueryUI library
 * @see			AbstractHtmlInputAdapter Trace
 * @ingroup     LIBAPT_PLUGINS
 * @date        2013-02-03
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class JQueryUIHtmlInputAdapter extends AbstractHtmlInputAdapter
{
	// STATIC ATTRIBUTES
	
	public function useStandardHeaders()
	{
	}
	
	// HTML INPUT
	public function getInputTypes()
	{
		return array("Slider", Type::$TYPE_DATE, Type::$TYPE_DATETIME, Type::$TYPE_TIME);
	}
	
	public function htmlInputModelField($arg_id, $arg_name, $arg_label, $arg_readonly, $arg_hidden, $arg_form_id, $arg_model_object, $arg_field_object, $arg_field_value, $arg_classes = "", $arg_opts = "")
	{
		return true;
	}
	
	public function htmlInput($arg_id, $arg_name, $arg_label, $arg_type, $arg_value, $arg_readonly, $arg_classes = "", $arg_opts = "")
	{
		$context = "JQueryUIInputAdapter::htmlInput";
		TRACE::enterWithArgs($context, "", self::$TRACE_ABSTRACT_INPUT_ADAPTER, $arg_id, $arg_name, $arg_label, $arg_type, $arg_value,  $arg_readonly, $arg_classes, $arg_opts);
		
		// CHECK TYPE AND NAME
		if ($arg_type === null or $arg_name === null or $arg_type == "" or $arg_name == "")
		{
			return TRACE::leaveko($context, "type or name is null or empty", false, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		}
		
		// LABEL TAG
		if ($arg_id !== null and $arg_id != "" and $arg_label !== null and $arg_label != "")
		{
			if ($arg_type != Type::$TYPE_HIDDEN and $arg_type != Type::$TYPE_BUTTON
				and $arg_type != Type::$TYPE_SUBMIT and $arg_type != Type::$TYPE_RESET and $arg_type != Type::$TYPE_CANCEL)
			{
				HTML::addBufferLine("<LABEL for='".$arg_id."'>".$arg_label."</LABEL>");
			}
		}
		
		// PROCESSING
		$result = false;
		switch($arg_type)
		{
			case "Slider":				$result = $this->htmlInputSlider	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_DATE:		$result = $this->htmlInputDate		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_DATETIME:	$result = $this->htmlInputDateTime	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_TIME:		$result = $this->htmlInputTime		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
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
	protected function htmlInputSlider($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null and $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null and $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_type	= "type='TEXT'";
		$str_value	= ($arg_value !== null and $arg_value != "")	? " value='".$arg_value."'" : " value=''";
		$str_read	= ($arg_readonly !== null and Type::getBooleanValue($arg_readonly, false) )? " readonly" : "";
		
		if ( ! is_null($arg_id) and $arg_id != "" )
		{
			$str = "<DIV class='$arg_classes' $str_id></DIV><BR>";
			HTML::addBufferLine($str);
			
			// SET SLIDER OPTIONS
			$slider_range	= "true";
			$slider_min		= "0";
			$slider_max		= "1000";
			$slider_step	= "0";
			
			$str_value	= ($arg_value !== null and $arg_value != "")	? " value:$arg_value" : "value:0";
			
			$js_code = "
				$('#".$arg_id."').slider(
					{
						$str_value
					}
				);
			";
			
					/*	range: $slider_range,
						min: $slider_min,
						max: $slider_max,*/
						/*value: $arg_value,*/
						/*values: [540, 1020],*/
					/*	step: $slider_step*/
					
			// GET RESPONSE AN SET USED HEADERS
			$response = Application::getInstance()->getResponse();
			
			// REGISTER JS INIT CODE
			$response->addScript(Response::$JS_DOC_READY, $js_code);
		}
		else
		{
			$str = "<INPUT class='$arg_classes input-text' $str_id $str_type $str_name $str_value $str_read ".$arg_opts."/>";
			HTML::addBufferLine($str);
		}
		return true;
	}
	
	protected function htmlInputDate($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$is_readonly= (boolean) ( ( ! is_null($arg_readonly) ) and Type::getBooleanValue($arg_readonly, false) );
		
		$str_id		= ($arg_id !== null and $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null and $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_type	= "type='TEXT'";
		$str_value	= ($arg_value !== null and $arg_value != "")	? " value='".$arg_value."'" : " value=''";
		$str_read	= $is_readonly ? " readonly" : "";
		$str_class	= $is_readonly ? $arg_classes : $arg_classes." datepicker";
		
		$str = "<INPUT class='$str_class' $str_id $str_type $str_name $str_value $str_read ".$arg_opts."/>";
		HTML::addBufferLine($str);
		
		return true;
	}
	
	protected function htmlInputTime($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$is_readonly= (boolean) ( ( ! is_null($arg_readonly) ) and Type::getBooleanValue($arg_readonly, false) );
		
		$str_id		= ($arg_id !== null and $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null and $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_type	= "type='TEXT'";
		$str_value	= ($arg_value !== null and $arg_value != "")	? " value='".$arg_value."'" : " value=''";
		$str_read	= $is_readonly ? " readonly" : "";
		$str_class	= $is_readonly ? $arg_classes : $arg_classes." timepicker";
		
		$str = "<INPUT class='$str_class' $str_id $str_type $str_name $str_value $str_read ".$arg_opts."/>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputDateTime($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$is_readonly= (boolean) ( ( ! is_null($arg_readonly) ) and Type::getBooleanValue($arg_readonly, false) );
		
		$str_id		= ($arg_id !== null and $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null and $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_type	= "type='TEXT'";
		$str_value	= ($arg_value !== null and $arg_value != "")	? " value='".$arg_value."'" : " value=''";
		$str_read	= $is_readonly ? " readonly" : "";
		$str_class	= $is_readonly ? $arg_classes : $arg_classes." datetimepicker";
		
		$str = "<INPUT class='$str_class' $str_id $str_type $str_name $str_value $str_read ".$arg_opts."/>";
		HTML::addBufferLine($str);
		return true;
	}
}
?>