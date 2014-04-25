	<?php
/**
 * @version		$Id: class_foundation_html_accordion_adapter.php 2012-10-03 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-plugins-php/themes-foundation-x.y.z
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class FoundationHtmlAccordionAdapter extends AbstractHtmlAccordionAdapter
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	
	// ACCORDION
	public function enterAccordion($arg_id = null, $arg_classes = null, $arg_tag_opts = null)
	{
		HTML::enterUL($arg_id, "accordion ".$arg_classes, $arg_tag_opts);
	}
	
	public function leaveAccordion()
	{
		HTML::leaveUL();
	}
	
	public function enterAccordionTitle()
	{
		HTML::enterLI();
		HTML::enterDIV(null, "title", null);
	}
	
	public function leaveAccordionTitle()
	{
		HTML::leaveDIV();
	}
	
	public function enterAccordionContent()
	{
		HTML::enterDIV(null, "content", null);
	}
	
	public function leaveAccordionContent()
	{
		HTML::leaveDIV();
		HTML::leaveLI();
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
		$response->useHeader("js-jquery-ui-tp", 14);
		
		// JS APT
		$response->useHeader("js-jquery-json-apt", 20);
		$response->useHeader("js-libapt-foundation", 20);
		$response->useHeader("js-libapt-md5", 20);
		$response->useHeader("js-libapt-main", 20);
		$response->useHeader("js-libapt-main-ajax", 20);
		$response->useHeader("js-libapt-main-field", 20);
		$response->useHeader("js-libapt-main-form", 20);
		
		$response->useHeader("js-libapt-main-view-table", 29);
		$response->useHeader("js-libapt-main-view-slice", 29);
		$response->useHeader("js-libapt-main-view-orders", 29);
		$response->useHeader("js-libapt-main-view-groups", 29);
		$response->useHeader("js-libapt-main-view-filters", 29);
		$response->useHeader("js-libapt-main-view-links", 29);
		$response->useHeader("js-libapt-main-view-selectors", 29);
		$response->useHeader("js-libapt-main-view-pager", 29);
		
		// CSS FOUNDATION
		$response->useHeader("css-foundation", 1);
		
		// CSS JQUERY UI
		$response->useHeader("css-jquery-ui", 2);
		
		// CSS APT
		$response->useHeader("css-libapt-main", 5);
	}
}