<?php
/**
 * @version		$Id: class_abstract_controlled_view_impl.php 2012-03-10 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractControlledViewImpl extends AbstractControlledView
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name);
	}
	
	
	// SUB ACTIONS FOR VIEWS
	// public function hasSubActionCreate()
	// {
		// return $this->hasSubAction(self::$SUBACTION_CREATE);
	// }
	
	// public function hasSubActionEdit()
	// {
		// return $this->hasSubAction(self::$SUBACTION_EDIT);
	// }
	
	// public function hasSubActionDelete()
	// {
		// return $this->hasSubAction(self::$SUBACTION_DELETE);
	// }
	
	// public function getSubActionRow()
	// {
		// $opd_value = $this->getSubActionOperand(self::$SUBACTION_OPD_ROW);
		// return $opd_value;
	// }
	
	// public function getSubActionCreateUrl($arg_display_prefix)
	// {
		// $action_display	= $arg_display_prefix . $this->getTopParentView()->getName();
		// $subaction_url	= $this->getSubActionUrl(self::$SUBACTION_CREATE);
		// return Urls::getActionUrl(null, $action_display, $subaction_url);
	// }
	
	// public function getSubActionEditUrl($arg_display_prefix, $arg_operand_value)
	// {
		// $action_display	= $arg_display_prefix . $this->getTopParentView()->getName();
		// $subaction_url	= $this->getSubActionUrl(self::$SUBACTION_EDIT, self::$SUBACTION_OPD_ROW, $arg_operand_value);
		// return Urls::getActionUrl(null, $action_display, $subaction_url);
	// }
	
	// public function getSubActionDeleteUrl($arg_display_prefix, $arg_operand_value)
	// {
		// $action_display	= $arg_display_prefix . $this->getTopParentView()->getName();
		// $subaction_url	= $this->getSubActionUrl(self::$SUBACTION_DELETE, self::$SUBACTION_OPD_ROW, $arg_operand_value);
		// return Urls::getActionUrl(null, $action_display, $subaction_url);
	// }
}
?>