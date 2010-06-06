/*
---

name: Jx.Plugin.DataView.GroupFolder

description: Enables closing and opening groups in a group dataview

license: MIT-style license.

requires:
 - Jx.Plugin.DataView
 - Jx.Slide

provides: [Jx.Plugin.DataView.GroupFolder]

...
 */
/**
 * Class: Jx.Plugin.DataView.GroupFolder
 *
 * Extends: <Jx.Plugin>
 *
 * Plugin for DataView - allows folding/unfolding of the groups in the
 * grouped dataview
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.DataView.GroupFolder = new Class({

    Extends: Jx.Plugin,

    options: {
        /**
         * Option: headerClass
         * The base for styling the header. Gets '-open' or '-closed' added
         * to it.
         */
        headerClass: null
    },
    /**
     * Property: headerState
     * Hash that holds the open/closed state of each header
     */
    headerState: null,
    init: function() {
      this.headerState = new Hash();
    },
    /**
     * APIMethod: attach
     * Attaches this plugin to a dataview
     */
    attach: function (dataView) {
        if (!$defined(dataView) && !(dataview instanceof Jx.Panel.DataView)) {
            return;
        }

        this.dv = dataView;
        this.dv.addEvent('renderDone', this.setHeaders.bind(this));
    },
    /**
     * Method: setHeaders
     * Called after the dataview is rendered. Sets up the Jx.Slide instance
     * for each header. It also sets the initial state of each header so that
     * if the dataview is redrawn for some reason the open/closed state is
     * preserved.
     */
    setHeaders: function () {
        var headers = this.dv.domA.getElements('.' + this.dv.options.groupHeaderClass);

        headers.each(function (header) {
            var id = header.get('id');
            var s = new Jx.Slide({
                target: header.getNext(),
                trigger: id,
                onSlideOut: this.onSlideOut.bind(this, header),
                onSlideIn: this.onSlideIn.bind(this, header)
            });

            if (this.headerState.has(id)) {
                var state = this.headerState.get(id);
                if (state === 'open') {
                    s.slide('in');
                } else {
                    s.slide('out');
                }
            } else {
                s.slide('in');
            }
        }, this);
    },

    /**
     * Method: onSlideIn
     * Called when a group opens.
     *
     * Parameters:
     * header - the header that was clicked.
     */
    onSlideIn: function (header) {
        this.headerState.set(header.get('id'), 'open');
        if (header.hasClass(this.options.headerClass + '-closed')) {
            header.removeClass(this.options.headerClass + '-closed');
        }
        header.addClass(this.options.headerClass + '-open');
    },
    /**
     * Method: onSlideOut
     * Called when a group closes.
     *
     * Parameters:
     * header - the header that was clicked.
     */
    onSlideOut: function (header) {
        this.headerState.set(header.get('id'), 'closed');
        if (header.hasClass(this.options.headerClass + '-open')) {
            header.removeClass(this.options.headerClass + '-open');
        }
        header.addClass(this.options.headerClass + '-closed');
    }
});
