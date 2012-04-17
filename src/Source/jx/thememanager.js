/*
---

name: Jx.ThemeManager

description: Theme Manager singleton object

license: MIT-style license.

requires:
 - Jx.Object
 

provides: [Jx.ThemeManager]

...
 */

define('jx/thememanager',['../base', './object'], function(base, jxObject){
    
    var themeManager = new (new Class({
        Extends: jxObject,
        Family: 'Jx.ThemeManager',
        
        options: {
            
        },
        
        activeTheme: base.theme,
        
        init: function(){
            
        }
    }))();
    
    if (base.global) {
        base.global.ThemeManager = themeManager;
    }
    
    return themeManager;
    
});