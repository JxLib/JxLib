/**
 * Class: Jx.Object
 * Base class for all other object in the JxLib framework. This class
 * implements both mootools mixins Events and Options so the rest of the
 * classes don't need to. 
 * 
 */
Jx.Object = new Class({
	
	Implements: [Options, Events],
	
	initialize: function(options){
		this.setOptions(options);
	}
	             
});
 