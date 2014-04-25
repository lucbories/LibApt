<?php
/**
 * @file        class_abstract_form_adapter.php
 * @brief       Abstract class for HTML FORM adapters
 * @details     ...
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
abstract class AbstractHtmlFormAdapter
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_ABSTRACT_FORM_ADAPTER = false;
	
	
	
	// ----------------- HTML INPUT FROM MODEL FIELD -----------------
	
	/**
	 * @brief		write html code for an input for a model field
	 * @return		nothing
	 */
	static public function htmlInputModelField($arg_model_object, $arg_field_object, $arg_field_value, $arg_readonly, $arg_id, $arg_name, $arg_label, $arg_input_css = "") {}
	
	
	// ----------------- HTML INPUT VALUE -----------------
	static public function htmlInput			($arg_id, $arg_name, $arg_label, $arg_type,		$arg_value,  $arg_readonly, $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputHidden		($arg_id, $arg_name, $arg_label,				$arg_value,  $arg_readonly, $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputDate		($arg_id, $arg_name, $arg_label,				$arg_value,  $arg_readonly, $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputTime		($arg_id, $arg_name, $arg_label,				$arg_value,  $arg_readonly, $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputDateTime	($arg_id, $arg_name, $arg_label,				$arg_value,  $arg_readonly, $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputPassword	($arg_id, $arg_name, $arg_label,				$arg_value,  $arg_readonly, $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputButton		($arg_id, $arg_name, $arg_label,				$arg_value,  $arg_content,  $arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputSelect		($arg_id, $arg_name, $arg_label,				$arg_values, $arg_readonly, $arg_selected_value, $arg_in_select = "", $arg_input_css = "", $arg_opts = "") {}
	
	// ----------------- HTML INPUT BUTTON -----------------
	static public function htmlInputSubmit		($arg_id, $arg_name, 	$arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputCancel		($arg_id, $arg_name, 	$arg_input_css = "", $arg_opts = "") {}
	static public function htmlInputReset		($arg_id, $arg_name,	$arg_input_css = "", $arg_opts = "") {}
}
?>