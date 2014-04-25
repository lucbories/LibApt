<?php
/**
 * @version		$Id: class_ressources.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/loaders
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class RessourcesException extends Exception {}

final class RESSOURCES
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// LOAD CONNECTIONS FROM CSV FILES
	static public function loadConnectionsFromCsvFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD SQL CONNECTIONS FROM FILE
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new ConnectionsLoaderAdapter();
			$result = CsvLoader::loadCsvFile($absolute_file_name, "name", $adapter);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadConnectionsFromCsvFile";
				$msg = "connection builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	// LOAD CONNECTIONS FROM INI FILES
	static public function loadConnectionsFromIniFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD SQL CONNECTIONS FROM FILE
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new ConnectionsLoaderAdapter();
			$result = IniLoader::loadIniFile($absolute_file_name, "name", $adapter);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadConnectionsFromIniFile";
				$msg = "connection builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	
	// LOAD MODELS FROM CSV FILES
	static public function loadModelsFromCsvFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD INCLUDE MODELS FROM FILES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new ModelsLoaderAdapter();
			$result = CsvLoader::loadCsvFile($absolute_file_name, "model_name", $adapter);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadModelsFromCsvFile";
				$msg = "models builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	// LOAD MODELS FROM INI FILES
	static public function loadModelsFromIniFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD INCLUDE MODELS FROM FILES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new ModelsLoaderAdapter();
			$result = IniLoader::loadIniFile($absolute_file_name, "model_name", $adapter);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadModelsFromIniFile";
				$msg = "models builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	
	// LOAD VIEWS FROM CSV FILES
	static public function loadViewsFromCsvFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD INCLUDE VIEWS FROM FILES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new ViewsLoaderAdapter();
			$result = CsvLoader::loadCsvFile($absolute_file_name, "view_name", $adapter);
			
			if ( ! $result )
			{
				$context = "RESSOURCES.loadViewsFromCsvFile";
				$msg = "view builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	// LOAD VIEWS FROM INI FILES
	static public function loadViewsFromIniFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD INCLUDE VIEWS FROM FILES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new ViewsLoaderAdapter();
			$result = IniLoader::loadIniFile($absolute_file_name, "view_name", $adapter);
			
			if ( ! $result )
			{
				$context = "RESSOURCES.loadViewsFromIniFile";
				$msg = "view builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	
	// LOAD MENUS FROM CSV FILES
	static public function loadMenusFromCsvFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD INCLUDE MENUS FROM FILES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new MenusLoaderAdapter();
			$result = CsvLoader::loadCsvFile($absolute_file_name, "menu_name", $adapter);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadMenusFromCsvFile";
				$msg = "menus builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	// LOAD MENUS FROM INI FILES
	static public function loadMenusFromIniFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// BUILD INCLUDE MENUS FROM FILES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$adapter = new MenusLoaderAdapter();
			$result = IniLoader::loadIniFile($absolute_file_name, "menu_name", $adapter);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadMenusFromIniFile";
				$msg = "menus builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	
	// LOAD RESSOURCES FROM INI FILES
	static public function loadFromIniFile($arg_root_relative_path_file)
	{
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// CREATE ADAPTERS ARRAY
			$adapters = array();
			$adapters["connection"]	= array( "key_name" => "name",			"adapter" => new ConnectionsLoaderAdapter() );
			$adapters["model"]		= array( "key_name" => "model_name",	"adapter" => new ModelsLoaderAdapter() );
			$adapters["view"]		= array( "key_name" => "view_name",		"adapter" => new ViewsLoaderAdapter() );
			$adapters["menu"]		= array( "key_name" => "menu_name",		"adapter" => new MenusLoaderAdapter() );
			
			// LOAD RESSOURCES
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_root_relative_path_file;
			$result = IniLoader::loadGenericIniFile($absolute_file_name, $adapters);
			if ( ! $result )
			{
				$context = "RESSOURCES.loadFromIniFile";
				$msg = "connection builder failed for file [".$arg_root_relative_path_file."]";
				TRACE::leaveko($context, $msg, false, true);
				throw new RessourcesException($context . " : " . $msg);
				return false;
			}
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
	
	
	// CONVERT CSV TO INI
	static public function convertCsvToIniFile($arg_file_path_name, $arg_default_record_type = "")
	{
		$context = "RESSOURCES.convertCsvToIniFile";
		
		if ( ERRORS::hasErrors() )
		{
			return false;
		}
		
		try
		{
			// GET ABSOLUTE FILE NAME
			$absolute_file_name = LIBAPT_APP_ROOT.$arg_file_path_name;
			
			// LOAD A CSV FILE
			$has_header = true;
			$model = new CsvModel("loadCsvFile", $absolute_file_name, true, ";", $has_header);
			if ( is_null($model) )
			{
				return TRACE::leaveko($context, "failed to create a CsvModel", false, self::$TRACE_CSV_LOADER);
			}
			
			// LOAD CSV DATAS
			if ( ! $model->isLoaded() )
			{
				if ( ! $model->loadFile() )
				{
					return TRACE::leaveko($context, "failed to load CsvModel file", false, self::$TRACE_CSV_LOADER);
				}
			}
			
			// GET THE DATAS
			$records = $model->getLoadedDatas();
			
			// CREATE ADAPTERS ARRAY
			$definitions_names = array();
			$definitions_names["model"]	= "model_name";
			$definitions_names["view"]	= "view_name";
			$definitions_names["menu"]	= "menu_name";
			
			// WRITE INI FILE
			$result = IniLoader::writeIniFile($absolute_file_name.".ini", $definitions_names, $records, $arg_default_record_type);
			
			return $result;
		}
		catch (Exception $e)
		{
			ERRORS::errorResourceLoading($e->getMessage(), $arg_root_relative_path_file);
			return false;
		}
		
		return true;
	}
}
?>