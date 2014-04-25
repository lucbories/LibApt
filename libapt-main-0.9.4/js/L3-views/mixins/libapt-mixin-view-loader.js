	/**
 * @file        libapt-mixin-view-loader.js
 * @desc        Mixin of view loader operations
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewLoader
 * @public
 * @desc				Mixin of view links operations
 */
var LibaptMixinViewLoader =
{
	/**
	 * @memberof			LibaptMixinViewLoader
	 * @public
	 * @desc				Enable/disable trace for loader operations
	 */
	trace_mixin_view_loader: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewLoader
	 * @public
	 * @desc				jQuery object of the loader image
	 */
	loader_jqo: null,
	
	
	
	/**
	 * @memberof			LibaptMixinViewLoader
	 * @public
	 * @method				enable_loader()
	 * @desc				Display a loading image on the current view
	 * @return {boolean}	true:success,false:failure
	 */
	enable_loader: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_loader);
		var context = 'enable_loader()';
		self.enter(context, '');
		
		
		// SHOW PROGRESS LOADER
		if ( Libapt.is_null(self.loader_jqo) )
		{
			var loader_icon_url = Libapt.get_main_icon_url('loader/ajax-loader_round_blue.gif');
			self.loader_jqo = $('<center><img src="' + loader_icon_url + '" alt="loading in progress"></img></center>');
		}
		self.container_jqo.prepend(self.loader_jqo);
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	
	/**
	 * @memberof			LibaptMixinViewLoader
	 * @public
	 * @method				disable_loader()
	 * @desc				Remove a loading image on the current view
	 * @return {boolean}	true:success,false:failure
	 */
	disable_loader: function()
	{
		var self = this;
		self.push_trace(self.trace, self.trace_mixin_view_loader);
		var context = 'disable_loader()';
		self.enter(context, '');
		
		
		// HIDE PROGRESS LOADER
		self.loader_jqo.remove();
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	}
};
