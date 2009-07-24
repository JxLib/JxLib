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
    Extends: Jx.Button,
    ul : null,
    /**
     * Property: currentSelection
     * {Object} current selection in the list 
     */
    currentSelection : null,
    
    options: {
        /* Option: label
         * string, default ''.  The label to display next to the combo.
         */
        label: '',
        /* Option: template
         */
         template: '<span class="jxButtonContainer"><a class="jxButton jxButtonCombo"><span class="jxButtonContent"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"><span class="jxButtonLabel"></span></span></a></span>'
     },
        
    /** 
     * Constructor: Jx.Combo
     * create a new instance of Jx.Combo
     *
     * Parameters:
     * options - <Jx.button.Combo.Options>
     */
    initialize: function(options) {
        this.parent(options);

        this.menu = new Jx.Menu();
        this.menu.button = this;
        this.buttonSet = new Jx.ButtonSet();

        this.buttonSet = new Jx.ButtonSet({
            onChange: (function(set) {
                var button = set.activeButton;            
                var l = button.options.label;
                if (l == '&nbsp;') {
                    l = '';
                }
                this.setLabel(l);
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
        var button = this;
        this.addEvent('click', (function(e) {
            if (this.items.length === 0) {
                return;
            }
            if (!button.options.enabled) {
                return;
            }
            this.contentContainer.setStyle('visibility','hidden');
            this.contentContainer.setStyle('display','block');
            $(document.body).adopt(this.contentContainer);            
            /* we have to size the container for IE to render the chrome correctly
             * but just in the menu/sub menu case - there is some horrible peekaboo
             * bug in IE related to ULs that we just couldn't figure out
             */
            this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());

            this.showChrome(this.contentContainer);

            this.position(this.contentContainer, this.button.domObj, {
                horizontal: ['right right'],
                vertical: ['bottom top', 'top bottom'],
                offsets: this.chromeOffsets
            });

            this.contentContainer.setStyle('visibility','');

            document.addEvent('mousedown', this.hideWatcher);
            document.addEvent('keyup', this.keypressWatcher);
            
            this.fireEvent('show', this);
        }).bindWithEvent(this.menu));
        
        this.menu.addEvents({
            'show': (function() {
                this.domA.addClass('jxButtonActive');                    
            }).bind(this),
            'hide': (function() {
                if (this.options.active) {
                    this.domA.addClass('jxButtonActive');                    
                }
            }).bind(this)
        });
        
    },
    
    /**
     * Method: valueChanged
     * invoked when the current value is changed
     */
    valueChanged: function() {
        this.fireEvent('change', this);
    },
    
    /**
     * Method: getValue
     * returns the currently selected value
     */
    getValue: function() {
        return this.options.label;
    },
    
    setValue: function() {
        
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
    }
});