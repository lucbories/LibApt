/**
 * @file        libapt-progress-window.js
 * @desc        Progress window view class
 * @see			libapt-window.js
 * @group       LIBAPT_VIEWS
 * @date        2013-08-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @memberof	LibaptProgressWindow
 * @public
 * @static
 * @desc		Default options for the window class
 */
LibaptProgressWindow.default_options = {
	'is_modal'			: true,
	'is_resizable'		: true,
	'format'			: 'window_close',
	
	'buttons'			: {},
	
	'close_on_escape'	: true,
	'close_label'		: 'Cancel',
	
	'width'				: '500px',
	'height'			: '450px',
	
	'yes_cb'			: null,
	'no_cb'				: null,
	
	'yes_label'			: 'Yes',
	'no_label'			: 'No'
};


/**
 * @public
 * @class				LibaptProgressWindow
 * @desc				Window view class
 * @param {string}		arg_name			View name
 * @param {object}		arg_container_jqo	JQuery object to attach the view to
 * @param {object|null}	arg_options			Associative array of options
 * @return {nothing}
 */
function LibaptProgressWindow(arg_name, arg_container_jqo, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptWindow;
	self.inheritFrom(arg_name, arg_container_jqo, LibaptProgressWindow.default_options);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptProgressWindow';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	// WINDOW ATTRIBUTES
	self.progress_bar_jqo		= null;
	self.steps_index_by_label	= {};
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @desc 				Draw window
	 * @param {object}		arg_jquery_obj	JQuery object : the grid parent node
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		
		// CREATE WINDOW CONTENT
		self.content_jqo = $('<div>');
		self.content_jqo.addClass('libapt_progress_content');
		self.container_jqo.append(self.content_jqo);
		
		// CREATE MAIN PROGRESS BAR
		self.progress_bar_jqo = $('<div>');
		self.progress_bar_jqo.progressbar(
				{
					value: 0
				}
			);
		self.content_jqo.append(self.progress_bar_jqo);
		self.progress_bar_jqo.addClass('libapt_progress_bar');
		self.progress_bar_jqo.css('margin-bottom', '5px');
		
		// CREATE MAIN PROGRESS LABEL
		self.progress_label_jqo = $('<span>');
		self.content_jqo.append(self.progress_label_jqo);
		self.progress_label_jqo.addClass('libapt_progress_label');
		self.progress_label_jqo.css('margin-bottom', '20px');
		
		// CREATE STEPS LIST
		self.steps_table_jqo = $('<table>');
		self.content_jqo.append(self.steps_table_jqo);
		self.steps_table_jqo.addClass('libapt_progress_steps');
		self.steps_table_jqo.css('margin-top', '20px');
		
		// CREATE STEPS LIST HEADERS
		self.steps_table_head_jqo = $('<thead>');
		self.steps_table_jqo.append(self.steps_table_head_jqo);
		var tr_jqo = $('<tr>');
		self.steps_table_head_jqo.append(tr_jqo);
		tr_jqo.append( $('<th>No</th>') );
		tr_jqo.append( $('<th>Label</th>') );
		tr_jqo.append( $('<th>Begin</th>') );
		tr_jqo.append( $('<th>End</th>') );
		tr_jqo.append( $('<th>Progress</th>') );
		tr_jqo.append( $('<th>Status</th>') );
		
		self.steps_table_jqo.css('font-size', '0.7em');
		
		// CREATE STEPS LIST BODY
		self.steps_table_body_jqo = $('<tbody>');
		self.steps_table_jqo.append(self.steps_table_body_jqo);
		
		// DRAW WINDOW
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
		
		// self.container_jqo.dialog('option', 'width', 400);
		// self.container_jqo.dialog('option', 'height', 450);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				update_progress_bar()
	 * @desc				Update progress bar
	 * @return {object}		This
	 */
	this.update_progress_bar = function(arg_progress_value)
	{
		var self = this;
		var context = 'update_progress_bar(value)';
		self.enter(context, '');
		
		
		// var progress_cb = function() { self.progress_bar_jqo.progressbar('value', arg_progress_value); };
		// window.setTimeout(progress_cb, 100);
		self.progress_bar_jqo.progressbar('value', arg_progress_value);
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				append_progress_label()
	 * @desc				Append a progress label
	 * @return {object}		This
	 */
	this.append_progress_label = function(arg_progress_label)
	{
		var self = this;
		var context = 'append_progress_label(label)';
		self.enter(context, '');
		
		
		// var progress_cb = function() { self.content_jqo.append( $('<p>' + arg_progress_label + '</p>') ); };
		// window.setTimeout(progress_cb, 100);
		// self.content_jqo.append( $('<p>' + arg_progress_label + '</p>') );
		self.progress_label_jqo.text(arg_progress_label);
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				append_progress_label()
	 * @desc				Append a progress label and update the progress bar
	 * @return {object}		This
	 */
	this.append_progress_label_and_value = function(arg_progress_label, arg_progress_value)
	{
		var self = this;
		var context = 'append_progress_label_and_value(label,value)';
		self.enter(context, '');
		
		
		self.update_progress_bar(arg_progress_value);
		self.append_progress_label(arg_progress_label);
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				start_step(arg_step_index)
	 * @desc				Register a step begin
	 * @param {number}		arg_step_index		step row index
	 * @param {string|null}	arg_status			status label
	 * @return {object}		This
	 */
	this.start_step = function(arg_step_index, arg_status)
	{
		var self = this;
		var context = 'start_step(step_index)';
		self.enter(context, '');
		
		
		self.update_step_cell(arg_step_index, 2, new Date().toLocaleTimeString());
		self.update_step_cell(arg_step_index, 5, Libapt.is_string(arg_status) ? arg_status : 'Starting');
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				stop_step(arg_step_index)
	 * @desc				Register a step end
	 * @param {number}		arg_step_index		step row index
	 * @param {string|null}	arg_status			status label
	 * @return {object}		This
	 */
	this.stop_step = function(arg_step_index, arg_status)
	{
		var self = this;
		var context = 'stop_step(step_index)';
		self.enter(context, '');
		
		
		self.update_step_cell(arg_step_index, 3, new Date().toLocaleTimeString());
		self.update_step_cell(arg_step_index, 5, Libapt.is_string(arg_status) ? arg_status : 'Finished');
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				update_step_cell(arg_step_index, arg_cell_index, arg_value)
	 * @desc				Update a step cell value
	 * @param {number}		arg_step_index		step row index
	 * @param {number}		arg_cell_index		cell index
	 * @param {string}		arg_value			cell value
	 * @return {object}		This
	 */
	this.update_step_cell = function(arg_step_index, arg_cell_index, arg_value)
	{
		var self = this;
		var context = 'update_step_cell(step_index,cell index,value)';
		self.enter(context, '');
		
		
		// CHECK STEP INDEX
		self.assertTrue(context, 'step index', Libapt.is_number(arg_step_index) && arg_step_index >= 0);
		self.assertTrue(context, 'step index', Libapt.is_number(arg_cell_index) && arg_cell_index >= 0 && arg_cell_index <= 5);
		
		// GET STEP ROW
		var tr_jqo = $('tr', self.steps_table_body_jqo).eq(arg_step_index);
		self.assertNotNull(context, 'step row', tr_jqo);
		
		// GET CELL
		var td_jqo = $('td', tr_jqo).eq(arg_cell_index);
		self.assertNotNull(context, 'step cell', td_jqo);
		
		// UPDATE CELL
		td_jqo.text(arg_value);
		
		
		self.leave(context, 'success');
		return self;
	}
		
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				append_step()
	 * @desc				Append a progress step
	 * @return {number}		Step index
	 */
	this.append_step = function(arg_step_object)
	{
		var self = this;
		var context = 'append_step(step_obj)';
		self.enter(context, '');
		
		
		// CHECK STEP OBJECT
		self.assertNotNull(context, 'step object', arg_step_object);
		
		// CREATE STEP ROW
		var tr_jqo = $('<tr>');
		self.steps_table_body_jqo.append(tr_jqo);
		tr_jqo.append( $('<td>') );
		tr_jqo.append( $('<td>') );
		tr_jqo.append( $('<td>') );
		tr_jqo.append( $('<td>') );
		tr_jqo.append( $('<td>') );
		tr_jqo.append( $('<td>') );
		
		// GET STEP DATAS
		var step_index		= tr_jqo.index();
		var step_label		= get_arg_not_null(arg_step_object.label, '');
		var step_begin		= get_arg_not_null(arg_step_object.begin, '');
		var step_end		= get_arg_not_null(arg_step_object.end, '');
		var step_progress	= get_arg_not_null(arg_step_object.progress, '');
		var step_status		= get_arg_not_null(arg_step_object.status, '');
		
		// FILL STEP ROW
		self.update_step_cell(step_index, 0, step_index);
		self.update_step_cell(step_index, 1, step_label);
		self.update_step_cell(step_index, 2, step_begin);
		self.update_step_cell(step_index, 3, step_end);
		self.update_step_cell(step_index, 4, step_progress);
		self.update_step_cell(step_index, 5, step_status);
		
		// REGISTER STEP
		self.steps_index_by_label[step_label] = step_index;
		
		
		self.leave(context, 'success');
		return step_index;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				enter_step(arg_step_label, arg_progress_value)
	 * @desc				Enter a step
	 * @param {string}		arg_step_label			step label
	 * @param {number|null}	arg_progress_value		new window progress value
	 * @return {object}		This
	 */
	this.enter_step = function(arg_step_label, arg_progress_value)
	{
		var self = this;
		var context = 'enter_step(label,progress value)';
		self.enter(context, '');
		
		
		self.append_step(
			{
				label:arg_step_label,
				status:'...'
			}
		);
		
		var step_index = self.steps_index_by_label[arg_step_label];
		if ( Libapt.is_number(step_index) )
		{
			self.start_step(step_index);
		}
		
		if (arg_progress_value)
		{
			self.append_progress_label_and_value(arg_step_label, arg_progress_value);
		}
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptProgressWindow
	 * @method				leave_step(arg_step_label, arg_progress_value)
	 * @desc				Leave a step
	 * @param {string}		arg_step_label			step label
	 * @param {number|null}	arg_progress_value		new window progress value
	 * @param {string|null}	arg_status				status label
	 * @return {object}		This
	 */
	this.leave_step = function(arg_step_label, arg_progress_value, arg_status)
	{
		var self = this;
		var context = 'leave_step(label,progress value)';
		self.enter(context, '');
		
		
		var step_index = self.steps_index_by_label[arg_step_label];
		if ( Libapt.is_number(step_index) )
		{
			self.stop_step(step_index, arg_status);
		}
		
		if (arg_progress_value)
		{
			self.append_progress_label_and_value(arg_step_label, arg_progress_value);
		}
		
		
		self.leave(context, 'success');
		return self;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptProgressWindow, ['LibaptWindow'], 'Luc BORIES', '2013-08-21', 'Progress window view.');


// INTROSPETION : REGISTER OPTIONS
// NO OPTIONS
