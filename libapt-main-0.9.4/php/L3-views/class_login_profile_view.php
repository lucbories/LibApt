<?php
/**
 * @version		$Id: class_login_profile_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class LoginProfileView extends AbstractTemplateViewImpl
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options = null)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
	}
	
	
	// RENDER HTML
	public function htmlSelf()
	{
		if ( ! Authentication::isLogged() )
		{
			HTML::addBufferLine("<h5>No logged user</h5>");
			return;
		}
		
		HTML::enterTable();
		HTML::enterTableHead();
		HTML::addBufferLine("<TH WIDTH=40 ALIGN='CENTER'>ROLES</TH>");
		HTML::leaveTableHead();
		
		// SEARCH ROLES
		$roles = Authentication::getLoginRoles();
		if ( is_null($roles) )
		{
			HTML::addBufferLine("<TR><TD ALIGN='CENTER'>NO ROLES</TD></TR>");
			HTML::leaveTable();
			return;
		}
		
		// DISPLAY ROLES
		foreach($roles as $role)
		{
			HTML::enterTR();
			HTML::addBufferLine("<TD class='dense' WIDTH=250 ALIGN='LEFT'>".$role."</TD>");
			HTML::leaveTR();
		}
		
		HTML::leaveTable();
	}
}
?>