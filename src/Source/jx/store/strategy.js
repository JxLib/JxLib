/*
---

name: Jx.Store.Strategy

description: Base class for all store strategies.

license: MIT-style license.

requires:
 - Jx.Store

provides: [Jx.Store.Strategy]


...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy
 * 
 * Extends: <Jx.Object>
 * 
 * Base class for all Jx.Store strategies
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */

define("jx/store/strategy", ['../../base','../object','../store'], function(base, jxObject, Store){
    
    var strategy = new Class({
    
        Extends: jxObject,
        Family: 'Jx.Store.Strategy',
        /**
         * APIProperty: store
         * The store this strategy is associated with
         */
        store: null,
        /**
         * APIProperty: active
         * whether this strategy has been activated or not.
         */
        active: null,
        
        /**
         * Method: init
         * initialize the strategy, should be called by subclasses
         */
        init: function () {
            this.parent();
            this.active = false;
        },
        /**
         * APIMethod: setStore
         * Associates this strategy with a particular store.
         */
        setStore: function (store) {
            if (store instanceof Store) {
                this.store = store;
                return true;
            }
            return false;
        },
        
        /**
         * APIMethod: activate
         * activates the strategy if it isn't already active.
         */
        activate: function () {
            if (!this.active) {
                this.active = true;
                return true;
            }
            return false;
        },
        /**
         * APIMethod: deactivate
         * deactivates the strategy if it is already active.
         */
        deactivate: function () {
            if (this.active) {
                this.active = false;
                return true;
            }
            return false;
        }
    });
    
    if (base.global) {
        base.global.Store.Strategy = strategy;
    }
    
    return strategy;
    
});