<?php
/**
 * @version		$Id: class_connections_controller.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/control
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ConnectionsController extends AbstractController
{
	private $connections;
	
	
	// CONSTRUCTEUR
	public function __construct()
	{
		parent::__construct();
	}
	
	
	// REFERENCEMENT DES OBJETS
	public function checkObject($arg_named_object)
	{
		if ( ! is_null($arg_named_object) )
		{
			return $arg_named_object instanceof Connection;
		}
		return null;
	}
	
	
	// EXECUTION D'UNE ACTION AVEC LES OPERANDES FOURNIES
	protected function doActionSelf($arg_action_name, $arg_url_parameters)
	{
		TRACE::addErrorMsg("ConnectionsController.doActionSelf", "Not implemented");
	}
	
	
	// REFERENCEMENT DES CONNCECTIONS
	public function registerConnection($arg_connection_name, $arg_engine, $arg_host, $arg_port, $arg_database, $arg_user, $arg_password, $arg_options)
	{
		$connection = new Connection($arg_connection_name, $arg_engine, $arg_host, $arg_port, $arg_database, $arg_user, $arg_password, $arg_options);
		if ($connection->init())
		{
			$this->registerObject($connection);
			return $this->hasObject($arg_connection_name);
		}
		return false;
	}
	
	
	// DEREFERENCEMENT DES CONNCECTIONS
	public function unregisterConnection($arg_connection_name)
	{
		$this->unregisterObject($arg_connection_name);
	}
	
	
	// GESTION DES PROPRIETES
	public function getConnectionAttribute($arg_connection_name, $arg_attribute)
	{
		$context = "ConnectionsController.getConnectionAttribute($arg_connection_name, $arg_attribute)";
		
		// GET CONNECTION OBJECT
		$connection = $this->getObject($arg_connection_name);
		if ( is_null($connection) )
		{
			TRACE::addErrorMsg($context, "Connection not found");
			return null;
		}
		
		// GET CONNECTION ATTRIBUTE
		if ($arg_attribute == "name")
		{
			return $connection->getName();
		}
		if ($arg_attribute == "database")
		{
			return $connection->getDatabaseName();
		}
		if ($arg_attribute == "link")
		{
			return $connection->getLink();
		}
		
		TRACE::addErrorMsg($context, "Not implemented");
		return null;
	}
	
	public function getConnectionDatabase($arg_connection_name) {
		return $this->getConnectionAttribute($arg_connection_name, 'database');
	}
	
	public function getConnectionLink($arg_connection_name) {
		return $this->getConnectionAttribute($arg_connection_name, 'link');
	}
	
	
	// DUMP DES CONNECTIONS
	public function dumpConnections()
	{
		foreach($this->connections AS $key => $connection)
		{
			echo "_______________________\n<BR>";
			echo "connection name=".$key."\n<BR>";
			echo "engine=".$connection.getEngine()."\n<BR>";
			echo "host=".$connection.getHost()."\n<BR>";
			echo "port=".$connection.getPort()."\n<BR>";
			echo "database=".$connection.getDatabaseName()."\n<BR>";
			echo "user=".$connection.getUserName()."\n<BR>";
			echo "password="."xxx"."\n<BR>";
			echo "options=".$connection.getOptions()."\n<BR>";
			echo "link is null=".is_null( $connection.getLink() )."\n<BR>";
		}
	}
}

?>
