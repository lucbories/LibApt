<?php
/**
 * @file        class_jquery-ui_html_portlet_adapter.php
 * @brief       Html portlet adapter class for jQueryUI
 * @details     Define portlet features based on the jQueryUI library
 * @see			AbstractHtmlPortletAdapter Trace
 * @ingroup     LIBAPT_PLUGINS
 * @date        2013-02-03
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class JQueryUIHtmlPortletAdapter extends AbstractHtmlPortletAdapter
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	
	// PORTLET
	
	public function enterPortletContainer($arg_id = null, $arg_class = null, $arg_opts = null)
	{
		HTML::enterDIV($arg_id, "libapt_portlet_container ".$arg_class, $arg_opts);
	}
	
	public function leavePortletContainer()
	{
		HTML::leaveDIV();
	}
	
	public function enterPortlet($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		HTML::enterDIV($arg_id, "portlet ".$arg_class, $arg_tag_opts);
	}
	
	public function leavePortlet()
	{
		HTML::leaveDIV();
	}
	
	public function enterPortletTitle($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		HTML::enterDIV($arg_id, "portlet-header ".$arg_class, $arg_tag_opts);
	}
	
	public function leavePortletTitle()
	{
		HTML::leaveDIV();
	}
	
	public function enterPortletContent($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		HTML::enterDIV($arg_id, "portlet-content ".$arg_class, $arg_tag_opts);
	}
	
	public function leavePortletContent()
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