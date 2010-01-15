{
    tests: [
        {
            title: "Prompt Dialog",
            description: "This tests that the prompt dialog works. Click the 'Run Test' button to see the dialog.",
            verify: "Did the dialog work correctly?",
            before: function(){
            var btn = new Jx.Button({
                label: 'Run Test',
                onClick: function(){
                    var dlg = new Jx.Dialog.Prompt({
                        prompt: 'This is a test of the prompt dialog. Enter some text and press OK.',
                        startingValue: 'Some staring value here'
                    });
                    dlg.addEvent('close',function(dialog, result, text){
                       alert('You chose "' + result + '" and entered "' + text + '"');
                    });
                    dlg.open();
                }
            });
            btn.addTo('container');
                
            },
            body: "",
            post: function(){
                
            }
        }
    ],
    otherScripts: ["button"]
}
