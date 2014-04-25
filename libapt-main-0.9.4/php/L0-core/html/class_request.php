<?php
/**
 * @file        class_request.php
 * @brief       provides GET/POST values, cookies, url
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class Request
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not
	static public $TRACE_REQUEST = false;
	
	
	/// @brief		Request HTTP headers
	protected $headers			= null;
	
	/// @brief		Request HTTP ALL datas
	protected $parameters		= null;
	
	/// @brief		Request HTTP POST datas
	protected $post_datas		= null;
	
	/// @brief		Request HTTP GET datas
	protected $get_datas		= null;
	
	/// @brief		Request HTTP COOKIES datas
	protected $cookies_datas	= null;
	
	/// @brief		Request HTTP FILES datas
	protected $files_datas		= null;
	
	/// @brief		Request HTTP SERVER datas
	protected $server_datas		= null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_cache_dir		path name of the cache directory, default null (string) (unused yet)
	 * @return		nothing
	 */
	public function __construct($arg_cache_dir = null)
	{
		$this->headers			= getallheaders();
		$this->post_datas		= &$_POST;
		$this->get_datas		= &$_GET;
		$this->cookies_datas	= &$_COOKIE;
		$this->files_datas		= &$_FILES;
		$this->server_datas		= &$_SERVER;
    }
	
	
	/**
	 * @brief		Get a request identifier used to cache pages
	 * @return		string
	 */
	public function getPageKey()
	{
		return urlencode($_SERVER['REQUEST_URI'])."-".md5($_SERVER['REQUEST_URI']);
	}
	
	
	/**
	 * @brief		Test if request object has HTTP headers
	 * @return		boolean
	 */
	public function hasHeaders()
	{
		return (! is_null($this->headers) ) && count( $this->headers ) > 0;
	}
	
	public function getHeaders()
	{
		return $this->headers;
	}
	
	/**
	 * @brief		Test if request object has HTTP headers
	 * @param[in]	arg_cache_dir		path name of the cache directory, default null (string) (unused yet)
	 * @return		nothing
	 */
	public function hasHeader($arg_key)
	{
		return array_key_exists($arg_key, $this->headers);
	}
	
	public function getHeaderData($arg_key)
	{
		return array_key_exists($arg_key, $this->headers) ? $this->headers[$arg_key] : null;
	}
	
	
	// SERVER VARIABLES
	public function hasServerDatas()
	{
		return (! is_null($this->server_datas) ) and count( $this->server_datas ) > 0;
	}
	
	public function getServerDatas()
	{
		return $this->server_datas;
	}
	
	public function hasServerData($arg_key)
	{
		return array_key_exists($arg_key, $this->server_datas);
	}
	
	public function getServerData($arg_key)
	{
		return array_key_exists($arg_key, $this->server_datas) ? $this->server_datas[$arg_key] : null;
	}
	
	public function getMethod()
	{
		return $this->server_datas['REQUEST_METHOD'];
	}
	
	public function isGetMethod()
	{
		return strtolower( $this->server_datas['REQUEST_METHOD'] ) == "get";
	}
	
	public function isPutMethod()
	{
		return strtolower( $this->server_datas['REQUEST_METHOD'] ) == "put";
	}
	
	public function isPostMethod()
	{
		return strtolower( $this->server_datas['REQUEST_METHOD'] ) == "post";
	}
	
	public function isDeleteMethod()
	{
		return strtolower( $this->server_datas['REQUEST_METHOD'] ) == "delete";
	}
	
	public function getURI()
	{
		return $this->server_datas['REQUEST_URI'];
	}
	
	function isAjax() {
		return env('HTTP_X_REQUESTED_WITH') === "XMLHttpRequest";
	}
	
	function isFlash() {
		return (preg_match('/^(Shockwave|Adobe) Flash/', env('HTTP_USER_AGENT')) == 1);
	}
	
	function isSSL() {
		return env('HTTPS');
	}
	
	
	// GET VARIABLES
	public function hasGetDatas()
	{
		return (! is_null($this->get_datas) ) and count( $this->get_datas ) > 0;
	}
	
	public function getGetDatas()
	{
		return $this->get_datas;
	}
	
	public function getGetSanitizedDatas()
	{
		$results = array();
		foreach($this->get_datas as $key=>$value)
		{
			$results[$key] = $this->sanitize_get($key);
		}
		return $results;
	}
	
	public function hasGetData($arg_key)
	{
		return array_key_exists($arg_key, $this->get_datas);
	}
	
	public function getGetData($arg_key, $arg_type = "STRING", $arg_default = null)
	{
		return array_key_exists($arg_key, $this->get_datas) ? $this->sanitize_get($arg_key, $arg_type) : $arg_default;
	}
	
	
	// POST VARIABLES
	public function hasPostDatas()
	{
		return (! is_null($this->post_datas) ) and count( $this->post_datas ) > 0;
	}
	
	public function getPostDatas()
	{
		return $this->post_datas;
	}
	
	public function getPostSanitizedDatas()
	{
		$results = array();
		foreach($this->post_datas as $key=>$value)
		{
			$results[$key] = $this->sanitize_post($key);
		}
		return $results;
	}
	
	public function hasPostData($arg_key)
	{
		return array_key_exists($arg_key, $this->post_datas);
	}
	
	public function getPostData($arg_key, $arg_type = "STRING", $arg_default = null)
	{
		return array_key_exists($arg_key, $this->post_datas) ? $this->sanitize_post($arg_key, $arg_type) : $arg_default;
	}
	
	
	// COOKIES VARIABLES
	public function hasCookieDatas()
	{
		return (! is_null($this->cookies_datas) ) and count( $this->cookies_datas ) > 0;
	}
	
	public function getCookieDatas()
	{
		return $this->cookies_datas;
	}
	
	public function getCookieSanitizedDatas()
	{
		$results = array();
		foreach($this->cookies_datas as $key=>$value)
		{
			$results[$key] = $this->sanitize_cookie($key);
		}
		return $results;
	}
	
	public function hasCookieData($arg_key)
	{
		return array_key_exists($arg_key, $this->cookies_datas);
	}
	
	public function getCookieData($arg_key, $arg_type = "STRING", $arg_default = null)
	{
		return array_key_exists($arg_key, $this->cookies_datas) ? $this->sanitize_cookie($arg_key, $arg_type) : $arg_default;
	}
	
	
	// ENV VARIABLES
    public function hasEnvData($arg_key)
	{
		return ! is_null( getenv($arg_key) );
	}
	
    public function getEnvData($arg_key, $arg_type = "STRING")
	{
		return $this->sanitize_env($arg_key, $arg_type);
	}
	
	
	// FILES DATAS
	public function hasFileDatas()
	{
		return (! is_null($this->files_datas) ) and count( $this->files_datas ) > 0;
	}
	
	public function getFileDatas()
	{
		return $this->files_datas;
	}
	
	public function hasFileData($arg_key)
	{
		return array_key_exists($arg_key, $this->files_datas);
	}
	
	public function getFileData($arg_key)
	{
		return array_key_exists($arg_key, $this->files_datas) ? $this->files_datas[$arg_key] : null;
	}
	
	
	// PARAMETERS
	public function hasParameter($arg_key)
	{
		// GET PARAMETER ?
		if ( $this->hasGetData($arg_key) )
		{
			return true;
		}
		
		// POST PARAMETER ?
		if ( $this->hasPostData($arg_key) )
		{
			return true;
		}
		
		// COOKIE PARAMETER ?
		if ( $this->hasCookieData($arg_key) )
		{
			return true;
		}
		
		// FILE PARAMETER ?
		if ( $this->hasFileData($arg_key) )
		{
			return true;
		}
		
		return false;
    }
	
	public function getParameter($arg_key, $arg_type = "HTML_STRING", $arg_default = null)
	{
		// GET PARAMETER ?
		if ( $this->hasGetData($arg_key) )
		{
			return $this->getGetData($arg_key, $arg_type);
		}
		
		// POST PARAMETER ?
		if ( $this->hasPostData($arg_key) )
		{
			return $this->getPostData($arg_key, $arg_type);
		}
		
		// COOKIE PARAMETER ?
		if ( $this->hasCookieData($arg_key) )
		{
			return $this->getCookieData($arg_key, $arg_type);
		}
		
		// FILE PARAMETER ?
		if ( $this->hasFileData($arg_key) )
		{
			return $this->getFileData($arg_key, $arg_type);
		}
		
		return $arg_default;
    }
	
	public function getParameters()
	{
		if ( is_null($this->parameters) )
		{
			$this->parameters = array_merge( $this->getGetSanitizedDatas(), $this->getPostSanitizedDatas(), $this->getCookieSanitizedDatas(), $this->getFileDatas() );
		}
		
		// BE CAREFULL : VALUES ARE NOT SANITIZED
		return $this->parameters;
    }
	
	public function getParametersKeys()
	{
		if ( is_null($this->parameters) )
		{
			$this->parameters = array_merge( $this->getGetDatas(), $this->getPostDatas(), $this->getCookieDatas(), $this->getFileDatas() );
		}
		
		return array_keys($this->parameters);
    }
	
	
	// SANITIZE DATAS
	public function sanitize($arg_src, $arg_key, $arg_type = "STRING")
	{
		if ( $arg_type == "STRING" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_STRING, null);
		}
		
		if ( $arg_type == "HTML_STRING" )
		{
			return filter_input($arg_src, $arg_key, FILTER_UNSAFE_RAW, null);
		}
		
		if ( $arg_type == "BOOLEAN" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_NUMBER_INT, null);
		}
		
		if ( $arg_type == "INTEGER" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_NUMBER_INT, null);
		}
		
		if ( $arg_type == "FLOAT" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_NUMBER_FLOAT, null);
		}
		
		if ( $arg_type == "IP" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_IP, null);
		}
		
		if ( $arg_type == "URL" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_URL, null);
		}
		
		if ( $arg_type == "EMAIL" )
		{
			return filter_input($arg_src, $arg_key, FILTER_SANITIZE_EMAIL, null);
		}
		
		return filter_input($arg_src, $arg_key, FILTER_SANITIZE_STRING);
	}
	
	public function sanitize_get($arg_key, $arg_type = "STRING")
	{
		return $this->sanitize(INPUT_GET, $arg_key, $arg_type);
	}
	
	public function sanitize_post($arg_key, $arg_type = "STRING")
	{
		return $this->sanitize(INPUT_POST, $arg_key, $arg_type);
	}
	
	public function sanitize_cookie($arg_key, $arg_type = "STRING")
	{
		return $this->sanitize(INPUT_COOKIE, $arg_key, $arg_type);
	}
	
	public function sanitize_server($arg_key, $arg_type = "STRING")
	{
		return $this->sanitize(INPUT_SERVER, $arg_key, $arg_type);
	}
	
	public function sanitize_env($arg_key, $arg_type = "STRING")
	{
		return $this->sanitize(INPUT_ENV, $arg_key, $arg_type);
	}
	
	
	
	/**
	 * @brief		Validation of a value from form post
	 * @param[in]	arg_post_name			value POST key name (string)
	 * @param[in]	arg_default_value		default value (string)
	 * @param[in]	arg_validate_type		validation type (string)
	 * @param[in]	arg_validate_options	validation options (string)
	 * @param[in]	arg_sanitize_type		sanitize type (string)
	 * @param[in]	arg_sanitize_options	sanitize options (string)
	 * @return		string					sanitized value
	 * @deprecated	replace with Request features in FiltersChainView
	 */
	static public function getSanitizedValueFromForm($arg_post_name, $arg_default_value, $arg_validate_type, $arg_validate_options, $arg_sanitize_type, $arg_sanitize_options)
	{
		if ( filter_has_var(INPUT_POST, $arg_post_name) )
		{
			$result = filter_input(INPUT_POST, $arg_post_name, $arg_validate_type, $arg_validate_options);
			if ($result !== false)
			{
				if ($arg_sanitize_options === null)
				{
					$value = filter_input(INPUT_POST, $arg_post_name, $arg_sanitize_type);
				} else {
					$value = filter_input(INPUT_POST, $arg_post_name, $arg_sanitize_type, $arg_sanitize_options);
				}
				return $value;
			}
		}
		return $arg_default_value;
	}
	
	
	/**
	 * @brief		Validation of array value from form post
	 * @param[in]	arg_post_name		value POST key name (string)
	 * @param[in]	arg_index			value index in array (integer)
	 * @param[in]	arg_default_value	default value (string)
	 * @return		string				sanitized value
	 * @deprecated	replace with Request features in FiltersChainView
	 */
	static public function getSanitizedArrayStringFromForm($arg_post_name, $arg_index, $arg_default_value)
	{
		if ( filter_has_var(INPUT_POST, $arg_post_name) )
		{
			$values_array = $_POST[$arg_post_name];
			if ( ! is_null($values_array) && is_array($values_array) && $arg_index >= 0 && $arg_index < count($values_array))
			{
				if ( ! array_key_exists($arg_index, $values_array) )
				{
					return TRACE::leaveko("Forms.getSanitizedArrayStringFromForm", "Bad key at index [$arg_index]", $arg_default_value, self::$TRACE_REQUEST);
				}
				return $values_array[$arg_index];
			}
		}
		return $arg_default_value;
	}
	
	/*
	
	function getClientIP($safe = true) {
		if (!$safe && env('HTTP_X_FORWARDED_FOR') != null) {
			$ipaddr = preg_replace('/(?:,.*)/', '', env('HTTP_X_FORWARDED_FOR'));
		} else {
			if (env('HTTP_CLIENT_IP') != null) {
				$ipaddr = env('HTTP_CLIENT_IP');
			} else {
				$ipaddr = env('REMOTE_ADDR');
			}
		}

		if (env('HTTP_CLIENTADDRESS') != null) {
			$tmpipaddr = env('HTTP_CLIENTADDRESS');

			if (!empty($tmpipaddr)) {
				$ipaddr = preg_replace('/(?:,.*)/', '', $tmpipaddr);
			}
		}
		return trim($ipaddr);
	}
	
	function getReferer() {
		if (env('HTTP_HOST') != null) {
			$sessHost = env('HTTP_HOST');
		}

		if (env('HTTP_X_FORWARDED_HOST') != null) {
			$sessHost = env('HTTP_X_FORWARDED_HOST');
		}
		return trim(preg_replace('/(?:\:.*)/', '', $sessHost));
	}
	
	function getAjaxVersion() {
		if (env('HTTP_X_PROTOTYPE_VERSION') != null) {
			return env('HTTP_X_PROTOTYPE_VERSION');
		}
		return false;
	}
	
	function isMobile() {
		if (defined('REQUEST_MOBILE_UA')) {
			$regex = '/' . REQUEST_MOBILE_UA . '/i';
		} else {
			$regex = '/' . implode('|', $this->mobileUA) . '/i';
		}

		if (preg_match($regex, env('HTTP_USER_AGENT')) || $this->accepts('wap')) {
			return true;
		}
		return false;
	}
	
	*/
	
	/*
	
	function isXml() {
		return $this->prefers('xml');
	}
	
	function isRss() {
		return $this->prefers('rss');
	}
	
	function isAtom() {
		return $this->prefers('atom');
	}
	
	$__requestContent = array(
		'javascript'	=> 'text/javascript',
		'js'			=> 'text/javascript',
		'json'			=> 'application/json',
		'css'			=> 'text/css',
*/	//	'html'			=> array('text/html', '*/*'),
/*		'text'			=> 'text/plain',
		'txt'			=> 'text/plain',
		'csv'			=> array('application/vnd.ms-excel', 'text/plain'),
		'form'			=> 'application/x-www-form-urlencoded',
		'file'			=> 'multipart/form-data',
		'xhtml'			=> array('application/xhtml+xml', 'application/xhtml', 'text/xhtml'),
		'xhtml-mobile'	=> 'application/vnd.wap.xhtml+xml',
		'xml'			=> array('application/xml', 'text/xml'),
		'rss'			=> 'application/rss+xml',
		'atom'			=> 'application/atom+xml',
		'amf'			=> 'application/x-amf',
		'wap'			=> array(
			'text/vnd.wap.wml',
			'text/vnd.wap.wmlscript',
			'image/vnd.wap.wbmp'
		),
		'wml'			=> 'text/vnd.wap.wml',
		'wmlscript'		=> 'text/vnd.wap.wmlscript',
		'wbmp'			=> 'image/vnd.wap.wbmp',
		'pdf'			=> 'application/pdf',
		'zip'			=> 'application/x-zip',
		'tar'			=> 'application/x-tar'
	);
	*/
}
?>