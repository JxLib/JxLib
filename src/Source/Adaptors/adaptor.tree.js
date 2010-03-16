/**
 * Class: Jx.Adaptor.Tree
 * This base class is used to change a store (a flat list of records) into the
 * data structure needed for a Jx.Tree. It will have 2 subclasses:
 * <Jx.Adapter.Tree.Mptt> and <Jx.Adapter.Tree.Parent>
 * 
 *  
 */
Jx.Adaptor.Tree = new Class({
    
    Family: 'Jx.Adaptor.Tree',
    Extends: Jx.Adaptor,
    
    Binds: ['fill','checkFolder'],
    
    options: {
        /**
         * Option: useAjax
         * Determines if this adapter should use ajax to request data on the
         * fly. 
         */
        monitorFolders: false,
        startingNodeKey: -1,
        folderOptions: {
            image: null,
            imageClass: null
        },
        itemOptions: {
            image: null,
            imageClass: null
        }
    },
    
    folders: new Hash(),
    
    currentRecord: -1,
    
    attach: function (tree) {
        this.parent(tree);
        
        this.tree = tree;
        
        if (this.options.monitorFolders) {
            this.strategy = this.store.getStrategy('progressive');
        
            if (!$defined(this.strategy)) {
                this.strategy = new Jx.Store.Strategy.Progressive({
                    dropRecords: false,
                    getPaginationParams: function () { return {}; }
                });
                this.store.addStrategy(this.strategy);
            } else {
                this.strategy.options.dropRecords = false;
                this.strategy.options.getPaginationParams = function () { return {}; };
            }
            
        }
        
        this.store.addEvent('storeDataLoaded', this.fill);
        
        
    },
    
    detach: function () {
    	this.parent();
    	this.store.removeEvent('storeDataLoaded', this.fill);
    },
    
    firstLoad: function () {
    	//initial store load
    	this.busy = 'tree';
    	this.tree.setBusy(true);
        this.store.load({
            node: this.options.startingNodeKey
        });
    },
    
    /**
     * APIMethod: fill
     * This function will start at this.currentRecord and add the remaining
     * items to the tree. 
     */
    fill: function () {
    	if (this.busy == 'tree') {
    		this.tree.setBusy(false);
    		this.busy = 'none';
    	} else if (this.busy == 'folder') {
    		this.busyFolder.setBusy(false);
    		this.busy = 'none';
    	}
        var l = this.store.count() - 1;
        for (var i = this.currentRecord + 1; i <= l; i++) {
            var template = this.fillTemplate(i);

            var item;
            if (this.hasChildren(i)) {
                //add as folder
                var item = new Jx.TreeFolder($merge(this.options.folderOptions, {
                    label: template
                }));
                
                if (this.options.monitorFolders) {
                	item.addEvent('disclosed', this.checkFolder);
                }
                
                this.folders.set(i,item);
            } else {
                //add as item
                var item = new Jx.TreeItem($merge(this.options.itemOptions, {
                    label: template
                }));
            }
            $(item).store('index', i);
            $(item).store('jxAdaptor', this);
            //check for a parent
            if (this.hasParent(i)) {
                //add as child of parent
                var p = this.getParentIndex(i);
                var folder = this.folders.get(p);
                folder.add(item);
            } else {
                //otherwise add to the tree itself
                this.tree.add(item);
            }
        }
        this.currentRecord = l;
    },
    
    checkFolder: function (folder) {
        var items = folder.items();
        if (!$defined(items) || items.length === 0) {
            //get items via the store
        	var index = $(folder).retrieve('index');
        	var node = this.store.get('primaryKey', index);
        	this.busyFolder = folder;
        	this.busyFolder.setBusy(true);
        	this.busy = 'folder';
            this.store.load({
                node: node
            });
        }
    },
    
    hasChildren: $empty,
    
    hasParent: $empty,
    
    getParentIndex: function(){}
    
    
});