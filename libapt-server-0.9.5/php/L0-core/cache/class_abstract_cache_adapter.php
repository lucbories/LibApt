<?php
/**
 * @file        class_abstract_cache_adapter.php
 * @brief       Abstract class for cache engine (api)
 * @details     to finish...
 * @see			Trace
 * @ingroup     L0_CORE
 * @date        2012-01-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * @todo		Finish implementations
 */
abstract class AbstractCacheAdapter
{
	/**
	 * @brief		Get a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		cached object	(anything)
	 */
	abstract public function fetch($arg_id, $arg_default);
	
	/**
	 * @brief		Test if the cache has a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		has cached object	(boolean)
	 */
	abstract public function contains($arg_id);
	
	/**
	 * @brief		Store a cached object with a given object id for a given life time
	 * @param[in]	arg_id				target object id (string)
	 * @param[in]	arg_data			target object data
	 * @param[in]	arg_has_lifetime	target object has a life time
	 * @return		nothing
	 */
	abstract public function save($arg_id, $arg_data, $arg_has_lifetime = false);
	
	/**
	 * @brief		Delete a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		nothing
	 */
	abstract public function delete($arg_id);
}
?>