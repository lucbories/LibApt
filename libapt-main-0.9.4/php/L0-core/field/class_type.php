<?php
/**
 * @file        class_type.php
 * @brief       Manage type of fields, options...
 * @details     Types repository, value conversions
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class TYPE
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not
	static public $TRACE_TYPE		= false;
	
	
	/// @brief		Type object
	static public $TYPE_OBJECT		= "Object";
	
	/// @brief		Type null
	static public $TYPE_NULL		= "Null";
	
	/// @brief		Type resource
	static public $TYPE_RESOURCE	= "Resource";
	
	/// @brief		Type boolean
	static public $TYPE_BOOLEAN		= "Boolean";
	
	/// @brief		Type integer
	static public $TYPE_INTEGER		= "Integer";
	
	/// @brief		Type float
	static public $TYPE_FLOAT		= "Float";
	
	/// @brief		Type array
	static public $TYPE_ARRAY		= "Array";
	
	/// @brief		Type string
	static public $TYPE_STRING		= "String";
	
	/// @brief		Type rich text
	static public $TYPE_RICHTEXT	= "RichText";
	
	/// @brief		Type expression
	static public $TYPE_EXPRESSION	= "Expression";
	
	/// @brief		Type date
	static public $TYPE_DATE		= "Date";
	
	/// @brief		Type time
	static public $TYPE_TIME		= "Time";
	
	/// @brief		Type datetime
	static public $TYPE_DATETIME	= "DateTime";
	
	/// @brief		Type login
	static public $TYPE_LOGIN		= "Login";
	
	/// @brief		Type email
	static public $TYPE_EMAIL		= "Email";
	
	/// @brief		Type url
	static public $TYPE_URL			= "Url";
	
	/// @brief		Type password
	static public $TYPE_PASSWORD	= "Password";
	
	/// @brief		Type button
	static public $TYPE_BUTTON		= "Button";
	
	/// @brief		Type submot button
	static public $TYPE_SUBMIT		= "Submit";
	
	/// @brief		Type reset button
	static public $TYPE_RESET		= "Reset";
	
	/// @brief		Type cancel button
	static public $TYPE_CANCEL		= "Cancel";
	
	/// @brief		Type select input
	static public $TYPE_SELECT		= "Select";
	
	/// @brief		Type hidden input
	static public $TYPE_HIDDEN		= "Hidden";
	
	/// @brief		Type slider input
	static public $TYPE_SLIDER		= "Slider";
	
	/// @brief		Type spinner input
	static public $TYPE_SPINNER		= "Spinner";
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	// ----------------- TYPES METHOD -----------------
	
	/**
	 * @brief		Get all types array
	 * @return		array of string
	 */
	static public function getTypes()
	{
		return array(
			self::$TYPE_OBJECT,
			self::$TYPE_NULL,
			self::$TYPE_RESOURCE,
			self::$TYPE_BOOLEAN,
			self::$TYPE_INTEGER,
			self::$TYPE_FLOAT,
			self::$TYPE_ARRAY,
			self::$TYPE_STRING,
			self::$TYPE_RICHTEXT,
			self::$TYPE_EXPRESSION,
			self::$TYPE_DATE,
			self::$TYPE_TIME,
			self::$TYPE_DATETIME,
			self::$TYPE_LOGIN,
			self::$TYPE_EMAIL,
			self::$TYPE_URL,
			self::$TYPE_PASSWORD,
			self::$TYPE_BUTTON,
			self::$TYPE_SUBMIT,
			self::$TYPE_RESET,
			self::$TYPE_CANCEL,
			self::$TYPE_SELECT,
			self::$TYPE_HIDDEN,
			self::$TYPE_SLIDER,
			self::$TYPE_SPINNER
		);
	}
	
	
	/**
	 * @brief		Get the type of the given value
	 * @return		string
	 */
	static public function getValueType($arg_value)
	{
		// NULL VALUE
		if ( is_null($arg_value) )
		{
			return self::$TYPE_NULL;
		}
		
		// NO SCALAR TYPES
		if ( is_object($arg_value) )
		{
			return self::$TYPE_OBJECT;
		}
		if ( is_array($arg_value) )
		{
			return self::$TYPE_ARRAY;
		}
		if ( is_resource($arg_value) )
		{
			return self::$TYPE_RESOURCE;
		}
		
		// SCALAR TYPES
		if ( is_bool($arg_value) )
		{
			return self::$TYPE_BOOLEAN;
		}
		if ( is_integer($arg_value) )
		{
			return self::$TYPE_INTEGER;
		}
		if ( is_float($arg_value) )
		{
			return self::$TYPE_FLOAT;
		}
		if ( is_string($arg_value) )
		{
			if ( is_numeric($arg_value) )
			{
				if ( ctype_digit($arg_value) )
				{
					return self::$TYPE_INTEGER;
				}
				if ( $arg_value == "true" or $arg_value == "false" or $arg_value == "TRUE" or $arg_value == "FALSE" )
				{
					return self::$TYPE_BOOLEAN;
				}
				return self::$TYPE_FLOAT;
			}
			
			return self::$TYPE_STRING;
		}
		
		// UNKNOW TYPE
		return null;
	}
	
	
	/**
	 * @brief		Check if the value is a valid datetime value
	 * @param[in]	arg_value				the input value (string)
	 * @param[in]	arg_format_patterns		the datetime patterns to check again (array of string)
	 * @return		boolean					true: value format is valid, false: bad value format
	 */
	static public function checkValueTypeDateTime($arg_value, $arg_format_patterns	= null)
	{
		// CHECK VALUE
		if ( is_null($arg_value) || $arg_value == "" )
		{
			return false;
		}
		
		// CHECK PATTERNS
		$patterns = $arg_format_patterns;
		if ( is_null($arg_format_patterns) || $arg_format_patterns == "" )
		{
			// AAAA-MM-DD HH:MM:SS / H:MM:SS / HH:MM / H:MM
			$pattern1 = "/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{1,2}:[0-9]{2}[:[0-9]{2}]?$/";
			
			// AAAA/MM/DD HH:MM:SS / H:MM:SS / HH:MM / H:MM
			$pattern2 = "/^[0-9]{4}/[0-9]{2}/[0-9]{2} [0-9]{1,2}:[0-9]{2}[:[0-9]{2}]?$/";
			
			// DD-MM-AAAA HH:MM:SS / H:MM:SS / HH:MM / H:MM
			$pattern3 = "/^[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{1,2}:[0-9]{2}[:[0-9]{2}]?$/";
			
			// DD/MM/AAAA HH:MM:SS / H:MM:SS / HH:MM / H:MM
			$pattern4 = "/^[0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{1,2}:[0-9]{2}[:[0-9]{2}]?$/";
			
			$patterns = array($pattern1, $pattern2, $pattern3, $pattern4);
		}
		if ( is_string($arg_format_patterns) )
		{
			$patterns = array($arg_format_patterns);
		}
		
		return self::checkValuePatterns($arg_value, $patterns);
	}
	
	
	/**
	 * @brief		Check if the value is a valid time value
	 * @param[in]	arg_value				the input value (string)
	 * @param[in]	arg_format_patterns		the time pattern to check again (array of string)
	 * @return		boolean					true: value format is valid, false: bad value format
	 */
	static public function checkValueTypeTime($arg_value, $arg_format_patterns	= null)
	{
		// CHECK VALUE
		if ( is_null($arg_value) || $arg_value == "" )
		{
			return false;
		}
		
		// CHECK PATTERNS
		$patterns = $arg_format_patterns;
		if ( is_null($arg_format_patterns) || $arg_format_patterns == "" )
		{
			// HH:MM:SS , HH:MM , H:MM:SS , H:MM 
			$pattern1 = "/^[0-9]{1,2}:[0-9]{2}[:[0-9]{2}]?$/";
			$pattern2 = "/^[0-9]{1,2}h[0-9]{2}[m[0-9]{2}s]?$/";
			$patterns = array($pattern1, $pattern2);
		}
		if ( is_string($arg_format_patterns) )
		{
			$patterns = array($arg_format_patterns);
		}
		
		return self::checkValuePatterns($arg_value, $patterns);
	}
	
	
	/**
	 * @brief		Check if the value is a valid date value
	 * @param[in]	arg_value				the input value (string)
	 * @param[in]	arg_format_patterns		the date pattern to check again (array of string)
	 * @return		boolean					true: value format is valid, false: bad value format
	 */
	static public function checkValueTypeDate($arg_value, $arg_format_patterns	= null)
	{
		// CHECK VALUE
		if ( is_null($arg_value) or $arg_value == "" )
		{
			return false;
		}
		
		
		// CHECK PATTERNS
		$patterns = $arg_format_patterns;
		if ( is_null($arg_format_patterns) || $arg_format_patterns == "" )
		{
			// AAAA-MM-DD
			$pattern1 = "/[0-9]{4}-[0-9]{2}-[0-9]{2}/";
			
			// AAAA/MM/DD
			$pattern2 = "/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/";
			
			// DD-MM-AAAA
			$pattern3 = "/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/";
			
			// DD/MM/AAAA
			$pattern4 = "/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/";
			
			$patterns = array($pattern1, $pattern2, $pattern3, $pattern4);
		}
		if ( is_string($arg_format_patterns) )
		{
			$patterns = array($arg_format_patterns);
		}
		
		return self::checkValuePatterns($arg_value, $patterns);
	}
	
	
	/**
	 * @brief		Check if the value has a valid format
	 * @param[in]	arg_value				the input value (string)
	 * @param[in]	arg_patterns			the pattern to check again (array of string)
	 * @return		boolean					true: value format is valid, false: bad value format
	 */
	static public function checkValuePatterns($arg_value, $arg_patterns)
	{
		foreach($arg_patterns as $pattern)
		{
			$result = preg_match($pattern, $arg_value);
			if ($result)
			{
				return true;
			}
		}
		
		return false;
	}
	
	
	/**
	 * @brief		Get the input value as a boolean result
	 * @param[in]	arg_value				the input value (anything)
	 * @param[in]	arg_default				the default value (boolean)
	 * @return		boolean
	 */
	static public function getBooleanValue($arg_value, $arg_default = false)
	{
		if ( is_null($arg_value) )
		{
			return (bool) $arg_default;
		}
		if ( is_bool($arg_value) )
		{
			return (bool) $arg_value;
		}
		if ( is_numeric($arg_value) )
		{
			return (bool) ($arg_value > 0);
		}
		if ( is_string($arg_value) )
		{
			$result = ($arg_value == "1" || strtolower($arg_value) == "true" || $arg_value == "yes" || $arg_value == "y");
			return (bool) ($result ? true : false);
		}
		return (bool) $arg_default;
	}
	
	
	/**
	 * @brief		Get the input value as an integer result
	 * @param[in]	arg_value				the input value (anything)
	 * @param[in]	arg_default				the default value (integer)
	 * @return		integer
	 */
	static public function getIntegerValue($arg_value, $arg_default = 0)
	{
		if ( is_null($arg_value) )
		{
			return (int) $arg_default;
		}
		if ( is_bool($arg_value) )
		{
			return (int) ($arg_value ? 1 : 0);
		}
		if ( is_numeric($arg_value) )
		{
			return (int) $arg_value;
		}
		if ( is_string($arg_value) )
		{
			// TODO PARSE INTEGER
			return (int) ( ($arg_value == "") ? 0 : $arg_value );
		}
		return (int) $arg_default;
	}
	
	
	/**
	 * @brief		Get the input value as a string result (for trace functions)
	 * @param[in]	arg_key					the name of the value (string)
	 * @param[in]	arg_value				the input value (anything)
	 * @param[in]	arg_indent				the indentation index (integer)
	 * @param[in]	arg_eol					the end of line (string)
	 * @param[in]	arg_indent_str			the indentation text (string)
	 * @param[in]	arg_before				a text before the result (string)
	 * @param[in]	arg_after				a text after the result (string)
	 * @return		string
	 */
	static public function getValueString($arg_key, $arg_value, $arg_indent = 0, $arg_eol = "\n", $arg_indent_str = "-", $arg_before = "", $arg_after = "")
	{
		$indent = TRACE::getIndent($arg_indent, $arg_indent_str);
		
		// CHECH KEY
		if ( is_null($arg_key) )
		{
			$arg_key = "null";
		}
		else
		{
			if ( ! is_string($arg_key) && ! is_int($arg_key) && ! is_float($arg_key) )
			{
				$arg_key = "not a string/int/float";
			}
		}
		
		// CHECK VALUE
		if ( is_null($arg_value) )
		{
			return $arg_before.$indent.$arg_key."=null".$arg_after;
		}
		
		if ( $arg_value == "" )
		{
			return $arg_before.$indent.$arg_key."=EMPTY STRING".$arg_after;
		}
		
		if ( is_array($arg_value) )
		{
			$str = $arg_before.$indent.$arg_key."=[".$arg_eol;
			$begin = true;
			foreach($arg_value as $key => $value)
			{
				$str .= ($begin === true) ? "" : ",$arg_eol";
				$str .= Type::getValueString($key, $value, $arg_indent + 1, $arg_eol, $arg_indent_str, $arg_before, $arg_after);
				$begin = false;
			}
			return $str.$arg_after.$arg_eol.$arg_before.$indent."]".$arg_after;
		}
		
		if ( is_object($arg_value) )
		{
			return $arg_before.$indent.$arg_key."=[Object of class ".get_class($arg_value)."]".$arg_after;
		}
		
		if ( is_resource($arg_value) )
		{
			return $arg_before.$indent.$arg_key."=[PHP Resource]".$arg_after;
		}
		
		return $arg_before.$indent.$arg_key."=".$arg_value.$arg_after;
	}
}
?>