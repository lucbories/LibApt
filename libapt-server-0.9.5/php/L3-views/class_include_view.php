<?php
/**
 * @version		$Id: class_include_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class IncludeView extends AbstractViewImpl
{
	// STATIC ATTRIBUTES
	static public $TRACE_INCLUDE_VIEW	= false;
	
	static public $OPTION_FILE_NAME		= "include_file_path_name";
	static public $OPTION_INLINE_PHP	= "include_inline_php";
	static public $OPTION_INLINE_HTML	= "include_inline_html";
	
	// ATTRIBUTES
	protected $file_path_name	= null;
	protected $inline_php		= null;
	protected $inline_html		= null;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
		
		// DECLARE OPTIONS
		$this->registerOption(self::$OPTION_FILE_NAME,		Type::$TYPE_STRING, self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_INLINE_PHP,		Type::$TYPE_STRING, self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		$this->registerOption(self::$OPTION_INLINE_HTML,	Type::$TYPE_STRING, self::$OPTION_NOT_REQUIRED, self::$OPTION_NOT_STORE_SESSION, null);
		
		// INIT ATTRIBUTE
		$this->file_path_name	= $this->getOption(self::$OPTION_FILE_NAME);
		$this->inline_php		= $this->getOption(self::$OPTION_INLINE_PHP);
		$this->inline_html		= $this->getOption(self::$OPTION_INLINE_HTML);
	}
	
	
	// RENDER HTML
	public function declareHtmlHeaders()
	{
		HTML::useStandardHeaders();
	}
	
	public function html()
	{
		$context = "IncludeView.html";
		
		HTML::addBufferLine("\n\n<!-- ************************************************* INCLUDE VIEW BEGIN (".$this->getName().") ************************************************* -->");
		HTML::enterDIV($this->getHtmlId());
		
		// APPEND INLINE HTML
		if ( ! is_null($this->inline_html) )
		{
			HTML::addBuffer($this->inline_html);
		}
		
		// APPEND INLINE PHP
		if ( ! is_null($this->inline_php) )
		{
			eval($this->inline_php);
		}
		
		// NO FILE TO INCLUDE
		if ( is_null($this->file_path_name) )
		{
			HTML::leaveDIV();
			HTML::addBufferLine("<!-- ************************************************* INCLUDE VIEW END NO FILE (".$this->getName().") ************************************************* -->\n\n");
			return;
		}
		
		// FIND FILE
		TRACE::trace_var($context, "file_path_name (default)", $this->file_path_name, self::$TRACE_INCLUDE_VIEW);
		if ( ! file_exists($this->file_path_name) )
		{
			$this->file_path_name = str_replace("/modules/", LIBAPT_APP_MODULES_ROOT, $this->file_path_name);
			TRACE::trace_var($context, "file_path_name (in modules repository)", $this->file_path_name, self::$TRACE_INCLUDE_VIEW);
			if ( ! file_exists($this->file_path_name) )
			{
				return TRACE::leaveko($context, "file path name not found", false, self::$TRACE_INCLUDE_VIEW);
			}
		}
		
		// GET CURRENT LANGUAGE
		$language_code = Application::getInstance()->getHtmlLanguageCode();
		if ( ! is_null($language_code) && $language_code != "")
		{
			if ( file_exists($this->file_path_name.".$language_code") )
			{
				$this->file_path_name .= ".$language_code";
			}
		}
		
		// CHECK FILE ACCESS
		CONTRACT::assertTrue($context.".file is readable", file_exists($this->file_path_name) );
		
		// PHP FILE
		$php_suffix = "php";
		$file_suffix = substr($this->file_path_name, -3);
		if ($file_suffix == $php_suffix)
		{
			ob_start();
			require $this->file_path_name;
			$buffer = ob_get_clean();
			HTML::addBuffer($buffer);
			HTML::leaveDIV();
			HTML::addBufferLine("<!-- ************************************************* INCLUDE VIEW END PHP FILE (".$this->getName().") ************************************************* -->\n\n");
			return;
		}
		
		// HTML OR OTHER FILE
		$handle = @fopen($this->file_path_name, "r");
		CONTRACT::assertTrue($context.".file open failed", $handle !== FALSE);
		while ( ($buffer = fgets($handle, 4096)) !== false)
		{
			HTML::addBuffer($buffer);
		}
		HTML::leaveDIV();
		HTML::addBufferLine("<!-- ************************************************* INCLUDE VIEW END HTML FILE (".$this->getName().") ************************************************* -->\n\n");
		CONTRACT::assertTrue($context.".file read failed", feof($handle) );
		fclose($handle);
	}
}
?>