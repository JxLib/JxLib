/*
---

name: Common

description: Jx namespace with methods and classes common to most Jx widgets

license: MIT-style license.

requires:
 - Core/Class
 - Core/Element
 - Core/Browser
 - Core/Element.Style
 - Core/Request
 - Core/Class.Extras
 - More/Class.Binds
 - Core/Array
 - Core/Element.Event
 - Core/Element.Dimensions
 - More/Element.Measure
 - More/Locale
 - Core/Slick.Finder
 - Core/Slick.Parser

provides: [Jx]

css:
 - license
 - reset
 - common

images:
 - a_pixel.png

...
 */
// $Id$
/**
 * Function: $jx
 * dereferences a DOM Element to a JxLib object if possible and returns
 * a reference to the object, or null if not defined.
 */
function $jx(id) {
  var widget = null;
  id = document.id(id);
  if (id) {
    widget = id.retrieve('jxWidget');
    if (!widget && id != document.body) {
      widget = $jx(id.getParent());
    }
  }
  return widget;
}

/**
 * Class: Jx
 * Jx is a global singleton object that contains the entire Jx library
 * within it.  All Jx functions, attributes and classes are accessed
 * through the global Jx object.  Jx should not create any other
 * global variables, if you discover that it does then please report
 * it as a bug
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */




// add mutator that sets jxFamily when creating a class so we can check
// its type
Class.Mutators.Family = function(self, name) {
    
    this.prototype.$family = function(){
        return self;
    };
    this.prototype.jxFamily = self;
};




/* Setup global namespace.  It is possible to set the global namespace
 * prior to including jxlib.  This would typically be required only if
 * the auto-detection of the jxlib base URL would fail.  For instance,
 * if you combine jxlib with other javascript libraries into a single file
 * build and call it something without jxlib in the file name, then the
 * detection of baseURL would fail.  If this happens to you, try adding
 * Jx = { baseURL: '/path/to/jxlib/'; }
 * where the path to jxlib contains a file called a_pixel.png (it doesn't
 * have to include jxlib, just the a_pixel.png file).
 */
if (typeof Jx === 'undefined') {
  var Jx = {};
}

Jx.version = "3.1-pre";

/**
 * APIProperty: {String} debug
 * This determines if the library is in debug mode or not. It allows toggling
 * the console object on and off without having to remove all of the console.XXX()
 * functions in the code.
 */
if (Jx.debug === undefined || Jx.debug === null) {
    Jx.debug = false;
}

/**
 * The following is an override of the console object to toggle writing out 
 * based on the state of Jx.debug. It relies on the
 */

/* firebug console supressor for IE/Safari/Opera */
window.addEvent('load',
function() {
    if (! ("console" in window)) {
        window.console = {};
        var empty = function(){};
        ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
         "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", 
         "profileEnd"].each(function(name){
            window.console[name] = empty;
        });
    } else {
        window.realConsole = window.console;
        window.console = {};
        ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
         "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", 
         "profileEnd"].each(function(name){
            window.console[name] = function(){
                if (Jx.debug) {
                    window.realConsole[name].apply(realConsole,arguments);
                }
            };
        });
    }
});

/**
 * APIProperty: {String} baseURL
 * This is the URL that Jx was loaded from, it is
 * automatically calculated from the script tag
 * src property that included Jx.
 *
 * Note that this assumes that you are loading Jx
 * from a js/ or lib/ folder in parallel to the
 * images/ folder that contains the various images
 * needed by Jx components.  If you have a different
 * folder structure, you can define Jx's base
 * by including the following before including
 * the jxlib javascript file:
 *
 * (code)
 * Jx = {
 *    baseURL: 'some/path'
 * }
 * (end)
 */
if (Jx.baseURL === undefined || Jx.baseURL === null) {
  (function() {
    var aScripts = document.getElementsByTagName('SCRIPT'),
        i, s, n, file;
    for (i = 0; i < aScripts.length; i++) {
      s = aScripts[i].src;
      n = s.lastIndexOf('/');
      file = s.slice(n+1,s.length-1);
      if (file.contains('jxlib')) {
        Jx.baseURL = s.slice(0,n);
        break;
      }
    }
  })();
}
/**
 * APIProperty: {Image} aPixel
 * aPixel is a single transparent pixel and is the only image we actually
 * use directly in JxLib code.  If you want to use your own transparent pixel
 * image or use it from a different location than the install of jxlib
 * javascript files, you can manually declare it before including jxlib code
 * (code)
 * Jx = {
 *   aPixel: new Element('img', {
 *     alt: '',
 *     title: '',
 *     width: 1,
 *     height: 1,
 *     src: 'path/to/a/transparent.png'
 *   });
 * }
 * (end)
 */
if (Jx.aPixel === undefined || Jx.aPixel === null) {
  Jx.aPixel = new Element('img', {
    alt:'',
    title:'',
    src: Jx.baseURL +'/a_pixel.png'
  });
}

/**
 * APIProperty: {Boolean} isAir
 * indicates if JxLib is running in an Adobe Air environment.  This is
 * normally auto-detected but you can manually set it by declaring the Jx
 * namespace before including jxlib:
 * (code)
 * Jx = {
 *   isAir: true
 * }
 * (end)
 */
if (Jx.isAir === undefined || Jx.isAir === null) {
  (function() {
    /**
     * Determine if we're running in Adobe AIR.
     */
    var aScripts = document.getElementsByTagName('SCRIPT'),
        src = aScripts[0].src;
    if (src.contains('app:')) {
      Jx.isAir = true;
    } else {
      Jx.isAir = false;
    }
  })();
}

/**
 * APIMethod: setLanguage
 * set the current language to be used by Jx widgets.  This uses the MooTools
 * lang module.  If an invalid or missing language is requested, the default
 * rules of Locale will be used (revert to en-US at time of writing).
 *
 * Parameters:
 * {String} language identifier, the language to set.
 */
Jx.setLanguage = function(lang) {
  Jx.lang = lang;
  Locale.use(Jx.lang);
};

/**
 * APIProperty: {String} lang
 * Checks to see if Jx.lang is already set. If not, it sets it to the default
 * 'en-US'. We will then set the Motools.lang language to this setting
 * automatically.
 *
 * The language can be changed on the fly at anytime by calling
 * Jx.setLanguage().
 * By default all Jx.Widget subclasses will listen for the onChange event of
 * the Locale class. It will then call a method, changeText(), if it
 * exists on the particular widget. You will be able to disable listening for
 * these changes by setting the Jx.Widget option useLang to false.
 */
if (Jx.lang === undefined || Jx.lang === null) {
  Jx.lang = 'en-US';
}

Jx.setLanguage(Jx.lang);

 /**
 * APIMethod: getText
 *
 * returns the localized text.
 *
 * Parameters:
 * val - <String> || <Function> || <Object> = { set: '', key: ''[, value: ''] } for a Locale object
 */
Jx.getText = function(val) {
  var result = '';
  if (Jx.type(val) == 'string' || Jx.type(val) == 'number') {
    result = val;
  } else if (Jx.type(val) == 'function') {
    result = val();
  } else if (Jx.type(val) == 'object' && val.set !== undefined &&
             val.set !== null && val.key !== undefined && val.key !== null){ 
    if(val.value !== undefined) {
      result = Locale.get(val.set + '.' + val.key + '.' + val.value);
    }else{
      result =  Locale.get(val.set + '.' + val.key);
    }
  }
  return result;
},
/**
 * APIMethod: applyPNGFilter
 *
 * Static method that applies the PNG Filter Hack for IE browsers
 * when showing 24bit PNG's.  Used automatically for img tags with
 * a class of png24.
 *
 * The filter is applied using a nifty feature of IE that allows javascript to
 * be executed as part of a CSS style rule - this ensures that the hack only
 * gets applied on IE browsers.
 *
 * The CSS that triggers this hack is only in the ie6.css files of the various
 * themes.
 *
 * Parameters:
 * object {Object} the object (img) to which the filter needs to be applied.
 */
Jx.applyPNGFilter = function(o) {
    var t = Jx.aPixel.src, 
        s;
    if (o.src != t) {
        s = o.src;
        o.src = t;
        o.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + s + "',sizingMethod='scale')";
    }
};

/**
 * NOTE: We should consider moving the image loading code into a separate
 * class. Perhaps as Jx.Preloader which could extend Jx.Object
 */
Jx.imgQueue = [];
//The queue of images to be loaded
Jx.imgLoaded = {};
//a hash table of images that have been loaded and cached
Jx.imagesLoading = 0;
//counter for number of concurrent image loads
/**
 * APIMethod: addToImgQueue
 * Request that an image be set to a DOM IMG element src attribute.  This puts
 * the image into a queue and there are private methods to manage that queue
 * and limit image loading to 2 at a time.
 *
 * Parameters:
 * obj - {Object} an object containing an element and src
 * property, where element is the element to update and src
 * is the url to the image.
 */
Jx.addToImgQueue = function(obj) {
    if (Jx.imgLoaded[obj.src]) {
        //if this image was already requested (i.e. it's in cache) just set it directly
        obj.element.src = obj.src;
    } else {
        //otherwise stick it in the queue
        Jx.imgQueue.push(obj);
        Jx.imgLoaded[obj.src] = true;
    }
    //start the queue management process
    Jx.checkImgQueue();
};

/**
 * APIMethod: checkImgQueue
 *
 * An internal method that ensures no more than 2 images are loading at a
 * time.
 */
Jx.checkImgQueue = function() {
    while (Jx.imagesLoading < 2 && Jx.imgQueue.length > 0) {
        Jx.loadNextImg();
    }
};

/**
 * Method: loadNextImg
 *
 * An internal method actually populate the DOM element with the image source.
 */
Jx.loadNextImg = function() {
    var obj = Jx.imgQueue.shift();
    if (obj) {
        ++Jx.imagesLoading;
        obj.element.onload = function() {--Jx.imagesLoading;
            Jx.checkImgQueue();
        };
        obj.element.onerror = function() {--Jx.imagesLoading;
            Jx.checkImgQueue();
        };
        obj.element.src = obj.src;
    }
};

/**
 * APIMethod: getNumber
 * safely parse a number and return its integer value.  A NaN value
 * returns 0.  CSS size values are also parsed correctly.
 *
 * Parameters:
 * n - {Mixed} the string or object to parse.
 *
 * Returns:
 * {Integer} the integer value that the parameter represents
 */
Jx.getNumber = function(n, def) {
    var result = n === null || isNaN(parseInt(n, 10)) ? (def || 0) : parseInt(n, 10);
    return result;
};

/**
 * APIMethod: getPageDimensions
 * return the dimensions of the browser client area.
 *
 * Returns:
 * {Object} an object containing a width and height property
 * that represent the width and height of the browser client area.
 */
Jx.getPageDimensions = function() {
    return {
        width: window.getWidth(),
        height: window.getHeight()
    };
};

/**
 * APIMethod: type
 * safely return the type of an object using the mootools type system
 */
 //DEPRECATED:  With the new changes for 1.3 compatability this function is 
 //no longer needed as typeOf returns the necessary info.
Jx.type = function(obj) {
  /**
  if (obj === null) return false;
  return typeof obj == 'undefined' ? false : obj.jxFamily || typeOf(obj);
  */
  return typeOf(obj);
};

(function($) {
    // Wrapper for document.id

    /**
     * Class: Element
     *
     * Element is a global object provided by the mootools library.  The
     * functions documented here are extensions to the Element object provided
     * by Jx to make cross-browser compatibility easier to achieve.  Most of
     * the methods are measurement related.
     *
     * While the code in these methods has been converted to use MooTools
     * methods, there may be better MooTools methods to use to accomplish
     * these things.
     * Ultimately, it would be nice to eliminate most or all of these and find
     * the MooTools equivalent or convince MooTools to add them.
     *
     * NOTE: Many of these methods can be replaced with mootools-more's
     * Element.Measure
     */
    Element.implement({
        /**
         * APIMethod: getBoxSizing
         * return the box sizing of an element, one of 'content-box' or
         *'border-box'.
         *
         * Parameters:
         * elem - {Object} the element to get the box sizing of.
         *
         * Returns:
         * {String} the box sizing of the element.
         */
        getBoxSizing: function() {
            var result = 'content-box',
                cm,
                sizing;
            if (Browser.ie || Browser.opera) {
                cm = document.compatMode;
                if (cm == "BackCompat" || cm == "QuirksMode") {
                    result = 'border-box';
                } else {
                    result = 'content-box';
                }
            } else {
                if (arguments.length === 0) {
                    node = document.documentElement;
                }
                sizing = this.getStyle("-moz-box-sizing");
                if (!sizing) {
                    sizing = this.getStyle("box-sizing");
                }
                result = (sizing ? sizing: 'content-box');
            }
            return result;
        },
        /**
         * APIMethod: getContentBoxSize
         * return the size of the content area of an element.  This is the
         * size of the element less margins, padding, and borders.
         *
         * Parameters:
         * elem - {Object} the element to get the content size of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the content area of the measured element.
         */
        getContentBoxSize: function() {
            var s = this.getSizes(['padding', 'border']);
            return {
                width: this.offsetWidth - s.padding.left - s.padding.right - s.border.left - s.border.right,
                height: this.offsetHeight - s.padding.bottom - s.padding.top - s.border.bottom - s.border.top
            };
        },
        /**
         * APIMethod: getBorderBoxSize
         * return the size of the border area of an element.  This is the size
         * of the element less margins.
         *
         * Parameters:
         * elem - {Object} the element to get the border sizing of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the border area of the measured element.
         */
        getBorderBoxSize: function() {
            return {
                width: this.offsetWidth,
                height: this.offsetHeight
            };
        },

        /**
         * APIMethod: getMarginBoxSize
         * return the size of the margin area of an element.  This is the size
         * of the element plus margins.
         *
         * Parameters:
         * elem - {Object} the element to get the margin sizing of.
         *
         * Returns:
         * {Object} an object with two properties, width and height, that
         * are the size of the margin area of the measured element.
         */
        getMarginBoxSize: function() {
            var s = this.getSizes(['margin']);
            return {
                width: this.offsetWidth + s.margin.left + s.margin.right,
                height: this.offsetHeight + s.margin.top + s.margin.bottom
            };
        },
        /**
         * APIMethod: getSizes
         * measure the size of various styles on various edges and return
         * the values.
         *
         * Parameters:
         * styles - array, the styles to compute.  By default, this is
         * ['padding', 'border','margin'].  If you don't need all the styles,
         * just request the ones you need to minimize compute time required.
         * edges - array, the edges to compute styles for.  By default,  this
         * is ['top','right','bottom','left'].  If you don't need all the
         * edges, then request the ones you need to minimize compute time.
         *
         * Returns:
         * {Object} an object with one member for each requested style.  Each
         * style member is an object containing members for each requested
         * edge. Values are the computed style for each edge in pixels.
         */
        getSizes: function(which, edges) {
            which = which || ['padding', 'border', 'margin'];
            edges = edges || ['left', 'top', 'right', 'bottom'];
            var result = {},
                e,
                n;
            which.each(function(style) {
                result[style] = {};
                edges.each(function(edge) {
                    e = (style == 'border') ? edge + '-width': edge;
                    n = this.getStyle(style + '-' + e);
                    result[style][edge] = n === null || isNaN(parseInt(n, 10)) ? 0: parseInt(n, 10);
                },
                this);
            },
            this);
            return result;
        },
        /**
         * APIMethod: setContentBoxSize
         * set either or both of the width and height of an element to
         * the provided size.  This function ensures that the content
         * area of the element is the requested size and the resulting
         * size of the element may be larger depending on padding and
         * borders.
         *
         * Parameters:
         * elem - {Object} the element to set the content area of.
         * size - {Object} an object with a width and/or height property that
         * is the size to set the content area of the element to.
         */
        setContentBoxSize: function(size) {
            var m,
                width,
                height;
            if (this.getBoxSizing() == 'border-box') {
                m = this.measure(function() {
                    return this.getSizes(['padding', 'border']);
                });
                if (size.width !== undefined && size.width !== null) {
                    width = size.width + m.padding.left + m.padding.right + m.border.left + m.border.right;
                    if (width < 0) {
                        width = 0;
                    }
                    this.setStyle('width', width);
                }
                if (size.height !== undefined && size.height !== null) {
                    height = size.height + m.padding.top + m.padding.bottom + m.border.top + m.border.bottom;
                    if (height < 0) {
                        height = 0;
                    }
                    this.setStyle('height', height);
                }
            } else {
                if (size.width !== undefined && size.width !== null && size.width >= 0) {
                  this.setStyle('width', width);
                }
                if (size.height !== undefined && size.height !== null && size.height >= 0) {
                  this.setStyle('height', height);
                }
            }
        },
        /**
         * APIMethod: setBorderBoxSize
         * set either or both of the width and height of an element to
         * the provided size.  This function ensures that the border
         * size of the element is the requested size and the resulting
         * content areaof the element may be larger depending on padding and
         * borders.
         *
         * Parameters:
         * elem - {Object} the element to set the border size of.
         * size - {Object} an object with a width and/or height property that
         * is the size to set the content area of the element to.
         */
        setBorderBoxSize: function(size) {
            var m, 
                width, 
                height;
            if (this.getBoxSizing() == 'content-box') {
                m = this.measure(function() {
                    return this.getSizes();
                });

                if (size.width !== undefined && size.width !== null) {
                    width = size.width - m.padding.left - m.padding.right - m.border.left - m.border.right - m.margin.left - m.margin.right;
                    if (width < 0) {
                        width = 0;
                    }
                    this.setStyle('width', width);
                }
                if (size.height !== undefined && size.height !== null) {
                    height = size.height - m.padding.top - m.padding.bottom - m.border.top - m.border.bottom - m.margin.top - m.margin.bottom;
                    if (height < 0) {
                        height = 0;
                    }
                    this.setStyle('height', height);
                }
            } else {
                if (size.width !== undefined && size.width !== null && size.width >= 0) {
                  this.setStyle('width', width);
                }
                if (size.height !== undefined && size.height !== null && size.height >= 0) {
                  this.setStyle('height', height);
                }
            }
        },

        /**
         * APIMethod: descendantOf
         * determines if the element is a descendent of the reference node.
         *
         * Parameters:
         * node - {HTMLElement} the reference node
         *
         * Returns:
         * {Boolean} true if the element is a descendent, false otherwise.
         */
        descendantOf: function(node) {
            var parent = document.id(this.parentNode);
            while (parent != node && parent && parent.parentNode && parent.parentNode != parent) {
                parent = document.id(parent.parentNode);
            }
            return parent == node;
        },

        /**
         * APIMethod: findElement
         * search the parentage of the element to find an element of the given
         * tag name.
         *
         * Parameters:
         * type - {String} the tag name of the element type to search for
         *
         * Returns:
         * {HTMLElement} the first node (this one or first parent) with the
         * requested tag name or false if none are found.
         */
        findElement: function(type) {
            var o = this,
                tagName = o.tagName;
            while (o.tagName != type && o && o.parentNode && o.parentNode != o) {
                o = document.id(o.parentNode);
            }
            return o.tagName == type ? o: false;
        }
    });
    /**
     * Class: Array
     * Extensions to the javascript array object
     */
    Array.implement({
        /**
         * APIMethod: swap
         * swaps 2 elements of an array
         *
         * Parameters:
         * a - the first position to swap
         * b - the second position to swap
         */
        'swap': function(a, b) {
            var temp = this[a];
            this[a] = this[b];
            this[b] = temp;
        }
    });
})(document.id || $);
// End Wrapper for document.id
