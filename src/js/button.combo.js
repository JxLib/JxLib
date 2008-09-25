// $Id: button.combo.js 1013 2008-09-19 19:11:46Z pspencer $
/**
 * Class: Jx.Button.Combo
 * A drop down list of selectable items that can be any HTML.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * change - the main item has changed
 *
 * Implements:
 * * Options
 * * Events
 * * <Jx.AutoPosition>
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Button.Combo = new Class({
    Extends: Jx.Button.Multi,
    Implements: [Options,Events,Jx.AutoPosition, Jx.Chrome],
    /** 
     * Property: domObj
     * {HTMLElement} the div that contains the control, 
     * used to show/hide the control 
     */
    domObj : null,
    /** 
     * Property: ul
     * {HTMLElement} the ul that contains the selectable items 
     */
    ul : null,
    /**
     * Property: currentSelection
     * {Object} current selection in the list 
     */
    currentSelection : null,
    
    options: {
        editable: false,
        label: ''
    },
    
    /** 
     * Constructor: Jx.Combo
     * create a new instance of Jx.Combo
     *
     * Options:
     * editable - {Boolean} defaults to false.  If true, then the selected item
     * is editable.
     */
    initialize: function(options) {
        this.parent();
        this.setOptions(options);
        this.domA.removeClass('jxButtonMulti');
        this.domA.addClass('jxButtonComboDefault');
        
        if (this.options.editable) {
            this.domA.addClass('jxButtonEditCombo');
            this.domInput = new Element('input',{
                type:'text',
                events:{
                    change: this.valueChanged.bindWithEvent(this),
                    keydown: this.onKeyPress.bindWithEvent(this),
                    focus: (function() {
                        if (this.domA.hasClass('jxButtonComboDefault')) {
                            this.domInput.value = '';
                            this.domA.removeClass('jxButtonComboDefault');
                        }
                    }).bind(this)
                },
                value: this.options.label
            });
            this.domLabel.addClass('jxComboInput');
            this.domLabel.adopt(this.domInput);
        } else {
            this.discloser.dispose();
            this.domA.addClass('jxButtonCombo');
            //this.setLabel(this.options.label);
            this.addEvent('click', (function(e){
                this.discloser.fireEvent('click', e);
            }).bindWithEvent(this));
        }
        this.buttonSet = new Jx.ButtonSet({
            onChange: (function(set) {
                var button = set.activeButton;            
                this.domA.removeClass('jxButtonComboDefault');
                if (this.options.editable) {
                    this.domInput.value = button.options.label;
                } else {
                    var l = button.options.label;
                    if (l == '&nbsp;') {
                        l = '';
                    }
                    this.setLabel(l);
                }
                var img = button.options.image;
                if (img.indexOf('a_pixel') != -1) {
                    img = '';
                }
                this.setImage(img);
                if (this.options.imageClass && this.domImg) {
                    this.domImg.removeClass(this.options.imageClass);
                }
                if (button.options.imageClass && this.domImg) {
                    this.options.imageClass = button.options.imageClass;
                    this.domImg.addClass(button.options.imageClass);
                }
                this.fireEvent('change', this);
            }).bind(this)
        });
        if (this.options.items) {
            this.add(this.options.items);
        }
        this.setEnabled(this.options.enabled);
    },
    
    /**
     * Method: setEnabled
     * enable or disable the combo button.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the button
     */
    setEnabled: function(enabled) {
        this.options.enabled = enabled;
        if (this.options.enabled) {
            this.domObj.removeClass('jxDisabled');
            if (this.domInput) {
                this.domInput.disabled = false;
            }
        } else {
            this.domObj.addClass('jxDisabled');
            if (this.domInput) {
                this.domInput.disabled = true;
            }
        }
    },
    
    
    valueChanged: function() {
        
    },
    
    /**
     * Method: onKeyPress
     * Handle the user pressing a key by looking for an ENTER key to set the
     * value.
     *
     * Parameters:
     * e - {Event} the keypress event
     */
    onKeyPress: function(e) {
        if (e.key == 'enter') {
            this.valueChanged();
        }
    },
    
    /**
     * Method: add
     * add a new item to the pick list
     *
     * Parameters:
     * options - {Object} object with properties suitable to be passed to
     * a {Jx.Menu.Item} object.  More than one options object can be passed,
     * comma separated.
     */
    add: function() {
        $A(arguments).flatten().each(function(opt) {
            var button = new Jx.Menu.Item($merge(opt,{
                toggle: true
            }));
            this.menu.add(button);
            this.buttonSet.add(button);
        }, this);
    },
    
    /**
     * Method: remove
     * Remove the item at the given index
     *
     * Parameters:
     * idx - {Integer} the item to remove.
     */
    remove: function(idx) {
        //TODO: implement remove?
    },
    
    /**
     * Method: setValue
     * set the value of the Combo
     *
     * Parameters:
     * value - {Object} the new value.  May be a string, a text node, or
     * another DOM element.
     */
    setValue: function(value) {
        if (this.options.editable) {
            this.domInput.value = value;
        } else {
            this.setLabel(value);
        }
    },
    
    /**
     * Method: getValue
     * Return the current value
     *
     * Returns:
     * {Object} returns the currently selected item
     */
    getValue: function() {
        value = '';
        if (this.options.editable) {
            value = this.domInput.value;
        } else {
            value = this.getLabel();
        }
        return value;
    }
});