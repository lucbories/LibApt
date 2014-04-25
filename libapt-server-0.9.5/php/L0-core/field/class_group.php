<?php
/**
 * @file        class_group.php
 * @brief       ...
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
class Group
{
	// STATIC ATTRIBUTES
	static public $TRACE = false;
	
	// FIELD DEFINITION ITEMS
	protected $group_field_name = null;
	protected $string_key = null;
	protected $key = null;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_field_name)
	{
		$this->group_field_name = $arg_field_name;
	}
	
	
	
	public function getFieldNameKey()
	{
		return "group_field_name";
	}
	
	public function getFieldName()
	{
		return $this->group_field_name;
	}
	
	
	// STRING KEY
	public function getKey()
	{
		if ($this->key == null)
		{
			$this->updateKey();
		}
		return $this->key;
	}
	
	public function getStringKey()
	{
		if ($this->key == null)
		{
			$this->updateKey();
		}
		return $this->string_key;
	}
	
	public function getURLAttributes()
	{
		return http_build_query( array("group_field_name" => $this->group_field_name) );
	}
	
	protected function updateKey()
	{
		$this->string_key = "GROUP{".$this->getURLAttributes()."}";
		$this->key = md5($this->string_key);
	}
	
	
	// BUILD FROM STRING
	public static function buildGroupFromString($arg_string)
	{
		$context = "Group.buildGroupFromString($arg_string)";
		
		// GET GROUP ATTRIBUTES
		$group_attributes		= explode(",", $arg_string);
		$group_attributes_count	= count($group_attributes);
		CONTRACT::assertTrue($context.".attributes_count", $group_attributes_count == 1); 
		
		// GET GROUP FIELD ATTRIBUTE
		// $group_field_attribute_record = explode("=", $group_attributes[0]);
		// CONTRACT::assertTrue($context.".group_field_attribute_record", count($group_field_attribute_record) == 2); 
		// CONTRACT::assertTrue($context.".group_field_attribute_record[0] == 'field'", $group_field_attribute_record[0] == "field"); 
		// $field_name = $group_field_attribute_record[1];
		$field_name = $group_attributes[0];
		CONTRACT::assertNotEmptyString($context.".field_name", $field_name);
		
		TRACE::trace_var($context, "field_name", $field_name, Group::$TRACE );
		
		return new Group($field_name);
	}
	
	public static function buildGroupsFromString($arg_string)
	{
		$groups_strings = explode("|", $arg_string);
		$groups = array();
		
		foreach($groups_strings as $key => $group_string)
		{
			if ( ! is_null($group_string) && $group_string != "" )
			{
				TRACE::trace_var("buildGroupsFromString", "group_string", $group_string, Group::$TRACE );
				$group = Group::buildGroupFromString($group_string);
				if ( ! is_null($group) )
				{
					$groups[] = $group;
				}
			}
		}
		
		return $groups;
	}
}
?>