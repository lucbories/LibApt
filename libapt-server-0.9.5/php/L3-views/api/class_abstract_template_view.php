<?php
/**
 * @file        class_abstract_template_view.php
 * @brief       Base class for views using template feature (api)
 * @details     The view render itself into an html template. The template is provided with a string constant or an file name
 * @see			AbstractViewImpl AbstractControlledImpl Trace Type
 * @ingroup     L3_VIEWS
 * @date        2012-09-09
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractTemplateView extends AbstractViewImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_TEMPLATE_VIEW = false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name			unique name for view
	 * @param[in]	arg_parent_view			parent view object or null
	 * @param[in]	arg_options				options array or null
	 * @return		nothing
	 */
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
	}
	
	
	
	// ----------------- VIEW TEMPLATE ATTRIBUTES -----------------
	
	/**
	 * @brief		Enable template feature
	 * @return		nothing
	 */
	abstract public function enableTemplate();
	
	/**
	 * @brief		Disable template feature
	 * @return		nothing
	 */
	abstract public function disableTemplate();
	
	/**
	 * @brief		Set the template from a string constant
	 * @param[in]	arg_string				string constant of the template content
	 * @return		nothing
	 */
	abstract public function setTemplateFromString($arg_string);
	
	/**
	 * @brief		Set the template from a text file
	 * @param[in]	arg_file_name			file name of the template content
	 * @return		nothing
	 */
	abstract public function setTemplateFromFileName($arg_file_name);
	
	/**
	 * @brief		Set the keyword/tags from a string constant
	 * @param[in]	arg_string				string to parse
	 * @return		nothing
	 */
	abstract public function setTagsFromString($arg_string);
	
	/**
	 * @brief		Set the keyword/object bindings from a string constant
	 * @param[in]	arg_string				string to parse
	 * @return		nothing
	 */
	abstract public function setBindingsFromString($arg_string);
	
	/**
	 * @brief		Bind a view object to the template keyword
	 * @param[in]	arg_template_key		template keyword
	 * @param[in]	arg_view_object			object for the view to display in place of the keyword
	 * @return		nothing
	 */
	abstract public function bind($arg_template_key, $arg_view_object);
	
	/**
	 * @brief		Get the object bind to the keyword
	 * @param[in]	arg_template_key		template keyword
	 * @return		object					object for the view to display in place of the keyword
	 */
	abstract public function getBinding($arg_template_key);
	
	
	
	// ----------------- VIEW RENDER -----------------
	
	/**
	 * @brief		Render before template
	 * @return		nothing
	 */
	abstract public function htmlBegin();
	
	/**
	 * @brief		Render after template
	 * @return		nothing
	 */
	abstract public function htmlEnd();
	
	/**
	 * @brief		Render html for subclasses
	 * @return		nothing
	 */
	abstract protected function htmlSelf();
}
?>