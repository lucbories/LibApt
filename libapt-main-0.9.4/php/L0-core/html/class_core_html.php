<?php
/**
 * @file        class_core_html.php
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
class CORE_HTML
{
	// ATTRIBUTES
	static protected $buffer = "";
	
	
	// CONSTRUCTEUR
	private function __construct()
	{
	}
	
	
	// BUFFER
	static public function resetBuffer($arg_buffer = "")
	{
		CORE_HTML::$buffer = $arg_buffer;
	}
	
	static public function getBuffer()
	{
		return CORE_HTML::$buffer;
	}
	
	static public function getBufferAndReset($arg_buffer = "")
	{
		$tmp = CORE_HTML::$buffer;
		CORE_HTML::$buffer = $arg_buffer;
		return $tmp;
	}
	
	static public function echoBufferAndReset($arg_buffer = "")
	{
		$tmp = CORE_HTML::$buffer;
		CORE_HTML::$buffer = $arg_buffer;
		echo $tmp;
	}
	
	static public function addBuffer($arg_html)
	{
		CORE_HTML::$buffer .= $arg_html;
	}
	
	static public function addBufferLine($arg_html)
	{
		CORE_HTML::$buffer .= $arg_html."\n";
	}
	
	static public function addSecureBuffer($arg_text)
	{
		CORE_HTML::$buffer .= htmlspecialchars($arg_text);
	}
	
	
	// HTML TAG
	static public function tag($arg_balise, $arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$escaped_text = htmlspecialchars($arg_text);
		CORE_HTML::addBuffer("<$arg_balise".(is_null($arg_id) ? "" : " id='$arg_id'").(is_null($arg_class) ? "" : " class='$arg_class'").(is_null($arg_tag_opts) ? "" : " ".$arg_tag_opts).">$escaped_text</$arg_balise>\n");
	}
	
	static public function enterTag($arg_balise, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::addBuffer("<$arg_balise".(is_null($arg_id) ? "" : " id='$arg_id'").(is_null($arg_class) ? "" : " class='$arg_class'").(is_null($arg_tag_opts) ? "" : " ".$arg_tag_opts).">\n");
	}
	
	static public function leaveTag($arg_balise)
	{
		CORE_HTML::addBuffer("</$arg_balise>\n");
	}
	
	
	// SIMPLE TAG
	static public function tagBR()
	{
		CORE_HTML::addBuffer("<BR>\n");
	}
	
	static public function enterH1()
	{
		CORE_HTML::addBuffer("<H1>\n");
	}
	
	static public function leaveH1()
	{
		CORE_HTML::addBuffer("</H1>\n");
	}
	
	static public function enterH2()
	{
		CORE_HTML::addBuffer("<H2>");
	}
	
	static public function leaveH2()
	{
		CORE_HTML::addBuffer("</H2>\n");
	}
	
	static public function enterH3()
	{
		CORE_HTML::addBuffer("<H3>");
	}

	static public function leaveH3()
	{
		CORE_HTML::addBuffer("</H3>\n");
	}
	
	
	// ANCHOR
	static public function tagAnchor($arg_url, $arg_label, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$tmp = (is_null($arg_id) ? "" : " id='$arg_id'").(is_null($arg_class) ? "" : " class='$arg_class'").(is_null($arg_tag_opts) ? "" : " ".$arg_tag_opts);
		CORE_HTML::addBuffer("<A href='".$arg_url."' $tmp>".$arg_label."</A>\n");
	}
	
	static public function tagIconAnchor($arg_url, $arg_icon_file_path, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$tmp = "<img src='".$arg_icon_file_path."'/>".$arg_label;
		return CORE_HTML::tagAnchor($arg_url, $tmp, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagAddIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconAddUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagEditIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconEditUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagDeleteIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconDeleteUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagAlertIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconAlertUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	
	// DATA FORMAT TAGS
	static public function tagJsonIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconJsonUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagCsvIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconCsvUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagXlsIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconXlsUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function tagTxtIconAnchor($arg_url, $arg_label = "", $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$icon_file_path = Themes::getIconTxtUrl();
		CORE_HTML::tagIconAnchor($arg_url, $icon_file_path, $arg_label, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	
	// P
	static public function tagP($arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("P", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterP($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("P", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveP()
	{
		CORE_HTML::leaveTag("P");
	}
	
	// SPAWN
	static public function tagSPAN($arg_cell, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("SPAN", $arg_cell, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterSPAN($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("SPAN", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveSPAN()
	{
		CORE_HTML::leaveTag("SPAN");
	}
	
	// DIV
	static public function tagDIV($arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("DIV", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterDIV($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("DIV", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveDIV()
	{
		CORE_HTML::leaveTag("DIV");
	}
	
	
	// TABLE
	static public function enterTable($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TABLE", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTable()
	{
		CORE_HTML::leaveTag("TABLE");
	}
	
	// TABLE HEAD
	static public function enterTableHead($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("THEAD", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTableHead()
	{
		CORE_HTML::leaveTag("THEAD");
	}
	
	// TABLE FOOTER
	static public function enterTableFoot($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TFOOT", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTableFoot()
	{
		CORE_HTML::leaveTag("TFOOT");
	}
	
	// TH
	static public function tagTH($arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("TH", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterTH($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TH", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTH()
	{
		CORE_HTML::leaveTag("TH");
	}
	
	// TBODY
	static public function enterTableBody($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TBODY", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTableBody()
	{
		CORE_HTML::leaveTag("TBODY");
	}
	
	// ROW
	static public function enterTR($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TR", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTR()
	{
		CORE_HTML::leaveTag("TR");
	}
	
	static public function enterTableRow($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TR", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTableRow()
	{
		CORE_HTML::leaveTag("TR");
	}
	
	// TD
	static public function tagTD($arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("TD", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTD()
	{
		CORE_HTML::leaveTag("TD");
	}
	
	static public function enterTD($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TD", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterTableCell($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("TD", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveTableCell()
	{
		CORE_HTML::leaveTag("TD");
	}
	
	
	
	// UL
	static public function tagUL($arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("UL", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterUL($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("UL", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveUL()
	{
		CORE_HTML::leaveTag("UL");
	}
	
	// LI
	static public function tagLI($arg_text, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::tag("LI", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function enterLI($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("LI", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveLI()
	{
		CORE_HTML::leaveTag("LI");
	}
	
	
	// FORM
	static public function enterFORM($arg_id, $arg_name, $arg_method, $arg_action, $arg_classes = null, $arg_tag_opts = null)
	{
		$str_class	= ($arg_classes !== null and $arg_classes != "")	? " class='".$arg_classes."'" : "";
		$str_id		= ($arg_id !== null and $arg_id != "")		? " id='".$arg_id."'" : "";
		$str_name	= ($arg_name !== null and $arg_name != "")	? " name='".$arg_name."'" : "";
		$str_method	= ($arg_method !== null and $arg_method != "")	? " method='".$arg_method."'" : "";
		$str_action	= ($arg_action !== null and $arg_action != "")	? " action='".$arg_action."'" : "";
		
		CORE_HTML::addBufferLine("<FORM $str_class $str_id $str_name $str_method $str_action>");
		CORE_HTML::addBufferLine("<FIELDSET>");
	}
	
	static public function leaveFORM()
	{
		CORE_HTML::leaveTag("FIELDSET");
		CORE_HTML::leaveTag("FORM");
	}
	
	
	// SELECT
	static public function tagSELECT($arg_text, $arg_options, $arg_selected_index, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("SELECT", $arg_text, $arg_id, $arg_class, $arg_tag_opts);
		for($index = 0 ; $index < $arg_options ; ++$index)
		{
			$option = $arg_options[$index];
			CORE_HTML::tagOPTION($option, ( ! is_null($arg_selected_index) and $arg_selected_index == $index), null, null, null);
		}
		CORE_HTML::leaveTag("SELECT");
	}
	
	static public function enterSELECT($arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		CORE_HTML::enterTag("SELECT", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveSELECT()
	{
		CORE_HTML::leaveTag("SELECT");
	}
	
	
	// SELECT OPTION
	static public function tagOPTION($arg_text, $arg_selected = false, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$selected = $arg_selected ? " selected" : "";
		CORE_HTML::tag("OPTION", $arg_text, $arg_id, $arg_class, $selected." ".$arg_tag_opts);
	}
	
	static public function enterOPTION($arg_selected = false, $arg_id = null, $arg_class = null, $arg_tag_opts = null)
	{
		$selected = $arg_selected ? " selected" : "";
		CORE_HTML::enterTag("OPTION$selected", $arg_id, $arg_class, $arg_tag_opts);
	}
	
	static public function leaveOPTION()
	{
		CORE_HTML::leaveTag("OPTION");
	}
	
	
	// USEFULL
	static function htmlShowHideDivAnchor($arg_div_id, $arg_anchor_id, $arg_show_msg, $arg_hide_msg, $arg_default_msg)
	{
		$icon_hide = Themes::getPluginsUrl()."/apt-icons2/notes-reject.gif";
		$icon_show = Themes::getPluginsUrl()."/apt-icons2/notes-add.gif";
		
		echo("\n<DIV id='content_show_hide'>\n");
		echo("  <A id='".$arg_anchor_id."' href='#' onclick=\"showHideDivWithAnchor('".$arg_div_id."', '".$arg_anchor_id."', '".$arg_show_msg."', '".$arg_hide_msg."'); return false;\">\n");
		echo("    <IMG src='".$icon_hide."' />\n");
		echo("    $arg_default_msg\n");
		echo("  </A>\n");
		echo("</DIV>\n\n");
	}
	
	
	// CONVERT PHP TO JS
	static function jsConvertPhpArrayToArrayObject($arg_php_array, $arg_js_array)
	{
		$js = "";
		if ( ! is_null($arg_php_array) )
		{
			foreach($arg_php_array as $key => $value)
			{
				$js .= $arg_js_array."[\"$key\"]=\"$value\";\n";
			}
		}
		return $js;
	}
	static function jsConvertPhpArrayToArrayConstant($arg_php_array)
	{
		$js = "[";
		if ( ! is_null($arg_php_array) )
		{
			$index = 0;
			foreach($arg_php_array as $key => $value)
			{
				$js .= ($index == 0 ? "" : ",")."\"$value\"";
				$index++;
			}
		}
		$js .= "]";
		return $js;
	}
	
	static function jsConvertPhpArrayToLiteral($arg_php_array)
	{
		$js = "{";
		if ( ! is_null($arg_php_array) )
		{
			$index = 0;
			foreach($arg_php_array as $key => $value)
			{
				$js .= ($index == 0 ? "" : ",")."\"$key\":\"$value\"";
				$index++;
			}
		}
		$js .= "}";
		return $js;
	}
}

?>
