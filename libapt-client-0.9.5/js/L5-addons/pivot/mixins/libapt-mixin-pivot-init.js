/**
 * @file        libapt-mixin-pivot-init.js
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
 * @mixin				LibaptMixinPivotInit
 * @public
 * @desc				Mixin of view sizes operations
 */
var LibaptMixinPivotInit =
{
	/**
	 * @memberof			LibaptMixinPivotInit
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	mixin_pivot_init_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinPivotInit
	 * @public
	 * @method				init_pivot_with_records(arg_records)
	 * @desc				...
	 * @param {array}		arg_records		Array of records
	 * @return {object}		This
	 */
	init_pivot_with_records: function(arg_records)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_pivot_init_trace);
		var context = 'init_pivot_with_records(records)';
		self.enter(context, '');
		
		
		// RESET PIVOT MEMBERS
		self.mixin_pivot_members_tree =	{
			root: {
				'group_name': '',
				'values': {},
				'parent': null,
				'datas': [],
				'all': { 'count':0 }
				}
			};
		
		mixin_pivot_members_array = {};
		
		// LOOP ON RECORDS
		for(record_index in arg_records)
		{
			var current_record = arg_records[record_index];
			self.assertNotNull(context, 'current_record', current_record);
			
			self.add_members_record(current_record);
		}
		
		// UPDATE GROUPS DISTINCT MEMBERS
		var groups = self.get_ordered_groups();
		self.assertNotEmptyArray(context, 'groups', groups);;
		for(group_key in groups)
		{
			var group = groups[group_key];
			group.distinct_values = Object.keys(self.mixin_pivot_members_array[group.name].values).sort();
			// console.log(group);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	}
};
