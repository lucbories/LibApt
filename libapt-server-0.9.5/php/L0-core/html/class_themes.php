<?php
/**
 * @file        class_themes.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
final class THEMES
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// THEMES
	// static public function getDefaultThemeDir()
	// {
		// return LIBAPT_THEMES_DEFAULT;
	// }
	
	// static public function getActiveThemeDir()
	// {
		// TODO : FONCTIONNALITE 'THEME' NON IMPLEMENTEE
		// return LIBAPT_FRAMEWORK_SERVER_THEME_ROOT;
	// }
	
	// static public function getThemesUrl()
	// {
		// return LIBAPT_THEMES_ACTIVE_WWW_URL;
	// }
	
	// static public function getActiveThemeUrl()
	// {
		// return LIBAPT_THEMES_ACTIVE_WWW_URL;
	// }
	
	static public function getIncludesDir()
	{
		return LIBAPT_FRAMEWORK_SERVER_THEME_ROOT."/php";
	}
	
	// static public function getPluginsUrl()
	// {
		// return LIBAPT_PLUGINS_URL;
	// }
	
	
	// ICONS
	static public function getIconsUrl()
	{
		return LIBAPT_FRAMEWORK_STATIC_IMG_URL;
	}
	
	static public function getIconUrl($arg_icon_code = null)
	{
		if ( is_null($arg_icon_code) )
		{
			return LIBAPT_FRAMEWORK_STATIC_IMG_URL;
		}
		
		$icon_file = "not_found";
		switch($arg_icon_code)
		{
			// MAIN DIR
			case "alert":			$icon_file = "alert.gif"; break;
			
			
			// LOADER SUBDIR
			case "loader":			$icon_file = "loader/ajax-loader_round_blue.gif"; break;
			
			
			// EDIT SUBDIR
			case "create":			$icon_file = "edit/add.gif"; break;
			case "add":				$icon_file = "edit/add.gif"; break;
			
			case "add_24":			$icon_file = "edit/add_24.png"; break;
			case "add_32":			$icon_file = "edit/add_32.png"; break;
			case "add_48":			$icon_file = "edit/add_48.png"; break;
			case "add_128":			$icon_file = "edit/add_128.png"; break;
			case "add_256":			$icon_file = "edit/add_256.png"; break;
			
			case "edit":			$icon_file = "edit/edit_small.gif"; break;
			case "update":			$icon_file = "edit/edit_small.gif"; break;
			
			case "tools_24":		$icon_file = "edit/tools_24.png"; break;
			case "tools_32":		$icon_file = "edit/tools_32.png"; break;
			case "tools_48":		$icon_file = "edit/tools_48.png"; break;
			case "tools_128":		$icon_file = "edit/tools_128.png"; break;
			case "tools_256":		$icon_file = "edit/tools_256.png"; break;
			
			case "delete":			$icon_file = "edit/trash_on.gif"; break;
			
			case "delete_24":		$icon_file = "edit/delete_24.png"; break;
			case "delete_32":		$icon_file = "edit/delete_32.png"; break;
			case "delete_48":		$icon_file = "edit/delete_48.png"; break;
			case "delete_128":		$icon_file = "edit/delete_128.png"; break;
			case "delete_256":		$icon_file = "edit/delete_256.png"; break;
			
			case "pencil_24":		$icon_file = "pencil_24.png"; break;
			case "pencil_32":		$icon_file = "pencil_32.png"; break;
			case "pencil_48":		$icon_file = "pencil_48.png"; break;
			case "pencil_128":		$icon_file = "pencil_128.png"; break;
			case "pencil_256":		$icon_file = "pencil_256.png"; break;
			
			
			// REFRESH SUBDIR
			case "refresh":			$icon_file = "refresh/arrow_refresh.png"; break;
			
			case "refresh_24":		$icon_file = "refresh/refresh_24.png"; break;
			case "refresh_32":		$icon_file = "refresh/refresh_32.png"; break;
			case "refresh_48":		$icon_file = "refresh/refresh_48.png"; break;
			case "refresh_128":		$icon_file = "refresh/refresh_128.png"; break;
			case "refresh_256":		$icon_file = "refresh/refresh_256.png"; break;
			
			
			// FILES SUBDIR
			case "file_json_16":	$icon_file = "files/json_file-16.png"; break;
			case "file_json_24":	$icon_file = "files/json_file-24.png"; break;
			case "file_json_32":	$icon_file = "files/json_file-32.png"; break;
			case "file_json_48":	$icon_file = "files/json_file-48.png"; break;
			case "file_json_64":	$icon_file = "files/json_file-64.png"; break;
			case "file_json_128":	$icon_file = "files/json_file-128.png"; break;
			
			case "file_csv_16":		$icon_file = "files/csv_file-16.png"; break;
			case "file_csv_24":		$icon_file = "files/csv_file-24.png"; break;
			case "file_csv_32":		$icon_file = "files/csv_file-32.png"; break;
			case "file_csv_48":		$icon_file = "files/csv_file-48.png"; break;
			case "file_csv_64":		$icon_file = "files/csv_file-64.png"; break;
			case "file_csv_128":	$icon_file = "files/csv_file-128.png"; break;
			
			case "file_html_16":	$icon_file = "files/html_file-16.png"; break;
			case "file_html_24":	$icon_file = "files/html_file-24.png"; break;
			case "file_html_32":	$icon_file = "files/html_file-32.png"; break;
			case "file_html_48":	$icon_file = "files/html_file-48.png"; break;
			case "file_html_64":	$icon_file = "files/html_file-64.png"; break;
			case "file_html_128":	$icon_file = "files/html_file-128.png"; break;
			
			case "file_txt_16":		$icon_file = "files/txt_file-16.png"; break;
			case "file_txt_24":		$icon_file = "files/txt_file-24.png"; break;
			case "file_txt_32":		$icon_file = "files/txt_file-32.png"; break;
			case "file_txt_48":		$icon_file = "files/txt_file-48.png"; break;
			case "file_txt_64":		$icon_file = "files/txt_file-64.png"; break;
			case "file_txt_128":	$icon_file = "files/txt_file-128.png"; break;
			
			case "file_xls_16":		$icon_file = "files/xls_file-16.png"; break;
			case "file_xls_24":		$icon_file = "files/xls_file-24.png"; break;
			case "file_xls_32":		$icon_file = "files/xls_file-32.png"; break;
			case "file_xls_48":		$icon_file = "files/xls_file-48.png"; break;
			case "file_xls_64":		$icon_file = "files/xls_file-64.png"; break;
			case "file_xls_128":	$icon_file = "files/xls_file-128.png"; break;
			
			case "file_xml_16":		$icon_file = "files/xml_file-16.png"; break;
			case "file_xml_24":		$icon_file = "files/xml_file-24.png"; break;
			case "file_xml_32":		$icon_file = "files/xml_file-32.png"; break;
			case "file_xml_48":		$icon_file = "files/xml_file-48.png"; break;
			case "file_xml_64":		$icon_file = "files/xml_file-64.png"; break;
			case "file_xml_128":	$icon_file = "files/xml_file-128.png"; break;
			
			
			// FLECHES SUBDIR
			case "fleches":			$icon_file = "fleches/"; break;
			
			
			// CALENDAR SUBDIR
			case "calendar_24":		$icon_file = "calendar/calendar_24.png"; break;
			case "calendar_32":		$icon_file = "calendar/calendar_32.png"; break;
			case "calendar_48":		$icon_file = "calendar/calendar_48.png"; break;
			case "calendar_128":	$icon_file = "calendar/calendar_128.png"; break;
			case "calendar_256":	$icon_file = "calendar/calendar_256.png"; break;
			
			case "calendar2_16":	$icon_file = "calendar/calendrier-date-icone-5072-16.png"; break;
			case "calendar2_32":	$icon_file = "calendar/calendrier-date-icone-5072-32.png"; break;
			case "calendar2_48":	$icon_file = "calendar/calendrier-date-icone-5072-48.png"; break;
			case "calendar2_64":	$icon_file = "calendar/calendrier-date-icone-5072-64.png"; break;
			case "calendar2_96":	$icon_file = "calendar/calendrier-date-icone-5072-96.png"; break;
			
			
			// CHART SUBDIR
			case "chart1_16":		$icon_file = "chart/1360017266_diagram_16.png"; break;
			case "chart1_32":		$icon_file = "chart/1360017251_diagram_32.png"; break;
			case "chart1_48":		$icon_file = "chart/1360017254_diagram_48.png"; break;
			case "chart1_64":		$icon_file = "chart/1360017245_diagram_64.png"; break;
			
			
			// HELP SUBDIR
			case "info_16":			$icon_file = "help/documentaires-des-proprietes-icone-5224-16.png"; break;
			case "info_32":			$icon_file = "help/documentaires-des-proprietes-icone-5224-32.png"; break;
			case "info_48":			$icon_file = "help/documentaires-des-proprietes-icone-5224-48.png"; break;
			case "info_64":			$icon_file = "help/documentaires-des-proprietes-icone-5224-64.png"; break;
			case "info_96":			$icon_file = "help/documentaires-des-proprietes-icone-5224-96.png"; break;
			case "info_128":		$icon_file = "help/documentaires-des-proprietes-icone-5224-128.png"; break;
			
			case "help_16":			$icon_file = "help/1360017277_help_16.png"; break;
			case "help_32":			$icon_file = "help/1360017294_help_32.png"; break;
			case "help_48":			$icon_file = "help/1360017285_help_48.png"; break;
			case "help_64":			$icon_file = "help/1360017271_help_64.png"; break;
			
			
			// HOME SUBDIR
			case "home_16":			$icon_file = "home/1360017345_home_16.png"; break;
			case "home_32":			$icon_file = "home/1360017341_home_32.png"; break;
			case "home_48":			$icon_file = "home/1360017338_home_48.png"; break;
			case "home_64":			$icon_file = "home/1360017334_home_64.png"; break;
			
			
			// LOCK SUBDIR
			case "lock_16":			$icon_file = "lock/1359041868_30.png"; break;
			case "lock_32":			$icon_file = "lock/1359041864_30.png"; break;
			case "lock_64":			$icon_file = "lock/1359041856_30.png"; break;
			
			
			// LOGIN SUBDIR
			case "login_16":		$icon_file = "login/1359041909_Login Manager.png"; break;
			case "login_32":		$icon_file = "login/1359041902_Login Manager.png"; break;
			case "login_48":		$icon_file = "login/1359041914_Login Manager.png"; break;
			case "login_64":		$icon_file = "login/1359041919_Login Manager.png"; break;
			case "login_128":		$icon_file = "login/1359041925_Login Manager.png"; break;
			
			
			// LOGOUT SUBDIR
			case "logout_16":		$icon_file = "logout/1359042004_gnome-session-logout.png"; break;
			case "logout_22":		$icon_file = "logout/1359042005_gnome-session-logout.png"; break;
			case "logout_24":		$icon_file = "logout/1359042000_gnome-session-logout.png"; break;
			case "logout_32":		$icon_file = "logout/1359041999_gnome-session-logout.png"; break;
			case "logout_48":		$icon_file = "logout/1359041997_gnome-session-logout.png"; break;
			case "logout_64":		$icon_file = "logout/1359041995_gnome-session-logout.png"; break;
			
			case "exit_16":			$icon_file = "logout/1359041987_logout.png"; break;
			case "exit_24":			$icon_file = "logout/1359041986_logout.png"; break;
			case "exit_32":			$icon_file = "logout/1359041985_logout.png"; break;
			case "exit_48":			$icon_file = "logout/1359041983_logout.png"; break;
			case "exit_64":			$icon_file = "logout/1359041981_logout.png"; break;
			case "exit_128":		$icon_file = "logout/1359041976_logout.png"; break;
			case "exit_256":		$icon_file = "logout/1359041989_logout.png"; break;
			
			
			// MISC SUBDIR
			case "misc_16":			$icon_file = "misc/misc-icone-8050-16.png"; break;
			case "misc_32":			$icon_file = "misc/misc-icone-8050-32.png"; break;
			case "misc_48":			$icon_file = "misc/misc-icone-8050-48.png"; break;
			
			case "gear_16":			$icon_file = "misc/1360017315_gear_16.png"; break;
			case "gear_32":			$icon_file = "misc/1360017312_gear_32.png"; break;
			case "gear_48":			$icon_file = "misc/1360017309_gear_48.png"; break;
			case "gear_64":			$icon_file = "misc/1360017303_gear_64.png"; break;
			
			case "key_16":			$icon_file = "misc/1360017364_key_16.png"; break;
			case "key_32":			$icon_file = "misc/1360017371_key_32.png"; break;
			case "key_48":			$icon_file = "misc/1360017363_key_48.png"; break;
			case "key_64":			$icon_file = "misc/1360017359_key_64.png"; break;
			
			case "puzzle_32":		$icon_file = "misc/preferences_plugin.png"; break;
			
			case "menu_32":			$icon_file = "misc/menu_32.png"; break;
			
			
			// PROJECT SUBDIR
			case "project1_16":		$icon_file = "project/my_projects_folder_16.png"; break;
			case "project1_32":		$icon_file = "project/my_projects_folder_32.png"; break;
			case "project1_48":		$icon_file = "project/my_projects_folder_48.png"; break;
			case "project1_64":		$icon_file = "project/my_projects_folder_64.png"; break;
			case "project1_96":		$icon_file = "project/my_projects_folder_96.png"; break;
			case "project1_128":	$icon_file = "project/my_projects_folder_128.png"; break;
			case "project1_256":	$icon_file = "project/my_projects_folder_256.png"; break;
			
		}
		
		return LIBAPT_FRAMEWORK_STATIC_IMG_URL.$icon_file;
	}
	
	static public function getIconAddUrl()
	{
		return Themes::getIconsUrl()."/edit/add.gif";
	}
	
	static public function getIconEditUrl()
	{
		return Themes::getIconsUrl()."/edit/edit_small.gif";
	}
	
	static public function getIconDeleteUrl()
	{
		return Themes::getIconsUrl()."/edit/trash_on.gif";
	}
	
	static public function getIconAlertUrl()
	{
		return Themes::getIconsUrl()."/alert.gif";
	}
	
	static public function getIconRefreshUrl()
	{
		return Themes::getIconsUrl()."/refresh/arrow_refresh.png";
	}
	
	
	// DATA FORMAT ICONS
	static public function getIconJsonUrl()
	{
		return Themes::getIconsUrl()."/files/json_file-24.png";
	}
	
	static public function getIconCsvUrl()
	{
		return Themes::getIconsUrl()."/files/csv_file-24.png";
	}
	
	static public function getIconXlsUrl()
	{
		return Themes::getIconsUrl()."/files/xls_file-24.png";
	}
	
	static public function getIconTxtUrl()
	{
		return Themes::getIconsUrl()."/files/txt_file-24.png";
	}
}
?>