/*
---

name: Jx.Adaptor.Tree

description: Base class for all adaptors that fill Jx.Tree widgets. Also acts as the namespace for other Jx.Tree adaptors.

license: MIT-style license.

requires:
 - Jx.Adaptor
 - Jx.Tree.Folder
 - Jx.Tree.item
 - Jx.Store.Strategy.Progressive

provides: [Jx.Adaptor.Tree]

...
 */
/**
 * Class: Jx.Adaptor.Tree
 * This base class is used to change a store (a flat list of records) into the
 * data structure needed for a Jx.Tree. It will have 2 subclasses:
 * <Jx.Adapter.Tree.Mptt> and <Jx.Adapter.Tree.Parent>.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */

define('jx/adaptor/tree', ['../../base','../adaptor','../tree/folder','../tree/item','../store/strategy/progressive'],
       function(base, Adaptor, Folder, Item, Progressive){

    var tree = new Class({

        Extends: Jx.Adaptor,
        Family: 'Jx.Adaptor.Tree',

        Binds: ['fill','checkFolder'],

        options: {
            /**
             * Option: monitorFolders
             * Determines if this adapter should use monitor the TreeFolder items in
             * order to request any items they should contain if they are empty.
             */
            monitorFolders: false,
            /**
             * Option: startingNodeKey
             * The store primary key to use as the node that we're requesting.
             * Initially set to -1 to indicate that we're request the first set of
             * data
             */
            startingNodeKey: -1,
            /**
             * Option: folderOptions
             * A Hash containing the options for <Jx.TreeFolder>. Defaults to null.
             */
            folderOptions: null,
            /**
             * Option: itemOptions
             * A Hash containing the options for <Jx.TreeItem>. Defaults to null.
             */
            itemOptions: null
        },
        /**
         * Property: folders
         * A Hash containing all of the <Jx.TreeFolders> in this tree.
         */
        folders: null,
        /**
         * Property: currentRecord
         * An integer indicating the last position we were at in the store. Used to
         * allow the adaptor to pick up rendering items after we request additional
         * data.
         */
        currentRecord: -1,
        init: function() {
          this.folders = {};
          this.parent();
        },
        /**
         * APIMethod: attach
         * Attaches this adaptor to a specific tree instance.
         *
         * Parameters:
         * tree - an instance of <Jx.Tree>
         */
        attach: function (tree) {
            this.parent(tree);
    
            this.tree = tree;
    
            if (this.options.monitorFolders) {
                this.strategy = this.store.getStrategy('progressive');
    
                if (this.strategy === undefined || this.strategy === null) {
                    this.strategy = new Progressive({
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
        /**
         * APIMethod: detach
         * removes this adaptor from the current tree.
         */
        detach: function () {
          this.parent();
          this.store.removeEvent('storeDataLoaded', this.fill);
        },
        /**
         * APIMethod: firstLoad
         * Method used to start the first store load.
         */
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
          var i,
              template,
              item,
              p,
              folder,
              options = this.options;
    
          if (this.busy == 'tree') {
            this.tree.setBusy(false);
            this.busy = 'none';
          } else if (this.busy == 'folder') {
            this.busyFolder.setBusy(false);
            this.busy = 'none';
          }
            var l = this.store.count() - 1;
            for (i = this.currentRecord + 1; i <= l; i++) {
                template = this.store.fillTemplate(i,options.template,this.columnsNeeded);
    
                if (this.hasChildren(i)) {
                    //add as folder
                    item = new Folder(Object.merge({},options.folderOptions, {
                        label: template
                    }));
    
                    if (options.monitorFolders) {
                      item.addEvent('disclosed', this.checkFolder);
                    }
    
                    this.folders[i] = item;
                } else {
                    //add as item
                    item = new Item(Object.merge({},options.itemOptions, {
                        label: template
                    }));
                }
                document.id(item).store('index', i).store('jxAdaptor', this);
                //check for a parent
                if (this.hasParent(i)) {
                    //add as child of parent
                    p = this.getParentIndex(i);
                    folder = this.folders[p];
                    folder.add(item);
                } else {
                    //otherwise add to the tree itself
                    this.tree.add(item);
                }
            }
            this.currentRecord = l;
        },
        /**
         * Method: checkFolder
         * Called by the disclose event of the tree to determine if we need to
         * request additional items for a branch of the tree.
         */
        checkFolder: function (folder) {
            var items = folder.items(),
                index,
                node;
            if (items === undefined || items === null || items.length === 0) {
                //get items via the store
                index = document.id(folder).retrieve('index');
                node = this.store.get('primaryKey', index);
                this.busyFolder = folder;
                this.busyFolder.setBusy(true);
                this.busy = 'folder';
                this.store.load({
                    node: node
                });
            }
        },
        /**
         * Method: hasChildren
         * Virtual method to be overridden by sublcasses. Determines if a specific
         * node has any children.
         */
        hasChildren: function(){},
        /**
         * Method: hasParent
         * Virtual method to be overridden by sublcasses. Determines if a specific
         * node has a parent node.
         */
        hasParent: function(){},
        /**
         * Method: getParentIndex
         * Virtual method to be overridden by sublcasses. Determines the store index
         * of the parent node.
         */
        getParentIndex: function(){}
    });
    
    if (base.global) {
        base.global.Adaptor.Tree = tree;
    }
    
    return tree;
    
});