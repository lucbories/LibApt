<?php
/**
 * @file        class_abstract_html_table_adapter.php
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
abstract class AbstractHtmlTableAdapter
{
	// TABLE
	public abstract function enterTable($arg_id = null, $arg_class = null, $arg_tag_opts = null);
	public abstract function leaveTable();
	
	public abstract function enterTableHead($arg_id = null, $arg_class = null, $arg_tag_opts = null);
	public abstract function leaveTableHead();
	
	public abstract function enterTableBody($arg_id = null, $arg_class = null, $arg_tag_opts = null);
	public abstract function leaveTableBody();
	
	public abstract function enterTableFoot($arg_id = null, $arg_class = null, $arg_tag_opts = null);
	public abstract function leaveTableFoot();
}
?>