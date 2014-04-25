/**
 * @file        libapt-action-export-image.js
 * @desc        Image export action class (Requires HTML5)
 * @see			libapt-action.js libapt-object.js
 * @group       LIBAPT_VIEWS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @desc		Default options of the action
 */
LibaptActionExportImage.default_options = {
	'label'				: 'Image export',
	'icon_size'			: 24,
	
	'tooltip_label'		: 'Export the view datas in an image file',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 64,
	
	'is_enabled'		: true,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: null,
	'icon_name_24'		: null,
	'icon_name_32'		: null,
	'icon_name_48'		: null,
	'icon_name_64'		: null,
	'icon_name_96'		: null,
	'icon_name_128'		: null
}


/**
 * @public
 * @class					LibaptLibaptActionExportImage
 * @desc					Export to image file action class (requires HTML5)
 * @param {string}			arg_name			action name
 * @param {string}			arg_model_view		model view object
 * @param {object|null}		arg_options			associative array of name/value options
 */
function LibaptActionExportImage(arg_name, arg_model_view, arg_options)
{
	var options = Libapt.is_null(arg_options) ? LibaptActionExportImage.default_options :  $.extend(LibaptActionExportImage.default_options, arg_options);
	
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportImage';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	
	if (this.image_format != 'jpeg' && this.image_format != 'bmp' && this.image_format != 'png')
	{
		this.image_format = 'jpeg';
	}
	this.tooltip_label += ' (' + this.image_format + ')';
	
	// INIT ICONS
	switch(this.image_format)
	{
		case 'jpeg':
			this.icon_name_16 = 'files/jpg/jpg_file-16.png';
			this.icon_name_24 = 'files/jpg/jpg_file-24.png';
			this.icon_name_64 = 'files/jpg/jpg_file-64.png';
			this.icon_name_128 = 'files/jpg/jpg_file-128.png';
			break;
		case 'bmp':
			this.icon_name_16 = 'files/bmp/bmp_file-16.png';
			this.icon_name_24 = 'files/bmp/bmp_file-24.png';
			this.icon_name_64 = 'files/bmp/bmp_file-64.png';
			this.icon_name_128 = 'files/bmp/bmp_file-128.png';
			break;
		case 'png':
			this.icon_name_16 = 'files/png/png_file-16.png';
			this.icon_name_24 = 'files/png/png_file-24.png';
			this.icon_name_64 = 'files/png/png_file-64.png';
			this.icon_name_128 = 'files/png/png_file-128.png';
			break;
	}
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptActionExportImage
	 * @desc				Do the action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}	true:success,false:failure
	 */
	this.do_action = function(arg_operands)
	{
		var self = this;
		var context = 'do_action(operands)';
		this.enter(context, '');
		
		
		if ( ! this.is_enabled )
		{
			this.leave(context, 'action is disabled');
			return true;
		}
		
		
		
		var element = self.model_view.content_jqo.get(0);
		
		window.prettyPrint();
		event.preventDefault();
		html2canvas(
			element,
			{
				allowTaint: true,
				taintTest: false,
				onrendered: function(canvas)
					{
						// Canvas2Image.saveAsPNG(canvas);
						// document.body.appendChild(canvas);
						
						var url_str = null;
						var file_name = null;
						switch(self.image_format)
						{
							case 'jpeg':
								url_str = Canvas2Image.saveAsJPEG(canvas, false);
								file_name = 'export.jpg';
								break;
							case 'bmp':
								url_str = Canvas2Image.saveAsBMP(canvas, false);
								file_name = 'export.bmp';
								break;
							case 'png':
								url_str = Canvas2Image.saveAsPNG(canvas, false);
								file_name = 'export.png';
								break;
						}
						
						if (url_str && file_name)
						{
							var link = document.createElement('a');
							link.setAttribute('href', url_str);
							link.setAttribute('download', file_name);
							link.click();
						}
					}
			}
		);
		
		
		// FINAL CALLBACK
		if ( this.do_cb )
		{
			// TODO : assume callback result is not boolean
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptActionExportImage
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return '';
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptActionExportImage, ['LibaptAction'], 'Luc BORIES', '2013-08-21', 'Action to export datas to an image file.');


// INTROSPETION : REGISTER OPTIONS
