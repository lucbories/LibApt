/**
 * @file        libapt-action-pager-pages.js
 * @desc        Pager action class to choose pager size
 * @see			libapt-action.js libapt-pager.js
 * @group       LIBAPT_VIEWS
 * @date        2013-08-01
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @desc		Default options of the action
 */
LibaptActionPagerPages.default_options = {
	'label'			: 'Pager pages control'
}


/**
 * @public
 * @class				LibaptActionPagerPages
 * @desc				Pager actions class
 * @param {string}		arg_name			action name
 * @param {object}		arg_model_view		model view object
 * @param {object|null}	arg_options			associative array of name/value options
 * @return {nothing}
 */
function LibaptActionPagerPages(arg_name, arg_model_view, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptAction;
	self.inheritFrom(arg_name, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace			= false;
	self.class_name		= 'LibaptActionPagerPages';
	var context			= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	self.model_view		= arg_model_view;
	self.assertNotNull(context, 'model_view', self.model_view);
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @memberof			LibaptActionPagerPages
	 * @method				do_action(arg_operands)
	 * @desc				Do the pager action on click
	 * @param {array}		arg_operands	Array of action operands 
	 * @return {boolean}
	 */
	self.do_action = function(arg_operands)
	{
		var self = this;
		var context = 'do_action(operands)';
		self.enter(context, '');
		
		
		if ( ! self.is_enabled )
		{
			self.leave(context, 'action is disabled');
			return true;
		}
		
		if ( ! self.model_view.pager )
		{
			self.leave(context, 'the model view has no pager');
			return true;
		}
		
		
		self.leave(context, '');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptActionPagerPages
	 * @public
	 * @method				draw_button(arg_jqo, arg_size_min, arg_size_max)
	 * @desc				Draw the action button
	 * @param {object}		arg_jqo			JQuery object container to draw in
	 * @param {integer}		arg_size_min	small size of the button image
	 * @param {integer}		arg_size_max	big size of the button image
	 * @return {boolean}
	 */
	self.draw_button = function(arg_jqo, arg_size_min, arg_size_max)
	{
		var self = this;
		var context = 'draw_button(jqo, min_size, max_size)';
		self.enter(context, '');
		
		
		// CHECK PAGER
		if ( ! self.model_view.pager )
		{
			self.leave(context, 'the model view has no pager');
			return true;
		}
		var pager = self.model_view.pager;
		
		// CHECK CONTAINER JQUERY OBJECT
		self.assertNotNull(context, 'container', arg_jqo);
		
		// CREATE BUTTON AND MENU
		var current_page_first_item	= pager.current_page * pager.current_pages_size;
		var current_page_last_item	= (pager.current_page + 1) * pager.current_pages_size - 1;
		var label = Libapt.is_empty_str_or_null(pager.label_button_pages) ? (current_page_first_item + '-' + current_page_last_item) : pager.label_button_pages;
		
		if (self.jqo_button_pages)
		{
			self.jqo_button_pages.detach();
			// delete self.jqo_button_pages;
		}
		self.jqo_button_pages = $('<button class="libapt_pager libapt_pager_button" title="' + pager.toolip_button_pages + '">' + label + '</button>');
		self.jqo_button_pages.button().css('padding', '0px');
		self.jqo_button_pages.find('span').css('padding', '0px');
		arg_jqo.append(self.jqo_button_pages);
		
		// SET EVENT HANDLER
		self.jqo_button_pages.click(
			function(event)
			{
				// CREATE MENU
				var menu = $('<ul class="libapt_pager_menu_pages"></ul>');
				arg_jqo.append(menu);
				var menu_first_page	= Math.max(pager.first_page, pager.current_offset * pager.offset_pages_count);
				var menu_last_page	= Math.min(pager.last_page, menu_first_page + pager.offset_pages_count - 1);
				self.value(context, 'menu_first_page', menu_first_page);
				self.value(context, 'menu_last_page', menu_last_page);
				self.value(context, 'current_offset', pager.current_offset);
				self.value(context, 'current_page', pager.current_page);
				
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
					var current_page_first_item	= index * pager.current_pages_size;
					var current_page_last_item	= Math.min(pager.items_count - 1, (index + 1) * pager.current_pages_size - 1);
					var label = current_page_first_item + '-' + current_page_last_item;
					var menu_item = $('<li libapt_pager_menu_index="' + index + '"><a href="#">' + label + '</a></li>');
					menu.append(menu_item);
				}
				
				// FILL MENU WITH NEXT OFFSET
				if (menu_last_page < pager.last_page)
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
									if ( ui.item.attr('libapt_pager_menu_index') == 'previous' && pager.current_offset > pager.first_offset )
									{
										pager.change_current_offset(pager.current_offset - 1);
										menu.remove();
										return;
									}
									
									// CHOOSE NEXT OFFSET
									if ( ui.item.attr('libapt_pager_menu_index') == 'next' && pager.current_offset < pager.last_offset )
									{
										pager.change_current_offset(pager.current_offset + 1);
										menu.remove();
										return;
									}
									
									// CHOOSE A PAGE OF THE CURRENT OFFSET
									var new_page = parseInt( ui.item.attr('libapt_pager_menu_index') );
									if ( ! Libapt.is_null(new_page) )
									{
										pager.change_current_page(new_page);
										
										self.update_button_label();
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
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @memberof			LibaptActionPagerPages
	 * @public
	 * @method				update_button_label()
	 * @desc				Update the action button label
	 * @return {boolean}
	 */
	this.update_button_label = function()
	{
		var self = this;
		var context = 'update_button_label()';
		self.enter(context, '');
		
		
		// CHECK PAGER
		if ( ! self.model_view.pager )
		{
			self.leave(context, 'the model view has no pager');
			return true;
		}
		var pager = self.model_view.pager;
		
		// CHECK BUTTON
		if ( ! self.jqo_button_pages)
		{
			self.leave(context, 'no button');
			return true;
		}
		
		// DEBUG
		self.value(context, 'current_offset', pager.current_offset);
		self.value(context, 'current_page', pager.current_page);
		
		var current_page_first_item	= pager.current_page * pager.current_pages_size;
		var current_page_last_item	= Math.min(pager.items_count - 1, (pager.current_page + 1) * pager.current_pages_size - 1);
		var label = Libapt.is_empty_str_or_null(pager.label_button_pages) ? (current_page_first_item + '-' + current_page_last_item) : pager.label_button_pages;
		
		self.jqo_button_pages.children().filter('span').text(label);
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @memberof			LibaptActionPagerPages
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	self.to_string_self = function()
	{
		return '';
	}
}

Libapt.register_inheritance(LibaptActionPagerPages, LibaptAction);


