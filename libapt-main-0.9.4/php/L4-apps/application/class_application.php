<?php
/**
 * @file        class_application.php
 * @brief       Application main final class
 * @details     Launch application run code or application TU code
 * @see			AbstractApplication Controllers FileSessionEngine ArraySessionEngine Trace
 * @ingroup     L4_APPS
 * @date        2013-01-06
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
final class Application extends AbstractApplication
{
	// ----------------- STATIC CLASS ATTRIBUTES -----------------
	
	/// @brief		Trace or not (boolean)
	static public $TRACE_APPLICATION = false;
	
	
	
	// ----------------- CLASS INSTANCE ATTRIBUTES -----------------
	
	
	
	// ----------------- CLASS CONSTRUCTOR -----------------
	/**
	 * @brief		CONSTRUCTOR
	 * @param[in]	arg_session_engine		engine object to store sessions context
	 * @return		nothing
	 */
	protected function __construct($arg_session_engine)
	{
		parent::__construct($arg_session_engine);
	}
	
	
	/**
	 * @brief		get the singleton object of the Application class
	 * @return		object			Application instance singleton
	 */
	static public function getInstance()
	{
		$context = "Application.getInstance";
		
		if ( is_null(self::$_instance) )
		{
			// CHOOSE THE SESSION ENGINE
			$session_engine = null;
			if ( LIBAPT_APP_SESSION_FILE == "TRUE" )
			{
				TRACE::step($context, "File session engine creation", self::$TRACE_APPLICATION);
				$session_engine = new FileSessionEngine(LIBAPT_APP_ROOT."/".LIBAPT_APP_SESSION_FILE_PATH);
			}
			else
			{
				TRACE::step($context, "Array session engine creation", self::$TRACE_APPLICATION);
				$session_engine = new ArraySessionEngine();
			}
			
			// CREATE THE APPLICATION SINGLETON
			TRACE::step($context, "Application instance singleton creation", self::$TRACE_APPLICATION);
			$app = new Application($session_engine);
			self::$_instance = $app;
			
			return $app;
		}
		
		return self::$_instance;
	}
	
	
	
	// ----------------- APPLICATION RUNNING -----------------
	/**
	 * @brief		Application main function
	 * @return		boolean		true:success, false:failure
	 */
	public function run()
	{
		$context = "Application.run";
		
		try
		{
			// CHECK IF AUTHENTICATION IS NEEDED
			$show_login = Authentication::isEnabled();
			if ($show_login)
			{
				TRACE::step($context, "Authentication::isEnabled() is true", self::$TRACE_APPLICATION);
				
				if ( Authentication::isLogged() )
				{
					TRACE::step($context, "Authentication::isLogged() is true", self::$TRACE_APPLICATION);
					$show_login = false;
					
					// CHECK IF LOGOUT IS NEEDED
					if ( isset($_POST["logoutForm"]) && $_POST["logoutForm"] == "checkAuth" )
					{
						TRACE::step($context, "Logout is needed", self::$TRACE_APPLICATION);
						
						Authentication::logout();
						Application::getInstance()->stopSession();
						$show_login = true;
					}
					else
					{
						TRACE::step($context, "Logout is not needed", self::$TRACE_APPLICATION);
					}
				}
				else
				{
					TRACE::step($context, "Authentication::isLogged() is false", self::$TRACE_APPLICATION);
					
					// RESET CREDENTIALS
					$login    = null;
					$password = null;
					
					// CHECK IF AUTO LOGIN IS ENABLED AND GET CREDENTIALS
					if ( $this->hasAutoLogin() )
					{
						TRACE::step($context, "Auto login is enabled", self::$TRACE_APPLICATION);
						$login    = $this->getAutoLogin();
						$password = md5($this->getAutoPassword());
					}
					
					// CHECK IF LOGIN IS NEEDED AND GET CREDENTIALS
					else if ( isset($_POST["loginForm"]) && $_POST["loginForm"] == "checkAuth" )
					{
						TRACE::step($context, "Check login credentials is needed", self::$TRACE_APPLICATION);
						
						$login    = $this->getRequest()->getSanitizedValueFromForm("login",    null, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^[a-zA-Z0-9_]{3,20}$/")), FILTER_UNSAFE_RAW, null);
						$password = $this->getRequest()->getSanitizedValueFromForm("password", null, FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^.+$/") ), FILTER_UNSAFE_RAW, null);
					}
					
					// CHECK LOGIN
					if ( ! is_null($login) && ! is_null($password) )
					{
						TRACE::step($context, "Check login credentials", self::$TRACE_APPLICATION);
						$check_login = Authentication::login($login, $password);
						
						if ($check_login)
						{
							TRACE::step($context, "Login success", self::$TRACE_APPLICATION);
							$show_login = false;
							TRACE::trace_var($context, "login", $login, self::$TRACE_APPLICATION);
							TRACE::trace_var($context, "password", $password, self::$TRACE_APPLICATION);
						}
						else
						{
							TRACE::step($context, "Login failed", self::$TRACE_APPLICATION);
							TRACE::trace_var($context, "login", $login, self::$TRACE_APPLICATION);
							TRACE::trace_var($context, "password", $password, self::$TRACE_APPLICATION);
							TRACE::trace_var($context, "check_login", $check_login, self::$TRACE_APPLICATION);
						}
					}
					else
					{
						TRACE::step($context, "Check login credentials is not needed", self::$TRACE_APPLICATION);
					}
				}
			}
			else
			{
				TRACE::step($context, "Authentication::isEnabled() is false", self::$TRACE_APPLICATION);
			}
			
			
			// SHOW LOGIN
			if ($show_login == true)
			{
				TRACE::step($context, "Show login is needed", self::$TRACE_APPLICATION);
				
				// USE HEADERS
				HTML::useStandardHeaders();
				
				// GET RESPONSE
				$response = Application::getInstance()->getResponse();
				
				// GENERATE HTML PAGE
				$response->generateHtmlLoginPage();
			}
			else
			{
				TRACE::step($context, "Show login is not needed", self::$TRACE_APPLICATION);
				
				// DISPATCH THE URL ACTIONS TO THE CORRESPONDING CONTROLLERS
				$request = Application::getInstance()->getRequest();
				$request_params_keys = $request->getParametersKeys();
				TRACE::trace_var($context, "request_params_key", $request_params_keys, self::$TRACE_APPLICATION);
				
				$result = Controllers::dispatchUrl($request_params_keys);
				TRACE::trace_var($context, "Controllers::dispatchUrl(...) result", $result, self::$TRACE_APPLICATION);
				
				// CREATE AN ERROR ENTRY IF NEEDED
				if ( ! $result && ! Errors::hasErrors() )
				{
					TRACE::step($context, "Display error page", self::$TRACE_APPLICATION);
					
					// USE HEADERS
					HTML::useStandardHeaders();
					ERRORS::errorApplication("Not trapped dispatcher error");
				}
			}
		}
		catch(PHPErrorException $e)
		{
			TRACE::addErrorMsg($context, "PHPErrorException:".$e->__toString(), self::$TRACE_APPLICATION);
			ERRORS::errorApplication($e->getMessage());
			return false;
		}
		catch(RessourcesException $e)
		{
			TRACE::addErrorMsg($context, "RessourcesException:".$e->__toString(), self::$TRACE_APPLICATION);
			ERRORS::errorApplicationInit($e->getMessage());
			return false;
		}
		catch(ContractException $e)
		{
			TRACE::addErrorMsg($context, "ContractException:".$e->__toString(), self::$TRACE_APPLICATION);
			ERRORS::errorContract($e->getMessage());
			return false;
		}
		
		return true;
	}
	
	
	/**
	 * @brief		Application main function for unit testing
	 * @return		boolean		true:success, false:failure
	 */
	public function runTU()
	{
		$context = "Application.runTU";
		
		// CHECK TU
		if ( ! Application::getInstance()->hasRunTU() )
		{
			TRACE::addErrorMsg($context, "Application is not in TU mode", self::$TRACE_APPLICATION);
			return false;
		}
		
		// LOAD TU CODE
		require_once(LIBAPT_MAIN_TU_ROOT."/includes_tu.php");
		
		// RUN TU
		try
		{
			TRACE::step($context, "Launch main_tu()", self::$TRACE_APPLICATION);
			main_tu();
		}
		catch(RessourcesException $e)
		{
			TRACE::addErrorMsg($context, "RessourcesException:".$e->__toString(), self::$TRACE_APPLICATION);
			ERRORS::errorApplicationInit($e->getMessage());
			return false;
		}
		catch(ContractException $e)
		{
			TRACE::addErrorMsg($context, "ContractException:".$e->__toString(), self::$TRACE_APPLICATION);
			ERRORS::errorContract($e->getMessage());
			return false;
		}
		
		return true;
	}
}
?>