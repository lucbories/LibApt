/**
 * @file        libapt-pager.js
 * @brief       Pager class
 * @details     ...
 * @see			libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-03-24
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @brief		Pager class : manage items with pages
 * @param[in]	arg_name			View unique name (string)
 * @param[in]	arg_container_jqo	JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptPager(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptPager';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	/**
	 * @brief		Default options for the pager class
	 */
	var default_options = {
		// INPUTS
		'items_count'			: 0,
		'current_pages_size'	: 10,
		'step_pages_size'		: 10,
		'max_pages_size'		: 100,
		
		// CALCULATED
		'current_offset'		: 0,
		'first_offset'			: 0,
		'last_offset'			: 0,
		'offset_pages_count'	: 10,
		
		'current_page'		: 0,
		'first_page'		: 0,
		'last_page'			: 0,
		
		// DISPLAY
		'format'			: 'menus',
		'toolip_button_sizes'	: 'Choose the page size',
		'toolip_button_pages'	: 'Choose the page',
		'label_button_sizes'	: null,
		'label_button_pages'	: null
	}
	
	// VIEW ATTRIBUTES
	$.extend(this, default_options, get_arg_not_null(arg_options, {}) );
	this.jqo_button_sizes	= null;
	this.jqo_button_pages	= null;
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	/**
	 * @brief		Update the items count
	 * @param[in]	arg_items_count	 	Items count (integer)
	 * @return		boolean				true:success,false:failure
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
		this.fire_event("updated");
		
		this.value(context, 'pager', this.to_string());
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Update the current page size
	 * @param[in]	arg_current_size 	Current page size index (integer)
	 * @return		boolean				true:success,false:failure
	 */
	this.change_current_size = function(arg_current_size)
	{
		var context = 'change_current_size(' + arg_current_size + ')';
		this.enter(context, '');
		
		this.current_pages_size	= arg_current_size;
		this.update_items_count(this.items_count);
		
		// UPDATE BUTTON LABEL
		this.update_pages_menu_button_label();
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Update the current offset
	 * @param[in]	arg_current_offset 	Current offset index (integer)
	 * @return		boolean				true:success,false:failure
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
	 * @brief		Update the current page
	 * @param[in]	arg_current_page 	Current page index (integer)
	 * @return		boolean				true:success,false:failure
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
		
		// UPDATE BUTTON LABEL
		this.update_pages_menu_button_label();
		
		// FIRE UPDATED EVENT
		this.fire_event('current_page_changed');
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Enable pager
	 * @return		boolean				true:success,false:failure
	 */
	this.enable = function()
	{
		var context = 'enable()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Disable pager
	 * @return		boolean				true:success,false:failure
	 */
	this.disable = function()
	{
		var context = 'disable()';
		this.enter(context, '');
		
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw the pager sizes menu
	 * @param[in]	arg_container_jqo	JQuery object to attach the view to (object)
	 * @return		boolean				true:success,false:failure
	 */
	this.draw_sizes_menu = function(arg_container_jqo)
	{
		var context = 'draw_sizes_menu(jqo)';
		this.enter(context, '');
		
		var self = this;
		
		// CHECK CONTAINER JQUERY OBJECT
		if ( Libapt.is_null(arg_container_jqo) )
		{
			arg_container_jqo = this.container_jqo;
		}
		
		// CREATE BUTTON AND MENU
		var label = Libapt.is_empty_str_or_null(this.label_button_sizes) ? this.current_pages_size : this.label_button_sizes;
		var button = $('<button class="libapt_pager libapt_pager_button" title="' + this.toolip_button_sizes + '">' + label + '</button>');
		button.button().css('padding', '0px');
		button.find('span').css('padding', '0px');
		arg_container_jqo.append(button);
		this.jqo_button_sizes = button;
		
		// SET EVENT HANDLER
		button.click(
			function(event)
			{
				// CREATE AND FILL THE MENU
				var menu = $('<ul class="libapt_pager_menu_sizes"></ul>');
				arg_container_jqo.append(menu);
				for(var size = self.step_pages_size ; size <= self.max_pages_size ; size = size + self.step_pages_size)
				{
					var menu_item = $('<li><a href="#">' + size + '</a></li>');
					menu.append(menu_item);
				}
				
				// CREATE JQUERY UI MENU
				menu.menu(
					{
						icons: {},
						select: function(event, ui)
							{
								menu.hide();
								
								if ( ! Libapt.is_null(ui.item) )
								{
									var new_size = parseInt( ui.item.text() );
									if ( ! Libapt.is_null(new_size) && ! isNaN(new_size) )
									{
										self.change_current_size(new_size);
										var label = Libapt.is_empty_str_or_null(self.label_button_sizes) ? self.current_pages_size : self.label_button_sizes;
										button.children().filter('span').text(label);
									}
								}
								
								menu.remove();
							}
					}
				);
				
				// UPDATE MENU CSS
				menu.css(
					{
						'z-index':1000,
						'position':'absolute',
						'top':  $(button).position().top + 'px',
						'left': $(button).position().left - $(button).parent().width() + 'px',
						'padding': '0px'
					}
				);
				
				menu.show();
				
				setTimeout(
					function()
					{
						menu.hide();
						menu.remove();
					},
					2000
				);
			}
		);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw the pager pages menu
	 * @param[in]	arg_container_jqo	JQuery object to attach the view to (object)
	 * @return		boolean				true:success,false:failure
	 */
	this.draw_pages_menu = function(arg_container_jqo)
	{
		var context = 'draw_pages_menu(jqo)';
		this.enter(context, '');
		
		var self = this;
		
		// CHECK CONTAINER JQUERY OBJECT
		if ( Libapt.is_null(arg_container_jqo) )
		{
			arg_container_jqo = this.container_jqo;
		}
		
		// CREATE BUTTON AND MENU
		var current_page_first_item	= this.current_page * this.current_pages_size;
		var current_page_last_item	= (this.current_page + 1) * this.current_pages_size;
		var label = Libapt.is_empty_str_or_null(this.label_button_pages) ? (current_page_first_item + '-' + current_page_last_item) : this.label_button_pages;
		
		this.jqo_button_pages = $('<button class="libapt_pager libapt_pager_button" title="' + this.toolip_button_pages + '">' + label + '</button>');
		this.jqo_button_pages.button().css('padding', '0px');
		this.jqo_button_pages.find('span').css('padding', '0px');
		arg_container_jqo.append(this.jqo_button_pages);
		
		// SET EVENT HANDLER
		this.jqo_button_pages.click(
			function(event)
			{
				// CREATE MENU
				var menu = $('<ul class="libapt_pager_menu_pages"></ul>');
				arg_container_jqo.append(menu);
				var menu_first_page	= Math.max(self.first_page, self.current_offset * self.offset_pages_count);
				var menu_last_page	= Math.min(self.last_page, menu_first_page + self.offset_pages_count - 1);
				self.value(context, 'menu_first_page', menu_first_page);
				self.value(context, 'menu_last_page', menu_last_page);
				self.value(context, 'current_offset', self.current_offset);
				self.value(context, 'current_page', self.current_page);
				
				// FILL MENU WITH PREVIOUS OFFSET
				if (menu_first_page > 0)
				{
					var label = "Previous";
					var menu_item = $('<li libapt_pager_menu_index="previous" libapt_pager_previous_offset><a href="#">' + label + '</a></li>');
					menu.append(menu_item);
				}
				
				// FILL MENU WITH CURRENT OFFSET PAGES
				for(var index = menu_first_page ; index <= menu_last_page ; index++)
				{
					var current_page_first_item	= index * self.current_pages_size;
					var current_page_last_item	= Math.min(self.items_count - 1, (index + 1) * self.current_pages_size - 1);
					var label = current_page_first_item + '-' + current_page_last_item;
					var menu_item = $('<li libapt_pager_menu_index="' + index + '"><a href="#">' + label + '</a></li>');
					menu.append(menu_item);
				}
				
				// FILL MENU WITH NEXT OFFSET
				if (menu_last_page < self.last_page)
				{
					var label = "Next";
					var menu_item = $('<li libapt_pager_menu_index="next" libapt_pager_next_offset><a href="#">' + label + '</a></li>');
					menu.append(menu_item);
				}
				
				// CREATE JQUERY UI MENU
				menu.menu(
					{
						icons: {},
						select: function(event, ui)
							{
								menu.hide();
								
								if ( ! Libapt.is_null(ui.item) )
								{
									// CHOOSE PREVIOUS OFFSET
									if ( ui.item.attr('libapt_pager_menu_index') == 'previous' && self.current_offset > self.first_offset )
									{
										self.change_current_offset(self.current_offset - 1);
										menu.remove();
										return;
									}
									
									// CHOOSE NEXT OFFSET
									if ( ui.item.attr('libapt_pager_menu_index') == 'next' && self.current_offset < self.last_offset )
									{
										self.change_current_offset(self.current_offset + 1);
										menu.remove();
										return;
									}
									
									// CHOOSE A PAGE OF THE CURRENT OFFSET
									var new_page = parseInt( ui.item.attr('libapt_pager_menu_index') );
									if ( ! Libapt.is_null(new_page) )
									{
										self.change_current_page(new_page);
										
										self.update_pages_menu_button_label();
									}
								}
								
								menu.remove();
							}
					}
				);
				
				// UPDATE CSS
				menu.css(
					{
						'z-index':1000,
						'position':'absolute',
						'top':  $(self.jqo_button_pages).position().top + 'px',
						'left': $(self.jqo_button_pages).position().left - $(self.jqo_button_pages).parent().width() + 'px',
						'width': '100px',
						'padding': '0px'
					}
				);
				
				menu.show();
				
				setTimeout(
					function()
					{
						menu.hide();
						menu.remove();
						// menu.destroy();
					},
					2000
				);
			}
		);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Update pages menu button label
	 * @return		boolean			true:success,false:failure
	 */
	this.update_pages_menu_button_label = function()
	{
		var context = 'update_pages_menu_button_label()';
		this.enter(context, '');
		
		if ( ! this.jqo_button_pages)
		{
			this.leave(context, 'no button');
			return true;
		}
		
		this.value(context, 'current_offset', this.current_offset);
		this.value(context, 'current_page', this.current_page);
		
		var current_page_first_item	= this.current_page * this.current_pages_size;
		var current_page_last_item	= Math.min(this.items_count - 1, (this.current_page + 1) * this.current_pages_size - 1);
		var label = Libapt.is_empty_str_or_null(this.label_button_pages) ? (current_page_first_item + '-' + current_page_last_item) : this.label_button_pages;
		
		this.jqo_button_pages.children().filter('span').text(label);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Refresh pager
	 * @return		boolean			true:success,false:failure
	 */
	this.refresh = function()
	{
		var context = 'refresh()';
		this.enter(context, '');
		
		this.update_pages_menu_button_label();
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw pager
	 * @return		boolean			true:success,false:failure
	 */
	this.draw = function()
	{
		var context = 'draw()';
		this.enter(context, '');
		
		
		this.content_jqo = $('<span></<span>');
		this.draw_sizes_menu(this.content_jqo);
		this.draw_pages_menu(this.content_jqo);
		
		// container_jqoT TITLE BAR
		this.container_jqo.append(this.content_jqo);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	// TRACE METHOD : TO STRING
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
			+ this.to_string_value('format',				this.format)
			+ this.to_string_value('toolip_button_sizes',	this.toolip_button_sizes)
			+ this.to_string_value('toolip_button_pages',	this.toolip_button_pages)
			+ this.to_string_value('label_button_sizes',	this.label_button_sizes)
			+ this.to_string_value('label_button_pages',	this.label_button_pages)
			;
	}
	
	
	// ON READY HANDLER
	this.on_ready();
}

Libapt.register_inheritance(LibaptPager, LibaptView);



/**
 * @brief		Actions pager class generic unit tests
 * @param[in]	arg_tu_name				Test name (string)
 * @param[in]	arg_view_name			Model view name for the pager actions (string)
 * @param[in]	arg_pager_options		Pager options as an associative array (object or null)
 * @return		nothing
 */
// LibaptPager.tu = function(arg_tu_name, arg_view_name, arg_pager_options)
// {
	// var context = 'LibaptPager.' + arg_tu_name + '(' + arg_view_name + ')';
	// var tu = new LibaptObject(context, false);
	// tu.trace = true;
	// tu.separator();
	// tu.enter(context, '');
	
	// var view = null;
	// var pager = null;
	// try
	// {
		// GET VIEW
		// view = LibaptViews.get(arg_view_name);
		// tu.assertNotNull(context, 'view', view);
		// view.selected_first_row = $('#' + view.name + ' tzble tbody tr:eq(1)');
		
		// CREATE TOOLBAR VIEW
		// var jqo = $('.row:eq(1)');
		// jqo.append( $('<hr>') );
		// pager = new LibaptPager(context + '_pager', jqo, arg_pager_options);
		
		// CREAT AND ADD TOOLBAR ACTIONS ON THE MODEL VIEW
		// var action_options = null;
		// var action1 = new LibaptCrudAction('create', view, 'create', action_options);
		// var action2 = new LibaptCrudAction('refresh', view, 'refresh', action_options);
		// var action3 = new LibaptCrudAction('update', view, 'update', action_options);
		// var action4 = new LibaptCrudAction('delete', view, 'delete', action_options);
		// pager.add_action(action1);
		// pager.add_action(action2);
		// pager.add_action(action3);
		// pager.add_action(action4);
		
		// INIT AND DRAW VIEW
		// pager.draw();
		
		// return pager;
	// }
	// catch(e)
	// {
		// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
		// console.log('EXCEPTION: ' + context + ': ' + e);
		// console.log(view);
		// console.log(pager);
		// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
	// }
	// finally
	// {
		// tu.leave(context, '');
	// }
	// return null;
// }


/**
 * @brief		Pager unit test on the USERS
 * @return		nothing
 */
// LibaptPager.tu_users_pager = function()
// {
	// var pager_options =
		// {
			// 'render_template'	: null,
			// 'render_begin'		: '<table><tr><td>',
			// 'render_separator'	: '</td><td>',
			// 'render_end'		: '</td></tr></table>',
			// 'actions'			: {}
		// };
	// LibaptPager.tu('tu_users_pager', 'VIEW_AUTH_USERS', pager_options);
// }

