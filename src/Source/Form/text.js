/*
---

name: Jx.Field.Text

description: Represents a text input

license: MIT-style license.

requires:
 - Jx.Field

optional:
 - More/OverText

provides: [Jx.Field.Text]

...
 */
// $Id$
/**
 * Class: Jx.Field.Text
 *
 * Extends: <Jx.Field>
 *
 * This class represents a text input field.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.Text = new Class({

    Extends: Jx.Field,

    options: {
        /**
         * Option: overText
         * an object holding options for mootools-more's OverText class. Leave it null to
         * not enable it, make it an object to enable.
         */
        overText: null,
        /**
         * Option: template
         * The template used to render this field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><input class="jxInputText" type="text" name="{name}"/><span class="jxInputTag"></span></span>'
    },
    /**
     * Property: type
     * The type of this field
     */
    type: 'Text',

    /**
     * APIMethod: render
     * Creates a text input field.
     */
    render: function () {
        this.parent();

        //create the overText instance if needed
        if ($defined(this.options.overText)) {
            var opts = $extend({}, this.options.overText);
            this.field.set('alt', this.options.tip);
            this.overText = new OverText(this.field, opts);
            this.overText.show();
        }

    }

});