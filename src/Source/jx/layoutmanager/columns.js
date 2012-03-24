/*
---

name: Jx.LayoutManager.Columns

description:

license: MIT-style license.

requires:
 - Jx.LayoutManager
 - More/Drag.Move
 
css:
 - layout.columns

provides: [Jx.LayoutManager.Columns]



...
 */
define("jx/layoutmanager/columns", ['../../base','../layoutmanager'],
       function(base, LayoutManager){
    
    var columns = new Class({
	
        Extends: LayoutManager,
        Family: 'Jx.LayoutManager.Columns',
        
        options: {
            /**
             * Option: columns
             * an array of objects defining columns. Default is an array of
             * 3 columns in widths of 30%,*,25%
             */
            columns: [{
                cssClass: '',
                width: '30%',
                items: null
            },{
                cssClass: '',
                width: '*',
                items: null
            },{
                cssClass: '',
                width: '25%',
                items: null
            }],
            /**
             * Option: addDefaults
             * default options to use in adding objects to a column
             */
            addDefaults: {
                isDraggable: true,
                column: 1,
                position: 'top'
            },
            /**
             * Option: dragDefaults
             * Default options used when making an object draggable. These can be
             * overridden when the object is passed to add().
             */
            dragDefaults: {
                dropZoneClass: 'jxDropZone',
                handle: '',
                position: 'bottom',
                isDraggable: true
            }
        },
        
        columns: null,
        
        marker: null,
        
        init: function () {
            this.parent();
        
            this.bound.makeDraggable = this.makeDraggable.bind(this);
            this.bound.windowResize = this.windowResize.bind(this);
            
            this.marker = new Element('div', {
                'class': 'jxLayoutColumnMarker'
            }).setStyles({
                'opacity': 0.7, 
                'visibility': 'hidden'
            });
            
            this.columns = [];
            //create columns in the target
            this.options.columns.each(function(col, idx){
                var column = new Element('div', {
                    'class': 'jxLayoutColumn'
                });
                column.addClass(col.cssClass);
                column.addClass(this.options.dragDefaults.dropZoneClass);
                if (idx == this.options.columns.length - 1) {
                    column.addClass('jxLayoutColumnLast');
                }
                this.columns.push(column);
            },this);
            //listen for the window resize and adjust the columns accordingly
            window.addEvent('resize', this.bound.windowResize);
            window.addEvent('load', this.bound.windowResize);
                        
        },
        
        setContainer: function(domObj) {
            this.parent(domObj);
    
            this.domObj.addClass('jxLayoutColumns');
            this.marker.inject(this.domObj);
            this.columns.each(function(col, idx){
                col.inject(this.domObj);
                if (col.items !== undefined && col.items !== null) {
                    this.add(col.items, {
                        column: idx
                    });
                } else {
                    this.addPlaceholder(idx);
                }
            }, this);
        
            this.windowResize();
        
            this.container.addEvent('jxContainerWidgetAdded', this.bound.makeDraggable)
        },
        
        addPlaceholder: function (idx) {
            var p = new Element('div', {
                'class': 'jxLayoutPlaceholder'
            });
            this.add(p, { 
                column: idx,
                isDraggable: false
            });
            this.columns[idx].store('placeholder',p);
        },
        
        windowResize: function () {
            var tSize = this.domObj.getContentBoxSize();
            //the -10 here is to account for any possible scrollbar on the window.
            //tSize.width -= 50;
            var  w = 0;
            this.options.columns.each(function(col, idx){
                var column = this.columns[idx];
                if (col.width == '*') {
                    this.fluidCol = column;
                } else {
                    if (col.width.contains('%')) {
                        var percent = col.width.toInt();
                        var marginRight = column.getStyle('margin-right').toInt();
                        var marginLeft = column.getStyle('margin-left').toInt();
                        column.setStyle('width', (tSize.width * percent / 100) - marginRight - marginLeft);
                    } else {
                        column.setStyle('width', col.width);
                    }
                    var s = column.getMarginBoxSize();
                    w += s.width;
                }
            },this);
            if (this.fluidCol !== undefined && this.fluidCol !== null) {
                var marginRight = this.fluidCol.getStyle('margin-right').toInt();
                var marginLeft = this.fluidCol.getStyle('margin-left').toInt();
                this.fluidCol.setStyle('width',tSize.width - w - marginRight - marginLeft);
            }
            this.elsResize();
        },
        
        /**
         * APIMethod: add
         * Use this method to add an element to the layout
         * 
         * Parameters:
         * elem - the element to add. Either a Dom Element or a Jx.Widget instance
         * options - the options to use in adding this elem.
         * 
         * Options: 
         * column - the column to add to (zero-based)
         * position - where in the column to add (top | bottom | 0...n)
         * isDraggable - whether this elem should be draggable (doesn't keep other
         * 				 elements from being added before or after)
         * handle - the part of the element to use as the drag handle
         */
        add: function (elem, options) {
            options = Object.merge({},this.options.addDefaults,options);
                
            Array.from(elem).each(function(el){	
                el = document.id(el);
                var jx = base.getWidget(el),
                    col = document.id(this.columns[options.column]),
                    children = col.getChildren(),
                    after;
                children.each(function(child, idx){
                    if (idx + 1 == options.position) {
                        after = child;
                    }
                },this);
                        
                if (el.addTo) {
                    if (after === undefined || after === null) {
                        el.addTo(col, 'bottom');
                    } else {
                        el.addTo(after, 'after');
                    }
                } else {
                    if (after === undefined || after === null) {
                        el.inject(col, 'bottom');
                    } else {
                        el.inject(after, 'after');
                    }
                }
                if (!el.hasClass('jxLayoutPlaceholder')) {
                    col.getChildren('.jxLayoutPlaceholder').each(function(child){
                        child.dispose();
                    },this);
                }
                this.items.push(jx || el);
                
                if (el.resize) {
                    el.resize();
                } else if (jx !== null && jx !== undefined && jx.resize) {
                    jx.resize();
                }
                el.setStyle('position','relative');
                
                this.container.fireEvent('jxLayoutItemAdd', [el, this]);
            },this);
            
        },
        
        makeDraggable: function (jx, opts, container) {
            var dragOpts = Object.merge({},this.options.dragDefaults, opts.layoutOpts);
            if (dragOpts.isDraggable) {
                var d = document.id(jx).getParent();
                d.addClass('jxLayoutDraggable');
                d.makeDraggable({
                    droppables: document.getElements('.' + dragOpts.dropZoneClass), 
                    handle: d.getElement(dragOpts.handle), 
                    precalculate: false,
                    style: false,
                    onBeforeStart: function(el){
                        var coords = d.getCoordinates(d.getParent());
                        var col = d.getParent();
                        if (col.getChildren().length == 1) {
                            //add placeholder to bottom of column
                            col.retrieve('placeholder').inject(col,'bottom');
                        }
                        this.marker.setStyles({
                            'display': 'block', 
                            'visibility': 'visible',
                            'height': coords.height, 
                            'width': coords.width - 5
                        }).inject(d, 'after');
                        //get current mouse position
                        var mouse = el.retrieve('dragger').mouse;
                        
                        var offsets = {
                            x: mouse.start.x - coords.left,
                            y: mouse.start.y - coords.top
                        };
                        el.store('offsets', offsets);
                    
                        d.setStyles({
                            'position': 'absolute', 
                            'top': (coords.top - d.getStyle('margin-top').toFloat()), 
                            'left': (coords.left - d.getStyle('margin-left').toFloat()), 
                            'width': coords.width, 
                            'opacity': 0.7, 
                            'z-index': 3
                        });
                    }.bind(this),
                    onEnter: function(el, drop){
                        drop.adopt(this.marker.setStyles({
                            'display': 'block', 
                            'height': el.getCoordinates().height, 
                            'width': drop.getCoordinates().width - 5
                        }));
                        var p = drop.retrieve('placeholder');
                        if (drop.contains(p)) {
                            p.dispose();
                        }
                    }.bind(this), 
                    onLeave: function(el, drop){
                        this.marker.dispose();
                        var p = drop.retrieve('placeholder');
                        var children = drop.getChildren();
                        children = children.filter(function(child){ return child != p && child != el;},this);
                        if (children.length == 0 ) {
                            p.inject(drop,'top');
                        }       
                    }.bind(this),
                    onDrag: function(el){
                        target = null;
                        drop = this.marker.getParent();
                        var drag = el.retrieve('dragger');
                    
                        //get mouse coordinates and offset
                        var offsets = el.retrieve('offsets'),
                        topLeft = {
                            left: drag.mouse.now.x - offsets.x,
                            top: drag.mouse.now.y - offsets.y
                        };
                    
                        el.setStyles(topLeft);
                    
                        if (drop && drop.getChildren().length > 1){
                            //check for placeholder and remove it before adding the marker
                            var p = drop.retrieve('placeholder');
                            if (drop.contains(p)) {
                                p.dispose();
                            }
                            kids = drop.getChildren();
                            mouseY = drag.mouse.now.y;
                            kids.each(function(k){
                                if (mouseY > (k.getCoordinates().top + Math.round(k.getCoordinates().height / 2))) {
                                target = k;
                                }
                            });
                            if (target == null){
                                if (kids[0] != this.marker) {
                                    this.marker.inject(drop, 'top');
                                }
                            } else {
                                if ((target != this.marker) && (target != this.marker.getPrevious())) {
                                    this.marker.inject(target, 'after');
                                }
                            }
                        }
                        //console.log('drag');
                    }.bind(this),
                    onDrop: function(el, drop){
                        if (drop) {
                            el.setStyles({
                                'position': 'relative', 
                                'top': '0', 
                                'left': '0', 
                                'width': 'auto', 
                                    'opacity': 1, 
                                'z-index': 1
                            }).replaces(this.marker);
                            if (el.resize) {
                                el.resize({width: null});
                            } else if (jx.resize) {
                                jx.resize();
                            }
                            if (drop.contains(drop.retrieve('placeholder'))) {
                                document.id(drop.retrieve('placeholder')).dispose();
                            }
                        } else {
                            el.setStyles({
                                'position': 'relative', 
                                'top': '0', 
                                'left': '0', 
                                'opacity': 1, 
                                'z-index': 1
                            });
                            console.log('drop not in zone');
                        }
                    }.bind(this),
                    onComplete: function(el){
                        this.marker.dispose();
                        el.setStyle('position','relative');
                        this.container.fireEvent('jxLayoutMoveComplete', el);
                    }.bind(this),
                    onCancel: function(el){
                        this.marker.dispose();
                        el.setStyles({
                            'position': 'relative', 
                            'top': '0', 
                            'left': '0', 
                            'width': null, 
                            'opacity': 1, 
                            'z-index': 1
                        });
                    }.bind(this)
                });
            }
        },
    
        resize: function(){
            this.windowResize();
        },
    
        resizing: false,    
        
        elsResize: function () {
            if (!this.resizing){
                this.resizing = true;
                this.items.each(function(el){
                el = document.id(el);
                if (el.resize) {
                    el.resize();
                }
                },this);
                this.container.resize();
                this.resizing = false;
            }
        },
        /**
         * APIMethod: serialize
         * Returns an array of objects containing the following information for 
         * each object
         * 
         *  (code)
         *  {
         *  	id: <object's id>,
         *  	width: <object's width>,
         *   	height: <object's height>,
         *   	column: <column>,
         *   	position: <position in the column>
         *   }
         *   (end)
         *   
         *   The array can be saved and used to recreate the layout. This layout 
         *   cannot recreate itself however. The developer is tasked with taking 
         *   this info and supplying the appropriate objects.
         */
        serialize: function () {
            var result = [];
                
            //go through each column and construct the object
            this.columns.each(function(col, idx){
                col.getChildren().each(function(widget,i){
                    widget = document.id(widget);
                    if (!widget.hasClass('jxLayoutPlaceholder')) {
                        var size = widget.getBorderBoxSize();
                        result.push({
                            id: (widget.getChildren()[0]).get('id'),
                            width: size.width,
                            height: size.height,
                            column: idx,
                            position: i
                        });
                    }
                },this);
            },this);
                
            return result;
        }
        
    });
    
    if (base.global) {
        base.global.LayoutManager.Columns = columns;
    }
    
    return columns;
    
});