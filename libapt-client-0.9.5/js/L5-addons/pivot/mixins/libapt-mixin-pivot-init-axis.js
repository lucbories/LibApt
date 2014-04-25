/**
 * @file        libapt-mixin-pivot-init-axis.js
 * @desc        Mixin for pivot initialization operations
 * @see			libapt-object.js
 * @ingroup     LIBAPT_ADDONS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinPivotInitAxis
 * @public
 * @desc				Mixin of view sizes operations
 */
var LibaptMixinPivotInitAxis =
{
	/**
	 * @memberof			LibaptMixinPivotInitAxis
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	mixin_pivot_init_axis_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinPivotInitAxis
	 * @public
	 * @method				init_pivot_axis(arg_records)
	 * @desc				Init H and V axis groups
	 * @todo				To rewrite: init_pivot_axis(axis_obj,...) and init_pivot_axis_time(axis_obj,...)
	 * @return {object}		This
	 */
	init_pivot_axis: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_init_axis_trace);
		var context = 'init_pivot_axis()';
		self.enter(context, '');
		
		
		// INIT ALREADY PROCESSED
		if (self.haxis_object && self.vaxis_object)
		{
			self.leave(context, 'init already processed');
			self.pop_trace();
			return;
		}
		
		// CREATE PIVOT AXIS
		self.haxis_object	= new LibaptPivotAxis(self.name + '_haxis', self.haxis.label, [], this);
		self.vaxis_object	= new LibaptPivotAxis(self.name + '_vaxis', self.vaxis.label, [], this);
		
		// TODO CHECK IF AXIS FIELDS ARE QUERY FIELDS
		
		
		// SET ATTRIBUTES
		/*if ( Libapt.is_numeric(self.haxis_max_loaded_members) )
		{
			self.step(context, 'set H axis max members [' + self.haxis_max_loaded_members + ']');
			self.haxis_object.max_members_count = self.haxis_max_loaded_members;
		}
		if ( Libapt.is_numeric(self.vaxis_max_loaded_members) )
		{
			self.step(context, 'set V axis max members [' + self.vaxis_max_loaded_members + ']');
			self.vaxis_object.max_members_count = self.vaxis_max_loaded_members;
		}*/
		if ( Libapt.is_numeric(self.haxis.max_members) )
		{
			self.step(context, 'set H axis max members [' + self.haxis.max_members + ']');
			self.haxis_object.max_members_count = self.haxis.max_members;
		}
		if ( Libapt.is_numeric(self.vaxis.max_members) )
		{
			self.step(context, 'set V axis max members [' + self.vaxis.max_members + ']');
			self.vaxis_object.max_members_count = self.vaxis.max_members;
		}
		// console.log(self.haxis_object);
		// console.log(self.vaxis_object);
		
		if ( Libapt.is_boolean(self.haxis.is_sparse) )
		{
			self.step(context, 'set H axis is sparse');
			self.haxis_object.is_sparse = self.haxis.is_sparse;
		}
		if ( Libapt.is_boolean(self.vaxis.is_sparse) )
		{
			self.step(context, 'set V axis is sparse');
			self.vaxis_object.is_sparse = self.vaxis.is_sparse;
		}
		
		// FILL FIELDS FOR H AXIS
		if (self.haxis.fields_names.length > 0)
		{
			self.step(context, 'Set H axis fields');
			
			for(haxis_field_name_index in self.haxis.fields_names)
			{
				var haxis_field_name = self.haxis.fields_names[haxis_field_name_index];
				self.value(context, 'haxis.field_name', haxis_field_name);
				self.haxis_object.add_group( self.query.fields_set.get_field(haxis_field_name) );
			}
		}	
		
		// FILL FIELDS FOR V AXIS
		if (self.vaxis.fields_names.length > 0)
		{
			self.step(context, 'Set V axis fields');
			
			for(vaxis_field_name_index in self.vaxis.fields_names)
			{
				var vaxis_field_name = self.vaxis.fields_names[vaxis_field_name_index];
				self.value(context, 'vaxis.field_name', vaxis_field_name);
				self.vaxis_object.add_group( self.query.fields_set.get_field(vaxis_field_name) );
			}
		}
		
		
		// REMOVE FIELD IN MORE THAN ONE AXIS
		for(haxis_group_index in self.haxis_object.groups_array)
		{
			var group = self.haxis_object.groups_array[haxis_group_index];
			var vaxis_group_index = self.vaxis_object.groups_array.indexOf(group);
			if (vaxis_group_index >= 0)
			{
				self.vaxis_object.remove_group(group);
			}
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinPivotInitAxis
	 * @public
	 * @method				init_pivot_axis_time_h(arg_records)
	 * @desc				Init H and V axis groups with a H time axis
	 * @todo				To rewrite: init_pivot_axis(axis_obj,...) and init_pivot_axis_time(axis_obj,...)
	 * @return {object}		This
	 */
	init_pivot_axis_time_h: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_init_axis_trace);
		var context = 'init_pivot_axis_time_h()';
		self.enter(context, '');
		
		
		// INIT ALREADY PROCESSED
		if (self.haxis_object && self.vaxis_object)
		{
			self.leave(context, 'init already processed');
			self.pop_trace();
			return;
		}
		
		// CHECK TIME FIELD NAME
		self.assertNotEmptyString(context, 'time field name', self.time_axis_field_name);
		
		// CREATE PIVOT AXIS
		self.haxis_object	= new LibaptPivotAxis(self.name + '_haxis', self.haxis_label, [], self);
		self.vaxis_object	= new LibaptPivotAxis(self.name + '_vaxis', self.vaxis_label, [], self);
		
		
		// INIT TIME AXIS GROUPS
		var arg_time_axis_obj	= self.is_h_axis_time ? self.haxis_object : self.vaxis_object;
		var time_fields_count	= 0;
		if (self.time_axis_has_years)
		{
			self.time_axis_year_field_obj = self.query.fields_set.get_field(self.time_axis_year_field_name);
			arg_time_axis_obj.add_group(self.time_axis_year_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_quarters)
		{
			self.time_axis_quarter_field_obj = self.query.fields_set.get_field(self.time_axis_quarter_field_name);
			arg_time_axis_obj.add_group(self.time_axis_quarter_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_months)
		{
			self.time_axis_month_field_obj = self.query.fields_set.get_field(self.time_axis_month_field_name);
			arg_time_axis_obj.add_group(self.time_axis_month_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_weeks)
		{
			self.time_axis_week_field_obj = self.query.fields_set.get_field(self.time_axis_week_field_name);
			arg_time_axis_obj.add_group(self.time_axis_week_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_doys)
		{
			self.time_axis_doy_field_obj = self.query.fields_set.get_field(self.time_axis_doy_field_name);
			arg_time_axis_obj.add_group(self.time_axis_doy_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_doms)
		{
			self.time_axis_dom_field_obj = self.query.fields_set.get_field(self.time_axis_dom_field_name);
			arg_time_axis_obj.add_group(self.time_axis_dom_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_dows)
		{
			self.time_axis_dow_field_obj = self.query.fields_set.get_field(self.time_axis_dow_field_name);
			arg_time_axis_obj.add_group(self.time_axis_dow_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_hours)
		{
			self.time_axis_hour_field_obj = self.query.fields_set.get_field(self.time_axis_hour_field_name);
			arg_time_axis_obj.add_group(self.time_axis_hour_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_minutes)
		{
			self.time_axis_minute_field_obj = self.query.fields_set.get_field(self.time_axis_minute_field_name);
			arg_time_axis_obj.add_group(self.time_axis_minute_field_obj);
			++time_fields_count;
		}
		if (self.time_axis_has_datetimes)
		{
			self.time_axis_datetime_field_obj = self.query.fields_set.get_field(self.time_axis_datetime_field_name);
			arg_time_axis_obj.add_group(self.time_axis_datetime_field_obj);
			++time_fields_count;
		}
		self.assertTrue(context, 'time fields count', time_fields_count > 0);
		
		
		// SET ATTRIBUTES
		self.vaxis_fields	= get_arg_not_null(self.vaxis_fields, []);
		if ( Libapt.is_numeric(self.haxis.max_members) )
		{
			self.step(context, 'set H axis max members [' + self.haxis.max_members + ']');
			self.haxis_object.max_members_count = self.haxis.max_members;
		}
		if ( Libapt.is_numeric(self.vaxis.max_members) )
		{
			self.step(context, 'set V axis max members [' + self.vaxis.max_members + ']');
			self.vaxis_object.max_members_count = self.vaxis.max_members;
		}
		
		if ( Libapt.is_boolean(self.haxis.is_sparse) )
		{
			self.step(context, 'set H axis is sparse');
			self.haxis_object.is_sparse = self.haxis.is_sparse;
		}
		if ( Libapt.is_boolean(self.vaxis.is_sparse) )
		{
			self.step(context, 'set V axis is sparse');
			self.vaxis_object.is_sparse = self.vaxis.is_sparse;
		}
		
		
		// FILL FIELDS FOR V AXIS
		if (self.vaxis_fields.length == 0)
		{
			self.step(context, 'V axis has no fields');
			
			for(vaxis_field_name_index in self.vaxis.fields_names)
			{
				var vaxis_field_name = self.vaxis.fields_names[vaxis_field_name_index];
				self.value(context, 'vaxis_field_name', vaxis_field_name);
				self.vaxis_object.add_group( self.query.fields_set.get_field(vaxis_field_name) );
			}
		}
		
		
		// REMOVE FIELD IN MORE THAN ONE AXIS
		for(haxis_group_index in self.haxis_object.groups_array)
		{
			var group = self.haxis_object.groups_array[haxis_group_index];
			var vaxis_group_index = self.vaxis_object.groups_array.indexOf(group);
			if (vaxis_group_index >= 0)
			{
				self.vaxis_object.remove_group(group);
			}
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	}//,
	
	
	
	/**
	 * @memberof			LibaptMixinPivotInitAxis
	 * @public
	 * @method				xxxx(arg_records)
	 * @desc				Init H and V axis groups with a H time axis
	 * @todo				To rewrite: init_pivot_axis(axis_obj,...) and init_pivot_axis_time(axis_obj,...)
	 * @return {object}		This
	 */
/*	init_pivot_axis_time_hss: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_init_axis_trace);
		var context = 'init_pivot_axis_time_h()';
		self.enter(context, '');
		
		
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	}*/
};
