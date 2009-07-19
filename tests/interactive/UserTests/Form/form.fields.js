{
    "tests": [
        {
            title: "Form Field Tests - Text Field",
            description: "This test is to verify that a text field displays properly. You can change properties in the box below (drag to open it to see more) and click \"Run Test\" to see your changes. Try different combinations before marking this one as passing.",
            verify: "Did the field render properly?",
            before: function(){
                document.id('test-field').empty();
            },
            body: "var opts = {" +
                    "\nname: 'test'," +
                    "\nid: 'test'," +
                    "\nlabel: 'Test Label'," +
                    "\nvalue: 'some value'," +
                    "\nlabelSeparator: ':'," +
                    "\ntag: 'This is some stuff for the tag <a href=\"jxlib.org\">visit jxlib</a>'," +
                    "\ntip: 'A value goes here'," +
                    "\ncontainerClass: 'my-textfield-container'," +
                    "\nfieldClass: 'my-textfield-input'," +
                    "\nlabelClass: 'my-textfield-label'," +
                    "\ntagClass: 'my-textfield-tag'," +
                    "\nvalidatorClasses: 'required minlength:8 maxlength:20'," +
                    "\noverText: null," +
                    "\nrequired: true," +
                    "\nrequiredText: '*'," +
                    "\nreadonly: false," +
                    "\ndisabled: false" +
                "}",
            post: function(){
                var field = new Jx.Field.Text(opts);
                field.addTo('test-field');
            }
        },{
            title: "Form Field Tests - Checkbox Field",
            description: "This test is to verify that a checkox field displays properly. You can change properties in the box below (drag to open it to see more) and click \"Run Test\" to see your changes. Try different combinations before marking this one as passing.",
            verify: "Did the field render properly (it should default as checked)?",
            before: function(){
                document.id('test-field').empty();
            },
            body: "var opts = {" +
                    "\nname: 'test'," +
                    "\nid: 'test'," +
                    "\nlabel: 'Test Label'," +
                    "\nvalue: 'some value'," +
                    "\ntag: 'This is some stuff for the tag <a href=\"jxlib.org\">visit jxlib</a>'," +
                    "\ntip: 'Check this box.'," +
                    "\ncontainerClass: 'my-textfield-container'," +
                    "\nfieldClass: 'my-textfield-input'," +
                    "\nlabelClass: 'my-textfield-label'," +
                    "\ntagClass: 'my-textfield-tag'," +
                    "\nvalidatorClasses: 'required minlength:8 maxlength:20'," +
                    "\nochecked: true," +
                    "\nrequired: true," +
                    "\nrequiredText: '*'," +
                    "\nreadonly: false," +
                    "\ndisabled: false" +
                "}",
            post: function(){
                var field = new Jx.Field.Checkbox(opts);
                field.addTo('test-field');
            }
        },{
            title: "Form Field Tests - Radio Field",
            description: "This test is to verify that a radio field displays properly. You can change properties in the box below (drag to open it to see more) and click \"Run Test\" to see your changes. Try different combinations before marking this one as passing.",
            verify: "Did the field render properly (it should be selected)?",
            before: function(){
                document.id('test-field').empty();
            },
            body: "var opts = {" +
                    "\nname: 'test'," +
                    "\nid: 'test'," +
                    "\nlabel: 'Test Label'," +
                    "\nvalue: 'some value'," +
                    "\ntag: 'This is some stuff for the tag <a href=\"jxlib.org\">visit jxlib</a>'," +
                    "\ntip: 'Select Me.'," +
                    "\ncontainerClass: 'my-textfield-container'," +
                    "\nfieldClass: 'my-textfield-input'," +
                    "\nlabelClass: 'my-textfield-label'," +
                    "\ntagClass: 'my-textfield-tag'," +
                    "\nvalidatorClasses: 'required minlength:8 maxlength:20'," +
                    "\nchecked: true," +
                    "\nrequired: true," +
                    "\nrequiredText: '*'," +
                    "\nreadonly: false," +
                    "\ndisabled: false" +
                "}",
            post: function(){
                var field = new Jx.Field.Radio(opts);
                field.addTo('test-field');
            }
        },{
            title: "Form Field Tests - Textarea Field",
            description: "This test is to verify that a textarea field displays properly. You can change properties in the box below (drag to open it to see more) and click \"Run Test\" to see your changes. Try different combinations before marking this one as passing.",
            verify: "Did the field render properly?",
            before: function(){
                document.id('test-field').empty();
            },
            body: "var opts = {" +
                    "\nname: 'test'," +
                    "\nid: 'test'," +
                    "\nlabel: 'Test Label'," +
                    "\nvalue: 'some value'," +
                    "\nlabelSeparator: ':'," +
                    "\ntag: 'This is some stuff for the tag <a href=\"jxlib.org\">visit jxlib</a>'," +
                    "\ntip: 'Type some text in the box.'," +
                    "\ncontainerClass: 'my-textfield-container'," +
                    "\nfieldClass: 'my-textfield-input'," +
                    "\nlabelClass: 'my-textfield-label'," +
                    "\ntagClass: 'my-textfield-tag'," +
                    "\nvalidatorClasses: 'required minlength:8 maxlength:20'," +
                    "\noverText: null," +
                    "\nrequired: true," +
                    "\nrequiredText: '*'," +
                    "\nreadonly: false," +
                    "\nrows: 10," +
                    "\ncolumns: 15," +
                    "\ndisabled: false" +
                "}",
            post: function(){
                var field = new Jx.Field.Textarea(opts);
                field.addTo('test-field');
            }
        },{
            title: "Form Field Tests - Hidden Field",
            description: "This test is to verify that a hidden field displays properly. You can change properties in the box below (drag to open it to see more) and click \"Run Test\" to see your changes. Try different combinations before marking this one as passing.",
            verify: "Did the field render properly?",
            before: function(){
                document.id('test-field').empty();
            },
            body: "var opts = {" +
                    "\nname: 'test'," +
                    "\nid: 'test'," +
                    "\nvalue: 'some value'," +
                    "\nfieldClass: 'my-textfield-input'" +
                "}",
            post: function(){
                var field = new Jx.Field.Hidden(opts);
                field.addTo('test-field');
            }
        },{
            title: "Form Field Tests - Select Field",
            description: "This test is to verify that a select field displays properly. You can change properties in the box below (drag to open it to see more) and click \"Run Test\" to see your changes. Try different combinations before marking this one as passing.",
            verify: "Did the field render properly?",
            before: function(){
                document.id('test-field').empty();
            },
            body: "var opts = {" +
                    "\nname: 'test'," +
                    "\nid: 'test'," +
                    "\nlabel: 'Test Label'," +
                    "\nvalue: 'some value'," +
                    "\nlabelSeparator: ':'," +
                    "\ntag: 'This is some stuff for the tag <a href=\"jxlib.org\">visit jxlib</a>'," +
                    "\ntip: 'A value goes here'," +
                    "\ncontainerClass: 'my-textfield-container'," +
                    "\nfieldClass: 'my-textfield-input'," +
                    "\nlabelClass: 'my-textfield-label'," +
                    "\ntagClass: 'my-textfield-tag'," +
                    "\nvalidatorClasses: 'required minlength:8 maxlength:20'," +
                    "\noverText: null," +
                    "\nrequired: true," +
                    "\nrequiredText: '*'," +
                    "\nreadonly: false," +
                    "\ndisabled: false," +
                    "\ncomboOpts: [{" +
                    "\n    value: 'opt1'," +
                    "\n    text: 'Option #1'," +
                    "\n    selected: false" +
                    "\n},{" +
                    "\n    value: 'opt2'," +
                    "\n    text: 'Option #2'," +
                    "\n    selected: true" +
                    "\n},{" +
                    "\n    value: 'opt3'," +
                    "\n    text: 'Option #3'," +
                    "\n    selected: false" +
                    "\n}]" +
                "}",
            post: function(){
                var field = new Jx.Field.Select(opts);
                field.addTo('test-field');
            }
        }
        
    ],
    "otherScripts": ["text","OverText","checkbox","hidden","radio","select","textarea"]
}
