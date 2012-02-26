/*
---

name: Config

description: Creates the Jx namespace for global use of the library

license: MIT-style license.

provides: [Config]

...
*/

/**
 * This file simply defines a null config object. It canbe overridden in the
 * main HTML file by simply redefining it immediately after loading require.js.
 *
 * This file is only used when require.js is used. In a full build this file should
 * be excluded and the user will need to define any config "normally".
 */
define('config',[],function(){return null;});