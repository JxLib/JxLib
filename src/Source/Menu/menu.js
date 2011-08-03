/*
---

name: Jx.Menu

description: A main menu as opposed to a sub menu that lives inside the menu.

license: MIT-style license.

requires:
 - Jx.Button
 - Jx.List

provides: [Jx.Menu]

css:
 - menu

images:
 - flyout_chrome.png
 - emblems.png
...
 */
// $Id$
/**
 * Class: Jx.Menu
 *
 * Extends: <Jx.Widget>
 *
 * A main menu as opposed to a sub menu that lives inside the menu.
 *
 * TODO: Jx.Menu
 * revisit this to see if Jx.Menu and Jx.SubMenu can be merged into
 * a single implementation.
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
Jx.Menu = new Class({
    Extends: Jx.Widget,
    Family: 'Jx.Menu',
    // Binds: ['onMouseEnter','onMouseLeave','hide','keypressHandler'],
    /**
     * Property: button
     * {<Jx.Button>} The button that represents this menu in a toolbar and
     * opens the menu.
     */
    button : null,
    /**
     * Property: subDomObj
     * {HTMLElement} the HTML element that contains the menu items
     * within the menu.
     */
    subDomObj : null,
    /**
     * Property: list
     * {<Jx.List>} the list of items in the menu
     */
    list: null,

    parameters: ['buttonOptions', 'options'],

    options: {
        /**
         * Option: exposeOnHover
         * {Boolean} default false, if set to true the menu will show
         * when the mouse hovers over it rather than when it is clicked.
         */
        exposeOnHover: false,
        /**
         * Option: hideDelay
         * {Integer} default 0, if greater than 0, this is the number of
         * milliseconds to delay before hiding a menu when the mouse leaves
         * the menu button or list.
         */
        hideDelay: 0,
        template: "<div class='jxMenuContainer'><ul class='jxMenu'></ul></div>",
        buttonTemplate: '<span class="jxButtonContainer"><a class="jxButton jxButtonMenu jxDiscloser"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"><span class="jxButtonLabel"></span></span></a></span>',
        position: {
            horizontal: ['left left'],
            vertical: ['bottom top', 'top bottom']
        }
    },

    classes: {
        contentContainer: 'jxMenuContainer',
        subDomObj: 'jxMenu'
    },
    
    init: function() {
        this.bound.stop = function(e){e.stop();};
        this.bound.remove = function(item) {if (item.setOwner) item.setOwner(null);};
        this.bound.show = this.show.bind(this);
        this.bound.mouseenter = this.onMouseEnter.bind(this);
        this.bound.mouseleave = this.onMouseLeave.bind(this);
        this.bound.keypress = this.keypressHandler.bind(this);
        this.bound.hide = this.hide.bind(this);
        this.parent();
    },

    /**
     * APIMethod: render
     * Create a new instance of Jx.Menu.
     */
    render : function() {
        this.parent();
        if (!Jx.Menu.Menus) {
            Jx.Menu.Menus = [];
        }

        this.contentClone = this.contentContainer.clone();
        this.list = new Jx.List(this.subDomObj, {
            onRemove: this.bound.remove
        });

        /* if options are passed, make a button inside an LI so the
           menu can be embedded inside a toolbar */
        if (this.options.buttonOptions) {
            this.button = new Jx.Button(Object.merge({},this.options.buttonOptions,{
                template: this.options.buttonTemplate,
                onClick:this.bound.show
            }));

            this.button.domA.addEvent('mouseenter', this.bound.mouseenter);
            this.button.domA.addEvent('mouseleave', this.bound.mouseleave);

            this.domObj = this.button.domObj;
            this.domObj.store('jxMenu', this);
        }
        
        this.subDomObj.addEvent('mouseenter', this.bound.mouseenter);
        this.subDomObj.addEvent('mouseleave', this.bound.mouseleave);
        this.subDomObj.store('jxSubMenu', this);
        
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    cleanup: function() {
      if (this.hideTimer) {
        window.clearTimeout(this.hideTimer);
      }
      this.list.removeEvent('remove', this.bound.remove);
      this.list.destroy();
      this.list = null;
      if (this.button) {
        this.domObj.eliminate('jxMenu');
        this.domObj = null;
        this.button.removeEvent('click', this.bound.show);
        this.button.domA.removeEvents({
          mouseenter: this.bound.mouseenter,
          mouseleave: this.bound.mouseleave
        });
        
        this.button.destroy();
        this.button = null;
      }
      this.subDomObj.removeEvents({
        mouseenter: this.bound.mouseenter,
        mouseleave: this.bound.mouseleave
      });
      this.subDomObj.removeEvents();
      this.contentContainer.removeEvent('contextmenu', this.bound.stop);
      this.subDomObj.destroy();
      this.contentContainer.destroy();
      this.contentClone.destroy();
      this.bound.remove = null;
      this.bound.show = null;
      this.bound.stop = null;
      this.bound.mouseenter = null;
      this.bound.mouseleave = null;
      this.bound.keypress = null;
      this.bound.hide = null;
      this.parent();
    },
    /**
     * APIMethod: add
     * Add menu items to the sub menu.
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to add.  Multiple menu items
     *     can be added by passing an array of menu items.
     * position - the index to add the item at, defaults to the end of the
     *     menu
     */
    add: function(item, position, owner) {
        if (Jx.type(item) == 'array') {
            item.each(function(i){
                if (i.setOwner) {
                    i.setOwner(owner||this);
                }
            }, this);
        } else {
            if (item.setOwner) {
                item.setOwner(owner||this);
            }
        }
        this.list.add(item, position);
        return this;
    },
    /**
     * APIMethod: remove
     * Remove a menu item from the menu
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to remove
     */
    remove: function(item) {
        this.list.remove(item);
        return this;
    },
    /**
     * APIMethod: replace
     * Replace a menu item with another menu item
     *
     * Parameters:
     * what - {<Jx.MenuItem>} the menu item to replace
     * withWhat - {<Jx.MenuItem>} the menu item to replace it with
     */
    replace: function(item, withItem) {
        this.list.replace(item, withItem);
        return this;
    },
    /**
     * APIMethod: empty
     * Empty the menu of items
     */
    empty: function() {
      this.list.each(function(item){
        if (item.empty) {
          item.empty();
        }
        if (item.setOwner) {
            item.setOwner(null);
        }
      }, this);
      this.list.empty();
    },
    /**
     * Method: deactivate
     * Deactivate the menu by hiding it.
     */
    deactivate: function() {this.hide();},
    /**
     * Method: onMouseOver
     * Handle the user moving the mouse over the button for this menu
     * by showing this menu and hiding the other menu.
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    onMouseEnter: function(e) {
      if (this.hideTimer) {
        window.clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }
      if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] != this) {
          this.show.delay(1,this);
      } else if (this.options.exposeOnHover) {
        if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] == this) {
          Jx.Menu.Menus[0] = null;
        }
        this.show.delay(1,this);
      }
    },
    /**
     * Method: onMouseLeave
     * Handle the user moving the mouse off this button or menu by
     * starting the hide process if so configured.
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    onMouseLeave: function(e) {
      if (this.options.hideDelay > 0) {
        this.hideTimer = (function(){
          this.deactivate();
        }).delay(this.options.hideDelay, this);
      }
    },
    
    /**
     * Method: eventInMenu
     * determine if an event happened inside this menu or a sub menu
     * of this menu.
     *
     * Parameters:
     * e - {Event} the mouse event
     *
     * Returns:
     * {Boolean} true if the event happened in the menu or
     * a sub menu of this menu, false otherwise
     */
    eventInMenu: function(e) {
        var target = document.id(e.target);
        if (!target) {
            return false;
        }
        if (target.descendantOf(this.domObj) ||
            target.descendantOf(this.subDomObj)) {
            return true;
        } else {
            var ul = target.getParent('ul');
            if (ul) {
                var sm = ul.retrieve('jxSubMenu');
                if (sm) {
                    if (sm.eventInMenu(e)) {
                      return true;
                    }
                    var owner = sm.owner;
                    while (owner) {
                        if (owner == this) {
                            return true;
                        }
                        owner = owner.owner;
                    }
                }
            }
            return false;
        }
    },

    /**
     * APIMethod: hide
     * Hide the menu.
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    hide: function(e) {
        if (e) {
            if (this.visibleItem && this.visibleItem.eventInMenu) {
                if (this.visibleItem.eventInMenu(e)) {
                    return;
                }
            } else if (this.eventInMenu(e)) {
                return;
            }
        }
        if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] == this) {
            Jx.Menu.Menus[0] = null;
        }
        if (this.button && this.button.domA) {
            this.button.domA.removeClass(this.button.options.activeClass);
        }
        if (this.hideTimer) {
          window.clearTimeout(this.hideTimer);
        }
        this.list.each(function(item){item.retrieve('jxMenuItem').hide(e);});
        document.removeEvent('mousedown', this.bound.hide);
        document.removeEvent('keydown', this.bound.keypress);
        this.unstack(this.contentContainer);
        this.contentContainer.dispose();
        this.visibleItem = null;
        this.fireEvent('hide', this);
    },
    /**
     * APIMethod: show
     * Show the menu
     */
    show : function() {
        if (this.button) {
            if (Jx.Menu.Menus[0]) {
                if (Jx.Menu.Menus[0] != this) {
                    Jx.Menu.Menus[0].button.blur();
                    Jx.Menu.Menus[0].hide();
                } else {
                    this.hide();
                    return;
                }
            }
            Jx.Menu.Menus[0] = this;
            this.button.focus();
            if (this.list.count() == 0) {
                return;
            }
        }
        if (this.hideTimer) {
          window.clearTimeout(this.hideTimer);
        }

        this.subDomObj.dispose();
        this.contentContainer.destroy();
        this.contentContainer = this.contentClone.clone();
        this.contentContainer.empty().adopt(this.subDomObj);
        this.contentContainer.addEvent('contextmenu', this.bound.stop);
        this.contentContainer.setStyle('display','none');
        document.id(document.body).adopt(this.contentContainer);
        this.contentContainer.setStyles({
            visibility: 'hidden',
            display: 'block'
        });
        this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());
        this.showChrome(this.contentContainer);

        this.position(this.contentContainer, this.domObj, Object.merge({},{
            offsets: this.chromeOffsets
        }, this.options.position));
        this.stack(this.contentContainer);
        this.contentContainer.setStyle('visibility','visible');

        if (this.button && this.button.domA) {
            this.button.domA.addClass(this.button.options.activeClass);
        }

        /* fix bug in IE that closes the menu as it opens 
         * because of bubbling (I think)
         */
        document.addEvent('mousedown', this.bound.hide);
        document.addEvent('keydown', this.bound.keypress);
        this.fireEvent('show', this);
    },
    /**
     * APIMethod: setVisibleItem
     * Set the sub menu that is currently open
     *
     * Parameters:
     * obj- {<Jx.SubMenu>} the sub menu that just became visible
     */
    setVisibleItem: function(obj) {
        if (this.hideTimer) {
          window.clearTimeout(this.hideTimer);
        }
        if (this.visibleItem != obj) {
            if (this.visibleItem && this.visibleItem.hide) {
                this.visibleItem.hide();
            }
            this.visibleItem = obj;
            this.visibleItem.show();
        }
    },

    /* hide flyout if the user presses the ESC key */
    keypressHandler: function(e) {
        e = new Event(e);
        if (e.key == 'esc') {
            this.hide();
        }
    },
    /**
     * APIMethod: isEnabled
     * This returns true if the menu is enabled, false otherwise
     *
     * Returns:
     * {Boolean} whether the menu is enabled or not
     */
    isEnabled: function() {
        return this.button ? this.button.isEnabled() : this.options.enabled ;
    },

    /**
     * APIMethod: setEnabled
     * enable or disable the menu.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the menu
     */
    setEnabled: function(enabled) {
        return this.button ? this.button.setEnabled(enabled) : this.options.enable;
    },
    /**
     * APIMethod: isActive
     * returns true if the menu is open.
     *
     * Returns:
     * {Boolean} the active state of the menu
     */
    isActive: function() {
        return this.button ? this.button.isActive() : this.options.active;
    },
    /**
     * APIMethod: setActive
     * Set the active state of the menu
     *
     * Parameters:
     * active - {Boolean} the new active state of the menu
     */
    setActive: function(active) {
        if (this.button) {
          this.button.setActive(active);
        }
    },
    /**
     * APIMethod: setImage
     * set the image of this menu to a new image URL
     *
     * Parameters:
     * path - {String} the new url to use as the image for this menu
     */
    setImage: function(path) {
        if (this.button) {
          this.button.setImage(path);
        }
    },
    /**
     * APIMethod: setLabel
     *
     * sets the text of the menu.
     *
     * Parameters:
     *
     * label - {String} the new label for the menu
     */
    setLabel: function(label) {
        if (this.button) {
          this.button.setLabel(label);
        }
    },
    /**
     * APIMethod: getLabel
     *
     * returns the text of the menu.
     */
    getLabel: function() {
        return this.button ? this.button.getLabel() : '';
    },
    /**
     * APIMethod: setTooltip
     * sets the tooltip displayed by the menu
     *
     * Parameters:
     * tooltip - {String} the new tooltip
     */
    setTooltip: function(tooltip) {
        if (this.button) {
          this.button.setTooltip(tooltip);
        }
    },
    /**
     * APIMethod: focus
     * capture the keyboard focus on this menu
     */
    focus: function() {
        if (this.button) {
          this.button.focus();
        }
    },
    /**
     * APIMethod: blur
     * remove the keyboard focus from this menu
     */
    blur: function() {
        if (this.button) {
          this.button.blur();
        }
    }
});

