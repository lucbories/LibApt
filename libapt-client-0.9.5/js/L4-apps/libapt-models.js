/**
 * @file        libapt-models.js
 * @desc        Models repository
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



/**
 * @class		LibaptModels
 * @public
 * @static
 * @desc		Models repository static class
 * @return		nothing
 */
function LibaptModels()
{
}



/**
 * @memberof	LibaptModels
 * @public
 * @static
 * @desc		Trace flag
 */
LibaptModels.trace = false;



/**
 * @memberof	LibaptModels
 * @public
 * @static
 * @desc		Models repository
 */
LibaptModels.models_by_name = {};



/**
 * @memberof			LibaptModels
 * @public
 * @static
 * @method				LibaptModels.get(arg_model_name)
 * @desc				Get a model from the models repository
 * @param {string}		arg_model_name	The model name
 * @return {object}		A LibaptModel object
 */
LibaptModels.get = function (arg_model_name)
{
	var context = 'LibaptModels.get(model name)';
	Libapt.trace_enter(context, '', LibaptModels.trace);
	
	
	var model = LibaptModels.models_by_name[arg_model_name];
	if (! model)
	{
		// GET THE MODEL SETTINGS FROM THE SERVER AND CREATE THE MODEL
		var url			= 'index.php?resourceAction=getModel' + arg_model_name;
		var use_cache	= true;
		var is_async	= false;
		
		var model_settings = null;
		
		var ok_cb	= function(datas)
			{
				model_settings = datas;
			}
		var ko_cb	= null;
		Libapt.load_script(url, is_async, use_cache, ok_cb, ko_cb, 'json');
		if ( ! Libapt.is_null(model_settings) )
		{
			LibaptModels.create( model_settings);
		}
		else
		{
			Libapt.trace_error(context, 'model settings not found', LibaptModels.trace);
			return null;
		}
		
		// CHECK MODEL
		model = LibaptModels.models_by_name[arg_model_name];
		if (! model)
		{
			Libapt.trace_error(context, 'model not found', LibaptModels.trace);
			return null;
		}
	}
	
	
	Libapt.trace_leave(context, 'model found', LibaptModels.trace);
	return model;
}


/**
 * @memberof			LibaptModels
 * @public
 * @static
 * @method				LibaptModels.add(arg_model_obj)
 * @desc				Append a model to the models repository
 * @param {object}		arg_model_obj	The model object
 * @return				nothing
 */
LibaptModels.add = function (arg_model_obj)
{
	var context = 'LibaptModels.add(model)';
	Libapt.trace_enter(context, '', LibaptModels.trace);
	
	
	// CHECK MODEL
	if ( Libapt.is_null(arg_model_obj) )
	{
		Libapt.trace_error(context, 'model is null', LibaptModels.trace);
		return false;
	}
	if ( ! (typeof arg_model_obj == 'object' && arg_model_obj instanceof LibaptModel) )
	{
		Libapt.trace_error(context, 'model is not a LibaptModel child class', LibaptModels.trace);
		return this;
	}
	
	// APPEND MODEL TO THE REPOSITORY ARRAY
	LibaptModels.models_by_name[arg_model_obj.name] = arg_model_obj;
	
	
	Libapt.trace_leave(context, 'success', LibaptModels.trace);
	return true;
}


/**
 * @memberof				LibaptModels
 * @public
 * @static
 * @method					LibaptModels.remove(arg_model_obj)
 * @desc					Remove a model from the models repository
 * @param {string|object}	arg_model_obj	The model name or object
 * @return {boolean}		true:success,false:failure
 */
LibaptModels.remove = function (arg_model_obj)
{
	var context = 'LibaptModels.remove(model)';
	Libapt.trace_enter(context, '', LibaptModels.trace);
	
	
	var model_name = null;
	
	// IF A STRING IS GIVEN GET THE MODEL OBJECT
	if ( Libapt.is_string(arg_model_obj) )
	{
		model_name = arg_model_obj;
	}
	
	// CHECK THE MODEL OBJECT
	if ( Libapt.is_object(arg_model_obj) )
	{
		model_name = arg_model_obj.name;
	}
	
	// REMOVE FROM REPOSITORY
	LibaptModels.models_by_name[arg_model_obj.name] = undefined;
	
	
	Libapt.trace_leave(context, 'success', LibaptModels.trace);
	return true;
}



/**
 * @memberof			LibaptModels
 * @public
 * @static
 * @method				LibaptModels.create(arg_settings)
 * @desc				Create a model from given settings
 * @param {object}		arg_settings	The model settings
 * @return {object}		The created model object
 */
LibaptModels.create = function (arg_settings)
{
	var context = 'LibaptModels.create(settings)';
	Libapt.trace_enter(context, '', LibaptModels.trace);
	
	
	// CHECK ARGS
	if ( ! Libapt.is_array(arg_settings) && Libapt.is_object(arg_settings) )
	{
		arg_settings = [arg_settings];
	}
	if ( ! Libapt.is_array(arg_settings) )
	{
		Libapt.trace_error(context, 'models settings array is not an array', LibaptModels.trace);
		return null;
	}
	
	// LOOP ON SETTINGS ARRAY
	for(settings_index in arg_settings)
	{
		var loop_settings = arg_settings[settings_index];
		
		var model_obj = null;
		if (typeof loop_settings == 'object' && loop_settings instanceof LibaptModel)
		{
			Libapt.trace_step(context, 'already a model object', LibaptModels.trace);
			model_obj = loop_settings;
		}
		else if (typeof loop_settings == 'object' && ! (loop_settings instanceof LibaptModel) )
		{
			Libapt.trace_step(context, 'create from settings', LibaptModels.trace);
			model_obj = LibaptModel.create(loop_settings);
		}
		else
		{
			Libapt.trace_error(context, 'model definition is not an object or a set of settings', LibaptModels.trace);
			return null;
		}
		LibaptModels.add(model_obj);
	}
	
	
	Libapt.trace_leave(context, 'success', LibaptModels.trace);
	return model_obj;
}
