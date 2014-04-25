<?php
/**
 * @file        class_timer.php
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
class Timer
{
	// ATTRIBUTES
	protected $classname = null;
	protected $start     = 0;
	protected $stop      = 0;
	protected $elapsed   = 0;
	
	// CONSTRUCTOR
	public function __construct($arg_start = true)
	{
		if ( $arg_start )
		{
			$this->start();
		}
	}
	
	
	// TIMER OPERATIONS
	public function start()
	{ 
		$this->start = microtime(true);
	}
	
	public function stop()
	{ 
		$this->stop    = microtime(true);
		$this->elapsed = $this->stop - $this->start;
	}
	
	public function getElapsed()
	{
		if ( ! $this->elapsed )
		{
			$this->stop();
		}
		return $this->elapsed;
	}
	
	public function reset()
	{
		$this->start   = 0;
		$this->stop    = 0;
		$this->elapsed = 0;
	}
}