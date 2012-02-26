module.exports = function(config,logger) {
  
    return {
        name: "require",
        description: "Deploy JxLib for requirejs",
        depends: ["build"],
        tasks: [{
            echo: "Deploying files"
        },{
            //just copy the source directories to the places we need 
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/reference/examples/require/lib",
                    from: config.app.build 
                },
                copy: [ '/Source']
            }
        },{
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/reference/examples/require/lib",
                    from: config.app.build + "/lib"
                },
                copy: [ '/themes']
            }
        },{
            copy: {
                from: config.app.build + "/lib/mootools-core.js",
                to: config.app.deploy + "/reference/examples/require/lib/Source/mootools-core.js"
            }
        },{
            copy: {
                from: config.app.build + "/lib/mootools-more.js",
                to: config.app.deploy + "/reference/examples/require/lib/Source/mootools-more.js"
            }
        },{
            copy: {
                from: config.app.build + "/lib/a_pixel.png",
                to: config.app.deploy + "/reference/examples/require/lib/Source/a_pixel.png"
            }
        },{
            copy: {
                from: config.app.build + "/lib/jxlib.standalone.uncompressed.js",
                to: config.app.deploy + "/reference/examples/require/lib/jxlib.standalone.uncompressed.js"
            }
        }]
    };
};
