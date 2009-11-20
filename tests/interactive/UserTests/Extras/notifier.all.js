{
    tests: [
        {
            title: "Notifier.Float Widget",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                var opts = {
                    style: 'float',
                    sizes: { 
                        width: 150 
                    }
                };
                var n = new Jx.Notifier.Float(opts);
                n.add(new Jx.Notice({content:'this is a sample notice'}));
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    otherScripts: ["button","notifier.float","notice"]
}
