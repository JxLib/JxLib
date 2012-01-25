/*
---

name: Jx.Button.Multi

description: Multi buttons are used to contain multiple buttons in a drop down list where only one button is actually visible and clickable in the interface.

license: MIT-style license.

requires:
 - Jx.Button
 - Jx.Menu
 - Jx.ButtonSet

provides: [Jx.Button.Multi]

images:
 - button_multi.png
 - button_multi_disclose.png

...
 */
// $Id$
/**
 * Class: Jx.Button.Multi
 *
 * Extends: <Jx.Button>
 *
 * Implements:
 *
 * Multi buttons are used to contain multiple buttons in a drop down list
 * where only one button is actually visible and clickable in the interface.
 *
 * When the user clicks the active button, it performs its normal action.
 * The user may also click a drop-down arrow to the right of the button and
 * access the full list of buttons.  Clicking a button in the list causes
 * that button to replace the active button in the toolbar and performs
 * the button's regular action.
 *
 * Other buttons can be added to the Multi button using the add method.
 *
 * This is not really a button, but rather a container for buttons.  The
 * button structure is a div containing two buttons, a normal button and
 * a flyout button.  The flyout contains a toolbar into which all the
 * added buttons are placed.  The main button content is cloned from the
 * last button clicked (or first button added).
 *
 * The Multi button does not trigger any events itself, only the contained
 * buttons trigger events.
 *
 * Example:
 * (code)
 * var b1 = new Jx.Button({
 *     label: 'b1',
 *     onClick: function(button) {
 *         console.log('b1 clicked');
 *     }
 * });
 * var b2 = new Jx.Button({
 *     label: 'b2',
 *     onClick: function(button) {
 *         console.log('b2 clicked');
 *     }
 * });
 * var b3 = new Jx.Button({
 *     label: 'b3',
 *     onClick: function(button) {
 *         console.log('b3 clicked');
 *     }
 * });
 * var multiButton = new Jx.Button.Multi();
 * multiButton.add(b1, b2, b3);
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Button.Multi = new Class({
    Extends: Jx.Button,
    Family: 'Jx.Button.Multi',

    /**
     * Property: {<Jx.Button>} activeButton
     * the currently selected button
     */
    activeButton: null,

    /**
     * Property: buttons
     * {Array} the buttons added to this multi button
     */
    buttons: null,

    options: {
        /* Option: template
         * the button template for a multi button
         */
        template: '<span class="jxButtonContainer"><a class="jxButton jxButtonMulti jxDiscloser"><span class="jxButtonContent"><img src="'+Jx.aPixel.src+'" class="jxButtonIcon"><span class="jxButtonLabel"></span></span></a><a class="jxButtonDisclose" href="javascript:void(0)"><img src="'+Jx.aPixel.src+'"></a></span>',
        menuOptions: {}
    },

    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: {
        domObj: 'jxButtonContainer',
        domA: 'jxButton',
        domImg: 'jxButtonIcon',
        domLabel: 'jxButtonLabel',
        domDisclose: 'jxButtonDisclose'
    },

    /**
     * Method: render
     * construct a new instance of Jx.Button.Multi.
     */
    render: function() {
        this.parent();
        this.buttons = [];

        this.menu = new Jx.Menu({}, this.options.menuOptions);
        this.menu.button = this;
        this.buttonSet = new Jx.ButtonSet();

        this.bound.click = this.clicked.bind(this);

        if (this.domDisclose) {
            var button = this;
            var hasFocus;

            this.bound.disclose = {
              click: function(e) {
                  if (this.list.count() === 0) {
                      return;
                  }
                  if (!button.options.enabled) {
                      return;
                  }
                  this.contentContainer.setStyle('visibility','hidden');
                  this.contentContainer.setStyle('display','block');
                  document.id(document.body).adopt(this.contentContainer);
                  /* we have to size the container for IE to render the chrome
                   * correctly but just in the menu/sub menu case - there is
                   * some horrible peekaboo bug in IE related to ULs that we
                   * just couldn't figure out
                   */
                  this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());

                  this.showChrome(this.contentContainer);

                  this.position(this.contentContainer, this.button.domObj, {
                      horizontal: ['right right'],
                      vertical: ['bottom top', 'top bottom'],
                      offsets: this.chromeOffsets
                  });

                  this.contentContainer.setStyle('visibility','');

                  document.addEvent('mousedown', this.bound.hide);
                  document.addEvent('keyup', this.bound.keypress);

                  this.fireEvent('show', this);
              }.bind(this.menu),
              mouseenter:function(){
                  document.id(this.domObj.firstChild).addClass('jxButtonHover');
                  if (hasFocus) {
                      this.domDisclose.addClass(this.options.pressedClass);
                  }
              }.bind(this),
              mouseleave:function(){
                  document.id(this.domObj.firstChild).removeClass('jxButtonHover');
                  this.domDisclose.removeClass(this.options.pressedClass);
              }.bind(this),
              mousedown: function(e) {
                  this.domDisclose.addClass(this.options.pressedClass);
                  hasFocus = true;
                  this.focus();
              }.bind(this),
              mouseup: function(e) {
                  this.domDisclose.removeClass(this.options.pressedClass);
              }.bind(this),
              keydown: function(e) {
                  if (e.key == 'enter') {
                      this.domDisclose.addClass(this.options.pressedClass);
                  }
              }.bind(this),
              keyup: function(e) {
                  if (e.key == 'enter') {
                      this.domDisclose.removeClass(this.options.pressedClass);
                  }
              }.bind(this),
              blur: function() { hasFocus = false; }
            };

            this.domDisclose.addEvents({
              click: this.bound.disclose.click,
              mouseenter: this.bound.disclose.mouseenter,
              mouseleave: this.bound.disclose.mouseleave,
              mousedown: this.bound.disclose.mousedown,
              mouseup: this.bound.disclose.mouseup,
              keydown: this.bound.disclose.keydown,
              keyup: this.bound.disclose.keyup,
              blur: this.bound.disclose.blur
            });
            if (typeof Drag != 'undefined') {
                new Drag(this.domDisclose, {
                    onStart: function() {this.stop();}
                });
            }
        }
        this.bound.show = function() {
            this.domA.addClass(this.options.activeClass);
        }.bind(this);
        this.bound.hide = function() {
            if (this.options.active) {
                this.domA.addClass(this.options.activeClass);
            }
        }.bind(this);

        this.menu.addEvents({
            'show': this.bound.show,
            'hide': this.bound.hide
        });
        if (this.options.items) {
            this.add(this.options.items);
        }
    },
    cleanup: function() {
      var self = this,
          bound = this.bound;
      // clean up the discloser
      if (self.domDisclose) {
        self.domDisclose.removeEvents({
          click: bound.disclose.click,
          mouseenter: bound.disclose.mouseenter,
          mouseleave: bound.disclose.mouseleave,
          mousedown: bound.disclose.mousedown,
          mouseup: bound.disclose.mouseup,
          keydown: bound.disclose.keydown,
          keyup: bound.disclose.keyup,
          blur: bound.disclose.blur
        });
      }

      // clean up the button set
      self.buttonSet.destroy();
      self.buttonSet = null;

      // clean up the buttons array
      self.buttons.each(function(b){
        b.removeEvents();
        self.menu.remove(b.multiButton);
        b.multiButton.destroy();
        b.multiButton = null;
        b.destroy();
      });
      self.buttons.empty();
      self.buttons = null;

      // clean up the menu object
      self.menu.removeEvents({
        'show': bound.show,
        'hide': bound.hide
      });
      // unset the menu button because it references this object
      self.menu.button = null;
      self.menu.destroy();
      self.menu = null;

      // clean up binds and call parent to finish
      self.bound.show = null;
      self.bound.hide = null;
      self.bound.clicked = null;
      self.bound.disclose = null;
      self.activeButton = null;
      self.parent();
    },
    /**
     * APIMethod: add
     * adds one or more buttons to the Multi button.  The first button
     * added becomes the active button initialize.  This function
     * takes a variable number of arguments, each of which is expected
     * to be an instance of <Jx.Button>.
     *
     * Parameters:
     * button - {<Jx.Button>} a <Jx.Button> instance, may be repeated in the parameter list
     */
    add: function() {
        Array.from(arguments).flatten().each(function(theButton){
          var f,
              opts,
              button;
            if (!theButton instanceof Jx.Button) {
                return;
            }
            theButton.domA.addClass('jxDiscloser');
            theButton.setLabel(theButton.options.label);
            this.buttons.push(theButton);
            f = this.setButton.bind(this, theButton);
            opts = {
                image: theButton.options.image,
                imageClass: theButton.options.imageClass,
                label: theButton.options.label || '&nbsp;',
                enabled: theButton.options.enabled,
                tooltip: theButton.options.tooltip,
                toggle: true,
                onClick: f
            };
            if (!opts.image || opts.image.indexOf('a_pixel') != -1) {
                delete opts.image;
            }
            button = new Jx.Menu.Item(opts);
            this.buttonSet.add(button);
            this.menu.add(button);
            theButton.multiButton = button;
            theButton.domA.addClass('jxButtonMulti');
            if (!this.activeButton) {
                this.domA.dispose();
                this.setActiveButton(theButton);
            }
        }, this);
    },
    /**
     * APIMethod: remove
     * remove a button from a multi button
     *
     * Parameters:
     * button - {<Jx.Button>} the button to remove
     */
    remove: function(button) {
        if (!button || !button.multiButton) {
            return;
        }
        // the toolbar will only remove the li.toolItem, which is
        // the parent node of the multiButton's domObj.
        if (this.menu.remove(button.multiButton)) {
            button.multiButton = null;
            if (this.activeButton == button) {
                // if any buttons are left that are not this button
                // then set the first one to be the active button
                // otherwise set the active button to nothing
                if (!this.buttons.some(function(b) {
                    if (b != button) {
                        this.setActiveButton(b);
                        return true;
                    } else {
                        return false;
                    }
                }, this)) {
                    this.setActiveButton(null);
                }
            }
            this.buttons.erase(button);
        }
    },
    /**
     * APIMethod: empty
     * remove all buttons from the multi button
     */
    empty: function() {
      this.buttons.each(function(b){this.remove(b);}, this);
    },
    /**
     * APIMethod: setActiveButton
     * update the menu item to be the requested button.
     *
     * Parameters:
     * button - {<Jx.Button>} a <Jx.Button> instance that was added to this multi button.
     */
    setActiveButton: function(button) {
        if (this.activeButton) {
            this.activeButton.domA.dispose();
            this.activeButton.domA.removeEvent('click', this.bound.click);
        }
        if (button && button.domA) {
            this.domObj.grab(button.domA, 'top');
            this.domA = button.domA;
            this.domA.addEvent('click', this.bound.click);
            if (this.options.toggle) {
                this.options.active = false;
                this.setActive(true);
            }
        }
        this.activeButton = button;
    },
    /**
     * Method: setButton
     * update the active button in the menu item, trigger the button's action
     * and hide the flyout that contains the buttons.
     *
     * Parameters:
     * button - {<Jx.Button>} The button to set as the active button
     */
    setButton: function(button) {
        this.setActiveButton(button);
        button.clicked();
    }
});