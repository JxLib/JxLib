
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
	        this.columnsNeeded = this.parseTemplate();
	    }
	},
	
	attach: function (widget) {
		this.parent(widget);
		this.widget = widget;
	},
	
	detach: function () {
		this.parent();
	},
	
	
	/**
	 * Method: parseTemplate
	 * parses the provided template to determine which store columns are
	 * required to complete it.
	 *
	 * Parameters:
	 * template - the template to parse
	 */
	parseTemplate: function () {
	    //we parse the template based on the columns in the data store looking
	    //for the pattern {column-name}. If it's in there we add it to the
	    //array of ones to look for
	    var columns = this.store.getColumns();
	    var arr = [];
	    columns.each(function (col) {
	        var s = '{' + col.name + '}';
	        if (this.options.template.contains(s)) {
	            arr.push(col.name);
	        }
	    }, this);
	    return arr;
	}.protect(),
	
	/**
	 * Method: fillTemplate
	 * Actually does the work of getting the data from the store
	 * and creating a single item based on the provided template
	 * 
	 * Parameters: 
	 * index - the index of the data in the store to use in populating the
	 *          template.
	 */
	fillTemplate: function (index) {
	    //create the item
	    var itemObj = {};
	    this.columnsNeeded.each(function (col) {
	        itemObj[col] = this.store.get(col, index);
	    }, this);
	    return this.options.template.substitute(itemObj);
	}.protect()
	
});