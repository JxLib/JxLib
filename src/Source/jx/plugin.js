/*
---

name: Jx.Plugin

description: Base class for all plugins

license: MIT-style license.

requires:
 - Jx.Lang
 - Jx.Options

provides: [Jx.Plugin]

...
 */
// $Id$
/**
 * Class: Jx.Plugin
 *
 * Extend: <Jx.Object>
 *
 * Base class for all plugins. In order for a plugin to be used it must
 * extend from this class.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */

define('jx/plugin', ['../base', './options', './lang' ], function(base, jxOptions, Lang){
    
    var plugin = new Class({
        
        Implements: [Options, Events, jxOptions, Lang],
        Family: "Jx.Plugin",
    
        options: {},
        
        bound: null,
        
        ready: null,
        
        initialize: function(){
            this.ready = false;
            
            this.bound = {};
            
            this.setOptions(this.determineOptions(arguments));
            
            this.setupLang();
            
            //no plugins of plugins crazy man!!!
            if (this.options.plugins !== undefined && this.options.plugins !== null) {
                delete this.options.plugins;
            }
            
            this.fireEvent('preInit');
            this.init();
            this.fireEvent('postInit');
            
            this.fireEvent('initializeDone');
            
            this.ready = true;
        },
        
        /**
         * APIMethod: init
         * used to place plugin-specific initialization code. Should
         * be overridden in sub-classes
         */
        init: function(){},
        
        /**
         * APIMethod: attach
         * Registers this plugin with the class it works on. Can be overridden to
         * setup the plugin but the parent must be called.
         */
        attach: function(obj){
            obj.registerPlugin(this);
        },
    
        /**
         * APIMethod: detach
         * Called to deregister the plugin with the object.
         */
        detach: function(obj){
            obj.deregisterPlugin(this);
        },
    
        /**
         * APIMethod: changeText
         * This method should be overridden by subclasses. It should be used
         * to change any language specific default text that is used by the widget.
         *
         * Parameters:
         * lang - the language being changed to or that had it's data set of
         *    translations changed.
         */
        changeText: function (lang) {
            //if the mask is being used then recreate it. The code will pull
            //the new text automatically
            if (this.busy) {
                this.setBusy(false);
                this.setBusy(true);
            }
        }
    });
    
    if (base.global) {
        base.global.Plugin = plugin;
    }
    
    return plugin;
});