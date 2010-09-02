/*
---

name: Jx.Button

description: Jx.Button creates a clickable element that can be added to a web page.

license: MIT-style license.

requires:
 - Jx.Widget

optional:
 - Core/Drag

provides: [Jx.Button]

css:
 - button

images:
 - button.png

...
 */
// $Id$
/**
 * Class: Jx.Button
 *
 * Extends: <Jx.Widget>
 *
 * Jx.Button creates a clickable element that can be added to a web page.
 * When the button is clicked, it fires a 'click' event.
 *
 * When you construct a new instance of Jx.Button, the button does not
 * automatically get inserted into the web page.  Typically a button
 * is used as part of building another capability such as a Jx.Toolbar.
 * However, if you want to manually insert the button into your application,
 * you may use the <Jx.Button::addTo> method to append or insert the button into the
 * page.
 *
 * There are two modes for a button, normal and toggle.  A toggle button
 * has an active state analogous to a checkbox.  A toggle button generates
 * different events (down and up) from a normal button (click).  To create
 * a toggle button, pass toggle: true to the Jx.Button constructor.
 *
 * To use a Jx.Button in an application, you should to register for the
 * 'click' event.  You can pass a function in the 'onClick' option when
 * constructing a button or you can call the addEvent('click', myFunction)
 * method.  The addEvent method can be called several times, allowing more
 * than one function to be called when a button is clicked.  You can use the
 * removeEvent('click', myFunction) method to stop receiving click events.
 *
 * Example:
 *
 * (code)
 * var button = new Jx.Button(options);
 * button.addTo('myListItem'); // the id of an LI in the page.
 * (end)
 *
 * (code)
 * Example:
 * var options = {
 *     imgPath: 'images/mybutton.png',
 *     tooltip: 'click me!',
 *     label: 'click me',
 *     onClick: function() {
 *         alert('you clicked me');
 *     }
 * };
 * var button = new Jx.Button(options);
 * button.addEvent('click', anotherFunction);
 *
 * function anotherFunction() {
 *   alert('a second alert for a single click');
 * }
 * (end)
 *
 * Events:
 * click - the button was pressed and released (only if type is not 'toggle').
 * down - the button is down (only if type is 'toggle')
 * up - the button is up (only if the type is 'toggle').
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Button = new Class({
    Family: 'Jx.Button',
    Extends: Jx.Widget,

    options: {
        /* Option: image
         * optional.  A string value that is the url to load the image to
         * display in this button.  The default styles size this image to 16 x
         * 16.  If not provided, then the button will have no icon.
         */
        image: '',
        /* Option: tooltip
         * optional.  A string value to use as the alt/title attribute of the
         * <A> tag that wraps the button, resulting in a tooltip that appears
         * when the user hovers the mouse over a button in most browsers.  If
         * not provided, the button will have no tooltip.
         */
        tooltip: '',
        /* Option: label
         * optional, default is no label.  A string value that is used as a
         * label on the button. - use an object for localization: { set: 'Examples', key: 'lanKey', value: 'langValue' }
         * see widget.js for details
         */
        label: '',
        /* Option: toggle
         * default true, whether the button is a toggle button or not.
         */
        toggle: false,
        /* Option: toggleClass
         * A class to apply to the button if it is a toggle button,
         * 'jxButtonToggle' by default.
         */
        toggleClass: 'jxButtonToggle',
        /* Option: pressedClass
         * A class to apply to the button when it is pressed,
         * 'jxButtonPressed' by default.
         */
        pressedClass: 'jxButtonPressed',
        /* Option: activeClass
         * A class to apply to the buttonwhen it is active,
         * 'jxButtonActive' by default.
         */
        activeClass: 'jxButtonActive',

        /* Option: active
         * optional, default false.  Controls the initial state of toggle
         * buttons.
         */
        active: false,
        /* Option: enabled
         * whether the button is enabled or not.
         */
        enabled: true,
        /* Option: href
         * set an href on the button's action object, typically an <a> tag.
         * Default is javascript:void(0) and use onClick.
         */
        href: 'javascript:void(0);',
        /* Option: target
         * for buttons that have an href, allow setting the target
         */
        target: '',
        /* Option: template
         * the HTML structure of the button.  As a minimum, there must be a
         * containing element with a class of jxButtonContainer and an
         * internal element with a class of jxButton.  jxButtonIcon and
         * jxButtonLabel are used if present to put the image and label into
         * the button.
         */
        template: '<span class="jxButtonContainer"><a class="jxButton"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"><span class="jxButtonLabel"></span></span></a></span>'
    },

    /**
     * Property: classes
     * used to auto-populate this object with element references when
     * processing templates
     */
    classes: new Hash({
        domObj: 'jxButtonContainer',
        domA: 'jxButton',
        domImg: 'jxButtonIcon',
        domLabel: 'jxButtonLabel'
    }),

    /**
     * Method: render
     * create a new button.
     */
    render: function() {
        this.parent();
        var options = this.options,
            hasFocus,
            mouseDown;
        /* is the button toggle-able? */
        if (options.toggle) {
            this.domObj.addClass(options.toggleClass);
        }

        // the clickable part of the button
        if (this.domA) {
            this.domA.set({
                target: options.target,
                href: options.href,
                title: this.getText(options.tooltip),
                alt: this.getText(options.tooltip)
            });
            this.domA.addEvents({
                click: this.clicked.bindWithEvent(this),
                drag: (function(e) {e.stop();}).bindWithEvent(this),
                mousedown: (function(e) {
                    this.domA.addClass(options.pressedClass);
                    hasFocus = true;
                    mouseDown = true;
                    this.focus();
                }).bindWithEvent(this),
                mouseup: (function(e) {
                    this.domA.removeClass(options.pressedClass);
                    mouseDown = false;
                }).bindWithEvent(this),
                mouseleave: (function(e) {
                    this.domA.removeClass(options.pressedClass);
                }).bindWithEvent(this),
                mouseenter: (function(e) {
                    if (hasFocus && mouseDown) {
                        this.domA.addClass(options.pressedClass);
                    }
                }).bindWithEvent(this),
                keydown: (function(e) {
                    if (e.key == 'enter') {
                        this.domA.addClass(options.pressedClass);
                    }
                }).bindWithEvent(this),
                keyup: (function(e) {
                    if (e.key == 'enter') {
                        this.domA.removeClass(options.pressedClass);
                    }
                }).bindWithEvent(this),
                blur: function() { hasFocus = false; }
            });

            if (typeof Drag != 'undefined') {
                new Drag(this.domA, {
                    onStart: function() {this.stop();}
                });
            }
        }

        if (this.domImg) {
            if (options.image || !options.label) {
                this.domImg.set({
                    title: this.getText(options.tooltip),
                    alt: this.getText(options.tooltip)
                });
                if (options.image && options.image.indexOf(Jx.aPixel.src) == -1) {
                    this.domImg.setStyle('backgroundImage',"url("+options.image+")");
                }
                if (options.imageClass) {
                    this.domImg.addClass(options.imageClass);
                }
            } else {
                //remove the image if we don't need it
                this.domImg.setStyle('display','none');
            }
        }

        if (this.domLabel) {
            if (options.label || this.domA.hasClass('jxDiscloser')) {
                this.setLabel(options.label);
            } else {
                //this.domLabel.removeClass('jx'+this.type+'Label');
                this.domLabel.setStyle('display','none');
            }
        }

        if (options.id) {
            this.domObj.set('id', options.id);
        }

        //update the enabled state
        this.setEnabled(options.enabled);

        //update the active state if necessary
        if (options.active) {
            options.active = false;
            this.setActive(true);
        }
    },
    /**
     * APIMethod: clicked
     * triggered when the user clicks the button, processes the
     * actionPerformed event
     *
     * Parameters:
     * evt - {Event} the user click event
     */
    clicked : function(evt) {
        var options = this.options;
        if (options.enabled && !this.isBusy()) {
            if (options.toggle) {
                this.setActive(!options.active);
            } else {
                this.fireEvent('click', {obj: this, event: evt});
            }
        }
        //return false;
    },
    /**
     * APIMethod: isEnabled
     * This returns true if the button is enabled, false otherwise
     *
     * Returns:
     * {Boolean} whether the button is enabled or not
     */
    isEnabled: function() {
        return this.options.enabled;
    },

    /**
     * APIMethod: setEnabled
     * enable or disable the button.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the button
     */
    setEnabled: function(enabled) {
        this.options.enabled = enabled;
        if (enabled) {
            this.domObj.removeClass('jxDisabled');
        } else {
            this.domObj.addClass('jxDisabled');
        }
    },
    /**
     * APIMethod: isActive
     * For toggle buttons, this returns true if the toggle button is
     * currently active and false otherwise.
     *
     * Returns:
     * {Boolean} the active state of a toggle button
     */
    isActive: function() {
        return this.options.active;
    },
    /**
     * APIMethod: setActive
     * Set the active state of the button
     *
     * Parameters:
     * active - {Boolean} the new active state of the button
     */
    setActive: function(active) {
        var options = this.options;
        if (options.enabled && !this.isBusy()) {
          if (options.active == active) {
              return;
          }
          options.active = active;
          if (this.domA) {
              if (options.active) {
                  this.domA.addClass(options.activeClass);
              } else {
                  this.domA.removeClass(options.activeClass);
              }
          }
          this.fireEvent(active ? 'down':'up', this);
        }
    },
    /**
     * APIMethod: setImage
     * set the image of this button to a new image URL
     *
     * Parameters:
     * path - {String} the new url to use as the image for this button
     */
    setImage: function(path) {
        this.options.image = path;
        if (this.domImg) {
            this.domImg.setStyle('backgroundImage',
                                 "url("+path+")");
            this.domImg.setStyle('display', path ? null : 'none');
        }
    },
    /**
     * APIMethod: setLabel
     * sets the text of the button.
     *
     * Parameters:
     * label - {String} the new label for the button
     */
    setLabel: function(label) {
        this.options.label = label;
        if (this.domLabel) {
            this.domLabel.set('html', this.getText(label));
            this.domLabel.setStyle('display', label || this.domA.hasClass('jxDiscloser') ? null : 'none');
        }
    },
    /**
     * APIMethod: getLabel
     * returns the text of the button.
     */
    getLabel: function() {
        return this.options.label;
    },
    /**
     * APIMethod: setTooltip
     * sets the tooltip displayed by the button
     *
     * Parameters:
     * tooltip - {String} the new tooltip
     */
    setTooltip: function(tooltip) {
        if (this.domA) {
            this.domA.set({
                'title':this.getText(tooltip),
                'alt':this.getText(tooltip)
            });
        }
        //need to account for the tooltip on the image as well
        if (this.domImg) {
            //check if title and alt are set...
            var t = this.domImg.get('title');
            if ($defined(t)) {
                //change it...
                this.domImg.set({
                    'title':this.getText(tooltip),
                    'alt':this.getText(tooltip)
                });
            }
        }
    },
    /**
     * APIMethod: focus
     * capture the keyboard focus on this button
     */
    focus: function() {
        if (this.domA) {
            this.domA.focus();
        }
    },
    /**
     * APIMethod: blur
     * remove the keyboard focus from this button
     */
    blur: function() {
        if (this.domA) {
            this.domA.blur();
        }
    },

    /**
     * APIMethod: changeText
     *
     * updates the label of the button on langChange Event for
     * Internationalization
     */
    changeText : function(lang) {
        this.parent();
        this.setLabel(this.options.label);
        this.setTooltip(this.options.tooltip);
    }
});
