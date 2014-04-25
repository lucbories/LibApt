	/**
 * @file        libapt-mixin-view-size.js
 * @desc        Mixin of view for sizes operations
 * @see			libapt-view.js
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-06-23
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */



/**
 * @mixin				LibaptMixinViewSize
 * @public
 * @desc				Mixin of view sizes operations
 */
var LibaptMixinViewSize =
{
	/**
	 * @memberof			LibaptMixinViewSize
	 * @public
	 * @desc				Enable/disable trace for size operations
	 */
	trace_mixin_view_size: false,
	
	
	
	/**
	 * @memberof			LibaptMixinViewSize
	 * @public
	 * @method				adjust_sizes()
	 * @desc				Adjust sizes
	 * 			----------------- Page ----------------------
	 * 				---------- Parent of container (div) --------------
	 * 		|			-------- Container (div) ------------
	 * VIEW	|				---- Title bar (div) ---- (optional)
	 * 		|				---- Content (div) ----
	 * 		|					-- Child of content --
	 * 
	 * Adjusting sizes rules are :
	 * 		RULE 1:	container.width = auto
	 * 				remove conten.x-scroll and conten.y-scroll
	 * 				//tilebar.width = MIN(content.width, container.width)
	 * 		RULE 2: if content.width > container.width then content.x-scoll = true
	 * 		RULE 3: if content.child.width > container.width then content.x-scoll = true
	 * @return {boolean}	true:success,false:failure
	 */
	adjust_sizes: function()
	{
		var self = this;
		self.push_trace(this.trace, this.trace_mixin_view_size);
		var context = 'adjust_sizes()';
		self.enter(context, '');
		
		
		// CHECK CONTAINER JQO
		if ( ! self.container_jqo )
		{
			self.leave(context, 'no container jqo');
			this.pop_trace();
			return;
		}
		
		// CHECK CONTENT JQO
		if ( ! self.content_jqo )
		{
			self.leave(context, 'no content jqo');
			this.pop_trace();
			return;
		}
		
		
		// RULE 1: CONTAINER WIDTH = AUTO
		var container_parent_jqo = self.container_jqo.parent();
		// self.container_jqo.css('width', 'auto');
		if (container_parent_jqo &&  container_parent_jqo.width() > 0)
		{
			// console.log(container_parent_jqo);
			self.container_jqo.css('max-width', container_parent_jqo.width() + 'px');
		}
		self.content_jqo.css('overflow-x', 'inherit');
		self.content_jqo.css('overflow-y', 'inherit');
		
		// GET CURRENT SIZES
		var container_width		= self.container_jqo.width();
		var container_height	= self.container_jqo.height();
		self.value(context, 'container_width', container_width);
		self.value(context, 'container_height', container_height);
		
		var content_width		= self.content_jqo.width();
		var content_height		= self.content_jqo.height();
		self.value(context, 'content_width', content_width);
		self.value(context, 'content_height', content_height);
		
		
		// RULE 2: CONTENT SIZES : CONTENT WIDTH > CONTAINER WIDTH OR CONTENT HEIGHT > CONTAINER HEIGHT
		if (content_width > container_width)
		{
			self.step(context, 'RULE 2: ENABLE CONTENT X SCROLLING');
			self.content_jqo.css('overflow-x', 'scroll');
			self.content_jqo.css('width', container_width + 'px');
		}
		if (content_height > container_height)
		{
			self.step(context, 'RULE 2: ENABLE CONTENT Y SCROLLING');
			self.content_jqo.css('overflow-y', 'scroll');
			self.content_jqo.css('width', container_height + 'px');
		}
		
		
		// RULE 3: CONTENT CHILDREN SIZES
		self.adjust_sizes_for_childs();
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	},
	
	
	/**
	 * @memberof			LibaptMixinViewSize
	 * @public
	 * @method				adjust_sizes_for_childs()
	 * @desc				Adjust sizes for childs
	 * @return {boolean}	true:success,false:failure
	 */
	adjust_sizes_for_childs: function()
	{
		var self = this;
		self.push_trace(this.trace, this.trace_mixin_view_size);
		var context = 'adjust_sizes_for_childs()';
		self.enter(context, '');
		
		
		// GET CURRENT SIZES
		var container_width		= self.container_jqo.width();
		var container_height	= self.container_jqo.height();
		self.value(context, 'container_width', container_width);
		self.value(context, 'container_height', container_height);
		
		for(child_index in self.content_childs_jqo)
		{
			var child_jqo		= self.content_childs_jqo[child_index];
			var child_width		= child_jqo.width();
			var child_height	= child_jqo.height();
			// console.log(child_jqo);
			// console.log(child_jqo.width());
			// console.log(child_jqo.css('width'));
			self.value(context, 'child_width', child_width);
			self.value(context, 'child_height', child_height);
			
			
			// CHILD WIDTH IS TOO LARGE
			if (child_width > container_width)
			{
				self.step(context, 'child_width > container_width');
				child_jqo.css('width', container_width + 'px');
				
				if ( child_jqo.width() > container_width )
				{
					self.content_jqo.css('overflow-x', 'scroll');
				}
			}
			
			// CHILD WIDTH IS TOO SMALL
			if (child_width < container_width)
			{
				self.step(context, 'child_width < container_width');
				child_jqo.css('width', container_width + 'px');
			}
			
			
			// CHILD HEIGHT IS TOO LARGE
			if (child_height > container_height)
			{
				self.step(context, 'child_height > container_height');
				child_jqo.css('height', container_height + 'px');
				
				if ( child_jqo.height() > container_height )
				{
					self.content_jqo.css('overflow-y', 'scroll');
				}
			}
			
			// CHILD HEIGHT IS TOO SMALL
			// if (child_height < container_height)
			// {
				// self.step(context, 'child_height < container_height');
				// child_jqo.css('height', container_height + 'px');
			// }
		}
		
		
		self.leave(context, 'success');
		self.pop_trace();
		return true;
	}
};
