<?php
/**
 * @file        class_abstract_html_grid_layoutadapter.php
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
abstract class AbstractHtmlGridLayoutAdapter
{
	// GRID LAYOUT ADAPTER
	public abstract function enterRowLayout($arg_class = null, $arg_tag_opts = null);
	public abstract function leaveRowLayout();
	
	public abstract function enterColumnsLayout($arg_columns = 12, $arg_center = true, $arg_class = null);
	public abstract function leaveColumnsLayout();
}
?>