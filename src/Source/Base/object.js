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
	
	initialize: function(options){
        this.setOptions(options);
    }

});
 