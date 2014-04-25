<?php
/**
 * @file        class_menu_item.php
 * @brief       Menu item
 * @details     MenuItem declare a menu element
 * @see			Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class MenuItem extends Named
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	/// @brief		Kind of menu item : the object is an element of a menus bar
	static public $MENU_TYPE_MENU		= "MENU";
	
	/// @brief		Kind of menu item : the object is a item of a menu
	static public $MENU_TYPE_ITEM		= "MENUITEM";
	
	/// @brief		Kind of menu item : the object is a separator item of a menu
	static public $MENU_TYPE_SEPARATOR	= "SEPARATOR";
	
	/// @brief		Kind of menu item : the object is a label item of a menu
	static public $MENU_TYPE_LABEL		= "LABEL";
	
	/// @brief		Kind of menu item : the object is a top menus bar
	static public $MENU_TYPE_TOPMENUBAR	= "TOPMENUBAR";
	
	/// @brief		Kind of menu item : the object is a navigation menus bar
	static public $MENU_TYPE_NAVMENUBAR	= "NAVMENUBAR";
	
	/// @brief		Position of the menu item : display the menu on the left of the menus bar
	static public $MENU_POS_LEFT		= "LEFT";
	
	/// @brief		Position of the menu item : display the menu on the right of the menus bar
	static public $MENU_POS_RIGHT		= "RIGHT";
	
	/// @brief		Name of the menu item icon in the standard url : display the icon on the left of the menus item
	// static public $MENU_ICON_NAME		= "ICON_NAME";
	
	/// @brief		Url of the menu item icon : display the icon on the left of the menus item
	static public $MENU_ICON_URL		= "ICON_URL";
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	/// @brief		label of the menu item
	protected $label					= null;
	
	/// @brief		parent menu object of the menu item
	protected $parent_menu				= null;
	
	/// @brief		array of childs menus objects of the menu item
	protected $childs_menus				= null;
	
	/// @brief		depth of the menu item in the menus tree
	protected $depth					= null;
	
	/// @brief		type of the menu
	protected $type						= null;
	
	/// @brief		menu action : view action view name of the menu item
	protected $action_view				= null;
	
	/// @brief		menu action : model action model name of the menu item
	protected $action_model				= null;
	
	/// @brief		menu action : json action model name of the menu item
	protected $action_json				= null;
	
	/// @brief		menu action : javascript action of the menu item
	protected $action_js				= null;
	
	/// @brief		menu action : view action operands of the menu item
	protected $action_view_operands		= null;
	
	/// @brief		menu action : model action operands of the menu item
	protected $action_model_operands	= null;
	
	/// @brief		needed role of the logged user to display the menu
	protected $access_role				= null;
	
	/// @brief		display position of the menu item
	protected $position					= null;
	
	/// @brief		icon url to display on the left of the menu item
	protected $icon_url					= null;
	
	/// @brief		url link
	protected $link_url					= null;
	
	/// @brief		tooltip
	protected $tooltip					= null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_name			unique name of the object
	 * @param[in]	arg_label			label to display
	 * @param[in]	arg_parent_menu		parent menu item object
	 * 
	 * @param[in]	arg_action_view				menu action : view name of a view action
	 * @param[in]	arg_action_view_operands	menu action : action operands of a view action
	 * @param[in]	arg_action_model			menu action : model name of a model action
	 * @param[in]	arg_action_model_operands	menu action : action operands of a model action
	 * @param[in]	arg_action_json				menu action : model name of a json action
	 * 
	 * @param[in]	arg_access_role		role to display the object
	 * @param[in]	arg_position		MenuItem::$MENU_POS_LEFT or MenuItem::$MENU_POS_RIGHT
	 * @return		nothing
	 */
	public function __construct(
		$arg_name, $arg_label, $arg_parent_menu,
		$arg_action_view, $arg_action_view_operands, $arg_action_model, $arg_action_model_operands, $arg_action_json,
		$arg_access_role, $arg_position, $arg_icon_url, $arg_type = null)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_name);
		
		// SET NAME (parent constructor), LABEL, PARENT
		$this->label			= $arg_label;
		$this->parent_menu		= $arg_parent_menu;
		$this->depth			= 0;
		if ( ! is_null($arg_parent_menu) )
		{
			$arg_parent_menu->addChild($this);
			$this->depth = $arg_parent_menu->getDepth() + 1;
		}
		$this->type				= is_null($arg_type) ? ($this->depth == 0 ? self::$MENU_TYPE_MENU : self::$MENU_TYPE_ITEM) : $arg_type;
		
		// INIT CHILDS ARRAY AND DEPTH
		$this->childs_menus		= array();
		
		// SET ACTION ATTRIBUTES
		$this->action_view				= $arg_action_view;
		$this->action_model				= $arg_action_model;
		$this->action_json				= $arg_action_json;
		$this->action_view_operands		= trim($arg_action_view_operands);
		$this->action_model_operands	= trim($arg_action_model_operands);
		
		// SET ROLE AND POSITION
		$this->access_role		= $arg_access_role;
		$this->position			= $this->getValidPosition($arg_position);
		
		$this->icon_url			= $arg_icon_url;
		$this->link_url			= null;
	}
	
	
	
	// ----------------- CHECKS METHODS -----------------
	/**
	 * @brief		Check the position value and returns a valid value
	 * @param[in]	arg_position		MenuItem::$MENU_POS_LEFT or MenuItem::$MENU_POS_RIGHT
	 * @return		The given position value if valid or MenuBar::$MENU_POS_LEFT
	 */
	protected function getValidPosition($arg_position)
	{
		switch($arg_position)
		{
			case MenuItem::$MENU_POS_LEFT:
			case MenuItem::$MENU_POS_RIGHT:
				return $arg_position;
		}
		return MenuItem::$MENU_POS_LEFT;
	}
	
	
	
	// ----------------- CLASS ACCESSORS -----------------
	/**
	 * @brief		Label menu item accessor
	 * @return		MenuItem label string
	 */
	public function getLabel()
	{
		return $this->label;
	}
	
	/**
	 * @brief		Parent menu item accessor
	 * @return		MenuItem parent object
	 */
	public function getParent()
	{
		return $this->parent_menu;
	}
	
	/**
	 * @brief		Childs accessor
	 * @return		array of MenuItem objects
	 */
	public function getChilds()
	{
		return $this->childs_menus;
	}
	
	/**
	 * @brief		Has some childs ?
	 * @return		boolean
	 */
	public function hasChilds()
	{
		return (! is_null($this->childs_menus) ) and (count($this->childs_menus) > 0);
	}
	
	/**
	 * @brief		Add a child to the array of childs objects
	 * @return		nothing
	 */
	public function addChild($arg_child_menu)
	{
		$this->childs_menus[] = $arg_child_menu;
	}
	
	/**
	 * @brief		Depth accessor
	 * @return		integer
	 */
	public function getDepth()
	{
		return $this->depth;
	}
	
	/**
	 * @brief		Type of the menu
	 * @return		string
	 */
	public function getType()
	{
		return $this->type;
	}
	
	
	/**
	 * @brief		Menu action : view name accessor
	 * @return		string
	 */
	public function getActionView()
	{
		return $this->action_view;
	}
	
	/**
	 * @brief		Menu action : model name accessor
	 * @return		string
	 */
	public function getActionModel()
	{
		return $this->action_model;
	}
	
	/**
	 * @brief		Menu action : json model name accessor
	 * @return		string
	 */
	public function getActionJson()
	{
		return $this->action_json;
	}
	
	/**
	 * @brief		Menu action : view operands accessor
	 * @return		string
	 */
	public function getActionViewOperands()
	{
		return $this->action_view_operands;
	}
	
	/**
	 * @brief		Menu action : model operands accessor
	 * @return		string
	 */
	public function getActionModelOperands()
	{
		return $this->action_model_operands;
	}
	
	
	/**
	 * @brief		Display role accessor
	 * @return		string
	 */
	public function getAccessRole()
	{
		return $this->access_role;
	}
	
	/**
	 * @brief		Position accessor
	 * @return		string : MenuItem::$MENU_POS_LEFT or MenuItem::$MENU_POS_RIGHT
	 */
	public function getPosition()
	{
		return $this->position;
	}
	
	/**
	 * @brief		Icon url
	 * @return		string : menu icon url
	 */
	public function getIconUrl()
	{
		return $this->icon_url;
	}
	
	/**
	 * @brief		Test if the link url is valid
	 * @return		boolean
	 */
	public function hasLinkUrl()
	{
		return ! is_null($this->link_url) && $this->link_url != "";
	}
	
	/**
	 * @brief		Get the link url
	 * @return		string : menu link url
	 */
	public function getLinkUrl()
	{
		return $this->link_url;
	}
	
	/**
	 * @brief		Set the link url
	 * @param[in]	menu link url
	 * @return		nothing
	 */
	public function setLinkUrl($arg_url)
	{
		if ( ! is_null($arg_url) )
		{
			$this->link_url = $arg_url;
		}
	}
	
	
	/**
	 * @brief		Test if the js action is valid
	 * @return		boolean
	 */
	public function hasActionJS()
	{
		return ! is_null($this->action_js) && $this->action_js != "";
	}
	
	/**
	 * @brief		Get the js action
	 * @return		string : menu js action
	 */
	public function getActionJS()
	{
		return $this->action_js;
	}
	
	/**
	 * @brief		Set the js action
	 * @param[in]	menu js action
	 * @return		nothing
	 */
	public function setActionJS($arg_js)
	{
		if ( ! is_null($arg_js) )
		{
			$this->action_js = $arg_js;
		}
	}
	
	
	/**
	 * @brief		Test if the menu item position is LEFT
	 * @return		boolean		true if position is MenuItem::$MENU_POS_LEFT
	 */
	public function isLeft()
	{
		return $this->position == MenuItem::$MENU_POS_LEFT;
	}
	
	/**
	 * @brief		Test if the menu item position is RIGHT
	 * @return		boolean		true if position is MenuItem::$MENU_POS_RIGHT
	 */
	public function isRight()
	{
		return $this->position == MenuItem::$MENU_POS_RIGHT;
	}
	
	
	/**
	 * @brief		Get the tooltip
	 * @return		string
	 */
	public function getTooltip()
	{
		return $this->tooltip;
	}
	
	/**
	 * @brief		Set the tooltip
	 * @param[in]	menu tooltip
	 * @return		nothing
	 */
	public function setTooltip($arg_tooltip)
	{
		if ( ! is_null($arg_tooltip) )
		{
			$this->tooltip = $arg_tooltip;
		}
	}
}
?>