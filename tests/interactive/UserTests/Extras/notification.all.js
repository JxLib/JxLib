{
    tests: [
        {
            title: "Notification Widget - float in Window",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                var opts = {
                    style: 'float',
                    sizes: { 
                        width: 150 
                    }
                };
                var n = new Jx.Notification(opts);
                n.add('This is a sample notice.');
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - float in Parent",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                var opts = {
                    parent: 'parent',
                    style: 'float',
                    sizes: { 
                        width: 150 
                    }
                };
                var n = new Jx.Notification(opts);
                n.add('This is a sample notice.');
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in body - top",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in body - left",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in body - bottom",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in body - right",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in panel - top",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in panel - left",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in panel - bottom",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in panel - right",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in other container - top",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in other container - left",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in other container - bottom",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Notification Widget - anchored in other container - right",
            description: "This test is to verify that the notification widget works properly as a floated object in the window itself",
            verify: "Did the notification work normally?",
            before: function(){
                
                
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    otherScripts: ["button"]
}
