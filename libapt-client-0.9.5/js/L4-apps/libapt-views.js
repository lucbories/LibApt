/**
 * @file        libapt-views.js
 * @desc        Views repository
 *      		Register a view definition and do actions :
 * 					create new records
 * 					read existing data with options (filters, orders, group by, slice)
 * 					update existing records
 * 					delete existing records
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @class		LibaptViews
 * @public
 * @static
 * @desc		Views repository static class
 * @return		nothing
 */
function LibaptViews()
{
}



/**
 * @memberof	LibaptViews
 * @public
 * @static
 * @desc		Trace flag
 */
LibaptViews.trace = false;



/**
 * @memberof	LibaptViews
 * @public
 * @static
 * @desc		Views repository
 */
LibaptViews.views_by_name = {};



/**
 * @memberof			LibaptViews
 * @public
 * @static
 * @method				LibaptViews.get(arg_view_name)
 * @desc				Get a view from the views repository
 * @param {string}		arg_view_name	The view name
 * @return {object}		A LibaptView object
 */
LibaptViews.get = function (arg_view_name)
{
	var context = 'LibaptViews.get(view name)';
	Libapt.trace_enter(context, '', LibaptViews.trace);
	
	var view = LibaptViews.views_by_name[arg_view_name];
	if (! view)
	{
		// GET THE VIEW SETTINGS FROM THE SERVER AND CREATE THE VIEW
		var url = 'index.php?resourceAction=getView' + arg_view_name;
		var use_cache = false;
		var is_async = false;
		var view_settings = null;
		var ok_cb = function(datas) { view_settings = datas; };
		var ko_cb = null;
		Libapt.load_script(url, is_async, use_cache, ok_cb, ko_cb, 'json');
		if ( ! Libapt.is_null(view_settings) )
		{
			LibaptViews.create(view_settings);
		}
		else
		{
			Libapt.trace_error(context, 'view settings not found', LibaptViews.trace);
			return null;
		}
		
		// CHECK VIEW
		view = LibaptViews.views_by_name[arg_view_name];
		if (! view)
		{
			Libapt.trace_error(context, 'view not found', LibaptViews.trace);
			return null;
		}
	}
	
	Libapt.trace_leave(context, 'view found', LibaptViews.trace);
	return view;
}


/**
 * @memberof			LibaptViews
 * @public
 * @static
 * @method				LibaptViews.add(arg_view_obj)
 * @desc				Append a view to the views repository
 * @param {object}		arg_view_obj	The view object
 * @return				nothing
 */
LibaptViews.add = function (arg_view_obj)
{
	var context = 'LibaptViews.add(view)';
	Libapt.trace_enter(context, '', LibaptViews.trace);
	
	
	// CHECK VIEW
	if ( Libapt.is_null(arg_view_obj) )
	{
		Libapt.trace_error(context, 'view is null', LibaptViews.trace);
		return false;
	}
	
	// CHECK INHERITANCE
	if ( typeof(arg_view_obj) !== 'object' || ! arg_view_obj.is_view )
	{
		Libapt.trace_error(context, 'view of class:[' + arg_view_obj.class_name + '] type:[' + typeof(arg_view_obj) + '] name:[' + arg_view_obj.name + '] is not a LibaptView child class', LibaptViews.trace);
		return this;
	}
	
	// APPEND VIEW TO THE REPOSITORY ARRAY
	LibaptViews.views_by_name[arg_view_obj.name] = arg_view_obj;
	
	
	Libapt.trace_leave(context, 'success', LibaptViews.trace);
	return true;
}



/**
 * @memberof				LibaptViews
 * @public
 * @static
 * @method					LibaptViews.remove(arg_view_obj)
 * @desc					Remove a view from the views repository
 * @param {string|object}	arg_view_obj	The view name or object
 * @return {boolean}		true:success,false:failure
 */
LibaptViews.remove = function (arg_view_obj)
{
	var context = 'LibaptViews.remove(view)';
	Libapt.trace_enter(context, '', LibaptViews.trace);
	
	
	var view_name = null;
	
	// IF A STRING IS GIVEN GET THE VIEW OBJECT
	if ( Libapt.is_string(arg_view_obj) )
	{
		view_name = arg_view_obj;
	}
	
	// CHECK THE VIEW OBJECT
	if ( Libapt.is_object(arg_view_obj) )
	{
		view_name = arg_view_obj.name;
	}
	
	// REMOVE FROM REPOSITORY
	LibaptViews.views_by_name[arg_view_obj.name] = undefined;
	
	
	Libapt.trace_leave(context, 'success', LibaptViews.trace);
	return true;
}


/**
 * @memberof			LibaptViews
 * @public
 * @static
 * @method				LibaptViews.create(arg_settings)
 * @desc				Create a view from given settings
 * @param {object}		arg_settings	The view settings
 * @return {object}		The created view object
 */
LibaptViews.create = function (arg_settings)
{
	var context = 'LibaptViews.create(settings)';
	Libapt.trace_enter(context, '', LibaptViews.trace);
	
	
	var view_obj = LibaptViews.factory(arg_settings);
	LibaptViews.add(view_obj);
	if ( Libapt.is_array(arg_settings) )
	{
		for(settings_index in arg_settings)
		{
			var view_def = arg_settings[settings_index];
			
			var view_obj = null;
			if (typeof view_def == 'object' && view_def instanceof LibaptView)
			{
				Libapt.trace_step(context, 'already a view object', LibaptViews.trace);
				view_obj = view_def;
			}
			else if (typeof view_def == 'object' && ! (view_def instanceof LibaptView) )
			{
				Libapt.trace_step(context, 'create from settings', LibaptViews.trace);
				view_obj = LibaptViews.factory(view_def);
			}
			else
			{
				Libapt.trace_error(context, 'view definition is not an object or a set of settings', LibaptViews.trace);
				return false;
			}
			LibaptViews.add(view_obj);
		}
	}
	
	Libapt.trace_leave(context, 'success', LibaptViews.trace);
	return view_obj;
}
