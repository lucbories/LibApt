<?php
/**
 * @file        class_csv_storage.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L1_STORAGE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class CSVStorage extends AbstractFileStorageImpl
{
	// STATIC ATTRIBUTES
	static public $TRACE_CSV_STORAGE		= false;
	static public $TRACE_CSV_STORAGE_RECORD	= false;
	
	// ATTRIBUTES
	protected $fields_separator = true;
	protected $has_header = false;
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_fields_set, $arg_file_path_name, $arg_is_read_only, $arg_fields_separator = ";", $arg_has_header = false)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_fields_set, $arg_file_path_name);
		
		// INIT ATTRIBUTES
		$this->is_read_only = $arg_is_read_only;
		$this->setFieldSeparator($arg_fields_separator);
		$this->has_header = $arg_has_header;
		$this->need_init = true;
		
//		self::$TRACE_CSV_STORAGE = true;
	}
	
	
	// ATTRIBUTES
	public function setFieldSeparator($arg_fields_separator)
	{
		$this->fields_separator = ";";
		if ( strlen($arg_fields_separator) == 3 )
		{
			if ( substr($arg_fields_separator, 0, 1) == '"' and substr($arg_fields_separator, 2, 1) == '"' )
			{
				$this->fields_separator = substr($arg_fields_separator, 1, 1);
			}
			elseif ( substr($arg_fields_separator, 0, 1) == "'" and substr($arg_fields_separator, 2, 1) == "'" )
			{
				$this->fields_separator = substr($arg_fields_separator, 1, 1);
			}
		}
		else
		{
			$this->fields_separator = substr($arg_fields_separator, 0, 1);
		}
	}
	
	
	// SPECIFIC STORAGE ENGINE
	public function escape($arg_str)
	{
		// TODO : CsvStorage.escape
		return $arg_str;
	}
	
	
	// GENERIC DATAS STORAGE
	public function getDatasHandle()
	{
		if ( is_null($this->datas_handle) )
		{
			$this->loadFile();
		}
		return $this->datas_handle;
	}
	
	
	public function countDatasFromHandle($arg_datas)
	{
		return count($arg_datas);
	}
	
	public function freeDatasFromHandle($arg_datas)
	{
		$arg_datas = null;
	}
	
	public function fetchRecordsFromHandle($arg_datas)
	{
		$context = get_class($this).".CSVStorage.fetchRecordsFromHandle";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		TRACE::trace_var($context, "arg_datas", $arg_datas, self::$TRACE_CSV_STORAGE_RECORD);
		
		if ( is_null($arg_datas) )
		{
			return TRACE::leaveok($context, "Datas is null", null, self::$TRACE_CSV_STORAGE);
		}
		
		$records = array();
		
		$row = 0;
		foreach($arg_datas as $key => $value)
		{
			// CHECK ROW RECORD
			$record = $this->getRecordFromDatas($value);
			if ( ! $record )
			{
				return TRACE::leaveko($context, "Record is null", null, self::$TRACE_CSV_STORAGE);
			}
			
			// SAVE ROW RECORD
			$records[$row] = $record;
			
			++$row;
		}
		
		return TRACE::leaveok($context, "", $records, self::$TRACE_CSV_STORAGE);
	}
	
	public function fetchRecordAtFromHandle($arg_datas, $arg_index = 0)
	{
		$context = get_class($this).".CSVStorage.fetchRecordAtFromHandle";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		TRACE::trace_var($context, "arg_datas", $arg_datas, self::$TRACE_CSV_STORAGE_RECORD);
		TRACE::trace_var($context, "arg_index", $arg_index, self::$TRACE_CSV_STORAGE);
		
		$row = 0;
		foreach($arg_datas as $key => $value)
		{
			// CHECK ROW RECORD
			$record = $this->getRecordFromDatas($value);
			if ( ! $record )
			{
				return null;
			}
			
			if ($row == $arg_index)
			{
				return TRACE::leaveok($context, "", $record, self::$TRACE_CSV_STORAGE);
			}
			
			++$row;
		}
		
		return null;
	}
	
	
	// GENERIC STORAGE QUERY
	public function executeQuery($arg_query)
	{
		$context = get_class($this).".CSVStorage.executeQuery";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
//		TRACE::trace_var($context, "arg_query", $arg_query->..., self::$TRACE_CSV_STORAGE_RECORD);
		
		if ( ! $arg_query instanceof AbstractQuery )
		{
			return TRACE::leaveok($context, "bad query class[". get_class($arg_query) . "]", false, self::$TRACE_CSV_STORAGE);
		}
		
		// TODO CsvStorage.executeQuery
		return TRACE::leaveok($context, "TODO not yet implemented", $record, self::$TRACE_CSV_STORAGE);
	}
	
	
	// FILE STORAGE ENGINE
	public function loadFileHeaders()
	{
		$context = "CsvStorage.loadFileHeaders";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		if ( ! $this->has_header )
		{
			return TRACE::leaveok($context, "No headers to load", true, self::$TRACE_CSV_STORAGE);
		}
		
		if ( $this->getFieldsSet()->getFieldsCount() > 0 )
		{
			return TRACE::leaveok($context, "Headers already loaded", true, self::$TRACE_CSV_STORAGE);
		}
		
		// CHECK FILE
		$this->datas_cache = null;
		if ( ! file_exists($this->file_path_name) )
		{
			$this->datas_cache = null;
			return TRACE::leaveko($context, "File does not exists [".$this->file_path_name."]", false, self::$TRACE_CSV_STORAGE);
		}
		
		// OPEN FILE
		$csv = new SplFileObject($this->file_path_name, 'r');
		$csv->setFlags(SplFileObject::READ_CSV | SplFileObject::SKIP_EMPTY | SplFileObject::DROP_NEW_LINE);
		$csv->setCsvControl($this->fields_separator);
		
		// READ FILE
		$record = $csv->fgetcsv($this->fields_separator);
		$fields_count = count($record);
		TRACE::trace_var($context, "record", $record, self::$TRACE_CSV_STORAGE_RECORD);
		
		// READ FIRST LINE HEADER
		for ($c=0; $c < $fields_count; $c++)
		{
			$field_source = "CSV";
			$field_name = $record[$c];
			$field_type = "String";
			$field_format = null;
			$field_default = "";
			$field_label = $field_name;
			$field = new Field($field_source, $field_name, $field_type, $field_format, $field_default, $field_label);
			$this->getFieldsSet()->registerField($field_name, $field);
		}
		
		return TRACE::leaveok($context, "Headers loaded", true, self::$TRACE_CSV_STORAGE);
	}
	
	public function loadFileDatas()
	{
		$context = "CsvStorage.loadFileDatas";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CHECK FILE
		$this->datas_handle = null;
		if ( ! file_exists($this->getFilePathName()) )
		{
			return TRACE::leaveko($context, "File does not exists [". $this->getFilePathName() ."]", false, self::$TRACE_CSV_STORAGE);
		}
		
		// OPEN FILE
		$csv = new SplFileObject($this->getFilePathName(), 'r');
		if ( is_null($csv) or ! is_object($csv) )
		{
			return TRACE::leaveko($context, "Can not open file for reading [". $this->getFilePathName() ."]", false, self::$TRACE_CSV_STORAGE);
		}
		
		// SET FILE CONFIG
		$csv->setFlags(SplFileObject::READ_CSV);
		$csv->setCsvControl($this->fields_separator);
		
		// READ FILE
		$fields_count = $this->getFieldsSet()->getFieldsCount();
		$this->datas_handle = array();
		$row = 0;
		foreach($csv as $record)
		{
			// CHECK COLUMNS COUNT
			$cols_count = count($record);
			TRACE::trace_var($context, "record at row $row", $record, self::$TRACE_CSV_STORAGE_RECORD);
			if ($fields_count != $cols_count)
			{
				// EMPTY LINE
				if ( $cols_count == 1 and (is_null($record[0]) || $record[0] == "") )
				{
					continue;
				}
				
				return TRACE::leaveko($context, "Bad columns count for file [". $this->getFilePathName() ."] columns [$cols_count] insteed of [$fields_count] at row [$row]", false, self::$TRACE_CSV_STORAGE);
			}
			
			// READ ROW RECORD
			if ( ! ($this->has_header and $row == 0) )
			{
				$columns = array();
				for ($column = 0 ; $column < $cols_count; $column++)
				{
					$field = $this->getFieldsSet()->getFieldAt($column);
					if ( is_null($field) )
					{
						$this->datas_handle = null;
						return TRACE::leaveko($context, "Field not found for file [". $this->getFilePathName() ."] column [$column] at row [$row]", false, self::$TRACE_CSV_STORAGE);
					}
					$field_name = $field->getName();
					$columns[$field_name] = $record[$column];
				}
				$this->datas_handle[$row - ($this->has_header ? 1 : 0)] = $columns;
			}
			$row++;
		}
		
		TRACE::trace_var($context, "datas_handle", $this->datas_handle, self::$TRACE_CSV_STORAGE_RECORD);
		return TRACE::leaveok($context, "", true, self::$TRACE_CSV_STORAGE);
	}
	
	public function saveFile()
	{
		$context = "CsvStorage.saveFile";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CHECK IF FILE READY
		if ( ! $this->isReady() and ! is_array($this->datas_handle) )
		{
			return TRACE::leaveko($context, "Engine not ready", false, self::$TRACE_CSV_STORAGE);
		}
		
		// GET FIELDS COUNT
		$fields_count = $this->getFieldsSet()->getFieldsCount();
		
		// SAVE FILE DATAS
		$csv = new SplFileObject($this->getFilePathName(), 'w');
		foreach ($this->datas_handle as $record)
		{
			// CHECK COLUMNS COUNT FOR CURRENT RECORD
			$cols_count = count($record);
			if ($cols_count != $fields_count)
			{
				return TRACE::leaveko($context, "Bad columns count at row [$row] : [$cols_count] / [$fields_count]", false, self::$TRACE_CSV_STORAGE);
			}
			
			// SAVE RECORD
			if ( ! $this->appendFileRecord($csv, $record, $row) )
			{
				return TRACE::leaveko($context, "Append record failed", false, self::$TRACE_CSV_STORAGE);
			}
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_CSV_STORAGE);
	}
	
	protected function appendFileRecord($arg_csv_file, $arg_record, $arg_row)
	{
		$context = "CsvStorage.appendFileRecord";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CREATE ORDERED RECORD
		$ordered_record = array();
		$columns = 0;
		foreach($arg_record as $key => $value)
		{
			if ( is_integer($key) )
			{
				$ordered_record[$column] = $value;
			}
			else
			{
				$index = $this->getFieldsSet()->getFieldIndex($key);
				if ( is_null($index) )
				{
					return TRACE::leaveko($context, "Bad column index at row [$arg_row] for key [$key]", false, self::$TRACE_CSV_STORAGE);
				}
				$ordered_record[$index] = $value;
				
			}
			++$column;
		}
		
		// CREATE RECORD STRING LINE
		$separator = '"'. $this->getFieldSeparator() .'"';
		$line = '"';
		$line .= implode($separator, $ordered_record);
		$line .= '"';
		$line .= "\r\n";
		
		// WRITE RECORD STRING LINE
		$arg_csv_file->fwrite($line);
		return TRACE::leaveok($context, "", true, self::$TRACE_CSV_STORAGE);
	}
	
	// CRUD
	public function hasCreate()
	{
		return true;
	}
	
	public function hasRead()
	{
		return true;
	}
	
	public function hasUpdate()
	{
		return true;
	}
	
	public function hasDelete()
	{
		return true;
	}
	
	
	public function create($arg_values, $arg_options)
	{
		$context = "CSVStorage.create";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_values) )
		{
			return TRACE::leaveko($context, "values argument is null", false, self::$TRACE_CSV_STORAGE); 
		}
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko($context, "options argument is null", false, self::$TRACE_CSV_STORAGE); 
		}
		
		// CHECK DATAS RECORD
		$record = $this->getRecordFromDatas($arg_values);
		if ( is_null($record) )
		{
			TRACE::trace_var($context, "bad datas record", $arg_values, self::$TRACE_CSV_STORAGE);
			return TRACE::leaveko($context, "Bad datas record", false, self::$TRACE_CSV_STORAGE);
		}
		
		// SAVE DATAS RECORD
		$csv = new SplFileObject('upload_dir/file2.csv', 'a');
		$row = count($this->datas_handle);
		if ( is_null($this->datas_handle) )
		{
			$this->datas_handle = array();
		}
		$this->datas_handle[] = $record;
		if ( ! $this->appendFileRecord($csv, $record, $row) )
		{
			return TRACE::leaveko($context, "Append record failed", false, self::$TRACE_CSV_STORAGE);
		}
		
		return TRACE::leaveok($context, "", true, self::$TRACE_CSV_STORAGE);
	}
	
	public function read($arg_options)
	{
		$context = "CSVStorage.read";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko("MySQLStorage.read", "options argument is null", false, self::$TRACE_CSV_STORAGE); 
		}
		
		// TODO READ WITH FILTERS, ORDERS, SLICE
		
		// READ ALL
		$records = $this->fetchRecords();
		return TRACE::leaveok($context, "TODO options not yet implemented", $records, self::$TRACE_CSV_STORAGE);
	}
	
	public function update($arg_values, $arg_options)
	{
		$context = "CSVStorage.update";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko("MySQLStorage.update", "options argument is null", false, self::$TRACE_CSV_STORAGE); 
		}
		
		// TODO UPDATE
		return TRACE::leaveok($context, "TODO not yet implemented", false, self::$TRACE_CSV_STORAGE);
	}
	
	public function delete($arg_values, $arg_options)
	{
		$context = "CSVStorage.delete";
		TRACE::enter($context, "", self::$TRACE_CSV_STORAGE);
		
		// CHECK ARGUMENTS
		if ( is_null($arg_options) )
		{
			return TRACE::leaveko("MySQLStorage.delete", "options argument is null", false, self::$TRACE_CSV_STORAGE); 
		}
		
		// TODO DELETE
		return TRACE::leaveok($context, "TODO not yet implemented", false, self::$TRACE_CSV_STORAGE);
	}
}
?>