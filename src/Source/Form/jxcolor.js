/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Class: Jx.Field.Color
 *
 * Extends: <Jx.Field.Text>
 *
 * This class provides a Jx.Field.Text in combination with a Jx.Button.Color
 * to have a Colorpicker with an input field.
 *
 * License:
 * Copyright (c) 2010, Conrad Barthelmes.
 *
 * This file is licensed under an MIT style license
 */
  Jx.Field.Color = new Class({
    Extends: Jx.Field.Text,

    options: {
      /**
       *  Option: showDelay
       *  set time in milliseconds when to show the color field on mouseenter
       */
      showDelay : 250,
      /**
       * Option: buttonOptions
       * all Buttons for Jx.Button.Color (except onChange event)
       *
       */
      buttonOptions : {},
      /**
       * Option: errorMsg
       * error message for the validator.
       */
      errorMsg : 'Invalid Web-Color',
      /**
       * Option: template
       * The template used to render this field
       */
      template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><input class="jxInputText" type="text" name="{name}"/><span class="jxInputTag"></span></span>'
    },
    btnColor : null,
    validator : null,
    render: function() {
      this.parent();
      var self = this;
      var colorOpts = this.options.buttonOptions;
      // overwrite custom onChange with own???
      // is it possible to preserve the old one and call it inside the function?
      colorOpts.onChange = function() {
        self.setValue(self.btnColor.options.color);
        self.field.fireEvent('blur');
      }
      this.btnColor = new Jx.Button.Color(colorOpts).addTo(this);

      var validator = new Jx.Plugin.Field.Validator({
        validators: [{
            validatorClass : 'colorHex',
            validator : {
              name : 'colorValidator',
              options: {
                validateOnChange : false,
                errorMsg: self.options.errorMsg,
                test : function(field,props) {
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
                  self.btnColor.setColor(c.rgbToHex());
                  return true;
                }
              }
            }
        }],
        validateOnBlur : true,
        validateOnChange : true
      });
      validator.attach(this);
      this.field.addEvent('mouseenter', function(ev) {
        self.btnColor.clicked.delay(self.options.showDelay, self.btnColor);
      });
    }
  });
