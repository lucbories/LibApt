<?php
/**
 * @file        class_jquery-ui_html_accordion_adapter.php
 * @brief       Html accordion adapter class for jQueryUI
 * @details     Define accordion features based on the jQueryUI library
 * @see			AbstractHtmlAccordionAdapter Trace
 * @ingroup     LIBAPT_PLUGINS
 * @date        2013-02-03
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class JQueryUIHtmlAccordionAdapter extends AbstractHtmlAccordionAdapter
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	
	// ACCORDION
	public function enterAccordion($arg_id = null, $arg_classes = null, $arg_tag_opts = null)
	{
		HTML::enterDIV($arg_id, "jquery-ui-accordion ".$arg_classes, $arg_tag_opts);
	}
	
	public function leaveAccordion()
	{
		HTML::leaveDIV();
	}
	
	public function enterAccordionTitle()
	{
		HTML::enterH3();
	}
	
	public function leaveAccordionTitle()
	{
		HTML::leaveH3();
	}
	
	public function enterAccordionContent()
	{
		HTML::enterDIV(null, "content");
	}
	
	public function leaveAccordionContent()
	{
		HTML::leaveDIV();
	}
	
	
	// HEADERS
	public function useStandardHeaders()
	{
		// GET RESPONSE AN SET USED HEADERS
		$response = Application::getInstance()->getResponse();
		
		// JS FOUNDATION
		$response->useHeader("js-foundation", 11);
		
		// JS JQUERY
		$response->useHeader("js-jquery-validate", 12);
		
		// JS JQUERY UI
		$response->useHeader("js-jquery-ui", 13);

		
		// CSS FOUNDATION
		$response->useHeader("css-foundation", 1);
		
		// CSS JQUERY UI
		$response->useHeader("css-jquery-ui", 2);
	}
}