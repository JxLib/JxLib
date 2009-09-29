{
    tests: [
        {
            title: "Message Dialog",
            description: "This tests that the message dialog works. Click the 'Run Test' button to see the dialog.",
            verify: "Did the message dialog work correctly?",
            before: function(){
                var btn = new Jx.Button({
                    label: 'Run Test',
                    onClick: function(){
                        var dlg = new Jx.Dialog.Message({
                            message: 'If you see this then the test passes.'
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
