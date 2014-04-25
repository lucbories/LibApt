/**
 * @file        libapt-action-export-image.js
 * @brief       Image export action class
 * @details     Requires HTML5
 * @see			libapt-action.js libapt-object.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

 
 // (function(){function t(t,n,r){var i=getComputedStyle(n);if(e)t.style.cssText=i.cssText;else for(var s in i)isNaN(parseInt(s,10))&&typeof i[s]!="function"&&!/^(cssText|length|parentRule)$/.test(s)&&(t.style[s]=i[s])}function n(e,n){var r=e.querySelectorAll("*"),i=n.querySelectorAll("*");t(e,n,1),Array.prototype.forEach.call(r,function(e,n){t(e,i[n])}),e.style.margin=e.style.marginLeft=e.style.marginTop=e.style.marginBottom=e.style.marginRight=""}var e=getComputedStyle(document.body).cssText!=="";window.domvas={toImage:function(e,t,r,i,s,o){s=s||0,o=o||0;var u=e.cloneNode(!0);n(u,e),u.setAttribute("xmlns","http://www.w3.org/1999/xhtml");var a=(new XMLSerializer).serializeToString(u),f="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='"+((r||e.offsetWidth)+s)+"' height='"+((i||e.offsetHeight)+o)+"'>"+"<foreignObject width='100%' height='100%' x='"+s+"' y='"+o+"'>"+a+"</foreignObject>"+"</svg>",l=new Image;l.src=f,l.onload=function(){t&&t.call(this,this)}}}})()


/**
 * @brief		Default options of the action
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
 * @brief		Action class
 * @param[in]	arg_name			action name (string)
 * @param[in]	arg_model_view		model view object (object)
 * @param[in]	arg_options			associative array of name/value options (object or null)
 */
function LibaptActionExportImage(arg_name, arg_model_view, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptAction;
	this.inheritFrom(arg_name, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptActionExportImage';
	var context			= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	this.model_view		= arg_model_view;
	if ( Libapt.is_null(arg_options) )
	{
		$.extend(this, LibaptActionExportImage.default_options);
	}
	else
	{
		$.extend(this, LibaptActionExportImage.default_options, arg_options);
	}
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
	 * @brief		Do the action
	 * @param[in]	arg_operands	array of action operands (array)
	 * @return		boolean
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
		
		if ( ! this.model_view.table_head_jqo )
		{
			this.leave(context, 'the model view is not a table view');
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
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		
		this.leave(context, '');
		return true;
	}
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return '';
	}
}

Libapt.register_inheritance(LibaptActionExportImage, LibaptAction);


