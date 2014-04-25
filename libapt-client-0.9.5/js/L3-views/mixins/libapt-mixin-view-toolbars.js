/**
 * @file        libapt-mixin-view-toolbars.js
 * @desc        Mixin of view toolbars operations
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinToolbars
 * @public
 * @desc				Mixin of view toolbars operations
 */
var LibaptMixinToolbars =
{
	/**
	 * @memberof			LibaptMixinToolbars
	 * @public
	 * @desc				Enable/disable trace for toolbars operations
	 */
	mixin_view_toolbars_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinToolbars
	 * @public
	 * @desc				Toolbars array for the view. A toolbar is an object of LibaptToolbar.
	 */
	mixin_view_toolbars_array: [],
	
	
	
	/**
	 * @memberof			LibaptMixinToolbars
	 * @public
	 * @desc				Init toolbars with settings
	 * @param {object}		arg_settings		view settings
	 * @return {boolean}	true:success,false:failure
	 */
	init_toolbars: function(arg_settings)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'init_toolbars(toolbar_obj)';
		self.enter(context, '');
		
		
		// INIT OPTION: HAS TOOLBAR PAGER
		if (self.is_model_view)
		{
			self.has_toolbar_pager			= Libapt.to_boolean(arg_settings.has_toolbar_pager, true);
		}
		
		// INIT OPTION: HAS TOOLBAR CRUD
		if (self.is_model_view)
		{
			self.has_toolbar_crud			= Libapt.to_boolean(arg_settings.has_toolbar_crud, true);
			self.has_toolbar_crud_refresh	= Libapt.to_boolean(arg_settings.has_toolbar_crud_refresh, true) && self.model.access.refresh;
			self.has_toolbar_crud_create	= Libapt.to_boolean(arg_settings.has_toolbar_crud_create, true) && self.model.access.create;
			self.has_toolbar_crud_update	= Libapt.to_boolean(arg_settings.has_toolbar_crud_update, true) && self.model.access.update;
			self.has_toolbar_crud_delete	= Libapt.to_boolean(arg_settings.has_toolbar_crud_delete, true) && self.model.access['delete'];
		}
		
		// INIT OPTION: HAS TOOLBAR EXPORT
		if (self.is_model_view)
		{
			self.has_toolbar_export			= Libapt.to_boolean(arg_settings.has_toolbar_export, true);
			self.has_toolbar_export_csv		= Libapt.to_boolean(arg_settings.has_toolbar_export_csv, true);
			self.has_toolbar_export_html	= Libapt.to_boolean(arg_settings.has_toolbar_export_html, true);
			self.has_toolbar_export_jpeg	= Libapt.to_boolean(arg_settings.has_toolbar_export_jpeg, true);
			self.has_toolbar_export_png		= Libapt.to_boolean(arg_settings.has_toolbar_export_png, true);
			self.has_toolbar_export_bmp		= Libapt.to_boolean(arg_settings.has_toolbar_export_bmp, true);
			self.has_toolbar_export_print	= Libapt.to_boolean(arg_settings.has_toolbar_export_print, false);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinToolbars
	 * @desc				Add a new toolbar object to the current view
	 * @param {object}		arg_toolbar_obj			toolbar object
	 * @return {boolean}	true:success,false:failure
	 */
	add_toolbar: function(arg_toolbar_obj)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'add_toolbar(toolbar_obj)';
		self.enter(context, '');
		
		// CHECK TOOLBAR OBJECT
		self.assertNotNull(context, 'toolbar', arg_toolbar_obj);
		self.assertNotEmptyString(context, 'toolbar.name', arg_toolbar_obj.name);
		self.assertNotEmptyString(context, 'toolbar.label', arg_toolbar_obj.label);
		
		// REGISTER TOOLBAR
		self.mixin_view_toolbars_array.push(arg_toolbar_obj);
		self.value(context, 'toolbar', arg_toolbar_obj.to_string());
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinToolbars
	 * @public
	 * @desc				Remove an existing toolbar to the current view
	 * @param {string}		arg_toolbar_name			toolbar name
	 * @return {boolean}	true:success,false:failure
	 */
	remove_toolbar: function(arg_toolbar_name)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'remove_toolbar(toolbar name)';
		self.enter(context, '');
		
		// CHECK TOOLBAR NAME
		self.assertNotEmptyString(arg_toolbar_name);
		
		// UNREGISTER TOOLBAR
		var new_toolbars = [];
		for(toolbar_index in self.mixin_view_toolbars_array)
		{
			var toolbar_obj = self.mixin_view_toolbars_array[toolbar_index];
			if (toolbar_obj.name != arg_toolbar_name)
			{
				new_toolbars.push(toolbar_obj);
			}
		}
		self.mixin_view_toolbars_array = new_toolbars;
		self.value(context, 'toolbar name', arg_toolbar_name);
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinToolbars
	 * @public
	 * @desc				Get an existing toolbar by its name
	 * @param {string}		arg_toolbar_name			toolbar name
	 * @return {object}		toolbar object
	 */
	get_toolbar: function(arg_toolbar_name)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'get_toolbar(toolbar_name)';
		self.enter(context, '');
		
		// CHECK TOOLBAR NAME
		self.assertNotEmptyString(arg_toolbar_name);
		self.value(context, 'arg_toolbar_name', arg_toolbar_name);
		
		// LOOP ON TOOLBARS
		for(toolbar_index in self.mixin_view_toolbars_array)
		{
			var toolbar_obj = self.mixin_view_toolbars_array[toolbar_index];
			if (toolbar_obj.name == arg_toolbar_name)
			{
				self.leave(context, 'found');
				self.pop_trace();
				return toolbar_obj;
			}
		}
		
		self.leave(context, 'not found');
		self.pop_trace();
		return null;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinToolbars
	 * @public
	 * @desc					Create a contextual menu of the toolbars
	 * @param {object|null}		arg_jqo			jQuery container object
	 * @return {object}			Toolbars menu object
	 */
	create_toolbars_menu: function(arg_name, arg_jqo, arg_options)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'create_toolbars_menu()';
		self.enter(context, '');
		
		
		// CREATE THE MENU VIEW
		var menu = new LibaptContextMenu(arg_name, arg_jqo, arg_options);
		
		// LOOP ON TOOLBARS
		for(toolbar_index in self.mixin_view_toolbars_array)
		{
			var toolbar_view_object = self.mixin_view_toolbars_array[toolbar_index];
			if (toolbar_view_object && toolbar_view_object.is_enabled)
			{
				var item_name	= toolbar_view_object.name;
				var item_label	= Libapt.is_null(toolbar_view_object.label) ? item_name : toolbar_view_object.label;
				var item_cb		= function(arg_menu_item_obj) { self.on_toggle_toolbar(arg_menu_item_obj.name); };
				var prefix		= toolbar_view_object.is_visible() ? self.translate('Hide') : self.translate('Show');
				
				var menu_item_obj = {name:item_name, label:prefix + ' ' + item_label, action_cb:item_cb };
				// console.log(menu_item_obj);
				menu.add_menu_item(menu_item_obj);
			}
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return menu;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinToolbars
	 * @public
	 * @desc					Create a toolbar with pager operations
	 * @param {object|null}		arg_toolbar_container_jqo	jQuery container object
	 * @param {object|null}		arg_toolbar_options			toolbar options object
	 * @param {object|null}		arg_actions_options			action options object
	 * @return {object}			Toolbars menu object
	 */
	create_toolbar_pager: function(arg_toolbar_container_jqo, arg_toolbar_options, arg_actions_options)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'create_toolbar_pager(jqo,toolbar_options,actions_options)';
		self.enter(context, '');
		
		
		// CHECK IF ENABLED
		if (! self.has_toolbar_pager)
		{
			self.leave(context, 'success');
			return null;
		}
		
		// CHECK PAGER
		if ( ! self.pager )
		{
			self.leave(context, 'the model view has no pager');
			return true;
		}
		var pager = self.pager;
		
		// CREATE TOOLBAR
		var toolbar = new LibaptToolbar(self.name + '_pager_toolbar', arg_toolbar_container_jqo, arg_toolbar_options);
		toolbar.label = 'Pager toolbar';
		
		// CREATE ACTIONS
		var action1 = new LibaptActionPagerPages('pager_pages',  self, arg_actions_options);
		var action2 = new LibaptActionPagerSizes('pager_sizes',  self, arg_actions_options);
		toolbar.add_action(action1);
		toolbar.add_action(action2);
		
		// ADD EVENT LISTENER
		pager.add_event_callback('pager-size-changed', [action1, action1.update_button_label]);
		
		// REGISTER TOOLBAR
		self.add_toolbar(toolbar);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return toolbar;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinToolbars
	 * @public
	 * @desc					Create a toolbar with CRUD operations
	 * @param {object|null}		arg_toolbar_container_jqo	jQuery container object
	 * @param {object|null}		arg_toolbar_options			toolbar options object
	 * @param {object|null}		arg_actions_options			action options object
	 * @return {object}			Toolbars menu object
	 */
	create_toolbar_crud: function(arg_toolbar_container_jqo, arg_toolbar_options, arg_actions_options)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'create_toolbar_crud(jqo,toolbar_options,actions_options)';
		self.enter(context, '');
		
		
		// CHECK IF ENABLED
		if (! self.has_toolbar_crud)
		{
			self.leave(context, 'success');
			return null;
		}
		
		
		// CREATE TOOLBAR
		var toolbar = new LibaptToolbar(self.name + '_edit_toolbar', arg_toolbar_container_jqo, arg_toolbar_options);
		toolbar.label = 'Edit toolbar';
		
		if (self.has_toolbar_crud_refresh)
		{
			var action2 = new LibaptCrudAction('refresh', self, 'refresh', arg_actions_options);
			toolbar.add_action(action2);
		}
		
		if (self.is_editable)
		{
			if (self.has_toolbar_crud_create)
			{
				var action1 = new LibaptCrudAction('create',  self, 'create',  arg_actions_options);
				toolbar.add_action(action1);
			}
			
			if (self.has_toolbar_crud_update)
			{
				var action3 = new LibaptCrudAction('update',  self, 'update',  arg_actions_options);
				toolbar.add_action(action3);
			}
			
			if (self.has_toolbar_crud_delete)
			{
				var action4 = new LibaptCrudAction('delete',  self, 'delete',  arg_actions_options);
				toolbar.add_action(action4);
			}
		}
		
		// REGISTER TOOLBAR
		self.add_toolbar(toolbar);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return toolbar;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinToolbars
	 * @public
	 * @desc					Create a toolbar with export operations
	 * @param {object|null}		arg_toolbar_container_jqo	jQuery container object
	 * @param {object|null}		arg_toolbar_options			toolbar options object
	 * @param {object|null}		arg_actions_options			action options object
	 * @return {object}			Toolbars menu object
	 */
	create_toolbar_export: function(arg_toolbar_container_jqo, arg_toolbar_options, arg_actions_options)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'create_toolbar_export(jqo,toolbar_options,actions_options)';
		self.enter(context, '');
		
		
		// CHECK IF ENABLED
		if ( ! self.has_toolbar_export)
		{
			self.leave(context, 'success');
			return null;
		}
		
		
		// CREATE TOOLBAR
		var toolbar = new LibaptToolbar(self.name + '_export_toolbar', arg_toolbar_container_jqo, arg_toolbar_options);
		toolbar.label = 'Export toolbar';
		
		if (self.has_toolbar_export_csv)
		{
			var action_csv = new LibaptActionExportCSV('export_CSV', self, arg_actions_options);
			toolbar.add_action(action_csv);
		}
		
		if (self.has_toolbar_export_html)
		{
			var action_html = new LibaptActionExportHTML('export_HTML', self, arg_actions_options);
			toolbar.add_action(action_html);
		}
		
		
		if ( Libapt.is_null(arg_actions_options) )
		{
			arg_actions_options = {};
		}
		
		
		if (self.has_toolbar_export_jpeg)
		{
			arg_actions_options.image_format = 'jpeg';
			var action_image1 = new LibaptActionExportImage('export_Image1', self, arg_actions_options);
			toolbar.add_action(action_image1);
		}
		
		if (self.has_toolbar_export_bmp)
		{
			arg_actions_options.image_format = 'bmp';
			var action_image2 = new LibaptActionExportImage('export_Image2', self, arg_actions_options);
			toolbar.add_action(action_image2);
		}
		
		if (self.has_toolbar_export_png)
		{
			arg_actions_options.image_format = 'png';
			var action_image3 = new LibaptActionExportImage('export_Image3', self, arg_actions_options);
			toolbar.add_action(action_image3);
		}
		
		arg_actions_options.image_format = null;
		
		if (self.has_toolbar_export_print)
		{
			var action_print = new LibaptActionExportPrint('export_Print', self, arg_actions_options);
			toolbar.add_action(action_print);
		}
		
		// REGISTER TOOLBAR
		self.add_toolbar(toolbar);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return toolbar;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinToolbars
	 * @public
	 * @desc					On toggle toolbar event
	 * @param {object|string}	arg_toolbar					toolbar object or name
	 * @return {boolean}		true:success,false:failure
	 */
	on_toggle_toolbar: function(arg_toolbar)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_toolbars_trace);
		var context = 'on_toggle_toolbar(toolbar)';
		self.enter(context, '');
		
		
		// ON CHANGE HANDLER
		if ( Libapt.is_string(arg_toolbar) )
		{
			arg_toolbar = self.get_toolbar(arg_toolbar);
		}
		
		// TOGGLE TOOLBAR
		if ( Libapt.is_object(arg_toolbar) )
		{
			self.step(context, 'toogle toolbar');
			arg_toolbar.toggle_visible();
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	}
};
