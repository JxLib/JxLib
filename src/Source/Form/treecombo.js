/*
---

name: Jx.Field.TreeCombo

description: is a Combo that show a Jx.Tree 

license: MIT-style license.

requires:
 - Jx.Store.Protocol.Ajax
 - Jx.Tree
 - Jx.Adaptor.Tree.Object
 - Jx.Button.Flyout
 - Jx.Field

provides: [Jx.Field.TreeCombo]

...
 */
// $Id$
/**
 * Class: Jx.Field.TreeCombo
 *
 * A Combo that shows a Jx.Tree to select any Jx.TreeFolder or Jx.TreeItem for
 * the Combo field. Items of the tree are populated from an Ajax Request to the
 * supplied url option.
 *
 * Example:
 * (code)
 * new Jx.Field.TreeCombo({
 *   url: '../common/menu.htm',
 *   label:'ComboBox',
 *   name:'ComboBox'
 * })
 * (end)
 *
 * Extends:
 * <Jx.Field>
 *
 * Author: Ing. Axel Mendoza Pupo.
 *
 * License:
 * Copyright (c) 2011, Ing. Axel Mendoza Pupo.
 *
 * This file is licensed under an MIT style license
 */

Jx.Field.TreeCombo = new Class({
    
    Extends: Jx.Field,
    Family: 'Jx.Field.Combo',    
    pluginNamespace: 'TreeCombo',

    options: {
        buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>',
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputText"  name="{name}"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>',
        hiddenValue: null,
        protocol: null,
        url: null,
        treeOptions: {}
    },

    type: 'Text',

    

    /**
     * APIMethod: render
     * create a new instance of Jx.Field.Combo
     */
    render: function() {
        this.classes = Object.merge({},this.classes,{
            wrapper: 'jxInputWrapper',
            revealer: 'jxInputRevealer',
            icon: 'jxInputIcon'
        });
        this.parent();

        if (this.options.protocol === null || this.options.protocol === undefined) {
            //create Ajax protocol as default with url
            this.protocol = new Jx.Store.Protocol.Ajax({
                urls: {
                    read: this.options.url
                },
                parser: Jx.Store.Parser.JSON()
            });
        } else {
            this.protocol = this.options.protocol;
        }
            
        this.adaptor = new Jx.Adaptor.Tree.Object({
            protocol: this.protocol
        });
        
        this.treeView = new Jx.Tree(Object.merge({},this.options.treeOptions,{
            plugins: [this.adaptor],
            selectionFunction: function(el, e){
                
                var item = document.id(el).retrieve('jxListTargetItem') || el,
                    flag = !item.hasClass('jxUnselectable');
                    
                var jx = $jx(el);
                if (jx instanceof Jx.Tree.Folder) {
                    if (e.target.hasClass('jxTreeImage') && flag) {
                        flag = false;
                    } 
                }
                return flag;
            }
        }));

        this.button = new Jx.Button.Flyout({
            template: this.options.buttonTemplate,
            imageClass: 'jxInputRevealerIcon',
            positionElement: this.field,
            content: new Jx.Panel({
                width: 260,
                height: 240,
                collapse: false,
                hideTitle: true,
                content: this.treeView
            })
        }).addTo(this.revealer);

        this.treeView.addEvent('select',function(jx){
            this.button.hide();
            this.setValue(jx.getLabel());
        }.bind(this));

        this.button.addEvent('click', function(e) {

            if (!button.options.enabled) {
                return;
            }
            this.contentContainer.setStyle('visibility','hidden');
            this.contentContainer.setStyle('display','block');
            document.id(document.body).adopt(this.contentContainer);
            /* we have to size the container for IE to render the chrome correctly
             * but just in the menu/sub menu case - there is some horrible peekaboo
             * bug in IE related to ULs that we just couldn't figure out
             */

            this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());

            this.showChrome(this.contentContainer);

            this.position(this.contentContainer, that.field, {
                horizontal: ['left left', 'right right'],
                vertical: ['bottom top', 'top bottom'],
                offsets: this.chromeOffsets
            });

            this.contentContainer.setStyle('visibility','');

            document.addEvent('mousedown', this.bound.hide);
            document.addEvent('keyup', this.bound.keypress);

        }.bind(this));
        
        //load the data
        this.adaptor.load();
    },

    setValue: function(value) {
        this.field.set('value', value);
    },
    
    /**
     * APIMethod: empty
     * remove all values from the combo
     */
    empty: function() {
        this.setValue('');
        this.treeView.empty();
    },
    
    load: function(){
        this.empty();
        this.adaptor.load();
    }
}); 