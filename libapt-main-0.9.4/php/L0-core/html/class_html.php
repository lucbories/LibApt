<?php
/**
 * @file        class_html.php
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
final class HTML extends CORE_HTML
{
	// ATTRIBUTES
	static protected $MAX_INIT_DEPTH			= 10;
	
	static protected $html_all_adapters			= null;
	static protected $html_table_adapter		= null;
	static protected $html_accordion_adapter	= null;
	static protected $html_grid_layout_adapter	= null;
	static protected $html_menus_bar_adapter	= null;
	static protected $html_portlet_adapter		= null;
	static protected $html_tabs_adapter			= null;
	
	static protected $html_input_adapters		= null;
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// ADAPTER
	static public function init($arg_adapters)
	{
		// INIT ADAPTERS ARRAY
		self::$html_all_adapters		= array();
		self::$html_table_adapter		= null;
		self::$html_accordion_adapter	= null;
		self::$html_grid_layout_adapter	= null;
		self::$html_menus_bar_adapter	= null;
		self::$html_tabs_adapter		= null;
		
		self::$html_input_adapters		= array();
		
		// GET ARGS
		$args_count = func_num_args();
		$args_array	= func_get_args();
		
		for($args_index = 0 ; $args_index < $args_count ; $args_index++)
		{
			$args_current = $args_array[$args_index];
			
			// PROCESS CURRENT ADAPTER
			self::initAdapter($args_current);
		}
	}
	
	static public function initAdapter($arg_adapter, $arg_depth = 0)
	{
		// CHECK DEPTH
		if ($arg_depth >= self::$MAX_INIT_DEPTH)
		{
			return;
		}
		
		// CHECK ADAPTER
		if ( is_null($arg_adapter) )
		{
			return;
		}
		
		// ADAPTER IS AN ARRAY
		if ( is_array($arg_adapter) )
		{
			$args_count = count($arg_adapter);
			for($args_index = 0 ; $args_index < $args_count ; $args_index++)
			{
				$args_current = $arg_adapter[$args_index];
				
				// PROCESS CURRENT ADAPTER
				self::initAdapter($args_current, ++$arg_depth);
			}
		}
		
		// ADAPTER IS AN HTML TABLE ADAPTER
		if ($arg_adapter instanceof AbstractHtmlTableAdapter)
		{
			self::$html_all_adapters[]	= $arg_adapter;
			self::$html_table_adapter	= $arg_adapter;
		}
		
		// ADAPTER IS AN HTML ACCORDION ADAPTER
		if ($arg_adapter instanceof AbstractHtmlAccordionAdapter)
		{
			self::$html_all_adapters[]	= $arg_adapter;
			self::$html_accordion_adapter	= $arg_adapter;
		}
		
		// ADAPTER IS AN HTML GRID LAYOUT ADAPTER
		if ($arg_adapter instanceof AbstractHtmlGridLayoutAdapter)
		{
			self::$html_all_adapters[]		= $arg_adapter;
			self::$html_grid_layout_adapter	= $arg_adapter;
		}
		
		// ADAPTER IS AN HTML MENUS BAR ADAPTER
		if ($arg_adapter instanceof AbstractHtmlMenusBarAdapter)
		{
			self::$html_all_adapters[]		= $arg_adapter;
			self::$html_menus_bar_adapter	= $arg_adapter;
		}
		
		// ADAPTER IS AN HTML PORTLET ADAPTER
		if ($arg_adapter instanceof AbstractHtmlPortletAdapter)
		{
			self::$html_all_adapters[]		= $arg_adapter;
			self::$html_portlet_adapter		= $arg_adapter;
		}
		
		// ADAPTER IS AN HTML TABS ADAPTER
		if ($arg_adapter instanceof AbstractHtmlTabsAdapter)
		{
			self::$html_all_adapters[]	= $arg_adapter;
			self::$html_tabs_adapter	= $arg_adapter;
		}
		
		// ADAPTER IS AN HTML INPUT ADAPTER
		if ($arg_adapter instanceof AbstractHtmlInputAdapter)
		{
			// self::$html_all_adapters[]	= $arg_adapter;
			
			$input_types = $arg_adapter->getInputTypes();
			foreach($input_types as $type)
			{
				self::$html_all_adapters[]	= $arg_adapter;
				self::$html_input_adapters[$type] = $arg_adapter;
			}
		}
	}
	
	
	// HEADERS
	static public function useStandardHeaders()
	{
		foreach(self::$html_all_adapters as $adapter)
		{
			$adapter->useStandardHeaders();
		}
	}
	
	
	// FORM
	static public function formInput($arg_id, $arg_name, $arg_label, $arg_type, $arg_value, $arg_readonly, $arg_classes = "", $arg_opts = "")
	{
		if ( array_key_exists($arg_type, self::$html_input_adapters) )
		{
			return self::$html_input_adapters[$arg_type]->htmlInput($arg_id, $arg_name, $arg_label, $arg_type, $arg_value,  $arg_readonly, $arg_classes, $arg_opts);
		}
		return false;
	}
	
	static public function formInputModelField($arg_id, $arg_name, $arg_label, $arg_readonly, $arg_hidden, $arg_form_id, $arg_model_object, $arg_field_object, $arg_field_value, $arg_classes = "", $arg_opts = "")
	{
		if ( array_key_exists("ModelField", self::$html_input_adapters) )
		{
			return self::$html_input_adapters["ModelField"]->htmlInputModelField($arg_id, $arg_name, $arg_label, $arg_readonly, $arg_hidden, $arg_form_id, $arg_model_object, $arg_field_object, $arg_field_value, $arg_classes, $arg_opts);
		}
		return false;
	}
	
	static public function formSelect($arg_id, $arg_name, $arg_label, $arg_type, $arg_values, $arg_selected_value, $arg_readonly, $arg_classes = "", $arg_opts = "")
	{
		if ( array_key_exists($arg_type, self::$html_input_adapters) )
		{
			$value = array("values" => $arg_values, "selected" => $arg_selected_value);
			return self::$html_input_adapters[$arg_type]->htmlInput($arg_id, $arg_name, $arg_label, $arg_type, $value,  $arg_readonly, $arg_classes, $arg_opts);
		}
		return false;
	}
	
	
	// DROP DOWN MENU
	static public function dropDownMenuLabels($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_selected_index)
	{
		self::$adapter->dropDownMenuLabels($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_selected_index);
	}
	
	static public function dropDownMenuUrls($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_urls, $arg_selected_index)
	{
		self::$adapter->dropDownMenuUrls($arg_menu_label, $arg_menu_style, $arg_menu_selector, $arg_labels, $arg_urls, $arg_selected_index);
	}
	
	
	// TABLE
	static public function enterTable($arg_id = null, $arg_class = null, $arg_tag_opts = null)			{ is_null(self::$html_table_adapter) ? CORE_HTML::enterTable($arg_id, $arg_class, $arg_tag_opts)		: self::$html_table_adapter->enterTable($arg_id, "ui-widget ui-widget-content ".$arg_class, $arg_tag_opts); }
	static public function leaveTable()																	{ is_null(self::$html_table_adapter) ? CORE_HTML::leaveTable()											: self::$html_table_adapter->leaveTable(); }
	
	static public function enterTableHead($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ is_null(self::$html_table_adapter) ? CORE_HTML::enterTableHead($arg_id, $arg_class, $arg_tag_opts)	: self::$html_table_adapter->enterTableHead($arg_id, "ui-widget-header ".$arg_class, $arg_tag_opts); }
	static public function leaveTableHead()																{ is_null(self::$html_table_adapter) ? CORE_HTML::leaveTableHead()										: self::$html_table_adapter->leaveTableHead(); }
	
	static public function enterTableBody($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ is_null(self::$html_table_adapter) ? CORE_HTML::enterTableBody($arg_id, $arg_class, $arg_tag_opts)	: self::$html_table_adapter->enterTableBody($arg_id, $arg_class, $arg_tag_opts); }
	static public function leaveTableBody()																{ is_null(self::$html_table_adapter) ? CORE_HTML::leaveTableBody()										: self::$html_table_adapter->leaveTableBody(); }
	
	static public function enterTableFoot($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ is_null(self::$html_table_adapter) ? CORE_HTML::enterTableFoot($arg_id, $arg_class, $arg_tag_opts)	: self::$html_table_adapter->enterTableFoot($arg_id, $arg_class, $arg_tag_opts); }
	static public function leaveTableFoot()																{ is_null(self::$html_table_adapter) ? CORE_HTML::leaveTableFoot()										: self::$html_table_adapter->leaveTableFoot(); }
	
	
	// ACCORDION
	static public function enterAccordion($arg_id = null, $arg_class = null, $arg_tag_opts = null)		{ is_null(self::$html_accordion_adapter) ? CORE_HTML::enterDIV($arg_id, $arg_class, $arg_tag_opts)	: self::$html_accordion_adapter->enterAccordion($arg_id, "ui-widget ui-widget-content ".$arg_class, $arg_tag_opts); }
	static public function leaveAccordion()																{ is_null(self::$html_accordion_adapter) ? CORE_HTML::leaveDIV()									: self::$html_accordion_adapter->leaveAccordion(); }
	
	static public function enterAccordionTitle()														{ is_null(self::$html_accordion_adapter) ? CORE_HTML::enterDIV()									: self::$html_accordion_adapter->enterAccordionTitle(); }
	static public function leaveAccordionTitle()														{ is_null(self::$html_accordion_adapter) ? CORE_HTML::leaveDIV()									: self::$html_accordion_adapter->leaveAccordionTitle(); }
	
	static public function enterAccordionContent()														{ is_null(self::$html_accordion_adapter) ? CORE_HTML::enterDIV()									: self::$html_accordion_adapter->enterAccordionContent(); }
	static public function leaveAccordionContent()														{ is_null(self::$html_accordion_adapter) ? CORE_HTML::leaveDIV()									: self::$html_accordion_adapter->leaveAccordionContent(); }
	
	
	// GRID LAYOUT ADAPTER
	static public function enterRowLayout($arg_class = null, $arg_tag_opts = null)						{ is_null(self::$html_grid_layout_adapter) ? HTML::enterDIV(null, $arg_class, $arg_tag_opts)	: self::$html_grid_layout_adapter->enterRowLayout($arg_class); }
	static public function leaveRowLayout()																{ is_null(self::$html_grid_layout_adapter) ? HTML::leaveDIV()									: self::$html_grid_layout_adapter->leaveRowLayout(); }
	
	static public function enterColumnsLayout($arg_columns = 12, $arg_center = true, $arg_class = null)	{ is_null(self::$html_grid_layout_adapter) ? HTML::enterDIV(null, $arg_class)					: self::$html_grid_layout_adapter->enterColumnsLayout($arg_columns, $arg_center, $arg_class); }
	static public function leaveColumnsLayout()															{ is_null(self::$html_grid_layout_adapter) ? HTML::leaveDIV()									: self::$html_grid_layout_adapter->leaveColumnsLayout(); }
	
	
	// MENUS BAR
	// html_menus_bar_adapter
	
	// TABS
	// html_tabs_adapter
	
	
	// PORTLET TAGS
	static public function enterPortletContainer($arg_id = null, $arg_class = null, $arg_opts = null)	{ is_null(self::$html_portlet_adapter) ? HTML::enterDIV($arg_id, $arg_class, $arg_opts)	: self::$html_portlet_adapter->enterPortletContainer($arg_id, $arg_class, $arg_opts); }
	static public function leavePortletContainer()														{ is_null(self::$html_portlet_adapter) ? HTML::leaveDIV()								: self::$html_portlet_adapter->leavePortletContainer(); }
	
	static public function enterPortlet($arg_id = null, $arg_class = null, $arg_opts = null)			{ is_null(self::$html_portlet_adapter) ? HTML::enterDIV($arg_id, $arg_class, $arg_opts)	: self::$html_portlet_adapter->enterPortlet($arg_id, $arg_class, $arg_opts); }
	static public function leavePortlet()																{ is_null(self::$html_portlet_adapter) ? HTML::leaveDIV()								: self::$html_portlet_adapter->leavePortlet(); }
	
	static public function enterPortletTitle($arg_id = null, $arg_class = null, $arg_opts = null)		{ is_null(self::$html_portlet_adapter) ? HTML::enterDIV($arg_id, $arg_class, $arg_opts)	: self::$html_portlet_adapter->enterPortletTitle($arg_id, $arg_class, $arg_opts); }
	static public function leavePortletTitle()															{ is_null(self::$html_portlet_adapter) ? HTML::leaveDIV()								: self::$html_portlet_adapter->leavePortletTitle(); }
	
	static public function leavePortletContent()														{ is_null(self::$html_portlet_adapter) ? HTML::leaveDIV()								: self::$html_portlet_adapter->leavePortletContent(); }
	static public function enterPortletContent($arg_id = null, $arg_class = null, $arg_opts = null)		{ is_null(self::$html_portlet_adapter) ? HTML::enterDIV($arg_id, $arg_class, $arg_opts)	: self::$html_portlet_adapter->enterPortletContent($arg_id, $arg_class, $arg_opts); }
}
?>