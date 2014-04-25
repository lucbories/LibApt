<?php
/**
 * @version		$Id: class_errors_view.php 2012-01-15 LBO $
 * @package		A PHP TOOLKIT (APT) Library
 * @subpackage	libapt-main/views
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */
class ErrorsView extends AbstractViewImpl
{
	// ATTRIBUTES
	
	
	// CONSTRUCTOR
	public function __construct($arg_unique_name, $arg_parent_view, $arg_options)
	{
		// PARENT CONSTRUCTOR
		parent::__construct($arg_unique_name, $arg_parent_view, $arg_options);
	}
	
	
	// RENDER HTML
	protected function assocArrayToString($arg_assoc_array, $arg_eol = "<BR>")
	{
		return implode(
			array_map(
				create_function('$key, $value', 'return $key."=".$value."'.$arg_eol.'";'),
				array_keys($arg_assoc_array),
				array_values($arg_assoc_array)
				)
			);
	}
	
	public function html()
	{
		if ($this->need_init)
		{
			$this->init();
		}
		
		$errors = Errors::getErrors();
		
		HTML::addBufferLine("<TABLE>\n");
		HTML::addBufferLine(" <THEAD id=messages_thead>\n");
		HTML::addBufferLine("  <TH WIDTH=150 ALIGN='CENTER'>SOURCE</TH>\n");
		HTML::addBufferLine("  <TH WIDTH=250 ALIGN='LEFT'>LABEL</TH>\n");
		HTML::addBufferLine("  <TH WIDTH=150 ALIGN='CENTER'>ARG 1</TH>\n");
		HTML::addBufferLine("  <TH WIDTH=150 ALIGN='CENTER'>ARG 2</TH>\n");
		HTML::addBufferLine("  <TH WIDTH=150 ALIGN='CENTER'>ARG 3</TH>\n");
		HTML::addBufferLine("  <TH WIDTH=150 ALIGN='CENTER'>ARG 4</TH>\n");
		HTML::addBufferLine(" </THEAD>\n");
		
		// LOOP ON ERRORS
		foreach($errors as $error)
		{
			$source = $error["source"];
			$label  = $error["label"];
			$args   = $error["args"];
			$arg1   = "";
			$arg2   = "";
			$arg3   = "";
			$arg4   = "";
			$args_count = count($args);
			if ( ! is_null($args) and $args_count > 0)
			{
				$arg1 = $args[0];
				if ($args_count > 1)
				{
					$arg2 = $args[1];
					if ( is_array($args[1]) )
					{
						$arg2 = $this->assocArrayToString( $args[1] );
					}
					if ($args_count > 2)
					{
						$arg3 = $args[2];
						if ( is_array($args[2]) )
						{
							$arg3 = $this->assocArrayToString( $args[2] );
						}
						if ($args_count > 3)
						{
							$arg4 = $args[3];
							if ( is_array($args[3]) )
							{
								$arg4 = $this->assocArrayToString( $args[3] );
							}
						}
					}
				}
			}
			HTML::addBufferLine("<TR>");
			HTML::addBufferLine("<TD WIDTH=150 ALIGN='CENTER'>$source</TD>");
			HTML::addBufferLine("<TD WIDTH=250 ALIGN='LEFT'>$label</TD>");
			HTML::addBufferLine("<TD WIDTH=150 ALIGN='CENTER'>$arg1</TD>");
			HTML::addBufferLine("<TD WIDTH=150 ALIGN='CENTER'>$arg2</TD>");
			HTML::addBufferLine("<TD WIDTH=150 ALIGN='CENTER'>$arg3</TD>");
			HTML::addBufferLine("<TD WIDTH=150 ALIGN='CENTER'>$arg4</TD>");
			HTML::addBufferLine("</TR>\n");
		}
		
		HTML::addBufferLine("</TABLE>\n");
	}
}
?>