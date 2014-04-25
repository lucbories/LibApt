<?php
/**
 * @file        class_file_cache_adapter.php
 * @brief       Class for cache engine based on a file
 * @details     Store cached values in a dedicated file.
 *              A common file store the corresponding keys/filenames of values
 * @see			CACHE AbstractCacheAdapter Trace
 * @ingroup     L0_CORE
 * @date        2012-02-20
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * @todo		Finish implementations
 */
class FileCacheAdapter extends AbstractCacheAdapter
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	// @Brief Trace or not (boolean)
	static protected $TRACE_FILE_CACHE = false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	// @Brief Cache file absolute path (string)
	protected $file_path = null;
	
	// @Brief Cache file time to leave (ttl in seconds) (integer or null)
	protected $file_ttl = null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR (protected)
	 * @return		nothing
	 */
	public function __construct($arg_file_path, $arg_file_ttl = null)
	{
		$context = "FileCacheAdapter.constructor($arg_file_path, $arg_file_ttl)";
		TRACE::enter($context, "", self::$TRACE_FILE_CACHE);
		
		// INIT ATTRIBUTES
		$this->file_path	= $arg_file_path;
		$this->file_ttl		= $arg_file_ttl;
		
		// CHECK CACHE DIRECTORY
		CONTRACT::assertNotEmptyString($context.".arg_file_path", $arg_file_path);
		CONTRACT::assertTrue($context.".writable", is_writable($arg_file_path));
		
		TRACE::leaveok($context, "", true, self::$TRACE_FILE_CACHE);
	}
	
	

// expire = time() -3600 ; // valable une heure
// fetch($id) - Fetches an entry from the cache.
// contains($id) - Test if an entry exists in the cache.
// save($id, $data, $lifeTime = false) - Puts data into the cache.
//delete($id) - Deletes a cache entry.
	
	// ----------------- CACHE ADAPTER ENGINE -----------------
	
	/**
	 * @brief		Get a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		file path name	(string)
	 */
	protected function getFilePathName($arg_id, $arg_readable = true, $arg_writable = false)
	{
		$context = "FileCacheAdapter.getFilePathName($arg_id)";
		TRACE::enter($context, "", self::$TRACE_FILE_CACHE);
		
		// CHECK VALUE KEY
		CONTRACT::assertNotEmptyString($context.".arg_id", $arg_id);
		
		// GET AUTHORIZATION PREFIX
		$prefix = "noauth";
		if ( Application::getInstance()->hasAuthentication() )
		{
			$prefix = Authentication::getLogin();
		}
		CONTRACT::assertNotEmptyString($context.".prefix", $prefix);
		
		// GET CACHED VALUE FILE NAME
		$file_name = $prefix."_".md5($arg_id).".cache";
		$file_path_name = $this->file_path."/".$file_name;
		TRACE::trace_var($context, "file_path_name", $file_path_name, self::$TRACE_FILE_CACHE);
		
		// CHECK FILE PERMISSIONS
		if ( $arg_readable )
		{
			CONTRACT::assertTrue($context.".readable", is_readable($this->file_path) );
		}
		if ( $arg_writable )
		{
			CONTRACT::assertTrue($context.".writable", is_writable($this->file_path) );
		}
		
		return TRACE::leaveok($context, "", $file_path_name, self::$TRACE_FILE_CACHE);
	}
	
	
	/**
	 * @brief		Get a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		cached object	(anything)
	 */
	public function fetch($arg_id, $arg_default)
	{
		$context = "FileCacheAdapter.fetch($arg_id)";
		TRACE::step($context, "", self::$TRACE_FILE_CACHE);
		
		// GET CACHED FILE PATH NAME
		$file_path_name = $this->getFilePathName($arg_id, true, false);
		TRACE::trace_var($context, "file_path_name", $file_path_name, self::$TRACE_FILE_CACHE);
		
		// NO YOUNG CACHED FILE FOUND
		if ( ! self::containsFile($file_path_name) )
		{
			return TRACE::leaveok($context, "", $arg_default, self::$TRACE_FILE_CACHE);
		}
		
		// READ CACHED FILE CONTENT
		$buffer = file_get_contents($file_path_name);
		TRACE::trace_var($context, "datas.length", strlen($buffer), self::$TRACE_FILE_CACHE);
		
		return TRACE::leaveok($context, "", $buffer, self::$TRACE_FILE_CACHE);
	}
	
	
	/**
	 * @brief		Test if the cache has a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		has cached object	(boolean)
	 */
	public function contains($arg_id)
	{
		$context = "FileCacheAdapter.contains($arg_id)";
		TRACE::enter($context, "", self::$TRACE_FILE_CACHE);
		
		// CHECK FILE EXISTS
		$file_path_name = $this->getFilePathName($arg_id, false, false);
		TRACE::trace_var($context, "file_path_name", $file_path_name, self::$TRACE_FILE_CACHE);
		$result = self::containsFile($file_path_name);
		
		// FILE EXISTS AND IS YOUNG
		return TRACE::leaveok($context, "", $result, self::$TRACE_FILE_CACHE);
	}
	
	
	/**
	 * @brief		Test if the cache has a cached object with a given object id
	 * @param[in]	arg_file_path_name	file path name (string)
	 * @return		has cached object	(boolean)
	 */
	public function containsFile($arg_file_path_name)
	{
		$context = "FileCacheAdapter.contains($arg_file_path_name)";
		TRACE::enter($context, "", self::$TRACE_FILE_CACHE);
		
		CONTRACT::assertNotEmptyString($context.".arg_file_path_name", $arg_file_path_name);
		$result = file_exists($arg_file_path_name);
		
		// FILE DOESN'T EXISTS OR TTL IS NULL
		if ( !$result || is_null($this->file_ttl) )
		{
			return TRACE::leaveok($context, "", $result, self::$TRACE_FILE_CACHE);
		}
		
		// CHECK TTL
		$time_diff = time() - filemtime($arg_file_path_name);
		if ($time_diff >= $this->file_ttl)
		{
			return TRACE::leaveok($context, "", false, self::$TRACE_FILE_CACHE);
		}
		
		// FILE EXISTS AND IS YOUNG
		return TRACE::leaveok($context, "", true, self::$TRACE_FILE_CACHE);
	}
	
	
	/**
	 * @brief		Store a cached object with a given object id for a given life time
	 * @param[in]	arg_id				target object id (string)
	 * @param[in]	arg_data			target object data
	 * @param[in]	arg_has_lifetime	target object has a life time (time or false) (ignored)
	 * @return		nothing
	 */
	public function save($arg_id, $arg_data, $arg_has_lifetime = false)
	{
		$context = "FileCacheAdapter.save($arg_id)";
		TRACE::enter($context, "", self::$TRACE_FILE_CACHE);
		
		$file_path_name = $this->getFilePathName($arg_id, false, false);
		TRACE::trace_var($context, "file_path_name", $file_path_name, self::$TRACE_FILE_CACHE);
		TRACE::trace_var($context, "datas.length", strlen($arg_data), self::$TRACE_FILE_CACHE);
		
		$result = file_put_contents($file_path_name, $arg_data, LOCK_EX);
		CONTRACT::assertTrue($context.".result", $result);
		
		TRACE::leaveok($context, "", true, self::$TRACE_FILE_CACHE);
	}
	
	
	/**
	 * @brief		Delete a cached object with a given object id
	 * @param[in]	arg_id			target object id (string)
	 * @return		nothing
	 */
	public function delete($arg_id)
	{
		$context = "FileCacheAdapter.save($arg_id)";
		TRACE::enter($context, "", self::$TRACE_FILE_CACHE);
		
		unlink( $this->getFilePathName($arg_id, true, true) );
		
		TRACE::leaveok($context, "", true, self::$TRACE_FILE_CACHE);
	}
}
?>