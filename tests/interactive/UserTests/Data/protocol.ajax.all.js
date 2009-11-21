{
    tests: [
        {
            title: "Jx.Store - AJAX Protocol, Full Strategy",
            description: "This test gets remote data and displays the first column in the 3rd row.  Click the first button to begin the test.",
            verify: "Did an alert popup with the text \"The value of the first column in the third row is 3.value.1\"?",
            before: function(){
	        	document.id("get-remote-data-test").addEvent('click',function(event){
	        		event.stop();
	        		var parser = new Jx.Store.Parser.JSON();
	        		var protocol = new Jx.Store.Protocol.Ajax({
	        		    urls: {
	        		        read: 'UserTests/Data/data.php'
	        		    },
	        		    rest: false,
	        		    parser: parser
	        		});
	        		var full = new Jx.Store.Strategy.Full();
	        		var store = new Jx.Store({
	        		    strategies: [full],
	        		    protocol: protocol,
	        		    record: Jx.Record,
	        			onStoreDataLoaded: (function(store){
	        				store.moveTo(2);
	        				var value = store.get(0);
	        				alert('The value of the first column in the third row is ' + value);
	        			}).bind(this)
	        		});
	        		store.load();
	        	});
            },
            body: "",
            post: function(){
                
            }
        },
        {
            title: "Jx.Store - AJAX Protocol - Full Strategy - Save Strategy - AutoSave Off",
            description: "This test gets remote data, makes a change, and then saves changes in the store.  Click the second button to begin the test.",
            verify: "Did you see a popup with the text \"Save completed successfully.\"?",
            before: function(){
	        	document.id("save-remote-data-test").addEvent('click',function(event){
	    			event.stop();
	    			var parser = new Jx.Store.Parser.JSON();
                    var protocol = new Jx.Store.Protocol.Ajax({
                        urls: {
                            read: 'UserTests/Data/data.php',
                            insert: 'UserTests/Data/saveSuccess.php',
                            update: 'UserTests/Data/saveSuccess.php',
                            'delete': 'UserTests/Data/saveSuccess.php'
                        },
                        rest: false,
                        parser: parser
                    });
                    var full = new Jx.Store.Strategy.Full();
                    var save = new Jx.Store.Strategy.Save({autosave: false});
	    			var store = new Jx.Store({ 
	    			    strategies: [full, save],
                        protocol: protocol,
                        record: Jx.Record,
	    				onStoreDataLoaded: (function(store){
	    					store.set('col2','a new value');
	    					store.deleteRecord(5);
	    					store.getStrategy('save').save();
	    				}).bind(this),
	    				onStoreChangesCompleted: (function(data){
	    					if (data.failed.length === 0 && data.successful.length === 2) {
	    					    alert('Changes saved successfully');
	    					}
	    				}).bind(this)
	    			});
	    			store.load();
	    		});
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Jx.Store - AJAX Protocol - Full Strategy - Save Strategy - AutoSave On",
            description: "This test gets remote data, makes a change, and then saves changes in the store. It should result in an error.  Click the third button to begin the test.",
            verify: "Did you see an alert with the text \"Save error occurred.\" followed by information about the code and a message?",
            before: function(){
	        	document.id("save-remote-data-error-test").addEvent('click',function(event){
	    			event.stop();
	    			var parser = new Jx.Store.Parser.JSON();
                    var protocol = new Jx.Store.Protocol.Ajax({
                        urls: {
                            read: 'UserTests/Data/data.php',
                            insert: 'UserTests/Data/saveError.php',
                            update: 'UserTests/Data/saveError.php',
                            'delete': 'UserTests/Data/saveError.php'
                        },
                        rest: false,
                        parser: parser
                    });
                    var full = new Jx.Store.Strategy.Full();
                    var save = new Jx.Store.Strategy.Save({autoSave: true});
                    var store = new Jx.Store({ 
                        strategies: [full, save],
                        protocol: protocol,
                        record: Jx.Record,
                        onStoreDataLoaded: (function(store){
	    					store.set('col2','a new value');
	    					store.deleteRecord(5);
	    				}).bind(this),
	    				onStoreChangesCompleted: (function(data){
	    				    if (data.failed.length > 0) {
	    				        alert('Save error occurred. Error code: '+data.failed[0].meta.error.code+', Error Message: '+data.failed[0].meta.error.message);
	    				    }
	    				}).bind(this)
	    			});
	    			store.load();
	    		});
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Jx.Store - AJAX Protocol - Full Strategy - Save Strategy - AutoSave On - REST enabled",
            description: "This test gets remote data, makes a change, and then saves changes in the store. It should result in an error.  Click the third button to begin the test.",
            verify: "Did you see an alert with the text \"Save error occurred.\" followed by information about the code and a message?",
            before: function(){
                document.id("save-remote-data-rest-test").addEvent('click',function(event){
                    event.stop();
                    var parser = new Jx.Store.Parser.JSON();
                    var protocol = new Jx.Store.Protocol.Ajax({
                        urls: {
                            rest: 'UserTests/Data/rest.php'
                        },
                        rest: true,
                        parser: parser
                    });
                    var full = new Jx.Store.Strategy.Full();
                    var save = new Jx.Store.Strategy.Save({autoSave: true});
                    var store = new Jx.Store({ 
                        strategies: [full, save],
                        protocol: protocol,
                        record: Jx.Record,
                        onStoreDataLoaded: (function(store){
                            store.set('col2','a new value');
                            store.deleteRecord(5);
                        }).bind(this),
                        onStoreChangesCompleted: (function(data){
                            if (data.failed.length === 0 && data.successful.length === 2) {
                                alert('Changes saved successfully');
                            }
                        }).bind(this)
                    });
                    store.load();
                });
            },
            body: "",
            post: function(){
                
            }
        }
    ],
    otherScripts: ['parser.json','store','strategy.full','strategy.paginate','strategy.save']
}
