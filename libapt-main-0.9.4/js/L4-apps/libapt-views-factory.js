/**
 * @file        libapt-views-factory.js
 * @brief       Factory to create views
 * @details     
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



LibaptViews.factory = function (arg_settings)
{
	var tracer = new LibaptObject('LibaptViews', false);
	tracer.trace = LIBAPT_VIEWS_TRACE;
	var context = 'LibaptViews.factory(settings)';
	tracer.enter(context, 'settings count:' + arg_settings.length);
	
	// GET AND CHECK CLASS NAME
	var class_name = arg_settings.class_name;
	if ( Libapt.is_null(class_name) )
	{
		tracer.value(context, 'settings', arg_settings);
		tracer.error(context, 'no class name found');
		return null;
	}
	tracer.value(context, 'class_name', class_name);
	
	
	// GET VIEW NAME
	var view_name	= arg_settings.name;
	tracer.assertNotNull(context, 'view name', view_name);
	
	// GET VIEW JQUERY OBJECT CONTAINER
	var container_jqo	= arg_settings.container_jqo;
	
	// CREATE CLASS CONSTRUCTOR
	var class_constructor = function(arg_class_name)
		{
			var clsClass = eval(arg_class_name);
			return new clsClass(name, container_jqo, arg_settings);
		};
	
	// INIT DEPENDENCIES
	Libapt.use(class_name);
	
	// GET VIEW OBJECT
	var view_obj	= null;
	switch(class_name)
	{
		case 'LibaptWindow':
			var win_view_name = arg_settings.window_view_name;
			tracer.assertNotNull(context, 'window view name', win_view_name);
			
			var win_view_obj = LibaptViews.get(win_view_name);
			tracer.assertNotNull(context, 'window view object', win_view_obj);
			
			view_obj = new LibaptWindow(view_name, win_view_obj, arg_settings);
			break;
			
		default:
			view_obj = class_constructor(class_name, name, container_jqo, arg_settings);
			// break;
	}
	
	
	// CHECK VIEW OBJECT
	if ( Libapt.is_null(view_obj) )
	{
		trace_var(context, 'settings', arg_settings, LIBAPT_VIEWS_TRACE);
		trace_error(context, 'no class name found', LIBAPT_VIEWS_TRACE);
		return null;
	}
	
	trace_leave(context, '', LIBAPT_VIEWS_TRACE);
	return view_obj;
}
