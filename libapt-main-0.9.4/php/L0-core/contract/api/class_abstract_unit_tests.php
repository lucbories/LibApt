<?php
/**
 * @file        class_abstract_unit_tests.php
 * @brief       Abstract class for unit tests
 * @details     define many unit test methods
 * @see			AbstractAssert Named Trace
 * @ingroup     L0_CORE
 * @date        2012-11-17
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractUnitTests extends AbstractAssertImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_name		name of the object
	 * @return		nothing
	 */
	public function __construct($arg_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_name);
		echo "CONSTRUCTOR AbstractTestsUnitaires ".$this->getName()."<BR>";
	}
	
	
	
	// ----------------- ASSERTION FAILURE OR SUCCESS -----------------
	/**
	 * @brief		do an action on assertion success
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @return		object			this object
	 */
	public function assertSuccess($arg_context)
	{
		return $this;
	}
	
	/**
	 * @brief		do an action on assertion failure
	 * @param[in]	arg_context		context or label of the assertion (string)
	 * @return		object			this object
	 */
	public function assertFailure($arg_context)
	{
		die("Unit test failed at [".$arg_context."]\n");
		return $this;
	}
	
	
	
	// ----------------- DO UNIT TEST -----------------
	/**
	 * @brief		do the unit test
	 * @return		result			result of the test (boolean)
	 */
	abstract public function test();
	
	
	
	
	// ----------------- TRACE UNIT TEST -----------------
	// TRACES TEST NAVIGATION
	public function enter($arg_txt)
	{
		echo "<BR><BR>\n\n-----------------------------------------------------------------<BR>\n";
		echo "BEGIN OF TEST [".$arg_txt."]<BR>\n";
		echo "-----------------------------------------------------------------<BR>\n";
		return $this;
	}
	
	public function step($arg_txt)
	{
		echo "\n********* STEP [".$arg_txt."] *********<BR>\n";
		return $this;
	}
	
	public function leave($arg_txt)
	{
		echo "-----------------------------------------------------------------<BR>\n";
		echo "END OF TEST [".$arg_txt."]<BR>\n";
		echo "-----------------------------------------------------------------<BR><BR>\n\n";
		return $this;
	}
	
	
	// TRACE TEST MESSAGE
	public function trace($arg_txt)
	{
		echo "TRACE:".$arg_txt."<BR>\n";
		return $this;
	}
	
	
	// TRACE TEST VARIABLES
	public function trace_var($arg_libelle, $arg_value)
	{
		echo "<CODE>";
		echo "VARIABLE:[".$arg_libelle."]=[".$arg_value."]<BR>\n";
		echo "</CODE>";
		return $this;
	}
	
	public function trace_array($arg_libelle, $arg_array)
	{
		echo "ARRAY:[".$arg_libelle."]=[<BR>\n";
		foreach($arg_array as $key => $value)
		{
			echo "  ITEM:[".$key."]=[".$value."]<BR>\n";
		}
		echo "]<BR>\n";
		return $this;
	}
	
	public function trace_diff($arg_label1, $arg_str1, $arg_label2, $arg_str2, $arg_label3 = "DIFF")
	{
		$label_length = max(strlen($arg_label1), strlen($arg_label2), strlen($arg_label3));
		$label_1 = str_pad($arg_label1, $label_length , "-", STR_PAD_RIGHT);
		$label_2 = str_pad($arg_label2, $label_length , "-", STR_PAD_RIGHT);
		$label_3 = str_pad($arg_label3, $label_length , "-", STR_PAD_RIGHT);
		
		$this->trace_var($label_1, $arg_str1);
		$this->trace_var($label_2, $arg_str2);
		$this->trace_var($label_3, $this->getDiffString($arg_str1, $arg_str2) );
		return $this;
	}
	
	
	// DIFF
	protected function getDiffString($arg_str1, $arg_str2)
	{
		// NULL STRING
		if ( is_null($arg_str1) and ! is_null($arg_str2) )
		{
			return "First string is null";
		}
		if ( ! is_null($arg_str1) and is_null($arg_str2) )
		{
			return "Second string is null";
		}
		if ( is_null($arg_str1) and is_null($arg_str2) )
		{
			return "Two strings are null";
		}
		
		// EMPTY STRING
		if ( $arg_str1 == "" and  $arg_str2 != "" )
		{
			return "First string is empty";
		}
		if ( $arg_str1 != "" and  $arg_str2 == "" )
		{
			return "Second string is empty";
		}
		if ( $arg_str1 == "" and  $arg_str2 == "" )
		{
			return "Two strings are empty";
		}
		
		// OTHER CASES
		$length1 = strlen($arg_str1);
		$length2 = strlen($arg_str2);
		$max_length = max($length1, $length2);
		$diff = "";
		for($i = 0 ; $i < $max_length ; $i++)
		{
			$c1 = $i < $length1 ? $arg_str1[$i] : null;
			$c2 = $i < $length2 ? $arg_str2[$i] : null;
			if ($c1 == $c2)
			{
				$diff .= "-";
			}
			else
			{
				$diff .= "^";
			}
		}
		return $diff;
	}
}
?>