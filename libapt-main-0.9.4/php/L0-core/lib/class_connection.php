<?php
/**
 * @file        class_connection.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt || http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class Connection extends Named
{
	// STATIC ATTRIBUTES
	static public $TRACE		= false;
	
	// ATTRIBUTES
	protected $engine			= null;
	protected $host				= null;
	protected $port				= null;
	protected $database_name	= null;
	protected $user_name		= null;
	protected $user_pwd			= null;
	protected $options			= null;
	protected $link				= null;
	
	
	// CONSTRUCTEUR
	public function __construct($arg_name, $arg_engine, $arg_host, $arg_port, $arg_database_name, $arg_user_name, $arg_user_pwd, $arg_options)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_name);
		
		// SET ATTRIBUTES
		$this->engine			= $arg_engine;
		$this->host				= $arg_host;
		$this->port				= $arg_port;
		$this->database_name	= $arg_database_name;
		$this->user_name		= $arg_user_name;
		$this->user_pwd			= $arg_user_pwd;
		$this->options			= $arg_options;
		
		// INIT CONNECTION
		$this->init();
	}
	
	
	// ATTRIBUTES ACCESSORS
	public function getEngine()
	{
		return $this->engine;
	}
	
	public function getHost()
	{
		return $this->host;
	}
	
	public function getPort()
	{
		return $this->port;
	}
	
	public function getDatabaseName()
	{
		return $this->database_name;
	}
	
	public function getUserName()
	{
		return $this->user_name;
	}
	
	public function getOptions()
	{
		return $this->options;
	}
	
	public function getLink()
	{
		return $this->link;
	}
	
	
	// CONNECTION OPERATIONS
	public function init()
	{
		$context = "Connection.init($this->engine, $this->user_name, $this->database_name)";
		
		// CREATION DE LA CONNECTION MYSQL
		if ( $this->engine == "MYSQL" )
		{
			$this->link = mysql_connect($this->host.":".$this->port, $this->user_name, $this->user_pwd);
			
			if ($this->link === null || !$this->link)
			{
				return TRACE::leaveko($context, "Erreur BD - link", false);
			}
			
			// DEFAULT DATABASE SELECTION
			$resultat = mysql_select_db($this->database_name, $this->link);
			if ($resultat === null || !$resultat)
			{
				return TRACE::leaveko($context, "Erreur BD - db select", false);
			}
			
			// CHARSET SELECTION
			$resultat = mysql_set_charset('utf8', $this->link);
			if ( ! $resultat )
			{
				return TRACE::leaveko($context, "Error during utf8 charset selection for MYSQL", false, true);
			}
			
			return true;
		}
		
		// CREATION DE LA CONNECTION MYSQLi
		if ( $this->engine == "MYSQLI" )
		{
			if ( array_key_exists("socket", $arg_options) )
			{
				$this->link = mysqli_connect($this->host, $this->user_name, $this->user_pwd, $this->database_name, $this->port, $arg_options["socket"]);
			}
			else
			{
				$this->link = mysqli_connect($this->host, $this->user_name, $this->user_pwd, $this->database_name, $this->port);
			}
			
			if (mysqli_connect_errno() || is_null($this->link) || ! $this->link)
			{
				return TRACE::leaveko($context, "Erreur BD - link", false);
			}
			
			// CHARSET SELECTION
			$resultat = mysqli_set_charset($this->link, 'utf8');
			if ( ! $resultat )
			{
				return TRACE::leaveko($context, "Error during utf8 charset selection for MYSQLI", false, true);
			}
			
			return true;
		}
		
		// LDAP
		if ( $this->engine == "LDAP" )
		{
			ldap_set_option($cnx, LDAP_OPT_PROTOCOL_VERSION, 3);
			
			$this->link = ldap_connect($this->host, $this->port);
			CONTRACT::assertTrue($context.".connect", $this->link);
			
			CONTRACT::assertTrue($context.".bind", ldap_bind($this->link, $this->user_name, $this->user_pwd) );
			
			return true;
		}
		
		TRACE::addErrorMsg($context, "Engine not implemented");
		return false;
	}
}


?>
