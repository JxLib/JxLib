/*
---

name: Jx.Formatter.URI

description: Formats uris using the mootools-more URI extensions

license: MIT-style license.

requires:
 - More/String.Extras
 - Jx.Formatter
 - More/URI

provides: [Jx.Formatter.URI]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.URI
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats URIs using the mootools-more's
 * URI extensions. See the -more docs for details of
 * supported formats for parsing and formatting.
 * 
 * @url http://mootools.net/docs/more/Native/URI
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Uri = new Class({

    Extends: Jx.Formatter,
    Family: "Jx.Formatter.Uri",

    options: {
        /**
         * Option: format
         * The format to use. See the mootools-more URI options
         * to use within a {pattern}
         *   {string} will call the URI.toString() method
         */
        format: '<a href="{string}" target="_blank">{host}</a>'
    },
    /**
     * APIMethod: format
     * Does the work of formatting dates
     *
     * Parameters:
     * value - the text to format
     */
    format: function (value) {
      var uri        = new URI(value),
          uriContent = {},
          pattern    = [],
          patternTmp = this.options.format.match(/\\?\{([^{}]+)\}/g);

      // remove bracktes
      patternTmp.each(function(e) {
        pattern.push(e.slice(1, e.length-1));
      });

      // build object that contains replacements
      for(var i = 0, j = pattern.length; i < j; i++) {
        switch(pattern[i]) {
          case 'string':
            uriContent[pattern[i]] = uri.toString();
            break;
          default:
            uriContent[pattern[i]] = uri.get(pattern[i]);
            break;
        }
      }
      return this.options.format.substitute(uriContent);
    }
});