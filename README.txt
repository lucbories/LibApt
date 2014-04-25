/**
 * @version		$Id: README.txt 2013-01-13 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


see www.libapt.org for more informations.


WELCOME !

LIBAPT aka A PHP Toolkit library is a project to help to create web applications (on the internet or into the enterprise) with less code as possible.
The concept is to declare db connexions, datas models, display views, page menus, configure the index.php and GO ! The application is running.

For instance, LIBAPT is still in development but runable.
It is very usefull for applications with databases access and with table presentation.

LIBAPT use PHP / HTML / CSS / JAVASCRIPT. The limit between server side or browser side code is very difficult to find in every situations and is still moving. So some code display initial state from PHP code but refresh the view in browser side. That's a point of progess.

If you need to write a browser side javascrip application, LIBAPT isn't the best way, see others full javascript toolkits.
But if you need to write a server and browser side application with datas access, LIBAPT can help you.
Be carefull, LIBAPT use declarative concept so you write wonfiguration files but not all the code.
You can provide an application with databases access without writing any code : write db/models/views/menus configuration files html templates and update the index.php and load.php, that's all !



SECURITY CONFIGURATION : (do not permit to see configuration files)
Edit .htaccess into the root of your web server space :
	Options -Indexes

	<Files .htaccess>
			order allow,deny
			deny from all
	</Files>
	<Files *.ini>
			order allow,deny
			deny from all
	</Files>
	<Files *.cfg>
			order allow,deny
			deny from all
	</Files>
	<Files *.csv>
			order allow,deny
			deny from all
	</Files>
	<Files *.template>
			order allow,deny
			deny from all
	</Files>
	<Files *.template.*>
			order allow,deny
			deny from all
	</Files>
	<Files *.html>
			order allow,deny
			deny from all
	</Files>
	<Files *.html.*>
			order allow,deny
			deny from all
	</Files>
	<Files *.php>
			order allow,deny
			deny from all
	</Files>
	<Files index.php>
			order allow,deny
			allow from all
	</Files>



CREATE A SIMPLE APPLICATION (see online howto)

Standard files tree for a lonely application ('myapp'):

on the root web server :
libapt/
	libapt-client-x.y.z
	libapt-server-x.y.z
	libapt-static-x.y.z
myapp/								Application root directory
	css/							Application CSS files
	datas/							Application write directory
		cache/						Application cache directory
		sessions/					Application session directory
		traces.log					Application debug traces files
	images/							Application images files
	js/							Application javascript files
	modules/						Application features directory
		home/						Application home feature
			content1.include			Application HTML content
			content2.include			Application HTML content
			menus.ini				Application menus declaration
			views.ini				Application views declaration
		load.php					Application modules resources loading
	license.txt						Application license file if needed
	app_cfg.php						Application main configuration
	index.php						Application main file (DO NOT MODIFY THIS FILE)
	load.php						Application resources loading
		
NB:
datas/ is the only one root directory for write operations.
cache/ and sessions/ directory are imperative even if not used.
each application feature has its own module directory.
HTML content include files has only usefull HTML content, no header, no footer.

