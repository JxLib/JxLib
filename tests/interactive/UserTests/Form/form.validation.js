{
    "tests": [
        {
            title: "Field Validation Test -label text",
            description: "This test is to verify that the field validation works correctly. It should show the message in the label.",
            verify: "Did the field validation work properly?",
            before: function(){
                document.id('test-field').empty();
                
                var text = new Jx.Field.Text({
                    labelClass: 'grid2',
                    inputClass: 'grid3',
                    tagClass: 'grid1',
                    name: 'someText',
                    label: 'Some Text',
                    value: '',
                    tag: 'extra things',
                    required: true
                }).addTo('test-field');
                
                var messages = new Element('div');
                messages.inject('test-field');
                
                //add plugin here
                var plugin = new Jx.Plugin.Field.Validator({
                    validators: ['minLength:4','maxLength:10'],
                    showErrorMessages: 'label',
                    messageStyle: 'text',
                    displayError: 'all',
                    errorElement: null,
                    errorClass : 'jxFieldErrorText',
                    validateOnBlur: true,
                    validateOnChange: true
                });
                plugin.attach(text);
                
                plugin.addEvent('fieldValidationFailed', function(field, validator){
                    var p = new Element('p',{
                        html: field.id + ' failed validation. Errors:'
                    });
                    var ul = new Element('ul');
                    var errs = validator.getErrors();
                    errs.each(function(err){
                        var li = new Element('li',{
                            html: err
                        });
                        li.inject(ul);
                    });
                    messages.adopt(p,ul);
                });
                
                plugin.addEvent('fieldValidationPassed', function(field, validator){
                    var p = new Element('p',{
                        html: field.id + ' passed validation.'
                    });
                    messages.adopt(p);
                });
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Form Validation Tests - Messages in label",
            description: "Tests the form validation. This should show validation as icons on the fields w/tip.",
            verify: "Did the form validation work properly?",
            before: function(){
                document.id('test-field').empty();
                
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
                    action: 'something.php'
                });
                form.add(
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
                        id: 'afield'
                    }),
                    new Jx.Fieldset({
                        form: form,
                        legend: 'My Form 2',
                        fieldsetClass: 'anotherClass',
                        legendClass: 'myLegendClass',
                        id: 'myFieldset'
                    }).add(
                        new Jx.Field.Radio({
                            label: 'Radio 1',
                            name: 'radioGroup',
                            value: 'another thing'
                        }),
                        new Jx.Field.Radio({
                            label: 'Radio 2',
                            name: 'radioGroup',
                            value: 'one more thing',
                            id: 'radioGroup'
                        })
                )).addTo('test-field');
                var plugin = new Jx.Plugin.Form.Validator({
                    fields: {
                        afield: {
                            validators: ['minLength:5','maxLength:15']
                        }
                    },
                    fieldDefaults: {
                        validateOnBlur: true,
                        validateOnChange: true
                    },
                    validateOnSubmit: true,
                    suspendSubmit: false
                });
                plugin.attach(form);
                
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
                ).addTo('test-field');
                
                var messages = new Element('div');
                messages.inject('test-field');
                
                plugin.addEvents({
                    formValidationPassed: function (form, validator) {
                        var p = new Element('p',{
                            html: 'Form passed validation.'
                        });
                        messages.adopt(p);
                    },
                    formValidationFailed: function (form, validator) {
                        var p = new Element('p',{
                            html: 'Form failed validation.'
                        });
                        var ul = new Element('ul');
                        var errs = validator.getErrors();
                        errs.each(function(errList, field){
                            var li = new Element('li',{
                                html: field.id + ' has the following errors:'
                            });
                            var ul2 = new Element('ul');
                            ul2.inject(li);
                            errList.each(function(err){
                                var li2 = new Element('li',{
                                    html: err
                                });
                                li2.inject(ul);
                            });
                            li.inject(ul);
                        });
                        messages.adopt(p,ul);
                    },
                    fieldValidationPassed: function (field, validator) {
                        var p = new Element('p',{
                            html: field.id + ' passed validation.'
                        });
                        messages.adopt(p);
                    },
                    fieldValidationFailed: function (field, validator) {
                        var p = new Element('p',{
                            html: field.id + ' failed validation. Errors:'
                        });
                        var ul = new Element('ul');
                        var errs = validator.getErrors();
                        errs.each(function(err){
                            var li = new Element('li',{
                                html: err
                            });
                            li.inject(ul);
                        });
                        messages.adopt(p,ul);
                    }
                });
                
            },
            body: "",
            post: function(){
                
                
            }
        }
        
    ],
    "otherScripts": ["text","OverText","checkbox","hidden","radio","select","textarea","fieldset","toolbar.item","container","form.validator"]
}
