/**
 * @file        libapt-pager.js
 * @desc        Datas pager class
 * @see			libapt-model-view.js libapt-action-pager-pages.js libapt-action-pager-sizes.js
 * @group       LIBAPT_VIEWS
 * @date        2013-03-24
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @class				LibaptPager
 * @desc				Pager class
 * @param {string}		arg_name			View name (string)
 * @param {object}		arg_container_jqo	JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptPager(arg_name, arg_container_jqo, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptObject;
	self.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace				= false;
	self.class_name			= 'LibaptPager';
	var context				= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false, true);
	
	// CALCULATED ATTRIBUTES
	self.current_offset		= 0;
	self.first_offset		= 0;
	self.last_offset		= 0;
	self.offset_pages_count	= 10;
	
	self.current_page		= 0;
	self.first_page			= 0;
	self.last_page			= 0;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	/**
	 * @memberof	LibaptPager
	 * @event		LibaptPager.updated:Pager is updated
	 * @type		{nothing}
	 */
	 
	 /**
	 * @memberof	LibaptPager
	 * @event		LibaptPager.pager-size-changed:Pager pages size has changed
	 * @type		{nothing}
	 */
	 
	 /**
	 * @memberof	LibaptPager
	 * @event		LibaptPager.pager-page-changed:Pager current page has changed
	 * @type		{nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				update_items_count(arg_items_count)
	 * @desc				Update the items count
	 * @param {integer}		arg_items_count		Items count
	 * @return {boolean}	true:success,false:failure
	 * @fires				LibaptPager.updated
	 */
	this.update_items_count = function(arg_items_count)
	{
		var context = 'update_items_count(count)';
		this.enter(context, '');
		this.value(context, 'arg_items_count', arg_items_count);
		
		// CHECK PAGES SIZE
		this.current_pages_size	= this.current_pages_size > 0 ? this.current_pages_size : 10;
		this.offset_pages_count	= this.offset_pages_count > 0 ? this.offset_pages_count : 10;
		this.first_page			= 0;
		this.fisrt_offset		= 0;
		
		// NO ITEMS
		if (arg_items_count <= 0)
		{
			this.items_count	= 0;
			
			this.current_offset	= 0;
			this.last_offset	= 0;
			
			this.current_page	= 0;
			this.last_page		= 0;
		}
		
		// UPDATE ITEMS COUNT
		this.items_count	= arg_items_count;
		
		// UPDATE LAST PAGE INDEX
		this.last_page		= Math.max(0, Math.floor(this.items_count / this.current_pages_size) - 1);
		if ( (this.last_page + 1) * this.current_pages_size < this.items_count)
		{
			this.last_page += 1;
		}
		
		// UPDATE OFFSET
		this.last_offset	= Math.floor(this.last_page / this.offset_pages_count);
		this.current_offset	= this.current_offset <= this.last_offset ? this.current_offset : this.fisrt_offset;
		
		// UPDATE CURRENT PAGE INDEX
		this.current_page	= (this.current_page + this.current_offset) <= this.last_page ? this.current_page : (this.first_page + this.current_offset);
		
		// FIRE UPDATED EVENT
		this.fire_event('updated');
		
		this.value(context, 'pager', this.to_string());
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				change_current_size(arg_current_size)
	 * @desc				Update the current page size
	 * @param {integer}		arg_current_size		Current page size index
	 * @return {boolean}	true:success,false:failure
	 * @fires				LibaptPager.pager-size-changed
	 */
	this.change_current_size = function(arg_current_size)
	{
		var context = 'change_current_size(' + arg_current_size + ')';
		this.enter(context, '');
		
		this.current_pages_size	= arg_current_size;
		this.update_items_count(this.items_count);
		
		// FIRE EVENT
		this.fire_event('pager-size-changed');
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				change_current_offset(arg_current_offset)
	 * @desc				Update the current offset
	 * @param {integer}		arg_current_offset		Current offset index
	 * @return {boolean}	true:success,false:failure
	 */
	this.change_current_offset = function(arg_current_offset)
	{
		var context = 'change_current_offset(' + arg_current_offset + ')';
		this.enter(context, '');
		
		// UPDATE OFFSET
		this.current_offset	= Math.min(arg_current_offset, this.last_offset);
		this.current_offset	= Math.max(arg_current_offset, this.first_offset);
		var new_page = Math.max(0, this.current_offset * this.offset_pages_count);
		
		this.value(context, 'current_offset', this.current_offset);
		this.value(context, 'current_page', this.current_page);
		
		// FIRE UPDATED EVENT
		this.change_current_page(new_page);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				change_current_page(arg_current_page)
	 * @desc				Update the current page
	 * @param {integer}		arg_current_page		Current page index
	 * @return {boolean}	true:success,false:failure
	 * @fires				LibaptPager.pager-page-changed
	 */
	this.change_current_page = function(arg_current_page)
	{
		var context = 'change_current_page(' + arg_current_page + ')';
		this.enter(context, '');
		
		// UPDATE CURRENT PAGE INDEX
		this.current_page	= Math.min(arg_current_page, this.last_page);
		this.current_page	= Math.max(arg_current_page, this.first_page);
		
		this.value(context, 'current_offset', this.current_offset);
		this.value(context, 'current_page', this.current_page);
		
		// FIRE EVENT
		this.fire_event('pager-page-changed');
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				enable()
	 * @desc				Enable pager
	 * @return {boolean}	true:success,false:failure
	 */
	this.enable = function()
	{
		var context = 'enable()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				disable()
	 * @desc				Disable pager
	 * @return {boolean}	true:success,false:failure
	 */
	this.disable = function()
	{
		var context = 'disable()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				get_page_slice(arg_page_index)
	 * @desc				Get given page slice { offset, length }
	 * @param {integer}		arg_page_index		Current page index
	 * @return {object}		Slice object
	 */
	this.get_page_slice = function(arg_page_index)
	{
		var self = this;
		var context = 'get_page_slice(page_index)';
		self.enter(context, '');
		
		
		var page_offset		= arg_page_index * self.current_pages_size;
		var page_length		= self.current_pages_size;
		var page_slice		= { offset:page_offset, length:page_length };
		
		self.leave(context, 'success');
		return page_slice;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				get_range_slice(arg_page1_index, arg_page2_index)
	 * @desc				Get a slice for the given pages range
	 * @param {integer}		arg_page1_index		Range first page index
	 * @param {integer}		arg_page2_index		Range last page index
	 * @return {object}		Slice object { offset:integer, length:integer }
	 */
	this.get_range_slice = function(arg_page1_index, arg_page2_index)
	{
		var self = this;
		var context = 'get_range_slice(page1_index,page2_index)';
		self.enter(context, '');
		
		// CHECK ARGS
		self.assertTrue(context, 'args', Libapt.are_number([arg_page1_index, arg_page2_index]) && arg_page1_index >= 0 && arg_page2_index >= 0 && arg_page1_index <= arg_page2_index);
		
		var pages_count		= arg_page2_index - arg_page1_index + 1;
		pages_count			= pages_count > 0 ? pages_count : 0;
		
		var page_offset		= arg_page1_index * self.current_pages_size;
		var page_length		= pages_count * self.current_pages_size;
		var page_slice		= { offset:page_offset, length:page_length };
		
		self.leave(context, 'success');
		return page_slice;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptPager
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return this.to_string_value('items_count',			this.items_count)
			+ this.to_string_value('current_pages_size',	this.current_pages_size)
			+ this.to_string_value('step_pages_size',		this.step_pages_size)
			+ this.to_string_value('max_pages_size',		this.max_pages_size)
			
			+ this.to_string_value('offset_pages_count',	this.offset_pages_count)
			+ this.to_string_value('current_offset',		this.current_offset)
			
			+ this.to_string_value('first_offset',			this.first_offset)
			+ this.to_string_value('last_offset',			this.last_offset)
			+ this.to_string_value('current_page',			this.current_page)
			+ this.to_string_value('first_page',			this.first_page)
			+ this.to_string_value('last_page',				this.last_page)
			
			+ this.to_string_value('toolip_button_sizes',	this.toolip_button_sizes)
			+ this.to_string_value('toolip_button_pages',	this.toolip_button_pages)
			+ this.to_string_value('label_button_sizes',	this.label_button_sizes)
			+ this.to_string_value('label_button_pages',	this.label_button_pages)
			;
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptPager, ['LibaptObject'], 'Luc BORIES', '2013-08-21', 'Datas pages management class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_int_option(LibaptPager, 'items_count',			0, false, []);
Libapt.register_int_option(LibaptPager, 'current_pages_size',	10, false, ['pager_pages_size']);
Libapt.register_int_option(LibaptPager, 'step_pages_size',		10, false, ['pager_pages_step_size']);
Libapt.register_int_option(LibaptPager, 'max_pages_size',		100, false, ['pager_max_pages_size']);

// Libapt.register_str_option(LibaptPager, 'format',					'menus', false, []);
Libapt.register_str_option(LibaptPager, 'toolip_button_sizes',		'Choose the page size', false, []);
Libapt.register_str_option(LibaptPager, 'toolip_button_pages',		'Choose the page', false, []);
Libapt.register_str_option(LibaptPager, 'label_button_sizes',		null, false, []);
Libapt.register_str_option(LibaptPager, 'label_button_pages',		null, false, []);
