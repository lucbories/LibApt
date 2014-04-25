	/**
 * @file        libapt-mixin-view-link.js
 * @desc        Mixin of view links operations
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewLink
 * @public
 * @desc				Mixin of view links operations
 */
var LibaptMixinViewLink =
{
	/**
	 * @memberof			LibaptMixinViewLink
	 * @public
	 * @desc				Enable/disable trace for links operations
	 */
	trace_mixin_view_link: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewLink
	 * @public
	 * @desc				Links array of the view. A link is an object :
			{
				source_view_name: string,
				target_view_name: string,
				target_view_type: string,
				source_field_name: string,
				target_field_name: string,
				target_field_default: string
			}
	 */
	links: [],
	
	
	
	/**
	 * @memberof			LibaptMixinViewLink
	 * @public
	 * @method				add_link(arg_link_obj)
	 * @desc				Add a new link object to the current view
	 * @param {object}		arg_link_obj			Link object
	 * @return {boolean}	true:success,false:failure
	 */
	add_link: function(arg_link_obj)
	{
		this.push_trace(this.trace, this.trace_mixin_view_link);
		var context = 'add_link(link_obj)';
		this.enter(context, '');
		
		this.links.push(arg_link_obj);
		this.value(context, 'link', arg_link_obj);
		
		this.leave(context, 'success');
		this.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewLink
	 * @public
	 * @method				fire_links(arg_fields_set, arg_values_record, arg_refresh, arg_multiple, arg_multiple_records)
	 * @desc				Fire the links
	 * @param {array}		arg_fields_set			Fields of the view (array)	
	 * @param {object}		arg_values_record		Record of values as an associative array (object)
	 * @param {boolean}		arg_refresh				Should refresh the target view after fire
	 * @param {boolean}		arg_multiple			
	 * @param {array}		arg_multiple_records
	 * @return {boolean}	true:success,false:failure
	 */
	fire_links: function(arg_fields_set, arg_values_record, arg_refresh, arg_multiple, arg_multiple_records)
	{
		this.push_trace(this.trace, this.trace_mixin_view_link);
		var context = 'fire_links(fields,record)';
		this.enter(context, 'refresh=[' + arg_refresh + '] multiple=[' + arg_multiple + ']');
		this.value(context, 'values_record', arg_values_record);
		this.value(context, 'multiple_records', arg_multiple_records);
		
		
		// INIT REFRESH BOOLEAN
		if ( ! Libapt.is_boolean(arg_refresh) )
		{
			arg_refresh = true;
		}
		
		// INIT MULTIPLE BOOLEAN
		if ( ! Libapt.is_boolean(arg_multiple) )
		{
			arg_multiple = false;
		}
		if ( ! Libapt.is_boolean(arg_multiple_records) )
		{
			arg_multiple_records = false;
		}
		
		// LIST OF VIEW TO REFRESH
		var views_to_refresh = {};
		
		// LOOP ON CURRENT VIEW LINKS
		for(link_key in this.links)
		{
			// GET CURRENT LINK
			var link = this.links[link_key];
			this.value(context, 'link', link);
			
			// GET CURRENT LINK TARGET VIEW
			var target_view = LibaptViews.get(link.target_view_name);
			if ( ! Libapt.is_null(target_view) )
			{
				var default_value		= link.target_field_default;
				var target_field_name	= link.target_field_name;
				
				this.step(context, 'target view is not null [' + target_view.name + '] for field[' + target_field_name.name + ']');
				
				// GET FILTERED VALUES
				var source_values		= [];
				if (arg_multiple_records)
				{
					for(record_index in arg_values_record)
					{
						var record = arg_values_record[record_index];
						if ( ! Libapt.is_null(record) )
						{
							var value = get_arg_not_null( record[link.source_field_name], default_value );
							source_values.push(value);
						}
					}
				}
				else
				{
					var value = Libapt.is_null(arg_values_record) ? null : get_arg_not_null(arg_values_record[link.source_field_name], default_value);
					source_values.push(value);
				}
				this.value(context, 'source_values', source_values);
				
				// UPDATE TARGET VIEW FILTERS
				target_view.query.filters_set.remove_filters_for_field(target_field_name);
				target_view.query.filters_set.replace_or_add_filter_field_value(target_view.query.fields_set, target_field_name, source_values, arg_multiple);
				
				// REFRESH TARGET VIEW IF NEEDED
				views_to_refresh[target_view.name] = target_view;
			}
			else
			{
				this.step(context, 'target view is null');
			}
		}
		
		
		// REFRESH TARGET VIEWS IF NEEDED
		if (arg_refresh)
		{
			for (view_name in views_to_refresh)
			{
				var view_to_refresh = views_to_refresh[view_name];
				this.step(context, 'refresh target [' + view_to_refresh.name + ']');
				view_to_refresh.refresh();
			}
		}
		
		
		this.leave(context, 'success');
		this.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewLink
	 * @public
	 * @method				fire_unlinks(arg_fields_set, arg_refresh)
	 * @desc				Unfire the links when the links are removed
	 * @param {array}		arg_fields_set			Fields of the view (array)	
	 * @param {boolean}		arg_refresh				Should refresh the target view after fire
	 * @return {boolean}	true:success,false:failure
	 */
	fire_unlinks: function(arg_fields_set, arg_refresh)
	{
		this.push_trace(this.trace, this.trace_mixin_view_link);
		var context = 'fire_unlinks(fields)';
		this.enter(context, '');
		
		
		// CHECK THE 'SHOULD REFREH FLAG'
		if ( ! Libapt.is_boolean(arg_refresh) )
		{
			arg_refresh = true;
		}
		
		// LIST OF VIEW TO REFRESH
		var views_to_refresh = {};
		
		// LOOP ON LINKS
		for(link_key in this.links)
		{
			// GET THE CURRENT LINK OBJECT
			var link = this.links[link_key];
			
			// GET THE LINK TARGET VIEW
			var target_view = LibaptViews.get(link.target_view_name);
			if ( ! Libapt.is_null(target_view) )
			{
				// GET THE TARGET FIELD NAME
				var target_field_name	= link.target_field_name;
				
				this.step(context, 'target view is not null [' + target_view.name + '] for field[' + target_field_name + ']');
				
				// UPDATE TARGET VIEW QUERY FILTERS
				target_view.query.filters_set.remove_filters_for_field(target_field_name);
				
				// REFRESH TARGET VIEW IF NEEDED
				views_to_refresh[target_view.name] = target_view;
			}
			else
			{
				this.step(context, 'target view is null');
			}
		}
		
		// REFRESH TARGET VIEWS IF NEEDED
		if (arg_refresh)
		{
			for (view_name in views_to_refresh)
			{
				var view_to_refresh = views_to_refresh[view_name];
				this.step(context, 'refresh target [' + view_to_refresh.name + ']');
				view_to_refresh.refresh();
			}
		}
		
		
		this.leave(context, 'success');
		this.pop_trace();
		return true;
	}
};
