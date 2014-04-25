<?php
/**
 * @version		$Id: class_filters_chain_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/filters
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class FiltersChainView extends AbstractViewImpl
{
	// ATTRIBUTS
	protected $model = null;
	protected $filters_chain = null;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_unique_name, $arg_model, $arg_filters_chain, $arg_parent_view)
	{
		// INIT PARENT CLASS
		parent::__construct($arg_unique_name, $arg_parent_view);
		
		// INIT ATTRIBUTES
		$this->model = $arg_model;
		$this->filters_chain = $arg_filters_chain;
		
		// CHECK ATTRIBUTES
		if ( is_null($this->model) )
		{
			TRACE::finko("FiltersChainView.".$this->getName().".contructor", "model is null");
		}
		if ( is_null($this->filters_chain) )
		{
			TRACE::finko("FiltersChainView.".$this->getName().".contructor", "chain is null");
		}
	}
	
	
	// ATTRIBUT MODEL
	public function getModel()
	{
		return $this->model;
	}
	
	public function setModel($arg_model)
	{
		$this->model = $arg_model;
	}
	
	
	// ATTRIBUT FILTERED VIEW
	public function getFiltersChain()
	{
		return $this->filters_chain;
	}
	
	
	// RENDER HTML
	public function html()
	{
		// VUE NON VISIBLE OU NON ETENDUE
		if ( ! $this->isVisible() /*or ! $this->isExpanded()*/ )
		{
			$this->htmlTextEol("NOTHING TO DISPLAY");
			return;
		}
		
		// CHECK CHAIN
		if ( is_null($this->filters_chain) )
		{
			TRACE::finko("FiltersChainView.".$this->getName().".html", "chain is null");
			return;
		}
		
		// DISPLAY TABLE BODY
		echo "<DIV id=filters>\n";
		echo("\n<TABLE>\n");
		
		
		// PREPARE FORM
		$form = null;
		$id = "filters_form";
		$name = $this->getName() . "_update_filters";
		$method = "POST";
		$action_filters = "updateFilters";
		$action_view = "html" . $this->getTopParentView()->getName();
		$action = Urls::getCustom2ActionsUrl("filterAction", $action_filters, "viewAction", $action_view , "");
		$form = new Form($id, $name, $method, $action);
		
		// HIDDEN FILTERS VIEW
		$input_id      = "filter_view_id";
		$input_name    = "filter_view";
		$input_label   = null;
		$input_value   = $this->getName();
		$input_readonly= true;
		$form->addInputHidden($input_id, $input_name, $input_label, $input_value, $input_readonly, "", "");
		
		// HIDDEN FILTERS COUNT
		$input_id      = "filters_count_id";
		$input_name    = "filters_count";
		$input_label   = null;
		$input_value   = count($this->filters_chain->getFilters());
		$input_readonly= true;
		$form->addInputHidden($input_id, $input_name, $input_label, $input_value, $input_readonly, "", "");
		
		// LIST ALL FILTERS
		$filters = $this->filters_chain->getFilters();
		if ( ! is_null($filters) )
		{
			foreach($filters as $key => $filter)
			{
				if ( ! is_null($filter) )
				{
					$form->addHtml("<TR>");
					$this->htmlFilter($form, $filter, $key, true);
					$form->addHtml("</TR>");
				}
			}
		}
		
		
		// FILTERS CHAIN IS EDITABLE
		if ( $this->isEditable() )
		{	
			// ADD
			$form->addHtml("<TR>");
			$key = count($filters);
			$this->htmlFilter($form, null, $key, false);
			$form->addHtml("</TR>");
			
			// UPDATE BUTTON
			$form->addHtml("<TR><TD COLSPAN='6'>");
			$form->addInputSubmit("UPDATE", "", "");
			$form->addHtml("</TD></TR>");
		}
		
		$form->html();
		
		echo("</TABLE>\n");
		echo "</DIV>\n";
	}
	
	protected function htmlFilter($arg_form, $arg_filter, $arg_index, $arg_delete_icon)
	{
		$index_suffix = is_null($arg_filter) ? "_add" : "[".$arg_index."]";
		
		// HIDDEN FILTER INDEX
		$input_id      = "filter_index_id".$index_suffix;
		$input_name    = "filter_index".$index_suffix;
		$input_label   = null;
		$input_value   = $arg_index;
		$input_readonly= ! $this->isEditable();
		$arg_form->addInputHidden($input_id, $input_name, $input_label, $input_value, $input_readonly, "<TD>", "</TD>");
		
		// MODEL FIELD NAME
		$select_id      = "filter_field_id".$index_suffix;
		$select_name    = "filter_field".$index_suffix;
		$select_label   = null;
		$select_values  = $this->getModel()->getFieldsNames();
		if ( is_null($arg_filter) )
		{
			$select_values[]= "";
			$select_default = "";
		}
		else
		{
			$select_default = $arg_filter->getAttribute("field_name");
		}
		$arg_form->addInputSelect($select_id, $select_name, $select_label, $select_values, $select_default, "<TD>", "</TD>");
		
		// MODEL FIELD MODIFIER
		$select_id      = "filter_modifier_id".$index_suffix;
		$select_name    = "filter_modifier".$index_suffix;
		$select_label   = null;
		$select_values  = Filter::getModifiers();
		$select_default = is_null($arg_filter) ? "" : $arg_filter->getAttribute("filter_modifier");
		$arg_form->addInputSelect($select_id, $select_name, $select_label, $select_values, $select_default, "<TD>", "</TD>");
		
		// OPERATOR
		$select_id      = "filter_op_id".$index_suffix;
		$select_name    = "filter_op".$index_suffix;
		$select_label   = null;
		$select_values  = Filter::getOperators();
		$select_default = is_null($arg_filter) ? "" : $arg_filter->getAttribute("filter_op");
		$arg_form->addInputSelect($select_id, $select_name, $select_label, $select_values, $select_default, "<TD>", "</TD>");
		
		// OPERAND 1
		$input_id      = "filter_var1_id".$index_suffix;
		$input_name    = "filter_var1".$index_suffix;
		$input_label   = null;
		$input_type    = "text";
		$input_value   = is_null($arg_filter) ? "" : $arg_filter->getOperand(1);
		$input_readonly= ! $this->isEditable();
		$arg_form->addInput($input_id, $input_name, $input_label, $input_type, $input_value, $input_readonly, "<TD>", "</TD>");
		
		// OPERAND 2
		$input_id      = "filter_var2_id".$index_suffix;
		$input_name    = "filter_var2".$index_suffix;
		$input_label   = null;
		$input_type    = "text";
		$input_value   = is_null($arg_filter) ? "" : $arg_filter->getOperand(2);
		$input_readonly= ! $this->isEditable();
		$arg_form->addInput($input_id, $input_name, $input_label, $input_type, $input_value, $input_readonly, "<TD>", "</TD>");
		
		// DELETE ICON
		if ( $this->isEditable() and $arg_delete_icon == true )
		{
			$view_for_action = "html" . $this->getTopParentView()->getName();
			//$url_delete_action = "filterAction=deleteFilter&delete_at_filter=".$arg_index;
			//$url = Urls::getActionUrl(null, $view_for_action, $url_delete_action);
			
			$action_filters = "deleteFilter";
			$action_view = "html" . $this->getTopParentView()->getName();
			$url = Urls::getCustom2ActionsUrl("filterAction", $action_filters, "viewAction", $action_view , "delete_at_filter=$arg_index&filter_view=".$this->getName());
			
			$icon_file_path = Themes::getIconDeleteUrl();
			$arg_form->addHtml("<TD><a href='".$url."'><img src='".$icon_file_path."'/></a></TD>\n");
		}
	}
}
?>