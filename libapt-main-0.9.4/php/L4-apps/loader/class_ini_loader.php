<?php
/**
 * @version		$Id: class_init_loader.php 2012-09-25 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/loaders
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 */
final class IniLoader
{
	// STATIC ATTRIBUTES
	static public $TRACE_INI_LOADER = false;
	static public $EOL = "\n";
	static public $CLASS_TYPE = "class_type";
	

	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// LOAD OBJECTS DEFINITIONS FROM A INI FILE
	static public function loadIniFile($arg_file_path_name, $arg_header_definition_name, $arg_adapter)
	{
		$context = "IniLoader.loadIniFile($arg_file_path_name, $arg_header_definition_name, arg_adapter)";
		TRACE::enter($context, "", self::$TRACE_INI_LOADER);
		
		// CHECK ADAPTER
		if ( is_null($arg_adapter) || ! $arg_adapter instanceof AbstractLoaderAdapter )
		{
			return TRACE::leaveko($context, "bad loader adapter", false, self::$TRACE_INI_LOADER);
		}
		
		// CHECK HEADER DEFINITION NAME
		if ( is_null($arg_header_definition_name) || $arg_header_definition_name == "" )
		{
			return TRACE::leaveko($context, "bad header definition name", false, self::$TRACE_INI_LOADER);
		}
		
		// PARSE INI FILE
		$resources_records = parse_ini_file($arg_file_path_name, true);
		if ( $resources_records === false )
		{
			return TRACE::leaveko($context, "parsing error", false, self::$TRACE_INI_LOADER);
		}
		
		// GET THE CONFIGS ARRAYS
		$records_count = count($resources_records);
		if ($records_count < 1)
		{
			// EMPTY CSV FILE
			return TRACE::leaveok($context, "file is empty", true, self::$TRACE_INI_LOADER);
		}
		
		// LOOP ON EACH RESOURCE DEFINITION RECORDS
		$build_resources = array();
		foreach($resources_records as $key =>$resource_records)
		{
			if ( array_key_exists($key, $build_resources) )
			{
				continue;
			}
			
			$resource_to_clone = null;
			TRACE::trace_var($context, "loop.key", $key, self::$TRACE_INI_LOADER);
			TRACE::trace_var($context, "loop.resource_records", $resource_records, self::$TRACE_INI_LOADER);
			if ( ! array_key_exists($arg_header_definition_name, $resource_records) )
			{
				$resource_records[$arg_header_definition_name] = $key;
			}
			if ( array_key_exists("resource_to_clone", $resource_records) )
			{
				TRACE::step($context, "resource_to_clone exists", self::$TRACE_INI_LOADER);
				
				$resource_to_clone = $resource_records["resource_to_clone"];
				TRACE::trace_var($context, "resource_to_clone", $resource_to_clone, self::$TRACE_INI_LOADER);
				
				if ( ! array_key_exists($resource_to_clone, $build_resources) )
				{
					TRACE::step($context, "build resource_to_clone", self::$TRACE_INI_LOADER);
					$resource_to_clone_records = $resources_records[$resource_to_clone];
					if ( ! array_key_exists($arg_header_definition_name, $resource_to_clone_records) )
					{
						$resource_to_clone_records[$arg_header_definition_name] = $resource_to_clone;
					}
					if ( ! $arg_adapter->buildObjectFromRecord( utf8_convert($resource_to_clone_records), null) )
					{
						TRACE::step($context, "build failed for resource_to_clone [$resource_to_clone]", self::$TRACE_INI_LOADER);
						return TRACE::leaveko($context, "failed to build an object for [".$resource_to_clone."]", false, self::$TRACE_INI_LOADER);
					}
					$build_resources[$resource_to_clone] = true;
				}
			}
			if ( ! $arg_adapter->buildObjectFromRecord( utf8_convert($resource_records), $resource_to_clone) )
			{
				TRACE::step($context, "build failed for [$key]", self::$TRACE_INI_LOADER);
				return TRACE::leaveko($context, "failed to build an object for [".$key."]", false, self::$TRACE_INI_LOADER);
			}
			$build_resources[$key] = true;
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_INI_LOADER);
	}
	
	static public function writeIniFile($arg_file_path_name, $arg_header_definition_names, $arg_records, $arg_default_record_type)
	{
		$context = "IniLoader.writeIniFile";
		TRACE::trace_var($context, "arg_file_path_name", $arg_file_path_name, self::$TRACE_INI_LOADER);
		TRACE::enter($context, "", self::$TRACE_INI_LOADER);
		
		// CHECK HEADER DEFINITION NAMES
		if ( is_null($arg_header_definition_names) || ! is_array($arg_header_definition_names) )
		{
			return TRACE::leaveko($context, "bad header definition names", false, self::$TRACE_INI_LOADER);
		}
		foreach($arg_header_definition_names as $key => $value)
		{
			if ( is_null($value) || $value == "" )
			{
				return TRACE::leaveko($context, "bad header definition name for key [$key]", false, self::$TRACE_INI_LOADER);
			}
		}
		
		// CHECK RECORDS
		if ( is_null($arg_records) || ! is_array($arg_records) )
		{
			return TRACE::leaveko($context, "bad records array", false, self::$TRACE_INI_LOADER);
		}
		$records_count = count($arg_records);
		if ($records_count <= 0)
		{
			return TRACE::leaveko($context, "empty records array", false, self::$TRACE_INI_LOADER);
		}
		foreach($arg_records as $key => $value)
		{
			if ( ! is_array($value) )
			{
				return TRACE::leaveko($context, "records value for key [$key] is not an array", false, self::$TRACE_INI_LOADER);
			}
		}
		
		// CREATE EMPTY INI FILE
		if ( is_file($arg_file_path_name) && ! is_writable($arg_file_path_name) )
		{
			return TRACE::leaveko($context, "file not writable for [".$arg_file_path_name."]", false, self::$TRACE_INI_LOADER);
		}
		else
		{
			if ( ! is_writable( dirname($arg_file_path_name) ) )
			{
				return TRACE::leaveko($context, "directory not writable for [".$arg_file_path_name."]", false, self::$TRACE_INI_LOADER);
			}
		}
		$file = new SplFileObject($arg_file_path_name, 'w');
		if ( is_null($file) )
		{
			return TRACE::leaveko($context, "file object creation failed for [".$arg_file_path_name."]", false, self::$TRACE_INI_LOADER);
		}
		
		// WRITE DATAS
		$written_categories = array();
		foreach($arg_records as $def_key => $def_record)
		{
			// GET DEFINITION TYPE
			$type = $arg_default_record_type;
			if ( array_key_exists(self::$CLASS_TYPE, $def_record) )
			{
				$type = $def_record[self::$CLASS_TYPE];
			}
			if ( is_null($type) || $type == "" )
			{
				return TRACE::leaveko($context, "type not found for definition [$def_key]", false, self::$TRACE_INI_LOADER);
			}
			
			// GET DEFINITION NAME
			if ( ! array_key_exists($type, $arg_header_definition_names) )
			{
				return TRACE::leaveko($context, "definition item name not found for type [$type]", false, self::$TRACE_INI_LOADER);
			}
			$def_item_name = $arg_header_definition_names[$type];
			$def_item_value = $def_record[$def_item_name];
			if ( is_null($def_item_value) || $def_item_value == "" )
			{
				return TRACE::leaveko($context, "bad definition item value for name [$def_item_name]", false, self::$TRACE_INI_LOADER);
			}
			$tmp = $def_item_value;
			$tmp_index = 1;
			while ( array_key_exists($tmp, $written_categories) )
			{
				$tmp = $def_item_value."_".$tmp_index;
				$tmp_index++;
			}
			$def_item_value = $tmp;
			$written_categories[$def_item_value] = true;
			
			$str = "[".$def_item_value."]".self::$EOL;
			$file->fwrite($str);
			$str = str_pad(self::$CLASS_TYPE, 30, " ", STR_PAD_RIGHT) .  "= $type".self::$EOL;
			$file->fwrite($str);
			foreach($def_record as $item_key => $item_value)
			{
				if ( $item_key == self::$CLASS_TYPE )
				{
					continue;
				}
				
//				TRACE::trace_var($context, "item_key", $item_key, self::$TRACE_INI_LOADER);
//				TRACE::trace_var($context, "pos '='", strpos($item_value, "="), self::$TRACE_INI_LOADER);
				if (   strpos($item_value, "=") !== false
					or strpos($item_value, "(") !== false
					or strpos($item_value, ")") !== false
					or strpos($item_value, "{") !== false
					or strpos($item_value, "}") !== false
					or strpos($item_value, "[") !== false
					or strpos($item_value, "]") !== false
					or strpos($item_value, "\n") !== false
					or strpos($item_value, "\r") !== false
					or strpos($item_value, "\t") !== false
					)
				{
					$tmp = trim($item_value);
					if ( substr($tmp, 0, 1) != "\"" )
					{
						$item_value = "\"".$item_value;
					}
					if ( substr($tmp, -1) != "\"" )
					{
						$item_value = $item_value."\"";
					}
				}
				$str = str_pad("$item_key", 30, " ", STR_PAD_RIGHT) .  "= $item_value".self::$EOL;
				$file->fwrite($str);
			}
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_INI_LOADER);
	}
	
	
	// LOAD OBJECTS DEFINITIONS FROM A INI FILE
	static public function loadGenericIniFile($arg_file_path_name, $arg_adapters)
	{
		$context = "IniLoader.loadGenericIniFile";
		
		// CHECK ADAPTER
		if ( is_null($arg_adapters) || ! is_array($arg_adapters) )
		{
			return TRACE::leaveko($context, "bad loader adapters array", false, self::$TRACE_INI_LOADER);
		}
		
		// PARSE INI FILE
		$records = parse_ini_file($arg_file_path_name, true);
		if ( $records === false )
		{
			return TRACE::leaveko($context, "parsing error", false, self::$TRACE_INI_LOADER);
		}
		
		// GET THE CONFIGS ARRAYS
		$records_count = count($records);
		if ($records_count < 1)
		{
			// EMPTY CSV FILE
			return TRACE::leaveok($context, "file is empty", true, self::$TRACE_INI_LOADER);
		}
		
		foreach($records as $key => $record)
		{
//			TRACE::trace_var($context, "loop.key", $key, true);
//			TRACE::trace_var($context, "loop.record", $record, true);
			
			// GET OBJECT TYPE
			if ( ! array_key_exists(self::$CLASS_TYPE, $record) )
			{
				return TRACE::leaveko($context, "no object type in record for [".$key."]", false, self::$TRACE_INI_LOADER);
			}
			$type = $record[self::$CLASS_TYPE];
			
			// GET ADAPTER RECORD
			if ( ! array_key_exists($type, $arg_adapters) )
			{
				return TRACE::leaveko($context, "object type [$type] not found for [".$key."]", false, self::$TRACE_INI_LOADER);
			}
			$adapter_record = $arg_adapters[$type];
			
			// GET ADAPTER OBJECT AND KEY NAME
			if ( ! array_key_exists("adapter", $adapter_record) )
			{
				return TRACE::leaveko($context, "adapter object not found for type [$type] for ressource [".$key."]", false, self::$TRACE_INI_LOADER);
			}
			if ( ! array_key_exists("key_name", $adapter_record) )
			{
				return TRACE::leaveko($context, "key name not found for type [$type] for ressource [".$key."]", false, self::$TRACE_INI_LOADER);
			}
			$adapter  = $adapter_record["adapter"];
			$key_name = $adapter_record["key_name"];
			
			// CREATE RESSOURCE
			$record[$key_name] = $key;
			if ( ! $adapter->buildObjectFromRecord($record) )
			{
				return TRACE::leaveko($context, "failed to build an object for [".$key."]", false, self::$TRACE_INI_LOADER);
			}
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_INI_LOADER);
	}
}
?>