<?php
/**
 * @file        class_trace.php
 * @brief       Implements the trace api
 * @details     Trace messages to the console or to a file
 * @see			AbstractTrace
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		clean api
 */
final class TRACE extends AbstractTrace
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	/// @brief		Do not trace the leave on success command (boolean)
	static public $DO_NOT_TRACE_LEAVEOK = false;
	/// @brief		Trace the leave on success command (boolean)
	static public $TRACE_LEAVEOK = true;
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	/// @brief		Enable or disable trace on console (boolean)
	public static $USE_ECHO = false;
	
	/// @brief		file path name to trace, null if disabled (string)
	public static $file_path_name = null;
	
	/// @brief		begining of line for console trace (string)
	private static $bol = "<HR>";
	
	/// @brief		end of line for console trace (string)
	private static $eol = "<BR>\n\r";
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR (private)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	// INIT TRACES
	static public function enableEcho()
	{
		self::$USE_ECHO = true;
	}
	
	static public function disableEcho()
	{
		self::$USE_ECHO = false;
	}
	
	static public function enableFile()
	{
		// CHECK ARGS
		if ( is_null(LIBAPT_APP_TRACE_FILE_NAME) or LIBAPT_APP_TRACE_FILE_NAME == "" )
		{
			return false;
		}
		
		// GET ABSOLUTE FILE PATH NAME
		self::$file_path_name = LIBAPT_APP_ROOT."/".LIBAPT_APP_TRACE_FILE_NAME;
		
		// CHECK FILE SYSTEM PERMISSIONS
		if ( is_file(self::$file_path_name) )
		{
			if ( ! is_writable(self::$file_path_name) )
			{
				self::disableFile();
				return false;
			}
			return true;
		}
		if ( ! is_writable( dirname(self::$file_path_name) ) )
		{
				self::disableFile();
				return false;
		}
		return true;
	}
	
	static public function disableFile()
	{
		self::$file_path_name = null;
	}
	
	static public function init()
	{
		if (LIBAPT_APP_TRACE_ECHO == "TRUE")
		{
			TRACE::enableEcho();
		} else {
			TRACE::disableEcho();
		}
		
		if (LIBAPT_APP_TRACE_FILE == "TRUE")
		{
			TRACE::enableFile();
		} else {
			TRACE::disableFile();
		}
		
		set_error_handler( array("Trace", "error_handler") );
	}
	
	static public function error_handler($errno, $errstr, $errfile, $errline)
	{
		switch ($errno) {
			case E_PARSE:
			case E_ERROR:
			case E_CORE_ERROR:
			case E_COMPILE_ERROR:
			case E_USER_ERROR:
				echo "<b>ERROR</b> [$errno] $errstr<br />\n";
				echo "  Fatal error on line $errline of file $errfile";
				echo ", PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";
				echo "Stopping...<br />\n";
				if ( Application::getInstance()->hasTraceStack() )
				{
					self::dump_backtrace();
				}
				exit(1);
				break;
			case E_WARNING:
			case E_USER_WARNING:
			case E_COMPILE_WARNING:
			case E_RECOVERABLE_ERROR:
				if ( Application::getInstance()->hasTraceStack() )
				{
					self::dump_backtrace();
				}
				throw new PHPErrorException("<b>ALERT</b> [$errno] $errstr");
			case E_NOTICE:
			case E_USER_NOTICE:
				if ( Application::getInstance()->hasTraceStack() )
				{
					self::dump_backtrace();
				}
				throw new PHPErrorException("<b>WARNING</b> [$errno] $errstr");
			default:
				throw new PHPErrorException("Unknow kind of error : [$errno] $errstr");
		}
		
		if ( Application::getInstance()->hasTraceStack() )
		{
			self::dump_backtrace();
		}
		
		throw new PHPErrorException("[$errno] $errstr");
		
		/* Ne pas exécuter le gestionnaire interne de PHP */
		return true;
	}
	
	static public function dump_backtrace()
	{
		echo("<HR>");
		$debugs_bt = debug_backtrace();
		array_walk($debugs_bt, array("self", "trace_error"));
	}
	
	static public function trace_error($a, $b)
	{
		foreach($a as $key=>$value)
		{
			$str = Type::getValueString($key, $value, 0, self::$eol, "~", "", "");
			echo "<DIV>".$str."</DIV>\n";
		}
		echo("<HR>");
	}
	
	static public function getIndent($arg_indent, $arg_str = "-")
	{
		if ( is_null($arg_indent) or $arg_indent <= 0 )
		{
			return "";
		}
		
		$arg_indent = ($arg_indent > 20) ? 20 : $arg_indent;
		$indent = "";
		for($i = 0 ; $i < $arg_indent ; $i++)
		{
			$indent .= $arg_str;
		}
		
		return $indent;
	}
	
	static public function getIcon($arg_category)
	{
		if ($arg_category == "DEBUG")
		{
			$icon = LIBAPT_THEMES_COMMON_WWW_URL."apt-icons2/find.png";
			return "<IMG SRC='$icon' text='DEBUG'/>";
		}
		if ($arg_category == "USER")
		{
			$icon = LIBAPT_THEMES_COMMON_WWW_URL."apt-icons2/information.png";
			return "<IMG SRC='$icon' text='USER'/>";
		}
		if ($arg_category == "ALERT")
		{
			$icon = LIBAPT_THEMES_COMMON_WWW_URL."apt-icons2/error.png";
			return "<IMG SRC='$icon' text='ALERT'/>";
		}
		if ($arg_category == "ERROR")
		{
			$icon = LIBAPT_THEMES_COMMON_WWW_URL."apt-icons2/exclamation.png";
			return "<IMG SRC='$icon' text='ERROR'/>";
		}
		
		return $arg_category;
	}
	
	
	// ADD A TRACE MESSAGE
	static public function addMsg($arg_category, $arg_context, $arg_value, $arg_trace_active = true)
	{
		// CHECK IF TRACE IS ENABLED
		if ( ! $arg_trace_active )
		{
			return;
		}
		
		// TRACE ON CONSOLE IF ENABLED
		if (self::$USE_ECHO == true)
		{
			echo TRACE::$bol.$arg_category." : ".$arg_context." : ".$arg_value.TRACE::$eol;
		}
		
		// TRACE INTO FILE IF ENABLED
		if ( ! is_null(self::$file_path_name) )
		{
			$line = "\n[".$arg_category." : ".$arg_context." : ".$arg_value."]\n\r";
			file_put_contents(self::$file_path_name, $line, FILE_APPEND|LOCK_EX);
		}
	}
	
	static public function addDebugMsg($arg_context, $arg_value, $arg_trace_active = true)
	{
		self::addMsg("DEBUG", $arg_context, $arg_value, $arg_trace_active);
	}
	
	static public function addUserMsg($arg_context, $arg_value, $arg_trace_active = true)
	{
		self::addMsg("USER", $arg_context, $arg_value, $arg_trace_active);
	}
	
	static public function addInfoMsg($arg_context, $arg_value, $arg_trace_active = true)
	{
		self::addMsg("INFO", $arg_context, $arg_value, $arg_trace_active);
	}
	
	static public function addAlertMsg($arg_context, $arg_value, $arg_trace_active = true)
	{
		self::addMsg("ALERT", $arg_context, $arg_value, $arg_trace_active);
	}
	
	static public function addErrorMsg($arg_context, $arg_value, $arg_trace_active = true)
	{
		self::addMsg("ERROR", $arg_context, $arg_value, $arg_trace_active);
	}
	
	static public function trace_var($bloc, $label, $value, $arg_trace_active = true)
	{
		self::addDebugMsg($bloc, Type::getValueString($label, $value, 0), $arg_trace_active);
	}
	
	
	// TRACE DEBUG FUNCTIONS STACK
	static public function enter($bloc, $arg_msg = null, $arg_trace_active = true)
	{
		self::addDebugMsg($bloc, "ENTER".( is_null($arg_msg) ? "" : " : ".$arg_msg), $arg_trace_active);
	}
	
	static public function enterWithArgs() // VARIABLE ARGUMENTS COUNT (NEED 3 OR MORE VALUES)
	{
		// CHECK ARGUMENTS COUNT
		$args_count = func_num_args();
		if ($args_count < 3)
		{
			self::enter("TRACE::enterWithArgs bad args count");
			return;
		}
		
		// GET ARGUMENTS
		$args_array			= func_get_args();
		$bloc				= $args_array[0];
		$arg_msg			= $args_array[1];
		$arg_trace_active	= $args_array[2];
		
		// CHECK TRACE ACTIVE
		if ( ! $arg_trace_active )
		{
			return;
		}
		
		// LOOP ON ARGUMENTS
		$args_str = "";
		for($index = 3 ; $index < $args_count ; ++$index)
		{
			$args_array = func_get_arg($index);
			$args_str   .= Type::getValueString("args", $args_array, 0).", ";
		}
		
		// TRACE MSG
		self::addDebugMsg($bloc, "ENTER".( is_null($arg_msg) ? "" : " : ".$arg_msg)."(".$args_str.")", $arg_trace_active);
	}
	
	static public function step($bloc, $arg_msg = null, $arg_trace_active = true)
	{
		self::addDebugMsg($bloc, "STEP".( is_null($arg_msg) ? "" : " : ".$arg_msg), $arg_trace_active);
	}
	
	static public function finish($bloc, $arg_msg = null, $arg_trace_active = true)
	{
		self::addDebugMsg($bloc, "LEAVE".( is_null($arg_msg) ? "" : " : ".$arg_msg), $arg_trace_active);
	}
	
	static public function leave($bloc, $arg_result = true, $arg_msg = null, $arg_trace_ok = false, $arg_trace_active = true)
	{
		if ( ! $arg_trace_active )
		{
			return $arg_result;
		}
		
		if ($arg_result)
		{
			if ($arg_trace_ok)
			{
				return self::leaveok($bloc, "success", $arg_result, $arg_trace_active);
			}
			return $arg_result;
		}
		
		return self::leaveko($bloc, $arg_msg, $arg_result, $arg_trace_active);
	}
	
	static public function leaveok($bloc, $arg_msg = null, $arg_result = true, $arg_trace_active = true)
	{
		self::addDebugMsg($bloc, "LEAVE OK".( is_null($arg_msg) ? "" : " : ".$arg_msg), $arg_trace_active );
		return $arg_result;
	}
	
	static public function leaveko($bloc, $arg_msg = null, $arg_result = false, $arg_trace_active = true)
	{
		self::addDebugMsg($bloc, "LEAVE KO".( is_null($arg_msg) ? "" : " : ".$arg_msg), $arg_trace_active);
		return $arg_result;
	}
}
?>