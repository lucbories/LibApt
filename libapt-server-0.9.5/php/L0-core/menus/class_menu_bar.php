<?php
/**
 * @file        class_menu_bar.php
 * @brief       Main menus bar
 * @details     MenuBar declare a the application top level menus bar
 * @see			MenuItem Trace
 * @ingroup     L0_CORE
 * @date        2012-11-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		Update menus loader with menus bar
 * @todo		Update theme adapter with menus bar (top and navigation)
 */
class MenuBar extends MenuItem
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	/// @brief		Format of the menus bar : display the menus bar on top of the application page
	static public $FORMAT_TOP	= "TOP";
	
	/// @brief		Format of the menus bar : display the menus bar into the application page as a navigation menu
	static public $FORMAT_NAV	= "NAV";
	
	/// @brief		Orientation of the menus bar : display the menus bar as a vertical list of menus (not compatible with top menu bar format
	static public $ORIENTATION_VERTICAL		= "VERTICAL";
	
	/// @brief		Orientation of the menus bar : display the menus bar as an horizontal list of menus
	static public $ORIENTATION_HORIZONTAL	= "HORIZONTAL";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	/// @brief		Menus bar orientation : MenuBar::$ORIENTATION_VERTICAL or MenuBar::$ORIENTATION_HORIZONTAL (string)
	protected $bar_orientation	= null;
	
	/// @brief		Menus bar format : MenuBar::$FORMAT_TOP or MenuBar::$FORMAT_NAV (string)
	protected $bar_format		= null;
	
	/// @brief		Menus bar template (string)
	protected $bar_template		= null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_name			unique name of the object
	 * @param[in]	arg_label			label to display
	 * @param[in]	arg_access_role		role to display the object
	 * @param[in]	arg_orientation		MenuBar::$ORIENTATION_VERTICAL or MenuBar::$ORIENTATION_HORIZONTAL
	 * @param[in]	arg_format			MenuBar::$FORMAT_TOP or MenuBar::$FORMAT_NAV
	 * @param[in]	arg_template		Layout template
	 * @return		nothing
	 */
	public function __construct($arg_name, $arg_label, $arg_access_role, $arg_orientation, $arg_format, $arg_template)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_name, $arg_label, null,
							null, null, null, null, null,
							$arg_access_role, null, null);
		
		// SET ATTRIBUTES
		$this->access_role		= $arg_access_role;
		$this->bar_orientation	= $this->getValidOrientation($arg_orientation);
		$this->bar_format		= $this->getValidFormat($arg_format);
		$this->bar_template		= $arg_template;
	}
	
	
	
	// ----------------- CHECKS METHODS -----------------
	/**
	 * @brief		Check the orientation value and returns a valid value
	 * @param[in]	arg_orientation		MenuBar::$ORIENTATION_VERTICAL or MenuBar::$ORIENTATION_HORIZONTAL
	 * @return		The given orientation value if valid or MenuBar::$ORIENTATION_HORIZONTAL
	 */
	protected function getValidOrientation($arg_orientation)
	{
		switch($arg_orientation)
		{
			case MenuBar::$ORIENTATION_VERTICAL:
			case MenuBar::$ORIENTATION_HORIZONTAL:
				return $arg_orientation;
		}
		return MenuBar::$ORIENTATION_HORIZONTAL;
	}
	
	/**
	 * @brief		Check the format value and returns a valid value
	 * @param[in]	arg_format		MenuBar::$FORMAT_TOP or MenuBar::$FORMAT_NAV
	 * @return		The given foramt value if valid or MenuBar::$FORMAT_NAV
	 */
	protected function getValidFormat($arg_format)
	{
		switch($arg_format)
		{
			case MenuBar::$FORMAT_TOP:
			case MenuBar::$FORMAT_NAV:
				return $arg_format;
		}
		return MenuBar::$FORMAT_NAV;
	}
	
	
	
	// ----------------- CLASS ACCESSORS -----------------
	/**
	 * @brief		Menus bar orientation accessor
	 * @return		Menus bar orientation string as MenuBar::$ORIENTATION_VERTICAL or MenuBar::$ORIENTATION_HORIZONTAL
	 */
	public function getMenuBarOrientation()
	{
		return $this->bar_orientation;
	}
	
	/**
	 * @brief		Menus bar format accessor
	 * @return		Menus bar format string as MenuBar::$FORMAT_TOP or MenuBar::$FORMAT_NAV
	 */
	public function getMenuBarFormat()
	{
		return $this->bar_format;
	}
	
	/**
	 * @brief		Menus bar template accessor
	 * @return		Menus bar template string
	 */
	public function getMenuBarTemplate()
	{
		return $this->bar_template;
	}
}
?>
