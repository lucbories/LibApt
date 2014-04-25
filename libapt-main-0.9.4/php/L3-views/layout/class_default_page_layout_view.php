<?php
/**
 * @file        class_default_page_layout_view.php
 * @brief       Default page layout generator for response output
 * @details     Output a login page, an error page or a default banner, menus, content, footer
 * @see			AbstractPageLayoutView AbstractTemplateViewImpl AbstractTemplateView Response Trace
 * @ingroup     L3_VIEWS
 * @date        2013-01-27
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class DefaultPageLayoutView extends AbstractPageLayoutView
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief Menus bar view object
	protected $menus_bar_view		= null;
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_unique_name			unique name for view
	 * @param[in]	arg_parent_view			parent view object or null
	 * @param[in]	arg_options				options array or null
	 * @return		nothing
	 */
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
	}
	
	
	
	// ----------------- VIEW RENDER -----------------
	
	/**
	 * @brief		Get banner view object
	 * @return		object
	 */
	public function getBannerView()
	{
		$banner_inline_php = "
			HTML::enterRowLayout('apt_header');
			HTML::enterColumnsLayout(12, false);
			
			HTML::leaveColumnsLayout();
			HTML::leaveRowLayout();";
		
		return new IncludeView("BannerView", null, array("include_inline_php"=>$banner_inline_php));
	}
	
	
	/**
	 * @brief		Get menus bar view object
	 * @return		object
	 */
	public function getMenusBarView()
	{
		if ( is_null($this->menus_bar_view) )
		{
			$menus_bar_name = Application::getInstance()->getDefaultPageLayoutMenusBar();
			if ( is_null($menus_bar_name) || $menus_bar_name == "")
			{
				return null;
			}
			$this->menus_bar_view = new ControlledMenusBarView("MenusView", null, array(ControlledMenusBarView::$OPTION_MENUS_BAR_NAME => $menus_bar_name));
		}
		return $this->menus_bar_view;
	}
	
	
	/**
	 * @brief		Get footer view object
	 * @return		object
	 */
	public function getFooterView()
	{
		return new IncludeView("FooterView", null, array(IncludeView::$OPTION_FILE_NAME=>Themes::getIncludesDir()."/include_footer.php"));
	}
	
	
	/**
	 * @brief		Get login view object
	 * @return		object
	 */
	public function getLoginView()
	{
		return new IncludeView("LoginView", null, array(IncludeView::$OPTION_FILE_NAME=>Themes::getIncludesDir()."/include_login.php"));
	}
	
	
	/**
	 * @brief		Get error view object
	 * @return		object
	 */
	public function getErrorView()
	{
		return new ErrorsView("ERRORS", null, null);
	}
}
?>