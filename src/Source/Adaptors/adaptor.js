
/**
 * Class: Jx.Adaptor
 * Base class for all adaptor implementations. Provides a place to locate all
 * common code and the Jx.Adaptor namespace.  Since it extends <Jx.Plugin> all
 * adaptors will be able to be used as plugins for their respective classes.
 * Also as such, they must have the attach() and detach() methods.
 * 
 * Adaptors are specifically used to conform a <Jx.Store> to any one of 
 * the different widgets (i.e. Jx.Tree, Jx.ListView, etc...) that could
 * benefit from integration with the store. This approach was taken to minimize 
 * data access code in the widgets themselves. Widgets should have no idea where 
 * the data/items come from so that they will be usable in the broadest number
 * of situations.
 */
Jx.Adaptor = new Class({
	
	Family: 'Jx.Adaptor',
	Extends: Jx.Plugin,
	
	name: 'Jx.Adaptor',

	options: {
	    template: '',
	    useTemplate: true,
	    store: null
	},
	
	columnsNeeded: null,
	
	init: function () {
	    this.parent();
	    
	    this.store = this.options.store;
	    
	    if (this.options.useTemplate) {
	        this.columnsNeeded = this.store.parseTemplate(this.options.template);
	    }
	},
	
	attach: function (widget) {
		this.parent(widget);
		this.widget = widget;
	},
	
	detach: function () {
		this.parent();
	}
	
});