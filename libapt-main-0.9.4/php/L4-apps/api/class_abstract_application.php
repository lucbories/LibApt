<?php
/**
 * @file        class_abstract_application_php
 * @brief       Application abstract class
 * @details     Define application properties
 * @see			Request Response AbstractApplicationSession Controllers Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractApplication extends AbstractApplicationSession
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_APPLICATION = false;
	
	
	/// @brief		Session property name : application run in Test Unit mode ?
	static public $SESSION_RUN_TU		= "application_run_tu";
	
	/// @brief		Constant property name : application run in Test Unit mode ?
	static public $CONSTANT_RUN_TU		= "LIBAPT_APP_RUN_TU";
	
	/// @brief		Session property name : application short label
	static public $SESSION_IS_OFFLINE		= "application_is_offline";
	
	/// @brief		Constant property name : application short label
	static public $CONSTANT_IS_OFFLINE		= "LIBAPT_APP_IS_OFFLINE";
	
	
	/// @brief		Session property name : application short label
	static public $SESSION_SHORT_LABEL		= "application_short_label";
	
	/// @brief		Constant property name : application short label
	static public $CONSTANT_SHORT_LABEL		= "LIBAPT_APP_SHORT_LABEL";
	
	
	/// @brief		Session property name : application long label
	static public $SESSION_LONG_LABEL				= "application_long_label";
	
	/// @brief		Constant property name : application long label
	static public $CONSTANT_LONG_LABEL				= "LIBAPT_APP_LONG_LABEL";
	
	/// @brief		Session property name : application version label
	static public $SESSION_VERSION_LABEL			= "application_version";
	
	/// @brief		Constant property name : application version label
	static public $CONSTANT_VERSION_LABEL			= "LIBAPT_APP_VERSION";
	
	/// @brief		Session property name : application environnement long label
	static public $SESSION_ENV_LONG_LABEL			= "application_env_long_label";
	
	/// @brief		Constant property name : application environnement long label
	static public $CONSTANT_ENV_LONG_LABEL			= "LIBAPT_APP_ENV_LONG_LABEL";
	
	/// @brief		Session property name : application environnement short label
	static public $SESSION_ENV_SHORT_LABEL			= "application_env_long_label";
	
	/// @brief		Constant property name : application environnement short label
	static public $CONSTANT_ENV_SHORT_LABEL			= "LIBAPT_APP_ENV_SHORT_LABEL";
	
	/// @brief		Session property name : application author name
	static public $SESSION_AUTHOR_NAME				= "application_author_name";
	
	/// @brief		Constant property name : application author name
	static public $CONSTANT_AUTHOR_NAME				= "LIBAPT_APP_AUTHOR_NAME";
	
	/// @brief		Session property name : application author email
	static public $SESSION_AUTHOR_EMAIL				= "application_author_email";
	
	/// @brief		Constant property name : application author email
	static public $CONSTANT_AUTHOR_EMAIL			= "LIBAPT_APP_AUTHOR_EMAIL";
	
	/// @brief		Session property name : application jquery ui theme
	static public $SESSION_JQUERYUI_THEME			= "application_jqueryui_theme";
	
	/// @brief		Constant property name : application jquery ui theme
	static public $CONSTANT_JQUERYUI_THEME			= "LIBAPT_APP_LAYOUT_JQUERY_UI_THEME";
	
	/// @brief		Session property name : application HTML charset
	static public $SESSION_HTML_CHARSET				= "application_html_charset";
	
	/// @brief		Constant property name : application HTML charset
	static public $CONSTANT_HTML_CHARSET			= "LIBAPT_APP_HTML_CHARSET";
	
	/// @brief		Session property name : application HTML language
	static public $SESSION_HTML_LANGUAGE			= "application_html_language";
	
	/// @brief		Constant property name : application HTML language
	static public $CONSTANT_HTML_LANGUAGE			= "LIBAPT_APP_HTML_LANGUAGE";
	
	/// @brief		Session property name : application default layout menus bar
	static public $SESSION_LAYOUT_MENUS_BAR			= "application_layout_menus_bar";
	
	/// @brief		Constant property name : application default layout menus bar
	static public $CONSTANT_LAYOUT_MENUS_BAR		= "LIBAPT_APP_LAYOUT_MENUS_BAR";
	
	/// @brief		Session property name : application default layout view template
	static public $SESSION_LAYOUT_VIEW_TEMPLATE		= "application_layout_view_template";
	
	/// @brief		Constant property name : application default layout view template
	static public $CONSTANT_LAYOUT_VIEW_TEMPLATE	= "LIBAPT_APP_LAYOUT_VIEW_TEMPLATE";
	
	/// @brief		Session property name : application default layout view class
	static public $SESSION_LAYOUT_VIEW_CLASS		= "application_layout_view_class";
	
	/// @brief		Constant property name : application default layout view class
	static public $CONSTANT_LAYOUT_VIEW_CLASS		= "LIBAPT_APP_LAYOUT_VIEW_CLASS";
	
	/// @brief		Session property name : application css media
	static public $SESSION_LAYOUT_CSS_MEDIA			= "application_layout_css_media";
	
	/// @brief		Constant property name : application css media
	static public $CONSTANT_LAYOUT_CSS_MEDIA		= "LIBAPT_APP_LAYOUT_CSS_MEDIA";
	
	/// @brief		Session property name : application base url
	static public $SESSION_APP_URL					= "application_app_url";
	
	/// @brief		Constant property name : application base url
	static public $CONSTANT_APP_URL					= "LIBAPT_APP_URL";
	
	/// @brief		Session property name : application home view
	static public $SESSION_APP_HOME_VIEW			= "application_app_home_view";
	
	/// @brief		Constant property name : application home view
	static public $CONSTANT_APP_HOME_VIEW			= "LIBAPT_APP_HOME";
	 
	 
	/// @brief		Session property name : application 
	// static public $SESSION_		= "application_";
	
	/// @brief		Constant property name : application 
	// static public $CONSTANT_		= "";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		Application singleton object
	protected static $_instance = null;
	
	/// @brief		Application request object of class Request
	protected $request = null;
	
	/// @brief		Application response object of class Response
	protected $response = null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_session_engine		engine object to store sessions context
	 * @return		nothing
	 */
	protected function __construct($arg_session_engine)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_session_engine);
	}
	
	
	
	// ----------------- APPLICATION RUNNING -----------------
	
	/**
	 * @brief		Test if application is in Test Unit mode
	 * @return		boolean
	 */
	public function hasRunTU()
	{
		return $this->getApplicationBooleanProperty(self::$SESSION_RUN_TU, self::$CONSTANT_RUN_TU, false);
	}
	
	/**
	 * @brief		Test if application uses authentication
	 * @return		boolean
	 */
	public function hasAuthentication()
	{
		// DO NOT USE APPLICATION PROPERTIES METHODS FOR SECURITY REASON
		// CLIENT BROWSER SHOULD NOT BE ABLE TO MODIFY THIS VALUE
		// TO NOT BYPASS SECURITY AUTHENTIFICATION
		return TYPE::getBooleanValue(LIBAPT_APP_HAS_AUTHENTIFICATION, TRUE);
	}
	
	/**
	 * @brief		Test if application uses authentication
	 * @return		boolean
	 */
	public function isReadonly()
	{
		// DO NOT USE APPLICATION PROPERTIES METHODS FOR SECURITY REASON
		// CLIENT BROWSER SHOULD NOT BE ABLE TO MODIFY THIS VALUE
		// TO NOT BYPASS SECURITY READONLY MODE
		return TYPE::getBooleanValue(LIBAPT_APP_IS_READONLY, TRUE);
	}
	
	/**
	 * @brief		Test if application has auto authentication
	 * @return		boolean
	 */
	public function hasAutoLogin()
	{
		// DO NOT USE APPLICATION PROPERTIES METHODS FOR SECURITY REASON
		// CLIENT BROWSER SHOULD NOT BE ABLE TO MODIFY THIS VALUE
		// TO NOT BYPASS SECURITY READONLY MODE
		return TYPE::getBooleanValue(LIBAPT_APP_HAS_AUTO_LOGIN, FALSE) && ! is_null(LIBAPT_APP_AUTO_LOGIN) && LIBAPT_APP_AUTO_LOGIN != "";
	}
	
	/**
	 * @brief		Get the auto authentication login
	 * @return		boolean
	 */
	public function getAutoLogin()
	{
		// DO NOT USE APPLICATION PROPERTIES METHODS FOR SECURITY REASON
		// CLIENT BROWSER SHOULD NOT BE ABLE TO MODIFY THIS VALUE
		// TO NOT BYPASS SECURITY READONLY MODE
		return LIBAPT_APP_AUTO_LOGIN;
	}
	
	/**
	 * @brief		Get the auto authentication password
	 * @return		boolean
	 */
	public function getAutoPassword()
	{
		// DO NOT USE APPLICATION PROPERTIES METHODS FOR SECURITY REASON
		// CLIENT BROWSER SHOULD NOT BE ABLE TO MODIFY THIS VALUE
		// TO NOT BYPASS SECURITY READONLY MODE
		return LIBAPT_APP_AUTO_PASSWORD;
	}
	
	/**
	 * @brief		Test if application is in offline mode (no database, not all features)
	 * @return		boolean
	 */
	public function isOffline()
	{
		return $this->getApplicationBooleanProperty(self::$SESSION_IS_OFFLINE, self::$CONSTANT_IS_OFFLINE, false);
	}
	
	/**
	 * @brief		Application main function
	 * @return		boolean		true:success, false:failure
	 */
	public abstract function run();
	
	/**
	 * @brief		Application main function for unit testing
	 * @return		boolean		true:success, false:failure
	 */
	public abstract function runTU();
	
	
	
	// ----------------- APPLICATION REQUEST/RESPONSE -----------------
	
	/**
	 * @brief		Application request singleton
	 * @return		object		instance of the Request class
	 */
	public function getRequest()
	{
		if ( is_null($this->request) )
		{
			$this->request = new Request();
		}
		
		return $this->request;
	}
	
	/**
	 * @brief		Application response singleton
	 * @return		object		instance of the Response class
	 */
	public function getResponse()
	{
		if ( is_null($this->response) )
		{
			$this->response = new Response();
		}
		
		return $this->response;
	}
	
	
	
	// ----------------- APPLICATION DESCRIPTION -----------------
	
	/**
	 * @brief		Get application short lanel
	 * @return		string
	 */
	public function getShortLabel($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_SHORT_LABEL, self::$CONSTANT_SHORT_LABEL, $arg_default);
	}
	
	/**
	 * @brief		Get application long lanel
	 * @return		string
	 */
	public function getLongLabel($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_LONG_LABEL, self::$CONSTANT_LONG_LABEL, $arg_default);
	}
	
	/**
	 * @brief		Get application version label
	 * @return		string
	 */
	public function getVersion($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_VERSION_LABEL, self::$CONSTANT_VERSION_LABEL, $arg_default);
	}
	
	/**
	 * @brief		Get application environnement long lanel
	 * @return		string
	 */
	public function getEnvLongLabel($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_ENV_LONG_LABEL, self::$CONSTANT_ENV_LONG_LABEL, $arg_default);
	}
	
	/**
	 * @brief		Get application environnement short lanel
	 * @return		string
	 */
	public function getEnvShortLabel($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_ENV_SHORT_LABEL, self::$CONSTANT_ENV_SHORT_LABEL, $arg_default);
	}
	
	/**
	 * @brief		Get application author name
	 * @return		string
	 */
	public function getAuthorName($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_AUTHOR_NAME, self::$CONSTANT_AUTHOR_NAME, $arg_default);
	}
	
	/**
	 * @brief		Get application author email
	 * @return		string
	 */
	public function getAuthorEmail($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_AUTHOR_EMAIL, self::$CONSTANT_AUTHOR_EMAIL, $arg_default);
	}
	
	/**
	 * @brief		Get application base url
	 * @return		string
	 */
	public function getBaseUrl($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_APP_URL, self::$CONSTANT_APP_URL, $arg_default);
	}
	
	/**
	 * @brief		Get application home view
	 * @return		string
	 */
	public function getHomeView($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_APP_HOME_VIEW, self::$CONSTANT_APP_HOME_VIEW, $arg_default);
	}
	
	/**
	 * @brief		Get application default layout view class name
	 * @return		string
	 */
	public function getDefaultPageLayoutCssMedia($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_LAYOUT_CSS_MEDIA, self::$CONSTANT_LAYOUT_CSS_MEDIA, $arg_default);
	}
	
	/**
	 * @brief		Get application default layout view class name
	 * @return		string
	 */
	public function getDefaultPageLayoutViewClass($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_LAYOUT_VIEW_CLASS, self::$CONSTANT_LAYOUT_VIEW_CLASS, $arg_default);
	}
	
	/**
	 * @brief		Get application default layout view template
	 * @return		string
	 */
	public function getDefaultPageLayoutViewTemplate($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_LAYOUT_VIEW_TEMPLATE, self::$CONSTANT_LAYOUT_VIEW_TEMPLATE, $arg_default);
	}
	
	/**
	 * @brief		Get application default layout menus bar name
	 * @return		string
	 */
	public function getDefaultPageLayoutMenusBar($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_LAYOUT_MENUS_BAR, self::$CONSTANT_LAYOUT_MENUS_BAR, $arg_default);
	}
	
	/**
	 * @brief		Get application HTML language code
	 * @return		string
	 */
	public function getHtmlLanguageCode($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_HTML_LANGUAGE, self::$CONSTANT_HTML_LANGUAGE, $arg_default);
	}
	
	/**
	 * @brief		Get application HTML charset code
	 * @return		string
	 */
	public function getHtmlCharsetCode($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_HTML_CHARSET, self::$CONSTANT_HTML_CHARSET, $arg_default);
	}
	
	/**
	 * @brief		Get application jQuery UI CSS theme
	 * @return		string
	 */
	public function getDefaultPageLayoutJQueryUITheme($arg_default = "")
	{
		return $this->getApplicationProperty(self::$SESSION_JQUERYUI_THEME, self::$CONSTANT_JQUERYUI_THEME, $arg_default);
	}
	
	
	/**
	 * @brief		Get application current requested URL
	 * @return		string
	 */
	public function getRequestURL()
	{
		$protocol = strpos(strtolower($_SERVER['SERVER_PROTOCOL']),'https') === FALSE ? 'http' : 'https';
		$host     = $_SERVER['HTTP_HOST'];
		$script   = $_SERVER['SCRIPT_NAME'];
		$params   = $_SERVER['QUERY_STRING'];
		
		$currentUrl = $protocol . '://' . $host . $script . '?' . $params;
		
		return $currentUrl;
	}
	
	
	/**
	 * @brief		Test if application uses authentication
	 * @return		boolean
	 */
	public function hasTraceStack()
	{
		// DO NOT USE APPLICATION PROPERTIES METHODS FOR SECURITY REASON
		// CLIENT BROWSER SHOULD NOT BE ABLE TO MODIFY THIS VALUE
		// TO NOT BYPASS SECURITY AUTHENTIFICATION
		return TYPE::getBooleanValue(LIBAPT_APP_TRACE_STACK, true);
	}
}
?>