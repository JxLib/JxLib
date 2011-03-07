/*
---

name: Jx.Formatter.Text

description: Formats strings by limiting to a max length

license: MIT-style license.

requires:
 - Jx.Formatter

provides: [Jx.Formatter.Text]

...
 */
// $Id: $
/**
 * Class: Jx.Formatter.Text
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats strings by limiting them to a maximum length
 * and replacing the remainder with an ellipsis.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2010, Hughes Gauthier.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Text = new Class({

  Extends: Jx.Formatter,

  options: {
    /**
     * Option: length
     * {Integer} default null, if set to an integer value greater than
     * 0 then the value will be truncated to length characters and
     * the remaining characters will be replaced by an ellipsis (...)
     */
    maxLength: null,
    /**
     * Option: ellipsis
     * {String} the text to use as the ellipsis when truncating a string
     * default is three periods (...)
     */
    ellipsis: '...'
  },

  format : function (value) {
    var text = '' + value,
        max = this.options.maxLength,
        ellipsis = this.options.ellipsis;

    if (max && text.length > max) {
      text = text.substr(0,max-ellipsis.length) + ellipsis;
    }

    return text;
  }
});