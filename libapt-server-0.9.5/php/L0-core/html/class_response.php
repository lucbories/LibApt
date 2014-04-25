<?php
/**
 * @file        class_response.php
 * @brief       set client Cookies, set response Headers and contents...
 * @details     ...
 * @see			DefaultLayoutPageView Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class Response
{
	// ATTRIBUTES
	static public $TRACE_RESPONSE			= false;
	static public $TRACE_RESPONSE_ERROR		= true;
	static public $TRACE_RESPONSE_LEAVE_OK	= false;
	
	static public $ORDER_MIN		= 0;
	static public $ORDER_MIDDLE		= 50;
	static public $ORDER_MAX		= 99;
	
	static public $JS_DOC_READY		= "document.ready";
	
	protected $registered_headers	= null;
	protected $page_headers			= null;
	protected $page_views			= null;
	protected $page_views_ordered	= null;
	protected $page_scripts			= null;
	
	protected $http_status			= null;
	
	protected $templates_vars		= null;
	
	protected $msg_information		= null;
	protected $msg_success			= null;
	protected $msg_alert			= null;
	
	static protected $PREDIFINED_CONTENT_TYPE = array(
		'json'			=> 'application/json',
		'javascript'	=> 'text/javascript',
		'css'			=> 'text/css',
		'html'			=> 'text/html',
		'all'			=> '*/*',
		'text'			=> 'text/plain',
		'txt'			=> 'text/plain',
		'csv'			=> 'application/csv',
		'xls'			=> 'application/vnd.ms-excel',
		'doc'			=> 'application/vnd.ms-word',
		'form'			=> 'application/x-www-form-urlencoded',
		'file'			=> 'multipart/form-data',
		'xhtml'			=> 'text/xhtml',
		'xhtml-mobile'	=> 'application/vnd.wap.xhtml+xml',
		'xml'			=> 'text/xml',
		'rss'			=> 'application/rss+xml',
		'atom'			=> 'application/atom+xml',
		'pdf'			=> 'application/pdf',
		'zip'			=> 'application/x-zip',
		'tar'			=> 'application/x-tar'
		);
	
	private $PREDIFINED_STATUS = array(
		'100' => 'Continue',
		'200' => 'OK',
		'201' => 'Created',
		'202' => 'Accepted',
		'203' => 'Non-Authoritative Information',
		'204' => 'No Content',
		'205' => 'Reset Content',
		'206' => 'Partial Content',
		'300' => 'Multiple Choices',
		'301' => 'Moved Permanently',
		'302' => 'Found',
		'303' => 'See Other',
		'304' => 'Not Modified',
		'305' => 'Use Proxy',
		'307' => 'Temporary Redirect',
		'400' => 'Bad Request',
		'401' => 'Unauthorized',
		'402' => 'Payment Required',
		'403' => 'Forbidden',
		'404' => 'Not Found',
		'405' => 'Method Not Allowed',
		'406' => 'Not Acceptable',
		'409' => 'Conflict',
		'410' => 'Gone',
		'411' => 'Length Required',
		'412' => 'Precondition Failed',
		'413' => 'Request Entity Too Large',
		'414' => 'Request-URI Too Long',
		'415' => 'Unsupported Media Type',
		'416' => 'Requested Range Not Satisfiable',
		'417' => 'Expectation Failed',
		'500' => 'Internal Server Error',
		'501' => 'Not Implemented',
		'503' => 'Service Unavailable'
		);
	
	
	// CONSTRUCTEUR
	public function __construct($arg_cache_dir = null)
	{
		$this->registered_headers	= array();
		$this->page_headers			= array();
		$this->page_headers_ordered	= array();
		$this->page_views			= array();
		$this->page_views_ordered	= array();
		$this->page_scripts			= array();
		
		$this->templates_vars		= array();
		
		$this->msg_information		= array();
		$this->msg_success			= array();
		$this->msg_alert			= array();
    }
	
	
	// PAGE HEADERS
	public function useHeader($arg_key, $arg_order = 0)
	{
		$context = "Response.useHeader";
		TRACE::trace_var($context, "arg_key", $arg_key, self::$TRACE_RESPONSE);
		TRACE::trace_var($context, "arg_order", $arg_order, self::$TRACE_RESPONSE);
		
		// HEADER IS REGISTERED
		if ( $this->hasHeader($arg_key) )
		{
			TRACE::step($context, "has header", self::$TRACE_RESPONSE);
			
			// CHECK ORDER
			if ( ! is_int($arg_order ) )
			{
				TRACE::trace_var($context, "arg_order not int", $arg_order, self::$TRACE_RESPONSE_ERROR);
				$arg_order = self::$ORDER_MIN;
			}
			if ($arg_order < self::$ORDER_MIN)
			{
				TRACE::trace_var($context, "arg_order < min", $arg_order, self::$TRACE_RESPONSE_ERROR);
				$arg_order = self::$ORDER_MIN;
			}
			if ($arg_order > self::$ORDER_MAX)
			{
				TRACE::trace_var($context, "arg_order > max", $arg_order, self::$TRACE_RESPONSE_ERROR);
				$arg_order = self::$ORDER_MAX;
			}
			
			// GET REGISTERED HEADER
			$header = $this->getHeader($arg_key);
			TRACE::trace_var($context, "header", $header, self::$TRACE_RESPONSE);
			if ( is_null($header) or $header == "" )
			{
				return TRACE::leaveko($context, "null header key [$arg_key]", false, self::$TRACE_RESPONSE_ERROR);
			}
			
			// USE HEADER
			if ( ! in_array($header, $this->page_headers) )
			{
				// USE HEADER
				$this->page_headers[] = $header;
				
				// UPDATE ORDERED HEADERS
				if ( ! array_key_exists($arg_order, $this->page_headers_ordered) )
				{
					$this->page_headers_ordered[$arg_order] = array();
				}
				$this->page_headers_ordered[$arg_order][] = $header;
			}
			
			return TRACE::leaveok($context, "header found for key [$arg_key]", true, self::$TRACE_RESPONSE_LEAVE_OK);
		}
		return TRACE::leaveko($context, "bad header key [$arg_key]", false, self::$TRACE_RESPONSE_ERROR);//self::$TRACE_RESPONSE
	}
	
	public function hasHeaders()
	{
		return (! is_null($this->registered_headers) ) and count( $this->registered_headers ) > 0;
	}
	
	public function getHeaders()
	{
		return $this->registered_headers;
	}
	
	public function hasHeader($arg_key)
	{
		return array_key_exists($arg_key, $this->registered_headers);
	}
	
	public function getHeader($arg_key)
	{
		return array_key_exists($arg_key, $this->registered_headers) ? $this->registered_headers[$arg_key] : null;
	}
	
	public function addHeader($arg_key, $arg_value)
	{
		$this->registered_headers[$arg_key] = $arg_value;
		return true;
	}
	
	public function addHeaderRedirection($arg_key, $arg_value)
	{
		// TODO
		$this->registered_headers[$arg_key] = "Location: ".$arg_value;
		return true;
	}
	
	public function addHeaderCss($arg_key, $arg_url, $arg_media = "screen", $arg_type = "text/css")
	{
		$this->registered_headers[$arg_key] = "<link type=\"$arg_type\" href=\"$arg_url\"	rel=\"stylesheet\" media=\"$arg_media\" />";
		return true;
	}
	
	public function addHeaderScript($arg_key, $arg_url_or_inline, $arg_type = "text/javascript", $arg_inline = false)
	{
		if ($arg_inline === true)
		{
			$this->registered_headers[$arg_key] = "<script type=\"$arg_type\">$arg_url_or_inline</script>";
		}
		else
		{
			$this->registered_headers[$arg_key] = "<script type=\"$arg_type\" src=\"$arg_url_or_inline\"> </script>";
		}
		return true;
	}
	
	public function setContentType($arg_content_type)
	{
		$meta = "<meta http-equiv='Content-Type' content='".$arg_content_type."' />";
		return $this->addHeader("Content-Type", $meta);
	}
	
	public function setPredefinedContentType($arg_code)
	{
		if ( array_key_exists($arg_code, self::$PREDIFINED_CONTENT_TYPE) )
		{
			return $this->setContentType(self::$PREDIFINED_CONTENT_TYPE[$arg_code]);
		}
		
		
		// TODO 
		echo "setPredefinedContentType($arg_code) not found<br>";
		
		
		return false;
	}
	
	
	// VIEWS
	public function hasViews()
	{
		return (! is_null($this->views) ) and count( $this->views ) > 0;
	}
	
	public function getViews()
	{
		return $this->views;
	}
	
	public function hasView($arg_key)
	{
		return array_key_exists($arg_key, $this->views);
	}
	
	public function getView($arg_key)
	{
		return array_key_exists($arg_key, $this->views) ? $this->views[$arg_key] : null;
	}
	
	public function addView($arg_key, $arg_value)
	{
		$this->page_views_ordered[] = $arg_value;
		$this->views[$arg_key] = $arg_value;
		return true;
	}
	
	
	// SCRIPTS
	public function hasScripts()
	{
		return (! is_null($this->page_scripts) ) and count( $this->page_scripts ) > 0;
	}
	
	public function getScripts()
	{
		return $this->page_scripts;
	}
	
	public function hasScript($arg_key)
	{
		return array_key_exists($arg_key, $this->page_scripts);
	}
	
	public function getScript($arg_key)
	{
		return array_key_exists($arg_key, $this->page_scripts) ? $this->page_scripts[$arg_key] : null;
	}
	
	public function addScript($arg_key, $arg_value, $arg_type = "text/javascript")
	{
		$context = "Response.addScript($arg_key, $arg_value, $arg_type)";
		
		if ( array_key_exists($arg_key, $this->page_scripts) )
		{
			$script = $this->page_scripts[$arg_key];
//			TRACE::trace_var($context, "existing script", $script, self::$TRACE_RESPONSE);
			if ( $script["type"] == $arg_type )
			{
				$script["source"] .= $arg_value;
			}
			$this->page_scripts[$arg_key] = $script;
		}
		else
		{
			$this->page_scripts[$arg_key] = array("type" => $arg_type, "source" => $arg_value);
//			TRACE::trace_var($context, "non existing script", $this->page_scripts[$arg_key], self::$TRACE_RESPONSE);
		}
		
		return true;
	}
	
	public function addScriptFromFile($arg_key, $arg_file_path_name, $arg_type = "text/javascript")
	{
		$context = "Response.addScriptFromFile($arg_key, $arg_file_path_name, $arg_type)";
		
		if ( ! file_exists($arg_file_path_name) )
		{
			return TRACE::leaveko($context, "File does not exists [".$arg_file_path_name."]", false, true);
		}
		
		// OPEN FILE
		$file = new SplFileObject($arg_file_path_name, 'r');
		$buffer = "";
		while ( ! $file->eof() )
		{
			$buffer .= $file->fgets();
		}
		$this->page_scripts[$arg_key] = array("type" => $arg_type, "source" => $buffer);
		return true;
	}
	
	
	// TEMPLATES VARIABLES
	public function hasTemplatesVars()
	{
		return (! is_null($this->templates_vars) ) and count( $this->templates_vars ) > 0;
	}
	
	public function getTemplatesVars()
	{
		return $this->templates_vars;
	}
	
	public function hasTemplatesVar($arg_key)
	{
		return array_key_exists($arg_key, $this->templates_vars);
	}
	
	public function getTemplatesVar($arg_key)
	{
		return array_key_exists($arg_key, $this->templates_vars) ? $this->templates_vars[$arg_key] : null;
	}
	
	public function addTemplatesVar($arg_key, $arg_value)
	{
		$this->templates_vars[$arg_key] = $arg_value;
		return true;
	}
	
	
	// COOKIES VARIABLES
	public function setCookieData($arg_key, $arg_data, $arg_expiration_hours = 864000) // 864000 = (10*24*60*60) = 10 days
	{
		setcookie($arg_key, $arg_data, time() + $arg_expiration_hours); 
	}
	
	public function setCookieDataExtended($arg_key, $arg_data, $arg_expiration_hours = 864000, $arg_domain = LIBAPT_APP_DOMAIN, $arg_path = "/", $arg_https_only = false, $arg_http_only = true)
	{
		setcookie($arg_key, $arg_data, time() + $arg_expiration_hours, $arg_domain, $arg_path, $arg_https_only, $arg_http_only); 
	}
	
	public function deleteCookieData($arg_key)
	{
		setcookie($arg_key, "", time() - 3600);
	}
	
	
	// RESPONSE OPERATIONS
	public function setStatus($arg_code)
	{
		$status_key = strval($arg_code);
		$status = $arg_code." ".$this->PREDIFINED_STATUS[$status_key];
		$this->http_status = "{$_SERVER['SERVER_PROTOCOL']} $status";
	}
	
	public function generateHtmlStatus()
	{
		if ( ! is_null($this->http_status) )
		{
			header($this->http_status);
		}
	}
	
	// public function generateHtmlContentType($arg_content_type_code)
	// {
		// $context = "RESPONSE::generateHtmlContentType($arg_content_type_code)";
		// TRACE::step($context, "", self::$TRACE_RESPONSE);
		
		// if ( array_key_exists($arg_content_type_code, self::$PREDIFINED_CONTENT_TYPE) )
		// {
			// $arg_content_type = self::$PREDIFINED_CONTENT_TYPE[$arg_content_type_code];
			// $meta = "<meta http-equiv='Content-Type' content='".$arg_content_type."' />";
			// TRACE::trace_var($context, "meta", $meta, self::$TRACE_RESPONSE);
			// header($meta);
			// echo $meta;
			// HTML::addBufferLine($meta);
		// }
	// }
	
	public function redirect404($arg_key, $arg_value)
	{
		$this->addHeaderData("error 404", "HTTP/1.0 404 Not Found");
		// TODO 404
//		$this->addView(...)
	}
	
	public function generateHtmlHeaders($arg_scripts = true)
	{
		$context = "Response.generateHtmlHeaders";
		
		// PREPARE VIEWS HEADERS
		foreach($this->page_views_ordered as $view_object)
		{
			$view_object->declareHtmlHeaders();
		}
		
		// GENERATE HTML CODE
		$str = "";
		for($index = self::$ORDER_MIN ; $index <= self::$ORDER_MAX ; ++$index)
		{
			if ( ! array_key_exists($index, $this->page_headers_ordered) )
			{
				continue;
			}
			$order_headers = $this->page_headers_ordered[$index];
			foreach($order_headers as $header_str)
			{
				if ( ! $arg_scripts)
				{
					$prefix = "<script ";
					if ( strncmp($header_str, $prefix, strlen($prefix)) == 0 )
					{
						continue;
					}
				}
				
				$str .= $header_str."\n";
			}
		}
		return $str;
	}
	
	public function generateHtmlHeadersScriptsOnly()
	{
		$context = "Response.generateHtmlHeadersScriptsOnly";
		
		// PREPARE VIEWS HEADERS
		// foreach($this->page_views_ordered as $view_object)
		// {
			// $view_object->declareHtmlHeaders();
		// }
		
		// GENERATE HTML CODE
		$str = "";
		$prefix = "<script ";
		for($index = self::$ORDER_MIN ; $index <= self::$ORDER_MAX ; ++$index)
		{
			if ( ! array_key_exists($index, $this->page_headers_ordered) )
			{
				continue;
			}
			$order_headers = $this->page_headers_ordered[$index];
			if (count($order_headers) <= 0)
			{
				continue;
			}
			
			foreach($order_headers as $header_str)
			{
				if ( strncmp($header_str, $prefix, strlen($prefix)) == 0 )
				{
					$str .= $header_str."\n";
				}
			}
		}
		
		return $str;
	}
	
	public function generateHtmlViews()
	{
/*		if ( $this->hasTemplatesVars() )
		{
			extract($this->templates_vars);
		}*/
		foreach($this->page_views_ordered as $view_object)
		{
			$view_object->html();
		}
	}
	
	public function generateHtmlScripts()
	{
		HTML::addBufferLine("<SCRIPT type='text/javascript'>");
			$js_code = JSWRAPPER::initResourcesToLoad(true);
			HTML::addBufferLine($js_code);
		HTML::addBufferLine("</SCRIPT>");
		$this->addScript(Response::$JS_DOC_READY, "Libapt.init();");
		
		foreach($this->page_scripts as $key=>$script_record)
		{
			$type = $script_record["type"];
			$source = $script_record["source"];
			if ( $key == self::$JS_DOC_READY )
			{
				$source = "$(document).ready( function() {\n" . $source . "}\n );\n";
			}
			HTML::addBufferLine("<SCRIPT type='".$type."'>");
			HTML::addBufferLine($source);
			HTML::addBufferLine("</SCRIPT>");
		}
	}
	
	public function generateHtmlPage($arg_view)
	{
		$context = "Response::generateHtmlPage()";
		
		CONTRACT::assertNotNull($context.".arg_view", $arg_view);
		$page_layout_class = Application::getInstance()->getDefaultPageLayoutViewClass();
		CONTRACT::assertClassName($context.".page_layout_class", $page_layout_class);
		
		$page_layout_view = new $page_layout_class("layout", null, array(DefaultPageLayoutView::$OPTION_CONTENT_VIEW_OBJECT => $arg_view) );
		CONTRACT::assertNotNull($context.".page_layout_view", $page_layout_view);
		
		$page_layout_view->html();
	}
	
	public function generateHtmlErrorPage()
	{
		$context = "Response::generateHtmlErrorPage()";
		
		$page_layout_class = Application::getInstance()->getDefaultPageLayoutViewClass();
		CONTRACT::assertClassName($context.".page_layout_class", $page_layout_class);
		
		$options = array(DefaultPageLayoutView::$OPTION_CONTENT_VIEW_OBJECT => $this, DefaultPageLayoutView::$OPTION_CONTENT_IS_ERROR => true);
		$page_layout_view = new $page_layout_class("layout", null, $options);
		CONTRACT::assertNotNull($context.".page_layout_view", $page_layout_view);
		
		$page_layout_view->html();
	}
	
	public function generateHtmlLoginPage()
	{
		$context = "Response::generateHtmlLoginPage()";
		
		$page_layout_class = Application::getInstance()->getDefaultPageLayoutViewClass();
		CONTRACT::assertClassName($context.".page_layout_class", $page_layout_class);
		
		$options = array(DefaultPageLayoutView::$OPTION_CONTENT_VIEW_OBJECT => $this, DefaultPageLayoutView::$OPTION_CONTENT_IS_LOGIN => true);
		$page_layout_view = new $page_layout_class("layout", null, $options);
		CONTRACT::assertNotNull($context.".page_layout_view", $page_layout_view);
		
		$page_layout_view->html();
	}
	
	public function generateHtmlView($arg_view)
	{
		$context = "Response::generateHtmlView()";
		
		CONTRACT::assertNotNull($context.".arg_view", $arg_view);
		
		HTML::useStandardHeaders();
		
		HTML::resetBuffer();
		
		HTML::addBufferLine("\n<!-- ************************************************************************************* -->");
		HTML::addBufferLine("<!-- BEGIN OF HEADERS -->");
		HTML::addBufferLine($this->generateHtmlHeaders(false) );
		HTML::addBufferLine("<!-- END OF HEADERS -->");
		HTML::addBufferLine("<!-- ************************************************************************************* -->");
		
		$arg_view->html();
		
		// CONTRACT::assertNotNull($context.".arg_view", $arg_view);
		// $page_layout_class = Application::getInstance()->getDefaultPageLayoutViewClass();
		// CONTRACT::assertClassName($context.".page_layout_class", $page_layout_class);
		
		// $page_layout_view = new $page_layout_class("layout", null, array(DefaultPageLayoutView::$OPTION_CONTENT_VIEW_OBJECT => $arg_view) );
		// CONTRACT::assertNotNull($context.".page_layout_view", $page_layout_view);
		
		// $page_layout_view->html();
		
		
		HTML::addBufferLine("\n<!-- ************************************************************************************* -->");
		HTML::addBufferLine("<!-- BEGIN OF HEADERS SCRIPTS -->");
		HTML::addBufferLine($this->generateHtmlHeadersScriptsOnly() );
		HTML::addBufferLine("<!-- END OF HEADERS SCRIPTS -->");
		HTML::addBufferLine("<!-- ************************************************************************************* -->");
		
		HTML::addBufferLine("\n<!-- ************************************************************************************* -->");
		HTML::addBufferLine("<!-- BEGIN OF INLINE SCRIPTS -->");
		$this->generateHtmlScripts();
		HTML::addBufferLine("<!-- END OF INLINE SCRIPTS -->");
		HTML::addBufferLine("<!-- ************************************************************************************* -->");
		
		
		HTML::echoBufferAndReset();
	}
	
	
	// MESSAGES
	protected function displayMessagesOf($arg_messages, $arg_box_id)
	{
		$text = "";
		foreach($arg_messages as $msg)
		{
			$text .= "<P>" . $msg . "<P>";
		}
		
		$text .= "<a href='' class='close'>&times;</a>";
		
		echo "<script type='text/javascript'>\n";
			echo "$(function(){\n";
				echo "$('#".$arg_box_id."').css('visibility', 'visible');\n";
				echo "$('#".$arg_box_id."').css('display', 'block');\n";
				echo "$('#".$arg_box_id."').html(\"".$text."\");\n";
				
				echo "$('#".$arg_box_id."').fadeOut('slow',function(){ \n";
					echo "  $(this).fadeIn('slow');\n";
				echo "});\n";
			echo "});\n";
		echo "</script>\n";
	}
	
	public function displayMessages()
	{
//		$this->addMessageAlert("hello info 1");
//		 $this->addMessageInformation("hello info 2");
//		 $this->addMessageInformation("hello info 4");
//		 $this->addMessageSuccess("hello info 3");
		
		// ALERT MESSAGES
		if ( count($this->msg_alert) > 0 )
		{
			$this->displayMessagesOf($this->msg_alert, "apt_msg_box_alert");
		}
		
		// SUCCESS MESSAGES
		if ( count($this->msg_success) > 0 )
		{
			$this->displayMessagesOf($this->msg_success, "apt_msg_box_success");
		}
		
		// INFORMATIONS MESSAGES
		if ( count($this->msg_information) > 0 )
		{
			$this->displayMessagesOf($this->msg_information, "apt_msg_box");
		}
	}
	
	public function addMessageInformation($arg_msg)
	{
		$this->msg_information[] = $arg_msg;
	}
	
	public function addMessageSuccess($arg_msg)
	{
		$this->msg_success[] = $arg_msg;
	}
	
	public function addMessageAlert($arg_msg)
	{
		$this->msg_alert[] = $arg_msg;
	}
}
?>