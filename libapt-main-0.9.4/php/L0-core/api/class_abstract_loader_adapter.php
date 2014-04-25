<?php
/**
 * @file        class_abstract_loader_adapter.php
 * @brief       Abstract class for all resources loader
 * @details     Load module resouces
 * @ingroup		L0_CORE
 * @date        2013-01-04
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
abstract class AbstractLoaderAdapter
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_ABSTRACT_LOADER = false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	protected function __construct()
	{
	}
	
	
	
	// ----------------- REGISTERED OPTIONS -----------------
	/**
	 * @brief		Build an object from an object definition
	 * @param[in]	arg_definition_record		options records (string keys array of string values)
	 * @param[in]	arg_resource_to_clone		name of an already loaded resource to clone as starting point for definition (string)
	 * @return		boolean						true: success, false: failure
	 */
	abstract public function buildObjectFromRecord($arg_definition_record, $arg_resource_to_clone = null);
	
	
	/**
	 * @brief		Build an object from an object definition
	 * @param[in]	arg_lazy_object		lazy object that contains target object definition (object of LazyObject class)
	 * @return		object				created target object
	 */
	abstract public function buildObjectFromLazy($arg_lazy_object);
	
	
	// CLONE RESOURCE
	protected function cloneResource($arg_controller_action, $arg_resource_to_clone, $arg_record)
	{
		$context = "AbstractLoaderAdapter.cloneResource";
		TRACE::enter($context, "", self::$TRACE_ABSTRACT_LOADER);
		
		unset($arg_record["resource_to_clone"]);
		
		// CHECK ARGS
		CONTRACT::assertNotNull($context.".arg_controller_action", $arg_controller_action);
		CONTRACT::assertNotNull($context.".arg_resource_to_clone", $arg_resource_to_clone);
		CONTRACT::assertNotNull($context.".arg_record", $arg_record);
		
		// GET THE MENU CONTROLLER
		$controller = Controllers::getController($arg_controller_action);
		CONTRACT::assertNotNull($context.".controller[$$arg_controller_action]", $controller);
		
		// GET OBJECT TO CLONE
		$resource_to_clone_object = $controller->getLazyOrNotObject($arg_resource_to_clone);
		CONTRACT::assertNotNull($context.".resource_to_clone_object", $resource_to_clone_object);
		
		// SET OPTIONS TO CLONE
		$options_to_clone = array();
		if ($resource_to_clone_object instanceof LazyObject)
		{
			TRACE::step($context, "resource to clone is an instance of LazyObject", self::$TRACE_ABSTRACT_LOADER);
			$options_to_clone = $resource_to_clone_object->getOptionsRecord();
		}
		elseif ($resource_to_clone_object instanceof AbstractControlled)
		{
			TRACE::step($context, "resource to clone is an instance of AbstractControlled", self::$TRACE_ABSTRACT_LOADER);
			$options_to_clone = $resource_to_clone_object->getRuntimeOptions();
		}
		elseif ($resource_to_clone_object instanceof MenuItem)
		{
			TRACE::step($context, "resource to clone is an instance of MenuItem", self::$TRACE_ABSTRACT_LOADER);
			$options_to_clone["menu_label"]				= $resource_to_clone_object->getLabel();
			
			$parent = $resource_to_clone_object->getParent();
			$options_to_clone["parent_name"]			= is_null($parent) ? "" : $parent->getName();
			
			$options_to_clone["action_view"]			= $resource_to_clone_object->getActionView();
			$options_to_clone["action_view_operands"]	= $resource_to_clone_object->getActionViewOperands();
			$options_to_clone["action_model"]			= $resource_to_clone_object->getActionModel();
			$options_to_clone["action_model_operands"]	= $resource_to_clone_object->getActionModelOperands();
			$options_to_clone["action_json"]			= $resource_to_clone_object->getActionJson();
		}
		else
		{
			return TRACE::leaveko($context, "bad resource to clone class", null, self::$TRACE_ABSTRACT_LOADER);
		}
		
		// SET CLASS NAME IF NEEDED
		if ( ! array_key_exists("class_name", $options_to_clone) )
		{
			if ($resource_to_clone_object instanceof LazyObject)
			{
				$options_to_clone["class_name"] = $resource_to_clone_object->getClassName();
			}
			else
			{
				$options_to_clone["class_name"] = get_class($resource_to_clone_object);
			}
			TRACE::trace_var($context, "class_name", $options_to_clone["class_name"], self::$TRACE_ABSTRACT_LOADER);
		}
		TRACE::trace_var($context, "options_to_clone", $options_to_clone, self::$TRACE_ABSTRACT_LOADER);
		
		// CLONE OPTIONS
		foreach($options_to_clone as $key=>$value)
		{
			if ( ! array_key_exists($key, $arg_record) )
			{
				$arg_record[$key] = $value;
			}
		}
		TRACE::trace_var($context, "arg_record cloned", $arg_record, self::$TRACE_ABSTRACT_LOADER);
		
		return TRACE::leaveok($context, "success", $arg_record, self::$TRACE_ABSTRACT_LOADER);
	}
}
?>