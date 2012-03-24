/*
---

name: Jx.Field.Hidden

description: Represents a hidden input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Hidden]

...
 */
// $Id$
/**
 * Class: Jx.Field.Hidden
 *
 * Extends: <Jx.Field>
 *
 * This class represents a hidden input field.
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
define("jx/field/hidden", ['../../base','../field'],
       function(base, Field){
    
    var hidden = new Class({

        Extends: Field,
        Family: "Jx.Field.Hidden",
    
        options: {
            /**
             * Option: template
             * The template used to render this field
             */
            template: '<span class="jxInputContainer"><input class="jxInputHidden" type="hidden" name="{name}"/></span>'
        },
        /**
         * Property: type
         * The type of this field
         */
        type: 'Hidden'
    
    });

    if (base.global) {
        base.global.Field.Hidden = hidden;
    }
    
    return hidden;
    
});



