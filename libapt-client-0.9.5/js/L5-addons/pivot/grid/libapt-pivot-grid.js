/**
 * @file        libapt-pivot-grid.js
 * @desc        Pivot grid class
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @public
 * @class				LibaptPivotGrid
 * @desc				Pivot grid class
 * @param {string}		arg_name			View name (string)
 * @param {object}		arg_container_obj	JQuery object to attach the view to (object)
 * @param {object|null}	arg_options			Associative array of options (object or null)
 * @return {nothing}
 */
function LibaptPivotGrid(arg_name, arg_jqo, arg_options)
{
	var self = this;
	
	// INHERIT
	this.inheritFrom = LibaptModelView;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace					= false;
	this.class_name				= 'LibaptPivotGrid';
	var context					= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// INIT OPTIONS
	var init_option_result = Libapt.set_options_values(self, arg_options, false);
	
	
	// INIT PAGER
	this.has_pager				= false;
	this.pager					= null;
	
	
	// AXIS OBJECTS
	this.haxis_object				= null;
	this.vaxis_object				= null;
	
	
	// ORDERED AXIS GROUPS
	this.all_ordered_groups			= {};
	this.all_ordered_groups_names	= [];
	
	
	// RECORDS
	this.records_by_key			= {};
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	/**
	 * @public
	 * @method				get_ordered_groups_names()
	 * @desc				Get all ordered groups names
	 * @return {array}		Array of group names
	 */
	this.get_ordered_groups_names =  function()
	{
		return this.all_ordered_groups_names;
	}
	
	
	/**
	 * @public
	 * @method				get_ordered_groups()
	 * @desc				Get all ordered groups
	 * @return {array}		Array of group
	 */
	this.get_ordered_groups =  function()
	{
		return this.all_ordered_groups;
	}
	
	
	/**
	 * @public
	 * @method				get_ordered_h_groups_names()
	 * @desc				Get horizontal axis ordered groups names
	 * @return {array}		Array of group names
	 */
	this.get_ordered_h_groups_names =  function()
	{
		return this.haxis.fields_names;
	}
	
	
	/**
	 * @public
	 * @method				get_ordered_h_groups_names()
	 * @desc				Get vertical axis ordered groups names
	 * @return {array}		Array of group names
	 */
	this.get_ordered_v_groups_names =  function()
	{
		return this.vaxis.fields_names;
	}
	
	
	
	/**
	 * @public
	 * @method				draw()
	 * @desc				Draw grid
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw = function()
	{
		var self = this;
		var context = 'draw()';
		self.enter(context, '');
		
		
		// FIRE EVENT (BEGIN)
		self.fire_event('draw-begin');
		
		// DRAW TITLE BAR
		self.draw_title_bar();
		
		// INIT OPTIONS
		self.assertTrue(context, 'init axis', self.init_axis() );
		
		// DRAW CONTENT
		self.draw_empty();
		self.adjust_sizes();
		
		// FILL THE GRID ON LOAD IF NEEDED
		if (self.fill_on_load)
		{
			// CREATE AND DRAW PROGRESS WINDOW
			self.progress_window_obj = new LibaptProgressWindow(self.name + '_progress_window', null, null);
			self.progress_window_obj.draw();
			self.progress_window_obj.enter_step('Loading records', 0);
			
			// LOAD CURRENT DATAS
			var ok_cb = [self, self.draw_headers_and_records];
			var ok_cb = function(datas) { self.progress_window_obj.leave_step('Loading records', 10); self.draw_headers_and_records(datas); };
			var ko_cb = function() { self.progress_window_obj.enter_step('Loading records', 0, 'Failed'); };
			var bool_result = self.load_datas(self.model, self.query, null, null, null, ok_cb, ko_cb, false);
			self.assert(context, 'read', bool_result);
		}
		
		// FIRE EVENT (END)
		self.fire_event('draw-end');
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @method				draw()
	 * @desc				Draw grid
	 * @param {array}		arg_records
	 * @return {boolean}	true:success,false:failure
	 */
	this.draw_headers_and_records = function(arg_records)
	{
		var self = this;
		var context = 'draw_headers_and_records(records)';
		self.enter(context, '');
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Starting process', 10);
		
		// INIT PIVOT ORDERED GROUPS
		self.assertTrue(context, 'update_ordered_groups', self.update_ordered_groups());
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Starting process');
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Init members trees', 20);
		
		// INIT PIVOT WITH LOADED RECORDS
		self.init_pivot_with_records(arg_records);
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Init members trees');
		
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.enter_step('Init axis', 30);
		
		// INIT PIVOT AXIS
		self.step(context, 'INIT PIVOT AXIS');
		this.haxis_object.init();
		this.vaxis_object.init();
		
		// UPDATE PROGRESS WINDOW
		self.progress_window_obj.leave_step('Init axis');
		
		
		// TRACE
		self.step(context, 'TRACE PIVOT TREE');
		// console.log(self.mixin_pivot_members_tree);
		
		self.step(context, 'TRACE PIVOT MEMBERS ARRAYS');
		// console.log(self.mixin_pivot_members_array);
		
		self.step(context, 'TRACE V PIVOT TREE');
		// console.log(self.mixin_pivot_members_v_axis_tree);
		
		self.step(context, 'TRACE H PIVOT TREE');
		// console.log(self.mixin_pivot_members_h_axis_tree);
		
		
		// DRAW PIVOT CELLS
		self.step(context, 'DRAW PIVOT CELLS');
		if ( self.progress_window_obj.is_open() )
		{
			self.progress_window_obj.enter_step('Init headers', 50);
			var progress_cb = function()
				{
					self.draw_headers();
					self.progress_window_obj.leave_step('Init headers');
					
					if ( self.progress_window_obj.is_open() )
					{
						var progress_cb = function()
							{
								self.progress_window_obj.append_progress_label_and_value('Fill cells', 70);
								self.draw_records();
								
								// CLOSE PROGRESS WINDOW
								if ( self.progress_window_obj.is_open() )
								{
									var progress_cb = function()
										{
											self.progress_window_obj.close(true);
										};
									window.setTimeout(progress_cb, 3000);
								}
								
							};
						window.setTimeout(progress_cb, 100);
					}
				};
			window.setTimeout(progress_cb, 100);
		}
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	this.refresh_axis = function()
	{
		var self = this;
		var context = 'refresh_axis()';
		self.enter(context, '');
		
		
		self.remove_records();
		self.remove_headers();
		self.draw_headers_and_records(self.mixin_view_model_load_records);
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @desc				Init H and V axis
	 * @return {boolean}	true:success,false:failure
	 */
	this.init_axis = function()
	{
		var context = 'init_axis()';
		this.enter(context, '');
		
		
		if (this.is_h_axis_time)
		{
			self.init_pivot_axis_time_h();
		}
		else
		{
			self.init_pivot_axis();
		}
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @desc				Refresh H and V axis
	 * @return {boolean}	true:success,false:failure
	 */
	this.update_ordered_groups = function()
	{
		var context = 'update_ordered_groups()';
		this.enter(context, '');
		
		
		// INIT ORDERED GROUPS
		this.all_ordered_groups = this.vaxis_object.groups_array.concat(this.haxis_object.groups_array);
		
		// INIT ORDERED FIELDS NAMES
		this.all_ordered_groups_names = [];
		for(group_key in this.all_ordered_groups)
		{
			var group = this.all_ordered_groups[group_key];
			self.step(context, 'append group [' + group.name + ']');
			this.all_ordered_groups_names.push(group.name);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @desc					Edit view settings
	 * @return {boolean}		true:success,false:failure
	 */
	this.edit_settings = function()
	{
		var context = 'edit_settings()';
		this.enter(context, '');
		
		
		// SETTINGS CONTAINER
		var container_jqo = $('<div></div>');
		
		// CREATE SETTINGS EDITOR VIEW
		var grid_editor_options = { has_haxis:true, has_vaxis:true };
		var grid_editor = new LibaptPivotGridEditor(this.name + '_grid_editor', container_jqo, grid_editor_options);
		grid_editor.model_view = this;
		
		// EDIT GRID SETTINGS
		grid_editor.draw();
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @method				to_string_self()
	 * @desc				Get a string dump of the object
	 * @return {string}		String dump
	 */
	this.to_string_self = function()
	{
		return this.to_string_value('model.name', this.model.name)
			// + this.to_string_value('', this.)
			// + this.to_string_value('pivot_cells.length', this.pivot_cells.length)
			;
	}
	
	
	
	/* --------------------------------------------------------------------------------------------- */
	// APPEND MIXIN METHODS
	self.register_mixin(LibaptMixinViewTablePivot);
	self.register_mixin(LibaptMixinViewTableSelect);
	self.register_mixin(LibaptMixinPivotMembers);
	self.register_mixin(LibaptMixinPivotInit);
	self.register_mixin(LibaptMixinPivotInitAxis);
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptPivotGrid, ['LibaptModelView'], 'Luc BORIES', '2013-08-21', 'Pivot table model view class.');


// INTROSPECTION : REGISTER OPTIONS
Libapt.register_cb_option(LibaptPivotGrid, 'cells_render_init',	null, false, []);
var default_render_fill_cb = function (arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_cells_records, arg_container_jqo)
	{
		if ( ! arg_cells_records )
		{
			arg_cells_records = [];
		}
		var str = 'records=' + arg_cells_records.length;
		
		
		arg_container_jqo.attr('title', str);
		arg_container_jqo.text(arg_cells_records.length );
	};
Libapt.register_cb_option(LibaptPivotGrid, 'cells_render_fill',	default_render_fill_cb, false, ['cells_render_fill_js']);
Libapt.register_cb_option(LibaptPivotGrid, 'cells_render_on_click',	null, false, ['cells_render_on_click_js']);




// HORIZONTAL AXIS OPTIONS
Libapt.register_obj_option(LibaptPivotGrid, 'haxis', {}, false, [], null);

// Libapt.register_int_option(LibaptPivotGrid, 'haxis_max_loaded_members',	null, false, []);

Libapt.register_option(LibaptPivotGrid, 
			{
				name: 'haxis.fields_names',
				type: 'Array',
				aliases: [],
				default_value: [],
				array_separator: '|',
				array_type: 'String',
				format: '',
				is_required: true,
				childs: {}
			}
);
Libapt.register_option(LibaptPivotGrid, 
			{
				name: 'haxis.is_sparse',
				type: 'Boolean',
				aliases: [],
				default_value: false,
				array_separator: null,
				array_type: null,
				format: '',
				is_required: false,
				childs: {}
			}
);
Libapt.register_option(LibaptPivotGrid, 
			{
				name: 'haxis.max_members',
				type: 'Integer',
				aliases: [],
				default_value: 1000,
				array_separator: null,
				array_type: null,
				format: '',
				is_required: false,
				childs: {}
			}
);
Libapt.register_option(LibaptPivotGrid,
			{
				name: 'haxis.label',
				type: 'String',
				aliases: [],
				default_value: 'H Axis',
				array_separator: null,
				array_type: null,
				format: '',
				is_required: false,
				childs: {}
			}
);



// VERTICAL AXIS OPTIONS
Libapt.register_obj_option(LibaptPivotGrid, 'vaxis', {}, false, [], null);

// Libapt.register_int_option(LibaptPivotGrid, 'vaxis_max_loaded_members',	null, false, []);

Libapt.register_option(LibaptPivotGrid, 
			{
				name: 'vaxis.fields_names',
				type: 'Array',
				aliases: [],
				default_value: []	,
				array_separator: '|',
				array_type: 'String',
				format: '',
				is_required: true,
				childs: {}
			}
);
Libapt.register_option(LibaptPivotGrid, 
			{
				name: 'vaxis.is_sparse',
				type: 'Boolean',
				aliases: [],
				default_value: false,
				array_separator: null,
				array_type: null,
				format: '',
				is_required: false,
				childs: {}
			}
);
Libapt.register_option(LibaptPivotGrid, 
			{
				name: 'vaxis.max_members',
				type: 'Integer',
				aliases: [],
				default_value: 1000,
				array_separator: null,
				array_type: null,
				format: '',
				is_required: false,
				childs: {}
			}
);
Libapt.register_option(LibaptPivotGrid,
			{
				name: 'vaxis.label',
				type: 'String',
				aliases: [],
				default_value: 'V Axis',
				array_separator: null,
				array_type: null,
				format: '',
				is_required: false,
				childs: {}
			}
);
