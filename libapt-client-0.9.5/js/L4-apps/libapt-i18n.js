/**
 * @file        libapt-i18n.js
 * @desc        LIBAPT translations features
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-09-08
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @class		LibaptI18n
 * @public
 * @static
 * @desc		Translations repository static class
 * @return		nothing
 */
function LibaptI18n()
{
}



/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Trace flag
 */
LibaptI18n.trace = false;


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Default locale
 */
LibaptI18n.default_locale = 'en_EN'; //fr_FR, en_EN, de_DE, sp_SP...


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Current locale
 */
LibaptI18n.current_locale = 'en_EN';


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Missing locales: array of string
 */
LibaptI18n.missing_locales = [];


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Missing translations: array of records
 */
LibaptI18n.missing_translations = [];


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Translations model name
 */
LibaptI18n.model_name = APT_LIB_TR_MODEL;


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Current locale repository
 */
LibaptI18n.current_repository = null;


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Translations repository : array of translation records
 *				with a translation record:
 *						{
 *							locale: ...
 *							application: ...
 *							context: ...
 *							sentence: ...
 *							translation: ...
 *						}
 */
LibaptI18n.translations_records = [];


/**
 * @memberof	LibaptI18n
 * @public
 * @static
 * @desc		Translations repository for locale/application/context/sentence lookup
 * 				translations_by_keys[locale1] =
 *					{
 *						'*'/'*'/sentence1: translated
 *						application1/'*'/sentence1: translated
 *						application1/context1/sentence1: translated
 *						application1/context2/sentence1: translated
 *						application2/context1/sentence1: translated
 *						application2/context2/sentence1: translated
 *						application3/context1/sentence1: translated
 *					}
 */
LibaptI18n.translations_by_keys = {};


/**
 * @memberof			LibaptI18n
 * @public
 * @static
 * @method				LibaptI18n.register_records(records)
 * @desc				Register translations records
 * @param {array}		arg_translations_records	Translations records (locale, application, context, sentence, tr)
 * @return {boolean}	true:success,false:failure
 */
LibaptI18n.register_records = function(arg_translations_records)
{
	var context = 'LibaptI18n.register_records(records)';
	Libapt.trace_enter(context, '', LibaptI18n.trace);
	
	
	// LOOP ON TRANSLATION RECORDS
	for(var records_index = 0 ; records_index < arg_translations_records.length ; records_index++)
	{
		var loop_record = arg_translations_records[records_index];
		
		// GET RECORD ATTRIBUTES
		var loop_locale			= loop_record['locale'];
		var loop_application	= loop_record['application'];
		var loop_context		= loop_record['context'];
		var loop_sentence		= loop_record['sentence'];
		var loop_translation	= loop_record['translation'];
		
		// CHECK RECORD
		if ( Libapt.is_empty_str_or_null(loop_locale) || Libapt.is_empty_str_or_null(loop_sentence) || Libapt.is_empty_str_or_null(loop_translation) )
		{
			Libapt.trace_var(context, 'loop_locale', loop_locale, LibaptI18n.trace);
			Libapt.trace_var(context, 'loop_sentence', loop_sentence, LibaptI18n.trace);
			Libapt.trace_var(context, 'loop_translation', loop_translation, LibaptI18n.trace);
			Libapt.trace_leave(context, 'failure: locale or sentence or tr is null', LibaptI18n.trace);
			return false;
		}
		
		// SET DEFAULT VALUES
		if ( Libapt.is_empty_str_or_null(loop_application) )
		{
			loop_application = '*';
		}
		if ( Libapt.is_empty_str_or_null(loop_context) )
		{
			loop_context = '*';
		}
		
		// REGISTER TRANSLATION RECORD
		LibaptI18n.translations_records.push(loop_record);
		
		// GET LOCALE REPOSITORY
		var locale_repository = LibaptI18n.translations_by_keys[loop_locale];
		if ( ! Libapt.is_object(locale_repository) )
		{
			Libapt.trace_step(context, 'Create empty repository', LibaptI18n.trace);
			LibaptI18n.translations_by_keys[loop_locale] = {};
			locale_repository = LibaptI18n.translations_by_keys[loop_locale];
		}
		
		// REGISTER TRANSLATION VALUE BY KEY
		var loop_key = loop_application + '/' + loop_context + '/' + loop_sentence;
		locale_repository[loop_key] = loop_translation;
		Libapt.trace_var(context, 'tr[' + loop_key + ']', loop_translation, LibaptI18n.trace);
	}
	
	
	Libapt.trace_leave(context, 'success', LibaptI18n.trace);
	return true;
}


/**
 * @memberof			LibaptI18n
 * @public
 * @static
 * @method				LibaptI18n.switch_locale(arg_locale)
 * @desc				Switch the current locale to the given one
 * @param {object}		arg_locale		The target locale name
 * @param {boolean}		arg_update_gui	Should update the GUI sentences
 * @return {boolean}	true:success,false:failure
 */
LibaptI18n.switch_locale = function(arg_locale, arg_update_gui)
{
	var context = 'LibaptI18n.switch_locale(locale,gui)';
	Libapt.trace_enter(context, '', LibaptI18n.trace);
	
	
	// CHECK GIVEN LOCALE
	if ( Libapt.is_empty_str_or_null(arg_locale) )
	{
		arg_locale = LibaptI18n.default_locale;
	}
	if (arg_locale == LibaptI18n.current_locale)
	{
		Libapt.trace_leave(context, 'given locale is already the current locale', LibaptI18n.trace);
		return true;
	}
	
	// GET LOCALE REPOSITORY
	LibaptI18n.current_repository = LibaptI18n.get_repository(arg_locale);
	
	// CHECK REPOSITORY
	if ( ! Libapt.is_object(LibaptI18n.current_repository) || LibaptI18n.current_repository.length == 0)
	{
		Libapt.trace_leave(context, 'locale repository not found', LibaptI18n.trace);
		return false;
	}
	
	// SET CURRENT LOCALE
	LibaptI18n.current_locale = arg_locale;
	
	// UPDATE
	if (arg_update_gui)
	{
		var result = LibaptI18n.update_gui();
		if (! result)
		{
			Libapt.trace_leave(context, 'update GUI sentences failure', LibaptI18n.trace);
			return false;
		}
	}
	
	Libapt.trace_leave(context, 'success', LibaptI18n.trace);
	return true;
}



/**
 * @memberof				LibaptI18n
 * @public
 * @static
 * @method					LibaptI18n.tr(arg_sentence, arg_context, arg_application)
 * @desc					Translate the given sentence
 * @param {string}			arg_sentence		The sentence to translate
 * @param {string}			arg_context			The translation context
 * @param {string}			arg_application		The application context
 * @return {string}			Translated text
 */
LibaptI18n.tr = function(arg_sentence, arg_context, arg_application, arg_locale)
{
	var context = 'LibaptI18n.tr(sentence,context,app)';
	Libapt.trace_enter(context, '', LibaptI18n.trace);
	
	
	// SET DEFAULT VALUES
	if ( Libapt.is_empty_str_or_null(arg_context) )
	{
		arg_context = '*';
	}
	if ( Libapt.is_empty_str_or_null(arg_application) )
	{
		arg_application = '*';
	}
	if ( Libapt.is_empty_str_or_null(arg_locale) )
	{
		arg_locale = LibaptI18n.current_locale;
	}
	
	
	// GET REPOSITORY
	var repository = LibaptI18n.current_repository;
	if (arg_locale != LibaptI18n.current_locale)
	{
		repository = LibaptI18n.get_repository(arg_locale);
	}
	
	// CHECK REPOSITORY
	if ( ! Libapt.is_object(repository) || repository.length == 0)
	{
		// MISSING REPOSITORY
		if ( Libapt.is_null(LibaptI18n.missing_locales[arg_locale]) )
		{
			LibaptI18n.missing_locales[arg_locale] = 0;
		}
		else
		{
			LibaptI18n.missing_locales[arg_locale] += 1;
		}
		
		// RETURN SOURCE SENTENCE
		Libapt.trace_leave(context, 'locale not found', LibaptI18n.trace);
		return arg_sentence;
	}
	
	
	// GET TRANSLATION
	var key = arg_application + '/' + arg_context + '/' + arg_sentence;
	var tr = repository[key];
	if ( Libapt.is_null(tr) )
	{
		var record = { 'locale':arg_locale, 'application':arg_application, 'context':arg_context, 'sentence':arg_sentence };
		LibaptI18n.missing_translations.push(record);
		
		// RETURN SOURCE SENTENCE
		Libapt.trace_leave(context, 'translation not found', LibaptI18n.trace);
		return arg_sentence;
	}
	
	Libapt.trace_leave(context, 'success', LibaptI18n.trace);
	return tr;
}


/**
 * @memberof			LibaptI18n
 * @public
 * @static
 * @method				LibaptI18n.LibaptI18n.load_repository(arg_locale)
 * @desc				Switch the current locale to the given one
 * @param {object}		arg_locale		The target locale name
 * @return {boolean}	true:success,false:failure
 */
LibaptI18n.load_repository = function(arg_locale)
{
	var context = 'LibaptI18n.load_repository(locale)';
	Libapt.trace_enter(context, '', LibaptI18n.trace);
	
	
	// CHECK LOCALE
	if ( Libapt.is_empty_str_or_null(arg_locale) )
	{
		Libapt.trace_leave(context, 'locale is not a valid string', LibaptI18n.trace);
		return false;
	}
	
	// CHECK MODEL NAME
	if ( Libapt.is_empty_str_or_null(LibaptI18n.model_name) )
	{
		// SET AN EMPTY REPOSITORY
		LibaptI18n.translations_by_keys[arg_locale] = {};
		LibaptI18n.current_repository = LibaptI18n.translations_by_keys[arg_locale];
		
		Libapt.trace_leave(context, 'no available model name', LibaptI18n.trace);
		return false;
	}
	
	// CHECK MODEL
	var model = LibaptModels.get(LibaptI18n.model_name);
	if ( ! Libapt.is_object(model) )
	{
		// SET AN EMPTY REPOSITORY
		LibaptI18n.translations_by_keys[arg_locale] = {};
		LibaptI18n.current_repository = LibaptI18n.translations_by_keys[arg_locale];
		
		Libapt.trace_leave(context, 'no available model object', LibaptI18n.trace);
		return false;
	}
	
	// READ MODEL
	var fields_values = {};
	fields_values['locale'] = arg_locale;
	var records = model.read_records_with_values_sync(fields_values, null, null);
	if ( ! Libapt.is_array(records) )
	{
		// SET AN EMPTY REPOSITORY
		LibaptI18n.translations_by_keys[arg_locale] = {};
		LibaptI18n.current_repository = LibaptI18n.translations_by_keys[arg_locale];
		
		Libapt.trace_leave(context, 'no available model datas', LibaptI18n.trace);
		return false;
	}
	
	// UPDATE REPOSITORY
	if ( ! LibaptI18n.register_records(records) )
	{
		// SET AN EMPTY REPOSITORY
		LibaptI18n.translations_by_keys[arg_locale] = {};
		LibaptI18n.current_repository = LibaptI18n.translations_by_keys[arg_locale];
		
		Libapt.trace_leave(context, 'failure', LibaptI18n.trace);
		return false;
	}
	
	
	Libapt.trace_leave(context, 'success', LibaptI18n.trace);
	return true;
}


/**
 * @memberof			LibaptI18n
 * @public
 * @static
 * @method				LibaptI18n.get_repository(arg_locale)
 * @desc				Get the repository for the given locale
 * @param {object}		arg_locale		The target locale name
 * @return {boolean}	true:success,false:failure
 */
LibaptI18n.get_repository = function(arg_locale)
{
	var context = 'LibaptI18n.get_repository(locale)';
	Libapt.trace_enter(context, '', LibaptI18n.trace);
	
	
	// GET REPOSITORY
	var repository = LibaptI18n.translations_by_keys[arg_locale];
	if ( ! Libapt.is_object(repository) )
	{
		if ( ! LibaptI18n.load_repository(arg_locale) )
		{
			Libapt.trace_leave(context, 'failure', LibaptI18n.trace);
			return false;
		}
		repository = LibaptI18n.translations_by_keys[arg_locale];
	}
	
	
	Libapt.trace_leave(context, 'success', LibaptI18n.trace);
	return repository;
}



/**
 * @memberof			LibaptI18n
 * @public
 * @static
 * @method				LibaptI18n.update_gui()
 * @desc				Get the repository for the current locale
 * @return {boolean}	true:success,false:failure
 */
LibaptI18n.update_gui = function()
{
	var context = 'LibaptI18n.update_gui()';
	Libapt.trace_enter(context, '', LibaptI18n.trace);
	
	
	// GET ALL I18N TAGS
	var i18n_tags_jqo = $('.libapt_i18n', document.body);
	i18n_tags_jqo.each(
		function(index,item,all_items)
		{
			var tag = item.tagName;
			if ( Libapt.is_string(tag) )
			{
				switch(tag.toLocaleLowerCase())
				{
					case 'label':
					case 'td':
					case 'th':
					case 'a':
					case 'p':
					case 'li':
					case 'button':
					case 'span':
						var item_jqo	= $(item);
						var sentence	= item_jqo.text();
						var tr_context	= item_jqo.attr('libapt_i18n_context');
						var application	= item_jqo.attr('libapt_i18n_application');
						var locale		= LibaptI18n.current_locale;
						var tr			= LibaptI18n.tr(sentence, tr_context ? tr_context : '*', application ? application : '*', locale);
						if (tr)
						{
							item_jqo.text(tr);
						}
						break;
					case 'button':
						var item_jqo	= $(item);
						var sentence	= item_jqo.val();
						var tr_context	= item_jqo.attr('libapt_i18n_context');
						var application	= item_jqo.attr('libapt_i18n_application');
						var locale		= LibaptI18n.current_locale;
						var tr			= LibaptI18n.tr(sentence, tr_context ? tr_context : '*', application ? application : '*', locale);
						if (tr)
						{
							item_jqo.val(tr);
						}
						break;
					default:
						console.log(context + ' invalid tag :' + tag.toLocaleLowerCase());
						break;
				}
			}
		}
	);
	
	
	Libapt.trace_leave(context, 'success', LibaptI18n.trace);
	return true;
}
