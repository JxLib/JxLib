// $Id$
/**
 * Class: Jx.Field.Combo
 *
 * Extends: <Jx.Field>
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * change - 
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Combo = new Class({
    Family: 'Jx.Field.Combo',
    Extends: Jx.Field,

    options: {
        buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>',
        /* Option: template
         */
         template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputCombo"  name="{name}"><img class="jxInputIcon" src="'+Jx.aPixel.src+'"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>'
     },
     
     type: 'Combo',
     
    /**
     * APIMethod: render
     * create a new instance of Jx.Field.Combo
     */
    render: function() {
        this.classes.combine({
          wrapper: 'jxInputWrapper',
          revealer: 'jxInputRevealer',
          icon: 'jxInputIcon'
        });
        this.parent();
        
        var button = new Jx.Button({
          template: this.options.buttonTemplate,
          imageClass: 'jxInputRevealerIcon'
        }).addTo(this.revealer);

        this.menu = new Jx.Menu();
        this.menu.button = button;
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
                if (this.options.imageClass && this.icon) {
                    this.icon.removeClass(this.options.imageClass);
                }
                if (button.options.imageClass && this.icon) {
                    this.options.imageClass = button.options.imageClass;
                    this.icon.addClass(button.options.imageClass);
                }
                this.fireEvent('change', this);
            }).bind(this)
        });
        if (this.options.items) {
            this.add(this.options.items);
        }
        button.addEvent('click', function(e) {
            if (this.list.count() === 0) {
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

            document.addEvent('mousedown', this.bound.mousedown);
            document.addEvent('keyup', this.bound.keypress);

            this.fireEvent('show', this);
        }.bindWithEvent(this.menu));

        this.menu.addEvents({
            'show': (function() {
                //this.setActive(true);
            }).bind(this),
            'hide': (function() {
                //this.setActive(false);
            }).bind(this)
        });
        
        this.addEvent('change', function(){
          console.log('on change detected');
        })
    },
    
    setLabel: function(label) {
      if ($defined(this.field)) {
        this.field.value = label;
      }
    },
    
    setImage: function(url) {
      if ($defined(this.icon)) {
        this.icon.setStyle('background-image', 'url('+url+')');
      }
      if (!url) {
        this.wrapper.addClass('jxInputIconHidden');
      } else {
        this.wrapper.removeClass('jxInputIconHidden');
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
     * Method: getValue
     * returns the currently selected value
     */
    getValue: function() {
        return this.options.label;
    },

    setValue: function(value) {
        this.buttonSet.buttons.each(function(button){
            if (button.options.label === value) {
                button.setActive(true);
            }
        },this);
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
            if (opt.selected) {
              this.buttonSet.setActiveButton(button);
            }
        }, this);
    },

    /**
     * Method: remove
     * Remove the item at the given index.  Not implemented.
     *
     * Parameters:
     * idx - {Mixed} the item to remove by reference or by index.
     */
    remove: function(idx) {
      var item;
      if ($type(idx) == 'number' && idx < this.buttonSet.buttons.length) {
        item = this.buttonSet.buttons[idx];
      } else if ($type(idx) == 'string'){
        this.buttonSet.buttons.some(function(button){
            if (button.options.label === idx) {
                item = button;
                return true;
            }
            return false;
        },this);
      }
      if (item) {
        this.buttonSet.remove(item);
        this.menu.remove(item);
      }
    },
    /**
     * APIMethod: empty
     * remove all values from the combo
     */
    empty: function() {
      this.menu.empty();
      this.buttonSet.empty();
      this.setLabel('');
      this.setImage(Jx.aPixel.src);
    }
});