/*
---

name: Jx.DatePicker

description: Provides a Date Picker component

license: MIT-style license.

requires:
 - Jx.MonthPicker
 - Jx.Button
 - Jx.Button.Flyout
 - Jx.Panel
 
css:
 - datepicker

provides: [Jx.DatePicker]

...
 */
// $Id$
/**
 * Class: Jx.DatePicker
 *
 * Provides a Date Picker component
 *
 * Example:
 * (code)
 * new Jx.DatePicker({
 *     value: '10/12/1982',
 *     onSelect: function(value){
 *         alert('seleccion: '+value);
 *     }
 * })
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
define("jx/datepicker", ['../base','./widget','./button','./monthpicker','./button/flyout','./panel'],
       function(base, Widget, Button,MonthPicker, Flyout, Panel){
    
    var datePicker = new Class({
        Extends: Widget,
        Family: 'Jx.DatePicker',
        pluginNamespace: 'DatePicker',
    
        options: {
            template: '<div class="jxDatePicker" align="center"><div class="jxMonthPickerFly"></div><span class="jxDatePickerPrevButton"></span><span class="jxDatePickerBar"></span><span class="jxDatePickerNextButton"></span><table class="jxDatePickerTable"><thead><tr class="jxDatePickerWeekDays"></tr></thead><tbody class="jxDatePickerMonthDays"></tbody></table><div class="jxDatePickerToday"></div></div>',
            value: null
        },
        
        classes: {
            monthPickerFly: 'jxMonthPickerFly',
            domObj: 'jxDatePicker',
            prev: 'jxDatePickerPrevButton',
            next: 'jxDatePickerNextButton',
            today: 'jxDatePickerToday',
            title: 'jxDatePickerBar',
            table: 'jxDatePickerTable',
            weekDays: 'jxDatePickerWeekDays',
            monthDays: 'jxDatePickerMonthDays'
        },
        
        render: function() {
            this.parent();
            if(this.options.value){
                if(typeOf(this.options.value) == 'string'){
                    this.currentDate = new Date(this.options.value);
                } else{
                    this.currentDate = this.options.value;
                }
            } else {
                this.currentDate = new Date();
            }
                    
            var self = this;
            base.getText({set: 'Date', key: 'days_abbr'}).each(function(day){
                self.weekDays.adopt(
                    new Element('th',{
                        'class': 'jxDatePickerHeaderCell',
                        html: day
                    })
                );
            }, this);
                    
            new Button({
                imageClass: 'jxPrevDatePickerIcon',
                onClick: function(){
                    if(self.currentDate.getMonth() == 0){
                        self.currentDate.set('mo', 11);
                        self.currentDate.set('year', self.currentDate.get('year')-1);
                    } else{
                        self.currentDate.set('mo', self.currentDate.getMonth()-1);
                    }
                    self.monthLabel.setLabel(this.getText({set:'Date',key:'months',value: self.currentDate.get('mo')}) + ' '+ self.currentDate.get('year'));
                    self.update();
                }
            }).addTo(this.prev);
                    
            this.monthPicker = new MonthPicker({
                month: this.currentDate.get('mo'),
                year: this.currentDate.get('year'),
                onSelect: function(){
                    self.currentDate.set('mo', this.options.month);
                    self.currentDate.set('year', this.options.year);
                    self.monthLabel.setLabel(this.getText({set:'Date',key:'months',value: self.currentDate.get('mo')}) + ' '+ self.currentDate.get('year'));
                    self.monthLabel.hide();
                    self.update();
                },
                onCancel: function(){
                    self.monthLabel.hide();
                }
            });
                    
            this.monthLabel = new Flyout({
                label: this.getText({set:'Date',key:'months',value: self.currentDate.get('mo')}) + ' '+ self.currentDate.get('year'),
                tooltip: 'Change the current month',
                positionElement: this.domObj,
                position: {
                    horizontal: ['left left'],
                    vertical: ['top top']
                },
                hasChrome: false,
                content: new Panel({
                    width: 171,
                    height: 156,
                    collapsible: false,
                    hideTitle: true,
                    content: self.monthPicker
                }),
                onOpen: function(flyout) {
                    self.monthPicker.setMonth(self.currentDate.get('mo'));
                    self.monthPicker.setYear(self.currentDate.get('year'));
                }
            });
                    
            this.title.adopt(this.monthLabel);
                    
            new Button({
                imageClass: 'jxNextDatePickerIcon',
                onClick: function(){
                    if(self.currentDate.getMonth() == 11){
                        self.currentDate.set('mo', 0);
                        self.currentDate.set('year', self.currentDate.get('year')+1); 
                    } else{
                        self.currentDate.set('mo', self.currentDate.getMonth()+1);
                    }
                    self.monthLabel.setLabel(this.getText({set:'Date',key:'months',value: self.currentDate.get('mo')}) + ' '+ self.currentDate.get('year'));
                    self.update();
                }
            }).addTo(this.next);
                    
            new Button({
                label: 'Today',
                onClick: function(){
                    self.currentDate = new Date();
                    self.update();
                    self.fireEvent('select', new Date());
                }
            }).addTo(this.today);
                    
            this.construct();
            this.update();
        },
        
        construct: function(){
            if(this.rendered){
                return;
            }
            var self = this;
                    
            for (var i=0; i<6; i++) {
                var tr = new Element('tr');
                for (var j=0; j<7; j++) {
                    var td = new Element('td',{
                        events: {
                            click: function(event){
                                if(event.target.get('html') != ''){
                                    //event.target.focus();
                                    self.currentDate.set('date', event.target.get('html')); 
                                                    
                                    if(self.selectedCell){
                                        self.selectedCell.removeClass('jxDatePickerSelected');
                                    }
                                    event.target.addClass('jxDatePickerSelected');
                                    self.selectedCell = event.target;
                                                    
                                    self.fireEvent('select', self.currentDate);
                                }
                                event.stop();
                            }
                        }
                    });
                    tr.adopt(td);
                }
                this.monthDays.adopt(tr);
            }
            this.rendered = true;
        },
        
        update: function(){
            if(this.selectedCell){
                this.selectedCell.removeClass('jxDatePickerSelected');
            }
            this.monthLabel.setLabel(this.getText({set:'Date',key:'months',value: this.currentDate.get('mo')}) + ' '+ this.currentDate.get('year'));
            var firstDay = new Date(this.currentDate.get('year'), this.currentDate.get('mo'), 1);
            var startingDay = firstDay.getDay();
                    
            var lastDayOfMonth = this.currentDate.getLastDayOfMonth();
            var index = 0;
            var day = 1;
            var self = this;
                    
            this.monthDays.getChildren().each(function(row) {
                row.getChildren().each(function(node) {
                    if(index >= startingDay && index <= lastDayOfMonth + startingDay - 1){
                        node.set('html', day);
                        node.addClass('jxDatePickerCell');
                        node.removeClass('jxDatePickerEmptyCell');
                        if(day == self.currentDate.getDate()){
                            self.selectedCell = node;
                            self.selectedCell.addClass('jxDatePickerSelected');
                        }
                        day++;
                    } else{
                        node.set('html', '');
                        node.removeClass('jxDatePickerCell');
                        node.addClass('jxDatePickerEmptyCell');
                    }
                    index++;
                });
            });
        }
    });
    
    if (base.global) {
        base.global.DatePicker = datePicker;
    }
    
    return datePicker;
    
});