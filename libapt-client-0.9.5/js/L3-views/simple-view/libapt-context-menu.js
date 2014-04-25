/**
 * @file        libapt-context-menu.js
 * @desc        Contextual menu class
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @public
 * @class				LibaptMixinToolbars
 * @desc				Contextual menu class
 * @param {string}		arg_name			View unique name (string)
 * @param {object}		arg_container_obj	JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptContextMenu(arg_name, arg_container_jqo, arg_options)
{
	// INHERIT
	this.has_title_bar = false;
	this.inheritFrom = LibaptView;
	this.inheritFrom(arg_name, arg_container_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptContextMenu';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	/**
	 * @memberof			LibaptContextMenu
	 * @public
	 * @desc				Default options for the menu class
	 */
	var default_options = {
		// ITEMS
		'menu_items': []
	}
	
	// VIEW ATTRIBUTES
	$.extend(this, default_options, get_arg_not_null(arg_options, {}) );
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	/**
	 * @memberof			LibaptContextMenu
	 * @public
	 * @method				check_menu_items()
	 * @desc				Check all menu items format
	 * @return {boolean}	true:success,false:failure
	 */
	this.check_menu_items = function()
	{
		var self = this;
		var context = 'check_menu_items()';
		this.enter(context, '');
		
		
		this.assertNotNull(context, 'menu items', this.menu_items);
		
		for(menu_index in this.menu_items)
		{
			var menu_item_obj = this.menu_items[menu_index];
			
			// CHECK MENU ITEM
			this.assertNotNull(context, 'menu item object', menu_item_obj);
			this.assertNotEmptyString(context, 'menu item name', menu_item_obj.name);
			this.assertNotEmptyString(context, 'menu item label', menu_item_obj.label);
		}
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @memberof			LibaptContextMenu
	 * @public
	 * @method				add_menu_item(arg_menu_item_obj)
	 * @desc				Add a menu item to the object
	 * 						A menu item is an object with this attributes :
	 * 							- name				(string, required)
	 * 							- label				(string, required)
	 * 							- icon_url			(string, optional)
	 * 							- icon_span_css		(string, optional)
	 * 							- icon_name			(string, optional)
	 * 							- action_url		(string, optional)	go to url action
	 * 							- action_cb			(string, optional)	javascript callback action
	 * @param {object}		arg_menu_item_obj		Menu item
	 * @return {boolean}	true:success,false:failure
	 */
	this.add_menu_item = function(arg_menu_item_obj)
	{
		var self = this;
		var context = 'add_menu_item(item)';
		this.enter(context, '');
		
		
		// CHECK MENU ITEM
		this.assertNotNull(context, 'menu item object', arg_menu_item_obj);
		this.assertNotEmptyString(context, 'menu item name', arg_menu_item_obj.name);
		this.assertNotEmptyString(context, 'menu item label', arg_menu_item_obj.label);
		
		// REGISTER ITEM
		this.menu_items.push(arg_menu_item_obj);
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @memberof			LibaptContextMenu
	 * @public
	 * @method				remove_menu_item(arg_menu_item_name)
	 * @desc				Remove a menu item
	 * @param {string}		arg_menu_item_name	Menu item name
	 * @return {boolean}	true:success,false:failure
	 */
	this.remove_menu_item = function(arg_menu_item_name)
	{
		var self = this;
		var context = 'remove_menu_item(menu name)';
		this.enter(context, '');
		
		
		// CHECK MENU ITEM
		this.assertNotEmptyString(context, 'menu item name', arg_menu_item_name);
		
		// LOOP ON ITEMS
		var new_items = [];
		for(menu_index in this.menu_items)
		{
			var menu_item_obj = this.menu_items[menu_index];
			
			if (menu_item_obj.name != arg_menu_item_name)
			{
				new_items.push(menu_item_obj);
			}
		}
		this.menu_items = new_items;
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @memberof			LibaptContextMenu
	 * @public
	 * @method				draw(arg_position_jqo)
	 * @desc				Draw the context menu
	 * @param {object}		arg_position_jqo	JQuery object to set position on
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw = function(arg_position_jqo)
	{
		var self = this;
		var context = 'draw(jqo)';
		self.enter(context, '');
		
		
		// CHECK CONTAINER JQUERY OBJECT
		if ( Libapt.is_null(self.container_jqo) )
		{
			self.container_jqo = $('<div name="' + arg_name + '">');
			self.container_jqo.css('width', 'auto');
			self.container_jqo.css('height', 'auto');
		}
		var container_parent = self.container_jqo.parent()[0];
		if ( Libapt.is_null(container_parent) )
		{
			$('body').append(self.container_jqo);
		}
		self.assertNotNull(context, 'container_jqo', self.container_jqo);
		
		// CREATE THE MENU
		var menu_jqo = $('<ul class="libapt_context_menu"></ul>');
		self.container_jqo.append(menu_jqo);
		
		// FILL THE MENU
		for(menu_item_index in self.menu_items)
		{
			var menu_item	= self.menu_items[menu_item_index];
			self.value(context, 'menu_item', menu_item);
			
			// MENU ITEM ICON
			var icon		= '';
			if ( Libapt.is_string(menu_item.icon_url) )
			{
				icon = '<imag src="' + menu_item.icon_url + '"></img>';
			}
			
			// MENU ITEM CSS
			// var icon_css			= '';
			// if ( Libapt.is_string(menu_item.css) )
			// {
				// icon = '<imag src="' + menu_item.css + '"></img>';
			// }
			
			// MENU ITEM LABEL
			var label		= '';
			if ( Libapt.is_string(menu_item.label) )
			{
				label = menu_item.label;
			}
			
			// MENU ITEM ANCHOR
			var action_url = Libapt.is_string(menu_item.action_url) ? menu_item.action_url : '#';
			var anchor = $('<a href="' + action_url + '">' + label + '</a>');
			
			// MENU ITEM JQO
			var menu_item_jqo = $('<li></li>');
			menu_item_jqo.append(anchor);
			menu_item_jqo.data('menu-item-object', menu_item);
			menu_jqo.append(menu_item_jqo);
		}
		
		// CREATE JQUERY UI MENU
		menu_jqo.menu(
			{
				icons: {},
				select: function(event, ui)
					{
						self.enter(context, 'select');
						
						menu_jqo.hide();
						
						// NO SELECTED ITEM MENU
						if ( Libapt.is_null(ui.item) )
						{
							self.leave(context, 'select: no selected item');
							return;
						}
						
						// GET MENU ITEM OBJECT
						var menu_item_jqo		= ui.item;
						var menu_item_object	= menu_item_jqo.data('menu-item-object');
						self.value(context, 'select: menu_item_object', menu_item_object);
						
						// DO ACTION
						if ( Libapt.is_function(menu_item_object.action_cb) )
						{
							self.step(context, 'select: item callback');
							menu_item_object.action_cb(menu_item_object);
						}
						
						menu_jqo.remove();
						self.container_jqo.remove();
						self.leave(context, 'select');
					}
			}
		);
		menu_jqo.hide();
		
		// SET MENU POSITION
		menu_jqo.css('width', '200px');
		menu_jqo.css('position', 'absolute');
		menu_jqo.css('z-index', '1000');
		if ( ! Libapt.is_null(arg_position_jqo) )
		{
			menu_jqo.position(
				{
					my: "left top",
					of: arg_position_jqo
				}
			);
		}
		
		
		menu_jqo.show();
		self.content_jqo = menu_jqo;
		
		setTimeout(
			function()
			{
				menu_jqo.hide();
				menu_jqo.remove();
			},
			5000
		)
		
		self.leave(context, 'success');
		return true;
	}
	
	
	// CONSTRUCTOR END
	this.check_menu_items();
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptContextMenu, ['LibaptView'], 'Luc BORIES', '2013-08-21', 'Contextual menu view class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_option(LibaptView, {
		name: 'menu_items',
		type: 'array',
		aliases: [],
		default_value: [],
		array_separator: ',',
		array_type: 'Object',
		format: '',
		is_required: true,
		childs: {}
	}
);


