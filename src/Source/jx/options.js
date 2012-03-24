/*
---

name: Jx.Options

description: Base class for all other object in the JxLib framework.

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Options]

...
 */
/**
 * Class: Jx.Options
 * Jx.Options is a mixin class that provides the options functionality of
 * the original Jx.Object implementation. It was designed so that the
 * same functionality could be added to Jx.Plugin without having to
 * extend from it (thus avoiding a circular reference).
 */
define('jx/options',['base'],function(base){

    
    var opts = new Class({
        
        /**
         * Property:
         * options - {Object} optional parameters for creating an object.
         */
        parameters: ['options'],
        
        determineOptions: function(){
            var numArgs = arguments.length,
                options = {},
                parameters = this.parameters,
                numParams,
                index,
                args,
                type = typeOf(arguments[0]);
                
            if (type === 'arguments') {
                args = arguments[0];
            } else {
                args = arguments;
            }
            
            if (numArgs > 0) {
                if (numArgs === 1 &&
                        (typeOf(args[0])==='object') &&
                        parameters.length === 1 &&
                        parameters[0] === 'options') {
                    options = args[0];
                } else {
                    numParams = parameters.length;
                    if (numParams <= numArgs) {
                        index = numParams;
                    } else {
                        index = numArgs;
                    }
                    for (var i = 0; i < index; i++) {
                        if (parameters[i] === 'options') {
                            Object.append(options, args[i]);
                        } else {
                            options[parameters[i]] = args[i];
                        }
                    }
                }
            }
            return options;
        }
    });    
    
    if (base.global) {
        base.global.Options = opts;
    }
    
    return opts;
});