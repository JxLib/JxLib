{
    "tests": [
        {
            title: "Form Tests - render using .addTo()",
            description: "This test is to verify that the form displays properly. This one has no buttons and doesn't really do anything.",
            verify: "Did the field render properly?",
            before: function(){
                $('test-field').empty();
                
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
            description: "This test is to verify that a form displays properly. This one should have the some buttons at the bottom of the form.",
            verify: "Did the form render properly?",
            before: function(){
                $('test-field').empty();
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
        },{
            title: "Form Tests - using .add()",
            description: "This test is to verify that a form displays properly. This one should have some buttons at the bottom of the form which should work. Validation is also enabled and display error messages embeded in the label (suitable for styling).",
            verify: "Did the form render properly?",
            before: function(){
                $('test-field').empty();
                
                var clickMethod = function(form){
                    if (form.isValid()){
                        var values = form.getValues();
                        console.log(values);
                        alert('Values have been logged to the console. Normally you would do something intelligent here.');
                    } else {
                        alert('Validation failed! Normally do something intelligent here.');
                    }
                };
                
                var form = new Jx.Form({
                    formClass: 'someClass',
                    name: 'somename',
                    method: 'get',
                    action: 'something.php',
                    validationOptions: {
                        evaluateFieldsOnChange: false
                    },
                    errors: {
                        showErrorMessages: 'both'
                    }
                });
                form.add(
                    new Jx.Fieldset({
                        form: form,
                        legend: 'My Form 2',
                        fieldsetClass: 'anotherClass',
                        legendClass: 'myLegendClass',
                        id: 'myFieldset'
                    }).add(
                        new Jx.Field.Text({
                            labelClass: 'grid2',
                            inputClass: 'grid3',
                            tagClass: 'grid1',
                            name: 'afield',
                            label: 'Some Text',
                            value: '',
                            tag: 'extra things',
                            alt: 'Add some text here',
                            overtext: {},
                            required: true,
                            validatorClasses: 'minLength:5 maxLength:15'
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 1',
                            name: 'radioGroup',
                            value: 'another thing',
                            required: true
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 2',
                            name: 'radioGroup',
                            checked: true,
                            value: 'one more thing'
                        })
                )).addTo('test-field');
                var toolbar = new Jx.Toolbar.Container().add(
                        new Jx.Toolbar().add(
                                new Jx.Button({
                                    label: 'Submit',
                                    onClick: function(obj,evt){ clickMethod(form); }
                                }),
                                new Jx.Button({
                                    label: 'Reset',
                                    onClick: form.reset.bind(form)
                                }),
                                new Jx.Button({
                                    label: 'Cancel',
                                    onClick: function(){ alert('Cancel clicked!');}
                                })
                        )
                ).addTo(form);
                form.enableValidation();
            },
            body: "",
            post: function(){
                
                
            }
        },{
            title: "Form Tests - using .add()",
            description: "This test is to verify that a form displays properly. This one should have some buttons at the bottom of the form which should work. Validation is also enabled and should display error messages as an icon with a tooltip and no messages at the top of the form.",
            verify: "Did the form render properly?",
            before: function(){
                $('test-field').empty();
                
                var clickMethod = function(form){
                    if (form.isValid()){
                        var values = form.getValues();
                        console.log(values);
                        alert('Values have been logged to the console. Normally you would do something intelligent here.');
                    } else {
                        alert('Validation failed! Normally do something intelligent here.');
                    }
                };
                
                var form = new Jx.Form({
                    formClass: 'someClass',
                    name: 'somename',
                    method: 'get',
                    action: 'something.php',
                    validationOptions: {
                        evaluateFieldsOnChange: false
                    },
                    errors: {
                        showErrorMessages: 'individual',
                        messageStyle: 'tip'
                    }
                });
                form.add(
                    new Jx.Fieldset({
                        form: form,
                        legend: 'My Form 2',
                        fieldsetClass: 'anotherClass',
                        legendClass: 'myLegendClass',
                        id: 'myFieldset'
                    }).add(
                        new Jx.Field.Text({
                            labelClass: 'grid2',
                            inputClass: 'grid3',
                            tagClass: 'grid1',
                            name: 'afield',
                            label: 'Some Text',
                            value: '',
                            tag: 'extra things',
                            alt: 'Add some text here',
                            overtext: {},
                            required: true,
                            validatorClasses: 'minLength:5 maxLength:15'
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 1',
                            name: 'radioGroup',
                            value: 'another thing',
                            required: true
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 2',
                            name: 'radioGroup',
                            checked: true,
                            value: 'one more thing'
                        })
                )).addTo('test-field');
                var toolbar = new Jx.Toolbar.Container().add(
                        new Jx.Toolbar().add(
                                new Jx.Button({
                                    label: 'Submit',
                                    onClick: function(obj,evt){ clickMethod(form); }
                                }),
                                new Jx.Button({
                                    label: 'Reset',
                                    onClick: form.reset.bind(form)
                                }),
                                new Jx.Button({
                                    label: 'Cancel',
                                    onClick: function(){ alert('Cancel clicked!');}
                                })
                        )
                ).addTo(form);
                form.enableValidation();
            },
            body: "",
            post: function(){
                
                
            }
        }
        
    ],
    "otherScripts": ["text","OverText","checkbox","hidden","radio","select","textarea","fieldset","toolbar.item","container","FormValidator.Extras","tooltip"]
}
