/**
 * @file        libapt-groupsset.js
 * @brief       Groups set class
 * @details     
 * @see			libapt-group.js
 * @ingroup     LIBAPT_CORE
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @brief		Groups set class
 * @param[in]	arg_name			name of the field
 * @param[in]	arg_groups			groups array
 */
function LibaptGroupsSet(arg_name, arg_groups)
{
	// INHERIT
	this.inheritFrom = LibaptObject;
	this.inheritFrom(arg_name, false);
	
	// CONSTRUCTOR BEGIN
	this.trace			= false;
	this.class_name		= 'LibaptGroupsSet';
	var context			= '(' + arg_name + ',arg_groups)';
	this.enter(context, 'constructor');
	
	
	// GROUPS SET ATTRIBUTES
	this.groups			= get_arg(arg_groups, []);
	
	
	// CONSTRUCTOR END
	this.leave(context, 'success');
	
	
	// PUBLIC METHOD : GET A FIELD
	this.get_groups_for_field = function(arg_field_name)
	{
		var context = 'get_groups_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var field_groups = [];
		for(group_index in this.groups)
		{
			var group = this.groups[group_index];
			if (group.field.name == arg_field_name)
			{
				field_groups.push(group);
			}
		}
		
		this.leave(context, 'groups found:' + field_groups.length);
		return field_groups;
	}
	
	
	// PUBLIC METHOD : HAS A FIELD
	this.has_group_for_field = function(arg_field_name)
	{
		var context = 'has_group_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		for(group_index in this.groups)
		{
			var group = this.groups[group_index];
			if (group.field.name == arg_field_name)
			{
				this.leave(context, 'found');
				return true;
			}
		}
		
		this.leave(context, 'not found');
		return false;
	}
	
	
	// GROUPS METHOD - ADD
	this.add_group_for_field = function(arg_field)
	{
		var context = 'add_group_for_field(field)';
		this.enter(context, '');
		
		if ( ! Libapt.is_null(arg_field) )
		{
			this.groups.push( new LibaptGroup(arg_field) );
		}
		
		this.leave(context, '');
		return this;
	}
	
	
	// GROUPS METHOD - ADD
	this.add_group = function(arg_group)
	{
		var context = 'add_group(group)';
		this.enter(context, '');
		
		this.groups.push(arg_group);
		
		this.leave(context, '');
		return this;
	}
	
	// GROUPS METHOD - ADD MANY
	this.add_groups = function(arg_groups)
	{
		var context = 'add_group(' + arg_groups.length + ' groups)';
		this.enter(context, '');
		
		for(key in arg_groups)
		{
			var group = arg_groups[key];
			if ( ! Libapt.is_null(group) )
			{
				this.groups.push(group);
			}
		}
		
		this.leave(context, '');
		return this;
	}
	
	// GROUPS METHOD - REMOVE
	this.remove_group = function(arg_group)
	{
		var context = 'remove_group(' + arg_group + ')';
		this.enter(context, '');
		
		var index = this.groups.lastIndexOf(arg_group);
		if (index >= 0)
		{
			this.groups.splice(index, 1);
		}
		
		this.leave(context, '');
		return this;
	}
	
	// GROUPS METHOD - REMOVE GROUPS OF A FIELD
	this.remove_groups_for_field = function(arg_field_name)
	{
		var context = 'remove_groups_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		for(key in arg_groups)
		{
			var group = arg_groups[key];
			if ( ! Libapt.is_null(group) && group.field.name == arg_field_name )
			{
				var index = this.groups.lastIndexOf(group);
				if (index >= 0)
				{
					this.groups.splice(index, 1);
				}
			}
		}
		
		this.leave(context, '');
		return this;
	}
	
	// GROUPS METHOD - REMOVE ALL
	this.remove_all_groups = function()
	{
		var context = 'remove_group()';
		this.enter(context, '');
		
		this.groups = new Array();
		
		this.leave(context, '');
		return this;
	}
	
	// GROUPS METHOD - GET GROUPS OF A FIELD
	this.get_groups_for_field = function(arg_field_name)
	{
		var context = 'get_groups_for_field(' + arg_field_name + ')';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in arg_groups)
		{
			var group = arg_groups[key];
			if ( ! Libapt.is_null(group) && group.field.ame == arg_field_name )
			{
				results_array.push(group);
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	// GROUPS METHOD - GET ALL GROUPS FIELDS
	this.get_groups_fields = function()
	{
		var context = 'get_groups_fields()';
		this.enter(context, '');
		
		var results_array = new Array();
		for(key in arg_groups)
		{
			var group = arg_groups[key];
			if ( ! Libapt.is_null(group) )
			{
				results_array.push(group.field);
			}
		}
		
		this.leave(context, '');
		return results_array;
	}
	
	
	// PUBLIC METHOD : GET URL STRING
	this.get_url_string = function()
	{
		var context = 'get_url_string()';
		this.enter(context, '');
		
		var url_str = '';
		for(group_index in this.groups)
		{
			var group = this.groups[group_index];
			url_str += group.get_url_string() + '|';
		}
		
		this.leave(context, '');
		return url_str;
	}
	
	
	
	// TRACE METHOD : TO STRING
	this.to_string_self = function()
	{
		return this.to_string_value('groups.count', this.groups.length);
	}
}


LibaptGroupsSet.create = function(arg_settings)
{
	var context = 'LibaptGroupsSet.create(arg_settings)';
	trace_enter(context, '', true);
	
	// INIT DEFAUTL SETTINGS
	var default_settings =
		{
			'name'			: null,
			'groups'		: null
		};
	
	// EXTENDS DEFAULT OPTIONS WITH GIVEN OPTIONS
	var ext_settings = $.extend(default_settings, arg_settings);
	
	// CHECK SETTINGS
	if ( Libapt.is_empty_str_or_null(ext_settings.name) )
	{
		this.error(context, 'object name is not valid', true);
		return null;
	}
	
	// CREATE OBJECT
	var field_obj = new LibaptGroupsSet(ext_settings.name, ext_settings.fields);
	
	trace_leave(context, '', true);
	return field_obj;
}
