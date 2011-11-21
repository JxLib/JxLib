/*
---

name: Jx.LayoutManager

description: Namespace and base class for all layout managers

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.LayoutManager]

...
*/
// $Id$
/**
* Class: Jx.LayoutManager
*
* Namespace and base class for all layout managers 
* 
*
* Extends:
* <Jx.Object>
*
* License:
* Copyright (c) 2011, Jonathan Bomgardner 
*
* This file is licensed under an MIT style license
*/

Jx.LayoutManager = new Class({
    Extends: Jx.Object,
    Family: 'Jx.LayoutManager',
    
    defaults: {
        /* Option: position
         * how to position the element, either 'absolute' or 'relative'.
         * The default (if not passed) is 'absolute'.  When using
         * 'absolute' positioning, both the width and height are
         * controlled by Jx.Layout.  If 'relative' positioning is used
         * then only the width is controlled, allowing the height to
         * be controlled by its content.
         */
        position: 'absolute',
        /* Option: left
         * the distance (in pixels) to maintain the left edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the left edge can be any distance from its parent
         * based on other parameters.
         */
        left: 0,
        /* Option: right
         * the distance (in pixels) to maintain the right edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the right edge can be any distance from its parent
         * based on other parameters.
         */
        right: 0,
        /* Option: top
         * the distance (in pixels) to maintain the top edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the top edge can be any distance from its parent
         * based on other parameters.
         */
        top: 0,
        /* Option: bottom
         * the distance (in pixels) to maintain the bottom edge of the element
         * from its parent element.  The default value is 0.  If this is set
         * to 'null', then the bottom edge can be any distance from its parent
         * based on other parameters.
         */
        bottom: 0,
        /* Option: width
         * the width (in pixels) of the element.  The default value is null.
         * If this is set to 'null', then the width can be any value based on
         * other parameters.
         */
        width: null,
        /* Option: height
         * the height (in pixels) of the element.  The default value is null.
         * If this is set to 'null', then the height can be any value based on
         * other parameters.
         */
        height: null,
        /* Option: minWidth
         * the minimum width that the element can be sized to.  The default
         * value is 0.
         */
        minWidth: 0,
        /* Option: minHeight
         * the minimum height that the element can be sized to.  The
         * default value is 0.
         */
        minHeight: 0,
        /* Option: maxWidth
         * the maximum width that the element can be sized to.  The default
         * value is -1, which means no maximum.
         */
        maxWidth: -1,
        /* Option: maxHeight
         * the maximum height that the element can be sized to.  The
         * default value is -1, which means no maximum.
         */
        maxHeight: -1
    },

    items: null,
    container: null,
    domObj: null,
    
    init: function(){
        this.items = [];
        this.parent();
    },
    
    setContainer: function(domObj){
        this.domObj = document.id(domObj);
        this.container = $jx(domObj);
    },
    
    add: function(obj,options){
        return this.domObj.grab(document.id(obj));
    },
    
    size: function(obj, options){
        //get options from widget
        domObj = document.id(obj);
        var opts = domObj.retrieve('jxLayoutOpts');
        if (opts === null || opts === undefined) {
            opts = Object.merge({},this.defaults);
        }

        domObj.setStyle('position', opts.position);

        var needsResize = false;
        if (options) {
            for (var i in options) {
                //prevent forceResize: false from causing a resize
                if (i == 'forceResize') {
                    continue;
                }
                if (opts[i] != options[i]) {
                    needsResize = true;
                    opts[i] = options[i];
                }
            }
            if (options.forceResize) {
                needsResize = true;
            }
        }
        
        //We have to be in the DOM in order to resize properly.
        if (!document.id(domObj.parentNode)) {
            return;
        }

        var parentSize;
        if (domObj.parentNode.tagName == 'BODY') {
            parentSize = Jx.getPageDimensions();
        } else {
            parentSize = document.id(domObj.parentNode).getContentBoxSize();
        }

        if (opts.lastParentSize && !needsResize) {
            needsResize = (opts.lastParentSize.width != parentSize.width ||
            opts.lastParentSize.height != parentSize.height);
        } else {
            needsResize = true;
        }
        opts.lastParentSize = parentSize;

        domObj.store('jxLayoutOpts',opts)
        if (!needsResize) {
            return;
        }

        var l, t, w, h;

        /* calculate left and width */
        if (opts.left !== null) {
            /* fixed left */
            l = opts.left;
            if (opts.right === null) {
                /* variable right */
                if (opts.width === null) {
                    /* variable right and width
                     * set right to min, stretch width */
                    w = parentSize.width - l;
                    if (w < opts.minWidth ) {
                        w = opts.minWidth;
                    }
                    if (opts.maxWidth >= 0 && w > opts.maxWidth) {
                        w = opts.maxWidth;
                    }
                } else {
                    /* variable right, fixed width
                     * use width
                     */
                    w = opts.width;
                }
            } else {
                /* fixed right */
                if (opts.width === null) {
                    /* fixed right, variable width
                     * stretch width
                     */
                    w = parentSize.width - l - opts.right;
                    if (w < opts.minWidth) {
                        w = opts.minWidth;
                    }
                    if (opts.maxWidth >= 0 && w > opts.maxWidth) {
                        w = opts.maxWidth;
                    }
                } else {
                    /* fixed right, fixed width
                     * respect left and width, allow right to stretch
                     */
                    w = opts.width;
                }
            }
        } else {
            if (opts.right === null) {
                if (opts.width === null) {
                    /* variable left, width and right
                     * set left, right to min, stretch width
                     */
                    l = 0;
                    w = parentSize.width;
                    if (opts.maxWidth >= 0 && w > opts.maxWidth) {
                        l = l + parseInt(w - opts.maxWidth,10)/2;
                        w = opts.maxWidth;
                    }
                } else {
                    /* variable left, fixed width, variable right
                     * distribute space between left and right
                     */
                    w = opts.width;
                    l = parseInt((parentSize.width - w)/2,10);
                    if (l < 0) {
                        l = 0;
                    }
                }
            } else {
                if (opts.width !== null) {
                    /* variable left, fixed width, fixed right
                     * left is calculated directly
                     */
                    w = opts.width;
                    l = parentSize.width - w - opts.right;
                    if (l < 0) {
                        l = 0;
                    }
                } else {
                    /* variable left and width, fixed right
                     * set left to min value and stretch width
                     */
                    l = 0;
                    w = parentSize.width - opts.right;
                    if (w < opts.minWidth) {
                        w = opts.minWidth;
                    }
                    if (opts.maxWidth >= 0 && w > opts.maxWidth) {
                        l = w - opts.maxWidth - opts.right;
                        w = opts.maxWidth;
                    }
                }
            }
        }

        /* calculate the top and height */
        if (opts.top !== null) {
            /* fixed top */
            t = opts.top;
            if (opts.bottom === null) {
                /* variable bottom */
                if (opts.height === null) {
                    /* variable bottom and height
                     * set bottom to min, stretch height */
                    h = parentSize.height - t;
                    if (h < opts.minHeight) {
                        h = opts.minHeight;
                    }
                    if (opts.maxHeight >= 0 && h > opts.maxHeight) {
                        h = opts.maxHeight;
                    }
                } else {
                    /* variable bottom, fixed height
                     * stretch height
                     */
                    h = opts.height;
                    if (opts.maxHeight >= 0 && h > opts.maxHeight) {
                        t = h - opts.maxHeight;
                        h = opts.maxHeight;
                    }
                }
            } else {
                /* fixed bottom */
                if (opts.height === null) {
                    /* fixed bottom, variable height
                     * stretch height
                     */
                    h = parentSize.height - t - opts.bottom;
                    if (h < opts.minHeight) {
                        h = opts.minHeight;
                    }
                    if (opts.maxHeight >= 0 && h > opts.maxHeight) {
                        h = opts.maxHeight;
                    }
                } else {
                    /* fixed bottom, fixed height
                     * respect top and height, allow bottom to stretch
                     */
                    h = opts.height;
                }
            }
        } else {
            if (opts.bottom === null) {
                if (opts.height === null) {
                    /* variable top, height and bottom
                     * set top, bottom to min, stretch height
                     */
                    t = 0;
                    h = parentSize.height;
                    if (h < opts.minHeight) {
                        h = opts.minHeight;
                    }
                    if (opts.maxHeight >= 0 && h > opts.maxHeight) {
                        t = parseInt((parentSize.height - opts.maxHeight)/2,10);
                        h = opts.maxHeight;
                    }
                } else {
                    /* variable top, fixed height, variable bottom
                     * distribute space between top and bottom
                     */
                    h = opts.height;
                    t = parseInt((parentSize.height - h)/2,10);
                    if (t < 0) {
                        t = 0;
                    }
                }
            } else {
                if (opts.height !== null) {
                    /* variable top, fixed height, fixed bottom
                     * top is calculated directly
                     */
                    h = opts.height;
                    t = parentSize.height - h - opts.bottom;
                    if (t < 0) {
                        t = 0;
                    }
                } else {
                    /* variable top and height, fixed bottom
                     * set top to min value and stretch height
                     */
                    t = 0;
                    h = parentSize.height - opts.bottom;
                    if (h < opts.minHeight) {
                        h = opts.minHeight;
                    }
                    if (opts.maxHeight >= 0 && h > opts.maxHeight) {
                        t = parentSize.height - opts.maxHeight - opts.bottom;
                        h = opts.maxHeight;
                    }
                }
            }
        }

        //TODO: check left, top, width, height against current styles
        // and only apply changes if they are not the same.

        /* apply the new sizes */
        var sizeOpts = {width: w};
        if (opts.position == 'absolute') {
            var m = document.id(this.domObj.parentNode).measure(function(){
                return this.getSizes(['padding'],['left','top']).padding;
            });
            domObj.setStyles({
                position: opts.position,
                left: l+m.left,
                top: t+m.top
            });
            sizeOpts.height = h;
        } else {
            if (opts.height) {
                sizeOpts.height = opts.height;
            }
        }
        domObj.setBorderBoxSize(sizeOpts);
    }
});