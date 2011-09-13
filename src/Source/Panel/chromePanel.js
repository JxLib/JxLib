/*
---

name: Jx.ChromePanel

description:

license: MIT-style license.

requires:
 - jxlib/Jx.Dialog
 - More/Drag

provides: [Jx.ChromePanel]



...
 */
Jx.ChromePanel = new Class({
    Family: 'Jx.ChromePanel',  
	Extends: Jx.Panel,
	
	options: {
		resize: true
	},
	
	init: function() {
        this.addEvents({
			/* redraw the chrome when the panel is expanded */
	        expand: function() {
	            this.showChrome(this.domObj);
	            this.options.closed = false;
	            if (this.resizeHandle) {
	            	this.resizeHandle.setStyle('display','block');
	            }
	        }.bind(this),
	        /* redraw the chrome when the panel is collapsed */
	        collapse: function() {
	        	
	        	var m = this.domObj.measure(function(){
	                return this.getSizes(['margin'],['top','bottom']).margin;
	            });
	            var size = this.title.getMarginBoxSize();
	            this.domObj.resize({height: m.top + size.height + (m.bottom * 2)});
	            
	            this.options.closed = true;
	            
	            this.showChrome(this.domObj);
	            if (this.resizeHandle) {
	            	this.resizeHandle.setStyle('display','none');
	            }
	        }.bind(this),
	        /* draw the chrome when the panel is first rendered */
            addTo: function() {
                this.showChrome(this.domObj);
            }.bind(this),
            
            sizeChange: function() {
            	this.showChrome(this.domObj);
            }.bind(this)
        });
        this.parent();
        
    },
    
    render: function () {
    	this.parent();
    	
    	//this.domObj.addClass('jxChromePanel');
    	
    	//change the classes to the dialog classes
    	this.title.removeClass('jxPanelTitle').addClass('jxDialogTitle');
    	this.domObj.removeClass('jxPanel').addClass('jxDialog');
    	this.domImg.removeClass('jxPanelIcon').addClass('jxDialogIcon');
    	this.domLabel.removeClass('jxPanelLabel').addClass('jxDialogLabel');
    	this.domControls.removeClass('jxPanelControls').addClass('jxDialogControls');
    	this.contentContainer.removeClass('jxPanelContentContainer').addClass('jxDialogContentContainer');
    	this.content.removeClass('jxPanelContent').addClass('jxDialogContent');
    	
    	this.showChrome(this.domObj);
    	
        /* the dialog is resizeable */
        if (this.options.resize && typeof Drag != 'undefined') {
            this.resizeHandle = new Element('div', {
                'class':'jxDialogResize',
                title: this.options.resizeTooltip,
                styles: {
                    'display':this.options.closed?'none':'block'
                }
            });
            this.domObj.appendChild(this.resizeHandle);

            this.resizeHandleSize = this.resizeHandle.getSize();
            this.resizeHandle.setStyles({
                bottom: this.resizeHandleSize.height,
                right: this.resizeHandleSize.width
            });
            this.domObj.makeResizable({
                handle:this.resizeHandle,
                modifiers: {x: null, y: 'height'},
                onStart: (function() {
                    this.contentContainer.setStyle('visibility','hidden');
                    this.chrome.addClass('jxChromeDrag');
                }).bind(this),
                onDrag: (function() {
                    this.resizeChrome(this.domObj);
                }).bind(this),
                onComplete: (function() {
                    this.chrome.removeClass('jxChromeDrag');
                    var size = this.domObj.getMarginBoxSize();
                    this.options.width = size.width;
                    this.options.height = size.height;
                    this.layoutContent();
                    this.domObj.resize(this.options);
                    this.contentContainer.setStyle('visibility','');
                    this.fireEvent('resize');
                    this.resizeChrome(this.domObj);
                    this.domObj.setStyle('position', 'relative');

                }).bind(this)
            });
        }
    }
    
    
});