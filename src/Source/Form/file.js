/*
---

name: Jx.Field.File

description: Represents a file input w/upload and progress tracking capabilities (requires APC for progress)

license: MIT-style license.

requires:
 - Jx.Field.Text
 - Jx.Button
 - Core/Request.JSON
 - Jx.Field.Hidden
 - Jx.Form

provides: [Jx.Field.File]

css:
 - file


...
 */
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
 * MooTools.lang Keys:
 * - file.browseLabel
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
         * Option: mode
         * determines whether this file field acts in single upload mode or
         * multiple file upload mode. The multiple upload mode was done to work with
         * Jx.Panel.FileUpload. When in multiple mode, this field will remove the actual
         * file control after a file is selected, fires an event to signify the selection but will
         * hold on to the files until told to upload them. Obviously 'multiple' mode isn't designed
         * to be used when the control is outside of the Upload Panel (unless the user designs
         * their own upload panel around it).
         */
        mode: 'single'

    },
    /**
     * Property: type
     * The Field type used in rendering
     */
    type: 'File',
    /**
     * Property: forms
     * holds all form references when we're in multiple mode
     */
    forms: null,

    init: function () {
        this.parent();

        this.forms = new Hash();
        //create the iframe
        //we use the same iFrame for each so we don't have to recreate it each time
        this.isIFrameSetup = true;
        this.iframe = new Element('iframe', {
          name: this.generateId(),
          styles: {
            'display':'none',
            'visibility':'hidden'
          }
        });
        // this.iframe = new IFrame(null, {
        //     styles: {
        //         'display':'none',
        //         'visibility':'hidden'
        //     },
        //     name : this.generateId()
        // });
        this.iframe.inject(document.body);
        this.iframe.addEvent('load', this.processIFrameUpload.bind(this));

    },

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
            template : '<span class="jxInputContainer"><input class="jxInputText" type="text" /></span>'
        });
        this.browseButton = new Jx.Button({
            label: this.getText({set:'Jx',key:'file',value:'browseLabel'})
        });

        this.fake.adopt(this.text, this.browseButton);
        this.field.grab(this.fake, 'after');

        this.field.addEvents({
            change : this.copyValue.bind(this),
            //mouseout : this.copyValue.bind(this),
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
        if (this.options.mode=='single' && this.field.value !== '' && (this.text.field.value !== this.field.value)) {
            this.text.field.value = this.field.value;
            this.fireEvent('fileSelected', this);
            this.forms.set(this.field.value, this.prepForm());
            if (this.options.autoUpload) {
                this.uploadSingle();
            }
        } else if (this.options.mode=='multiple') {
            var filename = this.field.value;
            var form = this.prepForm();
            this.forms.set(filename, form);
            this.text.setValue('');
            //fire the selected event.
            this.fireEvent('fileSelected', filename);
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

    prepForm: function () {
        //load in the form
        var form = new Jx.Form({
            action : this.options.handlerUrl,
            name : 'jxUploadForm',
            fileUpload: true
        });

        //move the form input into it (cloneNode)
        var parent = document.id(this.field.getParent());
        var sibling = document.id(this.field).getPrevious();
        var clone = this.field.clone().cloneEvents(this.field);
        document.id(form).grab(this.field);
        // tried clone.replaces(this.field) but it didn't seem to work
        if (sibling) {
          clone.inject(sibling, 'after');
        } else if (parent) {
            clone.inject(parent, 'top');
        }
        this.field = clone;

        this.mouseLeave();

        return form;
    },

    upload: function (externalForm) {
        //do we have files to upload?
        if (this.forms.getLength() > 0) {
            var keys = this.forms.getKeys();
            this.currentKey = keys[0];
            var form = this.forms.get(this.currentKey);
            this.forms.erase(this.currentKey);
            if ($defined(externalForm) && this.forms.getLength() == 0) {
                var fields = externalForm.fields;
                fields.each(function(field){
                    if (!(field instanceof Jx.Field.File)) {
                        document.id(field).clone().inject(form);
                    }
                },this);
            }
            this.uploadSingle(form);
        } else {
            //fire finished event...
            this.fireEvent('allUploadsComplete', this);
        }
    },
    /**
     * APIMethod: uploadSingle
     * Call this to upload the file to the server
     */
    uploadSingle: function (form) {
        this.form = $defined(form) ? form : this.prepForm();

        this.fireEvent('fileUploadBegin', [this.currentKey, this]);

        this.text.setValue('');

        document.id(this.form).set('target', this.iframe.get('name')).setStyles({
            visibility: 'hidden',
            display: 'none'
        }).inject(document.body);

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

        //submit the form
        document.id(this.form).submit();
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
            this.fireEvent('fileUploadProgress', [data, this.currentKey, this]);
            if (data.current < data.total) {
                this.polling = true;
                this.pollUpload();
            } else {
                this.polling = false;
            }
        }
    },
    /**
     * Method: uploadFailure
     * called if there is a problem getting progress on the upload
     */
    uploadFailure: function (xhr) {
        this.fireEvent('fileUploadProgressError', [this, xhr]);
    },
    /**
     * Method: processIFrameUpload
     * Called if we are not using progress and the IFrame finished loading the
     * server response.
     */
    processIFrameUpload: function () {
        //the body text should be a JSON structure
        //get the body
        if (this.isIFrameSetup) {
            if (this.iframe.contentDocument  && this.iframe.contentDocument.defaultView) {
              var iframeBody = this.iframe.contentDocument.defaultView.document.body.innerHTML;
            } else {
              // seems to be needed for ie7
              var iframeBody = this.iframe.contentWindow.document.body.innerHTML;
            }

            var data = JSON.decode(iframeBody);
            if ($defined(data) && $defined(data.success) && data.success) {
                this.done = true;
                this.doneData = data;
                this.uploadCleanUp();
                this.fireEvent('fileUploadComplete', [data, this.currentKey, this]);
            } else {
                this.fireEvent('fileUploadError', [data , this.currentKey, this]);
            }

            if (this.options.mode == 'multiple') {
                this.upload();
            } else {
                this.fireEvent('allUploadsComplete', this);
            }
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
        }
    },
    /**
     * APIMethod: remove
     * Removes a file from the hash of forms to upload.
     *
     * Parameters:
     * filename - the filename indicating which file to remove.
     */
    remove: function (filename) {
        if (this.forms.has(filename)) {
            this.forms.erase(filename);
        }
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
    	this.parent();
    	if ($defined(this.browseButton)) {
    		this.browseButton.setLabel( this.getText({set:'Jx',key:'file',value:'browseLabel'}) );
    	}
    },
    
    /**
     * APIMethod: getFileInputs
     * Used to get an array of all of the basic file inputs. This is mainly 
     * here for use by Jx.Form to be able to suck in the file inputs
     * before a standard submit.
     * 
     */
    getFileInputs: function () {
        var inputs = [];
        this.forms.each(function(form){
            var input = document.id(form).getElement('input[type=file]');
            inputs.push(input);
        },this);
        return inputs;
    }
});