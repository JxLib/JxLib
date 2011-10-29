/*
---

name: Jx.Editor.Selection

description: Selection object for use in the editor.

license: MIT-style license.

requires:
 - Jx.Editor

provides: [Jx.Editor.Selection]

...
 */
/**
 * Class: Jx.Editor.Selection
 * 
 * This class provides a selection object for working with textual 
 * selections in an IFrame (specifically the one for <Jx.Editor>).
 *
 * Copyright (c) 2011 by Jonathan Bomgardner
 * Licensed under an mit-style license
 */
Jx.Editor.Selection = new Class({
    
    Extends: Jx.Object,
    Family: 'Jx.Editor.Selection',
    
    parameters: ["win", "options"],
    
    options: {},
    
    init: function () {
        this.parent();
        this.win = this.options.win;
    },
    
    getSelection: function(){
        this.win.focus();
        return (this.win.getSelection) ? this.win.getSelection() : this.win.document.selection;
    },

    getRange: function(){
        var s = this.getSelection();

        if (!s) return null;

        try {
            return s.rangeCount > 0 ? s.getRangeAt(0) : (s.createRange ? s.createRange() : null);
        } catch(e) {
            // IE bug when used in frameset
            return this.doc.body.createTextRange();
        }
    },

    setRange: function(range){
        if (range.select){
            Function.attempt(function(){
                range.select();
            });
        } else {
            var s = this.getSelection();
            if (s.addRange){
                s.removeAllRanges();
                s.addRange(range);
            }
        }
    },

    selectNode: function(node, collapse){
        var r = this.getRange();
        var s = this.getSelection();

        if (r.moveToElementText){
            Function.attempt(function(){
                r.moveToElementText(node);
                r.select();
            });
        } else if (s.addRange){
            collapse ? r.selectNodeContents(node) : r.selectNode(node);
            s.removeAllRanges();
            s.addRange(r);
        } else {
            s.setBaseAndExtent(node, 0, node, 1);
        }

        return node;
    },

    isCollapsed: function(){
        var r = this.getRange();
        if (r.item) return false;
        return r.boundingWidth == 0 || this.getSelection().isCollapsed;
    },

    collapse: function(toStart){
        var r = this.getRange();
        var s = this.getSelection();

        if (r.select){
            r.collapse(toStart);
            r.select();
        } else {
            toStart ? s.collapseToStart() : s.collapseToEnd();
        }
    },

    getContent: function(){
        var r = this.getRange();
        var body = new Element('body');

        if (this.isCollapsed()) return '';

        if (r.cloneContents){
            body.appendChild(r.cloneContents());
        } else if ((r.item !== undefined && r.item !== null) || 
                    (r.htmlText !== undefined && r.htmlText !== null)){
            body.set('html', r.item ? r.item(0).outerHTML : r.htmlText);
        } else {
            body.set('html', r.toString());
        }

        var content = body.get('html');
        return content;
    },

    getText : function(){
        var r = this.getRange();
        var s = this.getSelection();
        return this.isCollapsed() ? '' : r.text || (s.toString ? s.toString() : '');
    },

    getNode: function(){
        var r = this.getRange();

        if (!Browser.ie){
            var el = null;

            if (r){
                el = r.commonAncestorContainer;

                // Handle selection a image or other control like element such as anchors
                if (!r.collapsed)
                    if (r.startContainer == r.endContainer)
                        if (r.startOffset - r.endOffset < 2)
                            if (r.startContainer.hasChildNodes())
                                el = r.startContainer.childNodes[r.startOffset];

                while (typeOf(el) != 'element') el = el.parentNode;
            }

            return document.id(el);
        }

        return document.id(r.item ? r.item(0) : r.parentElement());
    },

    insertContent: function (content) {
        if (Browser.ie){
            var r = this.getRange();
            r.pasteHTML(content);
            r.collapse(false);
            r.select();
        } else {
            this.win.document.execCommand('insertHTML', false, content);
        }
    }
});