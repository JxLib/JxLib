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
define("jx/plugin/grid/editor", ['../../../base','../../plugin','../../grid'],
       function(base, Plugin, Grid){
    
    var editor = new Class({

        Extends : Plugin,
        Family: "Jx.Plugin.Grid.Editor",
        
        name: 'Editor',
        
        Binds: ['activate','deactivate','changeText','onCellClick'],
    
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
             * - buttonLabel.submit - Text for Submit Button, uses Locale.get('Jx', 'plugin.editor').submitButton for default
             * - buttonLabel.cancel - Text for Cancel Button, uses Locale.get('Jx', 'plugin.editor').cancelButton for default
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
             *   field             - Default * for all types or the name of the column in the store (Jx.Store)
             *   type              - Input type to show (Text, Password, Textarea, Select, Checkbox)
             *   options           - All Jx.Field options for this column. More options depend on what type you are using.
             *                       See Jx.Form.[yourField] for details
             *   validatorOptions: - See Jx.Plugin.Field.Validator Options for details
             *                       will only be used if this.options.validate is set to true
             */
            fieldOptions : [{
                field   : '*',
                type    : 'Text',
                options : {},
                validatorOptions: {
                    validators : [],
                    validateOnBlur: true,
                    validateOnChange : false
                }
            }],
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
         *   oldValue     : Old value of the cell from the grid's store
         *   newValue     : Object with <data> and <error> for better validation possibilites
         *   timeoutId    : TimeoutId if the focus blurs the input.
         *   data         : Reference to the cell data
         *   fieldOptions : Reference to the field options of this column
         */
        activeCell : {
            field       : null,
            cell        : null,
            span        : null,
            oldValue    : null,
            newValue    : { data: null, error: false },
            timeoutId   : null,
            data        : {},
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
            if (grid === undefined || grid === null || !instanceOf(grid, Grid)) {
                return;
            }
            this.parent(grid);
            this.grid = grid;
            
            //this.grid.gridTableBody.addEvent('click', this.onCellClick);
            // this.grid.wantEvent('gridCellClick');
            this.grid.addEvent('gridCellClick', this.onCellClick);
    
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
                        self.deactivate();
                    }
                },
                saveNGoUp      : function(ev) {ev.preventDefault();self.getPrevCellInCol();},
                saveNGoRight   : function(ev) {ev.preventDefault();self.getNextCellInRow();},
                saveNGoDown    : function(ev) {ev.preventDefault();self.getNextCellInCol();},
                saveNGoLeft    : function(ev) {ev.preventDefault();self.getPrevCellInRow();},
                cancelNClose   : function(ev) {ev.preventDefault();self.deactivate(false);},
                cancelNGoUp    : function(ev) {ev.preventDefault();self.getPrevCellInCol(false);},
                cancelNGoRight : function(ev) {ev.preventDefault();self.getNextCellInRow(false);},
                cancelNGoDown  : function(ev) {ev.preventDefault();self.getNextCellInCol(false);},
                cancelNGoLeft  : function(ev) {ev.preventDefault();self.getPrevCellInRow(false);},
                valueIncrement : function(ev) {ev.preventDefault();self.cellValueIncrement(true);},
                valueDecrement : function(ev) {ev.preventDefault();self.cellValueIncrement(false);}
            };
    
            var keyboardEvents = {};
            for(var i in this.options.keys) {
                if(this.keyboardMethods[this.options.keys[i]] !== undefined &&
                    this.keyboardMethods[this.options.keys[i]] !== null) {
                    keyboardEvents[i] = this.keyboardMethods[this.options.keys[i]];
                } else if(this.options.keyboardMethods[this.options.keys[i]] !== undefined &&
                    this.options.keyboardMethods[this.options.keys[i]] !== null){
                    keyboardEvents[i] = this.options.keyboardMethods[this.options.keys[i]].bind(self);
                }else if(Jx.type(this.options.keys[i]) == 'function') {
                    keyboardEvents[i] = this.options.keys[i].bind(self);
                }else{
                    console != undefined ? console.warn("keyboard method %o not defined", this.options.keys[i]) : false;
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
                this.grid.removeEvent('gridCellClick', this.onCellClick);
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
            close = (close !== undefined && close !== null) ? close : true;
            save = (save !== undefined && save !== null) ? save : false;
            if(close && this.activeCell.cell != null) {
                this.deactivate(save);
            }
            this.options.enabled = false;
        },
    
        /**
         * Method: onCellClick
         * dispatch clicking on a table cell
         */
        onCellClick: function(cell) {
            this.activate(cell);
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
            // if not enabled or the cell is null, do nothing at all
            if(!this.options.enabled || !cell)
                return;
    
            // activate can be called by clicking on the same cell or a
            // different one
            if (this.activeCell.cell) {
                if (this.activeCell.cell != cell) {
                    if (!this.deactivate()) {
                        return;
                    }
                } else {
                    // they are the same, ignore?
                    return;
                }
            }
          
            var data  = this.grid.getCellData(cell); //.retrieve('jxCellData');
    
            if (!data || data.row === undefined || data.row === null || data.column === undefined || data.column === null) {
                if(console !== undefined) {
                    console.warn('out of grid %o',cell);
                    console.warn('data was %o', data);
                }
                return;
            }
    
            // column marked as not editable
            if (!data.column.options.isEditable) {
                return;
            }
    
            if (this.activeCell.timeoutId) {
                clearTimeout(activeCell.timeoutId);
            }
    
            // set active record index to selected row
            this.grid.store.moveTo(data.row);
    
            // set up the data objects we need
            var options = this.options,
                grid = this.grid,
                store = grid.getStore(),
                index = grid.columns.getIndexFromGrid(data.column.name),
                colOptions = data.column.options,
                activeCell = {
                    oldValue      : store.get(data.column.name),
                    newValue      : {data: null, error: false},
                    fieldOptions  : this.getFieldOptionsByColName(data.column.name),
                    data          : data,
                    cell          : cell,
                    span          : cell.getElement('span.jxGridCellContent'),
                    validator     : null,
                    field         : null,
                    timeoutId     : null
                },
                jxFieldOptions = activeCell.fieldOptions.options,
                oldValue,
                groups,
                k,
                n;
    
            // check if this column has special validation settings - 
            // otherwise use default from this.options.validate
            if(data.column.options.validate !== undefined || 
                data.column.options.validate !== null || 
                typeof(data.column.options.validate) != 'boolean') {
                data.column.options.validate = options.validate;
                cell.store('jxCellData', data);
            }
    
            // check for different input field types
            switch(activeCell.fieldOptions.type) {
                case 'Text':
                case 'Color':
                case 'Password':
                case 'File':
                    jxFieldOptions.value = activeCell.oldValue;
                    break;
                case 'Textarea':
                    jxFieldOptions.value = activeCell.oldValue.replace(/<br \/>/gi, '\n');
                    break;
                case 'Select':
                    // find out which visible value fits to the value inside
                    // <option>{value}</option> and set it to selected
                    jxFieldOptions.value = oldValue  = activeCell.oldValue.toString();
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
                        groups = jxFieldOptions.optGroups;
                        for(k = 0, n = groups.length; k < n; k++) {
                            groups[k].options = setCombos(groups[k].options, oldValue);
                        }
                        jxFieldOptions.optGroups = groups;
                    } 
                    break;
                case 'Radio':
                case 'Checkbox':
                default:
                    console != undefined ? console.warn("Fieldtype %o is not supported yet. If you have set a validator for a column, you maybe have forgotton to enter a field type.", activeCell.fieldOptions.type) : false;
                    return;
                    break;
            }
    
            // update the 'oldValue' to the formatted style, to compare the new value with the formatted one instead with the non-formatted-one
            if(options.fieldFormatted && colOptions.renderer.options.formatter != null) {
                if(colOptions.fieldFormatted === undefined || colOptions.fieldFormatted === null || colOptions.fieldFormatted == true ) {
                    jxFieldOptions.value = colOptions.renderer.options.formatter.format(jxFieldOptions.value);
                    activeCell.oldValue = jxFieldOptions.value;
                }
            }
    
            // create jx.field
            activeCell.field = new Jx.Field[activeCell.fieldOptions.type.capitalize()](jxFieldOptions);
            // create validator
            if(options.validate && colOptions.validate) {
                activeCell.validator = new Jx.Plugin.Field.Validator(activeCell.fieldOptions.validatorOptions);
                activeCell.validator.attach(activeCell.field);
            } 
    
            // store properties of the active cell
            this.activeCell = activeCell;
            this.setStyles(cell);
    
            if(options.useKeyboard) {
                this.keyboard.activate();
            }
    
            // convert a string to an integer if somebody entered a numeric value in quotes, if it failes: make false
            if(typeOf(options.blurDelay) == 'string') {
                options.blurDelay = options.blurDelay.toInt() ? options.blurDelay.toInt() : false;
            }
    
            // add a onblur() and onfocus() event to the input field if enabled.
            if(options.blurDelay !== false && typeof(options.blurDelay) == 'number') {
                activeCell.field.field.addEvents({
                    // activate the timeout to close the input/poup
                    'blur' : function() {
                        // @todo For some reason, webkit does not clear the timeout correctly when navigating through the grid with keyboard
                        clearTimeout(activeCell.timeoutId);
                        activeCell.timeoutId = this.deactivate.delay(this.options.blurDelay);
                    }.bind(this),
                    // clear the timeout when the user focusses again
                    'focus' : function() {
                        clearTimeout(activeCell.timeoutId);
                    }, 
                    // clear the timeout when the user puts the mouse over the input
                    'mouseover' : function() {
                        clearTimeout(activeCell.timeoutId);
                    }
                });
                if(this.popup.domObj != null) {
                    this.popup.domObj.addEvent('mouseenter', function() {
                        clearTimeout(activeCell.timeoutId);
                    });
                }
            }
    
            activeCell.field.field.focus();
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
            var newValue = {data : null, error : false},
                index,
                activeCell = this.activeCell,
                grid = this.grid,
                store = grid.store,
                options = this.options,
                highlighter,
                cellBg;
    
            clearTimeout(activeCell.timeoutId);
    
            if(activeCell.field !== null) {
                save = (save !== undefined && save !== null) ? save : true;
    
    
                // update the value in the column
                if(save && activeCell.field.getValue().toString() != activeCell.oldValue.toString()) {
                    store.moveTo(activeCell.data.row);
                    /*
                     * @todo webkit shrinks the rows when the value is updated... but refreshing the grid
                     *       immidiately returns in a wrong calculating of the cell position (getCoordinates)
                     */
                    switch (activeCell.fieldOptions.type) {
                        case 'Select':
                            index = activeCell.field.field.selectedIndex;
                            newValue.data = document.id(activeCell.field.field.options[index]).get('value');
                            break;
                        case 'Textarea':
                            newValue.data = activeCell.field.getValue().replace(/\n/gi, '<br />');
                            break;
                        default:
                            newValue.data = activeCell.field.getValue();
                            break;
                    }
                    if (save) {
                        activeCell.newValue.data = newValue.data;
                    }
                    // validation only if it should be saved!
                    if (activeCell.validator != null && !activeCell.validator.isValid()) {
                        newValue.error = true;
                        activeCell.field.field.focus.delay(50, activeCell.field.field);
                    }
                } else {
                    activeCell.span.show();
                }
    
                // var data = activeCell.cell.retrieve('jxCellData');
                if (save && newValue.data != null && newValue.error == false) {
                    store.set(activeCell.data.column.name, newValue.data);
                    this.addFormatterUriClickListener();
                    // else show error message and cell
                } else if (newValue.error == true) {
                    activeCell.span.show();
                }
    
                // update reference to activeCell
                if (activeCell.data.row !== undefined && 
                    activeCell.data.row !== null && 
                    activeCell.data.index !== undefined && 
                    activeCell.data.index !== null) {
                    var colIndex = grid.row.useHeaders() ? activeCell.data.index-1 : activeCell.data.index;
                    this.activeCell.cell = grid.gridTableBody.rows[this.activeCell.data.row].cells[colIndex];
                }
    
                if (options.useKeyboard) {
                    activeCell.field.removeEvent('keypress', this.setKeyboard);
                }
    
                /**
                 * COMMENT: this is just an idea how changing a value could be visualized
                 * we could also pass an Fx.Tween element?
                 * the row could probably be highlighted as well?
                 */
                if(options.cellChangeFx.use) {
                    highlighter = new Fx.Tween(this.activeCell.cell, {
                        duration: 250,
                        onComplete: function(ev) {
                            this.element.removeProperty('style');
                        }
                    });
                    cellBg = activeCell.cell.getStyle('background-color');
                    cellBg = cellBg == 'transparent' ? '#fff' : cellBg;
                    if (newValue.data != null && newValue.error == false) {
                        highlighter.start('background-color',options.cellChangeFx.success, cellBg);
                    } else if (newValue.error){
                        highlighter.start('background-color',options.cellChangeFx.error, cellBg);
                    }
                }
    
                // check for error and keep input field alive
                if (newValue.error) {
                    if(options.cellChangeFx.use) {
                        activeCell.field.field.highlight(options.cellChangeFx.error);
                    }
                    activeCell.field.field.setStyle('border','1px solid '+options.cellChangeFx.error);
                    activeCell.field.field.focus();
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
            var styles, 
                size,
                options = this.options,
                activeCell = this.activeCell;
            // popup
            if (options.popup.use) {
                if (options.popup.useLabels) {
                    activeCell.field.options.label = activeCell.data.column.options.header;
                    activeCell.field.render();
                }
                styles = {
                    field : {
                        'width'  : activeCell.field.type == 'Select' ?
                            cell.getContentBoxSize().width + 5 + "px" :
                            cell.getContentBoxSize().width - 14 + "px",
                        'margin' : 'auto 0'
                    }
                };
                activeCell.field.field.setStyles(styles.field);
                this.showPopUp(cell);
            // No popup
            } else {
                size   = cell.getContentBoxSize();
                styles = {
                    domObj : {
                        position: 'absolute'
                    },
                    field : {
                        width : size.width + "px",
                        'margin-left' : 0
                    }
                };
    
                activeCell.field.domObj.setStyles(styles.domObj);
                activeCell.field.field.setStyles(styles.field);
    
                activeCell.field.domObj.inject(document.body);
                Widget.prototype.position(activeCell.field.domObj, cell, {
                    horizontal: ['left left'],
                    vertical: ['top top']
                });
    
                activeCell.span.hide();
            }
    
            // COMMENT: an outline of the cell helps identifying the currently active cell
            if(options.cellOutline.use) {
                cell.setStyle('outline', options.cellOutline.style);
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
                Widget.prototype.position(this.popup.domObj, cell, {
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
                button.submit = new Button({
                    label : this.options.popup.button.submit.label.length == 0 ? 
                        this.getText({set:'Jx',key:'plugin.editor',value:'submitButton'}) :
                        this.getText(this.options.popup.button.submit.label),
                    image : this.options.popup.button.submit.image,
                    onClick: function() {
                        self.deactivate(true);
                    }
                }).addTo(this.popup.innerWrapper);
                button.cancel = new Button({
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
                data           : {},
                fieldOptions  : {},
                validator     : null
            };
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
            save = (save !== undefined && save !== null) ? save : true;
            var nextCell = true,
                nextRow = true,
                sumCols = this.grid.columns.columns.length,
                jxCellClass = 'td.jxGridCell:not(.jxGridCellUnattached)',
                i = 0,
                data,
                cell = this.activeCell.cell,
                options = this.options;
            if (this.activeCell.cell != null) {
                do {
                    nextCell = i > 0 ? nextCell.getNext(jxCellClass) : cell.getNext(jxCellClass);
                    // check if cell is still in row, otherwise returns null
                    if (nextCell == null) {
                        nextRow  = cell.getParent('tr').getNext();
                        // check if this was the last row in the table
                        if (nextRow == null && options.keypressLoop) {
                            nextRow = cell.getParent('tbody').getFirst();
                        } else if(nextRow == null && !options.keypressLoop){
                        return;
                        }
                        nextCell = nextRow.getFirst(jxCellClass);
                    }
                    data = this.grid.getCellData(nextCell);
                    i++;
                    // if all columns are set to uneditable during runtime, jump out of the loop after
                    // running through 2 times to prevent an endless-loop and browser crash :)
                    if (i == sumCols*2) {
                        this.deactivate(save);
                        return;
                    }
                } while(data && !data.column.options.isEditable);
    
                if (save === false) {
                    this.deactivate(save);
                }
                this.activate(nextCell);
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
            save = (save !== undefined && save !== null) ? save : true;
            var prevCell, 
                prevRow, 
                i = 0,
                data,
                row,
                index,
                cell = this.activeCell.cell,
                sumCols = this.grid.columns.columns.length,
                jxCellClass = 'td.jxGridCell:not(.jxGridCellUnattached)',
                options = this.options;
            if(cell != null) {
                do {
                    prevCell = i > 0 ? prevCell.getPrevious(jxCellClass) : cell.getPrevious(jxCellClass);
                    // check if cell is still in row, otherwise returns null
                    if(prevCell == null) {
                        prevRow  = cell.getParent('tr').getPrevious();
                        // check if this was the last row in the table
                        if(prevRow == null && options.keypressLoop) {
                            prevRow = cell.getParent('tbody').getLast();
                        }else if(prevRow == null && !options.keypressLoop) {
                            return;
                        }
                        prevCell = prevRow.getLast(jxCellClass);
                    }
                    data  = this.grid.getCellData(prevCell);
                    row   = data.row;
                    index = data.index;
                    i++;
                    // if all columns are set to uneditable during runtime, jump out of the loop after
                    // running through 2 times to prevent an endless-loop and browser crash :)
                    if(i == sumCols*2) {
                        this.deactivate(save);
                        return;
                    }
                }while(data && !data.column.options.isEditable);
    
                if(save === false) {
                    this.deactivate(save);
                }
                this.activate(prevCell);
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
            var nextRow,
                nextCell,
                activeCell = this.activeCell;
            save = (save !== undefined && save !== null) ? save : true;
            if (activeCell.cell != null) {
                nextRow = activeCell.cell.getParent().getNext();
                if (nextRow == null) {
                    nextRow = activeCell.cell.getParent('tbody').getFirst();
                }
                nextCell = nextRow.getElement('td.jxGridCol'+activeCell.data.index);
                if (save === false) {
                    this.deactivate(save);
                }
                this.activate(nextCell);
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
            var prevRow,
                prevCell,
                activeCell = this.activeCell;
            save = (save !== undefined && save !== null) ? save : true;
            if (activeCell.cell != null) {
                prevRow = activeCell.cell.getParent().getPrevious();
                if (prevRow == null) {
                    prevRow = activeCell.cell.getParent('tbody').getLast();
                }
                prevCell = prevRow.getElement('td.jxGridCol'+activeCell.data.index);
                if (save === false) {
                    this.deactivate(save);
                }
                this.activate(prevCell);
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
            var activeCell = this.activeCell,
                dataType = activeCell.data.column.options.dataType,
                valueNew = null,
                formatter;
            switch (dataType) {
                case 'numeric':
                case 'currency':
                    valueNew = activeCell.field.getValue().toInt();
                    if (typeof(valueNew) == 'number') {
                        if (bool) {
                            valueNew++;
                        } else {
                            valueNew--;
                        }
                    }
                    break;
                case 'date':
                    valueNew = Date.parse(activeCell.field.getValue());
                    if (valueNew instanceof Date) {
                        if (bool) {
                            valueNew.increment();
                        } else {
                            valueNew.decrement();
                        }
                        formatter = new Jx.Formatter.Date();
                        valueNew = formatter.format(valueNew);
                    }
                    break;
            }
            if (valueNew != null) {
                activeCell.field.setValue(valueNew);
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
            if(row !== undefined && row !== null && index !== undefined && index !== null) {
                //console.log("Row %i - max Rows: %i, Col %i - max Cols %i", row, this.grid.gridTableBody.rows.length, index, this.grid.gridTableBody.rows[row].cells.length);
                if( row >= 0 && index >= 0 &&
                    row <= this.grid.gridTableBody.rows.length &&
                    index <= this.grid.gridTableBody.rows[row].cells.length) {
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
                this.grid.gridObj.getElements('tr').each(function(tr,i) {
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

    if (base.global) {
        base.global.Plugin.Grid.Editor = editor;
    }
    
    return editor;
});