<?php
/**
 * @version		$Id: class_abstract_model_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/L3-views/api
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
abstract class AbstractModelView extends AbstractTemplateViewImpl
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
	}
	
	// AUHTORIZATIONS
	abstract protected function initAuthorizations();
	abstract public function canRead();
	abstract public function canCreate();
	abstract public function canUpdate();
	abstract public function canDelete();
	
	// MODEL
	abstract protected function initModel();
	abstract public function getModel();
	abstract public function setModel($arg_model);
	
	// FILTERS CHAIN
	abstract protected function initFiltersChain();
	abstract public function hasFiltersChain();
	abstract public function hasFilters();
	abstract public function getFilters();
	abstract public function getFiltersChain();
	abstract public function setFiltersChain($arg_filters_chain);
	
	// ORDERS
	abstract protected function initOrders();
	abstract public function hasOrders();
	abstract public function getOrders();
	abstract public function setOrders($arg_orders);
	abstract public function &getOrderAt($arg_index);
	abstract public function setOrderAt($arg_index, $arg_order);
	abstract public function removeOrderAt($arg_index);
	abstract public function addOrder($arg_order);
	
	// GROUPS
	abstract protected function initGroups();
	abstract public function hasGroups();
	abstract public function getGroups();
	abstract public function setGroups($arg_groups);
	abstract public function &getGroupAt($arg_index);
	abstract public function setGroupAt($arg_index, $arg_group);
	abstract public function removeGroupAt($arg_index);
	abstract public function addGroup($arg_group);
	
	// SLICE
	abstract protected function initSlice();
	abstract public function hasSlice();
	abstract public function getSlice();
	abstract public function getSliceOffset();
	abstract public function getSliceLength();
	abstract public function setSlice($arg_offset, $arg_length);
	abstract public function setSliceOffset($arg_offset);
	abstract public function setSliceLength($arg_length);
}
?>