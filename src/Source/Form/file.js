/**
 * Class: Jx.Field.File
 * 
 * Extends: <Jx.Field>
 * 
 * This class is designed to work with an iFrame and APC upload progress.
 * APC is a php specific technology but any server side implementation that
 * works in the same manner should work. You can then wire this class to the 
 * progress bar class to show progress.
 * 
 * The other option is to not use progress tracking and just use the base 
 * upload which works through a hidden iFrame. In order to use this with Jx.Form
 * you'll need to add it normally but keep a reference to it. When you call 
 * Jx.Form.getValues() it will not return any file information. You can then 
 * call the Jx.Field.File.upload() method for each file input directly and
 * then submit the rest of the form via ajax.
 * 
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Field.File = new Class({
    
    Extends: Jx.Field,
    
    options: {
        /**
         * Option: template
         * The template used to render the field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><div class="jxFileInputs"><input class="jxInputFile" type="file" name="{name}" /></div><span class="jxInputTag"></span></span>',
        /**
         * Option: autoUpload
         * Whether to upload the file immediatelly upon selection
         */
        autoUpload: false,
        /**
         * Option: Progress
         * Whether to use the APC, or similar, progress method.
         */
        progress: false,
        /**
         * Option: progressIDUrl
         * The url to call in order to get the ID, or key, to use
         * with the APC upload process
         */
        progressIDUrl: '',
        /**
         * Option: progressName
         * The name to give the field that holds the generated progress ID retrieved
         * from the server. Defaults to 'APC_UPLOAD_PROGRESS' which is the default 
         * for APC.
         */
        progressName: 'APC_UPLOAD_PROGRESS',
        /**
         * Option: progressId
         * The id to give the form element that holds the generated progress ID 
         * retrieved from the server. Defaults to 'progress_key'. 
         */
        progressId: 'progress_key',
        /**
         * Option: handlerUrl
         * The url to send the file to.
         */
        handlerUrl: '',
        /**
         * Option: progressUrl
         * The url used to retrieve the upload prgress of the file.
         */
        progressUrl: '',
        /**
         * Option: debug
         * Defaults to false. If set to true it will prevent the hidden form
         * and IFrame from being destroyed at the end of the upload so it can be
         * inspected during development
         */
        debug: false,
        /**
         * Events
         */
        onUploadBegin: $empty,
        onUploadComplete: $empty,
        onUploadProgress: $empty,
        onUploadError: $empty,
        onFileSelected: $empty
        
    },
    /**
     * Property: type
     * The Field type used in rendering
     */
    type: 'File',
    /**
     * APIMethod: render
     * renders the file input
     */
    render: function () {
        this.parent();
        
        //add a unique ID if no id is defined
        if (!$defined(this.options.id)) {
            this.field.set('id', this.generateId());
        }
        
        //now, create the fake inputs
        this.fake = new Element('div', {
            'class' : 'jxFileFake'
        });
        this.text = new Jx.Field.Text({
            template : '<input class="jxInputText" type="text" />'
        });
        this.browseButton = new Jx.Button({
            label : 'Browse...'
        });
        
        
        this.fake.adopt(this.text, this.browseButton);
        this.field.grab(this.fake, 'after');
        
        this.field.addEvents({
            change : this.copyValue.bind(this),
            mouseout : this.copyValue.bind(this),
            mouseenter : this.mouseEnter.bind(this),
            mouseleave : this.mouseLeave.bind(this)
        });
        
    },
    /**
     * Method: copyValue
     * Called when the value in the actual file input changes and when
     * the mouse moves out of it to copy the value into the "fake" text box.
     */
    copyValue: function () {
        if (this.field.value !== '' && (this.text.field.value !== this.field.value)) {
            this.text.field.value = this.field.value;
            this.fireEvent('fileSelected', this);
        }
    },
    /**
     * Method: mouseEnter
     * Called when the mouse enters the actual file input to make the 
     * fake button highlight.
     */
    mouseEnter: function () {
        this.browseButton.domA.addClass('jxButtonPressed');
    },
    /**
     * Method: mouseLeave
     * called when the mouse leaves the actual file input to turn off
     * the highlight of the fake button.
     */
    mouseLeave: function () {
        this.browseButton.domA.removeClass('jxButtonPressed');
    },
    /**
     * APIMethod: upload
     * Call this to upload the file to the server
     */
    upload: function () {
        this.fireEvent('uploadBegin', this);
        //create the iframe
        this.iframe = new IFrame(null, {
            styles: {
                display: 'none'
            },
            
            name : this.generateId() 
        });
        this.iframe.inject(document.body);
            
        //load in the form
        this.form = new Jx.Form({
            action : this.options.handlerUrl,
            name : 'jxUploadForm',
            fileUpload: true
        });
        
        //iframeBody.grab(this.form);
        $(this.form).set('target', this.iframe.get('name')).setStyles({
            visibility: 'hidden',
            display: 'none'
        }).inject(document.body);
        
        
        //move the form input into it (cloneNode)
        $(this.form).grab(this.field.cloneNode(true));
        //if polling the server we need an APC_UPLOAD_PROGRESS id.
        //get it from the server.
        if (this.options.progress) {
            var req = new Request.JSON({
                url: this.options.progressIDUrl,
                method: 'get',
                onSuccess: this.submitUpload.bind(this)
            });
            req.send();
        } else {
            this.submitUpload();
        }
    },
    /**
     * Method: submitUpload
     * Called either after upload() or as a result of a successful call
     * to get a progress ID.
     * 
     * Parameters:
     * data - Optional. The data returned from the call for a progress ID. 
     */
    submitUpload: function (data) {
        //check for ID in data
        if ($defined(data) && data.success && $defined(data.id)) {
            this.progressID = data.id;
            //if have id, create hidden progress field
            var id = new Jx.Field.Hidden({
                name : this.options.progressName,
                id : this.options.progressId,
                value : this.progressID
            });
            id.addTo(this.form, 'top');
        }
        this.iframe.addEvent('load', this.processIFrameUpload.bind(this));
        
        
        //submit the form
        $(this.form).submit();
        //begin polling if needed
        if (this.options.progress && $defined(this.progressID)) {
            this.pollUpload();
        }
    },
    /**
     * Method: pollUpload
     * polls the server for upload progress information
     */
    pollUpload: function () {
        var d = { id : this.progressID };
        var r = new Request.JSON({
            data: d,
            url : this.options.progressUrl,
            method : 'get',
            onSuccess : this.processProgress.bind(this),
            onFailure : this.uploadFailure.bind(this)
        });
        r.send();
    },
    
    /**
     * Method: processProgress
     * process the data returned from the request
     * 
     * Parameters:
     * data - The data from the request as an object.
     */
    processProgress: function (data) {
        if ($defined(data)) {
            this.fireEvent('uploadProgress', [data, this]);
            if (data.current < data.total) {
                this.polling = true;
                this.pollUpload();
            } else {
                this.polling = false;
                if (this.done) {
                    this.uploadCleanUp();
                    this.fireEvent('uploadComplete', [this.doneData, this]);
                }
            }
        }
    },
    /**
     * Method: uploadFailure
     * called if there is a problem getting progress on the upload
     */
    uploadFailure: function (xhr) {
        this.fireEvent('uploadProgressError', this);
    },
    /**
     * Method: processIFrameUpload
     * Called if we are not using progress and the IFrame finished loading the
     * server response.
     */
    processIFrameUpload: function () {
        //the body text should be a JSON structure
        //get the body
        var iframeBody = this.iframe.contentDocument.defaultView.document.body.innerHTML;
        
        var data = JSON.decode(iframeBody);
        if ($defined(data.success) && data.success) {
            this.done = true;
            this.doneData = data;
            if (!this.polling) {
                this.uploadCleanUp();
                this.fireEvent('uploadComplete', [data, this]);
            }
        } else {
            this.fireEvent('uploadError', [data , this]);
        }
    },
    /**
     * Method: uploadCleanUp
     * Cleans up the hidden form and IFrame after a completed upload. Set 
     * this.options.debug to true to keep this from happening
     */
    uploadCleanUp: function () {
        if (!this.options.debug) {
            this.form.destroy();
            this.iframe.destroy();
        }
    },
    /**
     * APIMethod: getFileName
     * Allows caller to get the filename of the file we're uploading
     */
    getFileName: function () {
        var fn = this.field.get('value');
        return fn.slice(fn.lastIndexOf('/') + 1);
    },
    /**
     * Method: getExt
     * Returns the 3-letter extension of this file.
     */
    getExt: function () {
        var fn = this.getFileName();
        return fn.slice(fn.length - 3);
    }
});