	/**
 * @file        libapt-mixin-view-select.js
 * @desc        Mixin of view select operations
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewSelect
 * @public
 * @desc				Mixin of view select operations
 */
var LibaptMixinViewSelect =
{
	/**
	 * @memberof			LibaptMixinViewSelect
	 * @public
	 * @desc				Enable/disable trace for select operations
	 */
	mixin_view_select_trace: false,
	
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewSelect
	 * @method				selectable(arg_jq_selector, arg_filtered, arg_on_select_cb, arg_on_unselect_cb)
	 * @desc				Set a view part selectable
	 * @param {string}		arg_jq_selector		JQuery selector of the view part
	 * @param {function}	arg_on_event_cb		Callback to call on event (function or method callback)
	 * @return {object}		LibaptView instance
	 */
	selectable: function(arg_jq_selector, arg_filtered, arg_on_select_cb, arg_on_unselect_cb)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_select_trace);
		var context = 'selectable(selector,filtered,on_event_cb)';
		self.enter(context, '');
		
		
		// REGISTER EVENTS CALLBACKS
		if (arg_on_select_cb)
		{
			self.add_event_callback('selected', arg_on_select_cb, true);
		}
		if (arg_on_unselect_cb)
		{
			self.add_event_callback('unselected', arg_on_unselect_cb, true);
		}
		
		
		// APPLY SELECTABLE JQUERY UI PLUGIN ON JQO
		var part = $(arg_jq_selector, self.container_jqo);
		part.selectable(
			{
				filter: arg_filtered,
				selected:function(event, ui)
					{
						self.step('selectable.selected_cb', 'selected');
						self.fire_event('selected', [ $(ui.selected), event]);
					},
				unselected:function(event, ui)
					{
						self.step('selectable.unselected_cb', 'unselected');
						self.fire_event('unselected', [ $(ui.unselected), event]);
					}
			}
		);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewSelect
	 * @method				unselectable(arg_jq_selector, arg_filtered)
	 * @desc				Unset a view part selectable
	 * @param {string}		arg_jq_selector		JQuery selector of the view part
	 * @param {string}		arg_filteredb		...
	 * @return {object}		LibaptView instance
	 */
	unselectable: function(arg_jq_selector, arg_filteredb)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_select_trace);
		var context = 'unselectable(selector,filtered)';
		self.enter(context, '');
		
		
		// UNREGISTER EVENTS CALLBACKS
		self.remove_event_callback('selected');
		self.remove_event_callback('unselected');
		
		// REMOVE JQUERY UI SELECTABLE PLUGIN ON JQO
		var part = $(arg_jq_selector, self.container_jqo);
		part.filter('.ui-selectee').selectable('destroy');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinViewSelect
	 * @public
	 * @method					double_clickable(arg_jq_selector, arg_on_event_cb)
	 * @desc					Set a view part double clickable
	 * @param {string}			arg_jq_selector		JQuery selector of the view part
	 * @param {function|array}	arg_on_event_cb		Callback to call on event (function or method array)
	 * @return {object}			LibaptView instance
	 */
	double_clickable: function(arg_jq_selector, arg_on_event_cb)
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_select_trace);
		var context = 'double_clickable(type,key)';
		self.enter(context, '');
		
		
		// REGISTER EVENTS CALLBACKS
		self.add_event_callback('double_clicked', arg_on_event_cb);
		
		var part = $(arg_jq_selector, self.container_jqo);
		part.dblclick(
			function(event)
			{
				this.fire_event('double_clicked', [$(event.target), event]);
			}
		);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return this;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinViewSelect
	 * @public
	 * @method				
	 * @desc					Select a view part
	 * @param {string}			arg_selected_type	kind of the selected item (string)
	 * @param {integer|string}	arg_selected_key	key of the selected item (integer or string)
	 * @return {boolean}		true:success,false:failure
	 */
	select_part: function(arg_selected_type, arg_selected_key)
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_select_trace);
		var context = 'select_part(type,key)';
		self.enter(context, '');
		
		
		if (arg_selected_type == 'selector')
		{
			self.fire_event('select_part', [arg_selected_type, arg_selected_key]);
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof				LibaptMixinViewSelect
	 * @public
	 * @method					unselect_part(arg_selected_type, arg_selected_key)
	 * @desc					Unselect a view part
	 * @param {string}			arg_selected_type	kind of the selected item
	 * @param {integer|string}	arg_selected_key	key of the selected item
	 * @return {boolean}		true:success,false:failure
	 */
	unselect_part: function(arg_selected_type, arg_selected_key)
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_select_trace);
		var context = 'unselect_part(type,key)';
		self.enter(context, '');
		
		
		self.fire_event('unselect_part', [arg_selected_type, arg_selected_key]);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	}
};
