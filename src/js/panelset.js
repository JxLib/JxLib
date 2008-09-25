// $Id: panelset.js 1113 2008-09-24 16:00:54Z pspencer $
/**
 * Class: Jx.PanelSet
 *
 * Example:
 * A panel set manages a set of panels within a DOM element.  The PanelSet fills
 * its container by resizing the panels in the set to fill the width and then
 * distributing the height of the container across all the panels.  Panels
 * can be resized by dragging their respective title bars to make them taller
 * or shorter.  The maximize button on the panel title will cause all other
 * panels to be closed and the target panel to be expanded to fill the remaining
 * space.  In this respect, PanelSet works like a traditional Accordion control.
 *
 * When creating panels for use within a panel set, it is important to use the
 * proper options.  You must override the collapse option and set it to false
 * and add a maximize option set to true.  You must also not include options
 * for menu and close.
 *
 * (code)
 * var p1 = new Jx.Panel({collapse: false, maximize: true, content: 'content1'});
 * var p2 = new Jx.Panel({collapse: false, maximize: true, content: 'content2'});
 * var p3 = new Jx.Panel({collapse: false, maximize: true, content: 'content3'});
 * var panelSet = new Jx.PanelSet('panels', [p1,p2,p3]);
 * (end)
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.PanelSet = new Class({
    Implements: [Options, Events, Jx.Addable],
    
    options: {
        parent: null,
        panels: []
    },
    
    /**
     * Property: panels
     * {Array} the panels being managed by the set
     */
    panels: null,
    /**
     * Property: height
     * {Integer} the height of the container, cached for speed
     */
    height: null,
    /**
     * Property: firstLayout
     * {Boolean} true until the panel set has first been resized
     */
    firstLayout: true,
    /**
     * Constructor: Jx.PanelSet
     * Create a new instance of Jx.PanelSet.
     *
     * Parameters:
     * domObj - {HTMLElement} the HTML element that will contain the panels
     * panels - {Array} the panels to go into the PanelSet
     *
     * TODO: Jx.PanelSet.initialize
     * Remove the panels parameter in favour of an add method.
     */
    initialize: function(options) {
        if (options && options.panels) {
            this.panels = options.panels;
            options.panels = null;
        }
        this.setOptions(options);
        this.domObj = new Element('div');
        new Jx.Layout(this.domObj);
        
        //make a fake panel so we get the right number of splitters
        var d = new Element('div', {styles:{position:'absolute'}});
        new Jx.Layout(d, {minHeight:0,maxHeight:0,height:0});
        var elements = [d];
        this.panels.each(function(panel){
            elements.push(panel.domObj);
            panel.options.hideTitle = true;
            panel.contentContainer.resize({top:0});
            panel.toggleCollapse = this.maximizePanel.bind(this,panel);
            panel.domObj.store('Jx.Panel', panel);
            panel.manager = this;
        }, this);
        
        this.splitter = new Jx.Splitter(this.domObj, {
            splitInto: this.panels.length+1,
            layout: 'vertical',
            elements: elements,
            prepareBar: (function(i) {
                var bar = new Element('div', {
                    'class': 'jxPanelBar',
                    'title': 'drag this bar to resize'
                });
                
                var panel = this.panels[i];
                panel.title.setStyle('visibility', 'hidden');
                $(document.body).adopt(panel.title);
                var size = panel.title.getBorderBoxSize();
                bar.adopt(panel.title);
                panel.title.setStyle('visibility','');
                
                bar.setStyle('height', size.height);
                bar.store('size', size);
                
                return bar;
            }).bind(this)
        });
        this.addEvent('addTo', function() {
            this.domObj.resize();
        });
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    
    /**
     * Method: maximizePanel
     * Maximize a panel, taking up all available space (taking into
     * consideration any minimum or maximum values)
     */
    maximizePanel: function(panel) {
        var h = this.domObj.getContentBoxSize().height;
        
        var t = 0;
        for (var i=1; i<this.splitter.elements.length; i++) {
            var p = this.splitter.elements[i];
            t += p.retrieve('leftBar').getBorderBoxSize().height;
            if (p !== panel.domObj) {
                var thePanel = p.retrieve('Jx.Panel');
                var o = p.retrieve('jxLayout').options;
                p.resize({top: t, height: o.minHeight, bottom: null});
                t += o.minHeight;
                p.retrieve('rightBar').style.top = t + 'px';
            } else {
                break;
            }
        }
        
        b = h;
        for (var i=this.splitter.elements.length - 1; i > 0; i--) {
            p = this.splitter.elements[i];
            if (p !== panel.domObj) {
                var o = p.retrieve('jxLayout').options;
                b -= o.minHeight;
                p.resize({top: b, height: o.minHeight, bottom: null});
                b -= p.retrieve('leftBar').getBorderBoxSize().height;
                p.retrieve('leftBar').style.top = b + 'px';
                
            } else {
                break;
            }
        }
        panel.domObj.resize({top: t, height:b - t, bottom: null});
    }
});