<?php
/**
 * @file        class_abstract_page_layout_view.php
 * @brief       Base class for page layout classes
 * @details     Output a login page, an error page or a default banner, menus, content, footer
 * @see			AbstractTemplateViewImpl AbstractTemplateView Response Trace
 * @ingroup     L3_VIEWS
 * @date        2013-01-27
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractPageLayoutView extends AbstractTemplateViewImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_DEFAULT_PAGE_LAYOUT = false;
	
	/// @brief		Option : content view object
	static public $OPTION_CONTENT_VIEW_OBJECT	= "content_view_object";
	
	/// @brief		Option : content is error page
	static public $OPTION_CONTENT_IS_ERROR		= "content_is_error";
	
	/// @brief		Option : content is login page
	static public $OPTION_CONTENT_IS_LOGIN		= "content_is_login";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		application response object
	private $response = null;
	
	
	
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
		$this->registerOption(self::$OPTION_CONTENT_VIEW_OBJECT,	Type::$TYPE_OBJECT,		self::$OPTION_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_CONTENT_IS_ERROR,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, false);
		$this->registerOption(self::$OPTION_CONTENT_IS_LOGIN,		Type::$TYPE_BOOLEAN,	self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, false);
		
		// INIT ATTRIBUTES
		$this->response = Application::getInstance()->getResponse();
	}
	
	 
	
	// ----------------- CLASS INSTANCE INIT -----------------
	/**
	 * @brief		Initialization
	 * @return		nothing
	 */
	protected function initSelf()
	{
		$context = "DefaultLayoutPageView.initSelf";
		TRACE::enter($context, "", self::$TRACE_DEFAULT_PAGE_LAYOUT);
		
		// MODEL VIEW INIT
		CONTRACT::assertTrue($context.".parent.initSelf()", parent::initSelf() );
		
		// GET OPTIONS
		$is_error = $this->getBooleanOption(self::$OPTION_CONTENT_IS_ERROR);
		$is_login = $this->getBooleanOption(self::$OPTION_CONTENT_IS_LOGIN);
		
		
		// SET BINDINGS
		$banner_view = $this->getBannerView();
		if ( ! is_null($banner_view) )
		{
			$this->bind("banner",		$banner_view);
		}
		
		$menusbar_view = $this->getMenusBarView();
		if ( ! is_null($menusbar_view) )
		{
			$menusbar_view->init();
			if ( $menusbar_view->isValid() )
			{
				$this->bind("menus",	$menusbar_view);
			}
		}
		
		$footer_view = $this->getFooterView();
		if ( ! is_null($banner_view) )
		{
			$this->bind("footer",		$footer_view);
		}
		
		// SET LOGIN TEMPLATE STRING
		if ($is_login)
		{
			$content_view = $this->getLoginView();
			$this->bind("content", $content_view);
			$this->response->addView("content_view", $content_view);
			$template = "{banner}{content}{footer}";
			$this->setTemplateFromString($template);
			return TRACE::leaveok($context, "login page", true, self::$TRACE_DEFAULT_PAGE_LAYOUT);
		}
		
		// SET ERROR TEMPLATE STRING
		if ($is_error)
		{
			$content_view = $this->getErrorView();
			$this->bind("content", $content_view);
			$this->response->addView("content_view", $content_view);
			$template = "{menus}{banner}{br}{content}{er}{this}{footer}";
			$this->setTemplateFromString($template);
			return TRACE::leaveok($context, "error page", true, self::$TRACE_DEFAULT_PAGE_LAYOUT);
		}
		
		// SET STANDARD TEMPLATE STRING
		$content_view = $this->getOption(self::$OPTION_CONTENT_VIEW_OBJECT);
		$this->bind("content", $content_view);
		$this->response->addView("content_view", $content_view);
		$template = Application::getInstance()->getDefaultPageLayoutViewTemplate();
		if ( is_null($template) || $template == "" )
		{
			$template = "{banner}{menus}{content}{this}{footer}";
		}
		$this->setTemplateFromString($template);
		
		return TRACE::leaveok($context, "standard page", true, self::$TRACE_DEFAULT_PAGE_LAYOUT);
	}
	
	
	
	// ----------------- VIEW RENDER -----------------
	/**
	 * @brief		Render html view before the content
	 * @return		nothing
	 */
	public function htmlBegin()
	{
		// GENERATE HEADERS
		$arg_scripts	= false;
		$app			= Application::getInstance();
		$headers		= $this->response->generateHtmlHeaders($arg_scripts);
		$language		= $app->getHtmlLanguageCode();
		$charset		= $app->getHtmlCharsetCode();
		
		// BEGIN OF THE PAGE
		HTML::resetBuffer();
		HTML::addBufferLine("<!DOCTYPE html>");
		HTML::addBufferLine("<html lang='$language'>");
		HTML::addBufferLine("<head>");
		HTML::addBufferLine("<meta http-equiv='content-type' content='text/html; charset=$charset' />");
		HTML::addBufferLine("<meta name='viewport' content='width=device-width' />");
		HTML::addBufferLine("<title>".LIBAPT_APP_TITLE."</title>");
		HTML::addBuffer("$headers");
		HTML::addBufferLine("</head>");
		HTML::addBufferLine("<body>");
		$url = Application::getInstance()->getBaseUrl()."index.php";
		HTML::addBufferLine("\n<!-- ************************************************************************************* -->");
		HTML::addBufferLine("<!-- LOGOUT FORM -->");
		HTML::addBufferLine("<form id='logout_form' method='post' action='$url' style='visibility:hidden; margin:0px; padding:0px;'>");
		HTML::addBufferLine("<input type='hidden' name='logoutForm' value='checkAuth' />");
		HTML::addBufferLine("</form>");
		HTML::addBufferLine("<!-- LOGOUT FORM -->");
		HTML::addBufferLine("<!-- ************************************************************************************* -->");
	}
	
	
	/**
	 * @brief		Get banner view object
	 * @return		object
	 */
	abstract public function getBannerView();
	
	
	/**
	 * @brief		Get menus bar view object
	 * @return		object
	 */
	abstract public function getMenusBarView();
	
	
	/**
	 * @brief		Get footer view object
	 * @return		object
	 */
	abstract public function getFooterView();
	
	
	/**
	 * @brief		Get login view object
	 * @return		object
	 */
	abstract public function getLoginView();
	
	
	/**
	 * @brief		Get error view object
	 * @return		object
	 */
	abstract public function getErrorView();
	
	
	/**
	 * @brief		Render html view content
	 * @return		nothing
	 */
	public function htmlContent()
	{
		HTML::echoBufferAndReset();
		$this->response->displayMessages();
	}
	
	
	/**
	 * @brief		Render html view after the content
	 * @return		nothing
	 */
	public function htmlEnd()
	{
		// END OF THE PAGE
		HTML::addBufferLine("\n<!-- ************************************************************************************* -->");
		HTML::addBufferLine("<!-- BEGIN OF HEADERS SCRIPTS -->");
		HTML::addBufferLine($this->response->generateHtmlHeadersScriptsOnly() );
		HTML::addBufferLine("<!-- END OF HEADERS SCRIPTS -->");
		HTML::addBufferLine("<!-- ************************************************************************************* -->");
		
		HTML::addBufferLine("\n<!-- ************************************************************************************* -->");
		HTML::addBufferLine("<!-- BEGIN OF INLINE SCRIPTS -->");
		$this->response->generateHtmlScripts();
		HTML::addBufferLine("<!-- END OF INLINE SCRIPTS -->");
		HTML::addBufferLine("<!-- ************************************************************************************* -->");
		
		HTML::addBuffer("</body>\n");
		HTML::addBuffer("</html>\n");
		HTML::echoBufferAndReset();
	}
	
	
	/**
	 * @brief		Render html view
	 * @return		nothing
	 */
	public function htmlSelf()
	{
		$this->htmlContent();
	}
}
?>