/*
---

name: Jx.Layout

description: Jx.Layout is used to provide more flexible layout options for applications

license: MIT-style license.

requires:
 - Jx.Object


provides: [Jx.Layout]

css:
 - layout

...
 */
// $Id$
/**
 * Class: Jx.Layout
 *
 * Extends: <Jx.Object>
 *
 * Jx.Layout is used to provide more flexible layout options for applications
 *
 * Jx.Layout wraps an existing DOM element (typically a div) and provides
 * extra functionality for sizing that element within its parent and sizing
 * elements contained within it that have a 'resize' function attached to them.
 *
 * To create a Jx.Layout, pass the element or id plus an options object to
 * the constructor.
 *
 * Example:
 * (code)
 * var myContainer = new Jx.Layout('myDiv', options);
 * (end)
 *
 * Events:
 * sizeChange - fired when the size of the container changes
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */

Jx.Layout = new Class({
    Extends: Jx.Object,
    Family: 'Jx.Layout',

    options: {
        /* Option: resizeWithWindow
         * boolean, automatically resize this layout when the window size
         * changes, even if the element is not a direct descendant of the
         * BODY.  False by default.
         */
        resizeWithWindow: false,
        /* Option: propagate
         * boolean, controls propogation of resize to child nodes.
         * True by default. If set to false, changes in size will not be
         * propogated to child nodes.
         */
        propagate: true,
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

    /**
     * Parameters:
     * domObj - {HTMLElement} element or id to apply the layout to
     * options - <Jx.Layout.Options>
     */
    parameters: ['domObj','options'],

    /**
     * APIMethod: init
     * Create a new instance of Jx.Layout.
     */
    init: function() {
        this.domObj = document.id(this.options.domObj);
        this.domObj.resize = this.resize.bind(this);
        this.domObj.setStyle('position', this.options.position);
        this.domObj.store('jxLayout', this);

        if (this.options.resizeWithWindow || document.body == this.domObj.parentNode) {
            window.addEvent('resize', this.windowResize.bind(this));
            window.addEvent('load', this.windowResize.bind(this));
        }
        //this.resize();
    },

    /**
     * Method: windowResize
     * when the window is resized, any Jx.Layout controlled elements that are
     * direct children of the BODY element are resized
     */
     windowResize: function() {
         this.resize();
         if (this.resizeTimer) {
             window.clearTimeout(this.resizeTimer);
             this.resizeTimer = null;
         }
         this.resizeTimer = this.resize.delay(50, this);
    },

    /**
     * Method: resize
     * resize the element controlled by this Jx.Layout object.
     *
     * Parameters:
     * options - new options to apply, see <Jx.Layout.Options>
     */
    resize: function(options) {
         /* this looks like a really big function but actually not
          * much code gets executed in the two big if statements
          */
        this.resizeTimer = null;
        var needsResize = false;
        if (options) {
            for (var i in options) {
                //prevent forceResize: false from causing a resize
                if (i == 'forceResize') {
                    continue;
                }
                if (this.options[i] != options[i]) {
                    needsResize = true;
                    this.options[i] = options[i];
                }
            }
            if (options.forceResize) {
                needsResize = true;
            }
        }
        if (!document.id(this.domObj.parentNode)) {
            return;
        }

        var parentSize;
        if (this.domObj.parentNode.tagName == 'BODY') {
            parentSize = Jx.getPageDimensions();
        } else {
            parentSize = document.id(this.domObj.parentNode).getContentBoxSize();
        }

        if (this.lastParentSize && !needsResize) {
            needsResize = (this.lastParentSize.width != parentSize.width ||
                          this.lastParentSize.height != parentSize.height);
        } else {
            needsResize = true;
        }
        this.lastParentSize = parentSize;

        if (!needsResize) {
            return;
        }

        var l, t, w, h;

        /* calculate left and width */
        if (this.options.left != null) {
            /* fixed left */
            l = this.options.left;
            if (this.options.right == null) {
                /* variable right */
                if (this.options.width == null) {
                    /* variable right and width
                     * set right to min, stretch width */
                    w = parentSize.width - l;
                    if (w < this.options.minWidth ) {
                        w = this.options.minWidth;
                    }
                    if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                        w = this.options.maxWidth;
                    }
                } else {
                    /* variable right, fixed width
                     * use width
                     */
                    w = this.options.width;
                }
            } else {
                /* fixed right */
                if (this.options.width == null) {
                    /* fixed right, variable width
                     * stretch width
                     */
                    w = parentSize.width - l - this.options.right;
                    if (w < this.options.minWidth) {
                        w = this.options.minWidth;
                    }
                    if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                        w = this.options.maxWidth;
                    }
                } else {
                    /* fixed right, fixed width
                     * respect left and width, allow right to stretch
                     */
                    w = this.options.width;
                }
            }

        } else {
            if (this.options.right == null) {
                if (this.options.width == null) {
                    /* variable left, width and right
                     * set left, right to min, stretch width
                     */
                     l = 0;
                     w = parentSize.width;
                     if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                         l = l + parseInt(w - this.options.maxWidth,10)/2;
                         w = this.options.maxWidth;
                     }
                } else {
                    /* variable left, fixed width, variable right
                     * distribute space between left and right
                     */
                    w = this.options.width;
                    l = parseInt((parentSize.width - w)/2,10);
                    if (l < 0) {
                        l = 0;
                    }
                }
            } else {
                if (this.options.width != null) {
                    /* variable left, fixed width, fixed right
                     * left is calculated directly
                     */
                    w = this.options.width;
                    l = parentSize.width - w - this.options.right;
                    if (l < 0) {
                        l = 0;
                    }
                } else {
                    /* variable left and width, fixed right
                     * set left to min value and stretch width
                     */
                    l = 0;
                    w = parentSize.width - this.options.right;
                    if (w < this.options.minWidth) {
                        w = this.options.minWidth;
                    }
                    if (this.options.maxWidth >= 0 && w > this.options.maxWidth) {
                        l = w - this.options.maxWidth - this.options.right;
                        w = this.options.maxWidth;
                    }
                }
            }
        }

        /* calculate the top and height */
        if (this.options.top != null) {
            /* fixed top */
            t = this.options.top;
            if (this.options.bottom == null) {
                /* variable bottom */
                if (this.options.height == null) {
                    /* variable bottom and height
                     * set bottom to min, stretch height */
                    h = parentSize.height - t;
                    if (h < this.options.minHeight) {
                        h = this.options.minHeight;
                    }
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        h = this.options.maxHeight;
                    }
                } else {
                    /* variable bottom, fixed height
                     * stretch height
                     */
                    h = this.options.height;
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        t = h - this.options.maxHeight;
                        h = this.options.maxHeight;
                    }
                }
            } else {
                /* fixed bottom */
                if (this.options.height == null) {
                    /* fixed bottom, variable height
                     * stretch height
                     */
                    h = parentSize.height - t - this.options.bottom;
                    if (h < this.options.minHeight) {
                        h = this.options.minHeight;
                    }
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        h = this.options.maxHeight;
                    }
                } else {
                    /* fixed bottom, fixed height
                     * respect top and height, allow bottom to stretch
                     */
                    h = this.options.height;
                }
            }
        } else {
            if (this.options.bottom == null) {
                if (this.options.height == null) {
                    /* variable top, height and bottom
                     * set top, bottom to min, stretch height
                     */
                     t = 0;
                     h = parentSize.height;
                     if (h < this.options.minHeight) {
                         h = this.options.minHeight;
                     }
                     if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                         t = parseInt((parentSize.height - this.options.maxHeight)/2,10);
                         h = this.options.maxHeight;
                     }
                } else {
                    /* variable top, fixed height, variable bottom
                     * distribute space between top and bottom
                     */
                    h = this.options.height;
                    t = parseInt((parentSize.height - h)/2,10);
                    if (t < 0) {
                        t = 0;
                    }
                }
            } else {
                if (this.options.height != null) {
                    /* variable top, fixed height, fixed bottom
                     * top is calculated directly
                     */
                    h = this.options.height;
                    t = parentSize.height - h - this.options.bottom;
                    if (t < 0) {
                        t = 0;
                    }
                } else {
                    /* variable top and height, fixed bottom
                     * set top to min value and stretch height
                     */
                    t = 0;
                    h = parentSize.height - this.options.bottom;
                    if (h < this.options.minHeight) {
                        h = this.options.minHeight;
                    }
                    if (this.options.maxHeight >= 0 && h > this.options.maxHeight) {
                        t = parentSize.height - this.options.maxHeight - this.options.bottom;
                        h = this.options.maxHeight;
                    }
                }
            }
        }

        //TODO: check left, top, width, height against current styles
        // and only apply changes if they are not the same.

        /* apply the new sizes */
        var sizeOpts = {width: w};
        if (this.options.position == 'absolute') {
            var m = document.id(this.domObj.parentNode).measure(function(){
                return this.getSizes(['padding'],['left','top']).padding;
            });
            this.domObj.setStyles({
                position: this.options.position,
                left: l+m.left,
                top: t+m.top
            });
            sizeOpts.height = h;
        } else {
            if (this.options.height) {
                sizeOpts.height = this.options.height;
            }
        }
        this.domObj.setBorderBoxSize(sizeOpts);

        if (this.options.propagate) {
            // propogate changes to children
            var o = {forceResize: options ? options.forceResize : false};
            Array.from(this.domObj.childNodes).each(function(child){
                if (child.resize && child.getStyle('display') != 'none') {
                    child.resize.delay(0,child,o);
                }
            });
        }

        this.fireEvent('sizeChange',this);
    }
});