<?php
/**
 * @defgroup    L0_CORE			Libapt-main : core features
 * @ingroup		LIBAPT_MAIN
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/**
 * @file        L0-core/includes.php
 * @brief       Core features include file
 * @details     Includes all PHP files of the LIBAPT-MAIN/L0-CORE module
 * @ingroup		L0_CORE
 * @date        2012-11-07
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

/// @brief		current layer path name
$layer = "L0-core";

// INIT TRACES
load_class("$layer/trace/api", "abstract_trace");
load_class("$layer/trace", "trace");
TRACE::init();

// API
load_class("$layer/api", "named");
load_class("$layer/api", "named_session_properties");
load_class("$layer/api", "abstract_controlled");
load_class("$layer/api", "abstract_controlled_impl");
load_class("$layer/api", "abstract_loader_adapter");


// CONTRACT
load_class("$layer/contract/api", "abstract_assert");
load_class("$layer/contract/api", "abstract_assert_impl");
load_class("$layer/contract/api", "abstract_unit_tests");
load_class("$layer/contract", "contract_exception");
load_class("$layer/contract", "contract_exception_adapter");
load_class("$layer/contract", "contract");


// CACHE
load_class("$layer/cache", "abstract_cache_adapter");
load_class("$layer/cache", "file_cache_adapter");
load_class("$layer/cache", "cache");


// HTML
load_class("$layer/html/api", "abstract_html_accordion_adapter");
load_class("$layer/html/api", "abstract_html_grid_layout_adapter");
load_class("$layer/html/api", "abstract_html_input_adapter");
load_class("$layer/html/api", "abstract_html_portlet_adapter");
load_class("$layer/html/api", "abstract_html_select_adapter");
load_class("$layer/html/api", "abstract_html_table_adapter");

load_class("$layer/html", "themes");
load_class("$layer/html", "core_html");
load_class("$layer/html", "html");
load_class("$layer/html", "default_input_adapter");
load_class("$layer/html", "request");
load_class("$layer/html", "response");


// SESSION STORAGE
load_class("$layer/session/api", "abstract_session_engine");
load_class("$layer/session", "array_session_engine");
load_class("$layer/session", "file_session_engine");


// USEFULL CLASSES AND FUNCTIONS
load_class("$layer/lib", "timer");
load_class("$layer/lib", "connection");
load_class("$layer/lib", "lazy_object");

// MENUS
load_class("$layer/menus", "menu_item");
load_class("$layer/menus", "menu_bar");




// FIELDS
load_class("$layer/field/api", "abstract_field");
load_class("$layer/field/api", "abstract_field_impl");

load_class("$layer/field", "predefined_inputs");
load_class("$layer/field", "type");
load_class("$layer/field", "field");
load_class("$layer/field", "sql_field");
load_class("$layer/field", "group");
load_class("$layer/field", "order");
load_class("$layer/field", "fields_set");


// FILTERS
load_class("$layer/filter", "filter");
load_class("$layer/filter", "filters_chain");


// SECURITY
load_class("$layer/security/api", "abstract_authentication");
load_class("$layer/security/api", "abstract_authorization");
load_class("$layer/security/api", "abstract_role_authorization");

load_class("$layer/security", "authentication");
load_class("$layer/security", "map_role_authorization");
load_class("$layer/security", "authorization");




// ************************************************************************
// INT TRACE OF : L0-CORE
// ************************************************************************

	// API
Named::$TRACE_NAMED									= false;
AbstractSessionEngine::$TRACE_SESSION_ENGINE		= false;
AbstractLoaderAdapter::$TRACE_ABSTRACT_LOADER		= false;

	// FIELD
AbstractField::$TRACE_FIELD							= false;
AbstractControlled::$TRACE_CONTROLLED				= false;
FieldsSet::$TRACE_FIELDSSET							= false;
Order::$TRACE										= false;
Type::$TRACE_TYPE									= false;

	// FILTER
Filter::$TRACE										= false;
FiltersChain::$TRACE								= false;

	// HTML
AbstractHtmlInputAdapter::$TRACE_ABSTRACT_INPUT_ADAPTER	= false;
Request::$TRACE_REQUEST								= false;
Response::$TRACE_RESPONSE							= false;
Response::$TRACE_RESPONSE_ERROR						= false;
Response::$TRACE_RESPONSE_LEAVE_OK					= false;

	// LIB
Connection::$TRACE									= false;
TRACE::$DO_NOT_TRACE_LEAVEOK						= false;
TRACE::$TRACE_LEAVEOK								= true;
TRACE::$USE_ECHO									= false;

	// SECURITY
MapRoleAuthorization::$TRACE_MAP_ROLE_AUTH			= false;

	// SESSION
	


// BACKPORT FROM 5.3.1 TO 5.2 OF THE FUNCTION 'date_parse_from_format'
if( ! function_exists('date_parse_from_format') )
{
    function date_parse_from_format($format, $date)
	{
        // reverse engineer date formats
        $keys = array(
            'Y' => array('year', '\d{4}'),              //Année sur 4 chiffres
            'y' => array('year', '\d{2}'),              //Année sur 2 chiffres
            'm' => array('month', '\d{2}'),             //Mois au format numérique, avec zéros initiaux
            'n' => array('month', '\d{1,2}'),           //Mois sans les zéros initiaux
            'M' => array('month', '[A-Z][a-z]{3}'),     //Mois, en trois lettres, en anglais
            'F' => array('month', '[A-Z][a-z]{2,8}'),   //Mois, textuel, version longue; en anglais, comme January ou December
            'd' => array('day', '\d{2}'),               //Jour du mois, sur deux chiffres (avec un zéro initial)
            'j' => array('day', '\d{1,2}'),             //Jour du mois sans les zéros initiaux
            'D' => array('day', '[A-Z][a-z]{2}'),       //Jour de la semaine, en trois lettres (et en anglais)
            'l' => array('day', '[A-Z][a-z]{6,9}'),     //Jour de la semaine, textuel, version longue, en anglais
            'u' => array('hour', '\d{1,6}'),            //Microsecondes
            'h' => array('hour', '\d{2}'),              //Heure, au format 12h, avec les zéros initiaux
            'H' => array('hour', '\d{2}'),              //Heure, au format 24h, avec les zéros initiaux
            'g' => array('hour', '\d{1,2}'),            //Heure, au format 12h, sans les zéros initiaux
            'G' => array('hour', '\d{1,2}'),            //Heure, au format 24h, sans les zéros initiaux
            'i' => array('minute', '\d{2}'),            //Minutes avec les zéros initiaux
            's' => array('second', '\d{2}')             //Secondes, avec zéros initiaux
        );

        // convert format string to regex
        $regex = '';
        $chars = str_split($format);
        foreach ( $chars AS $n => $char ) {
            $lastChar = isset($chars[$n-1]) ? $chars[$n-1] : '';
            $skipCurrent = '\\' == $lastChar;
            if ( !$skipCurrent && isset($keys[$char]) ) {
                $regex .= '(?P<'.$keys[$char][0].'>'.$keys[$char][1].')';
            }
            else if ( '\\' == $char ) {
                $regex .= $char;
            }
            else {
                $regex .= preg_quote($char);
            }
        }

        $dt = array();
        $dt['error_count'] = 0;
        // now try to match it
        if( preg_match('#^'.$regex.'$#', $date, $dt) ){
            foreach ( $dt AS $k => $v ){
                if ( is_int($k) ){
                    unset($dt[$k]);
                }
            }
            if( !checkdate($dt['month'], $dt['day'], $dt['year']) ){
                $dt['error_count'] = 1;
            }
        }
        else {
            $dt['error_count'] = 1;
        }
        $dt['errors'] = array();
        $dt['fraction'] = '';
        $dt['warning_count'] = 0;
        $dt['warnings'] = array();
        $dt['is_localtime'] = 0;
        $dt['zone_type'] = 0;
        $dt['zone'] = 0;
        $dt['is_dst'] = '';
        return $dt;
    }
}
?>