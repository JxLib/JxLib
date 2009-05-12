// $Id$
/**
 * Class: Jx.Button.Combo
 *
 * Extends: <Jx.Button.Multi>
 *
 * A drop down list of selectable items.  Items can be either a string, an image or both.
 *
 * Example:
 * (code)
 * new Jx.Button.Combo({
 *     label: 'Choose a symbol',
 *     items: [
 *         {label: 'Star', image: 'images/swatches.png', imageClass: 'comboStar'},
 *         {label: 'Square', image: 'images/swatches.png', imageClass: 'comboSquare'},
 *         {label: 'Triangle', image: 'images/swatches.png', imageClass: 'comboTriangle'},
 *         {label: 'Circle', image: 'images/swatches.png', imageClass: 'comboCircle'},
 *         {label: 'Plus', image: 'images/swatches.png', imageClass: 'comboPlus'},
 *         {label: 'Cross', image: 'images/swatches.png', imageClass: 'comboCross'}
 *     ],
 *     onChange: function(combo) { alert('you selected ' + combo.getValue()) }
 * })
 * (end)
 *
 * Events:
 * change - triggered when the user selects a new item from the list
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Button.Combo = new Class({
    Family: 'Jx.Button.Combo',
    Extends: Jx.Button.Multi,
    domObj : null,
    ul : null,
    /**
     * Property: currentSelection
     * {Object} current selection in the list 
     */
    currentSelection : null,
    
    options: {
        /* Option: editable
         * boolean, default false.  Can the value be edited by the user?
         */
        editable: false,
        /* Option: label
         * string, default ''.  The label to display next to the combo.
         */
        label: ''
    },
    
    /** 
     * Constructor: Jx.Combo
     * create a new instance of Jx.Combo
     *
     * Parameters:
     * options - <Jx.button.Combo.Options>
     */
    initialize: function(options) {
        this.parent(); //we don't want to pass options to parent
        this.setOptions(options);
        this.domA.removeClass('jxButtonMulti');
        if (this.options.editable) {
            // remove the button's normal A tag and replace it with a span
            // so the input ends up not being inside an A tag - this was
            // causing all kinds of problems for selecting text inside it
            // due to some user-select: none classes that were introduced
            // to make buttons not selectable in the first place.
            //
            // Ultimately I think we want to fix this so that the discloser
            // in Jx.Button.Multi is a separate beast and we can use it here
            // without inheriting from multi buttons
            var s = new Element('span', {'class':'jxButton'});
            s.adopt(this.domA.firstChild);
            this.domA = s.replaces(this.domA);
            this.domA.addClass('jxButtonComboDefault');
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
            this.domLabel.empty();
            this.domLabel.addClass('jxComboInput');
            this.domLabel.adopt(this.domInput);
        } else {
            this.discloser.dispose();
            this.domA.addClass('jxButtonCombo');
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
    
    /**
     * Method: valueChanged
     * invoked when the current value is changed
     */
    valueChanged: function() {
        this.fireEvent('change', this);
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
     * a <Jx.Menu.Item.Options> object.  More than one options object can be
     * passed, comma separated or in an array.
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
     * Remove the item at the given index.  Not implemented.
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