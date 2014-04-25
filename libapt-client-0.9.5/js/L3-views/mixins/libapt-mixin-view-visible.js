/**
 * @file        libapt-mixin-view-visible.js
 * @desc        Mixin of view visible operations
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-07-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewVisible
 * @public
 * @desc				Mixin of view visible operations
 */
var LibaptMixinViewVisible =
{
	/**
	 * @memberof			LibaptMixinViewVisible
	 * @public
	 * @desc				Enable/disable trace for visible operations
	 */
	mixin_view_visible_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewVisible
	 * @public
	 * @desc				Visible flag
	 */
	mixin_view_visible_flag: true,
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewVisible
	 * @method				is_visible()
	 * @desc				The view content is visible ?
	 * @return {boolean}
	 */
	is_visible: function()
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_visible_trace);
		var context = 'is_visible()';
		self.enter(context, '');
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self.mixin_view_visible_flag;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewVisible
	 * @method				set_visible(arg_is_visible)
	 * @desc				Set the view content visible flag
	 * @param {boolean}		arg_is_visible		visible flag
	 * @return {object}		this
	 */
	set_visible: function(arg_is_visible)
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_visible_trace);
		var context = 'set_visible(flag)';
		self.enter(context, '');
		
		
		if ( Libapt.is_boolean(arg_is_visible) )
		{
			self.mixin_view_visible_flag = arg_is_visible;
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewVisible
	 * @method				show()
	 * @desc				Show the view content
	 * @return {object}		this
	 */
	show: function()
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_visible_trace);
		var context = 'show()';
		self.enter(context, '');
		
		
		// SHOW THE CONTENT JQO
		if (self.content_jqo)
		{
			self.mixin_view_visible_flag = true;
			self.content_jqo.show();
		}
		else
		{
			self.step(context, 'no content to show/hide');
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return this;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewVisible
	 * @method				hide()
	 * @desc				Hide the view content
	 * @return {object}		this
	 */
	hide: function()
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_visible_trace);
		var context = 'hide()';
		self.enter(context, '');
		
		
		// HIDE THE CONTENT JQO
		if (self.content_jqo)
		{
			self.mixin_view_visible_flag = false;
			self.content_jqo.hide();
		}
		else
		{
			self.step(context, 'no content to show/hide');
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return this;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewVisible
	 * @method				toggle_visible()
	 * @desc				Toggle the view content visibility
	 * @return {object}		this
	 */
	toggle_visible: function()
	{
		var self = this;
		self.push_trace(this.trace, this.mixin_view_visible_trace);
		var context = 'toggle_visible()';
		self.enter(context, '');
		
		
		// SHOW/HIDE THE CONTENT JQO
		if (self.content_jqo)
		{
			self.step(context, 'toggle view content');
			self.mixin_view_visible_flag = ! self.mixin_view_visible_flag;
			self.content_jqo.toggle();
		}
		else
		{
			self.step(context, 'no content to show/hide');
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return this;
	}
};
