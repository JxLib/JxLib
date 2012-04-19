/*
---

name: Jx.ThemeManager

description: Theme Manager singleton object

license: MIT-style license.

requires:
 - Jx.Object
 

provides: [Jx.ThemeManager]

...
 */

define('jx/thememanager',['../base', './object', './styles'], function(base, jxObject, Styles){
    
    var themeManager = new (new Class({
        Extends: jxObject,
        Family: 'Jx.ThemeManager',
        
        options: {
            
        },
        
        activeTheme: base.theme,
        
        infoObjects: {},
        loadedStylesheets: {},
        templates: {},
        queuedWidgets: [],
        bound: null,
        failureCount: 0,
        currentWidget: null,
        
        init: function(){
            this.bound = {
                globalsLoaded: this.globalsLoaded.bind(this)
            }
            this.loadThemeInfo(this.activeTheme);
        },
        
        loadThemeInfo: function(theme){
            /**
             * use request to get the theme info file for this theme. A theme info
             * file will be a json encoded file named "theme.json" in the root of the
             * theme directory. It is used to define a bunch of stuff about the
             * theme. See the theme.json file for one of the default themes for more
             * information
             */
            var url = base.themeBaseUrl + "/" + theme + '/theme.json';
            new Request.JSON({
                url: url,
                onSuccess: function(info){
                    this.processThemeInfo(info, theme);
                }.bind(this),
                onFailure: function(xhr){
                    alert('Your theme info file didn\'t load!');
                }
            }).get();
        },
        
        processThemeInfo: function(info, theme){
            theme = (theme) ? theme : this.activeTheme;
            //load any global files
            this.infoObjects[theme] = info;
            //check for the base theme's info file, if we have it fine
            //if not, load it
            if (info.baseTheme && typeOf(info.baseTheme) == 'string' &&
                (this.infoObjects[info.baseTheme] === undefined ||
                 this.infoObjects[info.baseTheme] === null)) {
                this.loadThemeInfo(info.baseTheme);
            } else {
                //done loading theme files... load globals
                this.loadGlobalFiles();
            }
            
            
        },
        
        loadGlobalFiles: function(){
            //load global files which are required base files for the theme.
            //we only load the global files for the first theme in a base-chain.
            //if you require global files froma base theme as well as your own
            //you must include them all in your theme.
            var globals, theme = this.activeTheme,
                info = this.infoObjects[theme];
            while (globals === undefined || globals === null) {
                if (info.globalFiles !== undefined && info.globalFiles !== null) {
                    globals = info.globalFiles;
                } else {
                    if (info.baseTheme !== null && typeOf(info.basetheme) == 'string') {
                        theme = info.baseTheme;
                        info = this.infoObjects[info.baseTheme];
                    }
                }
            }
            
            if (globals && typeOf(globals) == "array") {
                Styles.addEvent('loadFinished', this.bound.globalsLoaded);
                //normalize globalFiles
                var files = globals.map(function(item){
                    return  base.themeBaseUrl + '/' + theme + '/' + item;   
                },this);
                if (this.loadedStylesheets[theme] === undefined ||
                    this.loadedStylesheets[theme] === null) {
                    this.loadedStylesheets[theme] = [];
                }
                this.loadedStylesheets[theme].append(Styles.loadFiles(files));
            }
        },
        
        globalsLoaded: function(){
            Styles.removeEvent('loadFinished', this.bound.globalsLoaded);
        },
        
        getTemplate: function(widget, callback, classes, template){
            //if we get passed a template, just use that and process it.
            //this allows developers to change templates ina one-off fashion
            //if they need to.
            if (template !== undefined && template !== null) {
                 //process the template
                 beginTemplateProcessing(template, callback, classes);
            } else {
            
                var widgetName = typeOf(widget).replace(".","/").toLowerCase();
                
                
                //check for template (if it exists already assume css is already loaded)
                if (this.templates[this.activeTheme] !== undefined &&
                    this.templates[this.activeTheme] !== null &&
                    this.templates[this.activeTheme][widgetName] !== undefined &&
                    this.templates[this.activeTheme][widgetName] !== null) {
                    //we have the template, process it and pass it back
                    beginTemplateProcessing(this.templates[this.activeTheme][widgetName], callback, classes);
                } else {
                    //load the html file first, then the css (only if the html loads)
                    if (!this.requestInProgress) {
                        this.failureCount = 0;
                        this.requestTemplate(widget, widgetName, this.activeTheme, callback, classes);
                    } else {
                        this.queuedWidget.push({w: widget, n: widgetName, cb: callback, cl: classes});
                    }
                }
            }
        },
        
        requestTemplate: function(widget, widgetName, theme, callback, classes) {
            this.requestInProgress = true;
            var url = base.themeBaseUrl + '/' + theme + '/' + widgetName + "/widget.html";
            this.requestedTemplate = widgetName;
            this.currentWidget = widget;
            new Request({
                url: url,
                onSuccess: function(template) {
                    this.beginTemplateProcessing(template, callback, classes, theme);
                }.bind(this),
                onFailure: function(xhr){
                    this.processTemplateFailure(theme, callback, classes);
                }
            }).get();
        },
        
        
        
        processTemplateFailure: function(theme, callback, classes) {
            //check for a base theme, if it has one check that (and so forth down through the base themes)
            //otherwise, work our way down through the prototype chain and use the
            //first template we come to.
            this.failureCount++
            var info = this.infoObjects[theme] ;
            if (info.base && info.baseTheme) {
                this.requestTemplate(this.requestedTemplate, info.baseTheme, callback, classes);
            } else {
                var widget = this.currentWidget.prototype,
                template = null;
                
                while (template == null && (widget !== undefined && widget !== null)) {
                    //check for a template
                    var widgetName = typeOf(widget).replace(".","/").toLowerCase();
                    if (this.templates[this.activeTheme] !== undefined &&
                        this.templates[this.activeTheme] !== null &&
                        this.templates[this.activeTheme][widgetName] !== undefined &&
                        this.templates[this.activeTheme][widgetName] !== null) {
                        template = this.templates[this.activeTheme][widgetName];
                    } else {
                        widget = widget.prototype;
                    }
                }
                
                //did we find a template?
                if (template !== null) {
                    beginTemplateProcessing(template, callback, classes, theme);
                } else {
                    //if not, call the callback with null to indicate no template was found
                    callback(null);
                }
                
            }
        },
        
        beginTemplateProcessing: function(template, callback, classes, theme) {
            //we reached here so need to load in CSS for this widget and kick off the next request
            var widget = this.currentWidget;
            
            //load css (need to also load all required descendant css files if not already loaded...)
            url = base.themeBaseUrl + '/' + theme + '/' + this.requestedTemplate + '/widget.css';
            this.loadedStylesheets[theme].append(Styles.loadFiles([url]));
            
            //kick off next request
            if (this.queuedWidgets.length > 0) {
                var r = this.queuedWidgets.shift();
                this.requestTemplate(r.w, r.n, this.activeTheme, r.db, r.cl);
            }
            
            //use handlebars to pre-process the template. Use the widget passed in as
            //the context.
            if (this.templates[this.activeTheme] === undefined ||
                this.templates[this.activeTheme] === null) {
                this.templates[this.activeTheme] = {};
            }
            var widgetName = typeOf(widget).replace(".","/").toLowerCase(),
                tpl = this.templates[this.activeTheme][widgetName] = Handlebars.compile(template),
                html = tpl(widget);
            
            //now actually process the passed in template and pull out the
            //parts that the widget needs.
            var elements = this.processElements(html, classes, widget);
            
            //return to the calling widget
            callback(elements);
            
        },
        
        /**
         * APIMethod: processTemplate
         * This function pulls the needed elements from a provided template
         *
         * Parameters:
         * template - the template to use in grabbing elements
         * classes - an array of class names to use in grabbing elements
         * container - the container to add the template into
         *
         * Returns:
         * a hash object containing the requested Elements keyed by the class
         * names
         */
        processTemplate: function(template,classes,container){
            var h = {},
                element,
                el;
            if (container !== undefined && container !== null){
                element = container.set('html',template);
            } else {
                element = new Element('div',{html:template});
            }
            Object.each(classes, function(klass){
                el = element.getElement('.'+klass);
                if (el !== undefined && el !== null){
                    h[klass] = el;
                }
            });
            return h;
        },
        
        /**
         * Method: processElements
         * process the template of the widget and populate the elements hash
         * with any objects.  Also set any object references based on the classes
         * hash to the widget
         */
        processElements: function(template, classes, widget) {
            var keys = [],
                values = [],
                ret = {};
            for (var key in classes){
                if (key !== undefined) {
                    values.push(classes[key]);
                    keys.push(key);
                }
            }
            var elements = this.processTemplate(template, values);
            keys.each(function(key){
                if (key != 'elements' && elements[classes[key]] !== undefined && elements[classes[key]] !== null) {
                    widget[key] =  elements[classes[key]];
                }
            },this);
            return elements;
        },
        
    }))();
    
    if (base.global) {
        base.global.ThemeManager = themeManager;
    }
    
    return themeManager;
    
});