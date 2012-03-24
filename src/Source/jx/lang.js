/*
---

name: Jx.Lang

description: Base class for all other object in the JxLib framework.

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Lang]

...
 */
/**
 * Class: Jx.Lang
 * Jx.Lang is a mixin class that provides the language functionality of
 * the original Jx.Object implementation. It was designed so that the
 * same functionality could be mixed into Jx.Plugin without having to
 * extend from it (thus avoiding a circular reference).
 */
define('jx/lang',['base'],function(base){

    var Lang = new Class({
        
        options: {
            /**
             * Option: useLang
             * Turns on this widget's ability to react to changes in
             * the default language. Handy for changing text out on the fly.
             *
             * TODO: Should this be enabled or disabled by default?
             */
          useLang: true,
        },
        
        setupLang: function(){
            if (typeOf(this.changeText) == 'function') {
                this.bound.changeText = this.changeText.bind(this);
                if (this.options.useLang) {
                    Locale.addEvent('change', this.bound.changeText);
                }
            }
        },
        
                /**
         * APIMethod: getText
         *
         * returns the localized text.
         *
         * Parameters:
         * val - <String> || <Function> || <Object> = { set: '', key: ''[, value: ''] } for a Locale object
         */
        getText: function(val) {
          // COMMENT: just an idea how a localization object could be stored to the instance if needed somewhere else and options change?
          this.i18n = val;
          return base.getText(val);
        },
        
         /**
         * APIMethod: changeText
         * This method should be overridden by subclasses. It should be used
         * to change any language specific default text that is used by the object.
         *
         * Parameters:
         * lang - the language being changed to or that had it's data set of
         *    translations changed.
         */
        changeText : function(){},
        
        cleanupLang: function(){
            if (this.options.useLang && this.bound.changeText !== undefined && this.bound.changeText !== null) {
                Locale.removeEvent('change', this.bound.changeText);
            }
        }
    });
    
    if (base.global) {
        base.global.Lang = Lang;
    }
    
    return Lang;
});