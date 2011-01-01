/*
---

name: Jx.Toolbar.Container

description: A toolbar container contains toolbars.  This has an optional dependency on Fx.Tween that, if included, will allow toolbars that contain more elements than can be displayed to be smoothly scrolled left and right.  Without this optional dependency, the toolbar will jump in fixed increments rather than smoothly scrolling.

license: MIT-style license.

requires:
 - Jx.Toolbar
 - Jx.Button

optional:
 - Core/Fx.Tween

provides: [Jx.Toolbar.Container]

images:
 - emblems.png

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Container
 *
 * Extends: <Jx.Widget>
 *
 * A toolbar container contains toolbars.  A single toolbar container fills
 * the available space horizontally.  Toolbars placed in a toolbar container
 * do not wrap when they exceed the available space.
 *
 * Events:
 * add - fired when one or more toolbars are added to a container
 * remove - fired when one or more toolbars are removed from a container
 *
 * Implements:
 * Options
 * Events
 * {<Jx.Addable>}
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */

Jx.Toolbar.Container = new Class({

    Family: 'Jx.Toolbar.Container',
    Extends: Jx.Widget,
    Binds: ['update'],
    pluginNamespace: 'ToolbarContainer',
    /**
     * Property: domObj
     * {HTMLElement} the HTML element that the container lives in
     */
    domObj: null,
    options: {
        /* Option: parent
         * a DOM element to add this to
         */
        parent: null,
        /* Option: position
         * the position of the toolbar container in its parent, one of 'top',
         * 'right', 'bottom', or 'left'.  Default is 'top'
         */
        position: 'top',
        /* Option: autoSize
         * automatically size the toolbar container to fill its container.
         * Default is false
         */
        autoSize: false,
        /* Option: scroll
         * Control whether the user can scroll of the content of the
         * container if the content exceeds the size of the container.
         * Default is true.
         */
        scroll: true,
        /**
         * Option: align
         * Determines whether the toolbar is aligned left, center, or right.
         * Mutually exclusive with the scroll option. This option overrides
         * scroll if set to something other than the default. Default: 'left',
         * valid values are 'left','center', or 'right'
         */
        align: 'left',
        template: "<div class='jxBarContainer'><div class='jxBarControls'></div></div>",
        scrollerTemplate: "<div class='jxBarScroller'><div class='jxBarWrapper'></div></div>"
    },
    classes: new Hash({
        domObj: 'jxBarContainer',
        scroller: 'jxBarScroller',
        //used to hide the overflow of the wrapper
        wrapper: 'jxBarWrapper',
        controls: 'jxBarControls'
        //used to allow multiple toolbars to float next to each other
    }),

    updating: false,

    /**
     * APIMethod: render
     * Create a new instance of Jx.Toolbar.Container
     */
    render: function() {
        this.parent();
        /* if a container was passed in, use it instead of the one from the
         * template
         */
        if (document.id(this.options.parent)) {
            this.domObj = document.id(this.options.parent);
            this.elements = new Hash({
                'jxBarContainer': this.domObj
            });
            this.domObj.addClass('jxBarContainer');
            this.domObj.grab(this.controls);
            this.domObj.addEvent('sizeChange', this.update);
        }

        if (!['center', 'right'].contains(this.options.align) && this.options.scroll) {
            this.processElements(this.options.scrollerTemplate, this.classes);
            this.domObj.grab(this.scroller, 'top');
        }
        
        //add the alignment option... not sure why this keeps getting removed??
        this.domObj.addClass('jxToolbarAlign' + 
                this.options.align.capitalize());

        /* this allows toolbars to add themselves to this bar container
         * once it already exists without requiring an explicit reference
         * to the toolbar container
         */
        this.domObj.store('jxBarContainer', this);

        if (['top', 'right', 'bottom', 'left'].contains(this.options.position)) {
            this.domObj.addClass('jxBar' +
            this.options.position.capitalize());
        } else {
            this.domObj.addClass('jxBarTop');
            this.options.position = 'top';
        }

        if (this.options.scroll && ['top', 'bottom'].contains(this.options.position)) {
            // make sure we update our size when we get added to the DOM
            this.addEvent('addTo', function(){
              this.domObj.getParent().addEvent('sizeChange', this.update);
              this.update();
            });

            this.scrollLeft = new Jx.Button({
                image: Jx.aPixel.src
            }).addTo(this.controls, 'bottom');
            document.id(this.scrollLeft).addClass('jxBarScrollLeft');
            this.scrollLeft.addEvents({
                click: this.scroll.bind(this, 'left')
            });

            this.scrollRight = new Jx.Button({
                image: Jx.aPixel.src
            }).addTo(this.controls, 'bottom');
            document.id(this.scrollRight).addClass('jxBarScrollRight');
            this.scrollRight.addEvents({
                click: this.scroll.bind(this, 'right')
            });

        } else if (this.options.scroll && ['left', 'right'].contains(this.options.position)) {
            //do we do scrolling up and down?
            //for now disable scroll in this case
            this.options.scroll = false;
        } else {
            this.options.scroll = false;
        }

        this.addEvent('add', this.update);
        if (this.options.toolbars) {
            this.add(this.options.toolbars);
        }
    },

    /**
     * APIMethod: update
     * Updates the scroller enablement dependent on the total size of the
     * toolbar(s).
     */
    update: function() {
        if (this.options.scroll) {
            if (['top', 'bottom'].contains(this.options.position)) {
                var tbcSize = this.domObj.getContentBoxSize().width;

                var s = 0;
                //next check to see if we need the scrollers or not.
                var children = this.wrapper.getChildren();
                if (children.length > 0) {
                    children.each(function(tb) {
                        s += tb.getMarginBoxSize().width;
                    },
                    this);

                    var scrollerSize = tbcSize;

                    if (s === 0) {
                        this.scrollLeft.setEnabled(false);
                        this.scrollRight.setEnabled(false);
                    } else {


                        var leftMargin = this.wrapper.getStyle('margin-left').toInt();
                        scrollerSize -= this.controls.getMarginBoxSize().width;


                        if (leftMargin < 0) {
                            //has been scrolled left so activate the right scroller
                            this.scrollLeft.setEnabled(true);
                        } else {
                            //we don't need it
                            this.scrollLeft.setEnabled(false);
                        }

                        if (s + leftMargin > scrollerSize) {
                            //we need the right one
                            this.scrollRight.setEnabled(true);
                        } else {
                            //we don't need it
                            this.scrollRight.setEnabled(false);
                        }
                    }

                } else {
                    this.scrollRight.setEnabled(false);
                    this.scrollLeft.setEnabled(false);
                }
                this.scroller.setStyle('width', scrollerSize);

                this.findFirstVisible();
                this.updating = false;
            }
        }
    },
    /**
     * Method: findFirstVisible
     * Finds the first visible button on the toolbar and saves a reference in 
     * the scroller object
     */
    findFirstVisible: function() {
        if ($defined(this.scroller.retrieve('buttonPointer'))) {
            return;
        };

        var children = this.wrapper.getChildren();

        if (children.length > 0) {
            children.each(function(toolbar) {
                var buttons = toolbar.getChildren();
                if (buttons.length > 1) {
                    buttons.each(function(button) {
                        var pos = button.getCoordinates(this.scroller);
                        if (pos.left >= 0 && !$defined(this.scroller.retrieve('buttonPointer'))) {
                            //this is the first visible button
                            this.scroller.store('buttonPointer', button);
                        }
                    },
                    this);
                }
            },
            this);
        }
    },

    /**
     * APIMethod: add
     * Add a toolbar to the container.
     *
     * Parameters:
     * toolbar - {Object} the toolbar to add.  More than one toolbar
     *    can be added by passing multiple arguments.
     */
    add: function() {
        $A(arguments).flatten().each(function(thing) {
            if (this.options.scroll) {
                /* we potentially need to show or hide scroller buttons
                 * when the toolbar contents change
                 */
                thing.addEvent('update', this.update.bind(this));
                thing.addEvent('show', this.scrollIntoView.bind(this));
            }
            if (this.wrapper) {
                this.wrapper.adopt(thing.domObj);
            } else {
                this.domObj.adopt(thing.domObj);
            }
            this.domObj.addClass('jxBar' + this.options.position.capitalize());
        },
        this);
        if (arguments.length > 0) {
            this.fireEvent('add', this);
        }
        return this;
    },

    /**
     * Method: scroll
     * Does the work of scrolling the toolbar to a specific position.
     *
     * Parameters:
     * direction - whether to scroll left or right
     */
    scroll: function(direction) {
        if (this.updating) {
            return
        };
        this.updating = true;

        var currentButton = this.scroller.retrieve('buttonPointer');
        if (direction === 'left') {
            //need to tween the amount of the previous button
            var previousButton = this.scroller.retrieve('previousPointer');
            if (!previousButton) {
                previousButton = this.getPreviousButton(currentButton);
            }
            if (previousButton) {
                var w = previousButton.getMarginBoxSize().width;
                var ml = this.wrapper.getStyle('margin-left').toInt();
                ml += w;
                if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                    //scroll it
                    this.wrapper.get('tween', {
                        property: 'margin-left',
                        onComplete: this.afterTweenLeft.bind(this, previousButton)
                    }).start(ml);
                } else {
                    //set it
                    this.wrapper.setStyle('margin-left', ml);
                    this.afterTweenLeft(previousButton);
                }
            } else {
                this.update();
            }
        } else {
            //must be right
            var w = currentButton.getMarginBoxSize().width;

            var ml = this.wrapper.getStyle('margin-left').toInt();
            ml -= w;

            //now, if Fx is defined tween the margin to the left to
            //hide the current button
            if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                //scroll it
                this.wrapper.get('tween', {
                    property: 'margin-left',
                    onComplete: this.afterTweenRight.bind(this, currentButton)
                }).start(ml);
            } else {
                //set it
                this.wrapper.setStyle('margin-left', ml);
                this.afterTweenRight(currentButton);
            }

        }
    },

    /**
     * Method: afterTweenRight
     * Updates pointers to buttons after the toolbar scrolls right
     *
     * Parameters:
     * currentButton - the button that was currently first before the scroll
     */
    afterTweenRight: function(currentButton) {
        var np = this.getNextButton(currentButton);
        if (!np) {
            np = currentButton;
        }
        this.scroller.store('buttonPointer', np);
        if (np !== currentButton) {
            this.scroller.store('previousPointer', currentButton);
        }
        this.update();
    },
    /**
     * Method: afterTweenLeft
     * Updates pointers to buttons after the toolbar scrolls left
     *
     * Parameters:
     * previousButton - the button that was to the left of the first visible
     *      button.
     */
    afterTweenLeft: function(previousButton) {
        this.scroller.store('buttonPointer', previousButton);
        var pp = this.getPreviousButton(previousButton);
        if ($defined(pp)) {
            this.scroller.store('previousPointer', pp);
        } else {
            this.scroller.eliminate('previousPointer');
        }
        this.update();
    },
    /**
     * APIMethod: remove
     * remove an item from a toolbar.  If the item is not in this toolbar
     * nothing happens
     *
     * Parameters:
     * item - {Object} the object to remove
     *
     * Returns:
     * {Object} the item that was removed, or null if the item was not
     * removed.
     */
    remove: function(item) {
        if (item instanceof Jx.Widget) {
            item.dispose();
        } else {
            document.id(item).dispose();
        }
        this.update();
    },
    /**
     * APIMethod: scrollIntoView
     * scrolls an item in one of the toolbars into the currently visible
     * area of the container if it is not already fully visible
     *
     * Parameters:
     * item - the item to scroll.
     */
    scrollIntoView: function(item) {
        var currentButton = this.scroller.retrieve('buttonPointer');

        if (!$defined(currentButton)) return;

        if ($defined(item.domObj)) {
            item = item.domObj;
            while (!item.hasClass('jxToolItem')) {
                item = item.getParent();
            }
        }
        var pos = item.getCoordinates(this.scroller);
        var scrollerSize = this.scroller.getStyle('width').toInt();

        if (pos.right > 0 && pos.right <= scrollerSize && pos.left > 0 && pos.left <= scrollerSize) {
           //we are completely on screen 
            return;
        };

        if (pos.right > scrollerSize) {
            //it's right of the scroller
            var diff = pos.right - scrollerSize;

            //loop through toolbar items until we have enough width to
            //make the item visible
            var ml = this.wrapper.getStyle('margin-left').toInt();
            var w = currentButton.getMarginBoxSize().width;
            var np;
            while (w < diff && $defined(currentButton)) {
                np = this.getNextButton(currentButton);
                if (np) {
                    w += np.getMarginBoxSize().width;
                } else {
                    break;
                }
                currentButton = np;
            }

            ml -= w;

            if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                //scroll it
                this.wrapper.get('tween', {
                    property: 'margin-left',
                    onComplete: this.afterTweenRight.bind(this, currentButton)
                }).start(ml);
            } else {
                //set it
                this.wrapper.setStyle('margin-left', ml);
                this.afterTweenRight(currentButton);
            }
        } else {
            //it's left of the scroller
            var ml = this.wrapper.getStyle('margin-left').toInt();
            ml -= pos.left;

            if (typeof Fx != 'undefined' && typeof Fx.Tween != 'undefined') {
                //scroll it
                this.wrapper.get('tween', {
                    property: 'margin-left',
                    onComplete: this.afterTweenLeft.bind(this, item)
                }).start(ml);
            } else {
                //set it
                this.wrapper.setStyle('margin-left', ml);
                this.afterTweenLeft(item);
            }
        }

    },
    /**
     * Method: getPreviousButton
     * Finds the button to the left of the first visible button
     *
     * Parameters:
     * currentButton - the first visible button
     */
    getPreviousButton: function(currentButton) {
        pp = currentButton.getPrevious();
        if (!$defined(pp)) {
            //check for a new toolbar
            pp = currentButton.getParent().getPrevious();
            if (pp) {
                pp = pp.getLast();
            }
        }
        return pp;
    },
    /**
     * Method: getNextButton
     * Finds the button to the right of the first visible button
     *
     * Parameters:
     * currentButton - the first visible button
     */
    getNextButton: function(currentButton) {
        np = currentButton.getNext();
        if (!np) {
            np = currentButton.getParent().getNext();
            if (np) {
                np = np.getFirst();
            }
        }
        return np;
    }

});
