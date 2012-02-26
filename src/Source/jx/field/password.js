/*
---

name: Jx.Field.Password

description: Represents a password input

license: MIT-style license.

requires:
 - Jx.Field.Text

provides: [Jx.Field.Password]

...
 */
// $Id$
/**
 * Class: Jx.Field.Password
 *
 * Extends: <Jx.Field.Text>
 *
 * This class represents a password input field.
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
define("jx/field/password", function(require, exports, module){
    
    var base = require("../../base"),
        Field = require("../field");
        
    var password = module.exports = new Class({

        Extends: Field,
        Family: "Jx.Field.Password",
    
        options: {
            template: '<span class="jxInputContainer"><label class="jxInputLabel" ></label><input class="jxInputPassword" type="password" name="{name}"/><span class="jxInputTag"></span></span>'
        },
    
        type: 'Password'
    });
    
    if (base.global) {
        base.global.Field.Password = module.exports;
    }
    
});