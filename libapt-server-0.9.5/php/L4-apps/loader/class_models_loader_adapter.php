<?php
/**
 * @file        class_models_loader_adapter.php
 * @brief       Model definition loader
 * @details     Load and create a model and its fields from a definitions array
 * @see			AbstractLoaderAdapter Trace
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * @todo		
 */
final class ModelsLoaderAdapter extends AbstractLoaderAdapter
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not all messages
	static public $TRACE_MODELS_LOADER		= false;
	
	/// @brief		Trace or not 'leave ok' messages
	static public $TRACE_MODELS_LOADER_OK	= false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	public function __construct()
	{
	}
	
	
	
	// ----------------- BUILD METHODS -----------------
	
	/**
	 * @brief		Build a model object from a definitions array
	 * @param[in]	arg_definition_record	definitions array (array)
	 * @param[in]	arg_resource_to_clone	name of an existing resource to clone (string)
	 * @return		boolean				true: success, false: failure
	 */
	public function buildObjectFromRecord($arg_definition_record, $arg_resource_to_clone = null)
	{
		$context = "ModelsLoaderAdapter.buildObjectFromRecord";
		
		// CLONE AN EXISTING RESOURCE
		if ( ! is_null($arg_resource_to_clone) )
		{
			$result = $this->cloneResource("modelAction", $arg_resource_to_clone, $arg_definition_record);
			CONTRACT::assertNotNull($context.".clone resource", $result);
			$arg_definition_record = $result;
		}
		
		// CHECK RECORD
		CONTRACT::assertNotNull($context.".arg_definition_record", $arg_definition_record);
		CONTRACT::assertTrue($context.".count(arg_definition_record)>=3", (count($arg_definition_record) >= 3));
		
		// MODEL CREATION ARGS
		$model_name		= $arg_definition_record["model_name"];
		CONTRACT::assertNotEmptyString($context.".model_name", $model_name);
		TRACE::trace_var($context, "model_name", $model_name, self::$TRACE_MODELS_LOADER);
		
		// GET MODELS CONTROLLER
		$models_controller = Controllers::getController("modelAction");
		CONTRACT::assertNotNull($context.".models_controller", $models_controller);
		
		// MODEL EXISTS : REGISTER FIELD
		$model = null;
		if ( $models_controller->hasObject($model_name) )
		{
			// GET LAZY OBJECT
			$lazy = $models_controller->getLazyObject($model_name);
			CONTRACT::assertNotNull($context.".lazy model is registered but is null for name [".$model_name."]", $lazy);
			
			// GET OPTIONS RECORD
			$options = $lazy->getOptionsRecord();
			CONTRACT::assertNotNull($context.".options", $options);
			
			// GET MODEL FIELDS DEFINITION ARRAY
			if ( ! array_key_exists("fields_definitions", $options) )
			{
				$options["fields_definitions"] = array();
			}
			$fields_definitions = $options["fields_definitions"];
			
			// IF EMPTY, SET FIELD TABLE AND DB NAME WITH DEFAULT CRUD TABLE AND OPTION OF THE MODEL
			if ( array_key_exists("source", $arg_definition_record) && $arg_definition_record["source"] == "SQL" )
			{
				// SET TABLE FROM MODEL
				if (! array_key_exists("sql_table", $arg_definition_record) || $arg_definition_record["sql_table"] == "")
				{
					$arg_definition_record["sql_table"] = $options["crud_table"];
				}
				
				// SET DB FROM CONNECTION
				if (! array_key_exists("sql_db", $arg_definition_record) || $arg_definition_record["sql_db"] == "")
				{
					$connexion_name = $options["connexion_name"];
					$cx_control = Controllers::getController("connection");
					if ( $cx_control->hasObject($connexion_name) )
					{
						$arg_definition_record["sql_db"] = $cx_control->getObject($connexion_name)->getDatabaseName();
					}
				}
				
				// SET COLUMN FROM MODEL NAME
				if (! array_key_exists("sql_column", $arg_definition_record) || $arg_definition_record["sql_column"] == "")
				{
					$arg_definition_record["sql_column"] = $arg_definition_record["name"];
				}
				
				// SET ALIAS FROM MODEL NAME
				if (! array_key_exists("sql_alias", $arg_definition_record) || $arg_definition_record["sql_alias"] == "")
				{
					$arg_definition_record["sql_alias"] = $arg_definition_record["name"];
				}
				
				// SET DEFAULT VALUE FROM THE FIELD VALUE DEFAULT OPTION
				if (! array_key_exists("default", $arg_definition_record))
				{
					$arg_definition_record["default"] = "";
				}
				
				// SET FOREIGN DB FROM CRUD TABLE DB
				if (! array_key_exists("sql_foreign_db", $arg_definition_record) || $arg_definition_record["sql_foreign_db"] == "")
				{
					if (array_key_exists("sql_foreign_table", $arg_definition_record) && $arg_definition_record["sql_foreign_table"] != "")
					{
						$arg_definition_record["sql_foreign_db"] = $arg_definition_record["sql_db"];
					}
				}
			}
			
			// APPEND FIELD DEFINITION TO OPTIONS
			$fields_definitions[] = $arg_definition_record;
			
			// UPDATE LAZY OBJECT
			$options["fields_definitions"] = $fields_definitions;
			$lazy->setOptionsRecord($options);
			return TRACE::leaveok($context, "field definition append for name [".$model_name."]", true, self::$TRACE_MODELS_LOADER_OK);
		}
		
		// CHECK MODEL CLASS NAME
		$model_class = $arg_definition_record["class_name"];
		CONTRACT::assertNotEmptyString($context.".model_class", $model_class);
		TRACE::trace_var($context, "model_class", $model_class, self::$TRACE_MODELS_LOADER);
		
		// CREATE LAZY OBJECT
		$lazy = new LazyObject($model_name, $model_class, $this, $arg_definition_record);
		if ( ! $lazy->isReady() )
		{
			$lazy->dump($context, self::$TRACE_MODELS_LOADER);
			return TRACE::leaveko($context, "lazy object not ready", null, self::$TRACE_MODELS_LOADER);
		}
		
		// GET ROLES
		$model_role_read	= $arg_definition_record["role_read"];
		$model_role_create	= $arg_definition_record["role_create"];
		$model_role_update	= $arg_definition_record["role_update"];
		$model_role_delete	= $arg_definition_record["role_delete"];
		
		$model_role_read	= $model_role_read		== "" ? null : $model_role_read;
		$model_role_create	= $model_role_create	== "" ? null : $model_role_create;
		$model_role_update	= $model_role_update	== "" ? null : $model_role_update;
		$model_role_delete	= $model_role_delete	== "" ? null : $model_role_delete;
		
		// REGISTER MODEL CONTROLLER
		$models_controllers = Controllers::getModelsControllers();
		foreach($models_controllers as $models_controller)
		{
			CONTRACT::assertNotNull($context.".models_controller", $models_controller);
			
			$models_controller->registerObject($lazy);
			
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_READ.$model_name,	$lazy, ModelsController::$READ_ACCESS);
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_CREATE.$model_name,	$lazy, ModelsController::$CREATE_ACCESS);
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_UPDATE.$model_name,	$lazy, ModelsController::$UPDATE_ACCESS);
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_DELETE.$model_name,	$lazy, ModelsController::$DELETE_ACCESS);
			
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_EXPORT_JSON.$model_name,	$lazy, ModelsController::$READ_ACCESS);
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_EXPORT_CSV.$model_name,		$lazy, ModelsController::$READ_ACCESS);
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_EXPORT_XLS.$model_name,		$lazy, ModelsController::$READ_ACCESS);
			$models_controller->registerAction(ModelsController::$ACTION_PREFIX_EXPORT_TXT.$model_name,		$lazy, ModelsController::$READ_ACCESS);
		}
		
		// REGISTER JSON CONTROLLER
		$json_controllers = Controllers::getJsonControllers();
		foreach($json_controllers as $json_controller)
		{
			CONTRACT::assertNotNull($context.".json_controller", $json_controller);
			
			$json_controller->registerAction(ModelsController::$ACTION_PREFIX_READ.$model_name,		$lazy, ModelsController::$READ_ACCESS);
			$json_controller->registerAction(ModelsController::$ACTION_PREFIX_CREATE.$model_name,	$lazy, ModelsController::$CREATE_ACCESS);
			$json_controller->registerAction(ModelsController::$ACTION_PREFIX_UPDATE.$model_name,	$lazy, ModelsController::$UPDATE_ACCESS);
			$json_controller->registerAction(ModelsController::$ACTION_PREFIX_DELETE.$model_name,	$lazy, ModelsController::$DELETE_ACCESS);
		}
		
		// REGISTER AUTHORIZATIONS
		if (Authorization::hasRoleAdapter())
		{
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$READ_ACCESS,   $model_role_read);
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$CREATE_ACCESS, $model_role_create);
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$UPDATE_ACCESS, $model_role_update);
			Authorization::getRoleAdapter()->registerRoleAccess($model_name, ModelsController::$DELETE_ACCESS, $model_role_delete);
		}
		
		return TRACE::leaveok($context, "Model [".$lazy->getName()."] build success", true, self::$TRACE_MODELS_LOADER_OK);
	}
	
	
	
	/**
	 * @brief		Build a model field from a definitions array
	 * @param[in]	arg_model				model instance (object)
	 * @param[in]	arg_field_record		definitions array (array)
	 * @return		boolean				true: success, false: failure
	 */
	public function buildModelFieldFromRecord($arg_model, $arg_field_record)
	{
		$context = "ModelsLoaderAdapter.buildModelFieldFromRecord";
		
		$record = $arg_field_record;
		
		// GET FIELD ATTRIBUTES
		$field_source  = $record["source"];
		$field_name    = $record["name"];
		$field_type    = $record["type"];
		$field_format  = (array_key_exists("format", $record) ) ? $record["format"] : null;
		$field_default = $record["default"];
		$field_label   = $record["label"];
		
		// CHECK REQUIRED FIELD ATTRIBUTES
		CONTRACT::assertNotEmptyString($context.".field_name", $field_name);
		CONTRACT::assertNotEmptyString($context.".field_type", $field_type);
		CONTRACT::assertNotEmptyString($context.".field_label", $field_label);
		
		// CREATE FIELD OBJECT
		$field = null;
		if ($field_source == "SQL")
		{
			$field = new SQLField($field_source, $field_name, $field_type, $field_format, $field_default, $field_label);
			$has_sql_attributes = $this->hasSQLAttributes($record);
			
			if ($has_sql_attributes)
			{
				$is_pk   = $record["sql_is_primary_key"] == 1 ? 1 : 0;
				$is_expr = $record["sql_is_expression"]  == 1 ? 1 : 0;
				$field->setSQLAttributes( $record["sql_db"], $record["sql_table"], $record["sql_column"], $record["sql_alias"], $is_pk, $is_expr);
				
				$has_foreign_attributes = $this->hasSQLForeignAttributes($record);
				
				if ($has_foreign_attributes)
				{
					$foreign_db     = $record["sql_foreign_db"];
					$foreign_table  = $record["sql_foreign_table"];
					$foreign_key    = $record["sql_foreign_key"];
					$foreign_column = $record["sql_foreign_column"];
					$field->setSQLForeignAttributes($foreign_db, $foreign_table, $foreign_key, $foreign_column);
				}
				
				// MODEL HAS JOIN
				if ( $arg_model->hasJoins() && array_key_exists("join_editor_field",  $record) )
				{
					$join_editor_field = $record["join_editor_field"];
					$field->setJoinEditorField($join_editor_field);
				}
			}
		}
		else
		{
			$field = new Field($field_source, $field_name, $field_type, $field_format, $field_default, $field_label);
			if ( array_key_exists("sql_is_primary_key", $record) )
			{
				$is_pk = $record["sql_is_primary_key"] == 1 ? 1 : 0;
				$field->setPrimaryKey($is_pk);
			}
		}
		
		$field_is_editable = $record["isEditable"] == 1 ? 1 : 0;
		$field_is_visible  = $record["isVisible"]  == 1 ? 1 : 0;
		$field->setEditable($field_is_editable);
		$field->setVisible($field_is_visible);
		
		
		$arg_model->getFieldsSet()->registerField($field->getAttribute("name"), $field);
		
		return true;
	}
	
	public function hasSQLAttributes($record)
	{
		$result = array_key_exists("sql_db", $record) && array_key_exists("sql_table", $record)
			&& array_key_exists("sql_column", $record) && array_key_exists("sql_alias", $record)
			&& array_key_exists("sql_is_expression", $record) && array_key_exists("sql_is_primary_key", $record);
		if ( ! $result)
		{
			return false;
		}
		
		$db      = $record["sql_db"];
		$table   = $record["sql_table"];
		$column  = $record["sql_column"];
		$alias   = $record["sql_alias"];
		$is_expr = $record["sql_is_expression"];
		$is_pk   = $record["sql_is_primary_key"];
		$result = $db != "" && $table != "" && $column != "" && $alias != "" && $is_expr != "" && $is_pk != "";
		if ( ! $result)
		{
			return false;
		}
		
		return true;
	}
	
	public function hasSQLForeignAttributes($record)
	{
		$result = array_key_exists("sql_foreign_db", $record)
				&& array_key_exists("sql_foreign_table", $record)
				&& array_key_exists("sql_foreign_key", $record)
				&& array_key_exists("sql_foreign_column", $record);
		if ( ! $result)
		{
			return false;
		}
		
		$foreign_db     = $record["sql_foreign_db"];
		$foreign_table  = $record["sql_foreign_table"];
		$foreign_key    = $record["sql_foreign_key"];
		$foreign_column = $record["sql_foreign_column"];
		$result = $foreign_db != "" && $foreign_table != "" && $foreign_key != "" && $foreign_column != "";
		if ( ! $result)
		{
			return false;
		}
		
		return true;
	}
	
	public function buildObjectFromLazy($arg_lazy_object)
	{
		$context = "ModelsLoaderAdapter.buildObjectFromLazy";
		
		// CHECK LAZY OBJECT
		if ( is_null($arg_lazy_object) || ! $arg_lazy_object instanceof LazyObject )
		{
			return TRACE::leaveko($context, "bad lazy object class [". get_class($arg_lazy_object) ."]", null, self::$TRACE_MODELS_LOADER);
		}
		if ( ! $arg_lazy_object->isReady() )
		{
			$arg_lazy_object->dump($context, self::$TRACE_MODELS_LOADER);
			return TRACE::leaveko($context, "lazy object not ready", null, self::$TRACE_MODELS_LOADER);
		}
		TRACE::step($context, "lazy object is ready", self::$TRACE_MODELS_LOADER);
		
		// GET LAZY DATAS
		$model_name		= $arg_lazy_object->getName();
		$model_class	= $arg_lazy_object->getClassName();
		$options		= $arg_lazy_object->getOptionsRecord();
		TRACE::trace_var($context, "model_name", $model_name, self::$TRACE_MODELS_LOADER);
		TRACE::trace_var($context, "model_class", $model_class, self::$TRACE_MODELS_LOADER);
		TRACE::trace_var($context, "options", $options, self::$TRACE_MODELS_LOADER);
		
		// CHECK CLASSNAME
		if ( is_null($model_class) || $model_class == "" )
		{
			return TRACE::leaveko($context." model creation", "model_class is null for [".$model_name."]", null, self::$TRACE_MODELS_LOADER);
		}
		
		// MODEL HAS CONNEXION
		if ( array_key_exists("connexion_name", $options) and $options["connexion_name"] != "")
		{
			// CREATE MODEL
			$connexion_name = $options["connexion_name"];
			$model = new $model_class($model_name, $connexion_name);
			
			// GET CRUD TABLE
			$crud_table = $options["crud_table"];
			$crud_table = $crud_table == "" ? null : $crud_table;
			if ( ! is_null($crud_table) )
			{
				$model->setCrudTable($crud_table);
			}
		}
		// MODEL HAS FILE PATH NAME
		elseif( array_key_exists("model_file_path_name", $options) && $options["model_file_path_name"] != "")
		{
			// CREATE MODEL
			$file_path_name   = LIBAPT_APP_ROOT.$options["model_file_path_name"];
			$read_only        = array_key_exists("read_only", $options)			? $options["read_only"]			: true;
			$has_header       = array_key_exists("has_header", $options)		? $options["has_header"]		: false;
			$fields_separator = array_key_exists("fields_separator", $options)	? $options["fields_separator"]	: ";";
			$model = new $model_class($model_name, $file_path_name, $read_only, $fields_separator, $has_header);
		}
		// BAD MODEL ARGS
		else
		{
			return TRACE::leaveko($context, "model creation: bad model args for [".$model_name."]", null, self::$TRACE_MODELS_LOADER);
		}
		
		// CHECK MODEL OBJECT
		if ( is_null($model) )
		{
			return TRACE::leaveko($context, "failed to build a model for [".$model_name."]", null, self::$TRACE_MODELS_LOADER);
		}
		
		// APPEND INNER JOINS
		if ( array_key_exists(AbstractModel::$OPTION_INNER_JOINS, $options) )
		{
			TRACE::step($context, "Process INNER JOINS option", self::$TRACE_MODELS_LOADER);
			
			$joins_strings = explode("|", $options[AbstractModel::$OPTION_INNER_JOINS]);
			CONTRACT::assertArray($context.".joins_strings", $joins_strings);
			
			foreach($joins_strings as $join_string)
			{
				TRACE::step($context, "Process INNER JOIN [$join_string]", self::$TRACE_MODELS_LOADER);
				
				$join_record_strings = explode(",", $join_string);
				CONTRACT::assertArrayCount($context.".join_record_strings.size=4-7", $join_record_strings, 4, 7);
				
				$join_record = array();
				foreach($join_record_strings as $join_item_str)
				{
					TRACE::step($context, "Process INNER JOIN item [$join_item_str]", self::$TRACE_MODELS_LOADER);
					
					$join_item = explode("=", $join_item_str);
					CONTRACT::assertArrayCount($context.".join_item.size=2", $join_item, 2, 2);
					
					$joint_item_key		= $join_item[0];
					$joint_item_value	= $join_item[1];
					CONTRACT::assertNotEmptyString($context.".joint_item_key", $joint_item_key);
					CONTRACT::assertNotEmptyString($context.".joint_item_value", $joint_item_value);
					
					$join_record[$joint_item_key] = $joint_item_value;
				}
				
				$model->addJoinRecord($join_record);
			}
		}
		
		// GET FIELDS DEFINITIONS
		if ( ! array_key_exists("fields_definitions", $options) )
		{
			TRACE::trace_var($context, "options", $options, self::$TRACE_MODELS_LOADER);
			return TRACE::leaveok($context, "no fields definitions found", self::$TRACE_MODELS_LOADER_OK);
		}
		$fields_definitions = $options["fields_definitions"]; // ARRAY VALUE : DO NOT ENCODE UTF-8
		
		// APPEND FIELDS
		foreach($fields_definitions as $field_definition)
		{
			if ( ! $this->buildModelFieldFromRecord($model, $field_definition) )
			{
				TRACE::trace_var($context, "field_definition", $field_definition, self::$TRACE_MODELS_LOADER);
				return TRACE::leaveko($context, "model creation: bad model args for [".$model_name."]", null, self::$TRACE_MODELS_LOADER);
			}
		}
		
		
		// OPTIONS
		if ( array_key_exists("is_cached", $options) )
		{
			$model->setIsCached( TYPE::getBooleanValue($options["is_cached"], false) );
		}
		
		return TRACE::leaveok($context, "object model created [$model_name] of class [$model_class]", $model, self::$TRACE_MODELS_LOADER_OK);
	}
}
?>