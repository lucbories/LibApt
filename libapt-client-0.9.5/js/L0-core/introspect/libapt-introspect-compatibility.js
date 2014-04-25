/**
 * @file        libapt-introspect-compatibility.js
 * @desc        Libapt static compatibility features
 * @ingroup     LIBAPT_CORE
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @method				Function.prototype.name
 * @desc				Get the prototype/class name for IE 9
 * @return {string}
 */
if (Function.prototype.name === undefined)
{
	if (Object.defineProperty !== undefined)
	{
		// IE8 : Object.defineProperty exists but only accept DOM object
		try
		{
			Object.defineProperty(Function.prototype, 'name',
				{
					get: function()
						{
							var funcNameRegex = /function\s+(.{1,})\s*\(/;
							var results = funcNameRegex.exec(this.toString());
							return (results && results.length > 1) ? results[1] : "";
						},
					set: function(value) {}
				}
			);
		}
		catch(e)
		{
			if (typeof console === "undefined" || typeof console.log === "undefined")
			{
				alert('ERROR Function.prototype.name is not defined !!!');
			}
			else
			{
				console.log('ERROR Function.prototype.name is not defined !!!');
			}
			// throw 'ERROR Function.prototype.name is not defined !!!';
		}
	}
}


/**
 * @public
 * @method				Array.forEach(fn, scope)
 * @desc				Register the forEach method if needed
 * @param {function}	fn
 * @param {object}		scope
 * @return {nothing}
 */
if (Array.prototype.forEach === undefined)
{
	Array.prototype.forEach = function(fun) // function(fun, scope)
		{
			var len = this.length;
			if (typeof fun != "function")
			{
				console.log(fun);
				throw new TypeError();
			}
			
			var scope = arguments[1];
			for (var i = 0; i < len; i++)
			{
				if (i in this)
				{
					fun.call(scope, this[i], i, this);
				}
			}
		};
/*	Array.prototype.forEach =
		function (fn, scope)
		{
			'use strict';
			var i, len;
			for (i = 0, len = this.length; i < len; ++i)
			{
				if (i in this)
				{
					fn.call(scope, this[i], i, this);
				}
			}
		};*/
}



/**
 * @public
 * @method				Object.keys(obj)
 * @desc				Register the keys method if needed
 * @param {object}		obj		Object value
 * @return {array}		Array of object attributes names
 */
if (typeof Object.keys == "undefined")
{
	Object.keys =
		function(obj)
		{
			var props=[];
			for(var p in obj)
			{
				if (obj.propertyIsEnumerable(p))
				{
					props.push(p);
				}
			}
			return props;
		};
}



/**
 * @public
 * @method				Object.values(obj)
 * @desc				Register the values method if needed
 * @param {object}		obj		Object value
 * @return {array}		Array of object attributes values
 */
if (typeof Object.values == "undefined")
{
	Object.values =
		function(obj)
		{
			var props=[];
			for(var p in obj)
			{
				if (obj.propertyIsEnumerable(p))
				{
					props.push(obj[p]);
				}
			}
			return props;
		};
}
