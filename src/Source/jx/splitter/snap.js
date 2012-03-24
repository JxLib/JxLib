/*
---

name: Jx.Splitter.Snap

description: A helper class to create an element that can snap a split panel open or closed.

license: MIT-style license.

requires:
 - Jx.Splitter

provides: [Jx.Splitter.Snap]

...
 */
// $Id$
/**
 * Class: Jx.Splitter.Snap
 *
 * Extends: <Jx.Object>
 *
 * A helper class to create an element that can snap a split panel open or
 * closed.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define("jx/splitter/snap", ['../../base','../object'],
       function(base, jxObject){
    
    var snap = new Class({
        Extends: jxObject,
        Family: 'Jx.Splitter.Snap',
        /**
         * Property: snap
         * {HTMLElement} the DOM element of the snap (the thing that gets
         * clicked).
         */
        snap: null,
        /**
         * Property: element
         * {HTMLElement} An element of the <Jx.Splitter> that gets controlled
         * by this snap
         */
        element: null,
        /**
         * Property: splitter
         * {<Jx.Splitter>} the splitter that this snap is associated with.
         */
        splitter: null,
        /**
         * Property: layout
         * {String} track the layout of the splitter for convenience.
         */
        layout: 'vertical',
        /**
         * Parameters:
         * snap - {HTMLElement} the clickable thing that snaps the element
         *           open and closed
         * element - {HTMLElement} the element that gets controlled by the snap
         * splitter - {<Jx.Splitter>} the splitter that this all happens inside of.
         */
        parameters: ['snap','element','splitter','events'],
    
        /**
         * APIMethod: init
         * Create a new Jx.Splitter.Snap
         */
        init: function() {
            this.snap = this.options.snap;
            this.element = this.options.element;
            this.splitter = this.options.splitter;
            this.events = this.options.events;
            var jxl = this.element.retrieve('jxLayout');
            jxl.addEvent('sizeChange', this.sizeChange.bind(this));
            this.layout = this.splitter.options.layout;
            var jxo = jxl.options;
            var size = this.element.getContentBoxSize();
            if (this.layout == 'vertical') {
                this.originalSize = size.height;
                this.minimumSize = jxo.minHeight ? jxo.minHeight : 0;
            } else {
                this.originalSize = size.width;
                this.minimumSize = jxo.minWidth ? jxo.minWidth : 0;
            }
            this.events.each(function(eventName) {
                this.snap.addEvent(eventName, this.toggleElement.bind(this));
            }, this);
        },
    
        /**
         * Method: toggleElement
         * Snap the element open or closed.
         */
        toggleElement: function() {
            var size = this.element.getContentBoxSize();
            var newSize = {};
            if (this.layout == 'vertical') {
                if (size.height == this.minimumSize) {
                    newSize.height = this.originalSize;
                } else {
                    this.originalSize = size.height;
                    newSize.height = this.minimumSize;
                }
            } else {
                if (size.width == this.minimumSize) {
                    newSize.width = this.originalSize;
                } else {
                    this.originalSize = size.width;
                    newSize.width = this.minimumSize;
                }
            }
            this.element.resize(newSize);
            this.splitter.sizeChanged();
        },
    
        /**
         * Method: sizeChanged
         * Handle the size of the element changing to see if the
         * toggle state has changed.
         */
        sizeChange: function() {
            var size = this.element.getContentBoxSize();
            if (this.layout == 'vertical') {
                if (size.height == this.minimumSize) {
                    this.snap.addClass('jxSnapClosed');
                    this.snap.removeClass('jxSnapOpened');
                } else {
                    this.snap.addClass('jxSnapOpened');
                    this.snap.removeClass('jxSnapClosed');
                }
            } else {
                if (size.width == this.minimumSize) {
                    this.snap.addClass('jxSnapClosed');
                    this.snap.removeClass('jxSnapOpened');
                } else {
                    this.snap.addClass('jxSnapOpened');
                    this.snap.removeClass('jxSnapClosed');
                }
            }
        }
    });
    
    if (base.global) {
        base.global.Splitter.Snap = snap;
    }
    
    return snap;
});