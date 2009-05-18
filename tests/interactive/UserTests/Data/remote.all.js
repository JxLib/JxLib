{
    tests: [
        {
            title: "Jx.Store.Remote - Get Remote Data",
            description: "This test gets remote data and displays the first column in the 3rd row.  Click the first button to begin the test.",
            verify: "Did an alert popup with the text \"The value of the first column in the third row is 3.value.1\"?",
            before: function(){
	        	$("get-remote-data-test").addEvent('click',function(event){
	        		event.stop();
	        		var store = new Jx.Store.Remote({ 
	        			dataUrl: 'UserTests/Data/data.php',
	        			onLoadFinished: (function(store){
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
            title: "Jx.Store.Remote - Get Remote Data",
            description: "This test gets remote data, makes a change, and then saves changes in the store.  Click the second button to begin the test.",
            verify: "Did you see a popup with the text \"Save completed successfully.\"?",
            before: function(){
	        	$("save-remote-data-test").addEvent('click',function(event){
	    			event.stop();
	    			var store = new Jx.Store.Remote({ 
	    				dataUrl: 'UserTests/Data/data.php',
	    				saveUrl: 'UserTests/Data/saveSuccess.php',
	    				autoSave: false,
	    				onLoadFinished: (function(store){
	    					store.set('col2','a new value');
	    					store.save();
	    				}).bind(this),
	    				onSaveSuccess: (function(data){
	    					alert('Save completed successfully.'); 
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
            title: "Jx.Store.Remote - Get Remote Data",
            description: "This test gets remote data, makes a change, and then saves changes in the store. It should result in an error.  Click the third button to begin the test.",
            verify: "Did you see an alert with the text \"Save error occurred.\" followed by information about the code and a message?",
            before: function(){
	        	$("save-remote-data-error-test").addEvent('click',function(event){
	    			event.stop();
	    			var store = new Jx.Store.Remote({ 
	    				dataUrl: 'UserTests/Data/data.php',
	    				saveUrl: 'UserTests/Data/saveError.php',
	    				autoSave: false,
	    				onLoadFinished: (function(store){
	    					store.set('col2','a new value');
	    					store.save();
	    				}).bind(this),
	    				onSaveError: (function(store,data,text){
	    					alert('Save error occurred. Error code: '+data.error.code+', Error Message: '+data.error.message); 
	    				}).bind(this)
	    			});
	    			store.load();
	    		});
            },
            body: "",
            post: function(){
                
            }
        }
    ]
}
