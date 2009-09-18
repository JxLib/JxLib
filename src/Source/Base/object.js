// $Id: $
/**
 * Class: Jx.Object
 * Base class for all other object in the JxLib framework. This class
 * implements both mootools mixins Events and Options so the rest of the
 * classes don't need to. 
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
Jx.Object = new Class({
	
    Implements: [Options, Events],
	
    Family: "Jx.Object",
    
    plugins: new Hash(),
    
    pluginNamespace: 'Other',
    
    parameters: ['options'],
	
	initialize: function(){
        //normalize arguments
        var numArgs = arguments.length;
        var options = {};
        
        if (numArgs > 0) {
            if (numArgs === 1 
                    && (Jx.type(arguments[0])==='object' || Jx.type(arguments[0])==='Hash') 
                    && this.parameters.length === 1 
                    && this.parameters[0] === 'options') {
                options = arguments[0];
            } else {
                var numParams = this.parameters.length;
                var index;
                if (numParams <= numArgs) {
                    index = numParams;
                } else {
                    index = numArgs;
                }
                options = {};
                for (var i = 0; i < index; i++) {
                    if (this.parameters[i] === 'options') {
                        options = $merge(options, arguments[i]);
                    } else {
                        options[this.parameters[i]] = arguments[i];
                    }
                }
            }
        }
        
        this.setOptions(options);
        this.fireEvent('preInit');
        this.init();
        this.fireEvent('postInit');
        this.fireEvent('prePluginInit');
        this.initPlugins();
        this.fireEvent('postPluginInit');
        this.fireEvent('initializeDone');
    },
    
    initPlugins: function(){
      //initialize the plugins
        if ($defined(this.options.plugins)
                && Jx.type(this.options.plugins) === 'array') {
            this.options.plugins.each(function (plugin) {
                if (plugin instanceof Jx.Plugin) {
                    plugin.attach(this);
                    this.plugins.set(plugin.name, plugin);
                } else if (Jx.type(plugin) === 'object') {
                    //All plugin-enabled objects should define a pluginNamespace member variable
                    //that is used for locating the plugins. The default namespace is 'Other' for
                    //now until we come up with a better idea
                    var p = new Jx.Plugin[this.pluginNamespace][plugin.name](plugin.options);
                    p.attach(this);
                    this.plugins.set(p.name, p);
                }
            }, this);
        }
    },
    
    destroy: function(){
        this.fireEvent('preDestroy');
        this.cleanup();
        this.fireEvent('postDestroy');
    },
    
    cleanup: function() {
        //detach plugins
        if (this.plugins.getLength > 0) {
            this.plugins.each(function(plugin){
                plugin.detach();
                plugin.destroy();
            },this);
        }
    },
    
    init: $empty

});
 