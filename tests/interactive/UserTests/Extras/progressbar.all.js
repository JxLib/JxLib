{
    tests: [
        {
            title: "Progress Bar - basic test",
            description: "This test is to verify that the progress bar displays and runs properly with all of the defaults.",
            verify: "Did the prgress bar work normally?",
            before: function(){
                var progressBar = new Jx.Progressbar({
                    parent: 'parent'
                });
                progressBar.addEvent('update',function(){
                    console.log('updated!');
                    fn.delay(300);
                });
                progressBar.addEvent('complete',function(){
                    console.log('completed!');
                });
                
                var  total = 20;
                var progress = 0;
                var fn = function() {
                    progress++;
                    progressBar.update(total,progress);
                }
                
                new Jx.Button({
                    label: 'Run Progress Bar',
                    onClick: function(){
                        fn();
                    }
                }).addTo('button');
            
                
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    otherScripts: ["button"]
}
