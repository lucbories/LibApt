<?php
/**
 * @file        class_sql_field.php
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
class SQLField extends Field
{
	// STATIC ATTRIBUTES
	static public $ATTRIBUTE_SQL_DB			= "sql_db";
	static public $ATTRIBUTE_SQL_TABLE		= "sql_table";
	static public $ATTRIBUTE_SQL_COLUMN		= "sql_column";
	static public $ATTRIBUTE_SQL_ALIAS		= "sql_alias";
	static public $ATTRIBUTE_SQL_IS_EXPR	= "sql_is_expression";
	static public $ATTRIBUTE_SQL_FOR_DB		= "sql_foreign_db";
	static public $ATTRIBUTE_SQL_FOR_TABLE	= "sql_foreign_table";
	static public $ATTRIBUTE_SQL_FOR_KEY	= "sql_foreign_key";
	static public $ATTRIBUTE_SQL_FOR_COLUMN	= "sql_foreign_column";
	
	/// @brief		Field attribute name for join target database name
	static public $ATTRIBUTE_JOIN_TARGET_DB				= "sql_join_target_db";
	
	/// @brief		Field attribute name for join target table name
	static public $ATTRIBUTE_JOIN_TARGET_TABLE			= "sql_join_target_table";
	
	/// @brief		Field attribute name for join target table alias name
	static public $ATTRIBUTE_JOIN_TARGET_TABLE_ALIAS	= "sql_join_target_table_alias";
	
	/// @brief		Field attribute name for join target column key name
	static public $ATTRIBUTE_JOIN_TARGET_KEY			= "sql_join_target_key";
	
	/// @brief		Field attribute name for join source column key name
	static public $ATTRIBUTE_JOIN_SOURCE_KEY			= "sql_join_source_key";
	
	/// @brief		Field attribute name for join editor field name
	static public $ATTRIBUTE_JOIN_EDITOR_FIELD_NAME		= "join_editor_field";
	
	
	
	// CONSTRUCTOR
	public function __construct($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label);
	}
	
	
	// FIELD ATTRIBUTES
	public function getAttributesList()
	{
		return array(
			// BASIC FIELD ATTRIBUTES
			self::$ATTRIBUTE_SOURCE, self::$ATTRIBUTE_NAME, self::$ATTRIBUTE_TYPE, self::$ATTRIBUTE_DEFAULT, self::$ATTRIBUTE_LABEL,
			self::$ATTRIBUTE_IS_EDITABLE, self::$ATTRIBUTE_IS_VISIBLE, self::$ATTRIBUTE_IS_PK,
			
			// SQL ATTRIBUTES
			self::$ATTRIBUTE_SQL_DB, self::$ATTRIBUTE_SQL_TABLE, self::$ATTRIBUTE_SQL_COLUMN, self::$ATTRIBUTE_SQL_ALIAS, self::$ATTRIBUTE_SQL_IS_EXPR,
			
			// FOREIGN ATTRIBUTES
			self::$ATTRIBUTE_SQL_FOR_DB, self::$ATTRIBUTE_SQL_FOR_TABLE, self::$ATTRIBUTE_SQL_FOR_KEY, self::$ATTRIBUTE_SQL_FOR_COLUMN,
			
			// JOIN ATTRIBUTES
			self::$ATTRIBUTE_IS_JOIN, self::$ATTRIBUTE_JOIN_TARGET_DB, self::$ATTRIBUTE_JOIN_TARGET_TABLE, self::$ATTRIBUTE_JOIN_TARGET_KEY, self::$ATTRIBUTE_JOIN_SOURCE_KEY
			);
	}
	
	public function resetAttributes($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label, $arg_is_editable, $arg_is_visible, $arg_is_primary_key)
	{
		if ( ! in_array($arg_type, $this->getTypes()) )
		{
			return false;
		}
		if ( ! in_array($arg_source, self::$SOURCES) )
		{
			return false;
		}
		
		parent::resetAttributes($arg_source, $arg_name, $arg_type, $arg_format, $arg_default, $arg_label, $arg_is_editable, $arg_is_visible, $arg_is_primary_key);
		
		$this->record[self::$ATTRIBUTE_SQL_DB]			= null;
		$this->record[self::$ATTRIBUTE_SQL_TABLE]		= null;
		$this->record[self::$ATTRIBUTE_SQL_COLUMN]		= null;
		$this->record[self::$ATTRIBUTE_SQL_ALIAS]		= null;
		
		$this->setPrimaryKey($arg_is_primary_key);
		
		$this->record[self::$ATTRIBUTE_SQL_IS_EXPR]		= false;
		
		$this->record[self::$ATTRIBUTE_SQL_FOR_DB]		= null;
		$this->record[self::$ATTRIBUTE_SQL_FOR_TABLE]	= null;
		$this->record[self::$ATTRIBUTE_SQL_FOR_KEY]		= null;
		$this->record[self::$ATTRIBUTE_SQL_FOR_COLUMN]	= null;
		
		$this->record[self::$ATTRIBUTE_IS_JOIN]				= false;
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_DB]		= null;
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE]	= null;
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_KEY]		= null;
		$this->record[self::$ATTRIBUTE_JOIN_SOURCE_KEY]		= null;
		
		$is_crud = true;
		$this->setCrud($is_crud);
		
		$this->updateKey();
		
		return true;
	}
	
	public function hasSQLAttributes()
	{
		$bool1 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_DB]) )		&& $this->record[self::$ATTRIBUTE_SQL_DB] != "";
		$bool2 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_TABLE]) )	&& $this->record[self::$ATTRIBUTE_SQL_TABLE] != "";
		$bool3 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_COLUMN]) )	&& $this->record[self::$ATTRIBUTE_SQL_COLUMN] != "";
		$bool4 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_ALIAS]) )	&& $this->record[self::$ATTRIBUTE_SQL_ALIAS] != "";
		$bool5 = ( ! is_null($this->record[self::$ATTRIBUTE_IS_PK]) )		&& is_bool($this->record[self::$ATTRIBUTE_IS_PK]);
		$bool6 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_IS_EXPR]) )	&& is_bool($this->record[self::$ATTRIBUTE_SQL_IS_EXPR]);
		
		return $bool1 && $bool2 && $bool3 && $bool4 && $bool5 && $bool6;
	}
	
	public function setSQLAttributes($arg_db, $arg_table, $arg_column, $arg_alias, $arg_is_primary_key, $arg_is_expression)
	{
		$this->record[self::$ATTRIBUTE_SQL_DB] = $arg_db;
		$this->record[self::$ATTRIBUTE_SQL_TABLE] = $arg_table;
		$this->record[self::$ATTRIBUTE_SQL_COLUMN] = $arg_column;
		$this->record[self::$ATTRIBUTE_SQL_ALIAS] = $arg_alias;
		
		$this->setPrimaryKey($arg_is_primary_key);
		
		$is_exp = (boolean) Type::getBooleanValue($arg_is_expression);
		$this->record[self::$ATTRIBUTE_SQL_IS_EXPR]  = (boolean) $is_exp;
		
		$this->updateKey();
		
		return true;
	}
	
	public function setSQLAttributesSimple($arg_db, $arg_table, $arg_column)
	{
		return $this->setSQLAttributes($arg_db, $arg_table, $arg_column, $arg_column, 0, 0);
	}
	
	public function hasSQLForeignAttributes()
	{
		$bool1 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_FOR_DB]) )     && $this->record[self::$ATTRIBUTE_SQL_FOR_DB] != "";
		$bool2 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_FOR_TABLE]) )  && $this->record[self::$ATTRIBUTE_SQL_FOR_TABLE] != "";
		$bool3 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_FOR_KEY]) )    && $this->record[self::$ATTRIBUTE_SQL_FOR_KEY] != "";
		$bool4 = ( ! is_null($this->record[self::$ATTRIBUTE_SQL_FOR_COLUMN]) ) && $this->record[self::$ATTRIBUTE_SQL_FOR_COLUMN] != "";
		
		return $bool1 && $bool2 && $bool3 && $bool4;
	}
	
	public function setSQLForeignAttributes($arg_db, $arg_table, $arg_key, $arg_column)
	{
		$this->record[self::$ATTRIBUTE_SQL_FOR_DB]		= $arg_db;
		$this->record[self::$ATTRIBUTE_SQL_FOR_TABLE]	= $arg_table;
		$this->record[self::$ATTRIBUTE_SQL_FOR_KEY]		= $arg_key;
		$this->record[self::$ATTRIBUTE_SQL_FOR_COLUMN]	= $arg_column;
		
		$this->updateKey();
		
		return true;
	}
	
	
	public function hasJoinAttributes()
	{
		$bool1 = ( ! is_null($this->record[self::$ATTRIBUTE_JOIN_TARGET_DB]) )			&& $this->record[self::$ATTRIBUTE_JOIN_TARGET_DB] != "";
		$bool2 = ( ! is_null($this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE]) )		&& $this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE] != "";
		$bool3 = ( ! is_null($this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE_ALIAS]) )	&& $this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE_ALIAS] != "";
		$bool4 = ( ! is_null($this->record[self::$ATTRIBUTE_JOIN_TARGET_KEY]) )			&& $this->record[self::$ATTRIBUTE_JOIN_TARGET_KEY] != "";
		$bool5 = ( ! is_null($this->record[self::$ATTRIBUTE_JOIN_SOURCE_KEY]) ) 		&& $this->record[self::$ATTRIBUTE_JOIN_SOURCE_KEY] != "";
		
		return $bool1 && $bool2 && $bool3 && $bool4 && $bool5;
	}
	
	public function setJoinAttributes($arg_target_db, $arg_target_table, $arg_target_table_alias, $arg_target_key, $arg_source_key)
	{
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_DB]			= $arg_target_db;
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE]		= $arg_target_table;
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_TABLE_ALIAS]	= $arg_target_table_alias;
		$this->record[self::$ATTRIBUTE_JOIN_TARGET_KEY]			= $arg_target_key;
		$this->record[self::$ATTRIBUTE_JOIN_SOURCE_KEY]			= $arg_source_key;
		
		$this->updateKey();
		
		return true;
	}
	
	
	public function hasJoinEditorField()
	{
		return array_key_exists(self::$ATTRIBUTE_JOIN_EDITOR_FIELD_NAME, $this->record);
	}
	
	public function getJoinEditorField()
	{
		return $this->record[self::$ATTRIBUTE_JOIN_EDITOR_FIELD_NAME];
	}
	
	public function setJoinEditorField($arg_join_editor_field_name)
	{
		$this->record[self::$ATTRIBUTE_JOIN_EDITOR_FIELD_NAME] = $arg_join_editor_field_name;
		$this->updateKey();
		
		return true;
	}
	
	public function setAttribute($arg_attribute, $arg_value)
	{
		if ( $arg_attribute == "sql_is_primary_key" or $arg_attribute == self::$ATTRIBUTE_IS_PK)
		{
			$this->setPrimaryKey($arg_value);
			return true;
		}
		return parent::setAttribute($arg_attribute, $arg_value);
	}
}
?>