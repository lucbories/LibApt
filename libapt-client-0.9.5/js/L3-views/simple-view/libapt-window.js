/**
 * @file        libapt-window.js
 * @desc        Window view class
 * @see			libapt-view.js libapt-model.js
 * @group       LIBAPT_VIEWS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @class				LibaptWindow
 * @desc				Window view class
 * @param {string}		arg_name			View name (string)
 * @param {object}		arg_view_object		View to display inside the window (object)
 * @param {object}		arg_container_obj	JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptWindow(arg_name, arg_container_obj, arg_options)
{
	var self				= this;
	
	// INHERIT
	self.inheritFrom = LibaptView;
	self.inheritFrom(arg_name, arg_container_obj, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptWindow';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Draw grid
	 * @param {object}		arg_jquery_obj	JQuery object : the grid parent node
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw = function()
	{
		var self = this;
		var context = 'draw()';
		self.enter(context, '');
		
		switch (self.format)
		{
			case 'window_close':
				self.open_close();
				break;
			case 'window_yes_no':
				self.open_yes_no();
				break;
			default:
				self.assert(context, 'bad form format[' + arg_format + ']', arg_format);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Open a window with a yes and a no buttons
	 * @return {boolean}	true:success,false:failure
	 */
	this.open_yes_no = function()
	{
		var self = this;
		var context = 'open_yes_no()';
		self.enter(context, '');
		
		
		var arg_yes_cb		= get_arg(self.yes_cb, null);
		var arg_no_cb		= get_arg(self.no_cb, null);
		var arg_close_cb	= get_arg(self.close_cb, null);
		var arg_yes_label	= get_arg(self.yes_label, 'default Yes');
		var arg_no_label	= get_arg(self.no_label, 'default No');
		var arg_buttons		= {};
		arg_buttons[arg_yes_label] = function()
			{
				self.step(context, 'BUTTON YES CALLBACK');
				self.fire_event('yes_button_clicked', [self] );
				if ( Libapt.is_callback(arg_yes_cb) )
				{
					arg_yes_cb(self);
				}
				self.container_jqo.dialog('close');
			};
		arg_buttons[arg_no_label] = function()
			{
				self.step(context, 'BUTTON NO CALLBACK');
				self.fire_event('no_button_clicked', [self] );
				if ( Libapt.is_callback(arg_no_cb) )
				{
					arg_no_cb(self);
				}
				self.container_jqo.dialog('close');
			};
		
		self.container_jqo.dialog(
			{
				resizable:	self.is_resizable,
				autoOpen:	true,
				modal:		self.is_modal,
				maxHeight:	document.height*0.95,
				maxWidth:	document.width*0.95,
				height:		document.height*0.6,
				width:		document.width*0.6,
				buttons:	arg_buttons,
				'close':	function()
					{
						self.step(context, 'BUTTON CLOSE CALLBACK');
						self.fire_event('closed', [self] );
						if ( Libapt.is_callback(arg_close_cb) )
						{
							arg_close_cb(self);
						}
						self.container_jqo.dialog('close');
					}
			}
		);
		
		self.container_jqo.css('width', self.width);
		self.container_jqo.css('height', self.height);
		// console.log(self.width);
		// console.log(self.height);
		
		self.container_jqo.dialog('moveToTop');
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Open a window with a close button
	 * @return {boolean}	true:success,false:failure
	 */
	this.open_close = function()
	{
		var self = this;
		var context = 'open_close()';
		self.enter(context, '');
		
		
		self.container_jqo.dialog(
			{
				resizable: self.is_resizable,
				autoOpen: true,
				modal: self.is_modal,
				maxHeight:	document.height*0.95,
				maxWidth:	document.width*0.95,
				height:		document.height*0.6,
				width:		document.width*0.6,
				buttons:
				{	'Close': function()
						{
							self.fire_event('close-button-clicked', [self] );
							self.container_jqo.dialog('close');
							if ( Libapt.is_callback(self.close_cb) )
							{
								self.close_cb.apply(null, [self]);
							}
						}
				}
			}
		);
		
		self.container_jqo.css('width', self.width);
		self.container_jqo.css('height', self.height);
		// console.log(self.width);
		// console.log(self.height);
		
		self.container_jqo.dialog('moveToTop');
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Close a window
	 * @param {boolean}		arg_destroy		Destroy the jQuery object if true
	 * @return {object}		This
	 */
	this.close = function(arg_destroy)
	{
		var self = this;
		var context = 'close()';
		self.enter(context, '');
		
		
		self.container_jqo.dialog('close');
		if (arg_destroy)
		{
			self.container_jqo.dialog('destroy');
		}
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Destroy the idalog jQuery object
	 * @return {object}		This
	 */
	this.destroy = function()
	{
		var self = this;
		var context = 'destroy()';
		self.enter(context, '');
		
		
		self.container_jqo.dialog('destroy');
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Test if the window is opened
	 * @return {boolean}	Is open flag
	 */
	this.is_open = function()
	{
		var self = this;
		var context = 'is_open()';
		self.enter(context, '');
		
		
		var is_open_flag = self.container_jqo.dialog('isOpen');
		
		
		self.leave(context, 'success');
		return is_open_flag;
	}
		
	
	
	
	/**
	 * @memberof			LibaptWindow
	 * @public
	 * @desc 				Trace class attributes
	 * @return {string}
	 */
	this.to_string_self = function()
	{
		return
			this.to_string_value('is_modal',			this.is_modal)
			+ this.to_string_value('is_resizable',		this.is_resizable)
			+ this.to_string_value('format',			this.format)
			+ this.to_string_value('close_on_escape',	this.close_on_escape)
			+ this.to_string_value('close_label',		this.close_label)
			+ this.to_string_value('buttons.length',	this.buttons.length)
			+ this.to_string_value('width',				this.width)
			+ this.to_string_value('height',			this.height)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptWindow, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'A window view class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_bool_option(LibaptWindow, 'is_modal',				false, false, []);
Libapt.register_bool_option(LibaptWindow, 'is_resizable',			true, false, []);
Libapt.register_bool_option(LibaptWindow, 'close_on_escape',		true, false, []);

Libapt.register_str_option(LibaptWindow, 'format',					'window_close', false, []);
Libapt.register_str_option(LibaptWindow, 'close_label',				'Close', false, []);
Libapt.register_obj_option(LibaptWindow, 'buttons',					{}, false, []);

Libapt.register_str_option(LibaptWindow, 'yes_label',				'Yes', false, []);
Libapt.register_str_option(LibaptWindow, 'no_label',				'No', false, []);

Libapt.register_obj_option(LibaptWindow, 'yes_cb',					null, false, []);
Libapt.register_obj_option(LibaptWindow, 'no_cb',					null, false, []);
Libapt.register_obj_option(LibaptWindow, 'close_cb',				null, false, []);

Libapt.register_int_option(LibaptWindow, 'width',					null, false, []);
Libapt.register_int_option(LibaptWindow, 'height',					null, false, []);
