<?php
/**
 * @version		$Id: class_foundation_html_adapter.php 2012-10-03 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-plugins-php/themes-foundation-x.y.z
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class FoundationHtmlSelectAdapter extends AbstractHtmlSelectAdapter
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	// DROP DOWN MENU
	public function dropDownMenuLabels($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_selected_index)
	{
		$items_count = count($arg_labels);
		$arg_menu_id = $arg_menu_label;
		
		if ($items_count == 0)
		{
			return;
		}
		
		$menu_style = is_null($arg_menu_style) ? "" : "style='$arg_menu_style'";
		$has_selector = $arg_menu_selector == true;
		
		HTML::addBufferLine("<FORM class='custom'>");
		
		HTML::enterSELECT($arg_menu_id, null, "style='display:none;'");
		for($index = 0 ; $index < $items_count ; ++$index)
		{
			$label = $arg_labels[$index];
			$selected = $index == $arg_selected_index;
			
			HTML::tagOPTION($label, $selected, null, null, null);
		}
		HTML::leaveSELECT();
		
		HTML::addBufferLine("<div class='custom dropdown' $menu_style>");
		HTML::tagAnchor("#", $arg_menu_label, null, "current", null);
		if ($has_selector)
		{
			HTML::tagAnchor("#", "", null, "selector", null);
		}
		
		HTML::enterUL(null, null, $menu_style);
		for($index = 0 ; $index < $items_count ; ++$index)
		{
			$label = $arg_labels[$index];
			$class = $index == $arg_selected_index ? "selected" : null;
			
			HTML::tagLI($label, null, $class, null);
		}
		HTML::leaveUL();
		
		HTML::addBufferLine("</FORM>");
		
		HTML::leaveDIV();
	}
	
	public function dropDownMenuUrls($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_urls, $arg_selected_index)
	{
		$items_count = count($arg_labels);
		$arg_menu_id = $arg_menu_label;
		
		if ($items_count == 0)
		{
			return;
		}
		
		$menu_style = is_null($arg_menu_style) ? "" : "style='$arg_menu_style'";
		$has_selector = $arg_menu_selector == true;
		
		HTML::addBufferLine("<FORM class='custom'>");
		
		HTML::enterSELECT($arg_menu_id, null, "style='display:none;'");
		for($index = 0 ; $index < $items_count ; ++$index)
		{
			$label = $arg_labels[$index];
			$selected = $index == $arg_selected_index;
			$url   = is_null($arg_urls) ? null : $arg_urls[$index];
			
			HTML::enterOPTION($selected, null, null, null);
			HTML::tagAnchor($url, $label, null, null, null);
			HTML::leaveOPTION();
		}
		HTML::leaveSELECT();
		
		HTML::addBufferLine("<div class='custom dropdown' $menu_style>");
		HTML::tagAnchor("#", $arg_menu_label, null, "current", null);
		if ($has_selector)
		{
			HTML::tagAnchor("#", "", null, "selector", null);
		}
		
		HTML::enterUL(null, null, null);
		for($index = 0 ; $index < $items_count ; ++$index)
		{
			$label = $arg_labels[$index];
			$url   = is_null($arg_urls) ? null : $arg_urls[$index];
			$class = $index == $arg_selected_index ? "selected" : null;
			
			HTML::enterLI($label, null, $class);
			HTML::tagAnchor($url, $label, null, null, null);
			HTML::leaveLI();
		}
		HTML::leaveUL();
		
		HTML::addBufferLine("</FORM>");
		
		HTML::leaveDIV();
	}
	
	
	// HEADERS
	static public function useStandardHeaders()
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
?>