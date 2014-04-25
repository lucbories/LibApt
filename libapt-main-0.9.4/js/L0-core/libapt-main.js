/**
 * @file        libapt-main.js
 * @desc        Common functions : traces, types...
 * @ingroup     L0_CORE
 * @date        2012-12-02
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


function get_arg(arg_value, arg_default)
{
	return (typeof arg_value == 'undefined' ? arg_default : arg_value);
}

function get_arg_not_null(arg_value, arg_default)
{
	return Libapt.is_null(arg_value) ? arg_default : arg_value;
}

function get_arg_not_empty_str(arg_value, arg_default)
{
	return (typeof arg_value == 'undefined' || arg_value == '') ? arg_default : arg_value;
}

function libapt_language_change(arg_language)
{
	var url = window.location.href;
	url = url.replace('#', '');
	
	var language_str = 'application_html_language=' + arg_language;
	var regexp = /&application_html_language=../gi;
	url = url.replace(regexp, '');
	
	var new_url = url;
	// console.log(new_url);
	if (url.indexOf('application_html_language') < 0)
	{
		new_url += ( url.indexOf('?')>0 ? '&' : '?') + language_str;
	}
	
	// console.log(new_url);
	window.location.assign(new_url);
}




// TRACES
function trace_enter(arg_context, arg_msg, arg_trace_enabled)
{
	var trace_enabled = arg_trace_enabled;
	var msg = arg_msg;
	if ( Libapt.is_boolean(arg_msg) && ! Libapt.is_boolean(arg_trace_enabled) )
	{
		trace_enabled = arg_msg;
		msg = '';
	}
	
	if (trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'ENTER', context:arg_context, text:arg_msg } );
	}
	Libapt.log_indent();
}

function trace_separator(arg_trace_enabled)
{
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'', context:'', text:'*****************************************************************' } );
	}
}

function trace_step(arg_context, arg_step, arg_trace_enabled)
{
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'STEP', context:arg_context, text:arg_step } );
	}
}

function trace_leave(arg_context, arg_msg, arg_trace_enabled)
{
	Libapt.log_unindent();
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'LEAVE', context:arg_context, text:arg_msg } );
	}
}

function trace_error(arg_context, arg_msg, arg_trace_enabled)
{
	Libapt.error( { context:arg_context, text:arg_msg } );
	Libapt.log_unindent();
}

function trace_var(arg_context, label, arg_value, arg_trace_enabled)
{
	if (arg_trace_enabled)
	{
		Libapt.log( { level:'DEBUG', step:'VALUE', context:arg_context, text:label + '=[' + Libapt.get_value_str(arg_value) + ']' } );
	}
}

// function trace_array(arg_context, arg_label, arg_array_value, arg_trace_enabled)
// {
	// if (arg_trace_enabled)
	// {
		// console.log(LIBAPT_TRACE_INDENT_STR + arg_context + ":");
		// console.log(LIBAPT_TRACE_INDENT_STR + "VAR : " + arg_label + " is array : [");
		// for(var key in arg_array_value)
		// {
			// console.log(LIBAPT_TRACE_INDENT_STR + "  " + key + ":" + arg_array_value[key]);
		// }
		// console.log(LIBAPT_TRACE_INDENT_STR + "]");
	// }
// }


// @TODO LIBAPT-MAIN.JS:268 JS 'TABS'
$(function() {
	var tabs = $(".libapt_tabs").tabs( {collapsible:true} ).css('display', 'block');
	
	tabs.find(".ui-tabs-nav").sortable(
		{
			axis: "x",
			stop: function()
				{
					tabs.tabs( "refresh" );
				}
		}
	);
	
	$(".libapt_tabs ul.ui-tabs-nav li a").addClass('libapt_tabs_dense');
	$(".libapt_tabs ul.ui-tabs-nav li a").css('padding', '0.1em');
});



// HTML HELPERS
// function html_optional_attribute(arg_attribute, arg_value)
// {
	// return Libapt.is_empty_str_or_null(arg_value) ? '' : ' ' + arg_attribute + '="' + arg_value + '"';
// }

// function html_required_attribute(arg_attribute, arg_value)
// {
	// if ( Libapt.is_empty_str_or_null(arg_value) )
	// {
		// trace_error('html_required_attribute', 'value is null or empty for attribute[' + arg_attribute, true);
		// return '';
	// }
	
	// return ' ' + arg_attribute + '="' + arg_value + '"';
// }

// function html_default_atribute(arg_attribute, arg_value, arg_default_value)
// {
	// return ' ' + arg_attribute + '=' + ( Libapt.is_empty_str_or_null(arg_value) ? arg_default_value : '"' + arg_value + '"' );
// }


// MESSAGES BOX
function msgbox_success(arg_msg)
{
	var box = $('#apt_msg_box_success');
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.remove();
	box.append('<p>' + arg_msg + '</p>');
	box.append('<a href="" class="close">&times;</a>');
}

function msgbox_info(arg_msg)
{
	var box = $('#apt_msg_box');
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.remove();
	box.append('<p>' + arg_msg + '</p>');
	box.append('<a href="" class="close">&times;</a>');
}

function msgbox_alert(arg_msg)
{
	var box = $('#apt_msg_box_alert');
	box.css('visibility', 'visible');
	box.css('display', 'block');
	box.remove();
	box.append('<p>' + arg_msg + '</p>');
	box.append('<a href="" class="close">&times;</a>');
}


// JQUERY-UI HELPERS
// function updateTips(tips, msg)
// {
	// tips
		// .text(msg)
		// .addClass( "ui-state-highlight" );
	// setTimeout(
		// function()
		// {
			// tips.removeClass( "ui-state-highlight", 1500 );
		// },
		// 500
	// );
// }

/*
 * @brief		Replace a string by an other string
 * @param[in]	arg_format_str		string with a tag to replace
 * @param[in]	arg_tag				string to search and replace
 * @param[in]	arg_replace_str		string to take in place of arg_tag
 * @return		string				result string (a string to replace is found) or arg_format_str (nothing to replace)
 */
// function libapt_main_str_replace(arg_format_str, arg_tag, arg_replace_str)
// {
	// if ( Libapt.is_empty_str_or_null(arg_format_str) || Libapt.is_empty_str_or_null(arg_tag) )
	// {
		// return null;
	// }
	// if ( Libapt.is_empty_str_or_null(arg_replace_str) )
	// {
		// arg_replace_str = "";
	// }
	
	// if ( Libapt.is_null(arg_format_str) )
	// {
		// return null;
	// }
	
	// pos_size = arg_format_str.indexOf(arg_tag);
	// if (pos_size >= 0)
	// {
		// var result = arg_format_str.substr(0, pos_size);
		// result += arg_replace_str;
		// result += arg_format_str.substr(pos_size + arg_tag.length, arg_format_str.length - arg_tag.length - pos_size);
		// return result;
	// }
	
	// return arg_format_str;
// }


// function checkLength( o, n, min, max )
// {
	// if ( o.val().length > max || o.val().length < min )
	// {
		// o.addClass( "ui-state-error" );
		// updateTips( "Length of " + n + " must be between " +
			// min + " and " + max + "." );
		// return false;
	// }
	
	// return true;
// }

// function checkRegexp( o, regexp, n )
// {
	// if ( !( regexp.test( o.val() ) ) )
	// {
		// o.addClass( "ui-state-error" );
		// updateTips( n );
		// return false;
	// }	
	
	// return true;
// }	

function libapt_portlet_init()
{
	$( '.libapt_portlet_container' ).sortable(
		{
			connectWith: '.libapt_portlet_container'
		}
	);
	
	$( '.portlet' ).addClass( 'ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' )
		.find( '.portlet-header' )
			.addClass( 'ui-widget-header ui-corner-all' )
			.prepend( '<span class=\"ui-icon ui-icon-minusthick\"></span>')
			.end()
		.find( '.portlet-content' );
	
	$( '.portlet-header .ui-icon' ).click(
		function()
		{
			$( this ).toggleClass( 'ui-icon-minusthick' ).toggleClass( 'ui-icon-plusthick' );
			$( this ).parents( '.portlet:first' ).find( '.portlet-content' ).toggle();
		}
	);

	$( '.libapt_portlet_container' ).disableSelection();
	
	// TODO ADJUST CONTENT SIZE TO CONTAINER
	// $( '.libapt_portlet_container div.portlet div.portlet-content' ).each(
		// function(index, content)
		// {
			// var parents_width = $(content).parents('.libapt_portlet_container:first').css('width');
			// console.log('parents.width:' + parents_width);
			// console.log('this.width.before:' + $(content).css('max-width') );
			// $(content).css('max-width', parents_width - 20);
			// console.log('this.width.width:' + $(content).css('max-width') );
		// }
	// );
}


