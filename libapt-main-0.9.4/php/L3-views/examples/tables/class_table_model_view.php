<?php
/**
 * @file        class_table_model_view.php
 * @brief       javascript Table view to display model rows
 * @details     Create a HTML TABLE to create/display/update/delete the given model fields values
 * @see			AbstractTableModelView AbstractModelView Trace Type
 * @ingroup     L3_VIEWS
 * @date        2013-03-20
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class TableModelView extends AbstractTableModelView
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name			unique name for view
	 * @param[in]	arg_parent_view			parent view object or null
	 * @param[in]	arg_options				options array or null
	 * @return		nothing
	 */
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// DECLARE A JAVASCRIPT VIEW
		$this->is_js_view = true;
		
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
	}
	
	
	
	// ----------------- VIEW RENDER -----------------
	/**
	 * @brief		Render html view
	 * @return		nothing
	 */
	public function htmlSelf()
	{
		$context = "TableModelView.htmlSelf";
		TRACE::enter($context, "", self::$TRACE_TABLE);
		
		
		// TABLE OPTION : HAS TITLE BAR
		$js_has_title_bar = "view.has_title_bar=".($this->table_headers_has_titlebar ? "true" : "false").";";
		
		// TABLE OPTION : HAS TOOLS BAR
		$js_has_edit_toolbar = "view.has_edit_toolbar=".($this->table_headers_has_toolbar ? "true" : "false").";";
		
		// TABLE OPTION : CSS COLUMNS WIDTHS
		$js_cols_width = "";
		if ( ! is_null($this->table_columns_widths) )
		{
			$loop_count = 0;
			$js_cols_width = "view.css_fields_widths = {";
			foreach($this->table_columns_widths as $key=>$value)
			{
				$js_cols_width .= ($loop_count > 0 ? "," : "") ."$key:'$value'";
				++$loop_count;
			}
			$js_cols_width .= "};";
		}
		
		// TABLE OPTION : HIDDEN COLUMNS
		$js_hidden_cols = "";
		if ( ! is_null($this->table_hidden_columns) )
		{
			$loop_count = 0;
			$js_hidden_cols = "view.set_hidden_fields( new Array(";
			foreach($this->table_hidden_columns as $key=>$value)
			{
				$js_hidden_cols .= ($loop_count > 0 ? "," : "") ."'$value'";
				++$loop_count;
			}
			$js_hidden_cols .= ") );";
		}
		
		
		// CREATE INIT JS CODE
		$view_name	= $this->getName();
		$div_id		= $view_name."_container_id";
		HTML::addBufferLine("<div id='$div_id' ></div>");
		$js_code = "
			Libapt.after_resource('".$this->getName()." table options', function()
				{
					var jqo_container = $('#' + '$div_id');
					var view = LibaptViews.get('$view_name');
					view.set_container(jqo_container);
					$js_has_title_bar
					$js_has_edit_toolbar
					$js_cols_width
					$js_hidden_cols
					view.draw();
				}
			);\n";
		
		
		// REGISTER JS CODE
		$this->appendOnReadyCode($js_code);
		
		
		TRACE::leaveok($context, "", true, self::$TRACE_TABLE);
	}
}
?>