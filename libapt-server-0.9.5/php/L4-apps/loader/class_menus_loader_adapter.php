<?php
/**
 * @version		$Id: class_menus_loader_adapter.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/loaders
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class MenusLoaderAdapter extends AbstractLoaderAdapter
{
	// STATIC ATTRIBUTES
	static public $TRACE_MENUS_LOADER = false;
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	// BUILD A MENU FROM AN OBJECT DEFINITION
	public function buildObjectFromRecord($arg_definition_record, $arg_resource_to_clone = null)
	{
		$context = "MenusLoaderAdapter.buildObjectFromRecord";
		TRACE::enter($context, "", self::$TRACE_MENUS_LOADER);
		TRACE::trace_var($context, "arg_definition_record", $arg_definition_record, self::$TRACE_MENUS_LOADER);
		TRACE::trace_var($context, "arg_resource_to_clone", $arg_resource_to_clone, self::$TRACE_MENUS_LOADER);
		
		// CLONE AN EXISTING RESOURCE
		if ( ! is_null($arg_resource_to_clone) )
		{
			$result = $this->cloneResource("menuAction", $arg_resource_to_clone, $arg_definition_record);
			CONTRACT::assertNotNull($context.".clone resource", $result);
			$arg_definition_record = $result;
		}
		
		// GET TYPE
		$default_menu_type	= MenuItem::$MENU_TYPE_ITEM;
		$menu_type			= array_key_exists("menu_type", $arg_definition_record) ? $arg_definition_record["menu_type"] : $default_menu_type;
		
		// LOAD RECORD
		$result = false;
		switch($menu_type)
		{
			case MenuItem::$MENU_TYPE_MENU :		$result = self::buildMenuItemFromRecord($arg_definition_record); break;
			case MenuItem::$MENU_TYPE_ITEM :		$result = self::buildMenuItemFromRecord($arg_definition_record); break;
			case MenuItem::$MENU_TYPE_SEPARATOR :	$result = self::buildMenuItemFromRecord($arg_definition_record); break;
			case MenuItem::$MENU_TYPE_LABEL :		$result = self::buildMenuItemFromRecord($arg_definition_record); break;
			case MenuItem::$MENU_TYPE_TOPMENUBAR :	$result = self::buildMenusBarFromRecord($arg_definition_record); break;
			case MenuItem::$MENU_TYPE_NAVMENUBAR :	$result = self::buildMenusBarFromRecord($arg_definition_record); break;
		}
		
		if ( $result )
		{
			return TRACE::leaveok($context, "load menu record succeed", $result, self::$TRACE_MENUS_LOADER);
		}
		
		return TRACE::leaveko($context, "load menu record failed", $result, self::$TRACE_MENUS_LOADER);
	}
	
	public function buildMenusBarFromRecord($arg_definition_record)
	{
		$context = "MenusLoaderAdapter.buildMenusBarFromRecord";
		TRACE::enter($context, "", self::$TRACE_MENUS_LOADER);
		
		// GET MENUS BAR ATTRIBUTES
		$menu_name			= $arg_definition_record["menu_name"];
		$menu_label			= array_key_exists("menu_label",			$arg_definition_record) ? $arg_definition_record["menu_label"] : null;
		$access_role		= array_key_exists("access_role",			$arg_definition_record) ? $arg_definition_record["access_role"] : null;
		$orientation		= array_key_exists("menus_bar_orientation",	$arg_definition_record) ? $arg_definition_record["menus_bar_orientation"] : null;
		$format				= array_key_exists("menus_bar_format",		$arg_definition_record) ? $arg_definition_record["menus_bar_format"] : null;
		$template			= array_key_exists("menus_bar_template",	$arg_definition_record) ? $arg_definition_record["menus_bar_template"] : null;
		
		// GET THE MENU CONTROLLER
		$menus_controller= Controllers::getController("menuAction");
		CONTRACT::assertNotNull($context.".menus_controller", $menus_controller);
		
		// CONSTRUCT A MENU OBJECT
		$menus_bar = new MenuBar($menu_name, $menu_label, $access_role, $orientation, $format, $template);
		CONTRACT::assertNotNull($context.".menus_bar", $menus_bar);
		
		// REGISTER THE MENU OBJECT
		$menus_controller->registerObject($menus_bar);
		
		// REGISTER AUTHORIZATION
		if ( Application::getInstance()->hasAuthentication() && Authorization::hasRoleAdapter() )
		{
			Authorization::getRoleAdapter()->registerRoleAccess($menu_name, "MENU_DISPLAY", $access_role);
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_MENUS_LOADER);
	}
	
	public function buildMenuItemFromRecord($arg_definition_record)
	{
		$context = "MenusLoaderAdapter.buildMenuItemFromRecord";
		TRACE::enter($context, "", self::$TRACE_MENUS_LOADER);
		
		// GET MENU ATTRIBUTES
		$menu_name			= $arg_definition_record["menu_name"];
		$menu_label			= array_key_exists("menu_label",	$arg_definition_record) ? $arg_definition_record["menu_label"] : null;
		$menu_type			= array_key_exists("menu_type",		$arg_definition_record) ? $arg_definition_record["menu_type"] : null;
		$parent_name		= array_key_exists("parent_name",	$arg_definition_record) ? $arg_definition_record["parent_name"] : null;
		$access_role		= array_key_exists("access_role",	$arg_definition_record) ? $arg_definition_record["access_role"] : null;
		$position			= array_key_exists("position",		$arg_definition_record) ? $arg_definition_record["position"] : null;
		$menu_tooltip		= array_key_exists("menu_tooltip",	$arg_definition_record) ? $arg_definition_record["menu_tooltip"] : null;
		CONTRACT::assertNotEmptyString($context.".menu_name", $menu_name);
		
		$icon_url			= array_key_exists("icon_url", $arg_definition_record) ? $arg_definition_record["icon_url"] : null;
		if ( is_null($icon_url) && array_key_exists("icon_file_name", $arg_definition_record) )
		{
			$icon_file_name	= $arg_definition_record["icon_file_name"];
			if ( ! is_null($icon_file_name) && $icon_file_name != "" )
			{
				$icon_url	= THEMES::getIconsUrl()."/".$icon_file_name;
			}
		}
		if ( is_null($icon_url) && array_key_exists("icon_name", $arg_definition_record) )
		{
			$icon_name		= $arg_definition_record["icon_name"];
			if ( ! is_null($icon_name) && $icon_name != "" )
			{
				$icon_url	= THEMES::getIconUrl($icon_name);
			}
		}
		if ( is_null($icon_url) && array_key_exists("icon_app_url", $arg_definition_record) )
		{
			$icon_app_url		= $arg_definition_record["icon_app_url"];
			if ( ! is_null($icon_app_url) && $icon_app_url != "" )
			{
				$icon_url	= Application::getInstance()->getBaseUrl().$icon_app_url;
			}
		}
		
		$display_page		= array_key_exists("display_page", $arg_definition_record)			?  $arg_definition_record["display_page"]			: null;
		$display_view		= array_key_exists("display_view", $arg_definition_record)			?  $arg_definition_record["display_view"]			: null;
		$display_url		= array_key_exists("display_url", $arg_definition_record)			?  $arg_definition_record["display_url"]			: null;
		
		$action_view       = array_key_exists("action_view", $arg_definition_record)			?  $arg_definition_record["action_view"]			: null;
		$action_view_opds  = array_key_exists("action_view_operands", $arg_definition_record)	?  $arg_definition_record["action_view_operands"]	: null;
		
		$action_model      = array_key_exists("action_model", $arg_definition_record)			?  $arg_definition_record["action_model"]			: null;
		$action_model_opds = array_key_exists("action_model_operands", $arg_definition_record)	?  $arg_definition_record["action_model_operands"]	: null;
		
		$action_json		= array_key_exists("action_json", $arg_definition_record)			?  $arg_definition_record["action_json"]			: null;
		
		$action_js			= array_key_exists("action_js", $arg_definition_record)				?  $arg_definition_record["action_js"]				: null;
		
		if ( is_null($action_view) && ! is_null($display_page) )
		{
			$action_view = ViewsController::$ACTION_PREFIX_HTML_PAGE . $display_page;
		}
		if ( is_null($action_view) && ! is_null($display_view) )
		{
			$action_view = ViewsController::$ACTION_PREFIX_HTML_VIEW . $display_view;
		}
		
		
		// GET THE MENU CONTROLLER
		$menus_controller= Controllers::getController("menuAction");
		CONTRACT::assertNotNull($context.".menus_controller[menuAction]", $menus_controller);
		
		
		// SEARCH THE PARENT MENU OBJECT
		$parent_menu = null;
		if ( ! is_null($parent_name) && $parent_name != "" )
		{
			$parent_menu = $menus_controller->getObject($parent_name);
			CONTRACT::assertNotNull($context.".parent_menu[$parent_name]", $parent_menu);
			
			// INHERIT ACCESS ROLE IF NEEDED
			if ( is_null($access_role) )
			{
				$access_role = $parent_menu->getAccessRole();
			}
		}
		
		// CONSTRUCT A MENU OBJECT
		$menu = new MenuItem($menu_name, $menu_label, $parent_menu,
							$action_view, $action_view_opds, $action_model, $action_model_opds, $action_json,
							$access_role, $position, $icon_url, $menu_type);
		CONTRACT::assertNotNull($context.".menu", $menu);
		
		// UPDATE URL
		if ( ! is_null($display_url) )
		{
			$menu->setLinkUrl($display_url);
		}
		
		// UPDATE ACTION JS
		if ( ! is_null($action_js) )
		{
			$menu->setActionJS($action_js);
		}
		
		// UPDATE TOOLTIP
		if ( ! is_null($menu_tooltip) )
		{
			$menu->setTooltip($menu_tooltip);
		}
		
		
		// REGISTER THE MENU OBJECT
		$menus_controller->registerObject($menu);
		
		
		// REGISTER AUTHORIZATION
		if ( Application::getInstance()->hasAuthentication() && Authorization::hasRoleAdapter() )
		{
			Authorization::getRoleAdapter()->registerRoleAccess($menu_name, "MENU_DISPLAY", $access_role);
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_MENUS_LOADER);
	}
	
	public function buildObjectFromLazy($arg_lazy_object)
	{
		$context = "MenusLoaderAdapter.buildObjectFromLazy";
		
		return null;
	}
}
?>