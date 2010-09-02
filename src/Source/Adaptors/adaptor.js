/*
---

name: Jx.Adaptor

description: Base class for all Adaptors.

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Adaptor]

...
 */
/**
 * Class: Jx.Adaptor
 * Base class for all adaptor implementations. Provides a place to locate all
 * common code and the Jx.Adaptor namespace.  Since it extends <Jx.Plugin> all
 * adaptors will be able to be used as plugins for their respective classes.
 * Also as such, they must have the attach() and detach() methods.
 *
 * Adaptors are specifically used to conform a <Jx.Store> to any one of
 * the different widgets (i.e. Jx.Tree, Jx.ListView, etc...) that could
 * benefit from integration with the store. This approach was taken to minimize
 * data access code in the widgets themselves. Widgets should have no idea where
 * the data/items come from so that they will be usable in the broadest number
 * of situations.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor = new Class({


  Extends: Jx.Plugin,
  Family: 'Jx.Adaptor',

  name: 'Jx.Adaptor',

  options: {
        /**
         * Option: template
         * The text template to use in creating the items for this adaptor
         */
      template: '',
        /**
         * Option: useTemplate
         * Whether or not to use the text template above. Defaults to true.
         */
      useTemplate: true,
        /**
         * Option: store
         * The store to use with the adaptor.
         */
      store: null
  },
    /**
     * Property: columnsNeeded
     * Will hold an array of the column names needed for processing the
     * template
     */
  columnsNeeded: null,

  init: function () {
      var options = this.options;
      this.parent();

      this.store = options.store;

      if (options.useTemplate && $defined(this.store.getColumns())) {
          this.columnsNeeded = this.store.parseTemplate(options.template);
      }
  },

  attach: function (widget) {
    this.parent(widget);
    this.widget = widget;
  },

  detach: function () {
    this.parent();
  }

});