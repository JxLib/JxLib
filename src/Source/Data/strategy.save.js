// $Id: $
/**
 * Class: Jx.Store.Strategy.Save 
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * A Store strategy class for saving data via protocols
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy.Save = new Class({
    
    Extends: Jx.Store.Strategy,
    
    name: 'save',
    
    options: {
        /**
         * Option: autoSave
         * Whether the strateggy should be watching the store to save changes
         * automatically. Set to True to watch events, set it to a number of 
         * milliseconds to have the strategy save every so many seconds
         */
        autoSave: false
    },
    /**
     * Property: failedChanges
     * an array holding all failed requests
     */
    failedChanges: [],
    /**
     * Property: successfulChanges
     * an array holding all successful requests
     */
    successfulChanges: [],
    /**
     * Property: totalChanges
     * The total number of changes being processed. Used to determine
     * when to fire off the storeChangesCompleted event on the store
     */
    totalChanges: 0,
    
    init: function () {
        this.parent();
        this.bound = {
            save: this.saveRecord.bind(this),
            completed: this.onComplete.bind(this)
        };
    },
    
    activate: function () {
        this.parent();
        if (Jx.type(this.options.autoSave) === 'number') {
            this.periodicalId = this.save.periodical(this.options.autoSave, this);
        } else if (this.options.autoSave) {
            this.store.addEvent('storeRecordAdded', this.bound.save);
            this.store.addEvent('storeColumnChanged', this.bound.save);
            this.store.addEvent('storeRecordDeleted', this.bound.save);
        }
        
    },
    
    deactivate: function () {
        this.parent();
        if ($defined(this.periodicalId)) {
            $clear(this.periodicalId);
        } else if (this.options.autoSave) {
            this.store.removeEvent('storeRecordAdded', this.bound.save);
            this.store.removeEvent('storeColumnChanged', this.bound.save);
            this.store.removeEvent('storeRecordDeleted', this.bound.save);
        }
        
    },
    
    /**
     * APIMethod: saveRecord
     * Called by event handlers when store data is changed, updated, or deleted.
     * If deleted, the record will be removed from the deleted array.
     * 
     * Parameters:
     * record - The Jx.Record instance that was changed
     * store - The instance of the store
     */
    saveRecord: function (record, store) {
        //determine the status and route based on that
        if (!this.updating && $defined(record.state)) {
            if (this.totalChanges === 0) {
                this.store.protocol.addEvent('dataLoaded', this.bound.completed);
            }
            this.totalChanges++;
            var ret;
            switch (record.state) {
                case Jx.Record.UPDATE:
                    ret = this.store.protocol.update(record);
                    break;
                case Jx.Record.DELETE:
                    ret = this.store.protocol['delete'](record);
                    break;
                case Jx.Record.INSERT:
                    ret = this.store.protocol.insert(record);
                    break;
            }
            return ret;
        }
    },
    /**
     * APIMethod: save
     * Called manually when the developer wants to save all data changes 
     * in one shot. It will empty the deleted array and reset all other status 
     * flags
     */
    save: function () {
        //go through all of the data and figure out what needs to be acted on
        var records = [];
        records[Jx.Record.UPDATE] = [];
        records[Jx.Record.INSERT] = [];
        
        this.store.data.each(function (record) {
            if ($defined(record) && $defined(record.state)) {
                records[record.state].push(record);
            }
        }, this);
        records[Jx.Record.DELETE] = this.store.deleted;
        
        records.flatten().each(function (record) {
            this.saveRecord(record);
        }, this);
        
    },
    /**
     * Method: onComplete
     * Handles processing of the response(s) from the protocol. Each 
     * update/insert/delete will have an individual response. If any responses 
     * come back failed we will hold that response and send it to the caller
     * via the fired event. This method is responsible for updating the status
     * of each record as it returns and on inserts, it updates the primary key
     * of the record. If it was a delete it will remove it permanently from the
     * store's deleted array (provided it returns successful - based on the 
     * success attribute of the meta object). When all changes have been 
     * accounted for the method fires a finished event and passes all of the 
     * failed responses to the caller so they can be handled appropriately.
     * 
     * Parameters:
     * response - the response returned from the protocol
     */
    onComplete: function (response) {
        if (!response.success() || ($defined(response.meta) && !response.meta.success)) {
            this.failedChanges.push(response);
        } else {
            //process the response
            var record = response.requestParams[0];
            if (response.requestType === 'delete') {
                this.store.deleted.erase(record);
            } else { 
                if (response.requestType === 'insert') {
                    if ($defined(response.data)) {
                        this.updating = true;
                        $H(response.data).each(function (val, key) {
                            record.set(key, val);
                        }, this);
                        this.updating = false;
                    }
                }
                record.state = null;
            } 
            this.successfulChanges.push(response);
        }
        this.totalChanges--;
        if (this.totalChanges === 0) {
            this.store.protocol.removeEvent('dataLoaded', this.bound.completed);
            this.store.fireEvent('storeChangesCompleted', {
                successful: this.successfulChanges,
                failed: this.failedChanges
            });
        }
            
    }
    
});