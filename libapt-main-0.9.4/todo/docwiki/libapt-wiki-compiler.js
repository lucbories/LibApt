/**
 * @file        libapt-wiki-compiler.js
 * @brief       Wiki compiler class
 * @details     see http://markup.skriv.org/language/intro
 * @see			libapt-object.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

var re2 = /''/g;
var re=/\v([^\v]+)\v/g;
str = " hello ''ma chaine en'italic'' est ''super''! "
str.replace(re2,"\v").replace(re,"{{i $1 }}");
" hello {{i ma chaine en'italic }} est {{i super }}! "

/**
 * @class		LibaptWikiCompiler
 * @brief		Wiki compiler class
 * @param[in]	arg_name			name of the object
 */
function LibaptWikiCompiler(arg_name)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptWikiCompiler';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// CLASS INSTANCE ATTRIBUTES
	var re_strip_blanks = /^(\s+)(\S+)(\s+)/gi;
	var re_basic_styles_quotes = /''/g;
	var re_basic_styles_italics = /''([^['']]+)''/gi
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	this.compile = function(arg_wiki_markup_str)
	{
		var context = 'compile';
		this.enter(context, '');
		this.value(context, 'max', arg_max);
		
		
		this.leave(context, '');
		return null;
	}
	
	
	
	this.compile_basic_styles(arg_str)
	{
		
	}
	
	this.get_clean_str(arg_str)
	{
		return arg_str.replace(this.re_strip_blanks, "$2");
	}
}
