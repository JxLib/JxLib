/*
---

name: Jx.Plugin.Grid.Editor

description: Enables inline editing in grids

license: MIT-style license.

requires:
- Jx.Plugin.Grid
- More/Keyboard

provides: [Jx.Plugin.Grid.Editor]

images:
- icons.png
...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Editor
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
    Binds: ['activate','deactivate','changeText'],

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
       * - buttonLabel.submit - Text for Submit Button, uses MooTools.lang.get('Jx', 'plugin.editor').submitButton for default
       * - buttonLabel.cancel - Text for Cancel Button, uses MooTools.lang.get('Jx', 'plugin.editor').cancelButton for default
       */
      popup : {
        use           : true,
        useLabels     : false,
        useButtons    : true,
        button        : {
          submit : {
            label : '',
            image : 'images/accept.png'
          },
          cancel : {
            label : '',
            image : 'images/cancel.png'
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
        'ctrl+shift+enter' : 'saveNGoUp',
        'tab'              : 'saveNGoRight',
        'ctrl+enter'       : 'saveNGoDown',
        'shift+tab'        : 'saveNGoLeft',
        'enter'            : 'saveNClose',
        'ctrl+up'          : 'cancelNGoUp',
        'ctrl+right'       : 'cancelNGoRight',
        'ctrl+down'        : 'cancelNGoDown',
        'ctrl+left'        : 'cancelNGoLeft',
        'esc'              : 'cancelNClose',
        'up'               : 'valueIncrement',
        'down'             : 'valueDecrement'
      },
      /**
       * Option: keyboardMethods
       *
       * can be used to overwrite existing keyboard methods that are used inside
       * this.options.keys - also possible to add new ones.
       * Functions are bound to the editor plugin when using 'this'
       *
       * example:
       *  keys : {
       *    'ctrl+u' : 'cancelNGoRightNDown'
       *  },
       *  keyboardMethods: {
       *    'cancelNGoRightNDown' : function(ev){
       *      ev.preventDefault();
       *      this.getNextCellInRow(false);
       *      this.getNextCellInCol(false);
       *    }
       *  }
       */
      keyboardMethods : {},
      /**
       * Option: keypressLoop
       * loop through the grid when pressing TAB (or some other method that uses
       * this.getNextCellInRow() or this.getPrevCellInRow()). If set to false,
       * the input field/popup will not start at the opposite site of the grid
       * Defaults to true
       */
      keypressLoop : true,
      /**
       * Option: linkClickListener
       * disables all click events on links that are formatted with Jx.Formatter.Uri
       * - otherwise the link will open directly instead of open the input editor)
       * - hold [ctrl] to open the link in a new tab
       */
      linkClickListener : true
    },
    classes: ['jxGridEditorPopup', 'jxGridEditorPopupInnerWrapper'],
    /**
     * Property: activeCell
     *
     * Containing Objects:
     *   field        : Reference to the Jx.Field instance that will be created
     *   cell         : Reference to the cell inside the table 
     *   span         : Reference to the Dom Element inside the selected cell of the grid
     *   oldValue     : Old value of the cell from the grid's model
     *   newValue     : Object with <data> and <error> for better validation possibilites
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
      newValue    : { data: null, error: false },
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
      button       : {
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

      this.grid.addEvent('gridCellSelect', this.activate);
      this.grid.addEvent('gridCellUnSelect', this.deactivate);

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
          if(self.activeCell.fieldOptions.type != 'Textarea' || (self.activeCell.fieldOptions.type == 'Textarea' && ev.key != 'enter')) {
            self.deactivate()
          }
        },
        saveNGoUp      : function(ev) {ev.preventDefault();self.getPrevCellInCol()},
        saveNGoRight   : function(ev) {ev.preventDefault();self.getNextCellInRow()},
        saveNGoDown    : function(ev) {ev.preventDefault();self.getNextCellInCol()},
        saveNGoLeft    : function(ev) {ev.preventDefault();self.getPrevCellInRow()},
        cancelNClose   : function(ev) {ev.preventDefault();self.deactivate(false)},
        cancelNGoUp    : function(ev) {ev.preventDefault();self.getPrevCellInCol(false)},
        cancelNGoRight : function(ev) {ev.preventDefault();self.getNextCellInRow(false)},
        cancelNGoDown  : function(ev) {ev.preventDefault();self.getNextCellInCol(false)},
        cancelNGoLeft  : function(ev) {ev.preventDefault();self.getPrevCellInRow(false)},
        valueIncrement : function(ev) {ev.preventDefault();self.cellValueIncrement(true)},
        valueDecrement : function(ev) {ev.preventDefault();self.cellValueIncrement(false)}
      };
      
      var keyboardEvents = {};
      for(var i in this.options.keys) {
        if($defined(this.keyboardMethods[this.options.keys[i]])) {
          keyboardEvents[i] = this.keyboardMethods[this.options.keys[i]];
        }else if($defined(this.options.keyboardMethods[this.options.keys[i]])){
          keyboardEvents[i] = this.options.keyboardMethods[this.options.keys[i]].bind(self);
        }else if(Jx.type(this.options.keys[i]) == 'function') {
          keyboardEvents[i] = this.options.keys[i].bind(self);
        }else{
          $defined(console) ? console.warn("keyboard method %o not defined", this.options.keys[i]) : false;
        }
      }

      // initalize keyboard support but do NOT activate it (this is done inside this.activate()).
      this.keyboard = new Keyboard({
        events: keyboardEvents
      });

      this.addFormatterUriClickListener();
    },
    /**
     * APIMethod: detach
     * detaches from the grid
     * 
     * @return void
     */
    detach: function() {
      if (this.grid) {
        this.grid.removeEvent('gridClick', this.activate);
      }
      this.grid = null;
      this.keyboard = null;
    },
    /**
     * APIMethod: enable
     * enables the grid 'externally'
     *
     * @return void
     */
    enable : function () {
      this.options.enabled = true;
    },
    /**
     * APIMethod: disable
     * disables the grid 'externally'
     *
     * @var Boolean close - default true: also closes the currently open input/popup
     * @var Boolean save - default false: also changes the currently open input/popup
     * @return void
     */
    disable : function(close, save) {
      close = $defined(close) ? close : true;
      save = $defined(save) ? save : false;
      if(close && this.activeCell.cell != null) {
        this.deactivate(save);
      }
      this.options.enabled = false;
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

      clearTimeout(this.activeCell.timeoutId);

      if(this.cellIsInGrid(row, index)) {

        var colIndex   = this.grid.options.row.useHeaders ? index-1 : index;
        var model      = this.grid.getModel(),
            //cell       = this.grid.gridTableBody.rows[row].cells[col] ? this.grid.gridTableBody.rows[row].cells[col] : null,
            colOptions = this.grid.columns.getByGridIndex(colIndex).options;
        if (!cell || !colOptions.isEditable) {
          return;
        }
        // if disabling a currently active one fails (mandatory for example) do not continue
        if(this.activeCell.cell != null && this.deactivate() == false) {
          return;
        }

        // set active record index to selected row
        model.moveTo(row);
        
        // store properties of the active cell
        this.activeCell = {
          oldValue      : model.get(data.index),
          newValue      : {data: null, error: false},
          fieldOptions  : this.getFieldOptionsByColName(colOptions.name),
          colOptions    : colOptions,
          coords        : {row : row, index : index},
          cell          : cell,
          span          : cell.getElement('span.jxGridCellContent'),
          validator     : null,
          field         : null,
          timeoutId     : null
        }

        // check if this column has special validation settings - otherwise use default from this.options.validate
        if(!$defined(this.activeCell.colOptions.validate) || typeof(this.activeCell.colOptions.validate) != 'boolean') {
          this.activeCell.colOptions.validate = this.options.validate;
        }

        var jxFieldOptions = $defined(this.activeCell.fieldOptions.options) ? this.activeCell.fieldOptions.options : {}

        // check for different input field types
        switch(this.activeCell.fieldOptions.type) {
          case 'Text':
          case 'Color':
          case 'Password':
          case 'File':
            jxFieldOptions.value = this.activeCell.oldValue;
            break;
          case 'Textarea':
            jxFieldOptions.value = this.activeCell.oldValue.replace(/<br \/>/gi, '\n');
            break;
          case 'Select':
            // find out which visible value fits to the value inside <option>{value}</option> and set it to selected
            var oldValue  = this.activeCell.oldValue.toString();
            function setCombos(opts, oldValue) {
              for(var i = 0, j = opts.length; i < j; i++) {
                if(opts[i].value == oldValue) {
                  opts[i].selected = true;
                }else{
                  opts[i].selected = false;
                }
              }
              return opts;
            }

            if(jxFieldOptions.comboOpts) {
              jxFieldOptions.comboOpts = setCombos(jxFieldOptions.comboOpts, oldValue);
            }else if(jxFieldOptions.optGroups) {
              var groups = jxFieldOptions.optGroups;
              for(var k = 0, n = groups.length; k < n; k++) {
                groups[k].options = setCombos(groups[k].options, oldValue);
              }
              jxFieldOptions.optGroups = groups;
            }
            break;
          case 'Radio':
          case 'Checkbox':
          default:
            $defined(console) ? console.warn("Fieldtype %o is not supported yet. If you have set a validator for a column, you maybe have forgotton to enter a field type.", this.activeCell.fieldOptions.type) : false;
            return;
            break;
        }

        // update the 'oldValue' to the formatted style, to compare the new value with the formatted one instead with the non-formatted-one
        if(this.options.fieldFormatted && this.activeCell.colOptions.renderer.options.formatter != null) {
          if(!$defined(this.activeCell.colOptions.fieldFormatted) || this.activeCell.colOptions.fieldFormatted == true ) {
            jxFieldOptions.value = this.activeCell.colOptions.renderer.options.formatter.format(jxFieldOptions.value);
            this.activeCell.oldValue = jxFieldOptions.value;
          }
        }

        // create jx.field
        this.activeCell.field = new Jx.Field[this.activeCell.fieldOptions.type.capitalize()](jxFieldOptions);
        // create validator
        if(this.options.validate && this.activeCell.colOptions.validate) {
          this.activeCell.validator = new Jx.Plugin.Field.Validator(this.activeCell.fieldOptions.validatorOptions);
          this.activeCell.validator.attach(this.activeCell.field);
        }
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
              // @todo For some reason, webkit does not clear the timeout correctly when navigating through the grid with keyboard
              clearTimeout(self.activeCell.timeoutId);
              self.activeCell.timeoutId = self.deactivate.delay(self.options.blurDelay);
            },
            // clear the timeout when the user focusses again
            'focus' : function() {
              clearTimeout(self.activeCell.timeoutId);
            }, 
            // clear the timeout when the user puts the mouse over the input
            'mouseover' : function() {
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

      clearTimeout(this.activeCell.timeoutId);
      
      if(this.activeCell.field !== null) {
        save = $defined(save) ? save : true;

        var newValue = {data : null, error : false};

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
              newValue.data = document.id(this.activeCell.field.field.options[index]).get('value');
              break;
            case 'Textarea':
              newValue.data = this.activeCell.field.getValue().replace(/\n/gi, '<br />');
              break;
            default:
              newValue.data = this.activeCell.field.getValue();
              break;
          }
          if(save) {
            this.activeCell.newValue.data = newValue.data;
            // manually blur the field to activate the validator -> continues with this.terminate()
            //this.activeCell.timeoutId = this.activeCell.field.field.blur.delay(50, this.activeCell.field.field);
          }
          // validation only if it should be saved!
          if(this.activeCell.validator != null && !this.activeCell.validator.isValid()) {
            newValue.error = true;
            this.activeCell.field.field.focus.delay(50, this.activeCell.field.field);
          }
        }else{
          this.activeCell.span.show();
        }


        if(save && newValue.data != null && newValue.error == false) {
          this.grid.model.set(this.activeCell.coords.index, newValue.data);
          this.addFormatterUriClickListener();
        // else show error message and cell
        }else if(newValue.error == true) {
          this.activeCell.span.show();
        }

        // update reference to activeCell
        if($defined(this.activeCell.coords.row) && $defined(this.activeCell.coords.index)) {
          var colIndex = this.grid.options.row.useHeaders ? this.activeCell.coords.index-1 : this.activeCell.coords.index;
          this.activeCell.cell = this.grid.gridTableBody.rows[this.activeCell.coords.row].cells[colIndex];
        }

        if(this.options.useKeyboard) {
          this.activeCell.field.removeEvent('keypress', this.setKeyboard);
        }

        /**
         * COMMENT: this is just an idea how changing a value could be visualized
         * we could also pass an Fx.Tween element?
         * the row could probably be highlighted as well?
         */
        if(this.options.cellChangeFx.use) {
          var highlighter = new Fx.Tween(this.activeCell.cell, {
            duration: 250,
            onComplete: function(ev) {
              this.element.removeProperty('style');
            }
          });
          var currentCellBg = this.activeCell.cell.getStyle('background-color');
          currentCellBg = currentCellBg == 'transparent' ? '#fff' : currentCellBg;
          if(newValue.data != null && newValue.error == false) {
            highlighter.start('background-color',this.options.cellChangeFx.success, currentCellBg);
          }else if(newValue.error){
            highlighter.start('background-color',this.options.cellChangeFx.error, currentCellBg);
          }
        }

        // check for error and keep input field alive
        if(newValue.error) {
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
        Jx.Widget.prototype.position(this.popup.domObj, cell, {
            horizontal: ['left left'],
            vertical: ['top top']
        });
        this.activeCell.field.domObj.inject(this.popup.innerWrapper, 'top');
        this.popup.domObj.show();
        this.setPopUpButtons();
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

      this.popup.domObj         = popup;
      this.popup.innerWrapper   = innerWrapper;
      this.popup.closeIcon      = closeIcon;
      this.setPopUpButtons();

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
      if(this.options.popup.useButtons && this.popup.button.submit != null && this.popup.button.cancel != null) {
        this.popup.domObj.setStyle('min-width', this.popup.button.submit.domObj.getSize().x + this.popup.button.cancel.domObj.getSize().x + "px");
      }else{
        if(this.popup.button.submit != null)
          this.popup.button.submit.domObj.hide();
        if(this.popup.button.cancel != null)
          this.popup.button.cancel.domObj.hide();
      }
      this.activeCell.field.field.setStyle('width',
        this.activeCell.field.type == 'Select' ?
          this.popup.domObj.getSize().x - 7 + "px" :
          this.popup.domObj.getSize().x - 17 + "px");
    },
    /**
     * Method: setPopUpButtons
     * creates the PopUp Buttons if enabled in options or deletes them if set to false
     *
     * @return void
     */
    setPopUpButtons : function() {
      var self = this,
          button = {
            submit : null,
            cancel : null
          };
      // check if buttons are needed, innerWrapper exists and no buttons already exist
      if(this.options.popup.useButtons && this.popup.innerWrapper != null && this.popup.button.submit == null) {
        button.submit = new Jx.Button({
          label : this.options.popup.button.submit.label.length == 0 ? 
                    this.getText({set:'Jx',key:'plugin.editor',value:'submitButton'}) :
                    this.getText(this.options.popup.button.submit.label),
          image : this.options.popup.button.submit.image,
          onClick: function() {
            self.deactivate(true);
          }
        }).addTo(this.popup.innerWrapper);
        button.cancel = new Jx.Button({
          label : this.options.popup.button.cancel.label.length == 0 ? 
                    this.getText({set:'Jx',key:'plugin.editor',value:'cancelButton'}) :
                    this.getText(this.options.popup.button.cancel.label),
          image : this.options.popup.button.cancel.image,
          onClick: function() {
            self.deactivate(false);
          }
        }).addTo(this.popup.innerWrapper);
      }else if(this.options.popup.useButtons && this.popup.button.submit != null) {
        button = {
          submit : this.popup.button.submit,
          cancel : this.popup.button.cancel
        };
      // check if buttons are not needed and buttons already exist to remove them
      }else if(this.options.popup.useButtons == false && this.popup.button.submit != null) {
        this.popup.button.submit.cleanup();
        this.popup.button.cancel.cleanup();
      }

      this.popup.button = button;
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
        newValue      : { data: null, error: false},
        cell          : null,
        span          : null,
        timeoutId     : null,
        //popup         : null,   // do not destroy the popup, it might be used again
        colOptions    : {},
        coords        : {},
        fieldOptions  : {},
        validator     : null
      }
    },
    /**
     * Method: unsetPopUp
     * resets the popup manually to be able to use it with different settings
     */
    unsetPopUp : function() {
      if(this.popup.domObj != null) {
        this.popup.domObj.destroy();
        this.popup.innerWrapper   = null;
        this.popup.closeIcon      = null;
        this.popup.button.submit = null;
        this.popup.button.cancel = null;
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
      if(this.activeCell.cell != null) {
        var nextCell = true, nextRow = true,
            sumCols = this.grid.columns.columns.length,
            jxCellClass = 'td.jxGridCell:not(.jxGridCellUnattached)';
        var i = 0;
        do {
          nextCell = i > 0 ? nextCell.getNext(jxCellClass) : this.activeCell.cell.getNext(jxCellClass);
          // check if cell is still in row, otherwise returns null
          if(nextCell == null) {
            nextRow  = this.activeCell.cell.getParent('tr').getNext();
            // check if this was the last row in the table
            if(nextRow == null && this.options.keypressLoop) {
              nextRow = this.activeCell.cell.getParent('tbody').getFirst();
            }else if(nextRow == null && !this.options.keypressLoop){
              return;
            }
            nextCell = nextRow.getFirst(jxCellClass);
          }
          var data  = nextCell.retrieve('jxCellData');
          i++;
          // if all columns are set to uneditable during runtime, jump out of the loop after
          // running through 2 times to prevent an endless-loop and browser crash :)
          if(i == sumCols*2) {
            this.deactivate(save);
            return;
          }
        }while(!data.col.options.isEditable);

        if(save === false) {
          this.deactivate(save);
        }
        this.grid.selection.select(nextCell);
      }
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
      if(this.activeCell.cell != null) {
        var prevCell, prevRow, i = 0,
            sumCols = this.grid.columns.columns.length,
            jxCellClass = 'td.jxGridCell:not(.jxGridCellUnattached)';
        do {
          prevCell = i > 0 ? prevCell.getPrevious(jxCellClass) : this.activeCell.cell.getPrevious(jxCellClass);
          // check if cell is still in row, otherwise returns null
          if(prevCell == null) {
            prevRow  = this.activeCell.cell.getParent('tr').getPrevious();
            // check if this was the last row in the table
            if(prevRow == null && this.options.keypressLoop) {
              prevRow = this.activeCell.cell.getParent('tbody').getLast();
            }else if(prevRow == null && !this.options.keypressLoop) {
              return;
            }
            prevCell = prevRow.getLast(jxCellClass);
          }
          var data  = prevCell.retrieve('jxCellData'),
              row   = data.row,
              index = data.index;
          i++;
          // if all columns are set to uneditable during runtime, jump out of the loop after
          // running through 2 times to prevent an endless-loop and browser crash :)
          if(i == sumCols*2) {
            this.deactivate(save);
            return;
          }
        }while(!data.col.options.isEditable);

        if(save === false) {
          this.deactivate(save);
        }
        this.grid.selection.select(prevCell);
      }
    },
    /**
     * APIMethod: getNextCellInCol
     * activates the next cell in a column under the currently active one
     * if the active cell is in the last row, the first one will be used
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getNextCellInCol : function(save) {
      save = $defined(save) ? save : true;
      if(this.activeCell.cell != null) {
        var nextRow, nextCell;
        nextRow = this.activeCell.cell.getParent().getNext();
        if(nextRow == null) {
          nextRow = this.activeCell.cell.getParent('tbody').getFirst();
        }
        nextCell = nextRow.getElement('td.jxGridCol'+this.activeCell.coords.index);
        if(save === false) {
          this.deactivate(save);
        }
        this.grid.selection.select(nextCell);
      }
    },
    /**
     * APIMethod: getPrevCellInCol
     * activates the previous cell in a column above the currently active one
     * if the active cell is in the first row, the last one will be used
     *
     * @var  {Boolean} save (Optional, default: true)
     * @return void
     */
    getPrevCellInCol : function(save) {
      save = $defined(save) ? save : true;
      if(this.activeCell.cell != null) {
        var prevRow, prevCell;
        prevRow = this.activeCell.cell.getParent().getPrevious();
        if(prevRow == null) {
          prevRow = this.activeCell.cell.getParent('tbody').getLast();
        }
        prevCell = prevRow.getElement('td.jxGridCol'+this.activeCell.coords.index);
        if(save === false) {
          this.deactivate(save);
        }
        this.grid.selection.select(prevCell);
      }
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
        //console.log("Row %i - max Rows: %i, Col %i - max Cols %i", row, this.grid.gridTableBody.rows.length, index, this.grid.gridTableBody.rows[row].cells.length);
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
    },
    /**
     * Method: addFormatterUriClickListener
     *
     * looks up for Jx.Formatter.Uri columns to disable the link and open the
     * inline editor instead when CTRL is NOT pressed.
     * set option linkClickListener to false to disable this
     *
     */
    addFormatterUriClickListener : function() {
      if(this.options.linkClickListener) {
        // prevent a link from beeing opened if the editor should appear and the uri formatter is activated
        var uriCols = [], tableCols, anchor;
        // find out which columns are using a Jx.Formatter.Uri
        this.grid.columns.columns.each(function(col,i) {
          if(col.options.renderer.options.formatter != null && col.options.renderer.options.formatter instanceof Jx.Formatter.Uri) {
            uriCols.push(i);
          }
        });
        // add an event to all anchors inside these columns
        this.grid.gridTable.getElements('tr').each(function(tr,i) {
          tableCols = tr.getElements('td.jxGridCell');
          for(var j = 0, k = uriCols.length; j < k; j++) {
            anchor = tableCols[uriCols[j]-1].getElement('a');
            if(anchor) {
              anchor.removeEvent('click');
              anchor.addEvent('click', function(ev) {
                // open link if ctrl was clicked
                if(!ev.control) {
                  ev.preventDefault();
                }
              });
            }
          }
        });
      }
    },
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - the language being changed to or that had it's data set of
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    	if (this.options.popup.use && this.options.popup.useButtons) {
        if(this.popup.button.submit != null) {
          this.popup.button.submit.cleanup();
          this.popup.button.cancel.cleanup();
          this.popup.button.submit = null;
          this.popup.button.cancel = null;
          this.setPopUpButtons();
        }
    	}
    }
}); 
