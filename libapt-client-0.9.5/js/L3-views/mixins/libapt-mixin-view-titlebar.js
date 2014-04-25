/**
 * @file        libapt-mixin-view-titlebar.js
 * @desc        Mixin of view titlebar operations
 * @see			libapt-view.js
 * @group       LIBAPT_VIEWS
 * @date        2013-07-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewTitlebar
 * @public
 * @desc				Mixin of view titlebar operations
 */
var LibaptMixinViewTitlebar =
{
	/**
	 * @memberof			LibaptMixinViewTitlebar
	 * @public
	 * @desc				Enable/disable trace for titlebar operations
	 */
	mixin_view_titlebar_trace: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewTitlebar
	 * @public
	 * @desc				Has titlebar flag
	 */
	mixin_view_titlebar_enabled: true,
	
	
	
	/**
	 * @public
	 * @memberof				LibaptMixinViewTitlebar
	 * @method					init_title_bar()
	 * @desc					Init the titlebar
	 * @param {object|null}		arg_options		Titlebar options
	 * @return {object}			this
	 */
	init_title_bar: function(arg_options)
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_titlebar_trace);
		var context = 'init_title_bar()';
		self.enter(context, '');
		
		
		if (self.mixin_view_titlebar_enabled)
		{
			self.titlebar_view = new LibaptTitlebar(self.name + '_titlebar', self.container_jqo, arg_options);
			self.titlebar_view.parent_view = self;
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	},
	
	
	
	/**
	 * @public
	 * @memberof			LibaptMixinViewTitlebar
	 * @method				draw_title_bar()
	 * @desc				Draw the titlebar
	 * @return {object}		this
	 */
	draw_title_bar: function()
	{
		var self = this;
		self.push_trace(self.trace, self.mixin_view_titlebar_trace);
		var context = 'draw_title_bar()';
		self.enter(context, '');
		
		
		// HAS TITLE BAR ?
		if ( ! self.mixin_view_titlebar_enabled )
		{
			self.leave(context, 'no title bar');
			return self;
		}
		
		// CREATE TITLE BAR
		self.titlebar_view.container_jqo = self.container_jqo;
		self.titlebar_view.draw();
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return self;
	}
};
