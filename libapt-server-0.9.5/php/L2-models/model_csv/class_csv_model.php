<?php
/**
 * @version		$Id: class_csv_model.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/model
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class CsvModel extends AbstractModelImpl
{
	// STATIC ATTRIBUTES
	static public $TRACE_CSV_MODEL = false;
	
	
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_file_path_name, $arg_is_read_only, $arg_fields_separator = ";", $arg_has_header = false)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, null);
		
		// INIT ATTRIBUTES
		$this->storage_engine = new CSVStorage($arg_unique_name, $this->getFieldsSet(), $arg_file_path_name, $arg_is_read_only, $arg_fields_separator, $arg_has_header);
	}
	
	
	// FILE PATH NAME
	public function getFilePathName()
	{
		return $this->getStorageEngine()->getFilePathName();
	}
	
	
	// IS READ ONLY
	public function isReadOnly()
	{
		return $this->getStorageEngine()->isReadOnly();
	}
	
	// IS LOADED
	public function isLoaded()
	{
		return $this->getStorageEngine()->isReady();
	}
	
	// GET LOADED DATAS
	
	public function getLoadedDatas()
	{
		return $this->getStorageEngine()->fetchRecords();
	}
	
	
	// LECTURE DU FICHIER
	public function loadFile()
	{
		$context = "CsvModel.loadFile";
		
		return $this->getStorageEngine()->loadFile();
	}
	
	
	// CRUD OPERATIONS - CREATE
	public function create($arg_fields, $arg_values, $arg_options)
	{
		// TODO
	}
	
	// CRUD OPERATIONS - READ
	public function read($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		// TODO
		return $this->getStorageEngine()->fetchRecords();
	}
	
	public function readWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		// TODO
		return $this->getStorageEngine()->fetchRecords();
	}
	
	public function readAll($arg_fields, $arg_orders, $arg_options)
	{
		// TODO
		return $this->getStorageEngine()->fetchRecords();
	}
	
	public function readDistinct($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		// TODO
		return $this->getStorageEngine()->fetchRecords();
	}
	
	public function readDistinctWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		// TODO
		return $this->getStorageEngine()->fetchRecords();
	}
	
	public function readDistinctForeignKeys($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		// TODO
	}
	
	public function readDistinctForeignKeysWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		// TODO
	}
	
	public function readCount($arg_fields, $arg_filters, $arg_orders, $arg_options)
	{
		// NOTHING TO DO
		return 0;
	}
	
	public function readCountWithSlice($arg_fields, $arg_filters, $arg_orders, $arg_slice_offset, $arg_slice_length, $arg_options)
	{
		// NOTHING TO DO
		return 0;
	}
	
	public function readHas($arg_filters, $arg_options)
	{
		// TODO
	}
	
	
	// CRUD OPERATIONS - UPDATE
	public function update($arg_fields, $arg_values, $arg_filters, $arg_options)
	{
		// TODO
	}
	
	// CRUD OPERATIONS - DELETE
	public function delete($arg_filters, $arg_options)
	{
		// TODO
	}
	
	
	// ACCES AUX DONNEES AVEC UN CURSEUR
	public function createCursor($arg_cursor_name)
	{
		$cursor = new Cursor($arg_cursor_name, $this);
		$this->cursors[$arg_cursor_name] = $cursor;
		return $cursor;
	}
	
	
	public function fetchRecord($arg_datas, $arg_index)
	{
		return $this->datas_cache[$arg_index];
	}
	
	public function fetchObject($arg_datas, $arg_index)
	{
		return $this->datas_cache[$arg_index];
	}
	
	
	// ACCES AUX DONNEES SANS CURSEUR
	public function hasRecordWithPK($arg_field_primary_key_value)
	{
		// RECHERCHE DU CHAMP CLE PRIMAIRE
		$primary_key_field_name = $this->getPrimaryKeyFieldName();
		if ( is_null($primary_key_field_name) )
		{
			return false;
		}
		
		// RECHERCHE D UN ENREGISTREMENT AVEC LA VALEUR DE CLE PRIMAIRE FOURNIE
		foreach($this->datas_cache as $key => $record)
		{
			if ( ! is_null($record) and $record[$primary_key_field] == $arg_field_primary_key_value)
			{
				return true;
			}
		}
		
		return false;
	}
	
	public function hasRecordWithField($arg_field_name, $arg_field_value)
	{
		// RECHERCHE DU CHAMP AVEC LE NOM DONNE
		if ( ! array_key_exists($arg_field_name, $this->fields) )
		{
			return false;
		}
		
		// RECHERCHE D UN ENREGISTREMENT AVEC LA VALEUR FOURNIE
		foreach($this->datas_cache as $key => $record)
		{
			if ( ! is_null($record) and $record[$arg_field_name] == $arg_field_value)
			{
				return true;
			}
		}
		
		return false;
	}
	
	public function hasRecordWithFields($arg_field_names, $arg_field_values)
	{
		// CHECK GIVEN FIELD NAMES
		foreach($arg_field_names as $key => $field_name)
		{
			if ( ! array_key_exists($field_name, $this->fields) )
			{
				TRACE::leaveko("CsvModel.hasRecordWithFields", "field name [".$field_name."] not found in model fields list");
				return false;
			}
		}
		
		// CHECK GIVEN FIELD VALUES
		$fields_count = count($arg_field_names);
		$values_count = count($arg_field_values);
		if ($fields_count != $values_count)
		{
			TRACE::leaveko("CsvModel.hasRecordWithFields", "bad values count [$values_count] for fields count [$fields_count]");
			return false;
		}
		
		// RECHERCHE D UN ENREGISTREMENT AVEC LA VALEUR FOURNIE
		foreach($this->datas_cache as $row_key => $row_record)
		{
			if ( ! is_null($row_record) )
			{
				$founds = 0;
				for($field_index = 0 ; $field_index < $fields_count ; $field_index++)
				{
					$field_name  = $arg_field_names[$field_index];
					$field_value = $arg_field_values[$field_index];
					$model_value = null;
					
					if ($this->has_header)
					{
						$model_value  = $row_record[$field_name];
					}
					else
					{
						$model_field_index = $this->getFieldsSet()->getFieldIndex($field_name);
						$model_value  = $row_record[$model_field_index];
					}
					$founds += ( $model_value == $field_value ) ? 1 : 0;
				}
				if ( $founds == $fields_count )
				{
					return true;
				}
			}
		}
		
		return false;
	}
	
	
	// ARRAY HELPERS
	/*
		arg_items_count_to_replace = 0:
			INSERT le tableau arg_array_to_insert dans le tableau arg_array_src à la position arg_pos_to_insert
			retourne arg_array_src
		arg_items_count_to_replace > 0:
			REMPLACE arg_items_count_to_replace éléments de arg_array_src à partir de la position arg_pos_to_insert avec les éléments du tableau arg_array_to_insert
			retourne arg_array_src
	*/
	protected function array_insert($arg_array_src, $arg_array_to_insert, $arg_pos_to_insert, $arg_items_count_to_replace = 0)
	{
		array_splice($arg_array_src, $arg_pos_to_insert, $arg_items_count_to_replace, $arg_array_to_insert);
		return $arg_array_src;
	}
	
	protected function array_remove(array &$a_Input, $m_SearchValue, $b_Strict = false)
	{
		$a_Keys = array_keys($a_Input, $m_SearchValue, $b_Strict);
		foreach($a_Keys as $s_Key) {
			unset($a_Input[$s_Key]);
		}
		return $a_Input;
	}
	
	protected function getMultidimKey($arg_filters)
	{
		// TODO
		return null;
	}
	
	protected function hasMultidimKey($arg_multidim_array, $arg_multidim_key)
	{
		if ( empty($arg_multidim_key) || empty($arg_multidim_array) )
		{
			return false;
		}
		
		foreach ($arg_multidim_array as $key => $value)
		{
			$exists = true;
			foreach ($arg_multidim_key as $skey => $svalue)
			{
				$exists = ($exists && IsSet($arg_multidim_array[$key][$skey]) && $arg_multidim_array[$key][$skey] == $svalue);
			}
			if($exists)
			{
				return $key;
			}
		}
		
		return false;
	}
	
	public function fetchDistinctValuesForField($arg_field_name, $arg_orders, $arg_filters, $arg_slide_offset, $arg_slide_length)
	{
		// TODO use orders, filters, slides OR not !
		if ( is_null($this->getFieldsSet()->getFields()) or count($this->getFieldsSet()->getFields()) < 1 )
		{
			TRACE::leaveko("fetchDistinctValuesForField", "no field defined");
			return null;
		}
		
		// GET FIELD COLUMN INDEX
		$field_index = $this->getFieldsSet()->getFieldIndex($arg_field_name);
		
		$unique_values = array();
		foreach($this->datas_cache as $key => $record)
		{
			$value = $record[$field_index];
			$unique_values[$value] = true;
//			TRACE::trace_var($context, "value", $value);
		}
		$unique_values = array_keys($unique_values);
		
		return $unique_values;
	}
	
	
	// ACCES AUX DONNEES : CREATION, MODIFICATION, SUPPRESSION
	public function createItem($arg_fields_values)
	{
//		TRACE::enter("CsvModel.createItem");
		
		// CHECK IF IT IS READ ONLY
		if ($this->is_read_only)
		{
			TRACE::leaveko("createItem", "read only file");
			return null;
		}
		
		// CHECK IF IS LOADED
		if ( is_null($this->datas_cache) )
		{
			TRACE::leaveko("createItem", "le cache des données est vide");
			return null;
		};
		
		// CREATE THE NEW RECORD
		$this->datas_cache[] = $arg_fields_values;
		
		// TODO createItem : SAVE FILE
//		TRACE::leaveok("CsvModel.createItem");
		return true;
	}
	
	public function deleteItemById($arg_id)
	{
		// TODO deleteItemById : not implemented
		return false;
	}
	
	
	// CSV DATA ACCESS
	public function getRows()
	{
		return count($this->datas_cache);
	}
	
	public function getRow($arg_row)
	{
		// CHECK IF LOADED
		if ( is_null($this->datas_cache) )
		{
			TRACE::leaveko("getRow", "le cache des données est vide");
			return null;
		}
		
		// GET THE FILE ROWS COUNT
		$rows = count($this->datas_cache);
		
		// CHECK THE ROW INDEX
		if ($arg_row < 0 or $arg_row >= $rows)
		{
			TRACE::leaveko("getRow", "row index out of range");
			return null;
		}
		
		// GET THE CURRENT RECORD
		$record = $this->datas_cache[$arg_row];
		
		return $record;
	}
	
	public function getCell($arg_row, $arg_column)
	{
		// CHECK COLUMN INDEX
		if ( $arg_column < 0 or $arg_column >= count($this->fields) )
		{
			TRACE::leaveko("getCell", "column index out of range");
			return null;
		}
		
		// GET THE CURRENT RECORD
		$record = $this->getRow($arg_row);
		
		// GET THE DEFAULT VALUE IF THE CSV RECORD IS QHORTER THAN THE FIELDS COUNT
		if ($arg_column >= count($record))
		{
			return null;
		}
		
		return $record[$arg_column];
	}
}


?>
