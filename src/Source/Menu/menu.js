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
    Family: 'Jx.Menu',
    Extends: Jx.Widget,
    Binds: ['onMouseEnter','onMouseLeave','hide','keypressHandler'],
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

    classes: new Hash({
        contentContainer: 'jxMenuContainer',
        subDomObj: 'jxMenu'
    }),

    /**
     * APIMethod: render
     * Create a new instance of Jx.Menu.
     */
    render : function() {
        this.parent();
        if (!Jx.Menu.Menus) {
            Jx.Menu.Menus = [];
        }

        this.contentContainer.addEvent('onContextmenu', function(e){e.stop();});

        this.list = new Jx.List(this.subDomObj, {
            onRemove: function(item) {
                item.setOwner(null);
            }.bind(this)
        });

        /* if options are passed, make a button inside an LI so the
           menu can be embedded inside a toolbar */
        if (this.options.buttonOptions) {
            this.button = new Jx.Button($merge(this.options.buttonOptions,{
                template: this.options.buttonTemplate,
                onClick:this.show.bind(this)
            }));

            this.button.domA.addEvent('mouseenter', this.onMouseEnter);
            this.button.domA.addEvent('mouseleave', this.onMouseLeave);

            this.domObj = this.button.domObj;
            this.domObj.store('jxMenu', this);
        }
        
        this.subDomObj.addEvent('mouseenter', this.onMouseEnter);
        this.subDomObj.addEvent('mouseleave', this.onMouseLeave);

        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
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
                i.setOwner(owner||this);
            }, this);
        } else {
            item.setOwner(owner||this);
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
          $clear(this.hideTimer);
          this.hideTimer = null;
        }
        if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] != this) {
            this.show({event:e});
        } else if (this.options.exposeOnHover) {
          if (Jx.Menu.Menus[0] && Jx.Menu.Menus[0] == this) {
            Jx.Menu.Menus[0] = null;
          }
          this.show({event:e});
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
            var ul = target.findElement('ul');
            if (ul) {
                var sm = ul.retrieve('jxSubMenu');
                if (sm) {
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

        /*
        this.list.items().some(
            function(item) {
                var menuItem = item.retrieve('jxMenuItem');
                return menuItem instanceof Jx.Menu.SubMenu &&
                       menuItem.eventInMenu(e);
            }
        );
        */
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
        this.list.each(function(item){item.retrieve('jxMenuItem').hide(e);});
        document.removeEvent('mousedown', this.hide);
        document.removeEvent('keydown', this.keypressHandler);
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
        this.contentContainer.setStyle('display','none');
        document.id(document.body).adopt(this.contentContainer);
        this.contentContainer.setStyles({
            visibility: 'hidden',
            display: 'block'
        });

        /* we have to size the container for IE to render the chrome correctly
         * but just in the menu/sub menu case - there is some horrible 
         * peekaboo bug in IE related to ULs that we just couldn't figure out
         */
        this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());
        this.showChrome(this.contentContainer);

        this.position(this.contentContainer, this.domObj, $merge({
            offsets: this.chromeOffsets
        }, this.options.position));
        this.stack(this.contentContainer);
        this.contentContainer.setStyle('visibility','visible');

        if (this.button && this.button.domA) {
            this.button.domA.addClass(this.button.options.activeClass);
        }

        /* fix bug in IE that closes the menu as it opens because of bubbling */
        document.addEvent('mousedown', this.hide);
        document.addEvent('keydown', this.keypressHandler);
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
        return this.button.isEnabled;
    },

    /**
     * APIMethod: setEnabled
     * enable or disable the menu.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the menu
     */
    setEnabled: function(enabled) {
        return this.button.setEnabled(enabled);
    },
    /**
     * APIMethod: isActive
     * returns true if the menu is open.
     *
     * Returns:
     * {Boolean} the active state of the menu
     */
    isActive: function() {
        return this.button.isActive();
    },
    /**
     * APIMethod: setActive
     * Set the active state of the menu
     *
     * Parameters:
     * active - {Boolean} the new active state of the menu
     */
    setActive: function(active) {
        this.button.setActive(active);
    },
    /**
     * APIMethod: setImage
     * set the image of this menu to a new image URL
     *
     * Parameters:
     * path - {String} the new url to use as the image for this menu
     */
    setImage: function(path) {
        this.button.setImage(path);
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
        this.button.setLabel(label);
    },
    /**
     * APIMethod: getLabel
     *
     * returns the text of the menu.
     */
    getLabel: function() {
        return this.button.getLabel();
    },
    /**
     * APIMethod: setTooltip
     * sets the tooltip displayed by the menu
     *
     * Parameters:
     * tooltip - {String} the new tooltip
     */
    setTooltip: function(tooltip) {
        this.button.setTooltip(tooltip);
    },
    /**
     * APIMethod: focus
     * capture the keyboard focus on this menu
     */
    focus: function() {
        this.button.focus();
    },
    /**
     * APIMethod: blur
     * remove the keyboard focus from this menu
     */
    blur: function() {
        this.button.blur();
    }

});

