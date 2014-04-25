<?php
/**
 * @file        class_abstract_html_portlet_adapter.php
 * @brief       Html portlet adapter abstract class
 * @details     Define portlet features
 * @see			
 * @ingroup     L0_CORE
 * @date        2013-02-03
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 * 
 */
abstract class AbstractHtmlPortletAdapter
{
	// ACCORDION
	public abstract function enterPortletContainer($arg_id = null, $arg_classes = null, $arg_tag_opts = null);
	public abstract function leavePortletContainer();
	public abstract function enterPortlet($arg_id = null, $arg_classes = null, $arg_tag_opts = null);
	public abstract function leavePortlet();
	public abstract function enterPortletTitle($arg_id = null, $arg_classes = null, $arg_tag_opts = null);
	public abstract function leavePortletTitle();
	public abstract function enterPortletContent($arg_id = null, $arg_classes = null, $arg_tag_opts = null);
	public abstract function leavePortletContent();
}
?>