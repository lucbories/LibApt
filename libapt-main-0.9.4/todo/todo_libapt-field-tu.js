/**
 * @file        libapt-models-field-tu.js
 * @brief       Field class Test Unit
 * @details     
 * @see			libapt-models-field.js libapt-main.js libapt-main-ajax.js
 * @ingroup     LIBAPT_MODELS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Model field class Test Unit
 * @return		boolean				true:success,false:failure
 */
function libapt_field_proto_tu()
{
	var context = 'libapt_field_proto_tu()';
	trace_enter(context, '', APT_MODELS_FIELD_TRACE);
	
	// TEST 1
	var field1_settings =
		{
			'name'			: 'field1',
			'model_name'	: 'model1',
			'source'		: 'json',
			'value_type'	: 'string',
			'value_default'	: 'vide',
			'value_format'	: 'format1',
			'label'			: 'Field 1',
			'is_visible'	: true,
			'is_editable'	: true,
			'is_pk'			: true,
			'foreign_model'	: '',
			'foreign_field'	: ''
		};
	field1 = LibaptField.create_from_settings(field1_settings);
	alert(field1.toString());
	console.log( field1.toString( ));
	
	// TEST 2
	var field1 = new LibaptField('field1', 'model1', 'json', 'string', 'vide', 'format1', 'Field 1');
	alert(field1.toString());
	
	trace_leave(context, '', APT_MODELS_FIELD_TRACE);
	return true;
}
