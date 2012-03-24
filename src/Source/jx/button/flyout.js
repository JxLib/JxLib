/*
---

name: Jx.Button.Flyout

description: Flyout buttons expose a panel when the user clicks the button.

license: MIT-style license.

requires:
 - Jx.Button

provides: [Jx.Button.Flyout]

images:
 - flyout_chrome.png
 - emblems.png

...
 */
// $Id$
/**
 * Class: Jx.Button.Flyout
 *
 * Extends: <Jx.Button>
 *
 * Flyout buttons expose a panel when the user clicks the button.  The
 * panel can have arbitrary content.  You must provide any necessary
 * code to hook up elements in the panel to your application.
 *
 * When the panel is opened, the 'open' event is fired.  When the panel is
 * closed, the 'close' event is fired.  You can register functions to handle
 * these events in the options passed to the constructor (onOpen, onClose).
 *
 * The user can close the flyout panel by clicking the button again, by
 * clicking anywhere outside the panel and other buttons, or by pressing the
 * 'esc' key.
 *
 * Flyout buttons implement <Jx.ContentLoader> which provides the hooks to
 * insert content into the Flyout element.  Note that the Flyout element
 * is not appended to the DOM until the first time it is opened, and it is
 * removed from the DOM when closed.
 *
 * It is generally best to specify a width and height for your flyout content
 * area through CSS to ensure that it works correctly across all browsers.
 * You can do this for all flyouts using the .jxFlyout CSS selector, or you
 * can apply specific styles to your content elements.
 *
 * A flyout closes other flyouts when it is opened.  It is possible to embed
 * flyout buttons inside the content area of another flyout button.  In this
 * case, opening the inner flyout will not close the outer flyout but it will
 * close any other flyouts that are siblings.
 *
 * Example:
 * (code)
 * var flyout = new Jx.Button.Flyout({
 *      label: 'flyout',
 *      content: 'flyoutContent',
 *      onOpen: function(flyout) {
 *          console.log('flyout opened');
 *      },
 *      onClose: function(flyout) {
 *          console.log('flyout closed');
 *      }
 * });
 * (end)
 *
 * Events:
 * open - this event is triggered when the flyout is opened.
 * close - this event is triggered when the flyout is closed.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define('jx/button/flyout', ['../../base','../button'],
       function(base, Button){
     
    var flyout = new Class({
        Extends: Button,
        Family: 'Jx.Button.Flyout',
        Binds: ['keypressHandler', 'clickHandler'],
        options: {
            /* Option: template
             * the HTML structure of the flyout button
             */
            template: '<span class="jxButtonContainer"><a class="jxButton jxButtonFlyout jxDiscloser"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+base.aPixel.src+'"><span class="jxButtonLabel "></span></a></span>',
            /* Option: contentTemplate
             * the HTML structure of the flyout content area
             */
            contentTemplate: '<div class="jxFlyout"><div class="jxFlyoutContent"></div></div>',
            /* Option: position
             * where to position the flyout, see Jx.Widget::position
             * for details on how to specify this option
             */
            position: {
              horizontal: ['left left', 'right right'],
              vertical: ['bottom top', 'top bottom']
            },
            /* Option: positionElement
             * the element to position the flyout relative to, by default
             * it is the domObj of this button and should only be changed
             * if you really know what you are doing
             */
            positionElement: null,
            /**
             * Option: hasChrome
             * Set to false to prevent chrome form being used on this flyout.
             * Defaults to true.
             */
            hasChrome: true
        },
    
        /**
         * Property: contentClasses
         * the classes array for processing the contentTemplate
         */
        contentClasses: {
            contentContainer: 'jxFlyout',
            content: 'jxFlyoutContent'
        },
    
        /**
         * Property: content
         * the HTML element that contains the flyout content
         */
        content: null,
        /**
         * Method: render
         * construct a new instance of a flyout button.
         */
        render: function() {
            var options = this.options;
            if (!flyout.Stack) {
                flyout.Stack = [];
            }
            this.parent();
            this.processElements(options.contentTemplate, this.contentClasses);
    
            if (options.contentClass) {
                this.content.addClass(options.contentClass);
            }
    
            this.content.store('jxFlyout', this);
            if(!options.loadOnDemand || options.active) {
              this.loadContent(this.content);
            }else{
              this.addEvent('contentLoaded', function(ev) {
                this.show(ev);
              }.bind(this));
            }
        },
        cleanup: function() {
          this.content.eliminate('jxFlyout');
          this.content.destroy();
          Object.each(this.contentClasses, function(v,k){
            this[k] = null;
          }, this);
          this.parent();
        },
        /**
         * APIMethod: clicked
         * Override <Jx.Button::clicked> to hide/show the content area of the
         * flyout.
         *
         * Parameters:
         * e - {Event} the user event
         */
        clicked: function(e) {
            var options = this.options;
            if (!options.enabled) {
                return;
            }
            if (this.contentIsLoaded && options.cacheContent) {
              this.show(e);
            // load on demand or reload content if caching is disabled
            } else if (options.loadOnDemand || !options.cacheContent) {
              this.loadContent(this.content);
            } else {
              this.show(e);
            }
        },
       /**
        * Private Method: show
        * Shows the Flyout after the content is loaded asynchronously
        *
        * Parameters:
        * e - {Event} - the user or contentLoaded event
        */
        show: function(e) {
            var node,
                fly,
                owner = this.owner,
                stack = flyout.Stack,
                options = this.options;
           /* find out what we are contained by if we don't already know */
            if (!owner) {
                this.owner = owner = document.body;
                node = document.id(this.domObj.parentNode);
                while (node != document.body && owner == document.body) {
                    fly = node.retrieve('jxFlyout');
                    if (fly) {
                        this.owner = owner = fly;
                        break;
                    } else {
                        node = document.id(node.parentNode);
                    }
                }
            }
            if (stack[stack.length - 1] == this) {
                this.hide();
                return;
            } else if (owner != document.body) {
                /* if we are part of another flyout, close any open flyouts
                 * inside the parent and register this as the current flyout
                 */
                if (owner.currentFlyout == this) {
                    /* if the flyout to close is this flyout,
                     * hide this and return */
                    this.hide();
                    return;
                } else if (owner.currentFlyout) {
                    owner.currentFlyout.hide();
                }
                owner.currentFlyout = this;
            } else {
                /* if we are at the top level, close the entire stack before
                 * we open
                 */
                while (stack.length) {
                    stack[stack.length - 1].hide();
                }
            }
            // now we go on the stack.
            stack.push(this);
            this.fireEvent('beforeOpen');
    
            options.active = true;
            this.domA.addClass(options.activeClass);
            this.contentContainer.setStyle('visibility','hidden');
            document.id(document.body).adopt(this.contentContainer);
            this.content.getChildren().each(function(child) {
                if (child.resize) {
                    child.resize();
                }
            });
            
            var pos;
            if (options.hasChrome) {
                this.showChrome(this.contentContainer);
                pos = Object.merge({},options.position, {
                  offsets: this.chromeOffsets
                });
            } else {
                pos = options.position
            }
            var rel = options.positionElement || this.domObj;
                
            this.position(this.contentContainer, rel, pos);
    
            /* we have to size the container for IE to render the chrome correctly
             * there is some horrible peekaboo bug in IE 6
             */
            this.contentContainer.setContentBoxSize(document.id(this.content).getMarginBoxSize());
    
            this.stack(this.contentContainer);
            this.contentContainer.setStyle('visibility','');
    
            document.addEvent('keydown', this.keypressHandler);
            document.addEvent('click', this.clickHandler);
            this.fireEvent('open', this);
        },
    
        /**
         * APIMethod: hide
         * Closes the flyout if open
         */
        hide: function() {
            if (this.owner != document.body) {
                this.owner.currentFlyout = null;
            }
            flyout.Stack.pop();
            this.setActive(false);
            this.contentContainer.dispose();
            this.unstack(this.contentContainer);
            document.removeEvent('keydown', this.keypressHandler);
            document.removeEvent('click', this.clickHandler);
            this.fireEvent('close', this);
        },
        /**
         * Method: clickHandler
         * hide flyout if the user clicks outside of the flyout
         */
        clickHandler: function(e) {
            e = new Event(e);
            var elm = document.id(e.target),
                fly = flyout.Stack[flyout.Stack.length - 1];
            if (!elm.descendantOf(fly.content) &&
                !elm.descendantOf(fly.domObj)) {
                fly.hide();
            }
        },
        /**
         * Method: keypressHandler
         * hide flyout if the user presses the ESC key
         */
        keypressHandler: function(e) {
            e = new Event(e);
            if (e.key == 'esc') {
                flyout.Stack[flyout.Stack.length - 1].hide();
            }
        }
    });
    
    if (base.global) {
        base.global.Button.Flyout = flyout;
    }
    
    return flyout;

});