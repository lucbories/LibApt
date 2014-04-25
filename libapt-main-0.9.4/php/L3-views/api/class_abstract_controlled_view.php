<?php
/**
 * @version		$Id: class_abstract_controlled_view.php 2012-03-10 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractControlledView extends AbstractControlledImpl
{
	// ATTRIBUTES
	static public $SUBACTION_CREATE		= "create";
	static public $SUBACTION_EDIT		= "edit";
	static public $SUBACTION_DELETE		= "delete";
	static public $SUBACTION_OPD_ROW	= "row";
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
	}
	
	
	// SUB ACTIONS FOR VIEWS
	// abstract public function hasSubActionCreate();
	// abstract public function hasSubActionEdit();
	// abstract public function hasSubActionDelete();
	// abstract public function getSubActionRow();
	// abstract public function getSubActionCreateUrl($arg_display_prefix);
	// abstract public function getSubActionEditUrl($arg_display_prefix, $arg_operand_value);
	// abstract public function getSubActionDeleteUrl($arg_display_prefix, $arg_operand_value);
}
?>