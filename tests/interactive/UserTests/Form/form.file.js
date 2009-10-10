{
    "tests": [
        {
            title: "File Field - base rendering",
            description: "This test is to verify that a file field displays properly. This uses all of the defaults. You should be able to choose a file and it should show the file name in the text box.",
            verify: "Did the field render properly and did the name show up when you chose a file?",
            before: function(){
                $('test-field').empty();
                var file = new Jx.Field.File();
                file.addTo('test-field');
            },
            body: "",
            post: function(){
            }
        },{
            title: "File Field - submit without progress",
            description: "This test uses the base upload (without noting progress). You should see messages show up for each event received.",
            verify: "Did the messages show up?",
            before: function(){
                $('test-field').empty();
                var file = new Jx.Field.File({
                    progress: false,
                    handlerUrl: 'UserTests/Form/upload.php',
                    onUploadComplete: function(){
                       new Element('p',{ 
                           html: 'Upload Completed!'
                       }).inject(document.body);
                    },
                    onFileSelected: function(){
                        new Element('p',{ 
                            html: 'File Selected.'
                        }).inject(document.body);
                    },
                    onUploadBegin: function(){
                        new Element('p',{ 
                            html: 'Upload Beginning...'
                        }).inject(document.body);
                    },
                    onUploadError: function(){
                        new Element('p',{ 
                            html: 'Upload Error.'
                        }).inject(document.body);
                    },
                    id: 'file-upload-test',
                    name: 'file-upload-test',
                    label: 'File to Upload'
                });
                file.addTo('test-field');
                var btn = new Jx.Button({
                    label: 'Upload',
                    onClick: function(){
                        file.upload();
                    }
                });
                btn.addTo('test-field');
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "File Field - submit with progress",
            description: "This test will test the progress tracking code. It requires APC to run correctly (or a compatible library w/changes to the server code). If you have APC enabled then run the test. Otherwise, skip it. If you're running the test locally it's possible that there will be no 'progress' messages because the upload will have completed to quickly. Use firebug to verify that progress.php was called and came back successfully.",
            verify: "Did you see all of the messages?",
            before: function(){
                $('test-field').empty();
                var file = new Jx.Field.File({
                    progress: true,
                    handlerUrl: 'UserTests/Form/upload.php',
                    progressUrl: 'UserTests/Form/progress.php',
                    progressIDUrl: 'UserTests/Form/progress-id.php',
                    debug: true,
                    onUploadComplete: function(){
                        new Element('p',{ 
                            html: 'Upload Completed!'
                        }).inject(document.body);
                    },
                    onFileSelected: function(){
                        new Element('p',{ 
                            html: 'File Selected.'
                        }).inject(document.body);
                    },
                    onUploadBegin: function(){
                        new Element('p',{ 
                            html: 'Upload Beginning...'
                        }).inject(document.body);
                    },
                    onUploadProgress: function(data){
                        new Element('p',{ 
                            html: 'Progress: total - ' + data.total + '  current - ' + data.current
                        }).inject(document.body);
                    },
                    onUploadError: function(){
                        new Element('p',{ 
                            html: 'Upload Error.'
                        }).inject(document.body);
                    },
                    id: 'file-upload-test',
                    name: 'file-upload-test',
                    label: 'File to Upload'
                });
                file.addTo('test-field');
                var btn = new Jx.Button({
                    label: 'Upload',
                    onClick: function(){
                        file.upload();
                    }
                });
                btn.addTo('test-field');
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    "otherScripts": ["file"]
}
