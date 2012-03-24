/*
---

name: Global

description: Creates the Jx namespace for global use of the library

license: MIT-style license.

provides: [Global]

...
*/

/**
 * This file simply creates the Jx global variable which indicates to everything
 * else that each component should be added to the global namespace
 */

if (Jx === undefined || Jx === null) {
    var Jx = {
        isGlobal: true    
    };
}


/**
 * This section is borrowed from Mootools 1.5amd branch by arian.
 * It has been modified for JxLib and will remain in until MooTool1.5 releases.
 *
 * This section simply replaces require and define with a version if the actual
 * one doesn't exist. This will only be used when compiling for a full build
 * that should be global.
 */
if (typeof define == 'undefined') (function(){

var loaded = {};

this.require = function(name){
	return loaded[name];
};

var define = this.define = function(id, deps, fn){
	if (typeof deps == 'function') {
        fn = deps;
        deps = [];
    }
    if (loaded.require === undefined || loaded.require === null) {
        var require = function(name){
            name = normalize(name, id);
            return loaded[name];
        };
        require.defined = function(name) {
            return (loaded[name] !== undefined && loaded[name] !== null);
        }
        loaded['require'] = require;
    }
    //get deps
    var d = deps.map(function(dep){
        name = normalize(dep, id);
        return loaded[name];
    });
	var ret = fn.apply(this,d);
	loaded[id] = ret;
};

define.amd = {};


var normalize = function(name, relative){
	if (relative == null || name.slice(0, 1) != '.') return name;
	relative = relative.split('/');
	if (name.slice(0, 2) == './'){
		name = name.slice(2);
		relative.pop();
	}
	if (name.slice(0, 3) == '../') relative.pop();
	while (name.slice(0, 3) == '../'){
		name = name.slice(3);
		relative.pop();
	}
	relative.push(name);
	return relative.join('/');
};

})();