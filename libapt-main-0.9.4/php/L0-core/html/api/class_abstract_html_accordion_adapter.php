<?php
/**
 * @file        class_abstract_html_accordion_adapter.php
 * @brief       ...
 * @details     ...
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 * 
 */
abstract class AbstractHtmlAccordionAdapter
{
	// ACCORDION
	public abstract function enterAccordion($arg_id = null, $arg_classes = null, $arg_tag_opts = null);
	public abstract function leaveAccordion();
	public abstract function enterAccordionTitle();
	public abstract function leaveAccordionTitle();
	public abstract function enterAccordionContent();
	public abstract function leaveAccordionContent();
}
?>