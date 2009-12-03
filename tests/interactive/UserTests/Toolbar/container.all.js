{
    tests: [
        {
            title: "Toolbar container - scrolling",
            description: "Test of the new toolbar container.",
            verify: "Does it work?",
            before: function(){
            document.id('container').empty();
            new Jx.Toolbar.Container({
                scroll: true
            }).addTo(
                    'container'
                ).add(
                    new Jx.Toolbar().add(
                        new Jx.Button({label: 'button one'}),
                        new Jx.Button({label: 'button two'}),
                        new Jx.Button({label: 'button three'}),
                        new Jx.Button({label: 'button four'}),
                        new Jx.Button({label: 'button five'}),
                        new Jx.Button({label: 'button six'})
                    ),
                    new Jx.Toolbar().add(
                        new Jx.Button({label: 'button one'}),
                        new Jx.Button({label: 'button two'}),
                        new Jx.Button({label: 'button three'}),
                        new Jx.Button({label: 'button four'}),
                        new Jx.Button({label: 'button five'}),
                        new Jx.Button({label: 'button six'})
                    )
                )
                
            },
            body: "",
            post: function(){
                
            }
        }
    ],
    otherScripts: ["toolbar.item","toolbar.separator","button","Fx.Tween"]
}
