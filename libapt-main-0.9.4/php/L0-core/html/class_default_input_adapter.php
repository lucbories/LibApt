<?php
/**
 * @file        class_default_input_adapter.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class DefaultInputAdapter extends AbstractHtmlInputAdapter
{
	// STATIC ATTRIBUTES
	
	public function useStandardHeaders()
	{
	}
	
	// HTML INPUT
	public function getInputTypes()
	{
		return array(
			Type::$TYPE_INTEGER,
			"ModelField",
			Type::$TYPE_STRING, Type::$TYPE_HIDDEN, Type::$TYPE_URL, Type::$TYPE_EMAIL,
			Type::$TYPE_DATE, Type::$TYPE_DATETIME, Type::$TYPE_TIME,
			Type::$TYPE_PASSWORD,
			Type::$TYPE_BUTTON, Type::$TYPE_SUBMIT, Type::$TYPE_RESET, Type::$TYPE_CANCEL,
			Type::$TYPE_SELECT,
			Type::$TYPE_RICHTEXT);
	}
	
	protected function getFieldValue($arg_field, $arg_value)
	{
		if ( is_null($arg_value) )
		{
			return $arg_field->getAttribute("default");
		}
		return is_null($arg_value) ? "" : $arg_value;
	}
	
	public function htmlInputModelField($arg_id, $arg_name, $arg_label, $arg_readonly, $arg_hidden, $arg_form_id, $arg_model_object, $arg_field_object, $arg_field_value, $arg_classes = "", $arg_opts = "")
	{
		$context = "DefaultInputAdapter.htmlInputModelField";
		
		// GET THE FIELD INFOS
		$field_name = $arg_field_object->getName();
		$field_id    = $arg_form_id."_".$field_name;
		$field_label = $arg_field_object->getLabel();
		$field_type  = $arg_field_object->getType();
		$field_is_primary_key = $arg_field_object->isPrimaryKey();
		$field_readonly = $arg_readonly or (! $arg_field_object->isEditable()) or $field_is_primary_key;
		$field_value = $this->getFieldValue($arg_field_object, $arg_field_value);
//		TRACE::trace_var($context, "field_name", $field_name, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
//		TRACE::trace_var($context, "field_readonly", $field_readonly, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
//		TRACE::trace_var($context, "field_value", $field_value, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		
		// HIDE THE HIDDEN FIELD COLUMN
		if ($arg_hidden)
		{
			return HTML::formInput($field_id, $field_name, $field_label, "Hidden", $field_value, $field_readonly, "", "");
		}
		
		// HIDE THE NOT VISIBLE FIELD COLUMN
		// TODO PASSWORD FIELD IS EDITABLE BUT NOT VISIBLE : DO NOT DISPLAY IN TABLE BUT DISPLAY IN FORM DIALOG
		// if ( ! $arg_field_object->isVisible() )
		// {
			// return HTML::formInput($field_id, $field_name, $field_label, "Hidden", $field_value, $field_readonly, "", "");
		// }
		
		// HIDE PRIMARY KEY FIELD COLUMN
		if ( $field_is_primary_key )
		{
			return HTML::formInput($field_id, $field_name, $field_label, "Hidden", $field_value, $field_readonly, "", "");
		}
		
		// DISPLAY THE FIELD COLUMN WITHOUT FOREIGN KEY
		if ( ! ($arg_field_object instanceof SQLField) or ! $arg_field_object->hasSQLForeignAttributes() )
		{
			return HTML::formInput($field_id, $field_name, $field_label, $field_type, $field_value, $field_readonly, "", "");
		}
		
		// DISPLAY THE FIELD COLUMN WITH FOREIGN KEY
		$distincts_records = $arg_model_object->fetchDistinctValuesForField($field_name, null, null, null, null);
		if ( is_null($distincts_records) )
		{
			TRACE::addErrorMsg($context, "distincts_records is null", self::$TRACE_ABSTRACT_INPUT_ADAPTER);
			return false;
		}
		
		$field_values = array();
		foreach($distincts_records as $key=>$record)
		{
			foreach($record as $keyr=>$value)
			{
				if ( ! is_null($value) && $value != "" )
				{
					$field_values[] = $value;
				}
			}
		}
//		TRACE::trace_var($context, "values", $field_values);
		HTML::formSelect($field_id, $field_name, $field_label, "Select", $field_values, $field_value, $field_readonly, "", " style='width=\"small\"';");
		
		return true;
	}
	
	public function htmlInput($arg_id, $arg_name, $arg_label, $arg_type, $arg_value, $arg_readonly, $arg_classes = "", $arg_opts = "")
	{
		$context = "DefaultInputAdapter::htmlInput";
		TRACE::enterWithArgs($context, "", self::$TRACE_ABSTRACT_INPUT_ADAPTER, $arg_id, $arg_name, $arg_label, $arg_type, $arg_value,  $arg_readonly, $arg_classes, $arg_opts);
		
		// CHECK TYPE AND NAME
		if ($arg_type === null or $arg_name === null or $arg_type == "" or $arg_name == "")
		{
			return TRACE::leaveko($context, "type or name is null or empty", false, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		}
		
		// LABEL TAG
		if ($arg_id !== null && $arg_id != "" && $arg_label !== null && $arg_label != "")
		{
			if ($arg_type != Type::$TYPE_HIDDEN && $arg_type != Type::$TYPE_BUTTON
				&& $arg_type != Type::$TYPE_SUBMIT && $arg_type != Type::$TYPE_RESET && $arg_type != Type::$TYPE_CANCEL)
			{
				HTML::addBufferLine("<LABEL for='".$arg_id."'>".$arg_label."</LABEL>");
			}
		}
		
		// PROCESSING
		$result = false;
		switch($arg_type)
		{
			case Type::$TYPE_INTEGER:	$result = $this->htmlInputInteger	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_STRING:	$result = $this->htmlInputString	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_HIDDEN:	$result = $this->htmlInputHidden	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_DATE:		$result = $this->htmlInputDate		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_DATETIME:	$result = $this->htmlInputDateTime	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_TIME:		$result = $this->htmlInputTime		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_PASSWORD:	$result = $this->htmlInputPassword	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_BUTTON:	$result = $this->htmlInputButton	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_SUBMIT:	$result = $this->htmlInputSubmit	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_RESET:		$result = $this->htmlInputReset		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_CANCEL:	$result = $this->htmlInputCancel	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_SELECT:	$result = $this->htmlInputSelect	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_URL:		$result = $this->htmlInputUrl		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_EMAIL:		$result = $this->htmlInputEmail		($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
			case Type::$TYPE_RICHTEXT:	$result = $this->htmlInputTextArea	($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts); break;
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
	protected function htmlInputString($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_type	= "type='TEXT'";
		$str_value	= ($arg_value !== null && $arg_value != "")	? " value='".$arg_value."'" : " value=''";
		$str_read	= ($arg_readonly !== null && Type::getBooleanValue($arg_readonly, false) )? " readonly" : "";
		
		$str = "<INPUT class='$arg_classes input-text' $str_id $str_type $str_name $str_value $str_read ".$arg_opts."/>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputInteger($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes." digits", $arg_opts);
	}
	
	protected function htmlInputNumber($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes." number", $arg_opts);
	}
	
	protected function htmlInputHidden($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? "id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? "name='".$arg_name."'" : "";
		$str_type	= "type='HIDDEN'";
		$str_value	= ($arg_value !== null && $arg_value != "")	? "value='".$arg_value."'" : " value=''";
		$str_read	= ($arg_readonly !== null && Type::getBooleanValue($arg_readonly, false) )? "readonly" : "";
		
		$str = "<INPUT class='$arg_classes input-text' $str_id $str_type $str_name $str_value $str_read ".$arg_opts."/>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputDate($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes." date", $arg_opts);
	}
	
	protected function htmlInputTime($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts);
	}
	
	protected function htmlInputDateTime($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts);
	}
	
	protected function htmlInputPassword($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$context = "DefaultInputAdapter::htmlInputPassword($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)";
		TRACE::enter($context, "", self::$TRACE_ABSTRACT_INPUT_ADAPTER);
		
		$str_id		= ($arg_id === null || $arg_id == "") ? "noid" : $arg_id;
		$str_name	= ($arg_name !== null && $arg_name != "") ? $arg_name : "noname";
		$str_value	= ($arg_value !== null && $arg_value != "") ? "value='".$arg_value."'" : " value=''";
		
		// IS A READ ONLY FIELD ?
		$is_readonly	= ($arg_readonly !== null) && Type::getBooleanValue($arg_readonly, false);
		
		// CREATE HTML BUFFER STRING
		$str = "";
		if ($is_readonly)
		{
			$str .= "<INPUT class='$arg_classes input-text' $str_id type='PASSWORD' $str_name $str_value readonly ".$arg_opts."/>";
		}
		else
		{
			$str_id_oldhash	= $str_id."_oldhash";
			$str_id_new		= $str_id."_new";
			$str_id_confirm	= $str_id."_confirm";
			$str_id_newhash	= $str_id;
			
			$str_name_oldhash	= $str_name."_oldhash";
			$str_name_new		= $str_name."_new";
			$str_name_confirm	= $str_name."_confirm";
			$str_name_newhash	= $str_name;
			
			$js_onchange	= "apt_form_password_onchange(\"$str_id_oldhash\", \"$str_id_new\", \"$str_id_confirm\", \"$str_id_newhash\");";
			
			$str .= "<INPUT class='$arg_classes input-text apt_password_oldhash' id='$str_id_oldhash' type='HIDDEN'   subtype='OLDHASH' name='$str_name_oldhash' $str_value readonly />";
			$str .= "<INPUT class='$arg_classes input-text apt_password_new'     id='$str_id_new'     type='PASSWORD' subtype='NEW'     name='$str_name_new'     value='' ".$arg_opts."/>";
			$str .= "<INPUT class='$arg_classes input-text apt_password_confirm' id='$str_id_confirm' type='PASSWORD' subtype='CONFIRM' name='$str_name_confirm' value='' ".$arg_opts." onchange='$js_onchange' />";
			$str .= "<INPUT class='$arg_classes input-text apt_password_newhash' id='$str_id_newhash' type='HIDDEN'   subtype='NEWHASH' name='$str_name_newhash' $str_value />";
		}
		
		// TODO OLD, NEW, CONFIRM
		HTML::addBufferLine($str);
		
		return TRACE::leaveok($context, "", true, self::$TRACE_ABSTRACT_INPUT_ADAPTER);
	}
	
	protected function htmlInputButton($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? "id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? "name='".$arg_name."'" : "";
		$str_type	= "";
		$str_value	= ($arg_value !== null && $arg_value != "")	? "value='".$arg_value."'" : " value=''";
		$str_read	= "";
		
		$str = "<BUTTON class='$arg_classes nice small radius blus button' $str_id $str_type $str_name $str_value $str_read ".$arg_opts.">$arg_label</BUTTON>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputSubmit($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? "id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? "name='".$arg_name."'" : "";
		$str_type	= "type='SUBMIT'";
		$str_value	= ($arg_value !== null && $arg_value != "")	? "value='".$arg_value."'" : " value=''";
		
		$str = "<BUTTON class='$arg_classes nice small radius blus button' $str_id $str_type $str_name $str_value ".$arg_opts.">$arg_label</BUTTON>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputReset($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? "id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? "name='".$arg_name."'" : "";
		$str_type	= "type='RESET'";
		$str_value	= ($arg_value !== null && $arg_value != "")	? "value='".$arg_value."'" : " value=''";
		
		$str = "<BUTTON class='$arg_classes nice small radius blus button' $str_id $str_type $str_name $str_value ".$arg_opts.">$arg_label</BUTTON>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputCancel($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? "id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? "name='".$arg_name."'" : "";
		$str_type	= "";
		$str_value	= ($arg_value !== null && $arg_value != "")	? "value='".$arg_value."'" : " value=''";
		
		$str = "<BUTTON class='$arg_classes nice small radius blus button' $str_id $str_type $str_name $str_value ".$arg_opts.">$arg_label</BUTTON>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputSelect($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? "id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? "name='".$arg_name."'" : "";
		$str_read	= ($arg_readonly !== null && Type::getBooleanValue($arg_readonly, false) ) ? "readonly" : "";
		$arg_values	= ( is_array($arg_value) && array_key_exists("values", $arg_value) ) ? $arg_value["values"] : null;
		$arg_selected_value = ( is_array($arg_value) && array_key_exists("selected", $arg_value) ) ? $arg_value["selected"] : "";
		
		// READONLY SELECT
		if ( Type::getBooleanValue($arg_readonly, false) )
		{
			return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_selected_value, true, $arg_classes, $arg_opts);
		}
		
		// CHECK VALUES
		if ( is_null($arg_values) or ! is_array($arg_values) )
		{
			return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_selected_value, true, $arg_classes, $arg_opts);
		}
		
		// NO READONLY SELECT
		$str = "<SELECT class='$arg_classes' $str_id $str_name $str_read $arg_opts />";
		HTML::addBufferLine($str);
		foreach($arg_values as $key=>$value)
		{
			$selected_str = ($value == $arg_selected_value) ? " SELECTED" : "";
			$str= "<OPTION value='".$value."'".$selected_str.">".$value."</OPTION>";
			HTML::addBufferLine($str);
		}
		
		$str = "</SELECT>";
		HTML::addBufferLine($str);
		return true;
	}
	
	protected function htmlInputUrl($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes." url", $arg_opts);
	}
	
	protected function htmlInputEmail($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		return $this->htmlInputString($arg_id, $arg_name, $arg_label, $arg_value,  $arg_readonly, $arg_classes." email", $arg_opts);
	}
	
	protected function htmlInputTextArea($arg_id, $arg_name, $arg_label, $arg_value, $arg_readonly, $arg_classes, $arg_opts)
	{
		$str_id		= ($arg_id !== null && $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null && $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_value	= ($arg_value !== null && $arg_value != "")	? " value='".$arg_value."'" : " value=''";
		$str_read	= ($arg_readonly !== null && Type::getBooleanValue($arg_readonly, false) )? " readonly" : "";
		
		$str = "<TEXTAREA class='$arg_classes input-text' $str_id $str_name $str_read ".$arg_opts.">$str_value</TEXTAREA>";
		HTML::addBufferLine($str);
		return true;
	}
}
?>