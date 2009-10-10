
/**
 * Class: Jx.Panel.FileUpload
 * 
 * Extends: <Jx.Panel>
 * 
 * This class extends Jx.Panel to provide a consistent interface for uploading
 * files in an application. 
 * 
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Panel.FileUpload = new Class({
    
    Extends: Jx.Panel,
    
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
        /**
         * Option: onFileUploadComplete
         * An event handler that is called when all files have been uploaded
         */
        onFileUploadComplete: $empty,
        /**
         * Option: prompt
         * The prompt to display at the top of the panel - before the 
         * file input
         */
        prompt: null,
        /**
         * Option: buttonText
         * The text to place onthe upload button
         */
        buttonText: 'Upload Files'
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
    /**
     * APIMethod: render
     * Sets up the upload panel.
     */
    render: function () {
        //first create panel content
        this.domObjA = new Element('div', {'class' : 'jxFileUploadPanel'});
        
        
        if ($defined(this.options.prompt)) {
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
        this.fileOpt.template = '<div class="jxFileInputs"><input class="jxInputFile" type="file" name={name} /></div>';
        
        this.currentFile = new Jx.Field.File(this.fileOpt);
        this.currentFile.addEvent('fileSelected', this.moveToQueue.bind(this));
        this.currentFile.addTo(this.domObjA);
        
        //now the 'queue' listing with delete button
        
        this.queueDiv = new Element('div', {
            'class': 'jxUploadQueue'
        });
        this.queueDiv.inject(this.domObjA);
        this.uploadBtn = new Jx.Button({
            label : this.options.buttonText,
            onClick: this.upload.bind(this)
        });
        var tlb = new Jx.Toolbar({position: 'bottom'}).add(this.uploadBtn);
        this.uploadBtn.setEnabled(false);
        this.options.toolbars = [tlb]; 
        //then pass it on to the Panel constructor 
        this.options.content = this.domObjA;
        this.parent(this.options);
    },
    /**
     * Method: moveToQueue
     * Called by Jx.Field.File's fileSelected event. Moves the selected file into the 
     * upload queue.
     */
    moveToQueue: function (file) {
        var cf = this.currentFile;
        var name = cf.getFileName();
        
        this.fileQueue.push(this.currentFile);
        
        this.currentFile = new Jx.Field.File(this.fileOpt);
        this.currentFile.addEvent('fileSelected', this.moveToQueue.bind(this));
        $(this.currentFile).replaces($(cf));
        
        //add to queue div
                
        cf.queuedDiv = new Element('div', {id : name});
        var s = new Element('span', {
            html : name,
            'class' : 'jxUploadFileName'
        });
        var del = new Element('span', {
            'class' : 'jxUploadFileDelete',
            title : 'Remove from queue'
        });
        
        del.addEvent('click', this.removeFromQueue.bind(this, cf));
        cf.queuedDiv.adopt(s, del);
        cf.queuedDiv.inject(this.queueDiv);
        if (!this.uploadBtn.isEnabled()) {
            this.uploadBtn.setEnabled(true);
        }
        
    },
    /**
     * Method: upload
     * Called when the user clicks the upload button. Runs the upload process.
     */
    upload: function () {
        var file = this.fileQueue.shift();
        if (this.options.file.progress) {
            file.addEvent('uploadProgress', this.fileUploadProgress.bind(this));
            file.addEvent('uploadComplete', this.fileUploadComplete.bind(this));
            
            //progressbar
            //setup options
            var options = {
                containerClass: 'progress-container',
                messageText: null,
                messageClass: 'progress-message',
                progressText: 'uploading ' + file.getFileName(),
                progressClass: 'progress-bar',
                bar: {
                    width: file.queuedDiv.getStyle('width').toInt(),
                    height: file.queuedDiv.getFirst().getStyle('height').toInt()
                },
                onComplete: this.removeUploadedFile.bind(this, file)
            };
            var pb = new Jx.Progressbar(options);
            file.pb = pb;
            $(pb).replaces(file.queuedDiv);
        } else {
            file.queuedDiv.getLast().removeClass('jxUploadFileDelete').addClass('jxUploadFileProgress');
            file.addEvent('uploadComplete', this.fileUploadComplete.bind(this));
        }
        file.upload();
    },
    /**
     * Method: fileUploadComplete
     * Called when a single file is uploaded completely (called by 
     * Jx.Field.File's uploadComplete event). Passes the information to the 
     * progressbar. This method is only used if we're tracking progress.
     * 
     * Parameters:
     * data - the data returned from the event
     * file - the file we're tracking
     */
    fileUploadComplete: function (data, file) {
        if ($defined(data.success) && data.success ){
            if ($defined(data.total)) {
                file.pb.update(data.total, data.current);
            } else {
                this.removeUploadedFile(file);
            }
        } 
    },
    /**
     * Method: removeUploadedFile
     * Removes the passed file from the upload queue upon it's completion.
     * 
     * Parameters:
     * file - the file we're tracking
     */
    removeUploadedFile: function (file) {
        if ($defined(file.pb)) {
            file.pb.destroy();
        }
        file.queuedDiv.dispose();
        var name = file.getFileName();
        this.fileQueue.erase(name);
        this.fireEvent('fileComplete', file);
        if (this.fileQueue.length > 0) {
            this.upload();
        } else {
            this.fireEvent('complete');
        }
    },
    /**
     * Method: fileUploadProgress
     * Function to pass progress information to the progressbar instance 
     * in the file. Only used if we're tracking progress.
     */
    fileUploadProgress: function (data, file) {
        file.pb.update(data.total, data.current);
    },
    /**
     * Method: removeFromQueue
     * Called when the delete icon is clicked for an individual file. It 
     * removes the file fro mthe queue, disposes of it, and does NOT upload 
     * the file to the server.
     * 
     * Pparameters:
     * file - the file we're getting rid of.
     */
    removeFromQueue: function (file) {
        var name = file.getFileName();
        //TODO: Should prompt the user to be sure - use Jx.Dialog.Confirm?
        $(name).destroy();
        this.fileQueue = this.fileQueue.erase(file);
        if (this.fileQueue.length === 0) {
            this.uploadBtn.setEnabled(false);
        }
    }
});
