/*
---

name: Jx.Stack

description: A singleton object for managing a global z-index stack for widgets that need to order themselves in the z-index of the page relative to other such widgets.

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Stack]

...
 */
/**
 * Class: Jx.Stack
 * Manage the zIndex of widgets
 *
 * This is a singleton and should be called directly, like so:
 *
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2010 Paul Spencer
 *
 * This file is licensed under an MIT style license
 */

define('jx/stack', ['../base'], function(base){
    
    var stack = new(new Class({
      /**
       * Property: els
       * {Array} the elements in the stack
       */
      els: [],
    
      /**
       * Property: base
       * {Integer} the base z-index value of the first element in the stack
       */
      base: 1000,
    
      /**
       * Property: increment
       * {Integer} the amount to increment the z-index between elements of the
       * stack
       */
      increment: 100,
    
      /**
       * APIMethod: stack
       * push an element onto the stack and set its z-index appropriately
       *
       * Parameters:
       * el - {DOMElement} a DOM element to push on the stack
       */
      stack: function(el) {
        this.unstack(el);
        this.els.push(el);
        this.setZIndex(el, this.els.length-1);
      },
    
      /**
       * APIMethod: unstack
       * pull an element off the stack and reflow the z-index of the remaining
       * elements in the stack if necessary
       *
       * Parameters:
       * el - {DOMElement} the DOM element to pull off the stack
       */
      unstack: function(el) {
        var elements = this.els;
        if (elements.contains(el)) {
          el.setStyle('z-index', '');
          var idx = elements.indexOf(el);
          elements.erase(el);
          for (var i=idx; i<elements.length; i++) {
            this.setZIndex(elements[i], i);
          }
        }
      },
    
      /**
       * Method: setZIndex
       * set the z-index of an element based on its position in the stack
       *
       * Parameters:
       * el - {DOMElement} the element to set the z-index for
       * idx - {Integer} optional, the index to assume for this object
       */
      setZIndex: function(obj, idx) {
        idx = idx || this.els.indexOf(obj);
        if (idx !== false) {
          document.id(obj).setStyle('z-index', this.base + (idx*this.increment));
        }
      }
    
    }))();
    
    if (base.global) {
        base.global.Stack = stack;
    }
    
    return stack;

});