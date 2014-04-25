<?php
/**
 * @version		$Id: class_foundation_html_grid_layout_adapter.php 2012-10-03 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-plugins-php/themes-foundation-x.y.z
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class FoundationHtmlGridLayoutAdapter extends AbstractHtmlGridLayoutAdapter
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	
	// LAYOUT
	public function enterRowLayout($arg_class = null, $arg_opts = null)
	{
		$class_str = is_null($arg_class) ? "row" : "row $arg_class";
		HTML::enterDIV(null, $class_str, $arg_opts);
	}
	
	public function leaveRowLayout()
	{
		HTML::leaveDIV();
	}
	
	public function enterColumnsLayout($arg_columns = 12, $arg_center = false, $arg_class = null)
	{
		$str_center = "";
		
		if ($arg_center === true)
		{
			$str_center = " centered";
		}
		
		$str = "bad columns number";
		switch ($arg_columns)
		{
			case  1 : $str = "one"; break;
			case  2 : $str = "two"; break;
			case  3 : $str = "three"; break;
			case  4 : $str = "four"; break;
			case  5 : $str = "five"; break;
			case  6 : $str = "six"; break;
			case  7 : $str = "seven"; break;
			case  8 : $str = "eight"; break;
			case  9 : $str = "nine"; break;
			case 10 : $str = "ten"; break;
			case 11 : $str = "eleven"; break;
			default : $str = "twelve"; break;
		}
		
		$class_str = is_null($arg_class) ? "" : " $arg_class";
		HTML::enterDIV(null, $str." columns".$str_center.$class_str, null);
	}
	
	public function leaveColumnsLayout()
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
	
	static public function useHeaders($arg_feature)
	{
		// GET RESPONSE AN SET USED HEADERS
		$response = Application::getInstance()->getResponse();
		
		if ($arg_feature == "jquery-ui-timepicker")
		{
			$response->useHeader("css-jquery-ui", 2);
			$response->useHeader("js-jquery-ui", 13);
			$response->useHeader("js-jquery-ui-tp", 14);
			return;
		}
	}
}