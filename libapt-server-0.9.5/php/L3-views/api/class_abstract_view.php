<?php
/**
 * @file        class_abstract_view.php
 * @brief       Base class for all views (api)
 * @details     Provides common options and helpers
 * @see			AbstractControlledImpl Trace Type
 * @ingroup     L3_VIEWS
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractView extends AbstractControlledImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
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
		parent::__construct($arg_unique_name);
		
		// SET ATTRIBUTES
		$this->setParentView($arg_parent_view);
		$this->setRuntimeOptions($arg_options);
	}
	
	
	// ----------------- VIEW INIT -----------------
	/**
	 * @brief		Init view : common init (call initSelf())
	 * @return		boolean		true on success, false on failure
	 */
	abstract protected function init();
	
	/**
	 * @brief		Init view
	 * @return		boolean		true on success, false on failure
	 */
	abstract protected function initSelf();
	
	/**
	 * @brief		Test if the view initialisation is started
	 * @return		boolean		true, false
	 */
	abstract public function isInitStarted();
	
	
	
	// ----------------- HTML / JS HELPERS -----------------
	/**
	 * @brief		Append JavaScript code to execute on document ready event
	 * @param[in]	arg_js_code			JavaScript code
	 * @return		nothing
	 */
	abstract protected function appendOnReadyCode($arg_js_code);
	
	/**
	 * @brief		Append JavaScript code to execute on document ready event if arg_condition is true
	 * @param[in]	arg_condition		execution condition
	 * @param[in]	arg_js_code			JavaScript code
	 * @return		nothing
	 */
	abstract protected function enableShowHideCmd($arg_header_selector, $arg_content_selector);
	
	/**
	 * @brief		Get the html id of the html element
	 * @return		string				html id
	 */
	abstract public function getHtmlId();
	
	
	
	// ----------------- VIEW ATTRIBUTES -----------------
	
	/**
	 * @brief		Test if the view has a parent view
	 * @return		boolean
	 */
	abstract public function hasParentView();
	
	/**
	 * @brief		Get the parent view
	 * @return		object			instance of an AbstractView subclass
	 */
	abstract public function getParentView();
	
	/**
	 * @brief		Get the top parent view
	 * @return		object			instance of an AbstractView subclass
	 */
	abstract public function getTopParentView();
	
	/**
	 * @brief		Set the parent view
	 * param[in]	arg_parent_view			instance of an AbstractView subclass
	 * @return		nothing
	 */
	abstract public function setParentView($arg_parent_view);
	
	
	/**
	 * @brief		Get the 'is visible' attribute
	 * @return		boolean
	 */
	abstract public function isVisible();
	
	/**
	 * @brief		Set the 'is visible' attribute
	 * param[in]	arg_visible			(boolean)
	 * @return		nothing
	 */
	abstract public function setIsVisible($arg_visible);
	
	
	/**
	 * @brief		Get the 'is editable' attribute
	 * @return		boolean
	 */
	abstract public function isEditable();
	
	/**
	 * @brief		Set the 'is editable' attribute
	 * param[in]	arg_editable		(boolean)
	 * @return		nothing
	 */
	abstract public function setIsEditable($arg_editable);
	
	
	
	
	// ----------------- VIEW RENDER -----------------
	/**
	 * @brief		Declare common html headers
	 * @return		nothing
	 */
	abstract public function declareHtmlHeaders();
	
	/**
	 * @brief		Declare view html headers
	 * @return		nothing
	 */
	abstract protected function declareHtmlHeadersSelf();
	
	/**
	 * @brief		Render parent view
	 * @return		nothing
	 */
	abstract public function renderParent($arg_render_mode = "html");
	
	/**
	 * @brief		Render view
	 * @return		nothing
	 */
	abstract public function render($arg_render_mode = "html");
	
	/**
	 * @brief		Render console view
	 * @return		nothing
	 */
	abstract public function console();
	
	/**
	 * @brief		Render html view
	 * @return		nothing
	 */
	abstract public function html();
	
	
	
	// ----------------- TRANSLATION -----------------
	/**
	 * @brief		Translate a text
	 * @param[in]	arg_text_to_translate	text to translate (string)
	 * @return		string					translated text or text if no translation found
	 */
	abstract public function translate($arg_text_to_translate);
}
?>