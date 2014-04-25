<?php
/**
 * @file        load_resources.php
 * @brief       Load resources functions
 * @details     Some usefull functions to load resources
 * @ingroup		L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		LOAD A CLASS FILE
 * @details		Automatically load a class file with a sub folder path name and a class name
 * 				For example, a class MyFeature should be saved in a file class_my_feature.php
 * 				and a call to load_class('sub folder path', 'my_feature') will call
 * 					require_once('libapt-main path'/'sub folder path'/class_'my_feature'.php)
 * @param[in]	arg_module			sub folder path name
 * @param[in]	arg_class_name		class name as in the file name
 * @return		nothing
 */
function load_class($arg_module, $arg_class_name)
{
	$path = LIBAPT_FRAMEWORK_SERVER_ROOT . '/php/' . $arg_module . '/class_' . $arg_class_name . '.php';
	
	if ( file_exists($path) )
	{
		require_once($path);
	}
	else
	{
		echo "ERROR : path not found [$path]<BR>";
	}
}


/**
 * @brief		CHARSET CONVERSION
 * @details		Convert a string in UTF8 if needed
 * @see			LIBAPT_APP_DEFAULT_CHARSET
 * @param[in]	arg_text			text string to convert
 * @return		UTF8 string
 */
function utf8_convert($arg_text)
{
	if (LIBAPT_APP_DEFAULT_CHARSET == "WINDOWS-FR")
	{
		if ( is_array($arg_text) )
		{
			$new_array = array();
			foreach($arg_text as $key=>$value)
			{
				if (mb_detect_encoding($value) != "UTF-8")
				{
					$new_array[ utf8_encode($key) ] = utf8_encode($value);
				}
				else
				{
					$new_array[ utf8_encode($key) ] = $value;
				}
			}
			return $new_array;
		}
		if (mb_detect_encoding($arg_text) != "UTF-8")
		{
			return utf8_encode($arg_text);
		}
	}
	return $arg_text;
}


/**
 * @brief		LOAD PLUGIN RESOURCES
 * @details		Automatically load plugin resources with a sub folder path name and a class name
 * 				For example, a class MyFeature should be saved in a file class_my_feature.php
 * 				and a call to load_class('sub folder path', 'my_feature') will call
 * 					require_once('libapt-main path'/'sub folder path'/class_'my_feature'.php)
 * @param[in]	arg_plugin_name			name of the plugin sub folder path (string)
 * @param[in]	arg_plugin_version		version of the plugin sub folder path (string)
 * @return		nothing					ECHO "ERROR ..." if file is not found
 */
function load_plugin($arg_plugin_name, $arg_plugin_version)
{
	$load_file_path_name = LIBAPT_FRAMEWORK_SERVER_ROOT."/externals/".$arg_plugin_name."-".$arg_plugin_version."/load.php";
	
	if ( file_exists($load_file_path_name) )
	{
		require_once($load_file_path_name);
	}
	else
	{
		echo "ERROR : load file path name [$load_file_path_name] not found for plugin [$arg_plugin_name] in version [$arg_plugin_version]<BR>";
	}
}

?>