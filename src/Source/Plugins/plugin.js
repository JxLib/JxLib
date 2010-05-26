/*
---

name: Jx.Plugin

description: Base class for all plugins

license: MIT-style license.

requires:
 - Jx.Object

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
Jx.Plugin = new Class({

    Family: "Jx.Plugin",

    Extends: Jx.Object,

    options: {},

    /**
     * APIMethod: attach
     * Empty method that must be overridden by subclasses. It is
     * called by the user of the plugin to setup the plugin for use.
     */
    attach: function(obj){
        obj.registerPlugin(this);
    },

    /**
     * APIMethod: detach
     * Empty method that must be overridden by subclasses. It is
     * called by the user of the plugin to remove the plugin.
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