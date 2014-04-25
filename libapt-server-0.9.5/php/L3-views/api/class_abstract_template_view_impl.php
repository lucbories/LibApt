<?php
/**
 * @version		$Id: class_abstract_template_view_impl.php 2012-09-09 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-views/api
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
/**
 * Properties (from url, from post, from csv resources, from session)
 *		template_string			string	default null	html code with special tags like {view_1} or {begin_row}
 *		template_file_name		string	default null	html code with special tags like {view_1} or {begin_row}
 *		template_bindings		string	default null	array of key/value pairs (view class_name, name and options)
 */
abstract class AbstractTemplateViewImpl extends AbstractTemplateView
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Options : get template content from a string constant
	static public $OPTION_TEMPLATE_ENABLED		= "template_enabled";
	
	/// @brief		Options : get template content from a string constant
	static public $OPTION_TEMPLATE_STRING		= "template_string";
	
	/// @brief		Options : get template content from a text file
	static public $OPTION_TEMPLATE_FILE_NAME	= "template_file_name";
	
	/// @brief		Options : get template bindings from a string constant
	static public $OPTION_TEMPLATE_BINDINGS		= "template_bindings";
	
	/// @brief		Options : get template tags from a string constant
	static public $OPTION_TEMPLATE_TAGS			= "template_tags";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		template content file name
	private $template_file_name		= null;
	
	/// @brief		template content
	private $template_string		= null;
	
	/// @brief		template bindings : template keyword / view object
	private $template_bindings		= null;
	
	/// @brief		template tags : template keyword / HTML tag
	private $template_tags			= null;
	
	
	
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
		$context = get_class($this).".AbstractTemplateViewImpl.__construct";
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		// INIT ATTRIBUTES
		$this->template_bindings	= array();
		$this->template_tags		= array();
		
		// DECLARE OPTIONS
		$this->registerOption(self::$OPTION_TEMPLATE_ENABLED,	Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_TEMPLATE_STRING,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_TEMPLATE_FILE_NAME,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_TEMPLATE_BINDINGS,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_TEMPLATE_TAGS,		Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED,		self::$OPTION_NOT_STORE_SESSION, null);
		
		TRACE::trace_var($context, "options", $arg_options, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	
	// ----------------- INIT VIEW -----------------
	/**
	 * @brief		Init view
	 * @return		nothing
	 */
	public function init()
	{
		$context = get_class($this).".AbstractTemplateViewImpl.init";
		
		$this->need_init = false;
		
		$result = true;
		$option_value = "";
		
		// TEMPLATE INIT
		$template_enabled = $this->getOption(self::$OPTION_TEMPLATE_ENABLED);
		if ($template_enabled)
		{
			if ( $this->hasOption(self::$OPTION_TEMPLATE_STRING) )
			{
				$option_value = $this->getOption(self::$OPTION_TEMPLATE_STRING);
				if ($option_value != "")
				{
					TRACE::trace_var($context, "OPTION_TEMPLATE_STRING", $option_value, self::$TRACE_TEMPLATE_VIEW);
					$result = $result && $this->setTemplateFromString($option_value);
				}
			}
			
			if ( $this->hasOption(self::$OPTION_TEMPLATE_FILE_NAME) && $option_value == "" )
			{
				$option_value = $this->getOption(self::$OPTION_TEMPLATE_FILE_NAME);
				if ($option_value != "")
				{
					TRACE::trace_var($context, "OPTION_TEMPLATE_FILE_NAME", $option_value, self::$TRACE_TEMPLATE_VIEW);
					$result = $result && $this->setTemplateFromFileName($option_value);
				}
			}
			
			if ( $this->hasOption(self::$OPTION_TEMPLATE_TAGS) )
			{
				$option_value = $this->getOption(self::$OPTION_TEMPLATE_TAGS);
				if ($option_value != "")
				{
					TRACE::trace_var($context, "OPTION_TEMPLATE_TAGS", $option_value, self::$TRACE_TEMPLATE_VIEW);
					$result = $result && $this->setTagsFromString($option_value);
				}
			}
			
			if ( $this->hasOption(self::$OPTION_TEMPLATE_BINDINGS) )
			{
				$option_value = $this->getOption(self::$OPTION_TEMPLATE_BINDINGS);
				if ($option_value != "")
				{
					TRACE::trace_var($context, "OPTION_TEMPLATE_BINDINGS", $option_value, self::$TRACE_TEMPLATE_VIEW);
					$result = $result && $this->setBindingsFromString($option_value);
				}
			}
		}
		
		// INIT BINDING VIEWS
		if ( ! is_null($this->template_bindings) )
		{
			// LOOP ON VIEWS
			$initialed_views = array();
			foreach($this->template_bindings as $key =>$view)
			{
				TRACE::trace_var($context, "init view", $view->getName(), self::$TRACE_TEMPLATE_VIEW);
				if ($view != $this && ! array_key_exists($view->getName(), $initialed_views) && ! $view->isInitStarted() )
				{
					$initialed_views[$view->getName()] = $view;
					$view->init();
				}
			}
			unset($initialed_views);
		}
		
		// INIT SELF
		$result = $result && $this->initSelf();
		
		TRACE::trace_var($context, "result", $result, self::$TRACE_TEMPLATE_VIEW);
		return $result;
	}
	
	
	/**
	 * @brief		Init view
	 * @return		nothing
	 */
	protected function initSelf()
	{
		$context = get_class($this).".AbstractTemplateViewImpl.initSelf";
		TRACE::enter($context, "", self::$TRACE_TEMPLATE_VIEW);
		
		// PARENT CLASS INIT
		$result = parent::initSelf();
		if ( ! $result )
		{
			return TRACE::leaveko($context, "parent init failed", false, self::$TRACE_TEMPLATE_VIEW);
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	
	// ----------------- VIEW TEMPLATE ATTRIBUTES -----------------
	
	/**
	 * @brief		Enable template feature
	 * @return		nothing
	 */
	public function enableTemplate()
	{
		$this->init();
	}
	
	
	/**
	 * @brief		Disable template feature
	 * @return		nothing
	 */
	public function disableTemplate()
	{
		$this->template_file_name	= null;
		$this->template_string		= null;
		$this->template_bindings	= null;
		
		$this->setOption(self::$OPTION_TEMPLATE_STRING, null);
		$this->setOption(self::$OPTION_TEMPLATE_FILE_NAME, null);
		$this->setOption(self::$OPTION_TEMPLATE_BINDINGS, null);
	}
	
	
	/**
	 * @brief		Set the template from a string constant
	 * @param[in]	arg_string				string constant of the template content
	 * @return		nothing
	 */
	public function setTemplateFromString($arg_string)
	{
		$context = get_class($this).".AbstractTemplateViewImpl.setTemplateFromString";
		TRACE::enter($context, "($arg_string)", self::$TRACE_TEMPLATE_VIEW);
		
		// CHECK STRING
		if ( is_null($arg_string) || $arg_string == "" )
		{
			return TRACE::leaveok($context, "empty template string", true, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// TODO AbstractTemplateViewImpl.setTemplateFromString : check template string
		$this->template_string = $arg_string;
		
		return TRACE::leaveok($context, "($arg_string)", true, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	/**
	 * @brief		Set the template from a text file
	 * @param[in]	arg_file_name			file name of the template content
	 * @return		nothing
	 */
	public function setTemplateFromFileName($arg_file_name)
	{
		$context = get_class($this).".AbstractTemplateViewImpl.setTemplateFromFileName";
		TRACE::enter($context, "($arg_file_name)", self::$TRACE_TEMPLATE_VIEW);
		
		// CHECK STRING
		if ( is_null($arg_file_name) || $arg_file_name == "" )
		{
			return TRACE::leaveok($context, "empty file name string", true, self::$TRACE_TEMPLATE_VIEW);
		}
		$this->template_file_name = LIBAPT_APP_ROOT."/".$arg_file_name;
		TRACE::trace_var($context, "template_file_name (default)", $this->template_file_name, self::$TRACE_TEMPLATE_VIEW);
		if ( ! file_exists($this->template_file_name) )
		{
			$this->template_file_name = str_replace("/modules/", LIBAPT_APP_MODULES_ROOT, $this->template_file_name);
			TRACE::trace_var($context, "template_file_name (in modules repository)", $this->template_file_name, self::$TRACE_TEMPLATE_VIEW);
			if ( ! file_exists($this->template_file_name) )
			{
				return TRACE::leaveko($context, "file path name not found", false, self::$TRACE_TEMPLATE_VIEW);
			}
		}
		
		// GET CURRENT LANGUAGE
		$language_code = Application::getInstance()->getHtmlLanguageCode();
		if ( ! is_null($language_code) && $language_code != "")
		{
			if ( file_exists($this->template_file_name.".$language_code") )
			{
				$this->template_file_name .= ".$language_code";
			}
		}
		
		// CHECK FILE
		if ( ! file_exists($this->template_file_name) )
		{
			return TRACE::leaveko($context, "file path name not found", false, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// PHP FILE
		$php_suffix = "php";
		$file_suffix = substr($this->template_file_name, -3);
		if ($file_suffix == $php_suffix)
		{
			ob_start();
			require $this->template_file_name;
			$this->template_string = ob_get_clean();
			return TRACE::leaveok($context, "PHP template loaded", true, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// HTML OR OTHER FILE
		$handle = @fopen($this->template_file_name, "r");
		if ($handle !== FALSE)
		{
			// LOOP ON FILE PARTS
			while ( ($buffer = fgets($handle, 4096)) !== false)
			{
				$this->template_string .= $buffer;
			}
			
			// CHECK EOF
			if ( ! feof($handle) )
			{
				fclose($handle);
				return TRACE::leaveko($context, "HTML or text template failed", false, self::$TRACE_TEMPLATE_VIEW);
			}
			
			fclose($handle);
			return TRACE::leaveok($context, "HTML or text template loaded", true, self::$TRACE_TEMPLATE_VIEW);
		}
		
		return TRACE::leaveok($context, "($arg_file_name)", true, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	/**
	 * @brief		Set the keyword/tags from a string constant
	 * @param[in]	arg_string				string to parse
	 * @return		nothing
	 */
	public function setTagsFromString($arg_string)
	{
		$context = get_class($this).".AbstractTemplateViewImpl.setTagsFromString";
		TRACE::enter($context, "($arg_string)", self::$TRACE_TEMPLATE_VIEW);
		
		CONTRACT::assertNotEmptyString($context.".arg_string", $arg_string);
		
		$tags_strings = explode("|", $arg_string);
		foreach($tags_strings as $tag_string)
		{
			CONTRACT::assertNotEmptyString($context.".tag_key", $tag_string);
			$tag_record = explode(":", $tag_string);
			CONTRACT::assertTrue($context.".count(tag_record)", count($tag_record) == 2);
			
			$tag_key = $tag_record[0];
			$tag_value = $tag_record[1];
			CONTRACT::assertNotEmptyString($context.".tag_key", $tag_key);
			CONTRACT::assertNotEmptyString($context.".tag_value", $tag_value);
			
			$this->template_tags[$tag_key] = $tag_value;
		}
		
		return TRACE::leaveok($context, "($arg_string)", true, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	/**
	 * @brief		Set the keyword/object bindings from a string constant
	 * @param[in]	arg_string				string to parse
	 * @return		nothing
	 */
	public function setBindingsFromString($arg_string)
	{
		$context = get_class($this).".AbstractTemplateViewImpl.setBindingsFromString";
		TRACE::enter($context, "($arg_string)", self::$TRACE_TEMPLATE_VIEW);
		
		// CHECK STRING
		if ( is_null($arg_string) or $arg_string == "" )
		{
			return TRACE::leaveok($context, "empty binding string", true, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// GET VIEWS CONTROLLER
		$views_controller = Controllers::getController("viewAction");
		if ( is_null($views_controller) )
		{
			return TRACE::leaveko($context, "views controller not found for action [viewAction]", false, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// LOOP ON BINDINGS
		$binding_strings = explode(",", $arg_string);
		foreach($binding_strings as $binding_string)
		{
			$binding_record = explode("=", $binding_string);
			$key		= $binding_record[0];
			$view_name	= $binding_record[1];
			TRACE::trace_var($context, "key/view", $key."/".$view_name, self::$TRACE_TEMPLATE_VIEW);
			
			// GET BINDING VIEW BY NAME
			$view = $views_controller->getObject($view_name);
			if ( is_null($view) )
			{
				return TRACE::leaveko($context, "view not found [$view_name]", false, self::$TRACE_TEMPLATE_VIEW);
			}
			
			// BIND
			$this->bind($key, $view);
		}
		
		return TRACE::leaveok($context, "($arg_string)", true, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	/**
	 * @brief		Bind a view object to the template keyword
	 * @param[in]	arg_template_key		template keyword
	 * @param[in]	arg_view_object			object for the view to display in place of the keyword
	 * @return		nothing
	 */
	public function bind($arg_template_key, $arg_view_object)
	{
		$context = get_class($this).".AbstractTemplateViewImpl.bind";
		TRACE::enter($context, "($arg_template_key, 'arg_view_object')", self::$TRACE_TEMPLATE_VIEW);
		
		// CHECK KEY
		if ( is_null($arg_template_key) or $arg_template_key == "" )
		{
			return TRACE::leaveko($context, "bad binding key", false, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// CHECK VIEW OBJECT
		if ( is_null($arg_view_object) or ! ($arg_view_object instanceof AbstractView) )
		{
			return TRACE::leaveko($context, "bad view object null or not a view [$arg_template_key]", false, self::$TRACE_TEMPLATE_VIEW);
		}
		
		// REGISTER BINDING
		$this->template_bindings[$arg_template_key] = $arg_view_object;
		
		return TRACE::leaveok($context, "($arg_template_key, 'arg_view_object')", true, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	/**
	 * @brief		Get the object bind to the keyword
	 * @param[in]	arg_template_key		template keyword
	 * @return		object					object for the view to display in place of the keyword
	 */
	public function getBinding($arg_template_key)
	{
		return $this->template_bindings[$arg_template_key];
	}
	
	
	
	// ----------------- VIEW RENDER -----------------
	
	/**
	 * @brief		Declare used html headers
	 * @return		nothing
	 */
	public function declareHtmlHeaders()
	{
		$context = get_class($this).".AbstractTemplateViewImpl.declareHtmlHeaders";
		TRACE::enter($context, "", self::$TRACE_TEMPLATE_VIEW);
		
		HTML::useStandardHeaders();
		
		// INIT VIEW
		if ($this->need_init === true)
		{
			$this->init();
		}
		
		// CHECK BINDINGS
		if ( is_null($this->template_bindings) )
		{
			$this->declareHtmlHeadersSelf();
			TRACE::leaveok($context, "template_bindings is null", null, self::$TRACE_TEMPLATE_VIEW);
			return;
		}
		
		// LOOP ON VIEWS
		foreach($this->template_bindings as $key =>$view)
		{
			TRACE::trace_var($context, "view", $view->getName(), self::$TRACE_TEMPLATE_VIEW);
			if ($view != $this)
			{
				$view->declareHtmlHeaders();
			}
		}
		
		$this->declareHtmlHeadersSelf();
		
		TRACE::leaveok($context, "views:".count($this->template_bindings), null, self::$TRACE_TEMPLATE_VIEW);
	}
	
	
	/**
	 * @brief		Render before template
	 * @return		nothing
	 */
	public function htmlBegin()
	{
	}
	
	
	/**
	 * @brief		Render after template
	 * @return		nothing
	 */
	public function htmlEnd()
	{
	}
	
	
	/**
	 * @brief		Render html for subclasses
	 * @return		nothing
	 */
	public function html()
	{
		$context = "AbstractTemplateViewImpl.html";
		
		// INIT VIEW
		if ($this->need_init === true)
		{
			$this->init();
		}
		
		// VIEW IS VISIBLE ?
		if ( ! $this->isVisible() )
		{
			return;
		}
		
		
		// CHECK TEMPLATE STRING
		if ( is_null($this->template_string) )
		{
			$this->htmlBegin();
			$this->htmlSelf();
			$this->htmlEnd();
			return;
		}
		
		
		// BEGIN RENDER
		$this->htmlBegin();
		
		
		// DISPLAY TEMPLATE
		$centered_cols = false;
		$template_tags = explode("}", $this->template_string);
		TRACE::trace_var("html", "template_tags", $template_tags, self::$TRACE_TEMPLATE_VIEW);
		foreach($template_tags as $tag1)
		{
			$template_tags2 = explode("{", $tag1);
			TRACE::trace_var("html", "template_tags2", $template_tags2, self::$TRACE_TEMPLATE_VIEW);
			foreach($template_tags2 as $tag)
			{
				$tag = ltrim($tag, "{");
				
				// JS BLOCKS
				if ($tag == "begin_js_block" || $tag == "bjb")
				{
					HTML::addBufferLine("{");
					continue;
				}
				if ($tag == "end_js_block" || $tag == "ejb")
				{
					HTML::addBufferLine("}");
					continue;
				}
				
				// GRID LAYOUT TAGS
				if ($tag == "begin_row" || $tag == "br")
				{
					HTML::enterRowLayout();
					continue;
				}
				if ($tag == "end_row" || $tag == "er")
				{
					HTML::leaveRowLayout();
					continue;
				}
				if ($tag == "begin_1_cols" || $tag == "b1c")
				{
					HTML::enterColumnsLayout(1, $centered_cols);
					continue;
				}
				if ($tag == "begin_2_cols" || $tag == "b2c")
				{
					HTML::enterColumnsLayout(2, $centered_cols);
					continue;
				}
				if ($tag == "begin_3_cols" || $tag == "b3c")
				{
					HTML::enterColumnsLayout(3, $centered_cols);
					continue;
				}
				if ($tag == "begin_4_cols" || $tag == "b4c")
				{
					HTML::enterColumnsLayout(4, $centered_cols);
					continue;
				}
				if ($tag == "begin_5_cols" || $tag == "b5c")
				{
					HTML::enterColumnsLayout(5, $centered_cols);
					continue;
				}
				if ($tag == "begin_6_cols" || $tag == "b6c")
				{
					HTML::enterColumnsLayout(6, $centered_cols);
					continue;
				}
				if ($tag == "begin_7_cols" || $tag == "b7c")
				{
					HTML::enterColumnsLayout(7, $centered_cols);
					continue;
				}
				if ($tag == "begin_8_cols" || $tag == "b8c")
				{
					HTML::enterColumnsLayout(8, $centered_cols);
					continue;
				}
				if ($tag == "begin_9_cols" || $tag == "b9c")
				{
					HTML::enterColumnsLayout(9, $centered_cols);
					continue;
				}
				if ($tag == "begin_10_cols" || $tag == "b10c")
				{
					HTML::enterColumnsLayout(10, $centered_cols);
					continue;
				}
				if ($tag == "begin_11_cols" || $tag == "b11c")
				{
					HTML::enterColumnsLayout(11, $centered_cols);
					continue;
				}
				if ($tag == "begin_12_cols" || $tag == "b12c")
				{
					HTML::enterColumnsLayout(12, $centered_cols);
					continue;
				}
				if ($tag == "end_cols" || $tag == "ec")
				{
					HTML::leaveColumnsLayout();
					continue;
				}
				
				// ACCORDION TAGS
				if ($tag == "begin_accordion" || $tag == "ba")
				{
					HTML::enterAccordion();
					continue;
				}
				if ($tag == "end_accordion" || $tag == "ea")
				{
					HTML::leaveAccordion();
					continue;
				}
				if ($tag == "begin_accordion_title" || $tag == "bat")
				{
					HTML::enterAccordionTitle();
					continue;
				}
				if ($tag == "end_accordion_title" || $tag == "eat")
				{
					HTML::leaveAccordionTitle();
					continue;
				}
				if ($tag == "begin_accordion_content" || $tag == "bac")
				{
					HTML::enterAccordionContent();
					continue;
				}
				if ($tag == "end_accordion_content" || $tag == "eac")
				{
					HTML::leaveAccordionContent();
					continue;
				}
				
				// TABLE TAGS
				if ($tag == "begin_table" || $tag == "bt")
				{
					HTML::enterTable();
					continue;
				}
				if ($tag == "end_table" || $tag == "et")
				{
					HTML::leaveTable();
					continue;
				}
				if ($tag == "begin_table_head" || $tag == "bth")
				{
					HTML::enterTableHead();
					continue;
				}
				if ($tag == "end_table_head" || $tag == "eth")
				{
					HTML::leaveTableHead();
					continue;
				}
				if ($tag == "begin_table_foot" || $tag == "btf")
				{
					HTML::enterTableFoot();
					continue;
				}
				if ($tag == "end_table_foot" || $tag == "etf")
				{
					HTML::leaveTableFoot();
					continue;
				}
				if ($tag == "begin_table_body" || $tag == "btb")
				{
					HTML::enterTableBody();
					continue;
				}
				if ($tag == "end_table_body" || $tag == "etb")
				{
					HTML::leaveTableBody();
					continue;
				}
				
				// PORTLET TAGS
				if ($tag == "begin_portlet_container" || $tag == "bpc")
				{
					HTML::enterPortletContainer();
					continue;
				}
				if ($tag == "end_portlet_container" || $tag == "epc")
				{
					HTML::leavePortletContainer();
					continue;
				}
				if ($tag == "begin_portlet" || $tag == "bp")
				{
					HTML::enterPortlet();
					continue;
				}
				if ($tag == "end_portlet" || $tag == "ep")
				{
					HTML::leavePortlet();
					continue;
				}
				if ($tag == "begin_portlet_title" || $tag == "bpt")
				{
					HTML::enterPortletTitle();
					continue;
				}
				if ($tag == "end_portlet_title" || $tag == "ept")
				{
					HTML::leavePortletTitle();
					continue;
				}
				if ($tag == "begin_portlet_body" || $tag == "bpb")
				{
					HTML::enterPortletContent();
					continue;
				}
				if ($tag == "end_portlet_body" || $tag == "epb")
				{
					HTML::leavePortletContent();
					continue;
				}
				
				// THIS VIEW
				if ( $tag == "this_id" )
				{
					HTML::addBuffer( $this->getHtmlId() );
					continue;
				}
				if ( $tag == "this_name" )
				{
					HTML::addBuffer( $this->getName() );
					continue;
				}
				if ( $tag == "this" )
				{
					$this->htmlSelf();
					continue;
				}
				
				// LINKS : {link_view_page:VIEWLABEL:VIEWNAME:VIEWOPTS:ANCHORTARGET} or {lv:VIEWLABEL:VIEWNAME:VIEWOPTS:ANCHORTARGET}
				if ( substr($tag, 0, 14) == "link_view_page" || substr($tag, 0, 3) == "lvp" )
				{
					$link_args		= explode(":", $tag, 5);
					$link_args[]	= null; // optional view options
					$link_args[]	= ""; // optional anchor target
					CONTRACT::assertArrayCount($context.".link_view", $link_args, 3, 7);
					
					$arg_label	= $link_args[1];
					$arg_view	= $link_args[2];
					$arg_opts	= $link_args[3];
					$arg_blank	= $link_args[4];
					$arg_blank	= ( is_null($arg_blank) || $arg_blank == "") ? "" : "target='$arg_blank'";
					if ( ! is_null($arg_opts) && $arg_opts != "" )
					{
						$arg_opts = str_replace("**", "=", $arg_opts);
						$arg_opts = str_replace("*", ":", $arg_opts);
					}
					$link_url	= URLS::getViewPageUrl($arg_view, $arg_opts);
					
					HTML::addBuffer("<a href='$link_url' $arg_blank>$arg_label</a>");
					continue;
				}
				
				// IMAGE NAME LINK : {image_link_name:IMGALTLABEL:IMGNAME:LINKURL} or {iln:IMGALTLABEL:IMGNAME:LINKURL}
				// IMAGE URL LINK  : {image_link_url:IMGALTLABEL:IMGURL:LINKURL} or {ilurl:IMGALTLABEL:IMGURL:LINKURL}
				
				// IMAGE NAME : {image_name:IMGALTLABEL:IMGNAME} or {in:IMGALTLABEL:IMGNAME}
				// IMAGE URL  : {image_url:IMGALTLABEL:IMGURL} or {iurl:IMGALTLABEL:IMGURL}
				// TODO
				
				// VIEWS BINDINGS
				if ( array_key_exists($tag, $this->template_bindings) )
				{
					$view = $this->template_bindings[$tag];
					if ( $view === $this )
					{
						$this->htmlSelf();
					}
					else
					{
						$view->html();
					}
					continue;
				}
				
				// TEMPLATE TAGS
				if ( array_key_exists($tag, $this->template_tags) )
				{
					$value = $this->template_tags[$tag];
					HTML::addBuffer($value);
					continue;
				}
				
				HTML::addBuffer($tag);
			}
		}
		
		// END RENDER
		$this->htmlEnd();
	}
}
?>