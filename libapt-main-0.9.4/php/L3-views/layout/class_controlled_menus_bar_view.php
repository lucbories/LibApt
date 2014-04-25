<?php
/**
 * @file        class_controlled_menus_bar_view.php
 * @brief       Display an HTML menus bar from the menus configuration
 * @details     Read menus bar items from the menus controller repository and display a menus bar
 * @see			MenuItem Menubar AbstractTemplateViewImpl AbstractTemplateView Trace
 * @ingroup     L3_VIEWS
 * @date        2013-01-27
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ControlledMenusBarView extends AbstractTemplateViewImpl
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_CONTROLLED_MENUS_BAR		= false;
	
	
	/// @brief		Option : menus bar name
	static public $OPTION_MENUS_BAR_NAME			= "menus_bar_name";
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	/// @brief		Option : menus bar name
	protected $menus_bar_object			= null;
	
	
	
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
		
		// DECLARE OPTIONS
		$this->registerOption(self::$OPTION_MENUS_BAR_NAME,			Type::$TYPE_STRING,		self::$OPTION_REQUIRED, 	self::$OPTION_NOT_STORE_SESSION, null);
	}
	
	 
	
	// ----------------- CLASS INSTANCE INIT -----------------
	/**
	 * @brief		Is a valid view 
	 * @return		boolean		true:valid, false:not valid
	 */
	public function isValid()
	{
		return ! is_null($this->menus_bar_object);
	}
	
	/**
	 * @brief		Initialization
	 * @return		nothing
	 */
	protected function initSelf()
	{
		$context = "ControlledMenusBarView.initSelf";
		TRACE::enter($context, "", self::$TRACE_CONTROLLED_MENUS_BAR);
		
		// MODEL VIEW INIT
		CONTRACT::assertTrue($context.".parent.initSelf()", parent::initSelf() );
		
		// GET MENUS BAR OPTIONS
		$menus_bar_name = $this->getOption(self::$OPTION_MENUS_BAR_NAME);
		CONTRACT::assertNotEmptyString($context.".menus_bar_name", $menus_bar_name);
		
		// GET MENUS BAR
		$menus_controller = Controllers::getController("menuAction");
		CONTRACT::assertNotNull($context.".menus_controller", $menus_controller);
		
		if ( ! $menus_controller->hasObject($menus_bar_name) )
		{
			$this->menus_bar_object = null;
			return TRACE::leaveok($context, "menus bar not found[$menus_bar_name]", false, self::$TRACE_CONTROLLED_MENUS_BAR);
		}
		$this->menus_bar_object = $menus_controller->getMenusBar($menus_bar_name);
		CONTRACT::assertNotNull($context.".menus_bar_object", $this->menus_bar_object);
		
		// TEMPLATE LAYOUT
		$template = $this->menus_bar_object->getMenuBarTemplate();
		if ( is_null($template) || $template == "" )
		{
			$template = "{begin_row}{begin_12_cols}{this}{end_cols}{end_row}";
		}
		$this->setTemplateFromString($template);
		
		return TRACE::leaveok($context, "", true, self::$TRACE_CONTROLLED_MENUS_BAR);
	}
	
	
	
	// ----------------- VIEW RENDER -----------------
	
	/**
	 * @brief		Render html view
	 * @return		nothing
	 */
	public function htmlSelf()
	{
		$context = "ControlledMenusBarView.htmlSelf";
		
		// GET BAR ATTRIBUTES
		$menus_bar_format = $this->menus_bar_object->getMenuBarFormat();
		$menus_bar_orientation = $this->menus_bar_object->getMenuBarOrientation();
		TRACE::trace_var($context, "menus_bar_format", $menus_bar_format, self::$TRACE_CONTROLLED_MENUS_BAR);
		TRACE::trace_var($context, "menus_bar_orientation", $menus_bar_orientation, self::$TRACE_CONTROLLED_MENUS_BAR);
		
		// ENTER MENUS BAR LAYOUT
		$this->enterMenuBar($menus_bar_format, $menus_bar_orientation);
		
		// FILL MENUS BAR LAYOUT
		$right_menus = array();
		if ($menus_bar_format == MenuBar::$FORMAT_TOP)
		{
			HTML::enterUL(null, "left");
		}
		foreach($this->menus_bar_object->getChilds() as $current_menu_0)
		{
			// BUFFER MENU AT RIGHT
			if ($current_menu_0->isRight())
			{
				$right_menus[] = $current_menu_0;
				continue;
			}
			
			// PROCESS LEFT MENUS
			TRACE::trace_var($context, "current_menu_0.name at left", $current_menu_0->getName(), self::$TRACE_CONTROLLED_MENUS_BAR);
			if ($menus_bar_format == MenuBar::$FORMAT_TOP)
			{
				$this->addTopBarMenu($current_menu_0);
			}
			else
			{
				$this->addMenu($current_menu_0);
			}
		}
		if ($menus_bar_format == MenuBar::$FORMAT_TOP)
		{
			HTML::leaveUL();
		}
		
		if ($menus_bar_format == MenuBar::$FORMAT_TOP)
		{
			HTML::enterUL(null, "right");
			foreach($right_menus as $current_menu_0)
			{
				TRACE::trace_var($context, "current_menu_0.name at right", $current_menu_0->getName(), self::$TRACE_CONTROLLED_MENUS_BAR);
				if ($menus_bar_format == MenuBar::$FORMAT_TOP)
				{
					$this->addTopBarMenu($current_menu_0);
				}
				else
				{
					$this->addMenu($current_menu_0);
				}
			}
			$this->renderTopBarMenuLogout();
			HTML::leaveUL();
		}
		
		// LEAVE MENUS BAR LAYOUT
		$this->leaveMenuBar($menus_bar_format, $menus_bar_orientation);
	}
	
	
	
	/**
	 * @brief		Render html for a menu bar begin
	 * @param[in]	arg_format			layout format of the menu bar (TOP or NAV)
	 * @param[in]	arg_orientation		layout orientation of the menu bar (VERTICAL or HORIZONTAL) (only for NAV format)
	 * @return		nothing
	 */
	public function enterMenuBar($arg_format, $arg_orientation)
	{
		// TOP MENUS BAR
		if ($arg_format == MenuBar::$FORMAT_TOP)
		{
			HTML::addBufferLine("<nav class='top-bar'>");
			HTML::enterUL();
				HTML::enterLI(null, "name");
					HTML::enterH1();
						$link = Urls::getHomeUrl();
						$label = Application::getInstance()->getShortLabel();
						$tooltip = Application::getInstance()->getLongLabel()."-".Application::getInstance()->getVersion();
						if ( Application::getInstance()->isreadonly() )
						{
							$tooltip .= " (readonly mode)";
						}
						HTML::tagAnchor($link, $label, null, null, "title='$tooltip'");
					HTML::leaveH1();
				HTML::leaveLI();
				
				HTML::enterLI(null, "toggle-topbar");
					HTML::addBufferLine("<a href='#'></a>");
				HTML::leaveLI();
			HTML::leaveUL();
			
			HTML::addBufferLine("<section>");
			return;
		}
		
		// NAVIGATION MENUS BAR
		
		// VERTICAL ORIENTATION
		if ($arg_orientation == MenuBar::$ORIENTATION_VERTICAL)
		{
			HTML::addBufferLine("<ul class='nav-bar vertical'>");
			return;
		}
		
		// DEFAULT : HORIZONTAL ORIENTATION
		HTML::addBufferLine("<ul class='nav-bar'>");
	}
	
	
	
	/**
	 * @brief		Render html for a new menu (in a menus top bar)
	 * @param[in]	arg_menu_object		menu object
	 * @return		nothing
	 */
	public function addTopBarMenu($arg_menu_object)
	{
		// ENTER MENU
		HTML::enterLI(null, "has-dropdown");
		
		// MENU HEADER
		$menu_label		= $arg_menu_object->getLabel();
		$menu_label_tag	= $menu_label;
		$menu_icon_url	= $arg_menu_object->getIconUrl();
		$menu_icon_tag	= "";
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
			$menu_label_tag	= "<span>$menu_icon_tag$menu_label</span>";
		}
		$menu_tooltip	= $arg_menu_object->getTooltip();
		$menu_tooltip_attribute = "";
		if ( ! is_null($menu_tooltip) )
		{
			$menu_tooltip_attribute = " title='$menu_tooltip'";
		}
		
		HTML::addBufferLine("<a href='#' $menu_tooltip_attribute>".$menu_label_tag."</a>\n");
		
		// MENU CHILDS
		$menu_childs		= $arg_menu_object->getChilds();
		$menu_childs_count	= count($menu_childs);
		if ($menu_childs_count > 0)
		{
			HTML::enterUL(null, "dropdown");
				$this->addTopBarMenuChilds($menu_childs);
			HTML::leaveUL();
		}
		
		// LEAVE MENU
		HTML::leaveLI();
	}
	
	
	
	/**
	 * @brief		Render html for a menu childs (in a menus top bar)
	 * @param[in]	arg_menu_childs		menus objects array
	 * @return		nothing
	 */
	public function addTopBarMenuChilds($arg_menu_childs)
	{
		foreach($arg_menu_childs as $menu_child)
		{
			if ( ! Application::getInstance()->hasAuthentication() || Authorization::checkLogged($menu_child->getName(), "MENU_DISPLAY") )
			{
				if ( $menu_child->hasChilds() )
				{
					$menu_label = $menu_child->getLabel();
					$menu_label_tag	= $menu_label;
					$menu_icon_url	= $menu_child->getIconUrl();
					if ( ! is_null($menu_icon_url) )
					{
						$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
						$menu_label_tag	= "<span>$menu_icon_tag$menu_label</span>";
					}
					
					HTML::enterLI(null, "has-dropdown");
						HTML::addBufferLine("<a href='#'>".$menu_label_tag."</a>\n");
						HTML::enterUL(null, "dropdown", null);
							$this->addTopBarMenuChilds($menu_child->getChilds());
						HTML::leaveUL();
					HTML::leaveLI();
				}
				else
				{
					switch ($menu_child->getType())
					{
						case MenuItem::$MENU_TYPE_SEPARATOR:
							HTML::tagLI(null, null, "divider", null);
							break;
						case MenuItem::$MENU_TYPE_LABEL:
							HTML::enterLI();
							HTML::tag("LABEL", $menu_child->getLabel());
							HTML::leaveLI();
							break;
						default :
							HTML::enterLI();
							$this->addMenuChild($menu_child, null);
							HTML::leaveLI();
							break;
					}
				}
			}
		}
	}
	
	
	
	/**
	 * @brief		Render html for a new menu
	 * @param[in]	arg_menu_object		menu object
	 * @return		nothing
	 */
	public function addMenu($arg_menu_object)
	{
		// MENU HAS NO CHILDS
		if ( ! $arg_menu_object->hasChilds() )
		{
			HTML::enterLI();
			$this->addMenuChild($arg_menu_object);
			HTML::leaveLI();
			return;
		}
		
		// ENTER MENU
		HTML::enterLI(null, "has-flyout");
		
		// MENU HEADER
		$menu_label		= $arg_menu_object->getLabel();
		$menu_label_tag	= $menu_label;
		$menu_icon_url	= $arg_menu_object->getIconUrl();
		$menu_icon_tag	= "";
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
			$menu_label_tag	= "<span>$menu_icon_tag$menu_label</span>";
		}
		
		HTML::addBufferLine("<a href='#' class='main'>".$menu_label_tag."</a>\n");
		
		HTML::addBufferLine("<a class='flyout-toggle' href='#'>");
			HTML::addBufferLine("<span> </span>");
		HTML::addBufferLine("</a>\n");
		
		// MENU CHILDS
		$menu_childs = $arg_menu_object->getChilds();
		HTML::enterUL(null, "flyout", "style='display: none;'");
			$this->addMenuChilds($menu_childs);
		HTML::leaveUL();
		
		// LEAVE MENU
		HTML::leaveLI();
	}
	
	
	
	/**
	 * @brief		Render html for a menu childs
	 * @param[in]	arg_menu_childs		menus objects array
	 * @return		nothing
	 */
	public function addMenuChilds($arg_menu_childs)
	{
		foreach($arg_menu_childs as $menu_child)
		{
			if ( ! Application::getInstance()->hasAuthentication() || Authorization::checkLogged($menu_child->getName(), "MENU_DISPLAY") )
			{
				if ( $menu_child->hasChilds() )
				{
					$menu_label = $menu_child->getLabel();
					$menu_label_tag	= $menu_label;
					$menu_icon_url	= $menu_child->getIconUrl();
					if ( ! is_null($menu_icon_url) )
					{
						$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
						$menu_label_tag	= "<span>$menu_icon_tag$menu_label</span>";
					}
					
					HTML::enterLI(null, "has-flyout");
						HTML::addBufferLine("<a href='#' class='main'>".$menu_label_tag."</a>\n");
						HTML::addBufferLine("<a class='flyout-toggle' href='#'>");
						HTML::enterUL(null, "flyout", "style='display: none;'");
							$this->addMenuChilds($menu_child->getChilds());
						HTML::leaveUL();
					HTML::leaveLI();
				}
				else
				{
					HTML::enterLI();
					$this->addMenuChild($menu_child, null);
					HTML::leaveLI();
				}
			}
		}
	}
	
	
	
	/**
	 * @brief		Render html for a menu child
	 * @param[in]	arg_menu_child		menu object
	 * @return		nothing
	 */
	public function addMenuChild($arg_menu_child)
	{
		$menu_label			= $arg_menu_child->getLabel();
		$action_view		= $arg_menu_child->getActionView();
		$action_model		= $arg_menu_child->getActionModel();
		$action_json		= $arg_menu_child->getActionJson();
		$action_view_opds	= $arg_menu_child->getActionViewOperands();
		$action_model_opds	= $arg_menu_child->getActionModelOperands();
		$action_js			= $arg_menu_child->getActionJS();
		
		$js = "";
		$link = "";
		
		// JS ACTION
		if ( $arg_menu_child->hasActionJS() )
		{
			$link = "#";
			$js = " onclick='$action_js'";
		}
		
		// LINK
		if ( $arg_menu_child->hasLinkUrl() )
		{
			$link = $arg_menu_child->getLinkUrl();
		}
		else
		{
			$opds_str = "";
			if ( ! is_null($action_view_opds) && $action_view_opds != "" )
			{
				$opds_str = $action_view_opds;
			}
			if ( ! is_null($action_model_opds) )
			{
				$opds_str .= ($opds_str == "" ? "" : "&") . $action_model_opds;
			}
			if ( ! ( is_null($action_view) && is_null($action_model) ) )
			{
				$link = Urls::getActionUrl($action_model, $action_view, $opds_str);
			}
			if ( ! is_null($action_json) && $action_json != "" )
			{
				$link .= ($link == "" ? "?" : "&") . "jsonAction=$action_json";
			}
		}
		
		$menu_label_tag	= "<a href='$link' $js>$menu_label</a>\n";
		$menu_icon_url	= $arg_menu_child->getIconUrl();
		if ( ! is_null($menu_icon_url) )
		{
			$menu_icon_tag	= "<img src='$menu_icon_url' class='libapt_menu_icon'></img>";
			$menu_label_tag	= "<a href='$link' style='padding:5px;'	$js>$menu_icon_tag$menu_label</a>";
		}
		
		HTML::addBufferLine($menu_label_tag);
	}
	
	
	/**
	 * @brief		Render html for a menu bar end
	 * @param[in]	arg_format			layout format of the menu bar (TOP or NAV)
	 * @param[in]	arg_orientation		layout orientation of the menu bar (VERTICAL or HORIZONTAL) (only for NAV format)
	 * @return		nothing
	 */
	public function leaveMenuBar($arg_format, $arg_orientation)
	{
		// TOP MENUS BAR
		if ($arg_format == MenuBar::$FORMAT_TOP)
		{
			HTML::addBufferLine("</section>");
			HTML::addBufferLine("</nav>");
			return;
		}
		
		// NAVIGATION MENUS BAR
		HTML::leaveUL();
	}
	
	
	/**
	 * @brief		Render html logout menu
	 * @return		nothing
	 */
	public function renderTopBarMenuLogout()
	{
		if (Authentication::isEnabled() && ! Application::getInstance()->hasAutoLogin() )
		{
			HTML::enterLI();
			if ( Authentication::isLogged() )
			{
				$logout_img = THEMES::getIconUrl('exit_48');
				$tooltip = "Logout current logged user : ".Authentication::getLogin();
				HTML::addBufferLine("<a href='#' title='$tooltip'><img id='logout_img' src=\"$logout_img\" alt=\"logout\" onclick=\"$('#logout_form').submit();\"></img></a>");
			}
			HTML::leaveLI();
		}
	}
}
?>