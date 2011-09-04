/*
---

name: Jx.Container

description: A Jx.Container: Provide a container for others widgets allowing to use as a content of a widget.

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.Container]

...
*/
// $Id$
/**
* Class: Jx.Container
*
* A Jx.Container: Provide a container for others widgets allowing to use as a content of a widget.
*	The container is responsible for class instantiation using the class property option, the rest of the options
*	will be used as options for the class object. The property option layoutOpts of each item is used as options
*	for the layout of the item
*
* Example:
* (code)
* 	new Jx.Container({
*		items: [
*			{
*				class: Jx.Panel,
*				label: 'example1',
*				layoutOpts: {
*					resizeWithWindow: true,
*					top: 30
*				}
*			},
* 			{
*				class: Jx.Tree,
*				layoutOpts: {
*					left: 400,
       			resizeWithWindow: true
*				}
*			}
*		]
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

Jx.Container = new Class({
  Family: 'Jx.Container',
  Extends: Jx.Widget,
  options: {
    items: null
  },
  items: null,
  render: function () {
    this.parent();
    this.domObj = new Element('div');
    new Jx.Layout(this.domObj);

    this.items = [];
    this.options.items.each(function(item) {
      var itemObj = new item.class(item);

      var layoutOpts = {};
      if(item.layoutOpts){
        layoutOpts = item.layoutOpts;
      }

      var itemContainer = new Element('div');
      itemContainer.grab(itemObj.domObj);

      new Jx.Layout(itemContainer, layoutOpts);

      this.domObj.grab(itemContainer);
      this.items.push(itemObj);
    }, this);
  }
});
