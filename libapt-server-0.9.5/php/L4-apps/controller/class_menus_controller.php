<?php
/**
 * @file        class_menus_controller.php
 * @brief       MenuItem repository
 * @details     
 * @see			MenuItem MenuBar AbstractController Trace
 * @ingroup     L4_APPS
 * @date        2013-01-27
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class MenusController extends AbstractController
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_MENUS_CONTROLLER	= false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	/// @brief		top level menus (array of MenuItem)
	protected $depth_zero_menus = array();
	
	/// @brief		menus bars (array of MenuBar)
	protected $menus_bars = array();
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	public function __construct()
	{
		// PARENT CONSTRUCTOR
		parent::__construct();
	}
	
	
	
	// ----------------- MENUS REPOSITORY METHODS -----------------
	/**
	 * @brief		Check if the given object is managed by this controller
	 * @param[in]	arg_named_object		instance of a named object
	 * @return		nothing
	 */
	public function checkObject($arg_named_object)
	{
		if ( ! is_null($arg_named_object) )
		{
			return $arg_named_object instanceof MenuItem;
		}
		
		return null;
	}
	
	
	/**
	 * @brief		Execute an action on the controller
	 * @param[in]	arg_action_name			name of the requested action
	 * @param[in]	arg_url_parameters		the requested arguments
	 * @return		boolean (true:success, false:failure)
	 */
	protected function doActionSelf($arg_action_name, $arg_url_parameters)
	{
		return TRACE::leaveko("MenusController.doAction", "action inconnue=[".$arg_action_name."]", false, self::$TRACE_MENUS_CONTROLLER);
	}
	
	
	/**
	 * @brief		Register a MenuItem
	 * @param[in]	arg_menu_item		menu item to register
	 * @return		boolean (true:success, false:failure)
	 */
	public function registerObject($arg_menu_item)
	{
		$context = "MenusController.registerObject";
		CONTRACT::assertNotNull($context.".arg_menu_item", $arg_menu_item);
		
		// GET MENU ITEM ATTRIBUTES
		$menu_item_name = $arg_menu_item->getName();
		$menu_item_depth = $arg_menu_item->getDepth();
		
		// TEST TOP LEVEL MENUS
		if ($menu_item_depth == 0)
		{
			// REGISTER TOP LEVEL MENUS
			$this->depth_zero_menus[$menu_item_name] = $arg_menu_item;
			
			// REGISTER MENUS BAR
			if ($arg_menu_item instanceof MenuBar)
			{
				$this->menus_bars[$menu_item_name] = $arg_menu_item;
			}
		}
		
		// REGISTER MENUS
		return parent::registerObject($arg_menu_item);
	}
	
	
	/**
	 * @brief		Unregister a MenuItem
	 * @param[in]	arg_menu_item		menu item to unregister
	 * @return		boolean (true:success, false:failure)
	 */
	public function unregisterObject($arg_menu_item)
	{
		$context = "MenusController.unregisterObject";
		CONTRACT::assertNotNull($context.".arg_menu_item", $arg_menu_item);
		
		// GET MENU ITEM ATTRIBUTES
		$menu_item_name = $arg_menu_item->getName();
		$menu_item_depth = $arg_menu_item->getDepth();
		
		// TEST TOP LEVEL MENUS
		if ($menu_item_depth == 0)
		{
			// UNREGISTER TOP LEVEL MENUS
			if ( array_key_exists($menu_item_name, $this->depth_zero_menus) )
			{
				unset($this->depth_zero_menus[$menu_item_name]);
			}
			
			// UNREGISTER MENUS BAR
			if ($arg_menu_item instanceof MenuBar)
			{
				unset($this->menus_bars[$menu_item_name]);
			}
		}
		
		// UNREGISTER MENUS
		return parent::unregisterObject($arg_menu_item);
	}
	
	
	
	// ----------------- TOP LEVEL MENUS METHODS -----------------
	/**
	 * @brief		Get the top level menus
	 * @return		array of MenuItem
	 */
	public function getMenusOfDepthZero()
	{
		return $this->depth_zero_menus;
	}
	
	
	/**
	 * @brief		Get the menus bars
	 * @return		array of MenuBar
	 */
	public function getMenusBars()
	{
		return $this->menus_bars;
	}
	
	
	/**
	 * @brief		Get a menus bar
	 * @param[in]	arg_menus_bar_name		name of the menu bar	
	 * @return		MenuBar or null
	 */
	public function getMenusBar($arg_menus_bar)
	{
		return array_key_exists($arg_menus_bar, $this->menus_bars) ? $this->menus_bars[$arg_menus_bar] : null;
	}
}
?>