/*
---

name: Jx.Panel.FileUpload

description: A panel subclass that is designed to be a multiple file upload panel with a queue listing.

license: MIT-style license.

requires:
 - Jx.Panel
 - Jx.ListView
 - Jx.Field.File
 - Jx.Progressbar
 - Jx.Button
 - Jx.Toolbar.Item
 - Jx.Tooltip

provides: [Jx.Panel.FileUpload]

css:
 - upload

images:
 - icons.png
...
 */
// $Id$
/**
 * Class: Jx.Panel.FileUpload
 *
 * Extends: <Jx.Panel>
 *
 * This class extends Jx.Panel to provide a consistent interface for uploading
 * files in an application.
 * 
 * Locale Keys:
 * - upload.buttonText
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel.FileUpload = new Class({

    Extends: Jx.Panel,
    Family: 'Jx.Panel.FileUpload',
    Binds: ['moveToQueue','fileUploadBegin', 'fileUploadComplete','allUploadsComplete', 'fileUploadProgressError,', 'fileUploadError', 'fileUploadProgress'],

    options: {
        /**
         * Option: file
         * An object containing the options for Jx.Field.File
         */
        file: {
            autoUpload: false,
            progress: false,
            progressIDUrl: '',
            handlerUrl: '',
            progressUrl: ''
        },

        progressOptions: {
            template: "<li class='jxListItemContainer jxProgressBar-container' id='{id}'><div class='jxProgressBar'><div class='jxProgressBar-outline'></div><div class='jxProgressBar-fill'></div><div class='jxProgressBar-text'></div></div></li>",
            containerClass: 'progress-container',
            messageText: null,
            messageClass: 'progress-message',
            progressText: 'Uploading {filename}',
            progressClass: 'progress-bar'
        },
        /**
         * Option: onFileComplete
         * An event handler that is called when a file has been uploaded
         */
        onFileComplete: function(){},
        /**
         * Option: onComplete
         * An event handler that is called when all files have been uploaded
         */
        onComplete: function(){},
        /**
         * Option: prompt
         * The prompt to display at the top of the panel - before the
         * file input
         */
        prompt: null,
        /**
         * Option: removeOnComplete
         * Determines whether a file is removed from the queue after uploading
         */
        removeOnComplete: false
    },
    /**
     * Property: domObjA
     * An HTML Element used to hold the interface while it is being
     * constructed.
     */
    domObjA: null,
    /**
     * Property: fileQueue
     * An array holding Jx.Field.File elements that are to be uploaded
     */
    fileQueue: [],

    listTemplate: "<li class='jxListItemContainer' id='{id}'><a class='jxListItem' href='javascript:void(0);'><span class='itemLabel jxUploadFileName'>{name}</span><span class='jxUploadFileDelete' title='Remove this file from the queue.'></span></a></li>",
    /**
     * Method: render
     * Sets up the upload panel.
     */
    render: function () {
        //first create panel content
        this.domObjA = new Element('div', {'class' : 'jxFileUploadPanel'});


        if (this.options.prompt != undefined && this.options.prompt != null) {
            var desc;
            if (Jx.type(this.options.prompt === 'string')) {
                desc = new Element('p', {
                    html: this.options.prompt
                });
            } else {
                desc = this.options.prompt;
            }
            desc.inject(this.domObjA);
        }

        //add the file field
        this.fileOpt = this.options.file;
        this.fileOpt.template = '<div class="jxInputContainer jxFileInputs"><input class="jxInputFile" type="file" name={name} /></div>';

        this.file = new Jx.Field.File(this.fileOpt);
        this.file.addEvent('fileSelected', this.moveToQueue);
        this.file.addTo(this.domObjA);

        this.listView = new Jx.ListView({
            template: '<ul class="jxListView jxList jxUploadQueue"></ul>'
            
        }).addTo(this.domObjA);

        if (!this.options.file.autoUpload) {
            //this is the upload button at the bottom of the panel.
            this.uploadBtn = new Jx.Button({
                label : this.getText({set:'Jx',key:'upload',value:'buttonText'}),
                onClick: this.upload.bind(this)
            });
            var tlb = new Jx.Toolbar({position: 'bottom', scroll: false}).add(this.uploadBtn);
            this.uploadBtn.setEnabled(false);
            this.options.toolbars = [tlb];
        }
        //then pass it on to the Panel constructor
        this.options.content = this.domObjA;
        this.parent(this.options);
    },
    /**
     * Method: moveToQueue
     * Called by Jx.Field.File's fileSelected event. Moves the selected file
     * into the upload queue.
     */
    moveToQueue: function (filename) {
        var theTemplate = new String(this.listTemplate).substitute({
            name: filename,
            id: filename
        });
        var item = new Jx.ListItem({template:theTemplate, enabled: true});

        $(item).getElement('.jxUploadFileDelete').addEvent('click', function(){
            this.listView.remove(item);
            this.file.remove(filename);
            if (this.listView.list.count() == 0) {
                this.uploadBtn.setEnabled(false);
            }
        }.bind(this));
        this.listView.add(item);

        if (!this.uploadBtn.isEnabled()) {
            this.uploadBtn.setEnabled(true);
        }

    },
    /**
     * Method: upload
     * Called when the user clicks the upload button. Runs the upload process.
     */
    upload: function () {

        this.file.addEvents({
            'fileUploadBegin': this.fileUploadBegin ,
            'fileUploadComplete': this.fileUploadComplete,
            'allUploadsComplete': this.allUploadsComplete,
            'fileUploadError': this.fileUploadError,
            'fileUploadProgress': this.fileUploadProgress,
            'fileUploadProgressError': this.fileUploadError
        });


        this.file.upload();
    },

    fileUploadBegin: function (filename) {
        if (this.options.file.progress) {
            //progressbar
            //setup options
            // TODO: should (at least some of) these options be available to
            // the developer?
            var options = Object.merge({},this.options.progressOptions);
            options.progressText = options.progressText.substitute({filename: filename});
            options.template = options.template.substitute({id: filename});
            this.pb = new Jx.Progressbar(options);
            var item = document.id(filename);
            this.oldContents = item;
            this.listView.replace(item,$(this.pb));
        } else {
            var icon = document.id(filename).getElement('.jxUploadFileDelete')
            icon.addClass('jxUploadFileProgress').set('title','File Uploading...');
        }
    },

    /**
     * Method: fileUploadComplete
     * Called when a single file is uploaded completely .
     *
     * Parameters:
     * data - the data returned from the event
     * filename - the filename of the file we're tracking
     */
    fileUploadComplete: function (data, file) {
        if (data.success != undefined && data.success != null && data.success ){
            this.removeUploadedFile(file);
        } else {
            this.fileUploadError(data, file);
        }
    },
    /**
     * Method: fileUploadError
     * Called when there is an error uploading a file.
     *
     * Parameters:
     * data - the data passed back from the server, if any.
     * file - the file we're tracking
     */
    fileUploadError: function (data, filename) {

        if (this.options.file.progress) {
            //show this old contents...
            this.listView.replace(document.id(filename),this.oldContents);
        }
        var icon = document.id(filename).getElement('.jxUploadFileDelete');
        icon.erase('title');
        if (icon.hasClass('jxUploadFileProgress')) {
            icon.removeClass('jxUploadFileProgress').addClass('jxUploadFileError');
        } else {
            icon.addClass('jxUploadFileError');
        }
        if (data.error !== undefined && data.error !== null && data.error.message !== undefined && data.error.message !== null) {
            var tt = new Jx.Tooltip(icon, data.error.message, {
                cssClass : 'jxUploadFileErrorTip'
            });
        }
    },
    /**
     * Method: removeUploadedFile
     * Removes the passed file from the upload queue upon it's completion.
     *
     * Parameters:
     * file - the file we're tracking
     */
    removeUploadedFile: function (filename) {

        if (this.options.removeOnComplete) {
           this.listView.remove(document.id(filename));
        } else {
            if (this.options.file.progress) {
                this.listView.replace(document.id(filename),this.oldContents);
            }
            var l = document.id(filename).getElement('.jxUploadFileDelete');
            if (l.hasClass('jxUploadFileDelete')) {
                l.addClass('jxUploadFileComplete');
            } else if (l.hasClass('jxUploadFileProgress')) {
                l.removeClass('jxUploadFileProgress').addClass('jxUploadFileComplete');
            }
        }

        this.fireEvent('fileUploadComplete', filename);
    },
    /**
     * Method: fileUploadProgress
     * Function to pass progress information to the progressbar instance
     * in the file. Only used if we're tracking progress.
     */
    fileUploadProgress: function (data, file) {
        if (this.options.progress) {
            this.pb.update(data.total, data.current);
        }
    },
    /**
     * Method: allUploadCompleted
     * Called when the Jx.Field.File completes uploading
     * all files. Sets upload button to disabled and fires the allUploadCompleted
     * event.
     */
    allUploadsComplete: function () {
        this.uploadBtn.setEnabled(false);
        this.fireEvent('allUploadsCompleted',this);
    },
    /**
     * Method: createText
     * handle change in language
     */
    changeText: function (lang) {
      this.parent();
      if (this.uploadBtn != undefined && this.uploadBtn != null) {
        this.uploadBtn.setLabel({set:'Jx',key:'upload',value:'buttonText'});
      }
    }
});
