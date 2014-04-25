/**
 * @file        libapt-windows.js
 * @desc        Window view objects repository
 * @see			libapt-window.js
 * @ingroup     LIBAPT_VIEWS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

	

/**
 * @desc 		Windows repository class
 * @return		nothing
 */
function LibaptWindows()
{
}


/**
 * @desc 		Windows repository array
 */
LibaptWindows.all_windows = [];


/**
 * @desc 		Windows repository associative array
 */
LibaptWindows.all_windows_by_name = {};


/**
 * @desc 				Get a unique window name
 * @param {string}		arg_window_name	Window initial name
 * @return {string}		The unique view name
 */
LibaptWindows.get_unique_name = function(arg_window_name)
{
	// THE GIVEN NAME IS UNIQUE
	if ( ! Libapt.is_object( LibaptWindows.all_windows_by_name[arg_window_name] ) )
	{
		return arg_window_name;
	}
	
	var windows_watchdog	= 5000;
	var window_index		= LibaptWindows.all_windows.length;
	var window_name			= arg_window_name + '_' + window_index;
	while( Libapt.is_object( LibaptWindows.all_windows_by_name[window_name] && window_index < windows_watchdog ) )
	{
		++window_index;
		window_name = arg_window_name + '_' + window_index;
	}
	
	return window_name;
}


/**
 * @desc 		Append a window to the windows repository
 * @return		nothing
 */
LibaptWindows.add = function(arg_window)
{
	LibaptWindows.all_windows.push(arg_window);
	LibaptWindows.all_windows_by_name[arg_window.name] = arg_window;
}


/**
 * @memberof				LibaptWindows
 * @public
 * @static
 * @method					LibaptWindows.remove(arg_window)
 * @desc 					Remove a window from the windows repository
 * @param {string|object}	arg_window		Window name or object
 * @return {boolean}		true:success,false:failure
 */
LibaptWindows.remove = function(arg_window)
{
	var window_name = null;
	
	// THE GIVEN ARGUMENT IS A WINDOW NAME
	if ( Libapt.is_object(arg_window) && Libapt.is_string(arg_window.name) )
	{
		window_name = arg_window.name;
	}
	
	// THE GIVEN ARGUMENT IS A WINDOW NAME
	if ( Libapt.is_string(arg_window) )
	{
		window_name = arg_window;
	}
	
	if ( Libapt.is_string(window_name) )
	{
		var tmp_windows = [];
		var tmp_windows_by_name = {};
		for(window_index in LibaptWindows.all_windows)
		{
			var window_obj = LibaptWindows.all_windows[window_index];
			if (window_obj.name != window_name)
			{
				tmp_windows.push(window_obj);
				tmp_windows_by_name[window_obj.name] = window_obj;
			}
		}
		LibaptWindows.all_windows = tmp_windows;
		LibaptWindows.all_windows_by_name = tmp_windows_by_name;

		return true;
	}
	
	return false;
}


/**
 * @desc 		Remove all windows of the repository
 * @return		nothing
 */
LibaptWindows.reset = function()
{
	LibaptWindows.all_windows = [];
	all_windows_by_name = {};
}
