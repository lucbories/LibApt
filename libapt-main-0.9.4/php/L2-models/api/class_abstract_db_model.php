<?php
/**
 * @version		$Id: class_abstract_db_model.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/model
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractDBModel extends AbstractModelImpl
{
	// DATABASE CONNECTION
	protected $sgbd_database;
	protected $sgbd_connection;
	protected $sgbd_crud_table;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_connection_name)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, null);
		
		// FETCH DATABASE AND CONNECTION OBJECT FROM CONNECTIONS CONTROLLER
		$cx_control = Controllers::getController("connection");
		if ( $cx_control->hasObject($arg_connection_name) )
		{
			$this->sgbd_database	= $cx_control->getObject($arg_connection_name)->getDatabaseName();
			$this->sgbd_connection	= $cx_control->getObject($arg_connection_name)->getLink();
			if ( is_null($this->sgbd_connection) )
			{
				TRACE::addErrorMsg("AbstractDBModel.constructor", "Bad connection link [$arg_connection_name]");
			}
		}
		else
		{
			TRACE::addErrorMsg("AbstractDBModel.constructor", "Connection not found [$arg_connection_name]");
		}
		
		$this->sgbd_crud_table = null;
	}
	
	
	// DATABASE NAME
	public function getDatabaseName() {
		return $this->sgbd_database;
	}
	
	public function setDatabaseName($arg_database) {
		$this->sgbd_database = $arg_database;
	}
	
	
	// CONNECTION OBJECT
	public function getConnection()
	{
		return $this->sgbd_connection;
	}
	
	public function setConnection($arg_connection)
	{
		$this->sgbd_connection = $arg_connection;
	}
	
	
	// CRUD TABLE
	public function getCrudTable()
	{
		return $this->sgbd_crud_table;
	}
	
	public function setCrudTable($arg_crud_table)
	{
		$this->sgbd_crud_table = $arg_crud_table;
	}
	
}


?>
