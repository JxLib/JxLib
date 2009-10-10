{
    "tests": [
        {
            title: "File Upload Panel - submit without progress",
            description: "This test uses the base upload (without noting progress). You should see the icon change on each file indicating the upload and receive an alert when they are all uploaded.",
            verify: "Did everything work correctly?",
            before: function(){
                $('test-field').empty();
                
                var uploadPanel  = new Jx.Panel.FileUpload({
                    label: 'Upload File Test',
                    file: {
                        progress: false,
                        handlerUrl: 'UserTests/Form/upload.php',
                        id: 'file-upload-test',
                        name: 'file-upload-test',
                        label: 'File to Upload',
                        debug: true
                    },
                    prompt: 'Choose some files to upload',
                    onFileComplete: function(file){
                        alert("File " + file.getFileName() + " Uploaded.");
                    },
                    onComplete: function() {
                        alert("All Files Uploaded.");
                    }
                });
                uploadPanel.addTo('test-field');
                uploadPanel.domObj.resize();
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "File Field - submit with progress",
            description: "This test will test the progress tracking code. It requires APC to run correctly (or a compatible library w/changes to the server code). If you have APC enabled then run the test. Otherwise, skip it.",
            verify: "Did it work correctly?",
            before: function(){
                $('test-field').empty();
                var uploadPanel  = new Jx.Panel.FileUpload({
                    label: 'Upload File Test',
                    file: {
                        progress: true,
                        handlerUrl: 'UserTests/Form/upload.php',
                        progressUrl: 'UserTests/Form/progress.php',
                        progressIDUrl: 'UserTests/Form/progress-id.php',
                        id: 'file-upload-test',
                        name: 'file-upload-test',
                        label: 'File to Upload'
                    },
                    prompt: 'Choose some files to upload',
                    onFileComplete: function(file){
                        alert("File " + file.getFileName() + " Uploaded.");
                    },
                    onComplete: function() {
                        alert("All Files Uploaded.");
                    }
                });
                uploadPanel.addTo('test-field');
                uploadPanel.domObj.resize();
                
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    "otherScripts": ["file"]
}
