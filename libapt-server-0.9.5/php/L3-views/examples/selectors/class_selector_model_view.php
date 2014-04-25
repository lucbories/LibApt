<?php
/**
 * @version		$Id: class_selector_model_view.php 2012-10-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-views/tables
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class SelectorModelView extends AbstractModelViewImpl
{
	// STATIC ATTRIBUTES
		// TRACES
	static public $TRACE_SELECTOR_VIEW = false;
	
		// OPTIONS NAMES
	static public $OPTION_SELECTOR_NAME			= "selector_name";
	static public $OPTION_SELECTOR_ID			= "selector_id";
	static public $OPTION_SELECTOR_LABEL		= "selector_label";
	static public $OPTION_SELECTOR_TABLE		= "selector_table_name";
	static public $OPTION_SELECTOR_FIELD		= "selector_field";
	static public $OPTION_SELECTOR_TYPE			= "selector_type";
	static public $OPTION_SELECTOR_DEFAULT		= "selector_default";
	
	static public $OPTION_SELECTOR_HAS_ALL		= "selector_has_all_item";
	static public $OPTION_SELECTOR_ALL_LABEL	= "selector_all_item_label";
	
	static public $OPTION_SELECTOR_ON_CHANGE	= "selector_js_on_change";
	static public $OPTION_SELECTOR_ON_LOAD		= "selector_js_on_load";
	
	static public $OPTION_SELECTOR_HTML_BEFORE	= "selector_html_before";
	static public $OPTION_SELECTOR_HTML_AFTER	= "selector_html_after";
	static public $OPTION_SELECTOR_LINKS		= "selector_links";
	
		// SELECTOR TYPES
	static public $SELECTOR_TYPE_SELECT			= "select_options";
	static public $SELECTOR_TYPE_DATEPICKER		= "date_picker";
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// DECLARE A JAVASCRIPT VIEW
		$this->is_js_view = true;
		
		// DECLARE JS CLASS
		$this->js_view_class = "LibaptSelector";
		
		// INIT PARENT CLASS
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		// DECLARE OPTIONS
		$default_name = $this->getName();
		$default_id = $this->getName() . "_ID";
		$this->registerOption(self::$OPTION_SELECTOR_NAME,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, $default_name);
		$this->registerOption(self::$OPTION_SELECTOR_ID,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,	self::$OPTION_NOT_STORE_SESSION, $default_id);
		$this->registerOption(self::$OPTION_SELECTOR_LABEL,			Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_SELECTOR_TABLE,			Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_SELECTOR_FIELD,			Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_SELECTOR_TYPE,			Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_SELECTOR_DEFAULT,		Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		
		$this->registerOption(self::$OPTION_SELECTOR_HAS_ALL,		Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_SELECTOR_ALL_LABEL,		Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		
		$this->registerOption(self::$OPTION_SELECTOR_ON_CHANGE,		Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, "");
		$this->registerOption(self::$OPTION_SELECTOR_ON_LOAD,		Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, "");
		
		$this->registerOption(self::$OPTION_SELECTOR_HTML_BEFORE,	Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, "");
		$this->registerOption(self::$OPTION_SELECTOR_HTML_AFTER,	Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, "");
		$this->registerOption(self::$OPTION_SELECTOR_LINKS,			Type::$TYPE_STRING,		self::$OPTION_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
	}
	
	
	// INIT VIEW
	protected function initSelf()
	{
		$context = "SelectorsModelView.initSelf";
		TRACE::enter($context, "", self::$TRACE_SELECTOR_VIEW);
		
		// MODEL VIEW INIT
		$result = parent::initSelf();
		
		return TRACE::leave($context, $result, "init failed", true, self::$TRACE_SELECTOR_VIEW);
	}
	
	
	// RENDER HTML
	public function htmlSelf()
	{
		$context = "SelectorModelView.htmlSelf";
//		TRACE::trace_var($context, "arg_selector_record", $arg_selector_record, self::$TRACE_SELECTOR_VIEW);
		
		// GET SELECTOR ATTRIBUTES
		$selector_name				= $this->getOption(self::$OPTION_SELECTOR_NAME);
		$selector_id				= $this->getOption(self::$OPTION_SELECTOR_ID);
		$selector_field 			= $this->getOption(self::$OPTION_SELECTOR_FIELD);
		$selector_label				= $this->getOption(self::$OPTION_SELECTOR_LABEL);
		$selector_type				= $this->getOption(self::$OPTION_SELECTOR_TYPE);
		$selector_table_name		= $this->getOption(self::$OPTION_SELECTOR_TABLE);
		
		$selector_has_all_item		= $this->getOption(self::$OPTION_SELECTOR_HAS_ALL) ? "true" : "false";
		$selector_all_item_label	= $this->getOption(self::$OPTION_SELECTOR_ALL_LABEL);
		$selector_default			= $this->getOption(self::$OPTION_SELECTOR_DEFAULT);
		
		$selector_on_change			= $this->getOption(self::$OPTION_SELECTOR_ON_CHANGE);
		$selector_on_load			= $this->getOption(self::$OPTION_SELECTOR_ON_LOAD);
		
		$selector_html_before		= $this->getOption(self::$OPTION_SELECTOR_HTML_BEFORE);
		$selector_html_after		= $this->getOption(self::$OPTION_SELECTOR_HTML_AFTER);
		$selector_links				= $this->getOption(self::$OPTION_SELECTOR_LINKS);
		
		
		$js_selector_options = "
				{
					selector_name:'$selector_name',
					selector_id:'$selector_id',
					selector_field:'$selector_field',
					selector_label:'$selector_label',
					selector_type:'$selector_type',
					selector_table_name:'$selector_table_name',
					has_all_item:$selector_has_all_item,
					all_item_label:'$selector_all_item_label',
					selector_default:'$selector_default',
					selector_on_change:'$selector_on_change',
					selector_on_load:'$selector_on_load',
					selector_html_before:'$selector_html_before',
					selector_html_after:'$selector_html_after',
					selector_links:'$selector_links'
				}";
		
		// CREATE INIT JS CODE
		$view_name	= $this->getName();
		$div_id		= $view_name."_container_id";
		HTML::addBufferLine("<div id='$div_id' ></div>");
		$js_code = "
			Libapt.after_resource('".$this->getName()." selector options', function()
				{
					var jqo_container = $('#' + '$div_id');
					var view = LibaptViews.get('$view_name');
					view.set_container(jqo_container);
					var select_options = $js_selector_options;
					view.set_options(select_options);
					view.draw();
				}
			);\n";
				
		// REGISTER JS CODE
		$this->appendOnReadyCode($js_code);
	}
}
?>