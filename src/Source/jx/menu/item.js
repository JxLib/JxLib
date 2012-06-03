/*
---

name: Jx.Menu.Item

description: A menu item is a single entry in a menu.

license: MIT-style license.

requires:
 - Jx.Menu

provides: [Jx.Menu.Item]

images:
 - menuitem.png
...
 */
// $Id$
/**
 * Class: Jx.Menu.Item
 *
 * Extends: <Jx.Button>
 *
 * A menu item is a single entry in a menu.  It is typically composed of
 * a label and an optional icon.  Selecting the menu item emits an event.
 *
 * Jx.Menu.Item is represented by a <Jx.Button> with type MenuItem and the
 * associated CSS changes noted in <Jx.Button>.  The container of a MenuItem
 * is an 'li' element.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * click - fired when the menu item is clicked.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define('jx/menu/item', ['../../base','../button'],
       function(base, Button){
    
    var item = new Class({
        Extends: Button,
        Family: 'Jx.Menu.Item',
        /**
         * Property: owner
         * {<Jx.SubMenu> or <Jx.Menu>} the menu that contains the menu item.
         */
        owner: null,
        options: {
            //image: null,
            label: '&nbsp;',
            toggleClass: 'jxMenuItemToggle',
            pressedClass: 'jxMenuItemPressed',
            activeClass: 'jxMenuItemActive',
            /* Option: template
             * the HTML structure of the button.  As a minimum, there must be a
             * containing element with a class of jxMenuItemContainer and an
             * internal element with a class of jxMenuItem.  jxMenuItemIcon and
             * jxMenuItemLabel are used if present to put the image and label into
             * the button.
             */
            template: '<li class="jxMenuItemContainer"><a class="jxMenuItem"><span class="jxMenuItemContent"><img class="jxMenuItemIcon" src="'+base.aPixel.src+'"><span class="jxMenuItemLabel"></span></span></a></li>'
        },
        classes: {
            domObj:'jxMenuItemContainer',
            domA: 'jxMenuItem',
            domImg: 'jxMenuItemIcon',
            domLabel: 'jxMenuItemLabel'
        },
        init: function() {
          this.bound.mouseover = this.onMouseOver.bind(this);
          this.parent();
        },
        /**
         * APIMethod: render
         * Create a new instance of Jx.Menu.Item
         */
        render: function() {
            if (!this.options.image) {
                this.options.image = base.aPixel.src;
            }
            this.parent();
            if (this.options.image && this.options.image != base.aPixel.src) {
                this.domObj.removeClass(this.options.toggleClass);
            }
            if (this.options.target) {
              this.domA.set('target', this.options.target);
            }
            this.domObj.addEvent('mouseover', this.bound.mouseover);
            this.domObj.store('jxMenuItem', this);
        },
        cleanup: function() {
          this.domObj.eliminate('jxMenuItem');
          this.domObj.removeEvent('mouseover', this.bound.mouseover);
          this.bound.mouseover = null;
          this.owner = null;
          this.parent();
        },
        /**
         * Method: setOwner
         * Set the owner of this menu item
         *
         * Parameters:
         * obj - {Object} the new owner
         */
        setOwner: function(obj) {
            this.owner = obj;
        },
        /**
         * Method: hide
         * Hide the menu item.
         */
        hide: function() {this.blur.delay(1,this);},
        /**
         * Method: show
         * Show the menu item
         */
        show: function(){},
        /**
         * Method: clicked
         * Handle the user clicking on the menu item, overriding the <Jx.Button::clicked>
         * method to facilitate menu tracking
         *
         * Parameters:
         * obj - {Object} an object containing an event property that was the user
         * event.
         */
        clicked: function(obj) {
            var href = this.options.href && this.options.href.indexOf('javascript:') != 0;
            if (this.options.enabled) {
              if (!href) {
                if (this.options.toggle) {
                    this.setActive.delay(1,this,!this.options.active);
                }
                this.fireEvent.delay(1, this, ['click', {obj: this}]);
                this.blur();
              }
              if (this.owner && this.owner.deactivate) {
                  this.owner.deactivate.delay(1, this.owner, obj.event);
              }
            }
            return href ? true : false;
        },
        /**
         * Method: onmouseover
         * handle the mouse moving over the menu item
         */
        onMouseOver: function(e) {
            e.stop();
            if (this.owner && this.owner.setVisibleItem) {
                this.owner.setVisibleItem(this);
            }
            return false;
        },
        
        /**
         * APIMethod: changeText
         *
         * updates the label of the menu item on langChange Event for
         * Internationalization
         */
        changeText: function(lang) {
            this.parent();
            if (this.owner && this.owner.deactivate) {
                this.owner.deactivate();
            }
        }
    });

    if (base.global) {
        base.global.Menu.Item = item;
    }
    
    return item;

});
