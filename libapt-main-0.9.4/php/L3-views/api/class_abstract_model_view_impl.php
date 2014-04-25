<?php
/**
 * @file        class_abstract_model_view_impl.php
 * @brief       Base class for all model views implementation
 * @details     Provides model options and helpers
 * @see			AbstractModelView AbstractControlledImpl Trace Type
 * @ingroup     L3_VIEWS
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * Properties (from url, from post, from csv resources, from session)
 *		model_name			string	default null
 *		model_filters		string	default null
 *		model_orders		string	default null
 *		model_groups		string	default null
 *		model_slice_offset	integer	default null
 *		model_slice_length	integer	default null
 */

abstract class AbstractModelViewImpl extends AbstractModelView
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_MODEL_VIEW		= false;
	
	
	/// @brief		Option : model name (string)
	static public $OPTION_MODEL_NAME	= "model_name";
	
	/// @brief		Option : model action (string)
	static public $OPTION_ACTION		= "model_action";
	
	/// @brief		Option : one model field name (string)
	static public $OPTION_ONE_FIELD		= "model_one_field";
	
	/// @brief		Option : model fields (string)
	static public $OPTION_FIELDS		= "model_fields";
	
	/// @brief		Option : model filters (string)
	static public $OPTION_FILTERS		= "model_filters";
	
	/// @brief		Option : model orders (string)
	static public $OPTION_ORDERS		= "model_orders";
	
	/// @brief		Option : model groups (string)
	static public $OPTION_GROUPS		= "model_groups";
	
	/// @brief		Option : model slice offset (string)
	static public $OPTION_SLICE_OFFSET	= "model_slice_offset";
	
	/// @brief		Option : model slice length (string)
	static public $OPTION_SLICE_LENGTH	= "model_slice_length";
	
	
	/// @brief		Option : View JavaScript event handler : on read, default = null (string)
	static public $OPTION_JS_ON_READ	= "model_js_on_read";
	
	/// @brief		Option : View JavaScript event handler : on create, default = null (string)
	static public $OPTION_JS_ON_CREATE	= "model_js_on_create";
	
	/// @brief		Option : View JavaScript event handler : on update, default = null (string)
	static public $OPTION_JS_ON_UPDATE	= "model_js_on_update";
	
	/// @brief		Option : View JavaScript event handler : on delete, default = null (string)
	static public $OPTION_JS_ON_DELETE	= "model_js_on_delete";
	
	/// @brief		Option : View JavaScript configuration : use crud operations on the client side (string)
	static public $OPTION_JS_USE_CRUD	= "model_js_use_crud";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief	Logged user authorization on the model for read operations (boolean)
	protected $auth_can_read   = false;
	
	/// @brief	Logged user authorization on the model for create operations (boolean)
	protected $auth_can_create = false;
	
	/// @brief	Logged user authorization on the model for update operations (boolean)
	protected $auth_can_update = false;
	
	/// @brief	Logged user authorization on the model for delete operations (boolean)
	protected $auth_can_delete = false;
	
	
	/// @brief	model which provides datas for the view (object)
	protected $model = null;
	
	/// @brief	filters chain to select datas model for the view (object)
	protected $filters_chain = null;
	
	/// @brief	orders to select datas model for the view (object)
	protected $orders = null;
	
	/// @brief	groups by to select datas model for the view (object)
	protected $groups = null;
	
	/// @brief	slice offset to select datas model for the view (object)
	protected $slice_offset = null;
	
	/// @brief	slice length to select datas model for the view (object)
	protected $slice_length = null;
	
	
	/// @brief	view configuration : hidden fields list (array of strings)
	/// @todo move hidden_columns in other class ?
	protected $hidden_columns		= null;
	
	/// @brief	view configuration : fields css width list (array of strings)
	/// @todo move columns_width in other class ?
	protected $columns_width		= null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name			unique name for view
	 * @param[in]	arg_parent_view			parent view object or null
	 * @param[in]	arg_options				options array or null
	 * @return		nothing
	 */
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		$context = get_class($this).".AbstractModelViewImpl.constructor";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		// $this->js_view_class	= "LibaptModelView";
		
		// DECLARE OPTIONS
		$default_slice_offset = 0;
		$default_slice_length = 1000;
		
		$this->registerOption(self::$OPTION_MODEL_NAME,		Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_ACTION,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_FIELDS,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_FILTERS,		Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_ORDERS,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_GROUPS,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_SLICE_OFFSET,	Type::$TYPE_INTEGER,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, $default_slice_offset);
		$this->registerOption(self::$OPTION_SLICE_LENGTH,	Type::$TYPE_INTEGER,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, $default_slice_length);
		
		$this->registerOption(self::$OPTION_JS_ON_READ,		Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_JS_ON_CREATE,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_JS_ON_UPDATE,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_JS_ON_DELETE,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_JS_USE_CRUD,	Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		
		TRACE::leaveok($context, "", null, self::$TRACE_MODEL_VIEW);
	}
	
	
	
	// ----------------- VIEW INIT -----------------
	/**
	 * @brief		Init view : init and check attributes values
	 * @return		boolean		true:success, false:failure
	 */
	protected function initSelf()
	{
		$context = get_class($this).".AbstractModelViewImpl.initSelf";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		// PARENT CLASS INIT
		CONTRACT::assertTrue($context.".parent.initSelf", parent::initSelf());
		
		// MODEL VIEW INIT
		CONTRACT::assertTrue($context.".initModel", $this->initModel() );
		CONTRACT::assertTrue($context.".initAuthorizations", $this->initAuthorizations() );
		CONTRACT::assertTrue($context.".initFiltersChain", $this->initFiltersChain() );
		CONTRACT::assertTrue($context.".initOrders", $this->initOrders() );
		CONTRACT::assertTrue($context.".initGroups", $this->initGroups() );
		CONTRACT::assertTrue($context.".initSlice", $this->initSlice() );
		
		
		
		// CLIENT SIDE CRUD OPERATIONS WRAPPERS
		$js_use_crud = $this->getBooleanOption(self::$OPTION_JS_USE_CRUD, true);
		if ($js_use_crud)
		{
			JSWRAPPER::addModelToLoad( $this->getModel() );
			JSWRAPPER::addViewToLoad($this);
		}
		
		
		
		return TRACE::leaveok($context, "", true, self::$TRACE_MODEL_VIEW);
	}
	
	
	// AUTHORIZATIONS
	protected function initAuthorizations()
	{
		$context = get_class($this).".AbstractModelViewImpl.initAuthorizations";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		$this->auth_can_read   = Authorization::checkLogged($this->getModel()->getName(), ModelsController::$READ_ACCESS);
		$this->auth_can_create = Authorization::checkLogged($this->getModel()->getName(), ModelsController::$CREATE_ACCESS);
		$this->auth_can_update = Authorization::checkLogged($this->getModel()->getName(), ModelsController::$UPDATE_ACCESS);
		$this->auth_can_delete = Authorization::checkLogged($this->getModel()->getName(), ModelsController::$DELETE_ACCESS);
		
		// SET LOGGED USER AUTHORIZATIONS
		$has_edit_auth = ($this->auth_can_create || $this->auth_can_update || $this->auth_can_delete);
		if ( ! $has_edit_auth && $this->isEditable() )
		{
			$this->setIsEditable(false);
		}
		// $this->setIsEditable( $this->auth_can_create || $this->auth_can_update || $this->auth_can_delete );
		
		return TRACE::leaveok($context, "", true, self::$TRACE_MODEL_VIEW);
	}
	
	public function canRead()
	{
		if ($this->need_init)
		{
			$this->init();
		}
		return $this->auth_can_read;
	}
	
	public function canCreate()
	{
		if ($this->need_init)
		{
			$this->init();
		}
		return $this->auth_can_create;
	}
	
	public function canUpdate()
	{
		if ($this->need_init)
		{
			$this->init();
		}
		return $this->auth_can_update;
	}
	
	public function canDelete()
	{
		if ($this->need_init)
		{
			$this->init();
		}
		return $this->auth_can_delete;
	}
	
	
	// MODEL
	protected function initModel()
	{
		$context = get_class($this).".AbstractModelViewImpl.initModel";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		// GET MODEL NAME
		$model_name  = $this->getOption(self::$OPTION_MODEL_NAME);
		CONTRACT::assertNotEmptyString($context.".model_name", $model_name);
		TRACE::trace_var($context, "model_name", $model_name, self::$TRACE_MODEL_VIEW);
		
		// GET MODEL
		$this->model = Controllers::getController("modelAction")->getObject($model_name);
		CONTRACT::assertNotNull($context.".model", $this->model);
		TRACE::trace_var($context, "model", $this->model, self::$TRACE_MODEL_VIEW);
		
		$result = ! is_null($this->model);
		return TRACE::leave($context, $result, "init model failed", true, self::$TRACE_MODEL_VIEW);
	}
	
	public function getModel()
	{
		$context = "AbstractModelViewImpl.getModel";
		TRACE::step($context, "", self::$TRACE_MODEL_VIEW);
		TRACE::trace_var($context, "model", $this->model, self::$TRACE_MODEL_VIEW);
		CONTRACT::assertNotNull($context.".model", $this->model);
		return $this->model;
	}
	
	public function setModel($arg_model)
	{
		$this->model = $arg_model;
	}
	
	
	// FILTERS CHAIN
	protected function initFiltersChain()
	{
		$context = get_class($this).".AbstractModelViewImpl.initFiltersChain";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		// GET FILTERS OPTION
		$filters_str1			= $this->getOption(self::$OPTION_FILTERS);
		TRACE::trace_var($context, "filters_str1", $filters_str1, self::$TRACE_MODEL_VIEW);
		
		// HTML DECODE STRING
		$filters_str2			= html_entity_decode($filters_str1, ENT_QUOTES);
//		$filters_str2			= htmlspecialchars_decode($filters_str1, ENT_QUOTES);
		TRACE::trace_var($context, "filters_str2", $filters_str2, self::$TRACE_MODEL_VIEW);
		
		// REMOVE QUOTES
		$filters_str			= trim($filters_str2, '"\' ');
		TRACE::trace_var($context, "filters_str", $filters_str, self::$TRACE_MODEL_VIEW);
		
		$no_filter_str			= ($filters_str1 == "&#39;&#39;") || is_null($filters_str) || ($filters_str == "") || ($filters_str == "''") || ($filters_str == "\"\"") || ($filters_str == "\'\'");
		TRACE::trace_var($context, "no_filter_str", $no_filter_str ? "1" : "0", self::$TRACE_MODEL_VIEW);
		
		$filters_object			= $no_filter_str ? null : Filter::buildFiltersFromString($filters_str);
		TRACE::trace_var($context, "filters_object count", is_null($filters_object) ? 0 : count($filters_object), self::$TRACE_MODEL_VIEW);
		
		$this->filters_chain	= new FiltersChain($this->getName()."_filters_chain", true);
		$this->filters_chain->setFilters($filters_object);
		
		return TRACE::leaveok($context, "", true, self::$TRACE_MODEL_VIEW);
	}
	
	public function hasFiltersChain()
	{
		return ! is_null( $this->filters_chain );
	}
	
	public function hasFilters()
	{
		return $this->hasFiltersChain() && $this->getFiltersChain()->hasFilters();
	}
	
	public function getFilters()
	{
		return $this->hasFiltersChain() ? $this->getFiltersChain()->getFilters() : null;
	}
	
	public function getFiltersChain()
	{
		return $this->filters_chain;
	}
	
	public function setFiltersChain($arg_filters_chain)
	{
		$this->filters_chain = $arg_filters_chain;
	}
	
	
	// ORDERS
	protected function initOrders()
	{
		$context = get_class($this).".AbstractModelViewImpl.initOrders";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		$orders_str1	= $this->getOption(self::$OPTION_ORDERS);
		$orders_str2	= html_entity_decode($orders_str1, ENT_QUOTES);
		$orders_str		= trim($orders_str2, '"\' ');
		
		$orders_object	= (is_null($orders_str) || $orders_str  == "") ? null : Order::buildOrdersFromString($orders_str);
		$this->setOrders($orders_object);
		
		$result = (
				(is_null($orders_str) || $orders_str == "") && is_null($this->orders)
			) || (
				(! is_null($orders_str) ) && $orders_str != "" && ! is_null($this->orders)
			);
		return TRACE::leave($context, $result, "init orders failed", true, self::$TRACE_MODEL_VIEW);
	}
	
	public function hasOrders()
	{
		return ! is_null($this->orders);
	}
	
	public function getOrders()
	{
		$context = "AbstractModelViewImpl.getOrders";
		CONTRACT::assertNotNull($context.".orders", $this->orders);
		return $this->orders;
	}
	
	public function setOrders($arg_orders)
	{
		if ( ! is_null($arg_orders) )
		{
			$this->orders = array();
			foreach($arg_orders as $order)
			{
				$this->addOrder($order);
			}
		}
	}
	
	public function &getOrderAt($arg_index)
	{
		if ( ! is_null($this->orders) && count($this->orders) > $arg_index )
		{
			return $this->orders[$arg_index];
		}
		return null;
	}
	
	public function setOrderAt($arg_index, $arg_order)
	{
		if ( ! is_null($this->orders) && count($this->orders) > $arg_index )
		{
			$this->orders[$arg_index] = $arg_order;
			$key = $arg_index + 1;
//			$this->setSessionProperty("order_".$key, serialize($arg_order));
//			$this->setSessionProperty("orders_count", count($this->orders));
		}
	}
	
	public function removeOrderAt($arg_index)
	{
		if ( ! is_null($this->orders) && count($this->orders) > $arg_index )
		{
			unset($this->orders[$arg_index]);
			$key = $arg_index + 1;
//			$this->resetSessionProperty("order_".$key);
//			$this->setSessionProperty("orders_count", count($this->orders));
		}
	}
	
	public function addOrder($arg_order)
	{
		if ( is_null($this->orders) )
		{
			$this->orders = array();
		}
		$this->orders[] = $arg_order;
		$key = count($this->orders);
//		$this->setSessionProperty("order_".$key, serialize($arg_order));
//		$this->setSessionProperty("orders_count", count($this->orders));
	}
	
	
	// GROUPS
	protected function initGroups()
	{
		$context = get_class($this).".AbstractModelViewImpl.initGroups";
		TRACE::enter($context, "", self::$TRACE_MODEL_VIEW);
		
		$groups_str1	= $this->getOption(self::$OPTION_GROUPS);
		$groups_str		= html_entity_decode($groups_str1, ENT_QUOTES);
		
		$groups_object	= (is_null($groups_str) || $groups_str  == "") ? null : Group::buildGroupsFromString($groups_str);
		$this->setGroups($groups_object);
		
		$result = (
				(is_null($groups_str) || $groups_str == "") && is_null($this->groups)
			) || (
				(! is_null($groups_str) ) && $groups_str != "" && ! is_null($this->groups)
			);
		return TRACE::leave($context, $result, "init groups failed", true, self::$TRACE_MODEL_VIEW);
	}
	
	public function hasGroups()
	{
		return ! is_null($this->groups);
	}
	
	public function getGroups()
	{
		$context = "AbstractModelViewImpl.getGroups";
		CONTRACT::assertNotNull($context.".groups", $this->groups);
		return $this->groups;
	}
	
	public function setGroups($arg_groups)
	{
		if ( ! is_null($arg_groups) )
		{
			$this->groups = array();
			foreach($arg_groups as $group)
			{
				$this->addGroup($group);
			}
		}
	}
	
	public function &getGroupAt($arg_index)
	{
		if ( ! is_null($this->groups) && count($this->groups) > $arg_index )
		{
			return $this->groups[$arg_index];
		}
		return null;
	}
	
	public function setGroupAt($arg_index, $arg_group)
	{
		if ( ! is_null($this->groups) && count($this->groups) > $arg_index )
		{
			$this->groups[$arg_index] = $arg_group;
			$key = $arg_index + 1;
		}
	}
	
	public function removeGroupAt($arg_index)
	{
		if ( ! is_null($this->groups) && count($this->groups) > $arg_index )
		{
			unset($this->groups[$arg_index]);
			$key = $arg_index + 1;
		}
	}
	
	public function addGroup($arg_group)
	{
		if ( is_null($this->groups) )
		{
			$this->groups = array();
		}
		$this->groups[] = $arg_group;
		$key = count($this->groups);
	}
	
	
	// SLICES
	protected function initSlice()
	{
		$this->slice_offset		= $this->getOption(self::$OPTION_SLICE_OFFSET);
		$this->slice_length		= $this->getOption(self::$OPTION_SLICE_LENGTH);
		
		return true;
	}
	
	public function hasSlice()
	{
		return ! is_null($this->slice_offset) && ! is_null($this->slice_length);
	}
	
	public function getSlice()
	{
		$context = "AbstractModelViewImpl.getSlice";
		CONTRACT::assertNotNull($context.".slice_offset", $this->slice_offset);
		CONTRACT::assertNotNull($context.".slice_length", $this->slice_length);
		return array(
			self::$OPTION_SLICE_OFFSET => $this->slice_offset,
			self::$OPTION_SLICE_LENGTH => $this->slice_length
		);
	}
	
	public function getSliceOffset()
	{
		$context = "AbstractModelViewImpl.getSliceOffset";
		CONTRACT::assertNotNull($context.".slice_offset", $this->slice_offset);
		return $this->slice_offset;
	}
	
	public function getSliceLength()
	{
		$context = "AbstractModelViewImpl.getSliceLength";
		CONTRACT::assertNotNull($context.".slice_length", $this->slice_length);
		return $this->slice_length;
	}
	
	public function setSlice($arg_offset, $arg_length)
	{
		$this->setSliceOffset($arg_offset);
		$this->setSliceLength($arg_length);
	}
	
	public function setSliceOffset($arg_offset)
	{
		$this->slice_offset = $arg_offset;
		$this->setOption(self::$OPTION_SLICE_OFFSET, $arg_offset);
	}
	
	public function setSliceLength($arg_length)
	{
		$this->slice_length = $arg_length;
		$this->setOption(self::$OPTION_SLICE_LENGTH, $arg_length);
	}
	
	public function getDisplayedFieldsNames()
	{
		$model_fields = $this->getModel()->getFieldsSet()->getFieldsNames();
		if ( $this->hasOption(self::$OPTION_FIELDS) )
		{
			$model_fields = $this->getStringsArrayOption(self::$OPTION_FIELDS, ",");
		}
		
		if ( is_null($this->hidden_columns) )
		{
			return $model_fields;
		}
		
		$view_fields = array();
		foreach($model_fields as $field_name)
		{
			if ( ! in_array($field_name, $this->hidden_columns) )
			{
				$view_fields[] = $field_name;
			}
		}
		
		return $view_fields;
	}
	
	public function getHiddenColumns()
	{
		return $this->hidden_columns;
	}
	
	// public function getHtmlId()
	// {
		// return $this->option_html_id;
	// }
	
	// public function getOptionLinks()
	// {
		// return $this->option_links;
	// }
}
?>