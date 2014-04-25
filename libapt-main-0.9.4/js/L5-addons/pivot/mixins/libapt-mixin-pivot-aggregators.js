	/**
 * @file        libapt-mixin-pivot-aggregators.js
 * @desc        Pivot aggregator for cells grouping operation
 * @see			libapt-object.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-15
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinPivotAggregators
 * @public
 * @desc				Mixin of aggregators for cells grouping operations
 */
var LibaptMixinPivotAggregators =
{
	/**
	 * @memberof			LibaptMixinPivotAggregators
	 * @public
	 * @method				draw_query_groups_editor(arg_callback, arg_container_jqo)
	 * @desc				Draw query groups editor
	 * @param {object}		arg_model_view_obj			Model view containing the query to edit
	 * @param {object}		arg_container_jqo			JQuery object to attach the editor to
	 * @return {boolean}	true:success,false:failure
	 */
	agg_calc_sum: function(arg_records, arg_target_field_names)
	{
		var self = this;
		var context = 'agg_calc_sum(records,fields_names)';
		self.enter(context, '');
		
		
		// CHECK ARGS
		self.assertNotEmptyArray(context, 'records', arg_records);
		self.assertNotNull(context, 'fields_names', arg_target_field_names);
		if ( ! Libapt.is_array(arg_target_field_names) )
		{
			arg_target_field_names = [arg_target_field_names];
		}
		
		// DO AGGREGATOR
		var results = {};
		for(records_index in arg_records)
		{
			var record = arg_records[records_index];
			for(fields_names_index in arg_target_field_names)
			{
				var field_name = arg_target_field_names[fields_names_index];
				if ( ! results[field_name] )
				{
					results[field_name] = 0;
				}
				else
				{
					var record_field_value = record[field_name];
					results[field_name] += Libapt.is_numeric(record_field_value) ? record_field_value : 0;
				}
			}
		}
		
		
		self.leave(context, 'success');
		return results;
	}
};
