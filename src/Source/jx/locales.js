/**
 * This file is used to autoload all of the necessary locale files
 */

define('jx/locales',['base','require'], function(base, require){
    require(['jx!locale.english','jx!locale.german','jx!locale.russian','jx!locale.spanish']);
    return {};
});