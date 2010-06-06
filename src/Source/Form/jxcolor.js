/*
---

name: Jx.Field.Color

description: Represents an input field with a jx.button.color

license: MIT-style license.

requires:
 - Jx.Text
 - Jx.Button.Color
 - Jx.Form
 - Jx.Plugin.Field.Validator

provides: [Jx.Field.Color]

...
 */
/**
 * Class: Jx.Field.Color
 *
 * Extends: <Jx.Field>
 *
 * This class provides a Jx.Field.Text in combination with a Jx.Button.Color
 * to have a Colorpicker with an input field.
 *
 * License:
 * Copyright (c) 2010, Paul Spener, Fred Warnock, Conrad Barthelmes
 *
 * This file is licensed under an MIT style license
 */
  Jx.Field.Color = new Class({
    Extends: Jx.Field,
    Binds: ['changed','hide','keyup','changeText'],
    type: 'Color',
    options: {
      buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>',
      /**
       * Option: template
       * The template used to render this field
       */
      template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputColor"  name="{name}"><img class="jxInputIcon" src="'+Jx.aPixel.src+'"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>',
      /**
       * Option: showOnHover
       * {Boolean} show the color palette when hovering over the input, default 
       * is false
       */
      showOnHover: false,
      /**
       *  Option: showDelay
       *  set time in milliseconds when to show the color field on mouseenter
       */
      showDelay: 250,
      /**
       * Option: errorMsg
       * error message for the validator.
       */
      errorMsg: 'Invalid Web-Color',
      /**
       * Option: color
       * a color to initialize the field with, defaults to #000000
       * (black) if not specified.
       */
      color: '#000000'

    },
    button: null,
    validator: null,
    render: function() {
        this.classes.combine({
          wrapper: 'jxInputWrapper',
          revealer: 'jxInputRevealer',
          icon: 'jxInputIcon'
        });
        this.parent();

      var self = this;
      if (!Jx.Field.Color.ColorPalette) {
          Jx.Field.Color.ColorPalette = new Jx.ColorPalette(this.options);
      }
      this.button = new Jx.Button.Flyout({
          template: this.options.buttonTemplate,
          imageClass: 'jxInputRevealerIcon',
          positionElement: this.field,
          onBeforeOpen: function() {
            if (Jx.Field.Color.ColorPalette.currentButton) {
                Jx.Field.Color.ColorPalette.currentButton.hide();
            }
            Jx.Field.Color.ColorPalette.currentButton = this;
            Jx.Field.Color.ColorPalette.addEvent('change', self.changed);
            Jx.Field.Color.ColorPalette.addEvent('click', self.hide);
            this.content.appendChild(Jx.Field.Color.ColorPalette.domObj);
            Jx.Field.Color.ColorPalette.domObj.setStyle('display', 'block');
          },
          onOpen: function() {
            /* setting these before causes an update problem when clicking on
             * a second color button when another one is open - the color
             * wasn't updating properly
             */
            Jx.Field.Color.ColorPalette.options.color = self.options.color;
            Jx.Field.Color.ColorPalette.updateSelected();
          }
        }).addTo(this.revealer);

      this.validator = new Jx.Plugin.Field.Validator({
        validators: [{
            validatorClass: 'colorHex',
            validator: {
              name: 'colorValidator',
              options: {
                validateOnChange: false,
                errorMsg: self.options.errorMsg,
                test: function(field,props) {
                  try {
                    var c = field.get('value').hexToRgb(true);
                    if(c == null) return false;
                    for(var i = 0; i < 3; i++) {
                      if(c[i].toString() == 'NaN') {
                        return false;
                      }
                    }
                  }catch(e) {
                    return false;
                  }
                  c = c.rgbToHex().toUpperCase();
                  self.setColor(c);
                  return true;
                }
              }
            }
        }],
        validateOnBlur: true,
        validateOnChange: true
      });
      this.validator.attach(this);
      this.field.addEvent('keyup', this.onKeyUp.bind(this));
      if (this.options.showOnHover) {
        this.field.addEvent('mouseenter', function(ev) {
          self.button.clicked.delay(self.options.showDelay, self.button);
        });
      }
      this.setValue(this.options.color);
      this.icon.setStyle('background-color', this.options.color);
      //this.addEvent('change', self.changed);
    },
    /*
     * Method: onKeyUp
     *
     * listens to the keyup event and validates the input for a hex color
     *
     */
    onKeyUp : function(ev) {
      var color = this.getValue();
      if (color.substring(0,1) == '#') {
          color = color.substring(1);
      }
      if (color.toLowerCase().match(/^[0-9a-f]{6}$/)) {
          this.options.color = '#' +color.toUpperCase();
          this.setColor(this.options.color);
      }
    },
    setColor: function(c) {
        this.options.color = c;
        this.setValue(c);
        this.icon.setStyle('background-color', c);
    },
    changed: function() {
        var c = Jx.Field.Color.ColorPalette.options.color;
        this.setColor(c);
    },
    hide: function() {
        this.button.setActive(false);
        Jx.Field.Color.ColorPalette.removeEvent('change', this.changed);
        Jx.Field.Color.ColorPalette.removeEvent('click', this.hide);

        this.button.hide();
        Jx.Field.Color.ColorPalette.currentButton = null;
    },
    changeText: function(lang) {
      this.parent();
    }
  });
