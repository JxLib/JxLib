/*
---

name: Jx.Object

description: Base class for all other object in the JxLib framework.

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Object]

...
 */
// $Id$
/**
 * Class: Jx.Object
 * Base class for all other object in the JxLib framework. This class
 * implements both mootools mixins Events and Options so the rest of the
 * classes don't need to.
 *
 * The Initialization Pipeline:
 * Jx.Object provides a default initialize method to construct new instances
 * of objects that inherit from it.  No sub-class should override initialize
 * unless you know exactly what you're doing.  Instead, the initialization
 * pipeline provides an init() method that is intended to be overridden in
 * sub-classes to provide class-specific initialization as part of the
 * initialization pipeline.
 *
 * The basic initialization pipeline for a Jx.Object is to parse the
 * parameters provided to initialize(), separate out options from other formal
 * parameters based on the parameters property of the class, call init() and
 * initialize plugins.
 *
 * Parsing Parameters:
 * Because each sub-class no longer has an initialize method, it no longer has
 * direct access to parameters passed to the constructor.  Instead, a
 * sub-class is expected to provide a parameters attribute with an array of
 * parameter names in the order expected.  Jx.Object will enumerate the
 * attributes passed to its initialize method and automatically place them
 * in the options object under the appropriate key (the value from the
 * array).  Parameters not found will not be present or will be null.
 *
 * The default parameters are a single options object which is merged with
 * the options attribute of the class.
 *
 * Calling Init:
 * Jx.Object fires the event 'preInit' before calling the init() method,
 * calls the init() method, then fires the 'postInit' event.  It is expected
 * that most sub-class specific initialization will happen in the init()
 * method.  A sub-class may hook preInit and postInit events to perform tasks
 * in one of two ways.
 *
 * First, simply send onPreInit and onPostInit functions via the options
 * object as follows (they could be standalone functions or functions of
 * another object setup using .bind())
 *
 * (code)
 * var preInit = function () {}
 * var postInit = function () {}
 *
 * var options = {
 *   onPreInit: preInit,
 *   onPostInit: postInit,
 *   ...other options...
 * };
 *
 * var dialog = new Jx.Dialog(options);
 * (end)
 *
 * The second method you can use is to override the initialize method
 *
 * (code)
 * var MyClass = new Class({
 *   Family: 'MyClass',
 *   initialize: function() {
 *     this.addEvent('preInit', this.preInit.bind(this));
 *     this.addEvent('postInit', this.postInit.bind(this));
 *     this.parent.apply(this, arguments);
 *   },
 *   preInit: function() {
 *     // something just before init() is called
 *   },
 *   postInit: function() {
 *     // something just after init() is called
 *   },
 *   init: function() {
 *     this.parent();
 *     // initialization code here
 *   }
 * });
 * (end)
 *
 * When the object finishes initializing itself (including the plugin
 * initialization) it will fire off the initializeDone event. You can hook
 * into this event in the same way as the events mentioned above.
 *
 * Plugins:
 * Plugins provide pieces of additional, optional, functionality. They are not
 * necessary for the proper function of an object. All plugins should be
 * located in the Jx.Plugin namespace and they should be further segregated by
 * applicable object. While all objects can support plugins, not all of them
 * have the automatic instantiation of applicable plugins turned on. In order
 * to turn this feature on for an object you need to set the pluginNamespace
 * property of the object. The following is an example of setting the
 * property:
 *
 * (code)
 * var MyClass = new Class({
 *   Extends: Jx.Object,
 *   pluginNamespace: 'MyClass'
 * };
 * (end)
 *
 * The absence of this property does not mean you cannot attach a plugin to an
 * object. It simply means that you can't have Jx.Object create the
 * plugin for you.
 *
 * There are four ways to attach a plugin to an object. First, simply
 * instantiate the plugin yourself and call its attach() method (other class
 * options left out for the sake of simplicity):
 *
 * (code)
 * var MyGrid = new Jx.Grid();
 * var APlugin = new Jx.Plugin.Grid.Selector();
 * APlugin.attach(MyGrid);
 * (end)
 *
 * Second, you can instantiate the plugin first and pass it to the object
 * through the plugins array in the options object.
 *
 * (code)
 * var APlugin = new Jx.Plugin.Grid.Selector();
 * var MyGrid = new Jx.Grid({plugins: [APlugin]});
 * (end)
 *
 * The third way is to pass the information needed to instantiate the plugin
 * in the plugins array of the options object:
 *
 * (code)
 * var MyGrid = new Jx.Grid({
 *   plugins: [{
 *      name: 'Selector',
 *      options: {}    //options needed to create this plugin
 *   },{
 *      name: 'Sorter',
 *      options: {}
 *   }]
 * });
 * (end)
 *
 * The final way, if the plugin has no options, is to pass the name of the
 * plugin as a simple string in the plugins array.
 *
 * (code)
 * var MyGrid = new Jx.Grid({
 *   plugins: ['Selector','Sorter']
 * });
 * (end)
 *
 * Part of the process of initializing plugins is to call prePluginInit() and
 * postPluginInit(). These events provide you access to the object just before
 * and after the plugins are initialized and/or attached to the object using
 * methods 2 and 3 above. You can hook into these in the same way that you
 * hook into the preInit() and postInit() events.
 *
 * Destroying Jx.Object Instances:
 * Jx.Object provides a destroy method that cleans up potential memory leaks
 * when you no longer need an object.  Sub-classes are expected to implement
 * a cleanup() method that provides specific cleanup code for each
 * sub-class.  Remember to call this.parent() when providing a cleanup()
 * method. Destroy will also fire off 2 events: preDestroy and postDestroy.
 * You can hook into these methods in the same way as the init or plugin
 * events.
 *
 * The Family Attribute:
 * the Family attribute of a class is used internally by JxLib to identify Jx
 * objects within mootools.  The actual value of Family is unimportant to Jx.
 * If you do not provide a Family, a class will inherit it's base class family
 * up to Jx.Object.  Family is useful when debugging as you will be able to
 * identify the family in the firebug inspector, but is not as useful for
 * coding purposes as it does not allow for inheritance.
 *
 * Events:
 *
 * preInit
 * postInit
 * prePluginInit
 * postPluginInit
 * initializeDone
 * preDestroy
 * postDestroy
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Object = new Class({
    Family: "Jx.Object",
    Implements: [Options, Events],
    plugins: null,
    pluginNamespace: 'Other',
    /**
     * Constructor: Jx.Object
     * create a new instance of Jx.Object
     *
     * Parameters:
     * options - {Object} optional parameters for creating an object.
     */
    parameters: ['options'],

    options: {
      /**
       * Option: useLang
       * Turns on this widget's ability to react to changes in
       * the default language. Handy for changing text out on the fly.
       *
       * TODO: Should this be enabled or disabled by default?
       */
      useLang: true,
      /**
       * Option: plugins
       * {Array} an array of plugins to add to the object.
       */
      plugins: null
    },

    bound: null,

    initialize: function(){
        this.plugins = new Hash();
        this.bound = {};
        //normalize arguments
        var numArgs = arguments.length,
            options = {},
            parameters = this.parameters,
            numParams,
            index;

        if (numArgs > 0) {
            if (numArgs === 1
                    && (Jx.type(arguments[0])==='object' || Jx.type(arguments[0])==='Hash')
                    && parameters.length === 1
                    && parameters[0] === 'options') {
                options = arguments[0];
            } else {
                numParams = parameters.length;
                index;
                if (numParams <= numArgs) {
                    index = numParams;
                } else {
                    index = numArgs;
                }
                for (var i = 0; i < index; i++) {
                    if (parameters[i] === 'options') {
                        $extend(options, arguments[i]);
                    } else {
                        options[parameters[i]] = arguments[i];
                    }
                }
            }
        }

        this.setOptions(options);

        this.bound.changeText = this.changeText.bind(this);
        if (this.options.useLang) {
            MooTools.lang.addEvent('langChange', this.bound.changeText);
        }

        this.fireEvent('preInit');
        this.init();
        this.fireEvent('postInit');
        this.fireEvent('prePluginInit');
        this.initPlugins();
        this.fireEvent('postPluginInit');
        this.fireEvent('initializeDone');
    },

    /**
     * Method: initPlugins
     * internal function to initialize plugins on object creation
     */
    initPlugins: function () {
        var p;
        // pluginNamespace must be defined in order to pass plugins to the
        // object
        if ($defined(this.pluginNamespace)) {
            if ($defined(this.options.plugins)
                    && Jx.type(this.options.plugins) === 'array') {
                this.options.plugins.each(function (plugin) {
                    if (plugin instanceof Jx.Plugin) {
                        plugin.attach(this);
                        this.plugins.set(plugin.name, plugin);
                    } else if (Jx.type(plugin) === 'object') {
                        // All plugin-enabled objects should define a
                        // pluginNamespace member variable
                        // that is used for locating the plugins. The default
                        // namespace is 'Other' for
                        // now until we come up with a better idea
                      if ($defined(Jx.Plugin[this.pluginNamespace][plugin.name.capitalize()])) {
                        p = new Jx.Plugin[this.pluginNamespace][plugin.name.capitalize()](plugin.options);
                      } else {
                        p = new Jx.Adaptor[this.pluginNamespace][plugin.name.capitalize()](plugin.options);
                      }
                        p.attach(this);
                    } else if (Jx.type(plugin) === 'string') {
                        //this is a name for a plugin.
                      if ($defined(Jx.Plugin[this.pluginNamespace][plugin.capitalize()])) {
                        p = new Jx.Plugin[this.pluginNamespace][plugin.capitalize()]();
                      } else {
                        p = new Jx.Adaptor[this.pluginNamespace][plugin.capitalize()]();
                      }
                        p.attach(this);
                    }
                }, this);
            }
        }
    },

    /**
     * APIMethod: destroy
     * destroy a Jx.Object, safely cleaning up any potential memory
     * leaks along the way.  Uses the cleanup method of an object to
     * actually do the cleanup.
     * Emits the preDestroy event before cleanup and the postDestroy event
     * after cleanup.
     */
    destroy: function () {
        this.fireEvent('preDestroy');
        this.cleanup();
        this.fireEvent('postDestroy');
    },

    /**
     * Method: cleanup
     * to be implemented by subclasses to do the actual work of destroying
     * an object.
     */
    cleanup: function () {
        //detach plugins
        if (this.plugins.getLength > 0) {
            this.plugins.each(function (plugin) {
                plugin.detach();
                plugin.destroy();
            }, this);
        }
        this.plugins.empty();
        if (this.options.useLang && $defined(this.bound.changeText)) {
            MooTools.lang.removeEvent('langChange', this.bound.changeText);
        }
        this.bound = null;
    },

    /**
     * Method: init
     * virtual initialization method to be implemented by sub-classes
     */
    init: $empty,

    /**
     * APIMethod: registerPlugin
     * This method is called by a plugin that has its attach method
     * called.
     *
     * Parameters:
     * plugin - the plugin to register with this object
     */
    registerPlugin: function (plugin) {
        if (!this.plugins.has(plugin.name)) {
            this.plugins.set(plugin.name,  plugin);
        }
    },
    /**
     * APIMethod: deregisterPlugin
     * his method is called by a plugin that has its detach method
     * called.
     *
     * Parameters:
     * plugin - the plugin to deregister.
     */
    deregisterPlugin: function (plugin) {
        if (this.plugins.has(plugin.name)) {
            this.plugins.erase(plugin.name);
        }
    },

    /**
     * APIMethod: getPlugin
     * Allows a developer to get a reference to a plugin with only the
     * name of the plugin.
     *
     * Parameters:
     * name - the name of the plugin as defined in the plugin's name property
     */
    getPlugin: function (name) {
        if (this.plugins.has(name)) {
            return this.plugins.get(name);
        }
    },

    /**
     * APIMethod: getText
     *
     * returns the text for a jx.widget used in a label.
     *
     * Parameters:
     * val - <String> || <Function> || <Object> = { set: '', key: ''[, value: ''] } for a MooTools.lang object
     */
    getText: function(val) {
      var result = '';
      if (Jx.type(val) == 'string' || Jx.type(val) == 'number') {
        result = val;
      } else if (Jx.type(val) == 'function') {
        result = val();
      } else if (Jx.type(val) == 'object' && $defined(val.set) && $defined(val.key)) {
        // COMMENT: just an idea how a localization object could be stored to the instance if needed somewhere else and options change?
        this.i18n = val;
        if($defined(val.value)) {
          result = MooTools.lang.get(val.set, val.key)[val.value];
        }else{
          result = MooTools.lang.get(val.set, val.key);
        }
      }
      return result;
    },

    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     *
     * Parameters:
     * lang - the language being changed to or that had it's data set of
     *    translations changed.
     */
    changeText : $empty,

    /**
     * Method: generateId
     * Used to generate a unique ID for Jx Objects.
     */
    generateId: function(prefix){
        prefix = (prefix) ? prefix : 'jx-';
        var uid = $uid(this);
        delete this.uid;
        return prefix + uid;
    }
});
