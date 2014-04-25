<?php
/**
 * @file        class_abtsract_table_model_view.php
 * @brief       Abstract Table view to display model rows
 * @details     Common HTML TABLE features to create/display/update/delete the given model fields values
 * @see			AbstractModelView Trace Type FieldsFormView
 * @ingroup     L3_VIEWS
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractTableModelView extends AbstractModelViewImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_TABLE = false;
	
	
	/// @brief		Option : Widths of table columns (string of coma separated css widths)
	static public $OPTION_COLUMNS_WIDTH				= "table_columns_widths";
	
	/// @brief		Option : Hidden columns names list (string of coma separated strings)
	static public $OPTION_HIDDEN_COLUMNS			= "table_hidden_columns";
	
	/// @brief		Option : Display actions column, default = false (boolean)
	static public $OPTION_ACTIONS_COLUMN_DISPLAY	= "table_actions_column_display";
	
	/// @brief		Option : Actions column index, default = 0 (integer)
	static public $OPTION_ACTIONS_COLUMN_INDEX		= "table_actions_column_index";
	
	
	/// @brief		Option : Headers row index, default = 0 (integer)
	static public $OPTION_HEADERS_ROW_INDEX			= "table_headers_row_index";
	
	/// @brief		Option : Headers has titlebar, default = true (boolean)
	static public $OPTION_HEADERS_HAS_TITLEBAR		= "table_headers_has_titlebar";	
	
	/// @brief		Option : Headers has toolbar, default = true (boolean)
	static public $OPTION_HEADERS_HAS_TOOLBAR		= "table_headers_has_toolbar";
	
	/// @brief		Option : Headers has columns headers, default = true (boolean)
	static public $OPTION_HEADERS_HAS_COLUMNS		= "table_headers_has_columns";
	
	
	/// @brief		Option : Has action reload, default = true (boolean)
	static public $OPTION_CAN_RELOAD				= "table_has_action_reload";
	
	/// @brief		Option : Has action create, default = true (boolean)
	static public $OPTION_CAN_CREATE				= "table_has_action_create";
	
	/// @brief		Option : Has action delete, default = true (boolean)
	static public $OPTION_CAN_DELETE				= "table_has_action_delete";
	
	/// @brief		Option : Has action update, default = true (boolean)
	static public $OPTION_CAN_UPDATE				= "table_has_action_update";
	
	/// @brief		Option : Has action export, default = true (boolean)
	static public $OPTION_CAN_EXPORT				= "table_has_action_export";
	
	/// @brief		Option : Fill on load, default = true (boolean)
	static public $OPTION_FILL_ON_LOAD				= "table_fill_on_load";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	/// @brief		Table format : list of columns names (field name) to hide (array of strings)
	protected $table_hidden_columns			= null;
	
	/// @brief		Table format : list of columns width (value as a css entry) (array of strings)
	protected $table_columns_widths			= null;
	
	/// @brief		Table format : table has the actions column (displaying create, update, delete buttons) (boolean)
	protected $table_has_action_column		= true;
	
	/// @brief		Table format : table actions column index (integer)
	protected $table_action_column_index	= 0;
	
	/// @brief		Table format : table has the title bar (boolean)
	protected $table_headers_has_titlebar	= true;
	
	/// @brief		Table format : table has the toolbar (boolean)
	protected $table_headers_has_toolbar	= true;
	
	/// @brief		Table format : table has the columns headers (boolean)
	protected $table_headers_has_columns	= true;
	
	/// @brief		Table format : table headers row index (integer)
	protected $table_headers_row_index		= 0;
	
	
	/// @brief		Table pages : first page index, default = 0 (integer)
	protected $table_pager_first			= 0;
	
	/// @brief		Table pages : last page index, default = 0 (integer)
	protected $table_pager_last				= 0;
	
	/// @brief		Table pages : current page index, default = 0 (integer)
	protected $table_pager_current			= 0;
	
	/// @brief		Table pages : page size, default = 10 (integer)
	protected $table_pager_size				= 10;
	
	/// @brief		Table pages : page action count default = 10 (integer)
	protected $table_pager_display_count	= 10;
	
	
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
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		// DECLARE JS CLASS
		$this->js_view_class = "LibaptTable";
		
		// DECLARE OPTIONS
		$this->registerOption(self::$OPTION_COLUMNS_WIDTH,				Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_HIDDEN_COLUMNS,				Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
		
		$this->registerOption(self::$OPTION_ACTIONS_COLUMN_DISPLAY,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_ACTIONS_COLUMN_INDEX,		Type::$TYPE_INTEGER,	self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, 0);
		
		$this->registerOption(self::$OPTION_HEADERS_ROW_INDEX,			Type::$TYPE_INTEGER,	self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, 0);
		$this->registerOption(self::$OPTION_HEADERS_HAS_TITLEBAR,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_HEADERS_HAS_TOOLBAR,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_HEADERS_HAS_COLUMNS,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, true);
		
		$this->registerOption(self::$OPTION_CAN_RELOAD,					Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_CAN_CREATE,					Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_CAN_DELETE,					Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_CAN_UPDATE,					Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_CAN_EXPORT,					Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		
		$this->registerOption(self::$OPTION_FILL_ON_LOAD,				Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		
		// $this->registerOption(ToolbarView::$OPTION_TOOLBAR_TEMPLATE,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, null);
	}
	
	
	
	// ----------------- CLASS INSTANCE INIT -----------------
	/**
	 * @brief		Initialization
	 * @return		nothing
	 */
	protected function initSelf()
	{
		$context = "TableModelView.initSelf";
		TRACE::enter($context, "", self::$TRACE_TABLE);
		
		// INIT HTML ID
		$this->setOption(self::$OPTION_HTML_ID, $this->getName()."_table_id");
		
		// MODEL VIEW INIT
		CONTRACT::assertTrue($context."parent::initSelf", parent::initSelf() );
		
		
		// INIT OPTION : COLUMNS WIDTHS
		$table_columns_width_str = $this->getOption(self::$OPTION_COLUMNS_WIDTH);
		if ( ! is_null($table_columns_width_str) )
		{
			$table_columns_width_array = explode(",", $table_columns_width_str);
			foreach($table_columns_width_array as $str)
			{
				$width_array = explode("=", $str);
				if ( count($width_array) == 2 )
				{
					$column_field_name	= $width_array[0];
					$column_width		= $width_array[1];
					$this->table_columns_widths[$column_field_name] = $column_width;
				}
			}
		}
		
		
		// INIT OPTION : HIDDEN COLUMNS
		if ($this->hasOption(self::$OPTION_HIDDEN_COLUMNS))
		{
			$option_str = $this->getOption(self::$OPTION_HIDDEN_COLUMNS);
			$this->table_hidden_columns = is_null($option_str) ? null : explode(",", $option_str);
		}
		
		
		// INIT OPTION : COMMAND DISPLAY
		// $this->table_has_action_column		= $this->getOption(self::$OPTION_ACTIONS_COLUMN_DISPLAY);
		// $this->table_action_column_index	= $this->getOption(self::$OPTION_ACTIONS_COLUMN_INDEX);
		
		// INIT OPTION : HEADERS ROW INDEX
		// $this->table_headers_row_index		= $this->getOption(self::$OPTION_HEADERS_ROW_INDEX);
		
		// INIT OPTION : HEADERS HAS TITLEBAR
		$this->table_headers_has_titlebar	= $this->getBooleanOption(self::$OPTION_HEADERS_HAS_TITLEBAR);
		if ($this->table_headers_has_titlebar && $this->table_headers_row_index == 0)
		{
			$this->table_headers_row_index = 1;
		}
		
		// INIT OPTION : HEADERS HAS TOOLBAR
		$this->table_headers_has_toolbar	= $this->getBooleanOption(self::$OPTION_HEADERS_HAS_TOOLBAR);
		
		// INIT OPTION : HEADERS HAS COLUMNS
		$this->table_headers_has_columns	= $this->getBooleanOption(self::$OPTION_HEADERS_HAS_COLUMNS);
		
		
		return TRACE::leaveok($context, "", true, self::$TRACE_TABLE);
	}
	
	
	/**
	 * @brief		Get actions column display attribute
	 * @return		boolean
	 */
	public function getActionsColumnDisplay()
	{
		return $this->table_has_action_column;
	}
	
	
	/**
	 * @brief		Get actions column index attribute
	 * @return		integer
	 */
	public function getActionsColumnIndex()
	{
		return $this->table_action_column_index;
	}
}
?>