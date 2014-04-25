<?php
/**
 * @version		$Id: class_connections_loader_adapter.php 2012-03-17 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/loaders
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 */
final class ConnectionsLoaderAdapter extends AbstractLoaderAdapter
{
	// CONSTRUCTOR
	public function __construct()
	{
	}
	
	
	// BUILD A MENU FROM AN OBJECT DEFINITION
	public function buildObjectFromRecord($arg_definition_record, $arg_resource_to_clone = null)
	{
		$context = "ConnectionsLoaderAdapter.buildObjectFromRecord";
		$record = $arg_definition_record;
		
		$name			=  $record["name"];
		$engine			=  $record["engine"];
		$host			=  $record["host"];
		$port			=  $record["port"];
		$database_name	=  $record["database_name"];
		$user_name		=  $record["user_name"];
		$user_pwd		=  $record["user_pwd"];
		$options		=  $record["options"];
		
		
		// CHECK ARGS
		if ( is_null($name) || $name == "" )
		{
			return TRACE::leaveko($context, "name is null at ".$record, false);
		}
		if ( is_null($engine) || $engine == "" )
		{
			return TRACE::leaveko($context, "engine is null at ".$record, false);
		}
		if ( is_null($host) || $host == "" )
		{
			return TRACE::leaveko($context, "host is null at ".$record, false);
		}
		if ( is_null($port) || $port == "" )
		{
			return TRACE::leaveko($context, "port is null at ".$record, false);
		}
		if ( is_null($database_name) || $database_name == "" )
		{
			return TRACE::leaveko($context, "database_name is null at ".$record, false);
		}
		if ( is_null($user_name) || $user_name == "" )
		{
			return TRACE::leaveko($context, "user_name is null at ".$record, false);
		}
/*		if ( is_null($user_pwd) || $user_pwd == "" )
		{
			return TRACE::leaveko($context, "user_pwd is null at ".$record, false);
		}*/
		
		$cc = Controllers::getController("connection");
		$cc->registerConnection($name, $engine, $host, $port, $database_name, $user_name, $user_pwd, $options);
		
		return $cc->hasObject($name);
	}
	
	public function buildObjectFromLazy($arg_lazy_object)
	{
		$context = "ConnectionsLoaderAdapter.buildObjectFromLazy";
		
		return null;
	}
}
?>