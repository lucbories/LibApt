/**
 * @file        libapt-window.js
 * @brief       Window view class
 * @details     ...
 * @see			libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Default options for the window class
 */
LibaptWindow.default_options = {
	'is_modal'			: false,
	'is_resizable'		: true,
	'format'			: 'window_close',
	
	'buttons'			: {},
	
	'close_on_escape'	: true,
	'close_label'		: 'Close',
	
	'width'				: null,
	'height'			: null,
	
	'yes_cb'			: null,
	'no_cb'				: null,
	
	'yes_label'			: 'Yes',
	'no_label'			: 'No'
}


/**
 * @brief		Window view class
 * @param[in]	arg_name			View name (string)
 * @param[in]	arg_view_object		View to display inside the window (object)
 * @param[in]	arg_jquery_obj		JQuery object to attach the view to (object)
 * @param[in]	arg_options			associative array of options (object or null)
 * @return		nothing
 */
function LibaptWindow(arg_name, arg_view_object, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_view_object.container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptWindow';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// WINDOW ATTRIBUTES
	this.view				= arg_view_object; // CONTENT OF THE WINDOW
	$.extend(this, LibaptWindow.default_options, arg_options);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @brief		Draw grid
	 * @param[in]	arg_jquery_obj	JQuery object : the grid parent node (object)
	 * @return		boolean			true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		switch (this.format)
		{
			case 'window_close':
				this.open_close();
				break;
			case 'window_yes_no':
				this.open_yes_no();
				break;
			default:
				this.assert(context, 'bad form format[' + arg_format + ']', arg_format);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Open a window with a yes and a no buttons
	 * @return		boolean			true:success,false:failure
	 */
	this.open_yes_no = function()
	{
		var context = 'open_yes_no()';
		this.enter(context, '');
		
		var self = this;
		
		var arg_yes_cb		= get_arg(this.yes_cb, null);
		var arg_no_cb		= get_arg(this.no_cb, null);
		var arg_yes_label	= get_arg(this.yes_label, 'default Yes');
		var arg_no_label	= get_arg(this.no_label, 'default No');
		var arg_buttons		= {};
		arg_buttons[arg_yes_label] = function()
			{
				self.fire_event('yes_button_clicked', [self] );
				if (arg_no_cb)
				{
					arg_yes_cb(self);
				}
				self.container_jqo.dialog('close');
			};
		arg_buttons[arg_no_label] = function()
			{	
				self.fire_event('no_button_clicked', [self] );
				if (arg_no_cb)
				{
					arg_no_cb(self);
				}
				self.container_jqo.dialog('close');
			};
		
		this.container_jqo.dialog(
			{
				resizable:	self.is_resizable,
				autoOpen:	true,
				modal:		self.is_modal,
				buttons:	arg_buttons,
				'close':	function()
					{	
						self.fire_event('closed', [self] );
						if (arg_no_cb)
						{
							arg_no_cb(self);
						}
						self.container_jqo.dialog('close');
					}
			}
		);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Open a window with a close button
	 * @return		boolean			true:success,false:failure
	 */
	this.open_close = function()
	{
		var context = 'open_close()';
		this.enter(context, '');
		
		var self = this;
		
		this.container_jqo.dialog(
			{
				resizable: this.is_resizable,
				autoOpen: true,
				modal: this.is_modal,
				buttons:
				{	'Close': function()
						{
							self.fire_event('close_button_clicked', [self] );
							self.container_jqo.dialog('close');
						}
				}
			}
		);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	// TRACE METHOD : TO STRING
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

Libapt.register_inheritance(LibaptWindow, LibaptView);




/**
 * @brief		Window class generic unit tests
 * @param[in]	arg_tu_name				test name (string)
 * @param[in]	arg_view_name			view name for the window content (string)
 * @param[in]	arg_form_options		form options as an associative array (object or null)
 * @param[in]	arg_window_options		window options as an associative array (object or null)
 * @return		nothing
 */
LibaptWindow.tu = function(arg_tu_name, arg_view_name, arg_form_options, arg_window_options)
{
	var context = 'LibaptWindow.' + arg_tu_name + '(' + arg_view_name + ')';
	var tu = new LibaptObject(context, false);
	tu.trace = true;
	tu.separator();
	tu.enter(context, '');
	
	var model = null;
	var view = null;
	var form = null;
	var records = null;
	var window = null;
	try
	{
		// GET VIEW
		view = LibaptViews.get(arg_view_name);
		tu.assertNotNull(context, 'view', view);
		
		// GET MODEL
		model = view.model;
		tu.assertNotNull(context, 'model', model);
		
		// GET DATAS
		records = model.read_all_records_sync();
		tu.assertArraySize(context, 'records', records, 1);
		
		// CREATE FORM VIEW
		var jqo = null; // get_arg_not_null(arg_optional_target_jqo, $('.row:eq(1)').append( $('<hr>') ) )
		var no_options = null;
		form = new LibaptForm(context + '.form', view, jqo, arg_form_options);
		tu.assertNotNull(context, 'form', form);
		
		// DRAW FORM VIEW IN LIST FORMAT
		form.draw_one_record(records[0]);
		
		// CREATE WINDOW VIEW
		window = new LibaptWindow(context + '.window', form, arg_window_options);
		
		window.draw();
	}
	catch(e)
	{
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		console.log('EXCEPTION: ' + context + ': ' + e);
		console.log(view);
		console.log(form);
		console.log(window);
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	}
	finally
	{
		tu.leave(context, '');
	}
}


/**
 * @brief		Window class unit tests for a window with two buttons : yes and no
 * @return		nothing
 */
LibaptWindow.tu_users_yes_no = function()
{
	var form_options = null;
	var yes_cb = function(){ console.log('YES'); };
	var no_cb = function(){ console.log('NO'); };
	var window_options = { 'format':'window_yes_no', 'yes_cb':yes_cb, 'no_cb':no_cb };
	LibaptWindow.tu('tu_users_yes_no', 'VIEW_AUTH_USERS', form_options, window_options);
}


/**
 * @brief		Window class unit tests for a window with one close button
 * @param[in]	
 * @return		nothing
 */
LibaptWindow.tu_users_close = function()
{
	var form_options = null;
	var window_options = { 'format':'window_close' };
	LibaptWindow.tu('tu_users_close', 'VIEW_AUTH_USERS', form_options, window_options);
}


/**
 * @brief		Window class unit tests for a window with one close button
 * @param[in]	
 * @return		nothing
 */
LibaptWindow.tu_users_roles_close = function()
{
	var form_options = null;
	var window_options = { 'format':'window_close', 'is_resizable':true };
	LibaptWindow.tu('tu_users_roles_close', 'VIEW_AUTH_USERS_ROLES', form_options, window_options);
}





/**
 * @brief		Windows repository class
 * @return		nothing
 */
function LibaptWindows()
{
}


/**
 * @brief		Windows repository array
 */
LibaptWindows.all_windows = [];


/**
 * @brief		Append a window to the windows repository
 * @return		nothing
 */
LibaptWindows.add = function(arg_window)
{
	LibaptWindows.all_windows.push(arg_window);
}


/**
 * @brief		Remove all windows of the repository
 * @return		nothing
 */
LibaptWindows.reset = function()
{
	LibaptWindows.all_windows = [];
}
