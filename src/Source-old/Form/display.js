/* 
--- 

name: Jx.Field.Display 

description: A Jx.Field.Display provides a way to only display a value in a form similar to Ext.form.DisplayField 

license: MIT-style license. 

requires:
 - Jx.Field

provides: [Jx.Field.Display] 

...
*/
/**
 * Class: Jx.Field.Display
 **/
Jx.Field.Display = new Class({
  Extends: Jx.Field,
  options: { 
       template: '<span class="jxInputContainer"><label class="jxInputLabel" ></label><span class="jxInputTag"></span></span>'
  },
  render: function(){
    this.parent();
    this.field = new Element('div',{
      html: this.options.value,
      id: this.id
    });
    this.field.inject(this.label,'after');

    this.field.store('field', this); 
  },

  setValue : function (v) { 
       if (!this.options.readonly) { 
           this.field.set('html', v); 
       } 
   }, 
   getValue : function () { 
       return this.field.get("html"); 
   }
});
