// $Id$
/**
 * Class: Jx.Button
 * Jx.Button creates a clickable element that can be added to a web page.
 * When the button is clicked, it fires a 'click' event.
 *
 * The CSS styling for a button is controlled by several classes related
 * to the various objects in the button's HTML structure:
 *
 * (code)
 * <div class="jxButtonContainer">
 *  <a class="jxButton">
 *   <span class="jxButtonContent">
 *    <img class="jxButtonIcon" src="image_url">
 *    <span class="jxButtonLabel">button label</span>
 *   </span>
 *  </a>
 * </div>
 * (end)
 *
 * The CSS classes will change depending on the type option passed to the
 * constructor of the button.  The default type is Button.  Passing another
 * value such as Tab will cause all the CSS classes to change from jxButton
 * to jxTab.  For example:
 *
 * (code)
 * <div class="jxTabContainer">
 *  <a class="jxTab">
 *   <span class="jxTabContent">
 *    <img class="jxTabIcon" src="image_url">
 *    <span class="jxTabLabel">tab label</span>
 *   </span>
 *  </a>
 * </div>
 * (end)
 *
 * When you construct a new instance of Jx.Button, the button does not
 * automatically get inserted into the web page.  Typically a button
 * is used as part of building another capability such as a Jx.Toolbar.
 * However, if you want to manually insert the button into your application,
 * you may use the addTo method to append or insert the button into the 
 * page.  
 *
 * There are two modes for a button, normal and toggle.  A toggle button
 * has an active state analogous to a checkbox.  A toggle button generates
 * different events (down and up) from a normal button (click).  To create
 * a toggle button, pass toggle: true to the Jx.Button constructor.
 *
 * To use a Jx.Button in an application, you should to register for the 'click'
 * event.  You can pass a function in the 'onClick' option when constructing
 * a button or you can call the addEvent('click', myFunction) method.  The
 * addEvent method can be called several times, allowing more than one function
 * to be called when a button is clicked.  You can use the 
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
    /**
     * Implements:
     * * Options
     * * Events
     * * <Jx.Addable>
     */
    Implements: [Options,Events,Jx.Addable],
    
    /**
     * Property: {Object} domObj
     * the HTML element that is inserted into the DOM for this button.  You
     * may reference this object to append it to the DOM or remove it from
     * the DOM if necessary.
     */
    domObj: null,
    
    options: {
        id: '',
        type: 'Button',
        image: '',
        tooltip: '',
        label: '',
        toggle: false,
        toggleClass: 'Toggle',
        halign: 'center',
        valign: 'middle',
        active: false,
        enabled: true,
        container: 'div'
    },
    /**
     * Constructor: Jx.Button
     * create a new button.
     *
     * Parameters:
     * options - {Object} an object containing optional properties for this
     * button as below.
     *
     * Options:
     * id - optional.  A string value to use as the ID of the button
     *    container.
     * type - optional.  A string value that indicates what type of button
     *    this is.  The default value is Button.  The type is used to form
     *    the CSS class names used for various HTML elements within the
     *    button.
     * image - optional.  A string value that is the url to load the image to
     *    display in this button.  The default styles size this image to
     *    16 x 16.
     *    If not provided, then the button will have no icon.
     * tooltip - optional.  A string value to use as the alt/title attribute
     *    of the <A> tag that wraps the button, resulting in a tooltip that
     *    appears when the user hovers the mouse over a button in most 
     *    browsers.  If not provided, the button will have no tooltip.
     * label - {String} optional, default is no label.  A string value
     *    that is used as a label on the button.
     * toggle - {Boolean} default true, whether the button is a toggle button
     *    or not.
     * toggleClass - {String} defaults to Toggle, this is class is added to
     *    buttons with the option toggle: true
     * halign - {String} horizontal alignment of the button label, 'center' by
     *     default.  Other values are 'left' and 'right'.
     * valign - {String} vertical alignment of the button label, 'middle' by
     *     default.  Other values are 'top' and 'bottom'.
     * active - {Boolean} optional, default false.  Controls the initial
     *     state of toggle buttons.
     * enabled - {Boolean} whether the button is enabled or not.
     * container - {String} the tag name of the HTML element that should be
     *     created to contain the button, by default this is 'div'.
     */
    initialize : function( options ) {
        this.setOptions(options);
        
        // the main container for the button
        var d = new Element(this.options.container, {'class': 'jx'+this.options.type+'Container'});
        if (this.options.toggle && this.options.toggleClass) {
            d.addClass('jx'+this.options.type+this.options.toggleClass);
        }
        // the clickable part of the button
        var hasFocus;
        var mouseDown;
        var a = new Element('a', {
            'class': 'jx'+this.options.type, 
            href: 'javascript:void(0)', 
            title: this.options.tooltip, 
            alt: this.options.tooltip,
            events: {
                click: this.clicked.bindWithEvent(this),
                drag: (function(e) {e.stop();}).bindWithEvent(this),
                mousedown: (function(e) {
                    this.domA.addClass('jx'+this.options.type+'Pressed');
                    hasFocus = true;
                    mouseDown = true;
                    this.focus();
                }).bindWithEvent(this),
                mouseup: (function(e) {
                    this.domA.removeClass('jx'+this.options.type+'Pressed');
                    mouseDown = false;
                }).bindWithEvent(this),
                mouseleave: (function(e) {
                    this.domA.removeClass('jx'+this.options.type+'Pressed');
                }).bindWithEvent(this),
                mouseenter: (function(e) {
                    if (hasFocus && mouseDown) {
                        this.domA.addClass('jx'+this.options.type+'Pressed');
                    }
                }).bindWithEvent(this),
                keydown: (function(e) {
                    if (e.key == 'enter') {
                        this.domA.addClass('jx'+this.options.type+'Pressed');
                    }
                }).bindWithEvent(this),
                keyup: (function(e) {
                    if (e.key == 'enter') {
                        this.domA.removeClass('jx'+this.options.type+'Pressed');
                    }
                }).bindWithEvent(this),
                blur: function() { hasFocus = false; }
            }
        });
        d.adopt(a);
        
        new Drag(a, {
            onStart: function() {this.stop();}
        });
        
        var s = new Element('span', {'class': 'jx'+this.options.type+'Content'});
        a.adopt(s);
        
        if (this.options.image || !this.options.label) {
            var i = new Element('img', {
                'class':'jx'+this.options.type+'Icon',
                'src': Jx.aPixel.src
            });
            //if image is not a_pixel, set the background image of the image
            //otherwise let the default css take over.
            if (this.options.image && this.options.image.indexOf('a_pixel.png') == -1) {
                i.setStyle('backgroundImage',"url("+this.options.image+")");
            }
            s.appendChild(i);
            if (this.options.imageClass) {
                i.addClass(this.options.imageClass);
            }
            this.domImg = i;
        }
        
        l = new Element('span', {
            html: this.options.label
        });
        if (this.options.label) {
            l.addClass('jx'+this.options.type+'Label');
        }
        s.appendChild(l);
        
        if (this.options.id) {
            d.id = this.options.id;
        }
        if (this.options.halign == 'left') {
            d.addClass('jx'+this.options.type+'ContentLeft');                
        }

        if (this.options.valign == 'top') {
            d.addClass('jx'+this.options.type+'ContentTop');
        }
        
        this.domA = a;
        this.domLabel = l;
        this.domObj = d;        

        //update the enabled state
        this.setEnabled(this.options.enabled);
        
        //update the active state if necessary
        if (this.options.active) {
            this.options.active = false;
            this.setActive(true);
        }
        
    },
    /**
     * Method: clicked
     * triggered when the user clicks the button, processes the
     * actionPerformed event
     *
     * Parameters:
     * evt - {Event} the user click event
     */
    clicked : function(evt) {
        if (this.options.enabled) {
            if (this.options.toggle) {
                this.setActive(!this.options.active);
            } else {
                this.fireEvent('click', {obj: this, event: evt});
            }
        }
        //return false;
    },
    /**
     * Method: isEnabled
     * This returns true if the button is enabled, false otherwise
     *
     * Returns:
     * {Boolean} whether the button is enabled or not
     */
    isEnabled: function() { 
        return this.options.enabled; 
    },
    
    /**
     * Method: setEnabled
     * enable or disable the button.
     *
     * Parameters:
     * enabled - {Boolean} the new enabled state of the button
     */
    setEnabled: function(enabled) {
        this.options.enabled = enabled;
        if (this.options.enabled) {
            this.domObj.removeClass('jxDisabled');
        } else {
            this.domObj.addClass('jxDisabled');
        }
    },
    /**
     * Method: isActive
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
     * Method: setActive
     * Set the active state of the button
     *
     * Parameters:
     * active - {Boolean} the new active state of the button
     */
    setActive: function(active) {
        if (this.options.active == active) {
            return;
        }
        this.options.active = active;
        if (this.options.active) {
            this.domA.addClass('jx'+this.options.type+'Active');
            this.fireEvent('down', this);
        } else {
            this.domA.removeClass('jx'+this.options.type+'Active');
            this.fireEvent('up', this);
        }
    },
    /**
     * Method: setImage
     * set the image of this button to a new image URL
     *
     * Parameters:
     * path - {String} the new url to use as the image for this button
     */
    setImage: function(path) {
        this.options.image = path;
        if (path) {
            if (!this.domImg) {
                var i = new Element('img', {
                    'class':'jx'+this.options.type+'Icon',
                    'src': Jx.aPixel.src
                });
                if (this.options.imageClass) {
                    i.addClass(this.options.imageClass);
                }
                this.domA.firstChild.grab(i, 'top');
                this.domImg = i;
            }
            this.domImg.setStyle('backgroundImage',"url("+this.options.image+")");                        
        } else if (this.domImg){
            this.domImg.dispose();
            this.domImg = null;
        }
    },
    /**
     * Method: setLabel
     * 
     * sets the text of the button.  Only works if a label was supplied
     * when the button was constructed
     *
     * Parameters: 
     *
     * label - {String} the new label for the button
     */
    setLabel: function(label) {
        this.domLabel.set('html', label);
        if (!label && this.domLabel.hasClass('jxButtonLabel')) {
            this.domLabel.removeClass('jxButtonLabel');
        } else if (label && !this.domLabel.hasClass('jxButtonLabel')) {
            this.domLabel.addClass('jxButtonLabel');
        }
    },
    /**
     * Method: getLabel
     * 
     * returns the text of the button.
     */
    getLabel: function() {
        return this.domLabel ? this.domLabel.innerHTML : '';
    },
    /**
     * Method: setTooltip
     * sets the tooltip displayed by the button
     *
     * Parameters: 
     * tooltip - {String} the new tooltip
     */
    setTooltip: function(tooltip) {
        if (this.domA) {
            this.domA.set({
                'title':tooltip,
                'alt':tooltip
            });
        }
    },
    /**
     * Method: focus
     * capture the keyboard focus on this button
     */
    focus: function() {
        this.domA.focus();
    },
    /**
     * Method: blur
     * remove the keyboard focus from this button
     */
    blur: function() {
        this.domA.blur();
    }
});