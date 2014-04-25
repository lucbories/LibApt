<?php
/**
 * @file        class_abstract_html_input_model_field_adapter.php
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
 */
abstract class AbstractHtmlInputModelFieldAdapter
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_ABSTRACT_INPUT_MODEL_FIELD_ADAPTER = false;
	
	
	
	// ----------------- HTML INPUT FROM MODEL FIELD -----------------
	
	/**
	 * @brief		write html code for an input for a model field
	 * @return		nothing
	 */
	public abstract function htmlInputModelField($arg_model_object, $arg_field_object, $arg_field_value, $arg_readonly, $arg_id, $arg_name, $arg_label, $arg_input_css = "");
}
?>