/**
 * @file        libapt-grid.js
 * @brief       Grid class
 * @details     ...
 * @see			libapt-model-view.js libapt-view.js libapt-model.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Grid class
 * @param[in]	arg_name			Grid name (string)
 * @param[in]	arg_model			Grid model (object)
 * @param[in]	arg_fields			Grid query attribute : fields (array of string or array of LibaptField or LibaptFieldsSet)
 * @param[in]	arg_filters			Grid query attribute : filters (array of LibaptFilter or LibaptFiltersSet)
 * @param[in]	arg_orders			Grid query attribute : orders (array of LibaptFilter or LibaptFiltersSet)
 * @param[in]	arg_groups			Grid query attribute : groups (array of LibaptFilter or LibaptFiltersSet)
 * @param[in]	arg_slice			Grid query attribute : slice (object)
 * @param[in]	arg_jquery_obj		JQuery object to attach the view to (object)
 * @param[in]	arg_options			Associative array of options (object or null)
 * @return		nothing
 */
function LibaptGrid(arg_name, arg_jqo, arg_options)
{
	// INHERIT
	this.inheritFrom = LibaptModelView;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace				= false;
	this.class_name			= 'LibaptGrid';
	var context				= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// GRID ATTRIBUTES
	this.datas_matrix		= null;
	this.all_groups         = [];
	this.col_groups			= new Object();
	this.row_groups			= new Object();
	this.row_groups_array	= [];
	this.col_groups_array	= [];
	this.cell_measures		= new Object();
	
	this.fill_on_load	= Libapt.to_boolean(this.fill_on_load, true);
	if (this.table_fill_on_load)
	{
		this.fill_on_load	= Libapt.to_boolean(this.table_fill_on_load, true);
	}
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	
	
	/**
	 * @brief		Draw grid
	 * @return		boolean			true:success,false:failure
	 */
	this.draw = function()
	{
		var self = this;
		var context = 'draw()';
		this.enter(context, '');
		
		
		// DRAW TITLE BAR
		this.assert(context, 'draw_title_bar', this.draw_title_bar());
		
		// DRAW INIT
		if (this.draw_init)
		{
			this.assert(context, 'draw_init', this.draw_init() );
		}
		
		// FIL THE GRID
		if (this.fill_on_load)
		{
			this.refresh();
		}
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Refresh grid
	 * @return		boolean			true:success,false:failure
	 */
	this.refresh = function()
	{
		var self = this;
		var context = 'refresh()';
		self.enter(context, '');
		
		
		// FIRE EVENT
		this.fire_event('refresh-begin');
		
		// DO ACTION BEFORE REFRESH
		self.step(context, 'before_refresh');
		if (self.before_refresh)
		{
			self.before_refresh();
		}
		
		// DRAW TOP HEADER
		self.step(context, 'draw_header');
		if (self.draw_header)
		{
			self.assert(context, 'draw_header', self.draw_header() );
		}
		
		// DISABLE TOOLBAR REFRESH ACTION
		self.step(context, 'disble refresh action');
		if (self.edit_toolbar)
		{
			self.edit_toolbar.disable_action('refresh');
		}
		
		// SHOW LOADER
		self.step(context, 'enable loader');
		self.enable_loader();
		
		var ok_cb = function(datas)
			{
				self.enter(context, 'OK CALLBACK');
				
				
				// LOAD DATAS AND UPDATE VIEW
				var fill_result = self.draw_fill_records(datas);
				
				// HIDE LOADER
				self.disable_loader();
				
				// UPDATE PAGER
				if (self.pager)
				{
					self.pager.update_items_count(datas.length);
					self.pager.refresh();
				}
				
				// ENABLE TOOLBAR REFRESH ACTION
				if (self.edit_toolbar)
				{
					self.edit_toolbar.enable_action('refresh');
				}
				
				if (self.after_refresh)
				{
					self.after_refresh();
				}
				
				// ON REFRESH HANDLER
				self.step(context, 'on refresh handler');
				if ( ! Libapt.is_null(self.js_on_refresh) )
				{
					if ( Libapt.is_string(self.js_on_refresh) )
					{
						eval(self.js_on_refresh);
					}
					else if ( Libapt.is_function(self.js_on_refresh) )
					{
						self.js_on_refresh();
					}
				}
				
				// UPDATE SIZES
				self.adjust_sizes();
				
				// FIRE EVENT
				self.fire_event('refresh-end');
				
				
				self.leave(context, 'OK CALLBACK');
				return fill_result;
			};
		
		var ko_cb = function()
			{
				self.enter(context, 'KO CALLBACK');
				
				
				// DISABLE LOADER
				self.disable_loader();
				
				// ENABLE TOOLBAR REFRESH ACTION
				if (self.edit_toolbar)
				{
					self.edit_toolbar.enable_action('refresh');
				}
				
				// FIRE EVENT
				self.fire_event('refresh-error');
				
				
				self.leave(context, 'KO CALLBACK');
				return false;
			};
		
		// READ DATAS
		self.step(context, 'read datas');
		var bool_result = self.model.read(self.query, ok_cb, ko_cb);
		self.assert(context, 'read', bool_result);
		
		// DRAW BOTTOM FOOTER
		self.step(context, 'draw_footer');
		if (self.draw_footer)
		{
			self.assert(context, 'draw_footer', self.draw_footer() );
		}
		
		// ADJUST SIZE
		self.adjust_sizes();
		
		self.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw initialisation
	 * @return		boolean			true:success,false:failure
	 */
/*	this.draw_init = function()
	{
		var context = 'draw_init()';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return true;
	}*/
	
	
	/**
	 * @brief		Fill with records
	 * @param[in]	arg_records		Datas records (array of associative arrays)
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_fill_records = function(arg_records)
	{
		var context = 'draw_fill_records(records)';
		this.enter(context, '');
		
		
		// FIRE EVENT
		this.fire_event('draw-fill-records-begin');
		
		if (this.draw_fill_records_self)
		{
			var result = this.draw_fill_records_self(arg_records);
			this.leave(context, 'success');
			return result;
		}
		
		// REMOVE ALL DATAS ROWS
		this.table_body_jqo.find('tr').remove();
		
		this.datas_records = arg_records;
		this.assertNotNull(context, 'datas_records', this.datas_records);
		for(var record_index = 0 ; record_index < this.datas_records.length ; record_index++)
		{
			var record = this.datas_records[record_index];
			this.assertNotNull(context, 'record[' + record_index + ']', record);
			this.assert(context, 'draw_row', this.draw_row(record_index, record) );
		}
		
		this.adjust_sizes();
		this.fire_event('filled');
		
		// FIRE EVENT
		this.fire_event('draw-fill-records-end');
		
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Draw grid header
	 * @return		boolean			true:success,false:failure
	 */
/*	this.draw_header = function()
	{
		var context = 'draw_header()';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return true;
	}*/
	
	
	/**
	 * @brief		Draw grid row
	 * @param[in]	arg_row_index	row index
	 * @param[in]	arg_row_record	row values record
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_row = function(arg_row_index, arg_row_record)
	{
		var context = 'draw_row(arg_row_index, arg_row_record)';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return true;
	}
	
	
	/**
	 * @brief		Draw grid footer
	 * @return		boolean			true:success,false:failure
	 */
/*	this.draw_footer = function()
	{
		var context = 'draw_footer()';
		this.enter(context, '');
		
		
		this.leave(context, 'not implemented');
		return true;
	}*/
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return
			this.to_string_value('all_groups', this.all_groups)
			;
	}
}

Libapt.register_inheritance(LibaptGrid, LibaptModelView);





/**
 * @brief		Grid class unit tests
 * @return		nothing
 */
LibaptGrid.tu_profiles_users_1 = function()
{
	trace_separator(LIBAPT_MODELS_MODEL_TRACE_TU);
	console.log('LibaptGrid.tu_profiles_users_1: MODEL_AUTH_PROFILE_USERS : grid cols=profile cols=roles cell=count');
	
	// GET MODEL
	var model = LibaptModels.get('MODEL_AUTH_PROFILE_USERS');
	
	// CREATE MEASURES
	var measure1_cb = function(arg_grid, arg_cell_records)
		{
			var result = 0;
			for(record_index in arg_cell_records)
			{
				var record = arg_cell_records[record_index];
				result += record['id_profile_user'];
			}
			return result;
		};
	
	
	// CREATE VIEW
	var view_options =
		{
			'model': model,
			'query_fields':['id_profile_user', 'profile', 'login']
		};
	var view_jqo = $('.row:eq(1)');
	var view = new LibaptGrid('grid_1', view_jqo, view_options);
	view.add_col_group('profile', 'Profile');
	view.add_row_group('login');
	view.add_cell_measure('measure_1', 'id_profile_user', 'Measure 1', measure1_cb);
	
	// DRAW VIEW
	view.draw( $('.row:eq(1)') );
}
