/**
 * @file        libapt-action-pager-sizes.js
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
LibaptActionPagerSizes.default_options = {
	'label'			: 'Pager sizes control'
}


/**
 * @public
 * @class				LibaptActionPagerSizes
 * @desc				Pager actions class
 * @param {string}		arg_name			action name
 * @param {object}		arg_model_view		model view object
 * @param {object|null}	arg_options			associative array of name/value options
 * @return {nothing}
 */
function LibaptActionPagerSizes(arg_name, arg_model_view, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptAction;
	self.inheritFrom(arg_name, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace			= false;
	self.class_name		= 'LibaptActionPagerSizes';
	var context			= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	self.model_view		= arg_model_view;
	self.assertNotNull(context, 'model_view', self.model_view);
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @memberof			LibaptActionPagerSizes
	 * @public
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
	 * @memberof			LibaptActionPagerSizes
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
		var label = Libapt.is_empty_str_or_null(pager.label_button_sizes) ? pager.current_pages_size : pager.label_button_sizes;
		var button = $('<button class="libapt_pager libapt_pager_button" title="' + pager.toolip_button_sizes + '">' + label + '</button>');
		button.button().css('padding', '0px');
		button.find('span').css('padding', '0px');
		arg_jqo.append(button);
		pager.jqo_button_sizes = button;
		
		// SET EVENT HANDLER
		button.click(
			function(event)
			{
				// CREATE AND FILL THE MENU
				var menu = $('<ul class="libapt_pager_menu_sizes"></ul>');
				arg_jqo.append(menu);
				for(var size = pager.step_pages_size ; size <= pager.max_pages_size ; size = size + pager.step_pages_size)
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
										pager.change_current_size(new_size);
										var label = Libapt.is_empty_str_or_null(pager.label_button_sizes) ? pager.current_pages_size : pager.label_button_sizes;
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
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			LibaptActionPagerSizes
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	self.to_string_self = function()
	{
		return '';
	}
}

Libapt.register_inheritance(LibaptActionPagerSizes, LibaptAction);


