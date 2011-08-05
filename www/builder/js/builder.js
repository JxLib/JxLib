/**
 * Class: builder
 * Provides functionality for the jxlib.org download builder
 * 
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
var builder = new Class({
	
    Implements: [Options, Events],
    
	checked: [],
	deps: null,
	includeOpts: false,
	checkedOpts: [],
	fileCount: new Hash(),
	buildChoice: new Hash(),

	initialize: function(options){
	
        this.setOptions(options);
        
		this.loading = true;
		
		$$('.filelist', 
			'#moo-core .files',
			'#moo-core .library-selector',
			'#moo-more .files',
			'#moo-more .library-selector',
			'#build',
			'#compression').each(function(el){
				var slider = new Jx.Slider({
					elem: el
				});
				slider.slide('out');
			},this);
		
		$('mootools-core').addEvent('click',this.showSelector.bind(this, [$("core-selector"),$("mootools-core"),$("core-deps")]));
		$('mootools-more').addEvent('click',this.showSelector.bind(this, [$("more-selector"),$("mootools-more"),$("more-deps")]));
		$('more-deps').addEvent('click',this.showFiles.bind(this,"more-files"));
		$('core-deps').addEvent('click',this.showFiles.bind(this,"core-files"));
		$('core-full').addEvent('click',this.hideFiles.bind(this,"core-files"));
		$('more-full').addEvent('click',this.hideFiles.bind(this,"more-files"));
		
		
		//get json file of dependencies
		var req = new Request.JSON({
			url: 'work/deps.json',
			onComplete: this.processDeps.bind(this)
		}).send();
		
		//setup the dependency checking
		$$('.dep').each(function(dep){
			$(dep).addEvent('click',function(event){
                this.check(event,dep)
            }.bind(this);
		},this);
		$('opt-deps').addEvent('click',this.optsCheck.bind(this));
		
		//add hover and click for files
		$$('.file').each(function(el){
			el = $(el);
			el.addEvents({
				'mouseenter': function(){
					el.addClass('hover');
				},	
				'mouseleave': function(){
					el.removeClass('hover');
				},
				'click': this.handleFileClick.bind(this,el)
			});
		},this);
		
		$$('.folder','.toggle').each(function(el){
			el = $(el);
			el.addEvents({
				'mouseenter': function(){
					el.addClass('hover');
				},	
				'mouseleave': function(){
					el.removeClass('hover');
				},
				'click': this.handleToggleClick.bind(this,el)
			});
			if (el.hasClass('folder')){
				var numFiles = el.getNext().getChildren().length;
				var id = el.get('id');
				// if (id.contains('jxlib')){
				//                  numFiles--;
				//              }
				var obj = {count: numFiles, checked: 0};
				this.fileCount.set(id,obj);
			}
		},this);
		
		//select all/select none links
		$$('.all').each(function(el){
			$(el).addEvent('click',function(event){
                this.select(event,el,true);
			}.bind(this));
		},this);
		$$('.none').each(function(el){
			$(el).addEvent('click',function(event){
                this.select(event,el,true);
    		}.bind(this));
		},this);
		
		//options radio buttons
		$$('#build div input').each(function(el){
			el = $(el);
			this.buildChoice.set(el.get('value'),el.get('checked'));
			el.addEvent('click',(function(){
				this.buildChoice.set(el.get('value'),el.get('checked'));
				this.setBuildText();
			}).bind(this));
		},this);
		$$('#j-compress div input').each(function(el){
			el = $(el);
			el.addEvent('click',function(){
				var choice = el.getNext().getFirst();
				$('js-choice').set('html',choice.get('html'));
			});
		},this);
		$$('#f-compress div input').each(function(el){
			el = $(el);
			el.addEvent('click',function(){
				var choice = el.getNext().getFirst();
				$('file-choice').set('html',choice.get('html'));
			});
		},this);
		
		//build and compress select links
		$('build-all').addEvent('click',(function(ev){
			var el = $(ev.target);
			this.setBuildChoices(el,true);
			this.setBuildText();
		}).bind(this));
		
		$('build-default').addEvent('click',(function(ev){
			var el = $(ev.target);
			this.setBuildChoices(el,false);
			$('build-jxlib').set('checked', true);
			$('build-jxlib-uncompressed').set('checked', true);
			this.buildChoice.set('jxlib',true);
			this.buildChoice.set('jxlib.compressed',true);
			this.setBuildText();
		}).bind(this));
		
		$('build-none').addEvent('click',(function(ev){
			var el = $(ev.target);
			this.setBuildChoices(el,false);
			this.setBuildText();
		}).bind(this));
		
		//add download button
		this.button = new Jx.Button({
			label: 'Download',
			image: 'img/script_save.png',
			tooltip: 'Download JxLib', 
            onClick: this.download.bind(this)
		}).addTo('download');
		
		this.loading = false;
	},
	
	setProfile: function(profile){
		if (profile == undefined) { return; }
		
		if (Jx.type(profile) !== 'hash') {
			profile = new Hash(profile);
		}
		//go through the profile obj and set all of the appropriate stuff
		if (profile.has('mootools-core')){
			$('mootools-core').set('checked',profile.get('mootools-core'));
			this.showSelector([$("core-selector"),$("mootools-core"),$("core-deps")]);
			if (profile.has('core')){
				switch (profile.get('core')) {
					case 'full':
						$('core-full').set('checked',true);
						break;
					case 'deps':
						$('core-deps').set('checked',true);
						break;
				}
				this.showFiles('core-files');
			}
		}
		if (profile.has('mootools-more')){
			$('mootools-more').set('checked',profile.get('mootools-more'));
			this.showSelector([$("more-selector"),$("mootools-more"),$("more-deps")]);
			if (profile.has('more')){
				switch (profile.get('more')) {
					case 'full':
						$('more-full').set('checked',true);
						break;
					case 'deps':
						$('more-deps').set('checked',true);
						break;
				}
				this.showFiles('more-files');
			}
		}
		if (profile.has('build')){
			profile.get('build').each(function(key){
				key = key.replace(/\./g,'-');
				this.setBuildChoices($('build-'+key),true);
			},this);
			this.setBuildText();
		}
		if (profile.has('files')){
			profile.get('files').each(function(key){
				$(key).set('checked',true);
				this.check(null,key);
			},this);
		}
		if (profile.has('opt-deps')){
			$('opt-deps').set('checked',profile.get('opt-deps'));
			this.optsCheck(null,'opt-deps');
		}
		if (profile.has('j-compress')){
			var el = $(profile.get('j-compress')); 
			el.set('checked',true);
			var choice = el.getNext().getFirst();
			$('js-choice').set('html',choice.get('html'));
		}
		if (profile.has('f-compress')){
			el = $(profile.get('f-compress')); 
			el.set('checked',true);
			choice = el.getNext().getFirst();
			$('file-choice').set('html',choice.get('html'));
		}
	},
	
	setBuildChoices: function(el,flag){
		el = $(el);
		var divs = el.getParent().getAllNext('div');
		divs.each(function(el){
			var i = el.getFirst();
			i.set('checked',flag);
			this.buildChoice.set(i.get('value'),flag);
		},this);
	},
	
	setBuildText: function(){
		var text = '';
		this.buildChoice.each(function(value, key){
			if (value === true){
				if (text === '') {
					text = key;
				} else {
					text = text + ", " + key;
				}
			}
		},this);
		$('build-choice').set('html', text);
	},
	
	select: function(ev,el,flag){
		if (ev != undefined){
			ev.stopPropagation();
		}
		el = $(el);
		//c = el.getParent().getParent().getParent().getNext().getChildren();
		var c = el.getParent('.folder').getNext().getChildren();
		//c.shift();
		c.each(function(elem){
			var check = $(elem).getFirst().getFirst();
			check.set('checked',flag);
			var id = check.get('id');
			this.checkSection(id);
			this.dependencyCheck(id);
		},this);
	},
	
	showSelector: function(arr) {
        var el = arr[0],
            origin = arr[1],
            selector = arr[2];
		var files;
		if (origin.get('checked')){
			el.retrieve('slider').slide('in');
			if (selector.get('checked')){
				files = el.getNext();
				files.retrieve('slider').slide('in');
			}
		} else {
			files = el.getNext();
			if (files.getStyle('height') === 'auto'){
				files.retrieve('slider').slide('out');
			}
			if (el.getStyle('height') === 'auto') {
				el.retrieve('slider').slide('out');
			}
		}
		
	},
	
	showFiles: function(el){
		el = $(el);
		if (el.getStyle('height').toInt() === 0) {
			$(el).retrieve('slider').slide('in');
		}
	},
	
	hideFiles: function(el){
		el = $(el);
		if (el.getStyle('height') === 'auto') {
			$(el).retrieve('slider').slide('out');
		}
	},
	
	processDeps:function(deps){
		this.deps = new Hash(deps);
		this.fireEvent('depsLoaded');
	},
	
	check: function(e,el){
		var dep;
		if (e != undefined){
			e.stopPropagation();
			el = $(e.target);
		} else if (el != undefined){
			el = $(el);
		} else {
			return;
		}
		dep = el.get('id');
		this.checkSection(dep);
		this.dependencyCheck(el);
	},
	
	dependencyCheck: function(el){
		el = $(el);
		var id = el.get('id');
		this.checked.push(id);
		var add = el.get('checked');
		if (add){
			var deps = (this.deps.get(id)).deps;
			this.addDeps(deps);
		} else {
			this.removeDeps(id);
		}
	},
	
	addDeps: function(deps){
		deps.each(function(dep){
			if (!this.checked.contains(dep)){
				$(dep).set('checked',true);
				this.checked.push(dep);
				this.checkSection(dep);
				var d = this.deps.get(dep);
				var newDeps = d.deps;
				if (this.includeOpts && d.opt != undefined){
					this.addDeps(d.opt);
				}
				if (newDeps[0].toLowerCase() !== 'none' && dep.toLowerCase() !== 'core'){
					this.addDeps(newDeps);
				}
			}
		},this);
	},
	
	removeDeps: function(dep){
		//work through the deps looking for items that list this id
		//as a dependency and remove them.
		this.checked.erase(dep);
		this.deps.each(function(obj,key){
			if (this.checked.contains(key)){
				if (obj.deps.contains(dep)){
					$(key).set('checked',false);
					this.checkSection(key);
					//work through on this dep
					this.removeDeps(key);
				}
			}
		},this);
	},
	
	optsCheck: function(e,el){
		if (e != undefined){
			el = $(e.target);
		} else if (el != undefined){
			el = $(el);
		} else {
			return;
		}
		
		this.includeOpts = el.get('checked');
		if (this.includeOpts){
			//loop through the already checked files and add optional dependencies
			//if they aren't already checked
			this.checked.each(function(dep){
				var d = this.deps.get(dep);
				if (d.opt != undefined){
					this.addOpts(d.opt);
				} 
			},this);
		} else {
			this.removeOpts();
		}
	},
	
	addOpts: function(deps){
		deps.each(function(dep){
			if (!this.checked.contains(dep) && !this.checkedOpts.contains(dep)){
				this.checkedOpts.push(dep);
				$(dep).set('checked',true);
				this.checkSection(dep);
				var newDeps = (this.deps.get(dep)).deps;
				this.addOpts(newDeps);
			}
		},this);
	},
	
	removeOpts: function(){
		this.checkedOpts.each(function(dep){
			$(dep).set('checked',false);
			this.checkSection(dep);
		},this);
		this.checkedOpts.empty();
	},
	
	handleFileClick: function(el){
		el = $(el);
		var input = el.getFirst().getFirst();
		input.set('checked',!input.get('checked'));
		this.dependencyCheck(input);
	},
	
	handleToggleClick: function(el){
		//if (!el.hasClass('full')){
			el.toggleClass('open');
			if (el.hasClass('open')){
				this.showFiles(el.getNext());
			} else {
				this.hideFiles(el.getNext());
			}
		//}
	},
	
	checkSection: function(dep){
		var el = $(dep);
		var fileList = el.getParent().getParent().getParent();
		var folder = fileList.getPrevious();
		var folderName = folder.get('id');
		var count = 0;
		fileList.getChildren().each(function(el){
			el = $(el);
			if (el.hasClass('file')){
				if (el.getFirst().getFirst().get('checked')){
					count++;
				}
			}
		},this);
		var obj = this.fileCount.get(folderName);
		obj.checked = count;
		this.fileCount.set(folderName,obj);
		
		if (obj.checked === obj.count){
			//all are checked
			if (folder.hasClass('some')){
				folder.removeClass('some');
			}
			folder.addClass('full');
		} else if (obj.checked > 0){
			if (folder.hasClass('full')){
				folder.removeClass('full');
			}
			folder.addClass('some');
		} else if (obj.checked === 0) {
			if (folder.hasClass('full')){
				folder.removeClass('full');
			}
			if (folder.hasClass('some')){
				folder.removeClass('some');
			}
		}
	},
	
	download: function(){
		
		this.button.setEnabled(false);
		var d = new Element('div',{
			id: 'progress-message'
		});
		var p = new Element('p',{
			html: 'Please wait while we prepare your download<br/>'
		});
		p.inject(d);
		var img = new Element('img',{
			src: 'img/ajax-loader.gif'
		});
		img.inject(p);
		this.dlg = new Jx.Dialog({
			label: 'JxLib Download Builder',
			content: d,
			modal: true,
			resize: false,
			close: false,
			move: false,
			collapse: false,
			onOpen: this.startRequest.bind(this),
			width: 200,
			height: 200
		});
		this.dlg.open();
	},
	
	startRequest: function(){
		this.req = new Request({
			url: 'builder.php',
			data: $('builder-form').toQueryString(),
			method: 'post',
			onSuccess: this.startDownload.bind(this)
		});
		this.req.send();
	},
	
	startDownload: function(responseText, responseXML){
		var obj = JSON.decode(responseText);
		this.dlg.close();
		this.button.setEnabled(true);
		if (obj.success){
			window.location = 'download.php?file='+obj.folder+'/'+obj.filename;
		}
	}
});