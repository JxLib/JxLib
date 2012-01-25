/*
---

name: Jx.Styles

description: A singleton object useful for dynamically creating and manipulating CSS styles

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Styles]

...
 */
/**
 * Class: Jx.Styles
 * Dynamic stylesheet class. Used for creating and manipulating dynamic
 * stylesheets.
 *
 * TBD: should we handle the case of putting the same selector in a stylesheet
 * twice?  Right now the code that stores the index of each rule on the
 * stylesheet is not really safe for that when combined with delete or get
 *
 * This is a singleton and should be called directly, like so:
 *
 * (code)
 *   // create a rule that turns all para text red and 15px.
 *   var rule = Jx.Styles.insertCssRule("p", "color: red;", "myStyle");
 *   rule.style.fontSize = "15px";
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 * Additional code by Paul Spencer
 *
 * This file is licensed under an MIT style license
 *
 * Inspired by dojox.html.styles, VisitSpy by nwhite,
 * http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
 *
 */
Jx.Styles = new(new Class({
    /**
     * dynamicStyleMap - <Hash> used to keep a reference to dynamically
     * created style sheets for quick access
     */
    dynamicStyleMap: {},
    /**
     * APIMethod: getCssRule
     * retrieve a reference to a CSS rule in a specific style sheet based on
     * its selector.  If the rule does not exist, create it.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * styleSheetName - <String> the name of the sheet to get the rule from
     *
     * Returns:
     * <CSSRule> - the requested rule
     */
    getCssRule: function(selector, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            rule = null,
            i;
        if (ss.indicies) {
            i = ss.indicies.indexOf(selector);
            if (i == -1) {
                rule = this.insertCssRule(selector, '', styleSheetName);
            } else {
                if (Browser.ie) {
                    rule = ss.sheet.rules[i];
                } else {
                    rule = ss.sheet.cssRules[i];
                }
            }
        }
        return rule;
    },
    /**
     * APIMethod: insertCssRule
     * insert a new dynamic rule into the given stylesheet.  If no name is
     * given for the stylesheet then the default stylesheet is used.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * declaration - <String> CSS-formatted rules to include.  May be empty,
     * in which case you may want to use the returned rule object to
     * manipulate styles
     * styleSheetName - <String> the name of the sheet to place the rules in,
     * or empty to put them in a default sheet.
     *
     * Returns:
     * <CSSRule> - a CSS Rule object with properties that are browser
     * dependent.  In general, you can use rule.styles to set any CSS
     * properties in the same way that you would set them on a DOM object.
     */
    insertCssRule: function (selector, declaration, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            rule,
            text = selector + " {" + declaration + "}",
            index;
        if (Browser.ie) {
            if (declaration === '') {
                //IE requires SOME text for the declaration. Passing '{}' will
                //create an empty rule.
                declaration = '{}';
            }
            index = ss.styleSheet.addRule(selector,declaration);
            rule = ss.styleSheet.rules[index];
        } else {
            ss.sheet.insertRule(text, ss.indicies.length);
            rule = ss.sheet.cssRules[ss.indicies.length];
        }
        ss.indicies.push(selector);
        return rule;
    },
    /**
     * APIMethod: removeCssRule
     * removes a CSS rule from the named stylesheet.
     *
     * Parameters:
     * selector - <String> the CSS selector for the rule
     * styleSheetName - <String> the name of the sheet to remove the rule
     * from,  or empty to remove them from the default sheet.
     *
     * Returns:
     * <Boolean> true if the rule was removed, false if it was not.
     */
    removeCssRule: function (selector, styleSheetName) {
        var ss = this.getDynamicStyleSheet(styleSheetName),
            i = ss.indicies.indexOf(selector),
            result = false;
        ss.indicies.splice(i, 1);
        if (Browser.ie) {
            ss.removeRule(i);
            result = true;
        } else {
            ss.sheet.deleteRule(i);
            result = true;
        }
        return result;
    },
    /**
     * APIMethod: getDynamicStyleSheet
     * return a reference to a styleSheet based on its title.  If the sheet
     * does not already exist, it is created.
     *
     * Parameter:
     * name - <String> the title of the stylesheet to create or obtain
     *
     * Returns:
     * <StyleSheet> a StyleSheet object with browser dependent capabilities.
     */
    getDynamicStyleSheet: function (name) {
        name = (name) ? name : 'default';
        if (!Object.keys(this.dynamicStyleMap).contains(name)) {
            var sheet = new Element('style').set('type', 'text/css').inject(document.head);
            sheet.indicies = [];
            this.dynamicStyleMap[name] = sheet;
        }
        return this.dynamicStyleMap[name];
    },
    /**
     * APIMethod: enableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to enable
     */
    enableStyleSheet: function (name) {
        this.getDynamicStyleSheet(name).disabled = false;
    },
    /**
     * APIMethod: disableStyleSheet
     * enable a style sheet
     *
     * Parameters:
     * name - <String> the title of the stylesheet to disable
     */
    disableStyleSheet: function (name) {
        this.getDynamicStyleSheet(name).disabled = true;
    },
    /**
     * APIMethod: removeStyleSheet
     * Removes a style sheet
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
    removeStyleSheet: function (name) {
      this.disableStyleSheet(name);
      this.getDynamicStyleSheet(name).dispose();
      delete this.dynamicStyleMap[name];
    },
    /**
     * APIMethod: isStyleSheetDefined
     * Determined if the passed in name is a defined dynamic style sheet.
     *
     * Parameters:
     * name = <String> the title of the stylesheet to remove
     */
    isStyleSheetDefined: function (name) {
      return Object.keys(this.dynamicStyleMap).contains(name);
    }
}))();