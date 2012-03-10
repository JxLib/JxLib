

module.exports = function(config,logger) {
    return {
        name: "prepare",
        description: "preparing core files",
        depends: "clean",
        tasks: [
            {
                echo: "Preparing core files"
            },{
                mkdir: [
                    config.app.build,
                    config.app.build + "/lib"
                ]
            },{
                copyDir: {
                    basedirs: {
                        to: config.app.build,
                        from: config.app.home + "/src"
                    },
                    copy: [ '/Source', '/themes','/images']
                }
            },{
                deleteFile: [
                    config.app.build + "/lib/jxlib.uncompressed.js",
                    config.app.build + "/lib/jxlib.standalone.uncompressed.js",
                    config.app.build + "/lib/jxlib.js",
                    config.app.build + "/lib/jxlib.standalone.js"
                ]
            },{
                echo: "Concatenating javascript into jxlib"
            },{
                combine: [  //uses jxLoader
                    {    
                        repos: ['jxlib'],
                        target: config.app.build + "/lib/jxlib.temp.js",
                        tags: []
                    },{
                        repos: ['core'],
                        target: config.app.build + "/lib/mootools-core.js",
                        tags: ['1.2compat']
                    },{
                        repos: ['more'],
                        target: config.app.build + "/lib/mootools-more.js",
                        tags: ['1.2compat']
                    }
                ]
            },{
                createDeps: {
                    target: config.app.build + "/lib"
                }
            },{
                concat: {
                    files: [
                        config.app.build + "/lib/mootools-core.js",
                        config.app.build + "/lib/mootools-more.js",
                        config.app.build + "/lib/jxlib.temp.js"
                    ],
                    target: config.app.build + "/lib/jxlib.uncompressed.temp.js"
                }
            },{
                concat: {
                    files: [
                        config.project.basedir + "/src/open-comment.txt",
                        config.app.vendor + "/mootools-core/Source/license.txt",
                        config.app.vendor + "/mootools-more/Source/license.txt",
                        config.project.basedir + "/src/close-comment.txt",
                        config.app.build + "/Source/license.js",
                        config.app.build + "/lib/jxlib.uncompressed.temp.js"
                    ],
                    target: config.app.build + '/lib/jxlib.uncompressed.js'
                }
            },{
                concat: {
                    files: [
                        config.app.build + "/Source/license.js",
                        config.app.build + "/lib/jxlib.temp.js"
                    ],
                    target: config.app.build + '/lib/jxlib.standalone.uncompressed.js'
                }
            },{
                compile: [
                    {
                        file: config.app.build + "/lib/jxlib.uncompressed.js",
                        target: config.app.build + "/lib/jxlib.compressed.js"
                    },{
                        file: config.app.build + "/lib/jxlib.standalone.uncompressed.js",
                        target: config.app.build + "/lib/jxlib.standalone.compressed.js"
                    }
                ]
            },{
                concat: {
                    files: [
                        config.project.basedir + "/src/open-comment.txt",
                        config.app.vendor + "/mootools-core/Source/license.txt",
                        config.app.vendor + "/mootools-more/Source/license.txt",
                        config.project.basedir + "/src/close-comment.txt",
                        config.app.build + "/Source/license.js",
                        config.app.build + "/lib/jxlib.compressed.js"
                    ],
                    target: config.app.build + '/lib/jxlib.js'
                }
            },{
                concat: {
                    files: [
                        config.app.build + "/Source/license.js",
                        config.app.build + "/lib/jxlib.standalone.compressed.js"
                    ],
                    target: config.app.build + '/lib/jxlib.standalone.js'
                }
            },{
                replace: [
                    {
                        file: config.app.build + "/lib/jxlib.standalone.uncompressed.js",
                        token: "[version]",
                        value: config.app.version
                    },{
                        file: config.app.build + "/lib/jxlib.standalone.js",
                        token: "[version]",
                        value: config.app.version
                    },{
                        file: config.app.build + "/lib/jxlib.uncompressed.js",
                        token: "[version]",
                        value: config.app.version
                    },{
                        file: config.app.build + "/lib/jxlib.js",
                        token: "[version]",
                        value: config.app.version
                    }
                ]
            },{
                deleteFile: [
                    config.app.build + "/lib/jxlib.standalone.compressed.js",
                    config.app.build + "/lib/jxlib.compressed.js",
                    config.app.build + "/lib/jxlib.uncompressed.temp.js",
                    config.app.build + "/lib/jxlib.uncompressed.1.js",
                    config.app.build + "/lib/jxlib.temp.js"
                ]
            },{
                copy: {
                    from: config.app.build + "/images/a_pixel.png",
                    to: config.app.build + "/lib/a_pixel.png"
                }
            },{
                mkdir: config.app.build + "/lib/themes"
            }
        ]
    };
};