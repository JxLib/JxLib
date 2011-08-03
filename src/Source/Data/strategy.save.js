/*
---

name: Jx.Store.Strategy.Save

description: Strategy used for saving data back to a source. Can be called manually or setup to automatically save on every change.

license: MIT-style license.

requires:
 - Jx.Store.Strategy

provides: [Jx.Store.Strategy.Save]

...
 */
// $Id$
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
    Family: 'Jx.Store.Strategy.Save',
    
    name: 'save',
    
    options: {
        /**
         * Option: autoSave
         * Whether the strategy should be watching the store to save changes
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
    
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.bound.save = this.saveRecord.bind(this);
        this.bound.update = this.updateRecord.bind(this);
        this.bound.completed = this.onComplete.bind(this);
        this.parent();
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        this.parent();
        if (Jx.type(this.options.autoSave) === 'number') {
            this.periodicalId = this.save.periodical(this.options.autoSave, this);
        } else if (this.options.autoSave) {
            this.store.addEvent('storeRecordAdded', this.bound.save);
            this.store.addEvent('storeColumnChanged', this.bound.update);
            this.store.addEvent('storeRecordDeleted', this.bound.save);
        }
        
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        this.parent();
        if (this.periodicalId !== undefined && this.periodicalId !== null) {
            window.clearInterval(this.periodicalId);
        } else if (this.options.autoSave) {
            this.store.removeEvent('storeRecordAdded', this.bound.save);
            this.store.removeEvent('storeColumnChanged', this.bound.update);
            this.store.removeEvent('storeRecordDeleted', this.bound.save);
        }
        
    },
    
    /**
     * APIMethod: updateRecord
     * called by event handlers when store data is updated
     *
     * Parameters:
     * index - {Integer} the row that was affected
     * column - {String} the column that was affected
     * oldValue - {Mixed} the previous value
     * newValue - {Mixed} the new value
     */
    updateRecord: function(index, column, oldValue, newValue) {
      var resp = this.saveRecord(this.store, this.store.getRecord(index));
      // no response if updating or record state not set
      if (resp) {
        resp.index = index;
      }
    },
    /**
     * APIMethod: saveRecord
     * Called by event handlers when a store record is added, or deleted. 
     * If deleted, the record will be removed from the deleted array.
     * 
     * Parameters:
     * record - The Jx.Record instance that was changed
     * store - The instance of the store
     */
    saveRecord: function (store, record) {
        //determine the status and route based on that
        if (!this.updating && record.state  !== undefined && record.state  !== null) {
            if (this.totalChanges === 0) {
                store.protocol.addEvent('dataLoaded', this.bound.completed);
            }
            this.totalChanges++;
            var ret;
            switch (record.state) {
                case Jx.Record.UPDATE:
                    ret = store.protocol.update(record);
                    break;
                case Jx.Record.DELETE:
                    ret = store.protocol['delete'](record);
                    break;
                case Jx.Record.INSERT:
                    ret = store.protocol.insert(record);
                    break;
                default:
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
     * 
     * Parameters:
     * options - options to adjust the request. Will be passed to all methods.
     */
    save: function (options) {
        //go through all of the data and figure out what needs to be acted on
        if (this.store.loaded) {
            var records = [];
            records[Jx.Record.UPDATE] = [];
            records[Jx.Record.INSERT] = [];
            
            this.store.data.each(function (record) {
                if (record !== undefined && 
                    record !== null && 
                    record.state !== undefined && 
                    record.state !== null) {
                    records[record.state].push(record);
                }
            }, this);
            records[Jx.Record.DELETE] = this.store.deleted;
            
            if (!this.updating) {
              if (this.totalChanges === 0) {
                  this.store.protocol.addEvent('dataLoaded', this.bound.completed);
              }
              this.totalChanges += records[Jx.Record.UPDATE].length + 
                                   records[Jx.Record.INSERT].length +
                                   records[Jx.Record.DELETE].length;
              if (records[Jx.Record.UPDATE].length) {
                this.store.protocol.update(records[Jx.Record.UPDATE],options);
              }
              if (records[Jx.Record.INSERT].length) {
                this.store.protocol.insert(records[Jx.Record.INSERT],options);
              }
              if (records[Jx.Record.DELETE].length) {
                this.store.protocol['delete'](records[Jx.Record.DELETE],options);
              }
            }
            
        }
        
    },
    /**
     * Method: onComplete
     * Handles processing of the response(s) from the protocol. Each 
     * update/insert/delete will have an individual response. If any responses 
     * come back failed we will hold that response and send it to the caller
     * via the fired event. This method is responsible for updating the status
     * of each record as it returns and on inserts, it updates the primary key
     * of the record. If it was a delete it will remove it permanently from
     * the store's deleted array (provided it returns successful - based on
     * the success attribute of the meta object). When all changes have been 
     * accounted for the method fires a finished event and passes all of the 
     * failed responses to the caller so they can be handled appropriately.
     * 
     * Parameters:
     * response - the response returned from the protocol
     */
    onComplete: function (response) {
        if (!response.success() || 
            (response.meta !== undefined && response.meta !== null && 
             !response.meta.success)) {
            this.failedChanges.push(response);
        } else {
            //process the response
            var records = [response.requestParams[0]].flatten(),
                responseData = (response.data !== undefined && response.data !== null) ? [response.data].flatten() : null;
            records.each(function(record, index) {
              if (response.requestType === 'delete') {
                  this.store.deleted.erase(record);
              } else { 
                  if (response.requestType === 'insert' || response.requestType == 'update') {
                      if (responseData && responseData[index] !== undefined && responseData[index] !== null) {
                          this.updating = true;
                          Object.each(responseData[index], function (val, key) {
                              var d = record.set(key, val);
                              if (d[1] != val) {
                                d.unshift(index);
                                record.store.fireEvent('storeColumnChanged', d);
                              }
                          });
                          this.updating = false;
                      }
                  }
                  record.state = null;
              } 
              this.totalChanges--;
          }, this);
          this.successfulChanges.push(response);
        }
        if (this.totalChanges === 0) {
            this.store.protocol.removeEvent('dataLoaded', this.bound.completed);
            this.store.fireEvent('storeChangesCompleted', {
                successful: this.successfulChanges,
                failed: this.failedChanges
            });
            this.successfulChanges = [];
            this.failedChanges = [];
        }
    }
});