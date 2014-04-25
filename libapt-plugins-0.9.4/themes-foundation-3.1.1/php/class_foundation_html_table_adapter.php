<?php
/**
 * @version		$Id: class_foundation_html_table_adapter.php 2012-10-03 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-plugins-php/themes-foundation-x.y.z
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class FoundationHtmlTableAdapter extends AbstractHtmlTableAdapter
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
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
	
	
	// TABLE
	public function enterTable($arg_id = null, $arg_class = null, $arg_tag_opts = null)			{ CORE_HTML::enterTable($arg_id, "ui-widget ui-widget-content ".$arg_class, $arg_tag_opts); }
	public function leaveTable()																	{ CORE_HTML::leaveTable(); }
	
	public function enterTableHead($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ CORE_HTML::enterTableHead($arg_id, "ui-widget-header ".$arg_class, $arg_tag_opts); }
	public function leaveTableHead()																{ CORE_HTML::leaveTableHead(); }
	
	public function enterTableBody($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ CORE_HTML::enterTableBody($arg_id, $arg_class, $arg_tag_opts); }
	public function leaveTableBody()																{ CORE_HTML::leaveTableBody(); }
	
	public function enterTableFoot($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ CORE_HTML::enterTableFoot($arg_id, $arg_class, $arg_tag_opts); }
	public function leaveTableFoot()																{ CORE_HTML::leaveTableFoot(); }
}