/**
 * @file        libapt-pivot-grid.js
 * @desc        Pivot grid class
 * @see			libapt-model.js libapt-fieldsset.js libapt-field.js
 * @ingroup     LIBAPT_MAIN_JS
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
	this.inheritFrom = LibaptGridTable;
	this.inheritFrom(arg_name, arg_jqo, arg_options);
	
	// CONSTRUCTOR BEGIN
	this.trace					= false;
	this.class_name				= 'LibaptPivotGrid';
	var context					= this.class_name + '(' + arg_name + ')';
	this.enter(context, 'constructor');
	
	
	// INIT PAGER
	this.has_pager				= false;
	this.pager					= null;
	
	// PIVOT GRID ATTRIBUTES
	this.table_cells_jqo_by_key	= {};
	this.table_cells_pos_by_key	= {};
	
	this.haxis_object			= null;
	this.vaxis_object			= null;
	this.all_ordered_groups		= {};
	
	this.records_by_key			= {};
	// this.positions_array		= [];
	// this.positions_by_key		= {};
	
	// INIT OPTION : H AXIS MAX MEMBERS
	this.haxis_max_members = Libapt.to_number(this.haxis_max_members, null);
	
	// INIT OPTION : V AXIS MAX MEMBERS
	this.vaxis_max_members = Libapt.to_number(this.vaxis_max_members, null);
	
	
	// INIT OPTION : H AXIS MAX LOADED MEMBERS
	// this.haxis_max_loaded_members = Libapt.to_number(this.haxis_max_loaded_members, null);
	
	// INIT OPTION : V AXIS MAX LOADED MEMBERS
	// this.vaxis_max_loaded_members = Libapt.to_number(this.vaxis_max_loaded_members, null);
	
	
	// INIT OPTION : H AXIS IS SPARSE
	this.haxis_is_sparse = Libapt.to_boolean(this.haxis_is_sparse, false);
	
	// INIT OPTION : H AXIS IS SPARSE
	this.vaxis_is_sparse = Libapt.to_boolean(this.vaxis_is_sparse, false);
	
	// INIT OPTION : FILL CELL RENDER
	if ( ! Libapt.is_function(this.cells_render_init) )
	{
		if ( Libapt.is_string(this.cells_render_fill_js) )
		{
			this.cells_render_fill = function (arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_cells_records, arg_container_jqo)
				{
					eval(self.cells_render_fill_js);
				};
		}
		else
		{
			this.cells_render_fill = function (arg_pivot_grid_obj, arg_haxis_values, arg_vaxis_values, arg_cells_records, arg_container_jqo)
				{
					if ( ! arg_cells_records )
					{
						arg_cells_records = [];
					}
					var str = 'records=' + arg_cells_records.length;
					
					
					arg_container_jqo.attr('title', str);
					arg_container_jqo.text(arg_cells_records.length );
				};
		}
	}
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	/**
	 * @public
	 * @desc				Init H and V axis
	 * @return {boolean}	true:success,false:failure
	 */
	this.init_axis = function()
	{
		var context = 'init_axis()';
		this.enter(context, '');
		
		
		// INIT ALREADY PROCESSED
		if (this.haxis_object && this.vaxis_object)
		{
			this.leave(context, 'init already processed');
			return;
		}
		
		// GET PIVOT AXIS ATTRIBUTES
		var haxis_label		= get_arg_not_null(this.haxis_label, 'Horizontal Axis');
		var vaxis_label		= get_arg_not_null(this.vaxis_label, 'Vertical Axis');
		
		// CREATE PIVOT AXIS
		this.haxis_object	= new LibaptPivotAxis(arg_name + '_haxis', haxis_label, [], this);
		this.vaxis_object	= new LibaptPivotAxis(arg_name + '_vaxis', vaxis_label, [], this);
		
		// INIT AXIS GROUPS
		var haxis_fields	= get_arg_not_null(this.haxis_fields, []);
		var vaxis_fields	= get_arg_not_null(this.vaxis_fields, []);
		
		// TODO CHECK IF AXIS FIELDS ARE QUERY FIELDS
		
		
		// SET ATTRIBUTES
		/*if ( Libapt.is_numeric(this.haxis_max_loaded_members) )
		{
			this.step(context, 'set H axis max members [' + this.haxis_max_loaded_members + ']');
			this.haxis_object.max_members_count = this.haxis_max_loaded_members;
		}
		if ( Libapt.is_numeric(this.vaxis_max_loaded_members) )
		{
			this.step(context, 'set V axis max members [' + this.vaxis_max_loaded_members + ']');
			this.vaxis_object.max_members_count = this.vaxis_max_loaded_members;
		}*/
		if ( Libapt.is_numeric(this.haxis_max_members) )
		{
			this.step(context, 'set H axis max members [' + this.haxis_max_members + ']');
			this.haxis_object.max_members_count = this.haxis_max_members;
		}
		if ( Libapt.is_numeric(this.vaxis_max_members) )
		{
			this.step(context, 'set V axis max members [' + this.vaxis_max_members + ']');
			this.vaxis_object.max_members_count = this.vaxis_max_members;
		}
		
		if ( Libapt.is_boolean(this.haxis_is_sparse) )
		{
			this.step(context, 'set H axis is sparse');
			this.haxis_object.is_sparse = this.haxis_is_sparse;
		}
		if ( Libapt.is_boolean(this.vaxis_is_sparse) )
		{
			this.step(context, 'set V axis is sparse');
			this.vaxis_object.is_sparse = this.vaxis_is_sparse;
		}
		
		// FILL FIELDS FOR H AXIS
		if (haxis_fields.length == 0)
		{
			this.step(context, 'H axis has no fields');
			
			if ( Libapt.is_string(this.haxis_fields_names) )
			{
				this.haxis_fields_names = this.haxis_fields_names.split(',');
			}
			
			var haxis_fields_names	= get_arg_not_null(this.haxis_fields_names, []);
			
			for(haxis_field_name_index in haxis_fields_names)
			{
				var haxis_field_name = haxis_fields_names[haxis_field_name_index];
				this.value(context, 'haxis_field_name', haxis_field_name);
				this.haxis_object.add_group( this.query.fields_set.get_field(haxis_field_name) );
			}
		}
		
		// FILL FIELDS FOR V AXIS
		if (vaxis_fields.length == 0)
		{
			this.step(context, 'V axis has no fields');
			
			if ( Libapt.is_string(this.vaxis_fields_names) )
			{
				this.vaxis_fields_names = this.vaxis_fields_names.split(',');
			}
			
			var vaxis_fields_names	= get_arg_not_null(this.vaxis_fields_names, []);
			
			for(vaxis_field_name_index in vaxis_fields_names)
			{
				var vaxis_field_name = vaxis_fields_names[vaxis_field_name_index];
				this.value(context, 'vaxis_field_name', vaxis_field_name);
				this.vaxis_object.add_group( this.query.fields_set.get_field(vaxis_field_name) );
			}
		}
		
		
		// REMOVE FIELD IN MORE THAN ONE AXIS
		for(haxis_group_index in this.haxis_object.groups_array)
		{
			var group = this.haxis_object.groups_array[haxis_group_index];
			var vaxis_group_index = this.vaxis_object.groups_array.indexOf(group);
			if (vaxis_group_index >= 0)
			{
				this.vaxis_object.remove_group(group);
			}
		}
		
		this.assertTrue(context, 'refresh_axis', this.refresh_axis());
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @public
	 * @desc				Refresh H and V axis
	 * @return {boolean}	true:success,false:failure
	 */
	this.refresh_axis = function()
	{
		var context = 'refresh_axis()';
		this.enter(context, '');
		
		// INIT AXIS POSITIONS
		this.haxis_object.init();
		this.vaxis_object.init();
		
		// INIT ORDERED FIELDS
		this.all_ordered_groups = this.haxis_object.groups_array.concat(this.vaxis_object.groups_array).sort(
			function(group1, group2)
			{
				return group1.field.name < group2.field.name ? -1 : (group1.field.name == group2.field.name ? 0 : 1);
			}
		);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	this.init_records_by_key = function(arg_records)
	{
		var context = 'init_records_by_key(records)';
		this.enter(context, '');
		
		// INIT TABLE
		$('th.libapt-pivot-grid-header', self.table_head_jqo).each(
			function(index, item)
			{
				var th_jqo = $(item);
				// th_jqo.data('records', []);
				th_jqo.data('records-count', 0);
			}
		);
		$('td.libapt-pivot-grid-cell', this.table_body_jqo).each(
			function(index, item)
			{
				var td_jqo = $(item);
				
				td_jqo.data('records', []);
				td_jqo.data('records-count', 0);
			}
		);
		
		// INIT RECORDS BY KEY
		this.records_by_key = {};
		for(record_index in arg_records)
		{
			var record = arg_records[record_index];
			// this.value(context, 'record', record);
			
			var hvkey = LibaptPivotGridPosition.get_position_key(this.all_ordered_groups, record);
			// this.value(context, 'hvkey', hvkey);
			
			// INIT RECORDS ARRAY IF NEEDED
			if ( ! Libapt.is_array(this.records_by_key[hvkey]) )
			{
				this.records_by_key[hvkey] = [];
			}
			
			// REGISRER RECORDS FOR THE CURRENT KEY
			this.records_by_key[hvkey].push(record);
			// this.value(context, 'hv record for key[' + hvkey + ']', this.records_by_key[hvkey].length);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	this.draw_header = function()
	{
		var self = this;
		var context = 'draw_header()';
		this.enter(context, '');
		
		
		// REMOVE ALL TABLE HEADERS
		self.table_head_jqo.find('th').remove();
		
		// REMOVE ALL DATAS ROWS
		self.table_body_jqo.find('tr').remove();
		
		this.init_axis();
		
		var render = new LibaptPivotTableRender(this);
		render.render_table_head(this.table_head_jqo, this.haxis_object, this.vaxis_object);
		render.render_table_body(this.table_body_jqo, this.haxis_object, this.vaxis_object, this.cells_render);
		
		// console.log(this);
		this.assertTrue(context, 'init grid positions', LibaptPivotGridPosition.init_grid_positions(this) );
		
		// console.log(this.table_body_jqo);
		
		
		if ( Libapt.is_function(this.headers_render_init) )
		{
			$('th', self.table_head_jqo).each(
				function(index, item)
				{
					var th_jqo = $(item);
					self.headers_render_init(self, th_jqo);
				}
			);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Fill with records
	 * @param[in]	arg_records		Datas records (array of associative arrays)
	 * @return		boolean			true:success,false:failure
	 */
	this.draw_fill_records_self = function(arg_records)
	{
		var self = this;
		var context = 'draw_fill_records_self(records)';
		self.enter(context, '');
		
		
		self.assertTrue(context, 'init_records_by_key', self.init_records_by_key(arg_records));
		
		// INIT ALL CELLS
		if ( Libapt.is_function(self.cells_render_init) )
		{
			self.step(context, 'cells_render_init found');
			$('td.libapt-pivot-grid-cell', self.table_body_jqo).each(
				function(index, item)
				{
					self.value(context, 'loop on td index', index);
					var td_jqo = $(item);
					
					var position = td_jqo.data('grid-position');
					self.assertNotNull(context, 'td position', position);
					
					var current_vmembers = position.ordered_axis_positions[0].get_values();
					var current_hmembers = position.ordered_axis_positions[1].get_values();
					self.cells_render_init(self, current_hmembers, current_vmembers, td_jqo);
				}
			);
		}
		else
		{
			self.step(context, 'cells_render_init not found');
		}
		
		// UPDATE FILLED CELLS
		self.step(context, 'Update filled cells');
		for(hvkey in self.records_by_key)
		{
			// self.value(context, 'loop hvkey', hvkey);
			
			var td_jqo = self.table_cells_jqo_by_key[hvkey];
			if ( Libapt.is_null(td_jqo) )
			{
				self.value(context, 'no cell for hvkey', hvkey);
				continue;
			}
			self.assertNotNull(context, 'td_jqo', td_jqo);
			
			var cell_records = self.records_by_key[hvkey];
			
			self.step(context, 'fill cell for key[' + hvkey + '] with [' + cell_records.length + '] records');
			self.assertTrue(context, 'fill cell for key[' + hvkey + ']', self.set_cell_data(td_jqo, cell_records, true) );
		}
		
		
		// SPARSE H AXIS
		if (self.haxis_object.is_sparse)
		{
			self.step(context, 'H axis is sparse');
			$('th', self.table_head_jqo).each(
				function(index, th)
				{
					self.value(context, 'loop on th', index);
					var th_jqo = $(th);
					if ( index >= self.vaxis_object.groups_array.length && (! th_jqo.data('records-count') || th_jqo.data('records-count') == 0) )
					{
						var th_index = th_jqo.index();
						$('td:eq(' + th_index + ')', self.table_body_jqo).each(
							function(td_index, td)
							{
								// self.value(context, 'loop on td', td_index);
								$(td).hide();
							}
						);
						th_jqo.hide();
					}
				}
			);
		}
		
		// SPARSE V AXIS
		if (self.vaxis_object.is_sparse)
		{
			self.step(context, 'V axis is sparse');
			$('tr', self.table_body_jqo).each(
				function(tr_index, tr)
				{
					var tr_jqo = $(tr);
					if (tr_jqo.data('records-count') == 0)
					{
						tr_jqo.hide();
					}
				}
			);
		}
		
		self.leave(context, 'success');
		return true;
	}
	
	
	this.empty_cell_data = function(arg_td_jqo, arg_should_render)
	{
		var context = 'empty_cell_data(td,render?)';
		this.enter(context, '');
		
		var td_jqo = arg_td_jqo;
		var cell_records = td_jqo.data('records');
		// var cell_records = td_jqo.data('records-count');
		
		
		// UPDATE VERTICAL COUNT
		var tr_jqo		= $( td_jqo.parent()[0] );
		var tr_count	= tr_jqo.data('records-count');
		tr_count		-= cell_records.length;
		tr_jqo.data('records-count', tr_count > 0 ? tr_count : 0);
		
		// VERTICAL AXIS IS SPARSE
		if (this.vaxis_object.is_sparse && tr_count == 0)
		{
			tr_jqo.hide();
		}
		else
		{
			tr_jqo.show();
		}
		
		// UPDATE HORIZONTAL COUNT
		var td_index	= td_jqo.index();
		var tr_jqo		= this.table_head_jqo.children().last();
		var th_jqo		= tr_jqo.children().eq(td_index);
		var cols_records_count = th_jqo.data('records-count');
		cols_records_count -= cell_records.length;
		th_jqo.data('records-count', cols_records_count > 0 ? cols_records_count : 0);
		
		
		// HORIZONTAL AXIS IS SPARSE
		if (this.haxis_object.is_sparse && cols_records_count == 0)
		{
			th_jqo.hide();
			this.table_body_jqo.children('tr').find('td[index="'+td_index + '"]').hide();
		}
		else
		{
			th_jqo.show();
			this.table_body_jqo.children('tr').find('td[index="'+td_index + '"]').show();
		}
		
		// RESET RECORDS DATAS
		td_jqo.data('records', []);
		td_jqo.data('records-count', 0);
		
		// RENDER CELL
		if ( arg_should_render && Libapt.is_function(this.cells_render_fill) )
		{
			var position = this.table_cells_pos_by_key[hvkey];
			this.assertNotNull(context, 'position', position);
			
			var current_vmembers = position.ordered_axis_positions[0].get_values();
			var current_hmembers = position.ordered_axis_positions[1].get_values();
			this.assertNotNull(context, 'current_vmembers', current_vmembers);
			this.assertNotNull(context, 'current_hmembers', current_hmembers);
		
			this.cells_render_fill(this, current_hmembers, current_vmembers, null, td_jqo);
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	this.set_cell_data = function(arg_td_jqo, arg_records, arg_should_render)
	{
		var context = 'set_cell_data(td,records,render?)';
		this.enter(context, '');
		
		var td_jqo = arg_td_jqo;
		var cell_records = arg_records;
		this.assertNotNull(context, 'records', arg_records);
		
		td_jqo.data('records', cell_records);
		td_jqo.data('records-count', cell_records.length);
		
		// UPDATE VERTICAL COUNT
		var tr_jqo		= $( td_jqo.parent()[0] );
		var tr_count	= tr_jqo.data('records-count');
		tr_count		+= cell_records.length;
		tr_jqo.data('records-count', tr_count);
		// console.log(tr_jqo);
		
		// VERTICAL AXIS IS SPARSE
		if (this.vaxis_object.is_sparse && tr_count == 0)
		{
			tr_jqo.hide();
		}
		else
		{
			tr_jqo.show();
		}
		
		// UPDATE HORIZONTAL COUNT
		var td_index	= td_jqo.index();
		this.value(context, 'td_index', td_index);
		
		var tr_jqo		= this.table_head_jqo.children().last();
		var th_jqo		= tr_jqo.children().eq(td_index);
		var cols_records_count = th_jqo.data('records-count');
		cols_records_count += cell_records.length;
		th_jqo.data('records-count', cols_records_count);
		this.value(context, 'cols_records_count', cols_records_count);
		
		// HORIZONTAL AXIS IS SPARSE
		if (this.haxis_object.is_sparse && cols_records_count == 0)
		{
			th_jqo.hide();
			this.table_body_jqo.children('tr').find('td[index="'+td_index + '"]').hide();
		}
		else
		{
			th_jqo.show();
			this.table_body_jqo.children('tr').find('td[index="'+td_index + '"]').show();
		}
		
		// RENDER CELL
		if ( arg_should_render && Libapt.is_function(this.cells_render_fill) )
		{
			var position = this.table_cells_pos_by_key[hvkey];
			this.assertNotNull(context, 'position', position);
			
			var current_vmembers = position.ordered_axis_positions[0].get_values();
			var current_hmembers = position.ordered_axis_positions[1].get_values();
			this.assertNotNull(context, 'current_vmembers', current_vmembers);
			this.assertNotNull(context, 'current_hmembers', current_hmembers);
		
			this.cells_render_fill(this, current_hmembers, current_vmembers, cell_records, td_jqo);
		}
		else
		{
			this.step(context, 'should no render or not render function');
		}
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @brief		Edit view settings
	 * @return		boolean			true:success,false:failure
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
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('model.name', this.model.name)
			// + this.to_string_value('', this.)
			// + this.to_string_value('pivot_cells.length', this.pivot_cells.length)
			;
	}
}

Libapt.register_inheritance(LibaptPivotGrid, LibaptGridTable);
