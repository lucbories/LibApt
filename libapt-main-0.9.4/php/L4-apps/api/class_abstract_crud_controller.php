<?php
/**
 * @file        class_abstract_crud_controller.php
 * @brief       Abstract controller class for CRUD operations
 * @details     
 * @see			AbstractController Trace
 * @ingroup     L0_CORE
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractCrudController extends AbstractController
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief	Trace or not (boolean)
	static public $TRACE_MODELS_CONTROLLER	= false;
	
	/// @brief	Controller action prefix for read operations
	static public $ACTION_PREFIX_READ   = "read";
	
	/// @brief	Controller action prefix for create operations
	static public $ACTION_PREFIX_CREATE = "create";
	
	/// @brief	Controller action prefix for update operations
	static public $ACTION_PREFIX_UPDATE = "update";
	
	/// @brief	Controller action prefix for delete operations
	static public $ACTION_PREFIX_DELETE = "delete";
	
	
	/// @brief	Controller action prefix for export operations to json file
	static public $ACTION_PREFIX_EXPORT_JSON = "export_json";
	
	/// @brief	Controller action prefix for export operations to csv file
	static public $ACTION_PREFIX_EXPORT_CSV = "export_csv";
	
	/// @brief	Controller action prefix for export operations to xls file
	static public $ACTION_PREFIX_EXPORT_XLS = "export_xls";
	
	/// @brief	Controller action prefix for export operations to txt file
	static public $ACTION_PREFIX_EXPORT_TXT = "export_txt";
	
	
	/// @brief	Controller access code for read operations
	static public $READ_ACCESS   = "MODEL_READ";
	
	/// @brief	Controller access code for create operations
	static public $CREATE_ACCESS = "MODEL_CREATE";
	
	/// @brief	Controller access code for update operations
	static public $UPDATE_ACCESS = "MODEL_UPDATE";
	
	/// @brief	Controller access code for delete operations
	static public $DELETE_ACCESS = "MODEL_DELETE";
	
	
	
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
	
	
	
	// ----------------- OPERATIONS EXECUTION -----------------
	
	/**
	 * @brief		Execute create operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	abstract protected function doModelCreate($arg_model, $arg_url_parameters, $arg_action_name = null);
	
	/**
	 * @brief		Execute create operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	abstract protected function doModelRead  ($arg_model, $arg_url_parameters, $arg_action_name = null);
	
	/**
	 * @brief		Execute update operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	abstract protected function doModelUpdate($arg_model, $arg_url_parameters, $arg_action_name = null);
	
	/**
	 * @brief		Execute delete operations
	 * @param[in]	arg_model				model object
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @param[in]	arg_action_name			name of the requested action, default null, unused (string)
	 * @return		boolean					true:success, false:failure
	 */
	abstract protected function doModelDelete($arg_model, $arg_url_parameters, $arg_action_name = null);
	
	
	/**
	 * @brief		Execute controller operations
	 * @param[in]	arg_action_name			name of the requested action (string)
	 * @param[in]	arg_url_parameters		request parameters (array)
	 * @return		boolean					true:success, false:failure
	 */
	protected function doActionSelf($arg_action_name, $arg_url_parameters)
	{
		$context = get_class($this).".AbstractCrudController.doActionSelf";
		TRACE::enter($context, "", self::$TRACE_CONTROLLER);
		
		TRACE::trace_var($context, "action", $arg_action_name, self::$TRACE_CONTROLLER);
		TRACE::trace_var($context, "parameters", $arg_url_parameters, self::$TRACE_CONTROLLER);
		
		// RECHERCHE DU MODELE DE DONNEES CONCERNE PAR L ACTION
		$model = $this->getActionObject($arg_action_name);
		Contract::assertNotNull($context.".model for [$arg_action_name]", $model);
		
		// GET RESPONSE
		$response = Application::getInstance()->getResponse();
		
		// READ
		$target_prefix = ModelsController::$ACTION_PREFIX_READ;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "read", self::$TRACE_CONTROLLER);
			$result = $this->doModelRead($model, $arg_url_parameters, $arg_action_name);
			if ($result)
			{
				$response->setStatus('200');
			}
			else
			{
				$response->setStatus('400');
			}
			// $response->generateHtmlStatus();
			return $result;
		}
		
		// CREATE
		$target_prefix = ModelsController::$ACTION_PREFIX_CREATE;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "create", self::$TRACE_CONTROLLER);
			$result = true;
			if ( ! Application::getInstance()->isReadonly() )
			{
				$result = $this->doModelCreate($model, $arg_url_parameters, $arg_action_name);
			}
			if ($result)
			{
				$response->setStatus('200');
			}
			else
			{
				$response->setStatus('400');
			}
			// $response->generateHtmlStatus();
			return $result;
		}
		
		// UPDATE
		$target_prefix = ModelsController::$ACTION_PREFIX_UPDATE;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "update", self::$TRACE_CONTROLLER);
			$result = true;
			if ( ! Application::getInstance()->isReadonly() )
			{
				$result = $this->doModelUpdate($model, $arg_url_parameters, $arg_action_name);
			}
			if ($result)
			{
				$response->setStatus('200');
			}
			else
			{
				$response->setStatus('400');
			}
			// $response->generateHtmlStatus();
			return $result;
		}
		
		// DELETE
		$target_prefix = ModelsController::$ACTION_PREFIX_DELETE;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "delete", self::$TRACE_CONTROLLER);
			$result = true;
			if ( ! Application::getInstance()->isReadonly() )
			{
				$result = $this->doModelDelete($model, $arg_url_parameters, $arg_action_name);
			}
			if ($result)
			{
				$response->setStatus('200');
			}
			else
			{
				$response->setStatus('400');
			}
			// $response->generateHtmlStatus();
			return $result;
		}
		
		// EXPORT JSON
		$target_prefix = ModelsController::$ACTION_PREFIX_EXPORT_JSON;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "export JSON", self::$TRACE_CONTROLLER);
			$view = new JsonModelView($model->getName() . "exportJSON", null, array("model_name" => $model->getName()) );
			$view->html();
			return true;
		}
		
		// EXPORT CSV
		$target_prefix = ModelsController::$ACTION_PREFIX_EXPORT_CSV;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "export CSV", self::$TRACE_CONTROLLER);
			$view = new CsvModelView($model->getName() . "exportCSV", null, array("model_name" => $model->getName()) );
			$view->html();
			return true;
		}
		
		// EXPORT XLS
		$target_prefix = ModelsController::$ACTION_PREFIX_EXPORT_XLS;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "export XLS", self::$TRACE_CONTROLLER);
			$view = new XlsModelView($model->getName() . "exportXLS", null, array("model_name" => $model->getName()) );
			$view->html();
			return true;
		}
		
		// EXPORT TXT
		$target_prefix = ModelsController::$ACTION_PREFIX_EXPORT_TXT;
		$action_prefix = substr($arg_action_name, 0, strlen($target_prefix) );
		if ($action_prefix == $target_prefix)
		{
			TRACE::step($context, "export TXT", self::$TRACE_CONTROLLER);
			$view = new TxtModelView($model->getName() . "exportTXT", null, array("model_name" => $model->getName()) );
			$view->html();
			return true;
		}
		
		return TRACE::leaveko($context, "action not found [$arg_action_name]", false, self::$TRACE_CONTROLLER);
	}
}
?>