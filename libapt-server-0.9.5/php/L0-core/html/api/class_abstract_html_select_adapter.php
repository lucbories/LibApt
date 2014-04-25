<?php
/**
 * @file        class_abstract_html_select_adapter.php
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
abstract class AbstractHtmlSelectAdapter
{
	public abstract function dropDownMenuLabels($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_selected_index);
	public abstract function dropDownMenuUrls($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_urls, $arg_selected_index);
	
}
?>