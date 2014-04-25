/**
 * @file        libapt-models.js
 * @brief       JQuery plugin to use LIBAPT data access models
 * @details     Register a model definition and do actions :
 * 					create new records
 * 					read existing data with options (filters, orders, group by, slice)
 * 					update existing records
 * 					delete existing records
 * @see			libapt-models-model.js libapt-models-field.js libapt-main.js libapt-main-ajax.js
 * @ingroup     LIBAPT_APPS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

var LIBAPT_MODELS_TRACE = false;



/**
 * LIBAPT MAIN / MODELS / MODELS REPOSITORY
 * 
 */


 // DECLARE JQUERY LIBAPT-MAIN-MODELS PLUGIN
(function( $ )
{
	// PLUGIN CONFIGURATION
	var plugin_name = 'libapt.models';
	
	$.widget(
		plugin_name,
		{
			version: '0.9.1',
			options:
			{
				models_definitions: []
			},
			
			models_array: [],
			
			// MODEL REPOSITORY CONSTRUCTOR
			_create: function()
				{
					var context = 'libapt.models.create()';
					trace_enter(context, '', LIBAPT_MODELS_TRACE);
					
					if ( Libapt.is_array(this.options.models_definitions) )
					{
						this.options.models_definitions.forEach(
							function(model_def, index, array)
							{
								var model_obj = null;
								if (typeof model_def == 'object' && model_def instanceof LibaptModel)
								{
									trace_step(context, 'already a model object', LIBAPT_MODELS_TRACE);
									model_obj = model_def;
								}
								else if (typeof model_def == 'object' && ! (model_def instanceof LibaptModel) )
								{
									trace_step(context, 'create from settings', LIBAPT_MODELS_TRACE);
									model_obj = LibaptModel.create(model_def);
								}
								else
								{
									trace_error(context, 'model definition is not an object or a set of settings', LIBAPT_MODELS_TRACE);
									return null;
								}
								this.add(model_obj);
							}
						);
					}
					
					trace_leave(context, 'success', LIBAPT_MODELS_TRACE);
				},
			
			
			// MODEL REPOSITORY DESTRUCTOR
			_destroy : function()
			{
				this.models_array = null;
			},
			
			
			// APPEND AN EXISTING MODEL TO THE REPOSITORY
			add : function(arg_model)
			{
				var context = 'libapt.models.add(model)';
				trace_enter(context, '', LIBAPT_MODELS_TRACE);
				
				// CHECK MODEL
				if ( Libapt.is_null(arg_model) )
				{
					trace_error(context, 'model is null', LIBAPT_MODELS_TRACE);
					return this;
				}
				if ( ! (typeof arg_model == 'object' && arg_model instanceof LibaptModel) )
				{
					trace_error(context, 'model is not a LibaptModel child class', LIBAPT_VIEWS_TRACE);
					return this;
				}
				
				// APPEND MODEL TO THE REPOSITORY ARRAY
				this.models_array[arg_model.name] = arg_model;
				
				trace_leave(context, 'success', LIBAPT_MODELS_TRACE);
				return this;
			},
			
			
			// CREATE AND APPEND A MODEL TO THE REPOSITORY
			create_and_add : function(arg_settings)
			{
				var context = 'libapt.models.create_and_add(args)';
				trace_enter(context, '', LIBAPT_MODELS_TRACE);
				
				var model_obj = LibaptModel.create(arg_settings);
				this.add(model_obj);
				
				trace_leave(context, '', LIBAPT_MODELS_TRACE);
				return this;
			},
			
			get : function(arg_name)
			{
				var context = 'libapt.models.get';
				trace_enter(context, '', LIBAPT_MODELS_TRACE);
				
				var model = this.models_array[arg_name];
				if (! model)
				{
					// GET THE MODEL SETTINGS FROM THE SERVER AND CREATE THE MODEL
					var url = 'index.php?resourceAction=getModel' + arg_name;
					var use_cache = false;
					var is_async = false;
					var model_settings = null;
					var ok_cb = function(datas) { model_settings = datas; };
					var ko_cb = null;
					Libapt.load_script(url, is_async, use_cache, ok_cb, ko_cb, 'json');
					if ( ! Libapt.is_null(model_settings) )
					{
						this.create_and_add(model_settings);
					}
					else
					{
						trace_error(context, 'model settings not found', LIBAPT_MODELS_TRACE);
						return null;
					}
					
					// CHECK MODEL
					model = this.models_array[arg_name];
					if (! model)
					{
						trace_error(context, 'model not found', LIBAPT_MODELS_TRACE);
						return null;
					}
				}
				
				trace_leave(context, '', LIBAPT_MODELS_TRACE);
				return model;
			},
			
			lookup : function(arg_settings)
			{
				var context = 'libapt.models.lookup';
				trace_enter(context, '', LIBAPT_MODELS_TRACE);
				
				trace_leave(context, 'not yet implemented', LIBAPT_MODELS_TRACE);
			},
			
			remove : function(arg_settings)
			{
				var context = 'libapt.models.remove';
				trace_enter(context, '', LIBAPT_MODELS_TRACE);
				
				trace_leave(context, 'not yet implemented', LIBAPT_MODELS_TRACE);
			}
		}
	);
	
	$(document).models();
})( jQuery );



function LibaptModels()
{
}

LibaptModels.get = function (arg_model_name)
{
	return $(document).models('get', arg_model_name);
}

LibaptModels.add = function (arg_model_obj)
{
	$(document).models('add', arg_model_obj);
}

LibaptModels.remove = function (arg_model_obj)
{
	$(document).models('remove', arg_model_obj);
}

LibaptModels.create = function (arg_settings)
{
	return $(document).models('create_and_add', arg_settings);
}
