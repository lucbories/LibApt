<?php
/**
 * @file        class_js_wrapper.php
 * @brief       Javascript wrapper to use server resources (static class)
 * @details     
 * @see			Trace
 * @ingroup     L4_APPS
 * @date        2013-06-02
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class JSWRAPPER
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_JS_WRAPPER			= false;
	
	/// @brief		Models to load during the page loading
	static public $JS_WRAPPER_MODELS		= array();
	
	/// @brief		Views to load during the page loading
	static public $JS_WRAPPER_VIEWS			= array();
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		PRIVATE CONSTRUCTOR (static class)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	// ----------------- REGISTER RESOURCES TO LOAD -----------------
	/**
	 * @brief		Add a model to load at page startup
	 * @param[in]	arg_model		object of the resource (string)
	 * @return		nothing
	 */
	static public function addModelToLoad($arg_model)
	{
		$context = "JSWRAPPER::addModelToLoad";
		
		CONTRACT::assertNotEmptyString($context.".arg_model_name", $arg_model->getName());
		self::$JS_WRAPPER_MODELS[] = $arg_model;
	}
	
	/**
	 * @brief		Add a view to load at page startup
	 * @param[in]	arg_view			object of the resource (string)
	 * @return		nothing
	 */
	static public function addViewToLoad($arg_view)
	{
		$context = "JSWRAPPER::addViewToLoad";
		
		CONTRACT::assertNotEmptyString($context.".arg_view_name", $arg_view->getName());
		self::$JS_WRAPPER_VIEWS[] = $arg_view;
	}
	
	/**
	 * @brief		Init resources to load at page startup
	 * @param[in]	arg_create_resources	create or not the resource inline (boolean)
	 * @return		string					init js code
	 */
	static public function initResourcesToLoad($arg_create_resources = false)
	{
		$context = "JSWRAPPER::initResourcesToLoad";
		
		$js_code  = "	$(document).ready(\n		function()\n		{\n";
		
		// INIT MODELS
		$js_code .= "			Libapt.use('models-model');\n";
		$js_code .= "			Libapt.use('apps-models');\n";
		if ($arg_create_resources)
		{
			foreach(self::$JS_WRAPPER_MODELS as $model)
			{
				// GET MODEL DECLARATION
				$model_declaration_array	= self::getModelDeclarationsArray($model);
				$model_declaration_json		= self::arrayToJson($model_declaration_array);
				$js_code .= "			LibaptModels.create($model_declaration_json);\n";
			}
		}
		
		// INIT VIEWS
		$js_code .= "			Libapt.use('apps-all');\n";
		$js_code .= "\n			var jqo_container = null;\n";
		$js_code .= "			var view = null;\n";
		$js_code .= "			var link = null;\n";
		foreach(self::$JS_WRAPPER_VIEWS as $view)
		{
			$view_name	= $view->getName();
			$div_id		= $view_name."_container_id";
			$js_code .= "\n			jqo_container = $('#$div_id');\n";
			if ($arg_create_resources)
			{
				// GET VIEW DECLARATION
				$view_declaration_array	= self::getViewDeclarationsArray($view);
				$view_declaration_json	= self::arrayToJson($view_declaration_array);
				$js_code .= "			LibaptViews.create($view_declaration_json);\n";
			}
			$js_code .= "			view = LibaptViews.get('$view_name');\n";
			$js_code .= "			view.set_container(jqo_container);\n";
			$js_code .= "			view.draw();\n";
			
			if ( ! is_null($view->getOptionLinks()) )
			{
				foreach($view->getOptionLinks() as $link_dest_str)
				{
					$link_dest_record = explode(":", $link_dest_str);
					CONTRACT::assertArray($context.".link attributes", $link_dest_record);
					CONTRACT::assertEquals($context.".link attributes", count($link_dest_record), 5);
					
					$link_dest_view_name		= $link_dest_record[0];
					$link_dest_view_type		= $link_dest_record[1];
					$link_src_field_name		= $link_dest_record[2];
					$link_dest_field_name		= $link_dest_record[3];
					$link_dest_field_default	= $link_dest_record[4];
					$js_code .= "			link = { source_view_name:'$view_name', target_view_name:'$link_dest_view_name', target_view_type:'$link_dest_view_type', source_field_name:'$link_src_field_name', target_field_name:'$link_dest_field_name', target_field_default:'$link_dest_field_default'};\n";
					$js_code .= "			view.add_link(link);\n";
				}
			}
		}
		
		$js_code .= "		}\n";
		$js_code .= "	);";
		
		return $js_code;
	}
	
	
	
	// ----------------- PHP TO JS CONVERSION -----------------
	/**
	 * @brief		Convert a php array to a json string
	 * @param[in]	arg_php_value		value to convert (array)
	 * @return		string
	 */
	static public function arrayToJson($arg_php_value)
	{
		$context = "JSWRAPPER::arrayToJson";
		
		// CHECK ARGUMENT
		CONTRACT::assertArray($context, $arg_php_value);
		
		// STANDARD CONVERSION
		return json_encode($arg_php_value);
	}
	
	/**
	 * @brief		Convert a php object to a json string
	 * @param[in]	arg_php_value		value to convert (object)
	 * @return		string
	 */
	static public function objectToJson($arg_php_value)
	{
		$context = "JSWRAPPER::objectToJson";
		
		// CHECK ARGUMENT
		CONTRACT::assertObject($context, $arg_php_value);
		
		// STANDARD CONVERSION
		return json_encode($arg_php_value);
	}
	
	
	/**
	 * @brief		Filter ressource php declaration options
	 * @param[in]	arg_resource_object		resource (object)
	 * @return		array
	 */
	static public function getResourceDeclarationsArray($arg_resource_object)
	{
		$is_model		= $arg_resource_object instanceof AbstractModel;
		$is_view		= $arg_resource_object instanceof AbstractView;
		$is_menubar		= $arg_resource_object instanceof MenuItem;
		
		if ($is_model)
		{
			return JSWRAPPER::getModelDeclarationsArray($arg_resource_object);
		}
		if ($is_view)
		{
			return JSWRAPPER::getViewDeclarationsArray($arg_resource_object);
		}
		// if ($is_menubar)
		// {
			// return JSWRAPPER::getModelDeclarationsArray($arg_resource_object);
		// }
		
		return null;
	}
	
	
	/**
	 * @brief		Get model ressource declaration array
	 * @param[in]	arg_model		model instance (object)
	 * @return		array
	 */
	static public function getModelDeclarationsArray($arg_model)
	{
		$context = "JSWRAPPER::getModelDeclarationsArray";
		
		// JS MODEL EXAMPLE
		/*
			{
				'source':'json','name':'MODEL_AUTH_PROFILES',
				'fields':[
					new LibaptField('id_profile', 'MODEL_AUTH_PROFILES', 'model', 'Integer', '', '', 'Id', false, false, true, true, '', '', '', []),
					new LibaptField('profile', 'MODEL_AUTH_PROFILES', 'model', 'String', '', '', 'Label', true, true, false, true, '', '', '', []),
					new LibaptField('description', 'MODEL_AUTH_PROFILES', 'model', 'String', '', '', 'Description', true, true, false, true, '', '', '', [])
					],
				'access':{'create':true,'read':true,'update':true,'delete':true}
			};
		*/
		
		// CHECK ARGUMENT
		CONTRACT::assertInherit($context, $arg_model, "AbstractModel");
		
		// ENTER
		$context = $context."(".$arg_model->getName().")";
		TRACE::enter($context, "", self::$TRACE_JS_WRAPPER);
		
		
		// GET MODEL NAME
		$model_name = $arg_model->getName();
		
		// GET MODELS CONTROLLER
		$models_controller = Controllers::getController("modelAction");
		CONTRACT::assertNotNull($context.".models_controller", $models_controller);
		
		
		// DECLARE FIELDS WRAPPERS
		TRACE::step($context, "Loop on model fields", self::$TRACE_JS_WRAPPER);
		
		$fields_declaration	= array();
		$fields_index		= 0;
		$fields				= $arg_model->getFieldsSet()->getFields();
		foreach($fields as $field_key => $field_object)
		{
			TRACE::trace_var($context, "current field name", $field_key, self::$TRACE_JS_WRAPPER);
			$fields_declaration[]	= self::getModelFieldDeclarationsArray($arg_model, $field_object);
		}
		
		
		// GET ACCESS DECLARATION
		$auth_can_read   = Authorization::checkLogged($arg_model->getName(), ModelsController::$READ_ACCESS);
		$auth_can_create = Authorization::checkLogged($arg_model->getName(), ModelsController::$CREATE_ACCESS);
		$auth_can_update = Authorization::checkLogged($arg_model->getName(), ModelsController::$UPDATE_ACCESS);
		$auth_can_delete = Authorization::checkLogged($arg_model->getName(), ModelsController::$DELETE_ACCESS);
		
		$access_declaration				= array();
		$access_declaration["create"]	= $auth_can_create;
		$access_declaration["read"]		= $auth_can_read;
		$access_declaration["update"]	= $auth_can_update;
		$access_declaration["delete"]	= $auth_can_delete;
		
		
		// GET MODEL DECLARATION
		$model_declaration				= array();
		$model_declaration["source"]	= "json";
		$model_declaration["name"]		= $model_name;
		$model_declaration["fields"]	= $fields_declaration;
		$model_declaration["access"]	= $access_declaration;
		
		$model_declaration["is_cached"]	= $arg_model->getIsCached() ? "1" : "0";
		
		// LEAVE
		return TRACE::leaveok($context, "", $model_declaration, self::$TRACE_JS_WRAPPER);
	}
	
	
	
	/**
	 * @brief		Get model field declaration array
	 * @param[in]	arg_model		model instance (object)
	 * @param[in]	arg_field		field instance (object)
	 * @return		array
	 */
	static public function getModelFieldDeclarationsArray($arg_model, $arg_field)
	{
		$context = "JSWRAPPER::getModelFieldDeclarationsArray(model,field)";
		TRACE::enter($context, "", self::$TRACE_JS_WRAPPER);
		
		// JS FIELD EXAMPLE
		/*	{
				'name'			: null,
				'model_name'	: null,
				'source'		: 'model',
				'value_type'	: 'string',
				'value_default'	: '',
				'value_format'	: '',
				'label'			: '',
				'is_visible'	: true,
				'is_editable'	: true,
				'is_pk'			: true,
				'is_crud'		: true,
				'foreign_model'			: '',
				'foreign_key_field'		: '',
				'foreign_value_field'	: '',
				'join_editor_fields'	: null
			};
		*/
		
		// GET FIELD ATTRIBUTES
		$field_name			= $arg_field->getName();
		$field_type			= $arg_field->getType();
		$field_default		= $arg_field->getDefault();
		$field_format		= $arg_field->getFormat();
		$field_label		= $arg_field->getLabel();
		$field_visible		= $arg_field->isVisible();
		$field_editable		= $arg_field->isEditable();
		$field_pk			= $arg_field->isPrimaryKey();
		$field_crud			= $arg_field->isCrud();
		
		
		// INIT FIELD FOREIGN ATTRIBUTES
		$field_foreign_model_name	= "";
		$field_foreign_key_name		= "";
		$field_foreign_column_name	= "";
		
		
		// INIT FIELD JOIN ATTRIBUTES
		$field_join_target_model_name	= "";
		$field_join_target_key_name		= "";
		$field_join_source_key_name		= "";
		$field_join_fields				= array();
		
		
		// FIELD IS SQL ?
		$current_field_is_sql = ($arg_field instanceof SQLField);
		TRACE::trace_var($context, "current_field_is_sql", ($current_field_is_sql ? "1" : "0"), self::$TRACE_JS_WRAPPER);
		
		if ( $current_field_is_sql )
		{
			$table = $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_TABLE);
			
			// UPDATE CRUD ATTRIBUTE
			$field_crud = ( $table == $arg_model->getCrudTable() );
		}
		
		
		// DEBUG
		// TRACE::trace_var($context, "field_name", $field_name, true);
		// TRACE::trace_var($context, "current_field_is_sql", $current_field_is_sql, true);
		// TRACE::trace_var($context, "ATTRIBUTE_SQL_FOR_DB", $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_DB), true);
		// TRACE::trace_var($context, "ATTRIBUTE_SQL_FOR_TABLE", $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_TABLE), true);
		// TRACE::trace_var($context, "ATTRIBUTE_SQL_FOR_KEY", $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_KEY), true);
		// TRACE::trace_var($context, "ATTRIBUTE_SQL_FOR_COLUMN", $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_COLUMN), true);
		// TRACE::trace_var($context, "hasSQLForeignAttributes()", $arg_field->hasSQLForeignAttributes(), true);
		
		
		// CURRENT FIELD IS PART A FOREIGN KEY LINK
		if ( $current_field_is_sql && $arg_field->hasSQLForeignAttributes() )
		{
			TRACE::step($context, "hasSQLForeignAttributes", self::$TRACE_JS_WRAPPER);
			
			$foreign_db			= $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_DB);
			$foreign_table		= $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_TABLE);
			$foreign_key		= $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_KEY);
			$foreign_column		= $arg_field->getAttribute(SQLField::$ATTRIBUTE_SQL_FOR_COLUMN);
			
			// GET MODELS CONTROLLER
			$models_controller = Controllers::getController("modelAction");
			CONTRACT::assertNotNull($context.".models_controller", $models_controller);
			
			// MODEL
			$model = $models_controller->getModelByTableField($foreign_db, $foreign_table, $foreign_key, $foreign_column);
			if ($model)
			{
				// LATER INIT OF MODELS DEPENDANCES
				$models_depds[] = $model;
				
				$field_foreign_model_name	= $model->getName();
				$field_foreign_key_name		= $model->getFieldsSet()->getFieldNameByAttribute(SQLField::$ATTRIBUTE_SQL_COLUMN, $foreign_key);
				$field_foreign_column_name	= $model->getFieldsSet()->getFieldNameByAttribute(SQLField::$ATTRIBUTE_SQL_COLUMN, $foreign_column);
			}
		}
		
		
		// CURRENT FIELD IS PART OF A JOIN AND IS NOT A PRIMARY KEY
		if ( ! $arg_field->isPrimaryKey() && $current_field_is_sql && $arg_model->hasJoins() )
		{
			TRACE::step($context, "hasJoins", self::$TRACE_JS_WRAPPER);
			
			if ( $arg_field->hasJoinEditorField() )
			{
				$field_join_fields[] = $arg_field->getJoinEditorField();
			}
		}
		
		
		// GET FIELDS DECLARATION
		$field_declaration							= array();
		$field_declaration["name"]					= $field_name;
		$field_declaration["model_name"]			= $arg_model->getName();
		$field_declaration["source"]				= "model";
		$field_declaration["value_type"]			= $field_type;
		$field_declaration["value_default"]			= $field_default;
		$field_declaration["value_format"]			= $field_format;
		$field_declaration["label"]					= $field_label;
		$field_declaration["is_visible"]			= $field_visible;
		$field_declaration["is_editable"]			= $field_editable;
		$field_declaration["is_pk"]					= $field_pk;
		$field_declaration["is_crud"]				= $field_crud;
		$field_declaration["foreign_model"]			= $field_foreign_model_name;
		$field_declaration["foreign_key_field"]		= $field_foreign_key_name;
		$field_declaration["foreign_value_field"]	= $field_foreign_column_name;
		$field_declaration["join_editor_fields"]	= $field_join_fields;
		
		// LEAVE
		return TRACE::leaveok($context, "", $field_declaration, self::$TRACE_JS_WRAPPER);
	}
	
	
	
	/**
	 * @brief		Get view ressource declaration array
	 * @param[in]	arg_view		view instance (object)
	 * @return		array
	 */
	static public function getViewDeclarationsArray($arg_view)
	{
		$context = "JSWRAPPER::getViewDeclarationsArray";
		
		// JS VIEW EXAMPLE
		/*
			{
			var model   = LibaptModels.get('MODEL_AUTH_ROLES');
			var fields  = ['id_role','role','description'];
			var filters = null;
			var orders  = [new LibaptOrder(model.fields_set.get_field('role'), 'ASC')];
			var groups  = null;
			var slice   = null;
			var jqo     = null;
			var options = {
				
				label:'',
				tooltip:'',
				
				is_resizable:false,
				is_visible:true,
				is_editable:true,
				is_portlet:false,
				
				has_hscrollbar:false,
				has_vscrollbar:false,
				
				html_id:"VIEW_AUTH_ROLES_table_id",
				
				css_styles:null,
				css_classes:null,
				
				js_on_ready:"LibaptViews.get('VIEW_AUTH_ROLES').select_part('row', 0);",
				js_on_change:null,
				js_on_refresh:null,
				
				'model':model,
				query_fields:fields,
				query_filters:filters,
				query_orders:orders,
				query_groups:groups,
				query_slice:slice,
				
				js_on_read:null,
				js_on_create:null,
				js_on_update:null,
				js_on_delete:null
				};
			Libapt.use('views-all');
			Libapt.use('views-grid-all');
			Libapt.use('apps-all');
			var model_view = new LibaptTable('VIEW_AUTH_ROLES',jqo,options);
		}
		*/
		
		// CHECK ARGUMENT
		CONTRACT::assertInherit($context, $arg_view, "AbstractView");
		
		// ENTER
		$view_name = $arg_view->getName();
		$context = $context."($view_name)";
		TRACE::enter($context, "", self::$TRACE_JS_WRAPPER);
		
		
		// DECLARE VIEW WRAPPERS
		$view_declaration	= array();
		
		
		// APPEND BASE VIEW OPTIONS
		TRACE::step($context, "base view options", self::$TRACE_JS_WRAPPER);
		
		$view_declaration["class_name"]		= $arg_view->getJsViewClass();
		if ( $view_declaration["class_name"] == "TableModelView" )
		{
			$view_declaration["class_name"]	= "LibaptTable";
		}
		if ( $view_declaration["class_name"] == "SelectorModelView" )
		{
			$view_declaration["class_name"]	= "LibaptSelector";
		}
		
		$view_declaration["name"]			= $view_name;
		$view_declaration["label"]			= $arg_view->getOption(AbstractModelViewImpl::$OPTION_LABEL);
		$view_declaration["tooltip"]		= $arg_view->getOption(AbstractModelViewImpl::$OPTION_TOOLTIP);
		$view_declaration["links"]			= $arg_view->getOption(AbstractModelViewImpl::$OPTION_LINKS);
		
		$view_declaration["is_resizable"]	= $arg_view->getBooleanOption(AbstractModelViewImpl::$OPTION_IS_RESIZABLE);
		$view_declaration["is_visible"]		= $arg_view->getBooleanOption(AbstractModelViewImpl::$OPTION_IS_VISIBLE);
		$view_declaration["is_editable"]	= $arg_view->getBooleanOption(AbstractModelViewImpl::$OPTION_IS_EDITABLE);
		$view_declaration["is_portlet"]		= $arg_view->getBooleanOption(AbstractModelViewImpl::$OPTION_IS_PORTLET);
		
		$view_declaration["has_hscrollbar"]	= $arg_view->getBooleanOption(AbstractModelViewImpl::$OPTION_HAS_HSCROLLBAR);
		$view_declaration["has_vscrollbar"]	= $arg_view->getBooleanOption(AbstractModelViewImpl::$OPTION_HAS_VSCROLLBAR);
		
		$view_declaration["html_id"]		= $arg_view->getHtmlId();
		
		$view_declaration["css_styles"]		= $arg_view->getOption(AbstractModelViewImpl::$OPTION_CSS_STYLES);
		$view_declaration["css_classes"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_CSS_CLASSES);
		
		$view_declaration["js_on_ready"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_READY);
		$view_declaration["js_on_change"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_CHANGE);
		$view_declaration["js_on_refresh"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_REFRESH);
		
		
		// APPEND TEMPLATE VIEW OPTIONS
		TRACE::step($context, "template view options", self::$TRACE_JS_WRAPPER);
		
		$view_declaration["template_enabled"]		= $arg_view->getOption(AbstractTemplateViewImpl::$OPTION_TEMPLATE_ENABLED);
		$view_declaration["template_string"]		= $arg_view->getOption(AbstractTemplateViewImpl::$OPTION_TEMPLATE_STRING);
		// $view_declaration["template_enabled"]	= $arg_view->getOption(AbstractTemplateViewImpl::$OPTION_TEMPLATE_FILE_NAME);
		$view_declaration["template_bindings"]		= $arg_view->getOption(AbstractTemplateViewImpl::$OPTION_TEMPLATE_BINDINGS);
		$view_declaration["template_tags"]			= $arg_view->getOption(AbstractTemplateViewImpl::$OPTION_TEMPLATE_TAGS);
		
		
		// APPEND MODEL VIEW OPTIONS
		if ( $arg_view->hasRegisteredOption("model_name") )
		{
			TRACE::step($context, "model view options", self::$TRACE_JS_WRAPPER);
			
			$view_declaration["js_on_read"]		= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_READ);
			$view_declaration["js_on_create"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_CREATE);
			$view_declaration["js_on_update"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_UPDATE);
			$view_declaration["js_on_delete"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_JS_ON_DELETE);
			
			$view_declaration["model"]			= $arg_view->getOption(AbstractModelViewImpl::$OPTION_MODEL_NAME);
			$view_declaration["query_fields"]	= $arg_view->getNonEmptyStringsArrayOption(AbstractModelViewImpl::$OPTION_FIELDS, ",");
			$view_declaration["query_filters"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_FILTERS);
			$view_declaration["query_orders"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_ORDERS);
			$view_declaration["query_groups"]	= $arg_view->getOption(AbstractModelViewImpl::$OPTION_GROUPS);
			$view_declaration["query_slice"]	= array(	"offset" => $arg_view->getOption(AbstractModelViewImpl::$OPTION_SLICE_OFFSET),
															"length" => $arg_view->getOption(AbstractModelViewImpl::$OPTION_SLICE_LENGTH) );
		}
		
		
		// APPEND ALL OTHERS OPTIONS
		$options = $arg_view->getRuntimeOptions();
		foreach($options as $option_key=>$option_value)
		{
			if ( ! array_key_exists($option_key, $view_declaration) )
			{
				$view_declaration[$option_key]	= $option_value;
			}
		}
		
		// REMOVE RENAMED OPTIONS
		unset( $view_declaration[AbstractModelViewImpl::$OPTION_IS_RESIZABLE] );
		unset( $view_declaration[AbstractModelViewImpl::$OPTION_IS_VISIBLE] );
		unset( $view_declaration[AbstractModelViewImpl::$OPTION_IS_EDITABLE] );
		unset( $view_declaration[AbstractModelViewImpl::$OPTION_IS_PORTLET] );
		unset( $view_declaration[AbstractModelViewImpl::$OPTION_HAS_HSCROLLBAR] );
		unset( $view_declaration[AbstractModelViewImpl::$OPTION_HAS_VSCROLLBAR] );
		unset( $view_declaration["links"] );
		unset( $view_declaration["model"] );
		unset( $view_declaration["model_fields"] );
		unset( $view_declaration["model_filters"] );
		unset( $view_declaration["model_groups"] );
		unset( $view_declaration["model_orders"] );
		unset( $view_declaration["model_slice"] );
		unset( $view_declaration["model_slice_offset"] );
		unset( $view_declaration["model_slice_length"] );
		
		// RENAME OPTIONS
		$view_declaration = self::renameKey($view_declaration, "selector_has_all_item", "has_all_item");
		$view_declaration = self::renameKey($view_declaration, "selector_all_item_label", "all_item_label");
		$view_declaration = self::renameKey($view_declaration, "hidden_columns", "hidden_fields");
		// self::renameKey($view_declaration, "", "");
		
		// LEAVE
		return TRACE::leaveok($context, "", $view_declaration, self::$TRACE_JS_WRAPPER);
	}
	
	
	
	/**
	 * @brief		Declare a server side model to be used by the client JS side.
	 * @param[in]	arg_model		model (objetc)
	 * @return		nothing
	 */
	static public function getJSStringsArray($arg_strings)
	{
		$context = "JSWRAPPER::getJSStringsArray(strings)";
		TRACE::enter($context, "", self::$TRACE_JS_WRAPPER);
		
		$js_array = "[";
		foreach($arg_strings as $str)
		{
			$js_array .= ($js_array == "[" ? "" : ",")."'$str'";
		}
		$js_array .= "]";
		
		return TRACE::leaveok($context, "", $js_array, self::$TRACE_JS_WRAPPER);
	}
	
	
	static public function renameKey($arg_options, $arg_key_1, $arg_key_2)
	{
		if ( array_key_exists($arg_key_1, $arg_options) )
		{
			$arg_options[$arg_key_2] = $arg_options[$arg_key_1];
			unset( $arg_options[$arg_key_1] );
		}
		
		return $arg_options;
	}
}
?>