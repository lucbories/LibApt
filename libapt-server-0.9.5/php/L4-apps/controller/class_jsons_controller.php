<?php
/**
 * @file        class_application.php
 * @brief       JSON request controller class
 * @details     CRUD controller
 * @see			AbstractCrudController Controllers Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		Write api documentation
 * 
 */
class JsonsController extends AbstractCrudController
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not all except 'step' and 'leaveok' (boolean)
	static public $TRACE_JSON_CONTROLLER		= false;
	
	/// @brief		Trace or not 'step' (boolean)
	static public $TRACE_JSON_CONTROLLER_STEP	= false;
	
	/// @brief		Trace or not 'leaveok' (boolean)
	static public $TRACE_JSON_CONTROLLER_OK		= false;
	
	
	/// @brief		Json datas name
	static public $ACTION_JSON_ARG = "jsonData";
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	public function __construct()
	{
		// PARENT CONTRUCTOR
		parent::__construct();
	}
	
	
	
	// ----------------- CHECKS -----------------
	
	/**
	 * @brief		Check model object class
	 * @param[in]	arg_named_object	object to check again the contraoller
	 * @return		boolean		true:success, false:failure
	 */
	public function checkObject($arg_named_object)
	{
		$context = "JsonsController.checkObject";
		TRACE::enter($context, "", self::$TRACE_JSON_CONTROLLER);
		
		CONTRACT::assertNotNull($context.".arg_named_object", $arg_named_object);
		CONTRACT::assertInherit($context.".arg_named_object", $arg_named_object, "AbstractModel");
		
		return TRACE::leaveok($context, "good named object", true, self::$TRACE_JSON_CONTROLLER_OK);
	}
	
	
	
	// ----------------- OPERATIONS EXECUTION -----------------
	
	/**
	 * @brief		Execute create operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	protected function doModelCreate($arg_model, $arg_url_parameters, $arg_action_name = null)
	{
		$context = "JsonsController.doModelCreate";
		TRACE::enter($context, "", self::$TRACE_JSON_CONTROLLER);
		
		// GET MODEL
		CONTRACT::assertNotNull($context.".arg_model", $arg_model);
		
		// GET URL PARAMETERS
		$url_parameters = $this->getUrlParameter($arg_model->getName(), $arg_url_parameters);
		CONTRACT::assertArray($context.".url_parameters", $url_parameters);
		TRACE::trace_var($context, "url_parameters", $url_parameters, self::$TRACE_JSON_CONTROLLER);
		
		// UNLOCK USER SESSION
		Application::getInstance()->unlockSession();
		
		// GET JSON DATAS
		CONTRACT::assertArrayHasKey($context.".url_parameters", $url_parameters, self::$ACTION_JSON_ARG);
		$jsonData = $url_parameters[self::$ACTION_JSON_ARG];
		CONTRACT::assertNotEmptyString($context.".jsonData", $jsonData);
		$jsonData = html_entity_decode($jsonData);
		TRACE::trace_var($context, "jsonData", $jsonData, self::$TRACE_JSON_CONTROLLER);
		
		// GET RECORDS TO CREATE
		$records = json_decode($jsonData, true);
		CONTRACT::assertNotEmptyArray($context.".records", $records);
		TRACE::trace_var($context, "records", $records, self::$TRACE_JSON_CONTROLLER);
		
			TRACE::trace_var($context, "records", $records, true);
		// LOOP ON RECORDS
		$record_index = 0;
		foreach($records as $record)
		{
			// GET THE FIELDS LIST
			$fields_list = $arg_model->getFieldsSet()->getFields( array_keys($record) );
			CONTRACT::assertNotEmptyArray($context.".fields_list", $fields_list);
			
			TRACE::trace_var($context, "fields_list", $fields_list, self::$TRACE_JSON_CONTROLLER);
			TRACE::trace_var($context, "record", $record, self::$TRACE_JSON_CONTROLLER);
			TRACE::trace_var($context, "record", $record, true);
			
			// RUN QUERY
			$result = $arg_model->create($fields_list, $record, null);
			if (!$result)
			{
				return TRACE::leaveko($context, "Execution of CREATE query failed for record at [$record_index]", false, self::$TRACE_JSON_CONTROLLER);
			}
			
			++$record_index;
		}
		
		return TRACE::leaveok($context,"success", true, self::$TRACE_JSON_CONTROLLER);
	}
	
	
	/**
	 * @brief		Execute create operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	protected function doModelRead($arg_model, $arg_url_parameters, $arg_action_name = null)
	{
		$context = "JsonsController.doModelRead";
		TRACE::enter($context, "", self::$TRACE_JSON_CONTROLLER);
		
		// GET MODEL
		CONTRACT::assertNotNull($context.".arg_model", $arg_model);
		
		// PREPARE RESPONSE
		$response = Application::getInstance()->getResponse();
		// $response->setPredefinedContentType("json");
		// $response->useHeader("Content-Type");
		
		header('Content-type: text/json');
		// header('Content-Type: application/javascript');
		// header('Content-Type: application/jsonp');
		
		// GET URL PARAMETERS
		$url_parameters = $this->getUrlParameter("", $arg_url_parameters);
		CONTRACT::assertArray($context.".url_parameters", $url_parameters);
		TRACE::trace_var($context, "url_parameters", $url_parameters, self::$TRACE_JSON_CONTROLLER);
		
		// UNLOCK USER SESSION
		Application::getInstance()->unlockSession();
		
		// GET QUERY OPTIONS
		$action_str       = array_key_exists(AbstractModelViewImpl::$OPTION_ACTION,			$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_ACTION])		: "select";
		$fields_str       = array_key_exists(AbstractModelViewImpl::$OPTION_FIELDS,			$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_FIELDS])		: null;
		$one_field_str    = array_key_exists(AbstractModelViewImpl::$OPTION_ONE_FIELD,		$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_ONE_FIELD])	: null;
		$filters_str      = array_key_exists(AbstractModelViewImpl::$OPTION_FILTERS,		$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_FILTERS])		: null;
		$orders_str       = array_key_exists(AbstractModelViewImpl::$OPTION_ORDERS,			$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_ORDERS])		: null;
		$groups_str       = array_key_exists(AbstractModelViewImpl::$OPTION_GROUPS,			$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_GROUPS])		: null;
		$slice_offset_str = array_key_exists(AbstractModelViewImpl::$OPTION_SLICE_OFFSET,	$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_SLICE_OFFSET])	: null;
		$slice_length_str = array_key_exists(AbstractModelViewImpl::$OPTION_SLICE_LENGTH,	$url_parameters) ? html_entity_decode($url_parameters[AbstractModelViewImpl::$OPTION_SLICE_LENGTH])	: null;
		$options_str      = array_key_exists("options",										$url_parameters) ? html_entity_decode($url_parameters["options"])									: null;
		
		$action_str       = trim($action_str, "\"'");
		$fields_str       = trim($fields_str, "\"'");
		$one_field_str    = trim($one_field_str, "\"'");
		$filters_str      = trim($filters_str, "\"'");
		$orders_str       = trim($orders_str, "\"'");
		$groups_str       = trim($groups_str, "\"'");
		$slice_offset_str = trim($slice_offset_str, "\"'");
		$slice_length_str = trim($slice_length_str, "\"'");
		$options_str      = trim($options_str, "\"'");
		
		$fields_names	= (is_null($fields_str)  || $fields_str == "") ? null : explode(",", $fields_str);
		$filters		= (is_null($filters_str) || $filters_str == "") ? null : Filter::buildFiltersFromString($filters_str);
		$orders			= (is_null($orders_str)  || $orders_str == "")  ? null : Order::buildOrdersFromString($orders_str);
		$groups			= (is_null($groups_str)  || $groups_str == "")  ? null : Group::buildGroupsFromString($groups_str);
		$slice_offset	= (is_null($slice_offset_str) || $slice_offset_str == "") ? null : $slice_offset_str;
		$slice_length	= (is_null($slice_length_str) || $slice_length_str == "") ? null : $slice_length_str;
		$options		= null;
		
		if (! is_null($groups) )
		{
			$options = Array();
			$options["groups"] = $groups;
		}
		
		// GET FIELDS LIST
		$fields_list	= $arg_model->getFieldsSet()->getFields($fields_names);
		CONTRACT::assertNotEmptyArray($context.".fields_list", $fields_list);
		TRACE::trace_var($context, "fields_values", $fields_list, self::$TRACE_JSON_CONTROLLER);
		
		// READ DATAS
		if ($action_str == "select_distinct")
		{
			$datas_records = $arg_model->readDistinctWithSlice($fields_list, $filters, $orders, $slice_offset, $slice_length, $options);
		}
		else if ($action_str == "select_distinct_one")
		{
			CONTRACT::assertNotNull($context.".select_distinct_one.field_name", $one_field_str);
			$one_field		= $arg_model->getFieldsSet()->getField($one_field_str);
			CONTRACT::assertNotNull($context.".select_distinct_one.field", $one_field);
			$datas_records = $arg_model->readDistinctOneWithSlice($one_field, $fields_list, $filters, $orders, $slice_offset, $slice_length, $options);
		}
		else if ($action_str == "select_count")
		{
			CONTRACT::assertNotNull($context.".select_count.field_name", $one_field_str);
			$datas_records = $arg_model->readCountWithSlice($fields_list, $filters, $orders, $slice_offset, $slice_length, $options);
		}
		else
		{
			$datas_records = $arg_model->readWithSlice($fields_list, $filters, $orders, $slice_offset, $slice_length, $options);
		}
		
		// CHECK DATAS
		TRACE::trace_var($context, "datas_records", $datas_records, self::$TRACE_JSON_CONTROLLER);
		CONTRACT::assertArray($context.".datas_records", $datas_records);
		
		// COUNT DATAS
		$records_count = count($datas_records);
		TRACE::trace_var($context, "records_count", $records_count, self::$TRACE_JSON_CONTROLLER);
		
		// GET JSON DATAS
		$buffer = json_encode($datas_records);
		
		// TODO CHECK JSON ENCODE ERROR
		
		TRACE::trace_var($context, "json buffer", $buffer, self::$TRACE_JSON_CONTROLLER);
		echo $buffer;
		
		return TRACE::leaveok($context, "read success", true, self::$TRACE_JSON_CONTROLLER_OK);
	}
	
	
	/**
	 * @brief		Execute update operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	protected function doModelUpdate($arg_model, $arg_url_parameters, $arg_action_name = null)
	{
		$context = "JsonsController.doModelUpdate";
		TRACE::enter($context, "", self::$TRACE_JSON_CONTROLLER);
		
		// GET MODEL
		CONTRACT::assertNotNull($context.".arg_model", $arg_model);
		
		// INIT RESPONSE
		$response = Application::getInstance()->getResponse();
		$response->setPredefinedContentType("html");
		$response->useHeader("Content-Type");
		
		// GET URL PARAMETERS
		$url_parameters = $this->getUrlParameter($arg_model->getName(), $arg_url_parameters);
		CONTRACT::assertArray($context.".url_parameters", $url_parameters);
		TRACE::trace_var($context, "url_parameters", $url_parameters, self::$TRACE_JSON_CONTROLLER);
		
		// UNLOCK USER SESSION
		Application::getInstance()->unlockSession();
		
		// GET JSON DATAS
		CONTRACT::assertArrayHasKey($context.".url_parameters", $url_parameters, self::$ACTION_JSON_ARG);
		$jsonData = $url_parameters[self::$ACTION_JSON_ARG];
		TRACE::trace_var($context, "jsonData", $jsonData, self::$TRACE_JSON_CONTROLLER);
		$jsonData = html_entity_decode($jsonData);
		// TRACE::debug_var("jsondatas2", $jsonData);
		
		// GET FIELDS VALUES
		$fields_values = json_decode($jsonData, true);
		TRACE::trace_var($context, "fields_values", $fields_values, self::$TRACE_JSON_CONTROLLER);
		CONTRACT::assertNotEmptyArray($context.".fields_values", $fields_values);
		
		// CHECK PRIMARY KEY VALUE
		$pk_field = $arg_model->getFieldsSet()->getPrimaryKeyField();
		CONTRACT::assertNotNull($context.".pk_field", $pk_field);
		
		// CHECK PRIMARY KEY FIELD VALUE
		$pk_field_name = $pk_field->getName();
		CONTRACT::assertArrayHasKey($context.".pk_field_name", $fields_values, $pk_field_name);
		
		// GET THE FIELDS LIST
		$fields_list = $arg_model->getFieldsSet()->getFields( array_keys($fields_values) );
		CONTRACT::assertNotEmptyArray($context.".fields_list", $fields_list);
		TRACE::trace_var($context, "fields_list", $fields_list, self::$TRACE_JSON_CONTROLLER);
		
		// RUN QUERY
		$result = $arg_model->update($fields_list, $fields_values, null, null);
		
		return TRACE::leave($context, $result, "Execution of UPDATE query failed", false, self::$TRACE_JSON_CONTROLLER);
	}
	
	
	/**
	 * @brief		Execute delete operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	protected function doModelDelete($arg_model, $arg_url_parameters, $arg_action_name = null)
	{
		$context = "JsonsController.doModelDelete";
		TRACE::enter($context, "", self::$TRACE_JSON_CONTROLLER);
		
		// GET MODEL
		CONTRACT::assertNotNull($context.".arg_model", $arg_model);
		
		// INIT RESPONSE
		$response = Application::getInstance()->getResponse();
		$response->setPredefinedContentType("html");
		$response->useHeader("Content-Type");
		
		// GET URL PARAMETERS
		$url_parameters = $this->getUrlParameter($arg_model->getName(), $arg_url_parameters);
		CONTRACT::assertArray($context.".url_parameters", $url_parameters);
		TRACE::trace_var($context, "url_parameters", $url_parameters, self::$TRACE_JSON_CONTROLLER);
		
		// UNLOCK USER SESSION
		Application::getInstance()->unlockSession();
		
		// GET JSON DATAS
		CONTRACT::assertArrayHasKey($context.".url_parameters", $url_parameters, self::$ACTION_JSON_ARG);
		$jsonData = $url_parameters[self::$ACTION_JSON_ARG];
		TRACE::trace_var($context, "jsonData", $jsonData, self::$TRACE_JSON_CONTROLLER);
		$jsonData = html_entity_decode($jsonData);
		// TRACE::debug_var("jsondatas2", $jsonData);
		
		// GET FIELDS VALUES
		$fields_values = json_decode($jsonData, true);
		TRACE::trace_var($context, "fields_values", $fields_values, self::$TRACE_JSON_CONTROLLER);
		CONTRACT::assertNotEmptyArray($context.".fields_values", $fields_values);
		
		// CHECK PRIMARY KEY VALUE
		$pk_field = $arg_model->getFieldsSet()->getPrimaryKeyField();
		CONTRACT::assertNotNull($context.".pk_field", $pk_field);
		
		// CHECK PRIMARY KEY FIELD VALUE
		$pk_field_name = $pk_field->getName();
		CONTRACT::assertArrayHasKey($context.".pk_field_name", $fields_values, $pk_field_name);
		
		// GET PRIMARY KEY FIELD VALUE
		$pk_value = $fields_values[$pk_field_name];
		CONTRACT::assertNotNull($context.".pk_value", $pk_value);
		TRACE::trace_var($context, "pk_value", $pk_value, self::$TRACE_JSON_CONTROLLER);
		
		// RUN QUERY
		$result = $arg_model->deleteItemById($pk_value);
		
		return TRACE::leave($context, $result, "Execution of DELETE query failed", false, self::$TRACE_JSON_CONTROLLER);
	}
}
?>