/**
 * @file        libapt-views.js
 * @brief       JQuery plugin to use LIBAPT data access views
 * @details     Register a view definition and do actions :
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

var LIBAPT_VIEWS_TRACE = false;



/**
 * LIBAPT MAIN / APPLICATION / VIEWS REPOSITORY
 * 
 *  
 */


 // DECLARE JQUERY LIBAPT-MAIN-VIEWS PLUGIN
(function( $ )
{
	// PLUGIN CONFIGURATION
	var plugin_name = 'libapt.views';
	
	$.widget(
		plugin_name,
		{
			version: '0.9.1',
			options:
			{
				views_definitions: []
			},
			
			views_array: [],
			
			// VIEW REPOSITORY CONSTRUCTOR
			_create: function()
				{
					var context = 'libapt.views.create()';
					trace_enter(context, '', LIBAPT_VIEWS_TRACE);
					
					if ( Libapt.is_array(this.options.views_definitions) )
					{
						this.options.views_definitions.forEach(
							function(view_def, index, array)
							{
								var view_obj = null;
								if (typeof view_def == 'object' && view_def instanceof LibaptView)
								{
									trace_step(context, 'already a view object', LIBAPT_VIEWS_TRACE);
									view_obj = view_def;
								}
								else if (typeof view_def == 'object' && ! (view_def instanceof LibaptView) )
								{
									trace_step(context, 'create from settings', LIBAPT_VIEWS_TRACE);
									view_obj = LibaptViews.factory(view_def);
								}
								else
								{
									trace_error(context, 'view definition is not an object or a set of settings', LIBAPT_VIEWS_TRACE);
									return null;
								}
								this.add(view_obj);
							}
						);
					}
					
					trace_leave(context, 'success', LIBAPT_VIEWS_TRACE);
				},
			
			
			// VIEW REPOSITORY DESTRUCTOR
			_destroy : function()
			{
				this.views_array = null;
			},
			
			
			// APPEND AN EXISTING VIEW TO THE REPOSITORY
			add : function(arg_view)
			{
				var context = 'libapt.views.add(view)';
				trace_enter(context, '', LIBAPT_VIEWS_TRACE);
				
				// CHECK VIEW
				if ( Libapt.is_null(arg_view) )
				{
					trace_error(context, 'view is null', LIBAPT_VIEWS_TRACE);
					return this;
				}
				
				// CHECK INHERITANCE
				// var is_view = Libapt.test_inheritance(arg_view, LibaptView);
				if ( typeof(arg_view) !== 'object' || ! arg_view.is_view )
				{
					trace_error(context, 'view of class:[' + arg_view.class_name + '] type:[' + typeof(arg_view) + '] name:[' + arg_view.name + '] is not a LibaptView child class', LIBAPT_VIEWS_TRACE);
					// console.log(arg_view);
					return this;
				}
				
				// APPEND VIEW TO THE REPOSITORY ARRAY
				this.views_array[arg_view.name] = arg_view;
				
				trace_leave(context, 'success', LIBAPT_VIEWS_TRACE);
				return this;
			},
			
			
			// CREATE AND APPEND A VIEW TO THE REPOSITORY
			create_and_add : function(arg_settings)
			{
				var context = 'libapt.views.create_and_add(args)';
				trace_enter(context, '', LIBAPT_VIEWS_TRACE);
				
				var view_obj = LibaptViews.factory(arg_settings);
				this.add(view_obj);
				
				trace_leave(context, '', LIBAPT_VIEWS_TRACE);
				return this;
			},
			
			get : function(arg_name)
			{
				var context = 'libapt.views.get';
				trace_enter(context, '', LIBAPT_VIEWS_TRACE);
				
				var view = this.views_array[arg_name];
				if (! view)
				{
					// GET THE VIEW SETTINGS FROM THE SERVER AND CREATE THE VIEW
					var url = 'index.php?resourceAction=getView' + arg_name;
					var use_cache = false;
					var is_async = false;
					var view_settings = null;
					var ok_cb = function(datas) { view_settings = datas; };
					var ko_cb = null;
					Libapt.load_script(url, is_async, use_cache, ok_cb, ko_cb, 'json');
					if ( ! Libapt.is_null(view_settings) )
					{
						this.create_and_add(view_settings);
					}
					else
					{
						trace_error(context, 'view settings not found', LIBAPT_VIEWS_TRACE);
						return null;
					}
					
					// CHECK VIEW
					view = this.views_array[arg_name];
					if (! view)
					{
						trace_error(context, 'view not found', LIBAPT_VIEWS_TRACE);
						return null;
					}
				}
				
				trace_leave(context, '', LIBAPT_VIEWS_TRACE);
				return view;
			},
			
			lookup : function(arg_settings)
			{
				var context = 'libapt.views.lookup';
				trace_enter(context, '', LIBAPT_VIEWS_TRACE);
				
				trace_leave(context, 'not yet implemented', LIBAPT_VIEWS_TRACE);
			},
			
			remove : function(arg_settings)
			{
				var context = 'libapt.views.remove';
				trace_enter(context, '', LIBAPT_VIEWS_TRACE);
				
				trace_leave(context, 'not yet implemented', LIBAPT_VIEWS_TRACE);
			}
		}
	);
	
	$(document).views();
})( jQuery );



function LibaptViews()
{
}

LibaptViews.get = function (arg_view_name)
{
	return $(document).views('get', arg_view_name);
}

// LibaptViews.preload = function (arg_view_names)
// {
	// return $(document).views('preload', arg_view_names);
// }

LibaptViews.add = function (arg_view_obj)
{
	$(document).views('add', arg_view_obj);
}

LibaptViews.remove = function (arg_view_obj)
{
	$(document).views('remove', arg_view_obj);
}

LibaptViews.create = function (arg_settings)
{
	return $(document).views('create_and_add', arg_settings);
}
