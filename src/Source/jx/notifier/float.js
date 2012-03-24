/*
---

name: Jx.Notifier.Float

description: A notification area that floats in a container above other content.

license: MIT-style license.

requires:
 - Jx.Notifier

provides: [Jx.Notifier.Float]

...
 */
// $Id$
/**
 * Class: Jx.Notifier.Float
 * A floating notice area for displaying notices, notices get chrome if
 * the notifier has chrome
 *
 * Extends: <Jx.Notifier>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
define("jx/notifier/float", ['../../base','../notifier','../notice'],
       function(base, Notifier, Notice){
    
    var Float = new Class({
    
        Extends: Notifier,
        Family: 'Jx.Notifier.Float',
        
        options: {
            /**
             * Option: chrome
             * {Boolean} should the notifier have chrome - default true
             */
            chrome: true,
            /**
             * Option: fx
             * {String} the effect to use when showing and hiding the notifier,
             * default is null
             */
            fx: null,
            /**
             * Option: width
             * {Integer} the width in pixels of the notifier, default is 250
             */
            width: 250,
            /**
             * Option: position
             * {Object} position options to use with <Jx.Widget::position>
             * for positioning the Notifier
             */
            position: {
                horizontal: 'center center',
                vertical: 'top top'
            }
        },
    
        /**
         * Method: render
         * render the widget
         */
        render: function () {
            this.parent();
            this.domObj.setStyle('position','absolute');
            if (this.options.width !== undefined && this.options.width !== null) {
                this.domObj.setStyle('width',this.options.width);
            }
            this.position(this.domObj, 
                          this.options.parent,
                          this.options.position);
        },
        
        /**
         * APIMethod: add
         * Add a new notice to the notifier
         *
         * Parameters:
         * notice - {<Jx.Notice>} the notice to add
         */
        add: function(notice) {
            if (!(notice instanceof Notice)) {
                notice = new Notice({content: notice});
            }
            notice.options.chrome = this.options.chrome;
            this.parent(notice);
        }
    });
    
    if (base.global) {
        base.global.Notifier.Float = Float;
    }
    
    return Float;
    
});