	<?php
/**
 * @file        class_abstract_html_input_adapter.php
 * @brief       ...
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
 * 
 */
abstract class AbstractHtmlInputAdapter
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_ABSTRACT_INPUT_ADAPTER = false;
	
	
	// HTML INPUT
	public abstract function getInputTypes();
	public abstract function htmlInputModelField($arg_id, $arg_name, $arg_label, $arg_readonly, $arg_hidden, $arg_form_id, $arg_model_object, $arg_field_object, $arg_field_value, $arg_classes = "", $arg_opts = "");
	public abstract function htmlInput($arg_id, $arg_name, $arg_label, $arg_type, $arg_value, $arg_readonly, $arg_input_css = "", $arg_opts = "");
}
?>