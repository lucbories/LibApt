<?php
/**
 * @file        class_sql_groups_helpers.php
 * @brief       ...
 * @details     ...
 * @see			Trace Type
 * @ingroup     L1_STORAGE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * @todo		write api documentation
 */
class SQLGroupsHelpers
{
	private static $context = "SQLGroupsHelpers.getGroupSQLString";
	
	// SQL GROUP STRING
	static public function getGroupSQLString($arg_fields, $arg_groups)
	{
		TRACE::enter(self::$context, "", SQLSelectHelpers::$TRACE_SELECT);
		TRACE::trace_var(self::$context, "arg_fields", $arg_fields, SQLSelectHelpers::$TRACE_SELECT);
		TRACE::trace_var(self::$context, "arg_groups", $arg_groups, SQLSelectHelpers::$TRACE_SELECT);
		
		$group = "";
		if ( ! is_null($arg_groups) )
		{
			TRACE::step(self::$context, "Process groups", SQLSelectHelpers::$TRACE_SELECT);
			
			foreach($arg_groups AS $key => $group_object)
			{
				TRACE::step(self::$context, "Process group object", SQLSelectHelpers::$TRACE_SELECT);
				TRACE::trace_var(self::$context, "group_object", $group_object, SQLSelectHelpers::$TRACE_SELECT);
				
				if ($group_object instanceof Group)
				{
					// GET FIEL NAME
					$group_field_name = $group_object->getFieldName();
					TRACE::trace_var(self::$context, "group_field_name", $group_field_name, SQLSelectHelpers::$TRACE_SELECT);
					
					// CHECK FIELD NAME
					if ( ! array_key_exists($group_field_name, $arg_fields) )
					{
						return TRACE::leaveko(self::$context, "group field [$group_field_name] not found in fields array keys", null, SQLSelectHelpers::$TRACE_SELECT);
					}
					
					// GET FIELD OBJECT
					$field_object = $arg_fields[$group_field_name];
					if ( (! is_null($field_object) ) && $field_object instanceof Field)
					{
						$group_column = $field_object->getAttribute("sql_alias");
						if ($group != "")
						{
							$group .= ", ";
						}
						$group .= $group_column;
					}
					else
					{
						return TRACE::leaveko(self::$context, "group field is null or isn't a Field class or subclass", null, SQLSelectHelpers::$TRACE_SELECT);
					}
				}
				else
				{
					return TRACE::leaveko(self::$context, "group object isn't an Group class or subclass", null, SQLSelectHelpers::$TRACE_SELECT);
				}
			}
		}
		return  TRACE::leaveok(self::$context, "success", $group, SQLSelectHelpers::$TRACE_SELECT);;
	}
}


?>
