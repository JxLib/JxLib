{
    tests: [
        {
            title: "Confirm Dialog",
            description: "This tests that the confirm dialog works. Click the 'Run Test' button to see the dialog.",
            verify: "Did the dialog work correctly?",
            before: function(){
            var btn = new Jx.Button({
                label: 'Run Test',
                onClick: function(){
                    var dlg = new Jx.Dialog.Confirm({
                        question: 'This is a test of the confirm dialog. Click either Yes or No.'
                    });
                    dlg.addEvent('close',function(dialog, result){
                       alert('You chose ' + result);
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
