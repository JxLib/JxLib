// $Id: $
/**
 * Class: Jx.Plugin.Editor
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to enable inline editing within a cell
 *
 * Original selection code from Jx.Grid's original class
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Conrad Barthelmes.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Editor = new Class({

    Extends : Jx.Plugin,

    options : {
      /**
       * Option: enabled
       * Determines if inline editing is avaiable
       */
      enabled : true,
      /**
       * Option: blurDelay
       * Set the time in miliseconds when the inputfield/popup shall hide. When
       * the user refocuses the input/popup within this time, the timeout will be cleared
       *
       * set to 'false' if no hiding on blur is wanted
       */
      blurDelay : 500,
      /**
       * Option: popup
       *
       * Definitions for a PopUp to use.
       * - use        - determines whether to use a PopUp or simply the input
       * - useLabel   - determines whether to use labels on top of the input.
       *                Text will be the column header
       * - useButtons - determines whether to use Submit and Cancel Buttons
       * - buttonLabel.submit - Text for Submit Button
       * - buttonLabel.cancel - Text for Cancel Button
       */
      popup : {
        use           : false,
        useLabel      : true,
        useCloseIcon  : false,      // do we need this? 
        useButtons    : true,
        button        : {
          submit : {
            label : 'Save',
            image : 'http://famfamfam.com/lab/icons/silk/icons/accept.png'
          },
          cancel : {
            label : 'Cancel',
            image : 'http://famfamfam.com/lab/icons/silk/icons/cancel.png'
          }
        },
        template: '<div class="jxGridEditorPopup"><div class="jxGridEditorPopupInnerWrapper"></div></div>'
      },
      /**
       * Option {boolean} validate
       * - set to true to have all editable input fields as mandatory field
       *   if they don't have 'mandatory:true' in their colOptions
       */
      validate : true,
      /**
       * Option: {Array} fieldOptions with objects
       * Contains objects with options for the Jx.Field instances to show up.
       * Default options will be added automatically if custom options are entered.
       *
       * Preferences:
       *   field             - Default * for all types or the name of the column in the model (Jx.Store)
       *   type              - Input type to show (Text, Password, Textarea, Select, Checkbox)
       *   options           - All Jx.Field options for this column. More options depend on what type you are using.
       *                       See Jx.Form.[yourField] for details
       *   validatorOptions: - See Jx.Plugin.Field.Validator Options for details
       *                       will only be used if this.options.validate is set to true
       */
      fieldOptions : [
        {
          field   : '*',
          type    : 'Text',
          options : {},
          validatorOptions: {
            validators : [],
            validateOnBlur: true,
            validateOnChange : false
          }
        }
      ],
      /**
       * Option: {Boolean} fieldFormatted
       * Displays the cell value also inside the input field as formatted
       */
      fieldFormatted : true,
      /**
       * Option cellChangeFx
       * set use to false if no highlighting effect is wanted.
       *
       * this is just an idea how successfully changing could be highlighed for the user
       */
      cellChangeFx : {
        use     : true,
        success : '#090',
        warning : '#FC0',     // not yet implemented
        error   : '#F00'
      },
      /**
       * Option cellOutline
       * shows an outline style to the currently active cell to make it easier to see
       * which cell is active
       */
      cellOutline : {
        use   : true,
        style : '2px solid #88c3e7'
      },
      /**
       * Option: useKeyboard
       * Set to false if no keyboard support is needed
       */
      useKeyboard : true,
      /**
       * Option: keys
       * Contains the event codes for several commands that can be used when
       * a field is active. Syntax is the same like for the Mootools Keyboard Class
       * http://mootools.net/docs/more/Interface/Keyboard
       */
      keys : {
        'enter'            : 'saveNClose',
        'ctrl+enter'       : 'saveNGoDown',
        'ctrl+shift+enter' : 'saveNGoUp',
        'tab'              : 'saveNGoRight',
        'shift+tab'        : 'saveNGoLeft',
        'esc'              : 'cancelNClose',
        'up'               : 'valueIncrement',
        'down'             : 'valueDecrement'
      }
    },
    /**
     * Property: bound
     * storage for bound methods useful for working with events
     */
    bound: {},
    classes: ['jxGridEditorPopup', 'jxGridEditorPopupInnerWrapper'],
    /**
     * Property: activeCell
     *
     * Containing Objects:
     *   field        : Reference to the Jx.Field instance that will be created
     *   cell         : Reference to the cell inside the table 
     *   span         : Reference to the Dom Element inside the selected cell of the grid
     *   oldValue     : Old value of the cell from the grid's model
     *   timeoutId    : TimeoutId if the focus blurs the input.
     *   coords       : Coordinates of the selected cell
     *   colOptions   : Reference to the column's option in which the cell is
     *   fieldOptions : Reference to the field options of this column
     */
    activeCell : {
      field       : null,
      cell        : null,
      span        : null,
      oldValue    : null,
      timeoutId   : null,
      coords      : {},
      colOptions  : {},
      fieldOptions: {}
    },
    /**
     * Property : popup
     *
     * References to all contents within a popup (only 1 popup for 1 grid initialization)
     *
     * COMMENT: I don't know how deep we need to go into that.. innerWrapper and closeLink probably don't need
     * own references.. I just made them here in case they are needed at some time..
     *
     * Containing Objects:
     *   domObj         : Reference to the Dom Element of the popup (absolutely positioned)
     *   innerWrapper   : Reference to the inner Wrapper inside the popup to provide relative positioning
     *   closeIcon      : Reference to the Dom Element of a little [x] in the upper right to close it (not saving)
     *   buttons        : References to all Jx.Buttons used inside the popup
     *   buttons.submit : Reference to the Submit Button
     *   buttons.cancel : Reference to the Cancel Button
     */
    popup : {
      domObj       : null,
      innerWarpper : null,
      closeIcon    : null,
      buttons      : {
        submit : null,
        cancel : null
      }
    },
    /**
     * Property: keyboard
     * Instance of a Mootols Keyboard Class
     */
    keyboard : null,
    /**
     * Property keyboardMethods
     * Editing and grid functions for keyboard functionality.
     * Methods are defined and implemented inside this.attach() because of referencing troubles
     */
    keyboardMethods : {},
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
      this.parent();
      this.bound.activate   = this.activate.bind(this);
      this.bound.deactivate = this.deactivate.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and attaches the plugin to the grid events it
     * will be monitoring
     *
     * @var {Object} grid - Instance of Class Jx.Grid
     */
    attach: function (grid) {
      if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
        return;
      }
      this.grid = grid;

      this.grid.addEvent('gridCellSelect', this.bound.activate);
      this.grid.addEvent('gridCellUnSelect', this.bound.deactivate);

      /*
       * add default field options to the options in case some new options were entered
       * to be still able to use them for the rest of the fields
       */
      if(this.getFieldOptionsByColName('*').field != '*') {
        this.options.fieldOptions.unshift({
          field   : '*',
          type    : 'Text',
          options : {},
          validatorOptions: {
            validators : [],
            validateOnBlur: true,
            validateOnChange : false
          }
        });
      }

      /**
       * set the keyboard methods here to have a correct reference to the instance of
       * the editor plugin
       *
       * @todo other names maybe? or even completely different way of handling the keyboard events?
       * @todo more documentation than method name
       */
      var self = this;
      this.keyboardMethods = {
        saveNClose     : function(ev) { 
          if(self.activeCell.fieldOptions.type != 'Textarea') {
            self.deactivate()
          }
        },
        saveNGoDown    : function(ev) {ev.preventDefault();self.getNextCellInCol()},
        saveNGoUp      : function(ev) {ev.preventDefault();self.getPrevCellInCol()},
        saveNGoRight   : function(ev) {ev.preventDefault();self.getNextCellInRow()},
        saveNGoLeft    : function(ev) {ev.preventDefault();self.getPrevCellInRow()},
        cancelNGoRight : function(ev) {ev.preventDefault();self.getNextCellInRow(false)},
        cancelNClose   : function(ev) {ev.preventDefault();self.deactivate(false)},
        valueIncrement : function(ev) {ev.preventDefault();self.cellValueIncrement(true)},
        valueDecrement : function(ev) {ev.preventDefault();self.cellValueIncrement(false)}
      };
      
      var keyboardEvents = {};
      for(var i in this.options.keys) {
        keyboardEvents[i] = this.keyboardMethods[this.options.keys[i]];
      }

      // initalize keyboard support but do NOT activate it (this is done inside this.activate()).
      this.keyboard = new Keyboard({
        events: keyboardEvents
      });
    },
    /**
     * APIMethod: detach
     * detaches from the grid
     * 
     * @return void
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridClick', this.bound.activate);
        }
        this.grid = null;
        this.keyboard = null;
    },
    /**
     * Method: activate
     * activates the input field or breaks up if conditions are not fulfilled
     *
     * @todo Field validation
     *
     * Parameters:
     * @var {Object} cell Table Element
     * @return void
     */
    activate: function(cell) {
      if(!this.options.enabled)
        return;

      var data  = cell.retrieve('jxCellData');
      // @todo Rename Header too??
      // return if a table header was clicked
      if(($defined(data.colHeader) && data.colHeader) || ($defined(data.rowHeader) && data.rowHeader))
        return;

      var row   = data.row,
          index = data.index;

      if(this.cellIsInGrid(row, index)) {
        var model      = this.grid.getModel(),
            //cell       = this.grid.gridTableBody.rows[row].cells[col] ? this.grid.gridTableBody.rows[row].cells[col] : null,
            colOptions = this.grid.columns.getByGridIndex(index-1).options;
        if (!cell || !colOptions.isEditable) {
          return;
        }
        // if disabling a currently active one fails (mandatory for example) do not continue
        if(this.deactivate() == false) {
          return;
        }

        // set active record index to selected row
        model.moveTo(row);
        
        // store properties of the active cell
        this.activeCell = {
          oldValue      : model.get(data.index),
          fieldOptions  : this.getFieldOptionsByColName(colOptions.name),
          colOptions    : colOptions,
          coords        : { row : row, index : index },
          cell          : cell,
          span          : cell.getElement('span.jxGridCellContent'),
          validator     : null
        }

        // check if this column has special validation settings - otherwise use default from this.options.validate
        if(!$defined(this.activeCell.colOptions.validate) || typeof(this.activeCell.colOptions.validate) != 'boolean') {
          this.activeCell.colOptions.validate = this.options.validate;
        }

        var jxFieldOptions = $defined(this.activeCell.fieldOptions.options) ? this.activeCell.fieldOptions.options : {}

        // check for different input field types
        switch(this.activeCell.fieldOptions.type) {
          case 'Text':
          case 'Password':
          case 'File':
            jxFieldOptions.value = this.activeCell.oldValue;
            break;
          case 'Textarea':
            jxFieldOptions.value = this.activeCell.oldValue.replace(/<br \/>/gi, '\n');
            break;
          case 'Select':
            // find out which visible value fits to the value inside <option>{value}</option>
            // and set it to selected
            if(jxFieldOptions.comboOpts) {
              for(var i = 0, j = jxFieldOptions.comboOpts.length; i < j; i++) {
                if(jxFieldOptions.comboOpts[i].value == this.activeCell.oldValue.toString()) {
                  jxFieldOptions.comboOpts[i].selected = true;
                }else{
                  jxFieldOptions.comboOpts[i].selected = false;
                }
              }
            }else if(jxFieldOptions.groupOpts) {
              // @todo groupOpts field options auto-select
            }
            break;
          case 'Radio':
          case 'Checkbox':
          default:
            alert("Fieldtype \""+this.activeCell.fieldOptions.type+"\" is not supported yet :(\nIf you have set a validator for a column, you maybe have forgotton to enter a field type.");
            return;
            break;
        }

        // update the 'oldValue' to the formatted style, to compare the new value with the formatted one instead with the non-formatted-one
        if(this.options.fieldFormatted && this.activeCell.colOptions.formatter != null) {
          jxFieldOptions.value = this.activeCell.colOptions.formatter.format(jxFieldOptions.value);
          this.activeCell.oldValue = jxFieldOptions.value;
        }

        // create jx.field
        this.activeCell.field = new Jx.Field[this.activeCell.fieldOptions.type](jxFieldOptions);
        // create validator
        if(this.options.validate && this.activeCell.colOptions.validate) {
          var validator = new Jx.Plugin.Field.Validator(this.activeCell.fieldOptions.validatorOptions);
          validator.addEvent('fieldValidationFailed', function(field, validator) {
            console.log(field, validator);
          });
          validator.addEvent('fieldValidationPassed', function(field, validator) {
            console.log(field, validator);
          });
          this.activeCell.validator = validator;
          this.activeCell.validator.attach(this.activeCell.field);
          console.log(this.activeCell,this.activeCell.fieldOptions.validatorOptions);
        }
        this.activeCell.field.render();
        this.setStyles(cell);


        if(this.options.useKeyboard) {
          this.keyboard.activate();
        }

        // convert a string to an integer if somebody entered a numeric value in quotes, if it failes: make false
        if(typeof(this.options.blurDelay) == 'string') {
          this.options.blurDelay = this.options.blurDelay.toInt() ? this.options.blurDelay.toInt() : false;
        }

        // add a onblur() and onfocus() event to the input field if enabled.
        if(this.options.blurDelay !== false && typeof(this.options.blurDelay) == 'number') {
          var self = this;
          this.activeCell.field.field.addEvents({
            // activate the timeout to close the input/poup
            'blur' : function() {
              self.activeCell.timeoutId = self.bound.deactivate.delay(self.options.blurDelay);
            },
            // clear the timeout when the user focusses again
            'focus' : function() {
              clearTimeout(self.activeCell.timeoutId);
            }
          });
          if(this.popup.domObj != null) {
            this.popup.domObj.addEvent('mouseenter', function() {
              clearTimeout(self.activeCell.timeoutId);
            });
          }
        }
        this.activeCell.field.field.focus();
      }else{
        if($defined(console)) {console.warn('out of grid %o',cell)}
      }
    }, 
    /**
     * APIMethod: deactivate
     * hides the currently active field and stores the new entered data if the
     * value has changed
     *
     * Parameters:
     * @var {Boolean} save (Optional, default: true) - force aborting
     * @return true if no data error occured, false if error (popup/input stays visible)
     */
    deactivate: function(save) {
      if(this.activeCell.field != null) {
        save = $defined(save) ? save : true;

        var valueNew = { data : null, error : false };
        clearTimeout(this.activeCell.timeoutId);

        // update the value in the model
        if(save && this.activeCell.field.getValue().toString() != this.activeCell.oldValue.toString()) {
          this.grid.model.moveTo(this.activeCell.coords.row);
          /*
           * @todo webkit shrinks the rows when the value is updated... but refreshing the grid
           *       immidiately returns in a wrong calculating of the cell position (getCoordinates)
           */
          switch(this.activeCell.fieldOptions.type) {
            case 'Select':
              var index = this.activeCell.field.field.selectedIndex;
              valueNew.data = document.id(this.activeCell.field.field.options[index]).get('value');
              //this.grid.model.set(this.activeCell.coords.index, document.id(this.activeCell.field.field.options[index]).get("value"));
              break;
            case 'Textarea':
              valueNew.data = this.activeCell.field.getValue().replace(/\n/gi, '<br />');
              //this.grid.model.set(this.activeCell.coords.index, this.activeCell.field.getValue().replace(/\n/gi, '<br />'));
              break;
            default:
              valueNew.data = this.activeCell.field.getValue();
              //this.grid.model.set(this.activeCell.coords.index, this.activeCell.field.getValue());
              break;
          }

          valueNew = this.checkValue(valueNew);

          // save the value
          if(valueNew.data != null && valueNew.error == false) {
            this.grid.model.set(this.activeCell.coords.index, valueNew.data);
          // else show error message
          }else if(valueNew.error == true) {
            this.activeCell.span.show();
          }

          // update reference to activeCell
          this.activeCell.cell = this.grid.gridTableBody.rows[this.activeCell.coords.row].cells[this.activeCell.coords.index-1];

        }else{
          this.activeCell.span.show();
        }
        if(this.options.useKeyboard) {
          this.activeCell.field.removeEvent('keypress', this.bound.setKeyboard);
        }

        /**
         * COMMENT: this is just an idea how changing a value could be visualized
         * we could also pass an Fx.Tween element?
         * the row could probably be highlighted as well?
         */
        if(this.options.cellChangeFx.use) {
          if(valueNew.data != null && valueNew.error == false) {
            this.activeCell.cell.highlight(this.options.cellChangeFx.success);
          }else if(valueNew.error){
            this.activeCell.cell.highlight(this.options.cellChangeFx.error);
          }
        }

        // check for error and keep input field alive
        if(valueNew.error) {
          if(this.options.cellChangeFx.use) {
            this.activeCell.field.field.highlight(this.options.cellChangeFx.error);
          }
          this.activeCell.field.field.setStyle('border','1px solid '+this.options.cellChangeFx.error);
          this.activeCell.field.field.focus();
          return false;
        // otherwise hide it
        }else{
          this.keyboard.deactivate();
          this.unsetActiveField();
          return true;
        }
      }
    },
    /**
     * Method: checkValue
     * 
     * Performs a simple datatype check for dates, integers, strings and booleans
     *
     * @todo use MooTools FormValidator with more complex validation? Or custom callback function for validating values?
     *
     * @var {Object} newValue
     * @return {Object} newValue
     */
    checkValue : function(newValue) {
      if(this.activeCell.colOptions.validate) {
        var valueTmp;
        switch(this.activeCell.colOptions.dataType) {
          case 'date':
            valueTmp = new Date.parse(newValue.data);
            if(valueTmp.toString() == 'Invalid Date' || newValue.data.length == 0) {
              newValue = {
                data  : this.activeCell.oldValue,
                error : true
              }
            }
          break;
          case 'numeric':
            valueTmp = newValue.data.toInt();
            if(valueTmp == 'NaN') {
              newValue = {
                data : this.activeCell.oldValue,
                error: true
              }
            }
          break;
          case 'alphanumeric':
            valueTmp = newValue.data.toString();
            if(!valueTmp) {
              newValue = {
                data : this.activeCell.oldValue,
                error: true
              }
            }
          break;
          case 'boolean':
            switch(newValue.data) {
              case 'true':  case 'false':
              case true  :  case false  :
              case 1     :  case 0      :
              case '1'   :  case '0'    :
                break;
              default:
                newValue = {
                  data : this.activeCell.oldValue,
                  error: true
                }
              break;
            }
          break;
        }
      }
      return newValue;
    },
    /**
     * Method: setStyles
     * 
     * sets some styles for the Jx.Field elements...
     *
     * Parameters:
     * @var cell - table cell of the grid
     * @return void
     */
    setStyles : function(cell) {
      // popup
      if(this.options.popup.use) {
        if(this.options.popup.useLabels) {
          this.activeCell.field.options.label = this.activeCell.colOptions.header;
          this.activeCell.field.render();
        }
        var styles = {
          field : {
            'width'  : this.activeCell.field.type == 'Select' ?
                         cell.getContentBoxSize().width + 5 + "px" :
                         cell.getContentBoxSize().width - 14 + "px",
            'margin' : 'auto 0'
          }
        };
        this.activeCell.field.field.setStyles(styles.field);
        this.showPopUp(cell);
      // No popup
      }else {
        var size   = cell.getContentBoxSize(),
            styles = {
              domObj : {
                position: 'absolute'
              },
              field : {
                width : size.width + "px",
                'margin-left' : 0
              }
            };

        this.activeCell.field.domObj.setStyles(styles.domObj);
        this.activeCell.field.field.setStyles(styles.field);
       
        this.activeCell.field.domObj.inject(document.body);
        Jx.Widget.prototype.position(this.activeCell.field.domObj, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
        });

        this.activeCell.span.hide();
      }

      // COMMENT: an outline of the cell helps identifying the currently active cell
      if(this.options.cellOutline.use) {
        cell.setStyle('outline', this.options.cellOutline.style);
      }
    },
    /**
     * Method: showPopUp
     *
     * Shows the PopUp of of the editor if it already exists, otherwise calls Method
     * this.createPopUp
     *
     * Parameters:
     * @var cell - table cell of the grid
     */
    showPopUp : function(cell) {
      if(this.popup.domObj != null) {
        this.popup.domObj.setStyles({
          'width'  : cell.getContentBoxSize().width
        });
        Jx.Widget.prototype.position(this.popup.domObj, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
        });
        this.activeCell.field.domObj.inject(this.popup.innerWrapper, 'top');
        this.popup.domObj.show();
        this.setPopUpStylesAfterRendering();
      }else{
        this.createPopUp(cell);
      }
    },
    /**
     * Method: createPopUp
     *
     * creates the popup for the requested cell.
     *
     * COMMENT: this could also be an jx.dialog..? if we use jx.dialog, maybe without a title element?
     *          Maybe a jx.dialog is too much for this little thing?
     *
     * Parameters:
     * @var cell - table cell of the grid
     */
    createPopUp : function(cell) {
      var coords = cell.getCoordinates(),
          self      = this, popup  = null, innerWrapper = null,
          closeIcon = null, submit = null, cancel       = null,
          template  = Jx.Widget.prototype.processTemplate(this.options.popup.template, this.classes);

      popup = template.jxGridEditorPopup;
      popup.setStyle('width', cell.getContentBoxSize().width);
      
      innerWrapper = template.jxGridEditorPopupInnerWrapper;
      /**
       * COMMENT: first positioning is always in the top left of the grid..
       * don't know why
       * manual positioning is needed..?
       */
      popup.setStyles({
        'left' : coords.left+'px',
        'top'  : coords.top +'px'
      });
      /*
      Jx.Widget.prototype.position(popup, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
      });
      */

      /**
       * COMMENT do we need this close Icon?
       */
      if(this.options.popup.useCloseIcon) {
        closeIcon = new Element('a', {
          'html'  : '<img src="'+Jx.aPixel.src+'" alt="" title=""/>',
          'class' : 'jxTabClose',   // or something similar.. I choosed this because it's exactly what I needed
          'styles' : {
            'position' : 'absolute',
            'right'    : '0',
            'top'      : '-3px',
            'z-index'  : 1
          },
          'events' : {
            'click' : function() {
              self.deactivate(false);
            }
          }
        }).inject(innerWrapper);
      }

      if(this.options.popup.useButtons) {
        submit = new Jx.Button({
          label : this.options.popup.button.submit.label,
          image : this.options.popup.button.submit.image,
          onClick: function() { 
            self.deactivate(true);
          }
        }).addTo(innerWrapper);
        cancel = new Jx.Button({
          label : this.options.popup.button.cancel.label,
          image : this.options.popup.button.cancel.image,
          onClick: function() { 
            self.deactivate(false);
          }
        }).addTo(innerWrapper);
      }

      this.popup.domObj         = popup;
      this.popup.innerWrapper   = innerWrapper;
      this.popup.closeIcon      = closeIcon;
      this.popup.buttons.submit = submit;
      this.popup.buttons.cancel = cancel;

      this.activeCell.field.domObj.inject(this.popup.innerWrapper, 'top');
      this.popup.domObj.inject(document.body);

      this.setPopUpStylesAfterRendering();
    },
    /**
     * Method: setPopUpStylesAfterRendering
     *
     * - measures the widths of the buttons to set a new min-width for the popup
     *   because custom labels could break the min-width and force a line-break
     * - resets the size of the field to make it fit inside the popup (looks nicer)
     *
     * @return void
     */
    setPopUpStylesAfterRendering: function() {
      if(this.options.popup.useButtons) {
        this.popup.domObj.setStyle('min-width', this.popup.buttons.submit.domObj.getSize().x + this.popup.buttons.cancel.domObj.getSize().x + "px");
      }
      this.activeCell.field.field.setStyle('width',
        this.activeCell.field.type == 'Select' ?
          this.popup.domObj.getSize().x - 7 + "px" :
          this.popup.domObj.getSize().x - 17 + "px");
    },
    /**
     * Method: unsetActiveField
     * resets the activeField and hides the popup
     *
     * @return void
     */
    unsetActiveField: function() {
      this.activeCell.field.destroy();
      if(this.popup.domObj != null) {
        this.popup.domObj.removeEvent('mouseenter');
        this.popup.domObj.hide();
      }

      this.activeCell.cell.setStyle('outline', '0px');

      this.activeCell = {
        field         : null,
        oldValue      : null,
        cell          : null,
        span          : null,
        timeoutId     : null,
        //popup         : null,   // do not destroy the popup, it might be used again
        colOptions    : {},
        coords        : {},
        fieldOptions  : {}
      }
    },
    /**
     * APIMethod: getNextCellInRow
     * activates the next cell in a row if it is editable
     * otherwise the focus jumps to the next editable cell in the next row
     * or starts at the beginning
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getNextCellInRow: function(save) {
      save = $defined(save) ? save : true;
      var nextCell = true, nextRow = true;
      var i = 0;
      do {
        nextCell = i > 0 ? nextCell.getNext() : this.activeCell.cell.getNext();
        // check if cell is still in row, otherwise returns null
        if(nextCell == null) {
          nextRow  = this.activeCell.cell.getParent('tr').getNext();
          // check if this was the last row in the table
          if(nextRow == null) {
            nextRow = this.activeCell.cell.getParent('tbody').getFirst();
          }
          nextCell = nextRow.getFirst();
        }
        var data  = nextCell.retrieve('jxCellData'),
            row   = data.row,
            index = data.index;
        i++;
      }while(!data.col.options.isEditable);

      if(save === false) {
        this.deactivate(false);
      }
      this.grid.selection.select(nextCell);
    },
    /**
     * APIMethod: getPrevCellInRow
     * activates the previous cell in a row if it is editable
     * otherwise the focus jumps to the previous editable cell in the previous row
     * or starts at the last cell in the last row at the end
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getPrevCellInRow: function(save) {
      save = $defined(save) ? save : true;
      var prevCell, prevRow, i = 0;
      do {
        prevCell = i > 0 ? prevCell.getPrevious() : this.activeCell.cell.getPrevious();
        // check if cell is still in row, otherwise returns null
        if(prevCell == null) {
          prevRow  = this.activeCell.cell.getParent('tr').getPrevious();
          // check if this was the last row in the table
          if(prevRow == null) {
            // @todo this does not always work when shift+tab is hold pressed (out of grid error)
            prevRow = this.activeCell.cell.getParent('tbody').getLast();
          }
          prevCell = prevRow.getLast();
        }
        var data  = prevCell.retrieve('jxCellData'),
            row   = data.row,
            index = data.index;
        i++;
      }while(!data.col.options.isEditable);

      if(save === false) {
        this.deactivate(false);
      }
      this.grid.selection.select(prevCell);
    },
    /**
     * APIMethod: getNextCellInCol
     * activates the next cell in a column under the currently active one
     * if the active cell is in the last row, the first one will be used
     *
     * @return void
     */
    getNextCellInCol : function() {
      var nextRow, nextCell;
      nextRow = this.activeCell.cell.getParent().getNext();
      if(nextRow == null) {
        nextRow = this.activeCell.cell.getParent('tbody').getFirst();
      }
      nextCell = nextRow.getElement('td.jxGridCol'+this.activeCell.coords.index);
      this.grid.selection.select(nextCell);
    },
    /**
     * APIMethod: getPrevCellInCol
     * activates the previous cell in a column above the currently active one
     * if the active cell is in the first row, the last one will be used
     *
     * @return void
     */
    getPrevCellInCol : function() {
      var prevRow, prevCell;
      prevRow = this.activeCell.cell.getParent().getPrevious();
      if(prevRow == null) {
        prevRow = this.activeCell.cell.getParent('tbody').getLast();
      }
      prevCell = prevRow.getElement('td.jxGridCol'+this.activeCell.coords.index);
      this.grid.selection.select(prevCell);
    },
    /**
     * Method: cellValueIncrement
     * Whether increments or decrements the value of the active cell if the dataType is numeric
     *
     * Parameters
     * @var {Boolean} bool
     * @return void
     */
    cellValueIncrement : function(bool) {
      var dataType = this.activeCell.colOptions.dataType,
          valueNew = null;
      switch(dataType) {
        case 'numeric':
        case 'currency':
          valueNew = this.activeCell.field.getValue().toInt();
          if(typeof(valueNew) == 'number') {
            if(bool) {
              valueNew++;
            }else{
              valueNew--;
            }
          }
          break;
        case 'date':
          valueNew = Date.parse(this.activeCell.field.getValue());
          if(valueNew instanceof Date) {
            if(bool) {
              valueNew.increment();
            }else{
              valueNew.decrement();
            }
            var formatter = new Jx.Formatter.Date();
            valueNew = formatter.format(valueNew);
          }
          break;
      }
      if(valueNew != null) {
        this.activeCell.field.setValue(valueNew);
      }
    },
    /**
     * Method: cellIsInGrid
     * determins if the given coordinates are within the grid
     *
     * Parameters:
     * @var {Integer} row
     * @var {Integer} index
     * @return {Boolean}
     */
    cellIsInGrid: function(row, index) {
      if($defined(row) && $defined(index)) {
        console.log("Row %i - max Rows: %i, Col %i - max Cols %i", row, this.grid.gridTableBody.rows.length, index, this.grid.gridTableBody.rows[row].cells.length);
        if( row >= 0 && index >= 0 &&
            row <= this.grid.gridTableBody.rows.length &&
            index <= this.grid.gridTableBody.rows[row].cells.length
        ) {
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    },
    /**
     * APIMethod: getFieldOptionsByColName
     * checks for the name of a column inside the fieldOptions and returns
     * the object if found, otherwise the default options for the field
     *
     * Parameters:
     * @var {String} colName
     * @return {Object} default field options
     */
    getFieldOptionsByColName : function(colName) {
      var fo = this.options.fieldOptions,
          r  = this.options.fieldOptions[0];
      for(var i = 0, j = fo.length; i < j; i++) {
        if(fo[i].field == colName) {
          r = fo[i];
          break;
        }
      }
      return r;
    }
}); 
