/**
 * @file        libapt-mixin-assertion.js
 * @desc        Mixin of methods for assertion
 * @see			LibaptObject
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-13
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinAssertion
 * @public
 * @desc				Mixin of methods for assertion
 */
var LibaptMixinAssertion =
{
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @desc				Enable or disable the assertions trace
	 */
	trace_assert: false,
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assert(arg_context, arg_name, arg_value, arg_label)
	 * @desc				Assert that value is true (assert failed if value is false)
	 * @param {string}		arg_context			assertion context
	 * @param {boolean}		arg_test			assertion test
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_label			assertion label : kind of check
	 * @param {string}		arg_value			assertion value
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assert: function(arg_context, arg_name, arg_test, arg_label, arg_value)
	{
		if ( ! arg_test )
		{
			var msg = this.class_name + ':' + (arg_label ? arg_label : 'Assert True') + ' failed for name=[' + arg_name + '] value=[' + arg_value + ']';
			this.error(arg_context, msg, this.trace_assert);
			throw(arg_context + ':' + msg);
		}
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertTrue(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is true
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertTrue: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, Libapt.is_boolean(arg_value) && arg_value, 'Assert True', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertFalse(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is false
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertFalse: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, Libapt.is_boolean(arg_value) && (! arg_value), 'Assert False', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertNull(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is null
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertNull: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, Libapt.is_null(arg_value), 'Assert Null', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertNotNull(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is not null
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertNotNull: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, ! Libapt.is_null(arg_value), 'Assert NotNull', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertInherit(arg_context, arg_name, arg_value, arg_class_obj)
	 * @desc				Assert that value inherits of a given class
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertInherit: function(arg_context, arg_name, arg_value, arg_class_obj)
	{
		var bool_result = arg_value instanceof arg_class_obj || Libapt.test_inheritance(arg_value, arg_class_obj);
		this.assert(arg_context, arg_name, bool_result, 'Assert Inherit', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertTypeof(arg_context, arg_name, arg_value, arg_type_name)
	 * @desc				Assert that value is of a given type
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @param {string}		arg_type_name		type name
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertTypeof: function(arg_context, arg_name, arg_value, arg_type_name)
	{
		this.assert(arg_context, arg_name, typeof arg_value == arg_type_name, 'Assert Typeof', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertArray(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is an array
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertArray: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, Libapt.is_array(arg_value), 'Assert Array', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertArraySize(arg_context, arg_name, arg_value, arg_size_min, arg_size_max)
	 * @desc				Assert that value is an array and the array size is greater or equal to the given min size and lesser or equal to the given max size
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @param {integer}		arg_size_min		assertion array minimal size
	 * @param {integer}		arg_size_max		assertion array maximal size
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertArraySize: function(arg_context, arg_name, arg_value, arg_size_min, arg_size_max)
	{
		this.assert(arg_context, arg_name, Libapt.is_array(arg_value) && arg_value.length >= arg_size_min && (Libapt.is_null(arg_size_max) ? true : (arg_value.length <= arg_size_max) ), 'Assert assertArraySize', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertNotEmptyArray(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is an array ans it is not empty
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertNotEmptyArray: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, Libapt.is_array(arg_value) && arg_value.length > 0, 'Assert NotEmptyArray', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertNotEmptyObjectOrArray(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is an array or an object and the array or object is not empty
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertNotEmptyObjectOrArray: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, (Libapt.is_array(arg_value) && arg_value.length > 0) || Libapt.is_object(arg_value), 'Assert NotEmptyArrayOrObject', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertNotEmptyString(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is a string and the string is not empty
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertNotEmptyString: function(arg_context, arg_name, arg_value)
	{
		if ( ! Libapt.is_not_empty_str(arg_value), 'Assert NotEmptyString', arg_value);
	},
	
	
	/**
	 * @memberof			LibaptMixinAssertion
	 * @public
	 * @method				assertNotEmptyValue(arg_context, arg_name, arg_value)
	 * @desc				Assert that value is not null and the value is not an empty string
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_name			assertion value name
	 * @param {string}		arg_value			assertion value to test
	 * @return {nothing}	(throw exception if assertion failed)
	 */
	assertNotEmptyValue: function(arg_context, arg_name, arg_value)
	{
		this.assert(arg_context, arg_name, ! Libapt.is_null(arg_value) && arg_value != '', 'Assert NotEmptyValue', arg_value);
	}
};
