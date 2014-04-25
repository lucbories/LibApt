<?php
/**
 * @file        class_models_controller.php
 * @brief       Controller class for models operations
 * @details     
 * @see			AbstractCrudController Trace
 * @ingroup     L0_CORE
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ModelsController extends AbstractCrudController
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief	Trace or not (boolean)
	static public $TRACE_MODELS_CONTROLLER	= false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
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
		$context = "ModelsController.checkObject";
		
		CONTRACT::assertNotNull($context.".arg_named_object", $arg_named_object);
		if ($arg_named_object instanceof AbstractModel or $arg_named_object instanceof LazyObject)
		{
			return true;
		}
		
		$name = "no named object";
		if ($arg_named_object instanceof Named)
		{
			$name = $arg_named_object->getName();
		}
		
		return TRACE::leaveko("ModelsController.checkObject", "bad class for [$name]", false, self::$TRACE_MODELS_CONTROLLER);
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
		$context = "ModelsController.doModelCreate";
		
		// GET DATAS
		$url_parameters = $this->getUrlParameter($arg_model->getName(), $arg_url_parameters);
		TRACE::trace_var($context, "url_parameters", $url_parameters, self::$TRACE_MODELS_CONTROLLER);
		
		$fields_values = $arg_model->getFieldsSet()->getEditableFieldsValues($url_parameters);
		TRACE::trace_var($context, "fields_values", $fields_values, self::$TRACE_MODELS_CONTROLLER);
		
		// CREATE ITEM
		$result = $arg_model->createItem($fields_values);
		
		// GET RESPONSE
		$response = Application::getInstance()->getResponse();
		
		// CREATE SUCCESS
		if ($result)
		{
			$response->addMessageSuccess("Create operation is a success!");
			return TRACE::leaveok($context, "Create success", true, self::$TRACE_MODELS_CONTROLLER);
		}
		
		// CREATE FAILED
		$response->addMessageAlert("Create operation has failed!");
		$engine = $arg_model->getStorageEngine();
		if ($engine instanceof AbstractSQLStorage)
		{
			if ($engine->isDuplicateError())
			{
				$response->addMessageAlert("Duplicate key error (".$engine->getLastErrorMsg().")");
			}
			elseif ($engine->isAccessDeniedError())
			{
				$response->addMessageAlert("Access denied error.");
			}
			elseif ($engine->isNullColumnError())
			{
				$response->addMessageAlert("Null column value error.");
			}
		}
		return TRACE::leaveko($context, "Create failed (".$engine->getLastErrorMsg().")", true, self::$TRACE_MODELS_CONTROLLER);
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
		$context = "ModelsController.doModelRead";
		
		CONTRACT::assertTrue($context.".read operation is not implemented", false);
		return false;
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
		$context = "ModelsController.doModelUpdate";
		
		// GET THE MODEL URL ARGUMENTS
		$url_parameters = $this->getUrlParameter($arg_model->getName(), $arg_url_parameters);
		
		// GET THE MODEL FIELDS/VALUES
		$fields_values = $arg_model->getFieldsSet()->getEditableFieldsValues($url_parameters);
		if ( is_null($fields_values) )
		{
			return TRACE::leaveko($context, "no fields values found", false, self::$TRACE_MODELS_CONTROLLER);
		}
		if ( count($fields_values) <= 0)
		{
			TRACE::debug_var($context.".values", count($fields_values));
			return TRACE::leaveko($context, "no field to update", false, self::$TRACE_MODELS_CONTROLLER);
		}
		
		// GET THE MODEL PRIMARY KEYS
		$arg_ids = $arg_model->getFieldsSet()->getPrimaryKeyFieldsValues($url_parameters);
		if ( count($arg_ids) <= 0 )
		{
			TRACE::trace_var($context, "ids", count($arg_ids), self::$TRACE_MODELS_CONTROLLER);
			TRACE::trace_var($context, "model name", $arg_model->getName(), self::$TRACE_MODELS_CONTROLLER);
			TRACE::trace_var($context, "arg_url_parameters", $arg_url_parameters, self::$TRACE_MODELS_CONTROLLER);
			TRACE::trace_var($context, "url_parameters", $url_parameters, self::$TRACE_MODELS_CONTROLLER);
			return TRACE::leaveko($context, "values not found for primary key field", false, self::$TRACE_MODELS_CONTROLLER);
		}
		TRACE::trace_var($context, "arg_ids", $arg_ids, self::$TRACE_MODELS_CONTROLLER);
		
		// GET THE FIRST PRIMARY KEY
		$first_pk_record_values = array_values($arg_ids);
		TRACE::trace_var($context, ".first_pk_record_values", $first_pk_record_values, self::$TRACE_MODELS_CONTROLLER);
		
		// GET THE FIRST PRIMARY KEY VALUE
		$pk_field_value= $first_pk_record_values[0];
		TRACE::trace_var($context, "pk_field_value", $pk_field_value, self::$TRACE_MODELS_CONTROLLER);
		
		// ADD TH PK/VALUE TO THE ASSOC ARRAY
		$pk_field = $arg_model->getFieldsSet()->getPrimaryKeyField();
		$fields_values[$pk_field->getName()] = $pk_field_value;
		
		// GET THE FIELDS LIST
		$fields_list = $arg_model->getFieldsSet()->getFields( array_keys($fields_values) );
		TRACE::trace_var($context, "fields_list", $fields_values, self::$TRACE_MODELS_CONTROLLER);
		TRACE::trace_var($context, "fields_values", $fields_list, self::$TRACE_MODELS_CONTROLLER);
		
		$result = $arg_model->update($fields_list, $fields_values, null, null);
		
		return TRACE::leave($context, "Update error", $result, false, self::$TRACE_MODELS_CONTROLLER);
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
		$context = "ModelsController.doModelDelete";
		// TODO
//		$url_parameters = $this->getUrlParameter($arg_model->getName(), $arg_url_parameters);
		$url_parameters = $this->getUrlParameter("", $arg_url_parameters);
//		TRACE::trace_var($context, "url_parameters", $url_parameters);
		
		$arg_ids = $arg_model->getFieldsSet()->getPrimaryKeyFieldsValues($url_parameters);
		if ( count($arg_ids) <= 0)
		{
			return TRACE::leaveko($context, "pas de clé primaire", false, self::$TRACE_MODELS_CONTROLLER);
		}
		
		$pk_field_name = $arg_model->getFieldsSet()->getPrimaryKeyFieldName();
		$result = $arg_model->deleteItemById($arg_ids[$pk_field_name]);
		return TRACE::leave($context, $result, "exécution de la requête en erreur", false, self::$TRACE_MODELS_CONTROLLER);
	}
	
	
	/**
	 * @brief		Get a model of the given db with the given table and the given field
	 * @param[in]	arg_db				name of the db (string)
	 * @param[in]	arg_table			name of the table (string)
	 * @param[in]	arg_field_1			name of the column (string)
	 * @param[in]	arg_field_2			name of the column (string)
	 * @return		object				found model or null
	 */
	public function getModelByTableField($arg_db, $arg_table, $arg_field_1, $arg_field_2)
	{
		$context = "ModelsController.getModelByTableField";
		
		// TRACE::trace_var($context, "arg_db", $arg_db, true);
		// TRACE::trace_var($context, "arg_table", $arg_table, true);
		// TRACE::trace_var($context, "arg_field_1", $arg_field_1, true);
		// TRACE::trace_var($context, "arg_field_2", $arg_field_2, true);
		
		foreach($this->objects as $model)
		{
			// TRACE::trace_var($context, "model", $model->getName(), true);
			// TRACE::trace_var($context, "model class", get_class($model), true);
			if ($model instanceof AbstractDBModel)
			{
				// TRACE::trace_var($context, "db model", $model->getName(), true);
				if ( $model->getDatabaseName() == $arg_db && $model->getCrudTable() == $arg_table )
				{
					// TRACE::step($context, "db and table found", true);
					if ( $model->getFieldsSet()->hasField($arg_field_1) && $model->getFieldsSet()->hasField($arg_field_2) )
					{
						// TRACE::step($context, "db and table and fiels 1,2 found", true);
						return TRACE::leaveok($context, "model found", $model, self::$TRACE_MODELS_CONTROLLER);
					}
				}
			}
			elseif ($model instanceof LazyObject)
			{
				// TRACE::trace_var($context, "lazy model", $model->getName(), true);
				$options = $model->getOptionsRecord();
				// TRACE::trace_var($context, "options", $options, true);
				if ( array_key_exists("crud_table", $options) && $options["crud_table"] == $arg_table )
				{
					// TRACE::trace_var($context, "lazy db model", $model->getName(), true);
					$model = $model->getCreatedObject();
					if ( $model->getDatabaseName() == $arg_db && $model->getCrudTable() == $arg_table )
					{
						// TRACE::step($context, "db and table found", true);
						if ( $model->getFieldsSet()->hasField($arg_field_1) && $model->getFieldsSet()->hasField($arg_field_2) )
						{
							// TRACE::step($context, "db and table and fiels 1,2 found", true);
							return TRACE::leaveok($context, "model found", $model, self::$TRACE_MODELS_CONTROLLER);
						}
					}
				}
			}
			
		}
		
		return TRACE::leaveok($context, "model not found", null, self::$TRACE_MODELS_CONTROLLER);
	}
}
?>