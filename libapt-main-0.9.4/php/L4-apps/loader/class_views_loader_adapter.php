<?php
/**
 * @version		$Id: class_views_loader_adapter.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/loaders
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 */
final class ViewsLoaderAdapter extends AbstractLoaderAdapter
{
	// STATIC ATTRIBUTES
	static public $TRACE_VIEWS_LOADER		= false;
	static public $TRACE_VIEWS_LOADER_OK	= false;
	
	
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	// BUILD A MENU FROM AN OBJECT DEFINITION
	public function buildObjectFromRecord($arg_definition_record, $arg_resource_to_clone = null)
	{
		$context = "ViewsLoaderAdapter.buildObjectFromRecord";
		TRACE::enter($context, "", self::$TRACE_VIEWS_LOADER);
		
		// GET VIEW NAME
		$view_name = $arg_definition_record["view_name"];
		TRACE::trace_var($context, "view_name",  $view_name, self::$TRACE_VIEWS_LOADER);
		CONTRACT::assertNotEmptyString($context.".view_name", $view_name);
		
		
		// CLONE AN EXISTING RESOURCE
		if ( ! is_null($arg_resource_to_clone) )
		{
			$result = $this->cloneResource("viewAction", $arg_resource_to_clone, $arg_definition_record);
			CONTRACT::assertNotNull($context.".clone resource", $result);
			$arg_definition_record = $result;
		}
		
		
		// GET CLASS NAME
		$view_class = array_key_exists("class_name", $arg_definition_record) ? $arg_definition_record["class_name"] : null;
		unset($arg_definition_record["class_name"]);
		TRACE::trace_var($context, "view_class", $view_class, self::$TRACE_VIEWS_LOADER);
		CONTRACT::assertNotEmptyString($context.".view_class", $view_class);
		
		// GET DISPLAY ROLE
		$view_role_display  = null;
		if ( array_key_exists("role_display", $arg_definition_record) )
		{
			$view_role_display  = $arg_definition_record["role_display"];
			$view_role_display  = $view_role_display == "" ? null : $view_role_display;
			unset($arg_definition_record["role_display"]);
		}
		TRACE::trace_var($context, "view_role_display",  $view_role_display, self::$TRACE_VIEWS_LOADER);
		if ( Application::getInstance()->hasAuthentication() )
		{
			CONTRACT::assertNotEmptyString($context.".view_role_display", $view_role_display);
		}
		
		// GET OPTIONS KEY/VALUE PAIRS
		unset($arg_definition_record["view_name"]);
		$options = array();
		if ( array_key_exists("options", $arg_definition_record) )
		{
			$options_parts = explode(",", $arg_definition_record["options"]);
			foreach($options_parts as $part_str)
			{
				$part_array = explode("=", $part_str);
				if ( count($part_array) == 2 )
				{
					$option_key = $part_array[0];
					$option_value = $part_array[1];
					$options[$option_key] = $option_value;
				}
			}
		}
		foreach($arg_definition_record as $key => $value)
		{
			$options[$key] = $value;
		}
		TRACE::trace_var($context, "options", $options, self::$TRACE_VIEWS_LOADER);
		
		
		// REGISTER VIEW AUTHORIZATION
		if ( Application::getInstance()->hasAuthentication() && Authorization::hasRoleAdapter() )
		{
			TRACE::step($context, "register role access [$view_role_display]", self::$TRACE_VIEWS_LOADER);
			Authorization::getRoleAdapter()->registerRoleAccess($view_name, ViewsController::$DISPLAY_ACCESS, $view_role_display);
		}
		
		
		// CREATE LAZY OBJECT
		TRACE::step($context, "create lazy object", self::$TRACE_VIEWS_LOADER);
		$lazy = new LazyObject($view_name, $view_class, $this, $options);
		if ( ! $lazy->isReady() )
		{
			$lazy->dump($context, self::$TRACE_VIEWS_LOADER);
			return TRACE::leaveko($context, "lazy object not ready", null, self::$TRACE_VIEWS_LOADER);
		}
		
		// GET VIEWS CONTROLLER
		$controller = Controllers::getController("viewAction");
		CONTRACT::assertNotNull($context.".controller", $controller);
		
		// REGISTER OBJECT
		TRACE::step($context, "register object and actions", self::$TRACE_VIEWS_LOADER);
		$controller->registerObject($lazy);
		$controller->registerAction(ViewsController::$ACTION_PREFIX_HTML_PAGE.$view_name, $lazy, ViewsController::$DISPLAY_ACCESS);
		$controller->registerAction(ViewsController::$ACTION_PREFIX_HTML_VIEW.$view_name, $lazy, ViewsController::$DISPLAY_ACCESS);
		
		return TRACE::leaveok($context, "lazy view created [$view_name] of class [$view_class]", true, self::$TRACE_VIEWS_LOADER_OK);
	}
	
	public function buildObjectFromLazy($arg_lazy_object)
	{
		$context = "ViewsLoaderAdapter.buildObjectFromLazy";
		
		// GET VIEWS CONTROLLER
		$controller = Controllers::getController("viewAction");
		CONTRACT::assertNotNull($context.".controller", $controller);
		
		// CHECK LAZY OBJECT
		if ( is_null($arg_lazy_object) || ! $arg_lazy_object instanceof LazyObject )
		{
			return TRACE::leaveko($context, "bad lazy object class [". get_class($arg_lazy_object) ."]", null, self::$TRACE_VIEWS_LOADER);
		}
		if ( ! $arg_lazy_object->isReady() )
		{
			$arg_lazy_object->dump($context, self::$TRACE_VIEWS_LOADER);
			return TRACE::leaveko($context, "lazy object not ready", null, self::$TRACE_VIEWS_LOADER);
		}
		TRACE::step($context, "lazy object is ready", self::$TRACE_VIEWS_LOADER);
		
		// GET LAZY DATAS
		$view_name	= $arg_lazy_object->getName();
		$view_class	= $arg_lazy_object->getClassName();
		$options	= $arg_lazy_object->getOptionsRecord();
		TRACE::trace_var($context, "view_name", $view_name, self::$TRACE_VIEWS_LOADER);
		TRACE::trace_var($context, "view_class", $view_class, self::$TRACE_VIEWS_LOADER);
		TRACE::trace_var($context, "options", $options, self::$TRACE_VIEWS_LOADER);
		
		// GET PARENT VIEW
		$view_parent_name = null;
		if ( array_key_exists("parent_view_name", $options) )
		{
			$view_parent_name = $options["parent_view_name"];
		}
		$parent_view = null;
		if ( ! is_null($view_parent_name) && $view_parent_name != "" )
		{
			TRACE::step($context, "parent view is ready", self::$TRACE_VIEWS_LOADER);
			$parent_view = $controller->getObject($view_parent_name);
			TRACE::trace_var($context, "parent_view", $parent_view->getName(), self::$TRACE_VIEWS_LOADER);
		}
		
		// INCLUDE VIEW
		if ($view_class == "IncludeView")
		{
			TRACE::step($context, "IncludeView", self::$TRACE_VIEWS_LOADER);
			
			$include_file_name = $options[IncludeView::$OPTION_FILE_NAME];
			$include_file_name = $include_file_name == "" ? null : $include_file_name;
			
			$options[IncludeView::$OPTION_FILE_NAME] = LIBAPT_APP_ROOT.$include_file_name;
			$view = new $view_class($view_name, $parent_view, $options);
			TRACE::trace_var($context, "Load view include", $view_name, self::$TRACE_VIEWS_LOADER);
			$controller->registerObject($view);
			$controller->registerAction(ViewsController::$ACTION_PREFIX_HTML_PAGE.$view_name, $view, ViewsController::$DISPLAY_ACCESS);
			$controller->registerAction(ViewsController::$ACTION_PREFIX_HTML_VIEW.$view_name, $view, ViewsController::$DISPLAY_ACCESS);
			return $view;
		}
		
		
		// CREATE THE VIEW OBJECT
		if ( class_exists($view_class) )
		{
			TRACE::step($context, "[$view_class] is a PHP class", self::$TRACE_VIEWS_LOADER);
			$view = new $view_class($view_name, $parent_view, $options);
		}
		else
		{
			TRACE::step($context, "[$view_class] is not a PHP class : create JSView", self::$TRACE_VIEWS_LOADER);
			if ( array_key_exists(AbstractModelViewImpl::$OPTION_MODEL_NAME, $options) )
			{
				$view = new JSModelView($view_name, $parent_view, $options, $view_class);
			}
			else
			{
				$view = new JSView($view_name, $parent_view, $options, $view_class);
			}
		}
		
		// JSON MODEL VIEW
		if ($view_class == "JsonModelView")
		{
			TRACE::step($context, "JsonModelView", self::$TRACE_VIEWS_LOADER);
			
			// REFERENCEMENT DE L ACTION JSON
			$jc = Controllers::getController("viewAction");
			$jc->registerObject($view);
			
			$jc->registerAction(ViewsController::$ACTION_PREFIX_HTML_VIEW.$view_name,   $view, ViewsController::$DISPLAY_ACCESS);
		}
		
		// OTHERS VIEWS
		else
		{
			TRACE::step($context, "other view", self::$TRACE_VIEWS_LOADER);
			
			$controller = Controllers::getController("viewAction");		
			$controller->registerObject($view);
			$controller->registerAction(ViewsController::$ACTION_PREFIX_HTML_PAGE.$view_name, $view, ViewsController::$DISPLAY_ACCESS);
			$controller->registerAction(ViewsController::$ACTION_PREFIX_HTML_VIEW.$view_name, $view, ViewsController::$DISPLAY_ACCESS);
		}
		
		return TRACE::leaveok($context, "object view created [$view_name] of class [$view_class]", $view, self::$TRACE_VIEWS_LOADER_OK);
	}
}
?>