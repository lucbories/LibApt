/**
 * @file        libapt-context-menu.js
 * @brief       Contextual menu class
 * @details     ...
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @brief		Contextual menu class
 * @param[in]	arg_name			View unique name (string)
 * @param[in]	arg_container_jqo	JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptContextMenu(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptContextMenu';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	/**
	 * @brief		Default options for the menu class
	 */
	var default_options = {
		// ITEMS
		'menu_items'			: []
	}
	
	// VIEW ATTRIBUTES
	$.extend(this, default_options, get_arg_not_null(arg_options, {}) );
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	/**
	 * @brief		Draw the context menu
	 * @param[in]	arg_container_jqo	JQuery object to attach the view to (object)
	 * @return		boolean				true:success,false:failure
	 */
	this.draw = function(arg_container_jqo)
	{
		var self = this;
		var context = 'draw(jqo)';
		this.enter(context, '');
		
		
		// CHECK CONTAINER JQUERY OBJECT
		if ( Libapt.is_null(arg_container_jqo) )
		{
			arg_container_jqo = this.container_jqo;
		}
		this.assertNotNull(context, 'container_jqo', arg_container_jqo);
		
		// CREATE THE MENU
		var menu = $('<ul class="libapt_context_menu"></ul>');
		arg_container_jqo.append(menu);
		
		// FILL THE MENU
		for(menu_item_index in this.menu_items)
		{
			var menu_item	= this.menu_items[menu_item_index];
			
			// MENU ITEM ICON
			var icon		= '';
			if ( Libapt.is_string(menu_item.icon_url) )
			{
				icon = '<imag src="' + menu_item.icon_url + '"></img>';
			}
			
			// MENU ITEM LABEL
			var label		= '';
			if ( Libapt.is_string(menu_item.label) )
			{
				label = menu_item.label;
			}
			
			// MENU ITEM ANCHOR
			var anchor = $('<a href="#">' + label + '</a>');
			
			// MENU ITEM JQO
			var menu_item_jqo = $('<li></li>');
			menu_item_jqo.append(anchor);
			menu.append(menu_item_jqo);
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

Libapt.register_inheritance(LibaptContextMenu, LibaptView);



/**
 * @brief		Actions pager class generic unit tests
 * @param[in]	arg_tu_name				Test name (string)
 * @param[in]	arg_view_name			Model view name for the pager actions (string)
 * @param[in]	arg_pager_options		Pager options as an associative array (object or null)
 * @return		nothing
 */
// LibaptContextMenu.tu = function(arg_tu_name, arg_view_name, arg_pager_options)
// {
	// var context = 'LibaptContextMenu.' + arg_tu_name + '(' + arg_view_name + ')';
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
		// pager = new LibaptContextMenu(context + '_pager', jqo, arg_pager_options);
		
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
// LibaptContextMenu.tu_users_pager = function()
// {
	// var pager_options =
		// {
			// 'render_template'	: null,
			// 'render_begin'		: '<table><tr><td>',
			// 'render_separator'	: '</td><td>',
			// 'render_end'		: '</td></tr></table>',
			// 'actions'			: {}
		// };
	// LibaptContextMenu.tu('tu_users_pager', 'VIEW_AUTH_USERS', pager_options);
// }

