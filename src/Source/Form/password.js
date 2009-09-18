// $Id: $
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
Jx.Field.Password = new Class({
    
    Extends: Jx.Field,
    
    options: {
        template: '<label class="jxInputLabel"></label><input class="jxInputPassword" type="password" /><span class="jxInputTag"></span>'
    },
    
    type: 'Password'
});