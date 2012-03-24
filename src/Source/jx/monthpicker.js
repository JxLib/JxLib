/*
---

name: Jx.MonthPicker

description: Provides a Month Picker component

license: MIT-style license.

requires:
 - Jx.Button

css:
 - monthpicker

provides: [Jx.MonthPicker]

...
 */
// $Id$
/**
 * Class: Jx.MonthPicker
 *
 * A Jx.MonthPicker: Provide a Month Picker component
 *
 * Example:
 * (code)
 * 	new Jx.MonthPicker({
 * 		month: 5,
 *		year: 1984,
 *		onSelect: function(){
 *			alert('selected month: ' + this.options.month + ', selected year: ' + this.options.year);
 *		},
 *		onCancel: function(){
 *			alert('user click on cancel button');
 *		}
 *	})
 * (end)
 *
 * Extends:
 * <Jx.Widget>
 *
 * Author: Ing. Axel Mendoza Pupo.
 * 
 * License:
 * Copyright (c) 2011, Ing. Axel Mendoza Pupo.
 *
 * This file is licensed under an MIT style license
 */
define("jx/monthpicker", ['../base','./widget','./button'],
       function(base, Widget, Button){
    
    var monthPicker = new Class({
    
        Extends: Widget,
        Family: 'Jx.MonthPicker',
        pluginNamespace: 'MonthPicker',
    
        options: {
            template: '<div class="jxMonthPicker"><span class="jxMonthPickerLeft" align="center"></span><span class="jxMonthPickerRight" align="center"></span><div class="jxMonthPickerControls" align="center"></div></div>',
            month: null,
            year: null
        },
        
        classes: {
            domObj: 'jxMonthPicker',
            left: 'jxMonthPickerLeft',
            right: 'jxMonthPickerRight',
            controls: 'jxMonthPickerControls'
        },
        
        render: function() {
            this.parent();
            
            var self = this;
            var _monthCont = null;
            this.Months = {};
            this.displayMonths = [];
            base.getText({set: 'Date', key:'months_abbr'}).each(function(mo, index){
                self.Months[mo] = index;
                if(index % 2 == 0){
                    _monthCont = new Element('div');
                    self.left.adopt(_monthCont);
                }
                var monthField = new Element('span',{
                    'class': 'jxMonthPickerCell',
                    html: mo,
                    events: {
                        click: function(event){
                            //event.target.focus();
                            if(self.monthSelected){
                                self.monthSelected.removeClass('jxDatePickerSelected');
                            }
                            event.target.addClass('jxDatePickerSelected');
                            self.monthSelected = event.target;
                            event.stop();
                        }
                    }
                });
                _monthCont.adopt(monthField);
                if(self.options.month && self.options.month == index){
                monthField.addClass('jxDatePickerSelected');
                self.monthSelected = monthField;
                }
                self.displayMonths.push(monthField);
            },this);
                    
            this.displayYear = this.options.year - 5;
            this.displayYears = [];
            var yearControls = new Element('div', {
                'class': 'jxDatePickerBar',
                styles: {
                'margin-left': 8
                }
            });
            self.right.adopt(yearControls);
            
            new Button({
                imageClass: 'jxPrevDatePickerIcon',
                onClick: function(){
                    self.displayYear -= 10;
                    self.updateYears();
                }
            }).addTo(yearControls);
                    
            new Button({
                imageClass: 'jxNextDatePickerIcon',
                onClick: function(){
                    self.displayYear += 10;
                    self.updateYears();
                }
            }).addTo(yearControls);
                    
            var _yearCont = null;
            var two = true;
            for(i = this.options.year - 5; i < this.options.year + 5; i++){
                if(two){
                    _yearCont = new Element('div');
                    self.right.adopt(_yearCont);
                    two = false;
                } else{
                    two = true;
                }
                var yearField = new Element('span',{
                    'class': 'jxMonthPickerCell',
                    html: i,
                    events: {
                        click: function(event){
                            //event.target.focus();
                            if(self.yearSelected){
                                self.yearSelected.removeClass('jxDatePickerSelected');
                            }
                            event.target.addClass('jxDatePickerSelected');
                            self.yearSelected = event.target;
                            event.stop();
                        }
                    }
                });
                        
                self.displayYears.push(yearField);
                _yearCont.adopt(yearField);
                if(self.options.year && self.options.year == i){
                    yearField.addClass('jxDatePickerSelected');
                    self.yearSelected = yearField;
                }
            }
                    
            new Button({
                label: 'Ok',
                onClick: function(objEvent){
                    self.options.month = self.Months[self.monthSelected.get('html')];
                    if(self.yearSelected){
                        self.options.year = self.yearSelected.get('html');
                    }
                    self.fireEvent('select');
                    objEvent.event.stop();
                }
            }).addTo(this.controls);
                    
            new Button({
                label: 'Cancel',
                onClick: function(objEvent){
                    self.fireEvent('cancel');
                    objEvent.event.stop();
                }
            }).addTo(this.controls);
            
        },
            
        setMonth: function(_month){
            this.options.month = _month;
            if(this.monthSelected){
                this.monthSelected.removeClass('jxDatePickerSelected');
            }
            this.monthSelected = this.displayMonths[_month];
            this.monthSelected.addClass('jxDatePickerSelected');
        },
        
        setYear: function(_year){
            this.options.year = _year;
            this.displayYear = _year;
            this.updateYears();
        },
        
        updateYears: function(){
            var self = this;
            var index = this.displayYear;
            if(this.yearSelected){
                this.yearSelected.removeClass('jxDatePickerSelected');
            }
            this.displayYears.each(function(node){
                node.set('html', index);
                if(self.options.year == index){
                    self.yearSelected = node;
                    self.yearSelected.addClass('jxDatePickerSelected');
                }
                index++;
            },this);
        }
    });
    
    if (base.global) {
        base.global.MonthPicker = monthPicker;
    }
    
    return monthPicker;
    
});