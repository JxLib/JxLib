var util = require("util");

module.exports = function(config, logger) {
    return {
        name: "theme",
        description: "create a theme based on the theme variable",
        tasks: [
            {
                echo: "Creating " + config.params.theme + " theme"
            },{
                mkdir: config.app.build + "/lib/themes/" + config.params.theme
            },{
                copy: {
                    from: config.app.build + "/themes/" + config.params.theme + "/ie6.css",
                    to: config.app.build + "/lib/themes/" + config.params.theme + "/ie6.css"
                }
            },{
                copy: {
                    from: config.app.build + "/themes/" + config.params.theme + "/ie7.css",
                    to: config.app.build + "/lib/themes/" + config.params.theme + "/ie7.css"
                }
            },{
                combine: {
                    repos: ['jxlib'],
                    target: config.app.build + "/lib/themes/" + config.params.theme + "/jxtheme.uncompressed.css",
                    theme: config.params.theme,
                    type: 'css'
                }
            },{
                copyDir: {
                    basedirs: {
                        to: config.app.build + "/lib/themes/" + config.params.theme,
                        from: config.app.build + "/themes/" + config.params.theme
                    },
                    copy: [ '/images']
                }
            },{
                cssmin: {
                    source: config.app.build + "/lib/themes/" + config.params.theme + "/jxtheme.uncompressed.css",
                    target: config.app.build + "/lib/themes/" + config.params.theme + "/jxtheme.compressed.css"
                }
            },{
                concat: {
                    files: [
                        config.app.build + "/themes/" + config.params.theme + "/license.css",
                        config.app.build + "/lib/themes/" + config.params.theme + "/jxtheme.compressed.css"
                    ],
                    target: config.app.build + "/lib/themes/" + config.params.theme + "/jxtheme.css"
                }
            },{
                deleteFile: [
                    config.app.build + "/lib/themes/" + config.params.theme + "/jxtheme.compressed.css"
                ]
            }
        ]
    }
    
};