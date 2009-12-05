{
    tests: [
        {
            title: "Toolbar container - scrolling",
            description: "Test of the new toolbar container. make sure you can scroll in both directions as you would expect.",
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
        },{
            title: "Toolbar container - removing toolbars",
            description: "Test of the new toolbar container. Click the button to remove a toolbar and make sure everything still works correctly.",
            verify: "Does it work?",
            before: function(){
                document.id('container').empty();
                var tbc = new Jx.Toolbar.Container({
                    scroll: true
                });
                
                var tb = new Jx.Toolbar();
                tb.add(
                    new Jx.Button({label: 'button one 2'}),
                    new Jx.Button({label: 'button two'}),
                    new Jx.Button({label: 'button three'}),
                    new Jx.Button({label: 'button four'}),
                    new Jx.Button({label: 'button five'}),
                    new Jx.Button({label: 'button six'})
                );
                
                tbc.addTo(
                    'container'
                ).add(
                    new Jx.Toolbar().add(
                        new Jx.Button({label: 'button one 1'}),
                        new Jx.Button({label: 'button two'}),
                        new Jx.Button({label: 'button three'}),
                        new Jx.Button({label: 'button four'}),
                        new Jx.Button({label: 'button five'}),
                        new Jx.Button({label: 'button six'})
                    ),tb
                );
                
                new Jx.Button({
                    label: 'Remove toolbar',
                    onClick: function () {
                        tbc.remove(tb);
                    }
                }).addTo('container');
                
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Toolbar container - scrollIntoView",
            description: "Test of the new toolbar container. Clicking the first button should autoscroll the bar to the 'See Me 1' button and then enable the second button which will scroll back to the 'See Me 2' button.",
            verify: "Does it work?",
            before: function(){
                document.id('container').empty();
                var tbc = new Jx.Toolbar.Container({
                    scroll: true
                });
                
                var one = new Jx.Button({label: 'See ME 1'});
                var two = new Jx.Button({label: 'See Me 2'});
                tb = new Jx.Toolbar();
                tb.add(
                    new Jx.Button({label: 'button one 2'}),
                    new Jx.Button({label: 'button two'}),
                    new Jx.Button({label: 'button three'}),
                    one,
                    new Jx.Button({label: 'button five'}),
                    new Jx.Button({label: 'button six'})
                );
                
                tbc.addTo(
                    'container'
                ).add(
                    new Jx.Toolbar().add(
                        new Jx.Button({label: 'button one 1'}),
                        two,
                        new Jx.Button({label: 'button three'}),
                        new Jx.Button({label: 'button four'}),
                        new Jx.Button({label: 'button five'}),
                        new Jx.Button({label: 'button six'})
                    ),tb
                );
                
                var btn2 = new Jx.Button({
                    label: 'Scroll to "See Me 2"',
                    enabled: false,
                    onClick: function () {
                        tbc.scrollIntoView(two);
                    }
                });
                
                new Jx.Button({
                    label: 'Scroll to "See Me 1"',
                    onClick: function () {
                        tbc.scrollIntoView(one);
                        btn2.setEnabled(true);
                    }
                }).addTo('container');
                btn2.addTo('container');
                
            },
            body: "",
            post: function(){
                
            }
        }
    ],
    otherScripts: ["toolbar.item","toolbar.separator","button","Fx.Tween"]
}
