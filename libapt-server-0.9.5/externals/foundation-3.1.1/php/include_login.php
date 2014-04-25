<?php
HTML::enterRowLayout("login");
	HTML::enterColumnsLayout(4, true);
		HTML::addBufferLine("<form id='login_form' method='post' class='nice' action='".Urls::getHomeUrl()."' onSubmit='preparePass()'>");
			HTML::addBufferLine("<input type='hidden' name='loginForm' value='checkAuth' />");
			HTML::addBufferLine("<p>");
				HTML::addBufferLine("<label for='login'>Login</label>");
				HTML::addBufferLine("<input class='input-text' type='text' name='login' id='login' value='' />");
			HTML::addBufferLine("</p>");
			HTML::addBufferLine("<p>");
				$login_img = THEMES::getIconUrl('login_64');
				HTML::addBufferLine("<label for='password'>Password</label>");
				HTML::addBufferLine("<input class='input-text' type='password' name='password' id='password' value='' />");
			HTML::addBufferLine("</p>");
			HTML::addBufferLine("<p style='line-height:64px; height:64px; vertical-align:middle; text-align:left;'>");
				HTML::addBufferLine("<img src='$login_img' alt='login icon' style='line-height:64px; height:64px; vertical-align:middle;'></img>");
				HTML::addBufferLine("<input type='submit' name='submit' value='Login' class='button' style='vertical-align:middle;'/>");
			HTML::addBufferLine("</p>");
		HTML::addBufferLine("</form>");
	HTML::leaveColumnsLayout();
HTML::leaveRowLayout();
?>
<!-- container -->
<script language="javascript">
function preparePass() {
		var value = $('#password').attr('value');
	    var str = MD5(value);
		$('#password').attr('value', str);
	    return false;
	  }
</script>