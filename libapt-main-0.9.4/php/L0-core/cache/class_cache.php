<?php
/**
 * @file        class_cache.php
 * @brief       Class for cache engine)
 * @details     to finish...
 * @see			Trace
 * @ingroup     L0_CORE
 * @date        2012-02-20
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * @todo		Finish implementations
 */
final class CACHE
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	static protected $cache_adapter = null;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR (protected)
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	// ----------------- CACHE ADAPTER WRAPPERS -----------------
	
	/**
	 * @brief		Set the cache adapater
	 * @param[in]	arg_id			cache adapter (object)
	 * @return		nothing
	 */
	static function setAdapter($arg_adapter)
	{
		$context = "CACHE.setAdapter";
		
		self::$cache_adapter = null;
		CONTRACT::assertInherit($context, $arg_adapter, "AbstractCacheAdapter");
		self::$cache_adapter = $arg_adapter;
	}
	
	
	/**
	 * @brief		Init the cache feature with a cache adapater
	 * @param[in]	arg_id			cache adapter (object)
	 * @return		nothing
	 */
	static public function init($arg_adapter)
	{
		self::setAdapter($arg_adapter);
	}
	
	
	/**
	 * @brief		Get a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		cached object	(anything)
	 */
	static public function fetch($arg_id, $arg_default = false)
	{
		if ( Application::getInstance()->hasAuthentication() && ! Authentication::isLogged() )
		{
			return $arg_default;
		}
		
		return self::$cache_adapter->fetch($arg_id, $arg_default);
	}
	
	
	/**
	 * @brief		Test if the cache has a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		has cached object	(boolean)
	 */
	static public function contains($arg_id)
	{
		return self::$cache_adapter->contains($arg_id);
	}
	
	
	/**
	 * @brief		Store a cached object with a given object id for a given life time
	 * @param[in]	arg_id				target object id (string)
	 * @param[in]	arg_data			target object data
	 * @param[in]	arg_has_lifetime	target object has a life time
	 * @return		nothing
	 */
	static public function save($arg_id, $arg_data, $arg_has_lifetime = false)
	{
		return self::$cache_adapter->save($arg_id, $arg_data, $arg_has_lifetime);
	}
	
	
	/**
	 * @brief		Delete a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		nothing
	 */
	static public function delete($arg_id)
	{
		return self::$cache_adapter->delete($arg_id);
	}
	
	
	/**
	 * @brief		Start PHP macro
	 * @return		nothing
	 */
	static public function startPhpCache()
	{
		ob_start();
	}
	
	
	/**
	 * @brief		Stop PHP macro and save cached buffer
	 * @param[in]	arg_id			target object id (string)
	 * @param[in]	arg_has_lifetime	target object has a life time
	 * @return		nothing
	 */
	static public function stopPhpCache($arg_id, $arg_has_lifetime = false)
	{
		$buffer = ob_get_clean();
		self::save($arg_id, $buffer, $arg_has_lifetime);
		return $buffer;
	}
}

// expire = time() -3600 ; // valable une heure
// fetch($id) - Fetches an entry from the cache.
// contains($id) - Test if an entry exists in the cache.
// save($id, $data, $lifeTime = false) - Puts data into the cache.
//delete($id) - Deletes a cache entry.
?>