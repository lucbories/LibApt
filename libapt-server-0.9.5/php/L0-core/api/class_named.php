<?php
/**
 * @file        class_named.php
 * @brief       Base class for named objects
 * @details     ...
 * @see			
 * @ingroup     L0_CORE
 * @date        2012-11-18
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 * 
 */
class Named
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not
	static public $TRACE_NAMED = false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		the name of the named object
	protected $name = null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name		unique name of the object
	 * @return		nothing
	 */
	protected function __construct($arg_name)
	{
		$context = get_class($this).".Named.__construct";
		TRACE::enter($context, "($arg_name)", self::$TRACE_NAMED);
		
		$this->name = $arg_name;
	}
	
	
	
	// ----------------- OPERATION ON NAME ATTRIBUTE -----------------
	
	/**
	 * @brief		get the name
	 * @return		string			name
	 */
	public function getName()
	{
		return $this->name;
	}
	
	/**
	 * @brief		set the name
	 * @param		arg_name		name (string)
	 * @return		nothing
	 */
	protected function setName($arg_name)
	{
		$this->name = $arg_name;
	}
	
	/**
	 * @brief		get a name
	 * @param		arg_suffixed_name		suffixed name (string)
	 * @param		arg_sep					separator, default='_' (string)
	 * @return		string					full name (this.name + separator + suffixed name)
	 */
	public function getUniqueName($arg_suffixed_name, $arg_sep = "_")
	{
		return $this->getName() . $arg_sep . $arg_suffixed_name;
	}
	
	
	/**
	 * @brief		dump the object
	 * @return		string			dump of this object
	 */
	public function __toString()
	{
		return is_null($this->name) ? "[Named object : null name]" : "[Named object : ".$this->name."]";
	}
}
?>