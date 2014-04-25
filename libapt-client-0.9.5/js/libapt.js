/**
 * @file        libapt.js
 * @desc        Libapt static common features: Libapt static class, traces, errors, types, inheritance, modules, resources, utils
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


console.info('Libapt: Loading bootstrap');


/**
 * @ingroup     LIBAPT_MAIN_JS
 * @public
 * @static
 * @class		Libapt
 * @desc		Provide common features : types test, modules repository, classes inheritance
 */
Libapt = function()
{
}



// --------------------------------------------- REMOTE JAVASCRIPT LOADING ---------------------------------------------

/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register(arg_modules)
 * @desc				Register a module definition
 * @param {object}		arg_modules			module object to register
 * @return {nothing}
 */
Libapt.get_prototype_name = function(arg_prototype)
{
	if (arg_prototype.name === undefined)
	{
		var funcNameRegex = /function\s+(.{1,})\s*\(/;
		var results = funcNameRegex.exec(arg_prototype.toString());
		return (results && results.length > 1) ? results[1] : null;
	}
	
	return arg_prototype.name
}

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		is ajax request asynchronous default flag
 */
var LIBAPT_LOAD_SCRIPT_ASYNC = false;

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		is ajax result cached default flag
 */
var LIBAPT_LOAD_SCRIPT_CACHE = false;

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		ajax request default type name
 */
var LIBAPT_LOAD_SCRIPT_RESULT_TYPE = 'script';

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		ajax request default timeout
 */
var LIBAPT_LOAD_SCRIPT_TIMEOUT = 5;


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.load_script(arg_script_url, arg_async, arg_cache, arg_ok_cb, arg_ko_cb, arg_result_type)
 * @desc				Load a remote script
 * @param {string}		arg_script_url		url of the script to load
 * @param {boolean}		arg_async			is ajax request asynchronous flag
 * @param {boolean}		arg_cache			is ajax result cached flag
 * @param {function}	arg_ok_cb			callback on ajax request success
 * @param {function}	arg_ko_cb			callback on ajax request failure
 * @param {string}		arg_result_type		ajax result data type
 * @return {boolean}
 */
Libapt.load_script = function(arg_script_url, arg_async, arg_cache, arg_ok_cb, arg_ko_cb, arg_result_type)
{
	// console.log('Libapt.load_script [' + arg_script_url + '] begin');
	function is_null(arg_value)
	{
		return arg_value == null || typeof arg_value === 'undefined';
	};
	
	
	var result_data_type = is_null(arg_result_type) ? LIBAPT_LOAD_SCRIPT_RESULT_TYPE : arg_result_type;
	
	// IE < IE9 AJAX REQUEST
	// if (window.ActiveXObject && result_data_type == LIBAPT_LOAD_SCRIPT_RESULT_TYPE)
	// {
		// result_data_type = 'text';
	// }
	
	// COMMON AJAX REQUEST
	$.ajax(
		{
			async		: is_null(arg_async) ? LIBAPT_LOAD_SCRIPT_ASYNC : arg_async,
			cache		: is_null(arg_cache) ? LIBAPT_LOAD_SCRIPT_CACHE : arg_cache,
			type		: 'GET',
			dataType	: result_data_type,
			url			: arg_script_url,
			timeout		: LIBAPT_LOAD_SCRIPT_TIMEOUT,
			data		: null,
			
			success : function(datas, textStatus, jqXHR)
				{
					// var context = 'Libapt.load_script.ajax_request.success(...)';
					// console.log(context);
					
					/*if (window.ActiveXObject && Function.prototype.name === undefined)
					{
						// eval(datas);
						var s = $('<script type="javascript">' + datas + '</script>');
						var h = $(document.head);
						h.append(s);
					}*/
					// TODO: pb with CSS FILES ? and IE8
					if (arg_ok_cb)
					{
						arg_ok_cb(datas);
					}
				},
			
			error : function(jqXHR, textStatus, errorThrown)
				{
					var context = 'Libapt.load_script.ajax_request.error(' + arg_script_url + ')';
					console.log(context);
					console.log(textStatus);
					console.log(errorThrown);
					
					if (arg_ko_cb)
					{
						arg_ko_cb(textStatus);
					}
				}
		}
	);
	
	// console.log('Libapt.load_script [' + arg_script_url + '] end');
}



// --------------------------------------------- MODULES LOADING ---------------------------------------------

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Registered modules associative array
 */
Libapt.modules = {};

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Loaded modules associative array
 */
Libapt.loaded_modules = {};

/**
 * @memberof	Libapt
 * @public
 * @static
 * @desc		Registered modules by class name associative array
 */
Libapt.modules_by_class = {};


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.register(arg_modules)
 * @desc				Register a module definition
 * @param {object}		arg_modules			module object to register
 * @return {nothing}
 */
Libapt.register = function(arg_modules)
{
	// console.log('Libapt.register modules');
	
	// CHECK MODULES ARRAY
	var modules_array = arg_modules;
	if ( Object.prototype.toString.apply(arg_modules) !== '[object Array]' )
	{
		modules_array = [ arg_modules ];
	}
	
	// LOOP ON MODULES
	for(module_index in modules_array)
	{
		var module = modules_array[module_index];
		
		// CHECK IF ALREADY REGISTERED
		if ( Libapt.modules[module.name] )
		{
			return;
		}
		
		// INIT MODULE
		module.state = 'not_loaded';
		Libapt.modules[module.name] = module;
		// console.log('Libapt.register module [' + module.name + ']');
		
		// LOOP ON CLASSES
		for(class_index in module.classes)
		{
			var class_name = module.classes[class_index];
			Libapt.modules_by_class[class_name] = module;
		}
		
		// REGISTER MODULE IN ITS PARENT
		if (module.parent)
		{
			var parent_module = Libapt.modules[module.parent];
			if (parent_module)
			{
				if ( Object.prototype.toString.apply(parent_module.childs) !== '[object Array]' )
				{
					parent_module.childs = [];
				}
				parent_module.childs.push(module);
			}
		}
		
		// REGISTER SUB MODULES
		var modules_file = module.modules_file;
		if (modules_file)
		{
			Libapt.load_script(modules_file);
		}
	}
}


console.info('Libapt: Loading dependencies');
Libapt.load_script(APT_LIB_URL + '/js/modules.js');


/**
 * @memberof			Libapt
 * @public
 * @static
 * @method				Libapt.use(arg_module_name, arg_force_reload, arg_reload_depth, arg_loaded_modules)
 * @desc				Use a registered module by the module name or the module class name
 * @param {string}		arg_module_name			module name or class name to use and load if needed
 * @param {boolean}		arg_force_reload		force module reloading
 * @param {boolean}		arg_reload_depth		depth of modules reloading in the depencies tree
 * @param {object}		arg_loaded_modules		associative array of current loaded modules
 * @return {nothing}
 */
Libapt.use = function(arg_module_name, arg_force_reload, arg_reload_depth, arg_loaded_modules)
{
	if (typeof arg_module_name != 'string')
	{
		console.log('ERROR : bad module name type');
		console.log( Libapt.get_prototype_name(arg_module_name.prototype) );
		return;
	}
	
	// console.log('Libapt.use module [' + arg_module_name + '] force[' + arg_force_reload + '] depth[' + arg_reload_depth + ']');
	
	function is_string(arg_value)
	{
		return typeof arg_value == 'string' || typeof arg_value == 'String';
	}
	
	// INIT RELOAD DEPTH
	if ( arg_force_reload && ! Libapt.is_numeric(arg_reload_depth) )
	{
		arg_reload_depth = 99;
	}
	
	// INIT RELOAD STACK
	if ( arg_force_reload && ! Libapt.is_object(arg_loaded_modules) )
	{
		arg_loaded_modules = {};
	}
	
	// MODULE ALREADY LOADED
	if ( Libapt.loaded_modules[arg_module_name] )
	{
		if ( ! (arg_force_reload && arg_reload_depth > 0) )
		{
			// console.log('Libapt.use module [' + arg_module_name + '] already loaded');
			return;
		}
	}
	if ( arg_force_reload && ! Libapt.is_null( arg_loaded_modules[arg_module_name] ) )
	{
		// console.log('Libapt.use module [' + arg_module_name + '] already loaded');
		return;
	}
	
	// GET MODULE BY NAME
	var module = Libapt.modules[arg_module_name];
	
	// CHECK MODULE
	if (! module)
	{
		// USE A CLASS
		module = Libapt.modules_by_class[arg_module_name];
		if (! module)
		{
			// console.log('ERROR Libapt.use module not found [' + arg_module_name + ']');
			return;
		}
		
		// MODULE ALREADY LOADED
		if ( module.state != 'not_loaded' && Libapt.loaded_modules[module.name] )
		{
			if ( ! (arg_force_reload && arg_reload_depth > 0) )
			{
				return;
			}
			if ( arg_force_reload && ! Libapt.is_null( arg_loaded_modules[arg_module_name] ) )
			{
				return;
			}
		}
	}
	
	// MODULE ALREADY LOADED
	if (module.state == 'loading')
	{
		return;
	}
	
	// REGISTER MODULE AS LOADED
	module.state = 'loading';
	Libapt.loaded_modules[arg_module_name] = module;
	if (arg_force_reload)
	{
		arg_loaded_modules[arg_module_name] = true;
	}
	
	// LOAD REQUIRED MODULES
	// console.log('module.requires:');
	// console.log(module.requires);
	if (module.requires && module.requires.length > 0)
	{
		for(var required_module_index = 0 ; required_module_index < module.requires.length ; required_module_index++)
		{
			var require_module_name = module.requires[required_module_index];
			
			// console.log('module.requires loop: at[' + required_module_index + '] for [' + require_module_name + ']');
			
			if ( is_string(require_module_name) )
			{
				if ( ! arg_force_reload || (arg_force_reload && Libapt.is_null( arg_loaded_modules[require_module_name] ) ) )
				{
					// console.log('require_module_name:' + require_module_name);
					
					Libapt.use(require_module_name, arg_force_reload, arg_reload_depth - 1, arg_loaded_modules);
				}
			}
		}
	}
	
	// LOAD MODULE CSS FILES
	var css_files = module.css_files;
	if (css_files)
	{
		// CHECK ARRAY
		if ( is_string(css_files) )
		{
			css_files = [ css_files ];
		}
		
		// LOOP ON MODULE CSS FILES
		for(css_file_index in css_files)
		{
			var url = css_files[css_file_index];
			$('head').append('<link>');
			var css = $('head').children(':last');
			css.attr(
				{
					rel:  "stylesheet",
					type: "text/css",
					href: url,
					media: 'all'
				}
			);
		}
	}
	
	// LOAD MODULE JS FILES
	var js_files = module.js_files;
	if (js_files)
	{
		// CHECK ARRAY
		if ( is_string(js_files) )
		{
			js_files = [ js_files ];
		}
		
		// LOOP ON MODULE CSS FILES
		for(js_file_index in js_files)
		{
			var url = js_files[js_file_index];
			Libapt.load_script(url);
		}
	}
	
	// LOAD MODULE MAIN SCRIPT
	var url = module.file;
	if (url)
	{
		Libapt.load_script(url);
	}
	
	// LOAD CHILDS MODULES
	if (module.childs)
	{
		for(child_index in module.childs)
		{
			var child_module = module.childs[child_index];
			if ( is_string(child_module.name) )
			{
				// console.log('module used:' + child_module.name);
				Libapt.use(child_module.name, arg_force_reload, arg_reload_depth - 1, arg_loaded_modules);
			}
		}
	}
	
	module.state = 'loaded';
	// console.log('module loaded:' + module.name);
}

Libapt.load_script(APT_LIB_URL + '/js/modules.js');

Libapt.use('addons-datatables-all');
Libapt.use('addons-dygraph-all');
Libapt.use('addons-flot-all');

console.info('Libapt: Update GUI translations');
Libapt.use('apps-i18n');
LibaptI18n.update_gui();
