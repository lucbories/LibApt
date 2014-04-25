<?php
/**
 * @file        class_abstract_view_impl.php
 * @brief       Base class for all views implementation
 * @details     Provides common options and helpers
 * @see			AbstractControlledImpl Trace Type
 * @ingroup     L3_VIEWS
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractViewImpl extends AbstractView
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_VIEW = false;
	
	
	/// @brief		Option : View links to other views, default = null (string)
	static public $OPTION_LINKS				= "view_links";
	
	
	/// @brief		Option : View is resizable, default = false (boolean)
	static public $OPTION_IS_RESIZABLE		= "view_is_resizable";
	
	/// @brief		Option : View is visible, default = true (boolean)
	static public $OPTION_IS_VISIBLE		= "view_is_visible";
	
	/// @brief		Option : View is editable, default = true (boolean)
	static public $OPTION_IS_EDITABLE		= "view_is_editable";
	
	/// @brief		Option : View is a portlet, default = false (boolean)
	static public $OPTION_IS_PORTLET		= "view_is_portlet";
	
	/// @brief		Option : View has a horizontal scrollbar, default = false (boolean)
	static public $OPTION_HAS_HSCROLLBAR	= "view_has_hscrollbar";
	
	/// @brief		Option : View has a vertical scrollbar, default = false (boolean)
	static public $OPTION_HAS_VSCROLLBAR	= "view_has_vscrollbar";
	
	
	/// @brief		Option : View html id, default = name + '_id' (string)
	static public $OPTION_HTML_ID			= "view_html_id";
	
	
	/// @brief		Option : View CSS styles, default = empty string (string)
	static public $OPTION_CSS_STYLES		= "view_css_styles";
	
	/// @brief		Option : View CSS classes, default = empty string (string)
	static public $OPTION_CSS_CLASSES		= "view_css_classes";
	
	
	/// @brief		Option : View , default = null (string)
	static public $OPTION_TOOLTIP			= "view_tooltip";
	
	/// @brief		Option : View , default = null (string)
	static public $OPTION_LABEL				= "view_label";
	
	
	/// @brief		Option : View JavaScript event handler : on document ready, default = null (string)
	static public $OPTION_JS_ON_READY		= "view_js_on_ready";
	
	/// @brief		Option : View JavaScript event handler : on change, default = null (string)
	static public $OPTION_JS_ON_CHANGE		= "view_js_on_change";
	
	/// @brief		Option : View JavaScript event handler : on refresh, default = null (string)
	static public $OPTION_JS_ON_REFRESH		= "view_js_on_refresh";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		Parent view (AbstractView instance or null)
	protected $is_js_view = false;
	
	/// @brief		Parent view (AbstractView instance or null)
	protected $parent_view = null;
	
	/// @brief		View need to bi initialized, default = true (boolean)
	protected $need_init = true;
	
	/// @brief		Option attribute : View links (string)
	protected $option_links = null;
	
	/// @brief		Option attribute : View html id (string)
	protected $option_html_id = null;
	
	/// @brief	javascript wrapper view class name (string)
	protected $js_view_class	= "LibaptView";
	
	
	
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
		
		// DECLARE OPTIONS
		$this->registerOption(self::$OPTION_LINKS,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		
		$this->registerOption(self::$OPTION_IS_RESIZABLE,	Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, false);
		$this->registerOption(self::$OPTION_IS_VISIBLE,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_IS_EDITABLE,	Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, true);
		$this->registerOption(self::$OPTION_IS_PORTLET,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, false);
		$this->registerOption(self::$OPTION_HAS_HSCROLLBAR,	Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, false);
		$this->registerOption(self::$OPTION_HAS_VSCROLLBAR,	Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, false);
		
		$default_id = $this->getName()."_id";
		$this->registerOption(self::$OPTION_HTML_ID,		Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, $default_id);
		
		$this->registerOption(self::$OPTION_CSS_STYLES,		Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, "");
		$this->registerOption(self::$OPTION_CSS_CLASSES,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, "");
		
		$this->registerOption(self::$OPTION_LABEL,			Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_TOOLTIP,		Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		
		$this->registerOption(self::$OPTION_JS_ON_READY,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_JS_ON_CHANGE,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_JS_ON_REFRESH,	Type::$TYPE_STRING,		self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
	}
	
	
	
	// ----------------- VIEW INIT -----------------
	/**
	 * @brief		Init view : common init (call initSelf())
	 * @return		boolean		true on success, false on failure
	 */
	protected function init()
	{
		$this->need_init = false;
		
		return $this->initSelf();
	}
	
	
	/**
	 * @brief		Init view
	 * @return		boolean		true on success, false on failure
	 */
	protected function initSelf()
	{
		$context = get_class($this).".AbstractViewImpl.initSelf";
		TRACE::enter($context, "", self::$TRACE_VIEW);
		
		$js_code = "";
		
		// OPTION : SET LINKS HANDLES
		$this->option_links = $this->getNonEmptyStringsArrayOption(self::$OPTION_LINKS, ",");
		
		// OPTION : LINKS (SEE CHILD CLASSES)
		
		// OPTION : HTML ID
		$this->option_html_id = $this->getOption(self::$OPTION_HTML_ID);
		
		// OPTION : JS ON READY (SEE CHILD CLASSES)
		
		// OPTION : INIT SCROLLBAR OPTION
		if ( ! $this->is_js_view )
		{
			if ( $this->getBooleanOption(self::$OPTION_HAS_HSCROLLBAR) && $this->getBooleanOption(self::$OPTION_HAS_VSCROLLBAR) )
			{
				$js_code .= "\n$('#".$this->getHtmlId()."').parent().css('overflow', 'scroll');\n";
				$this->setBooleanOption(self::$OPTION_HAS_HSCROLLBAR, false);
				$this->setBooleanOption(self::$OPTION_HAS_VSCROLLBAR, false);
			}
			else
			{
				// $js_code .= "\n$('#".$this->getHtmlId()."').parent().addClass('scroll-pane');\n";
				if ( $this->getBooleanOption(self::$OPTION_HAS_HSCROLLBAR) )
				{
					$js_code .= "\n$('#".$this->getHtmlId()."').parent().css('overflow-x', 'scroll');\n";
					$this->setBooleanOption(self::$OPTION_HAS_HSCROLLBAR, false);
				}
				if ( $this->getBooleanOption(self::$OPTION_HAS_VSCROLLBAR) )
				{
					$js_code .= "\n$('#".$this->getHtmlId()."').parent().css('overflow-y', 'scroll');\n";
					$this->setBooleanOption(self::$OPTION_HAS_VSCROLLBAR, false);
				}
			}
		}
		
		// OPTION : INIT RESIZABLE OPTION
		if ( ! $this->is_js_view )
		{
			if ( $this->getOption(self::$OPTION_IS_RESIZABLE) )
			{
				$js_code .= "$('#".$this->getHtmlId()."').resizable({ containment: 'parent' });\n";
				$this->setBooleanOption(self::$OPTION_IS_RESIZABLE, false);
			}
		}
		
		// REGISTER JS CODE
		if ($js_code != "")
		{
			$this->appendOnReadyCode($js_code);
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_VIEW);
	}
	
	/**
	 * @brief		Test if the view initialisation is started
	 * @return		boolean		true, false
	 */
	public function isInitStarted()
	{
		return ! $this->need_init;
	}
	
	
	
	// ----------------- VIEW JAVASCRIPT HELPERS -----------------
	
	/**
	 * @brief		Append JavaScript code to execute on document ready event
	 * @param[in]	arg_js_code			JavaScript code
	 * @return		nothing
	 */
	protected function appendOnReadyCode($arg_js_code)
	{
		Application::getInstance()->getResponse()->addScript(Response::$JS_DOC_READY, $arg_js_code);
	}
	
	
	/**
	 * @brief		Append JavaScript code to execute on document ready event if arg_condition is true
	 * @param[in]	arg_condition		execution condition
	 * @param[in]	arg_js_code			JavaScript code
	 * @return		nothing
	 */
	protected function appendConditionalOnReadyCode($arg_condition, $arg_js_code)
	{
		if ($arg_condition)
		{
			Application::getInstance()->getResponse()->addScript(Response::$JS_DOC_READY, $arg_js_code);
		}
	}
	
	
	/**
	 * @brief		Display or hide a content with a button
	 * @param[in]	arg_header_selector			jquery selector for the header html element
	 * @param[in]	arg_content_selector		jquery selector for the content html element to show/hide
	 * @return		nothing
	 */
	protected function enableShowHideCmd($arg_header_selector, $arg_content_selector)
	{
		$this_id = $this->getHtmlId();
		$js_code = "
			$('#$this_id $arg_header_selector')
				.prepend( '<span class=\"ui-icon ui-icon-minusthick\"></span>');
				
			$('#$this_id $arg_header_selector span').click(
				function()
				{
					$('#$this_id $arg_header_selector span').toggleClass('ui-icon-minusthick').toggleClass('ui-icon-plusthick');
					$('#$this_id $arg_content_selector').toggle();
				}
			);
		";
		Application::getInstance()->getResponse()->addScript(Response::$JS_DOC_READY, $js_code);
	}
	
	
	
	// ----------------- VIEW ACCESSORS -----------------
	
	/**
	 * @brief		Test if the view is rendered on the client side with Javascript
	 * @return		boolean
	 */
	public function isJsView()
	{
		return $this->is_js_view;
	}
	
	public function getJsViewClass()
	{
		return $this->js_view_class;
	}
	
	public function getOptionLinks()
	{
		return $this->option_links;
	}
	
	/**
	 * @brief		Get the html id of the html element
	 * @return		string				html id
	 */
	public function getHtmlId()
	{
		return $this->option_html_id;
	}
	
	
	/**
	 * @brief		Test if the view has a parent view
	 * @return		boolean
	 */
	public function hasParentView()
	{
		return ! is_null($this->parent_view);
	}
	
	
	/**
	 * @brief		Get the parent view
	 * @return		object			instance of an AbstractView subclass
	 */
	public function getParentView()
	{
		return $this->parent_view;
	}
	
	
	/**
	 * @brief		Get the top parent view
	 * @return		object			instance of an AbstractView subclass
	 */
	public function getTopParentView()
	{
		$view = $this;
		while( $view->hasParentView() )
		{
			$view = $view->getParentView();
		}
		
		return $view;
	}
	
	
	/**
	 * @brief		Set the parent view
	 * param[in]	arg_parent_view			instance of an AbstractView subclass
	 * @return		nothing
	 */
	public function setParentView($arg_parent_view)
	{
		$this->parent_view = $arg_parent_view;
	}
	
	
	
	/**
	 * @brief		Get the 'is visible' attribute
	 * @return		boolean
	 */
	public function isVisible()
	{
		return $this->getBooleanOption(self::$OPTION_IS_VISIBLE);
	}
	
	
	/**
	 * @brief		Set the 'is visible' attribute
	 * param[in]	arg_visible			(boolean)
	 * @return		nothing
	 */
	public function setIsVisible($arg_visible)
	{
		$this->setOption(self::$OPTION_IS_VISIBLE, $arg_visible);
	}
	
	
	
	/**
	 * @brief		Get the 'is editable' attribute
	 * @return		boolean
	 */
	public function isEditable()
	{
		return $this->getBooleanOption(self::$OPTION_IS_EDITABLE);
	}
	
	
	/**
	 * @brief		Set the 'is editable' attribute
	 * param[in]	arg_editable		(boolean)
	 * @return		nothing
	 */
	public function setIsEditable($arg_editable)
	{
		$this->setOption(self::$OPTION_IS_EDITABLE, $arg_editable);
	}
	
	
	
	// ----------------- VIEW RENDER -----------------
	
	/**
	 * @brief		Declare the used html headers
	 * @return		nothing
	 */
	public function declareHtmlHeaders()
	{
		HTML::useStandardHeaders();
		$this->declareHtmlHeadersSelf();
	}
	
	
	/**
	 * @brief		Declare the used html headers by the child classes
	 * @return		nothing
	 */
	protected function declareHtmlHeadersSelf()
	{
	}
	
	
	
	/**
	 * @brief		Render the parent view
	 * param[in]	arg_render_mode			the output mode (html, console)
	 * @return		nothing
	 */
	public function renderParent($arg_render_mode = "html")
	{
		if ( ! is_null($this->parent_view) )
		{
			$this->parent_view->renderParent($arg_render_mode);
		}
		else
		{
			$this->render($arg_render_mode);
		}
	}
	
	
	/**
	 * @brief		Render the view
	 * param[in]	arg_render_mode			the output mode (html, console)
	 * @return		nothing
	 */
	public function render($arg_render_mode = "html")
	{
		if ($arg_render_mode == "html")
		{
			$this->html();
		}
		else
		{
			$this->console();
		}
	}
	
	
	/**
	 * @brief		Default render of the view in the console mode
	 * @return		nothing
	 */
	public function console()
	{
		echo "MODE DE SORTIE CONSOLE NON IMPLEMENTE : HTML PAR DEFAUT";
		// TODO AbstractView.console
		$this->html();
	}

	
	
	// ----------------- VIEW TRANSLATION -----------------
	
	/**
	 * @brief		Translate the given text
	 * param[in]	arg_text_to_translate		the text to translate (string)
	 * @return		string						the translated text
	 */
	public function translate($arg_text_to_translate)
	{
		// TODO AbstractView.translate
		return utf8_convert($arg_text_to_translate);
	}
}
?>