/*
---

name: Jx.Charts

description: A Jx.Charts: Provides a wrapper around MilkCharts classes
to integrate into JxLib

license: MIT-style license.

requires:
 - Jx.Widget


provides: [Jx.Charts]

...
*/
// $Id$
/**
* Class: Jx.Charts
*
* A Jx.Charts: Provides a wrapper around MilkChart classes to
integrate into JxLib
*
* Example:
* (code)
* 	new Jx.Charts({
*		class: MilkChart.Column,
*		data: {
*		    "title": "My Chart",
*		    "colNames": ["Internet Explorer", "FireFox"],
*		    "rowNames": ["Q1", "Q2", "Q3", "Q4"],
*		    "rows": [
*		        [1,2],
*		        [3,4],
*		        [5,6],
*		        [7,8]
*		    ]
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

Jx.Charts = new Class({
    Family: 'Jx.Charts',
    Extends: Jx.Widget,
    options: {
  		/**
  		* Option: class
  		* a MilkChart chart class to be used
  		* default to MilkChart.Column
  		* could be any of [MilkChart.Column, MilkChart.Bar, MilkChart.Line,
  MilkChart.Scatter, MilkChart.Pie, MilkChart.Doughnut]
  		*/
  		'class': MilkChart.Column,
  		/**
  		* Option: data
  		* an object containing the JSON data to display calling setData
  method on the chart
  		* leave it null to use requestOpts to load data
  		*/
  		data: null,
  		/**
  		* Option: data
  		* an object containing Request options to load data from remotely
  location calling loadData method on the chart
  		*/
  		requestOpts: {}
    },
    render: function () {
    	this.parent();
    	this.domObj = new Element('div');
      new Jx.Layout(this.domObj);

      this.chart = new this.options.class(this.domObj,
this.options);
      if(this.options.data != null){
      	this.chart.setData(this.options.data);
      	this.chart.render();
      } else{
      	this.chart.loadData(this.options.requestOpts);
      }
    }
});
