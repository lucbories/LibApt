<?php
/**
 * @version		$Id: class_js_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class JSView extends AbstractTemplateViewImpl
{
	// STATIC ATTRIBUTES
	
	// ATTRIBUTES
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options, $arg_js_class_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		$this->js_view_class = $arg_js_class_name;
	}
	
	
	// RENDER HTML
	public function declareHtmlHeaders()
	{
		HTML::useStandardHeaders();
	}
	
	public function htmlSelf()
	{
		// CREATE INIT TAG
		$view_name	= $this->getName();
		$div_id		= $view_name."_container_id";
		HTML::addBufferLine("<div id='$div_id' ></div>");
	}
}
?>