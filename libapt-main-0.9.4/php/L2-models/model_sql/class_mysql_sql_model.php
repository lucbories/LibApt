<?php
/**
 * @version		$Id: class_mysql_sql_model.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/model
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class MySQLModel extends AbstractSQLModelImpl
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_connection_name)
	{
		parent::__construct($arg_unique_name, $arg_connection_name);
		
		$this->storage_engine = new MySQLStorage($arg_unique_name, $this->getFieldsSet(), $this->getConnection());
	}
	
	
	// SQL ESCAPE
	public function escape($arg_str)
	{
		return $this->storage_engine->escape($arg_str);
	}
	
	
	// SQL EXECUTION
	protected function executeSQL($arg_sql)
	{
		return $this->getStorageEngine()->executeSQL($arg_sql);
	}
	
	
	// DATA ACCESS WITH CURSOR
	public function createCursor($arg_cursor_name)
	{
		$cursor = new Cursor($arg_cursor_name, $this);
		$this->cursors[$arg_cursor_name] = $cursor;
		return $cursor;
	}
}
?>
