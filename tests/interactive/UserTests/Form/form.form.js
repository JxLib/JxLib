{
    "tests": [
        {
            title: "Form Tests - render using .addTo()",
            description: "This test is to verify that the form displays properly. This one has no buttons and doesn't really do anything.",
            verify: "Did the field render properly?",
            before: function(){
                document.id('test-field').empty();
                
                var form = new Jx.Form({
                    formClass: 'someClass',
                    name: 'somename',
                    method: 'get',
                    action: 'something.php',
                    buttons: null
                }).addTo('test-field');
                
                var fieldset = new Jx.Fieldset({
                    legend: 'My Form',
                    fieldsetClass: 'anotherClass',
                    legendClass: 'myLegendClass',
                    id: 'myFieldset'
                }).addTo(form);
                
                var text = new Jx.Field.Text({
                    labelClass: 'grid2',
                    inputClass: 'grid3',
                    tagClass: 'grid1',
                    name: 'someText',
                    label: 'Some Text',
                    value: 'something',
                    tag: 'extra things'
                }).addTo(fieldset);
                
                var radio1 = new Jx.Field.Radio({
                    label: 'Radio 1',
                    name: 'radioGroup',
                    value: 'another thing'
                }).addTo(fieldset);
                
                var radio2 = new Jx.Field.Radio({
                    label: 'Radio 2',
                    name: 'radioGroup',
                    checked: true,
                    value: 'one more thing'
                }).addTo(fieldset);
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Form Tests - using .add()",
            description: "This test is to verify that a form displays properly. This one should have some buttons at the bottom of the form.",
            verify: "Did the form render properly?",
            before: function(){
                document.id('test-field').empty();
                var form = new Jx.Form({
                    formClass: 'someClass',
                    name: 'somename',
                    method: 'get',
                    action: 'something.php'
                }).add(
                    new Jx.Fieldset({
                        legend: 'My Form 2',
                        fieldsetClass: 'anotherClass',
                        legendClass: 'myLegendClass',
                        id: 'myFieldset'
                    }).add(
                        new Jx.Field.Text({
                            labelClass: 'grid2',
                            inputClass: 'grid3',
                            tagClass: 'grid1',
                            name: 'someText',
                            label: 'Some Text',
                            value: 'something',
                            tag: 'extra things'
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 1',
                            name: 'radioGroup',
                            value: 'another thing'
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 2',
                            name: 'radioGroup',
                            checked: true,
                            value: 'one more thing'
                        }),
                        new Jx.Toolbar.Container().add(
                                new Jx.Toolbar().add(
                                        new Jx.Button({
                                            label: 'Submit'
                                        }),
                                        new Jx.Button({
                                            label: 'Reset'
                                        }),
                                        new Jx.Button({
                                            label: 'Cancel'
                                        })
                                )
                        )
                    )).addTo('test-field');
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    "otherScripts": ["text","OverText","checkbox","hidden","radio","select","textarea","fieldset","toolbar.item","container","Form.Validator.Extras","tooltip","button"]
}
