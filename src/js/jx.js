// $Id: jx.js 939 2008-09-17 00:24:58Z pspencer $
/**
 * Title: Jx Loader
 * Purpose: 
 * Dynamic loader for the Jx library.  Add this file to a web page
 * and it will automatically load the rest of the library.
 * 
 * Example:
 * (code)
 * <script type="text/javascript" src="js/jx.js"></script>
 * (end)
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
var Jx = {
    baseURL: '',
    Version: '1.2.0',
    mootools: ['mootools-1.2-core.js', 'mootools-1.2-more.js'],
    jx: ['button', 'button.flyout', 'button.multi', 'button.combo', 
         'button.color', 'button.tab', 'buttonset',
         'colorpalette', 'panel', 'dialog', 'grid', 'layout', 
         'menu', 'menu.item', 'menu.submenu', 'menu.separator', 'menu.context',
         'panelset', 'splitter', 'splitter.snap', 'tabset', 'tabbox', 
         'toolbar', 'toolbar.item', 'toolbar.separator', 
         'treeitem', 'treefolder', 'tree'],

    require: function(libraryName) {
        // inserting via DOM fails in Safari 2.0, so brute force approach
        document.write('<script type="text/javascript" src="' + libraryName + '"></script>');
    },
    load: function() {
        for (var i = 0; i < this.mootools.length; i++) {
            Jx.require(Jx.baseURL + 'lib/' + this.mootools[i]);
        }
        Jx.require(Jx.baseURL + 'js/common.js');
        for (var i = 0; i < this.jx.length; i++) {
            var include = this.jx[i];
            Jx.require(Jx.baseURL + 'js/' + include + '.js');
        }
    },

    bootstrap: function() {
        var aScripts = document.getElementsByTagName('SCRIPT');
        for (var i = 0; i < aScripts.length; i++) {
            var s = aScripts[i].src;
            var matches = /(.*)\/js\/jx.js/.exec(s);
            if (matches && matches[0]) {
                Jx.aPixel = document.createElement('img');
                Jx.aPixel.src = matches[1]+'/images/a_pixel.png';
                Jx.baseURL = Jx.aPixel.src.substring(0,
                    Jx.aPixel.src.indexOf('images/a_pixel.png'));
                Jx.load();
                break;
            }
        }
    }
};

Jx.bootstrap();
