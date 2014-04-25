<?php
HTML::addBufferLine("\n\n<!-- ************************************************************************************* -->");
HTML::addBufferLine("<!-- BEGIN OF FILE : include_footer -->");

HTML::enterRowLayout("apt_footer");
	HTML::enterColumnsLayout(10, true, "apt_footer_middle");
	
			$link = "http://foundation.zurb.com/";
			$label = "Using Foundation";
			HTML::tagAnchor($link, $label, null, "blue");
			
			$link = "http://jquery.com";
			$logo = Application::getInstance()->getBaseUrl()."images/jQuery_logo_color_ondark.png";
			$label = "<img src='$logo' alt='jQuery'/>";
			HTML::tagAnchor($link, $label, null, "blue apt_footer_logo");
			
			// $link = "http://jqueryui.com";
			// $logo = Application::getInstance()->getBaseUrl()."images/jQuery__UI_logo_color_ondark.png";
			// $label = "<img src='$logo' alt='jQuery UI'/>";
			// HTML::tagAnchor($link, $label, null, "blue apt_footer_logo");
			
			// $link = "mailto:".Application::getInstance()->getAuthorEmail();
			// $label = "Contact";
			// HTML::tagAnchor($link, $label, null, "blue");
			
			$link = "http://www.libapt.org";
			// $logo = Application::getInstance()->getBaseUrl()."images/logo_libapt_2.jpg";
			// $label = "<img src='$logo' alt='Powered by LIBAPT'/>";
			$label = "Powered by LIBAPT";
			HTML::tagAnchor($link, $label, null, "blue apt_footer_logo");
			
			// $link = "http://premiumsoftware.net/cleditor";
			// $logo = Application::getInstance()->getBaseUrl()."images/logo_cleditor.png";
			// $label = "<img src='$logo' alt='CLEditor'/>CLEditor";
			// HTML::tagAnchor($link, $label, null, "blue apt_footer_logo");
			
	HTML::leaveColumnsLayout();
HTML::leaveRowLayout();

HTML::addBufferLine("<!-- END OF FILE : include_footer -->");
HTML::addBufferLine("<!-- ************************************************************************************* -->");
?>