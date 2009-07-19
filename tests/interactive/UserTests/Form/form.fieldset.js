{
    "tests": [
        {
            title: "Form Fieldset Tests - Fieldset using .addTo()",
            description: "This test is to verify that a fieldset displays properly.",
            verify: "Did the fieldset render properly?",
            before: function(){
                document.id('test-field').empty();
                var fieldset = new Jx.Fieldset({
                    legend: 'My Form',
                    fieldsetClass: 'anotherClass',
                    legendClass: 'myLegendClass',
                    id: 'myFieldset'
                }).addTo('test-field');
                
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
            title: "Form Fieldset Tests - Fieldset using .add()",
            description: "This test is to verify that a fieldset displays properly.",
            verify: "Did the fieldset render properly?",
            before: function(){
                document.id('test-field').empty();
                var fieldset = new Jx.Fieldset({
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
                    })
                ).addTo('test-field');
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    "otherScripts": ["text","OverText","checkbox","hidden","radio","select","textarea","fieldset"]
}
