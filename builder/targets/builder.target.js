module.exports = function(config,logger) {
  
    return {
        name: "builder",
        description: "Deploy source for www download builder",
        depends: ["copy"],
        tasks: [{
            deleteDir: [
                config.app.deploy + "/builder/src",
                config.app.deploy + "/builder/assets"
            ]
        },{
            mkdir: [ 
                config.app.deploy + "/builder/src",
                config.app.deploy + "/builder/assets",
                config.app.deploy + "/builder/assets/themes",
                config.app.deploy + "/builder/src/core",
                config.app.deploy + "/builder/src/more",
                config.app.deploy + "/builder/src/jxlib"
            ]
        },{
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/builder/src/core",
                    from: config.app.vendor + "/mootools-core"
                },
                copy: [ '/Source']
            }
        },{
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/builder/src/more",
                    from: config.app.vendor + "/mootools-more"
                },
                copy: [ '/Source']
            }
        },{
             copyDir: {
                basedirs: {
                    to: config.app.deploy + "/builder/src/jxlib",
                    from: config.app.build
                },
                copy: [ '/Source']
            }
        },{
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/builder/assets",
                    from: config.app.build + "/lib"
                },
                copy: [ '/themes']
            }
        },{
            copy: {
                from: config.app.build + "/images/a_pixel.png",
                to: config.app.deploy + "/builder/assets/a_pixel.png"
            }
        },{
           copyDir: {
                basedirs: {
                    to: config.app.deploy + "/builder/src/jxlib",
                    from: config.app.build
                },
                copy: [ '/themes']
            } 
        },{
            copy: {
                from: config.app.build + "/lib/deps.json",
                to: config.app.deploy + "/builder/deps.json"
            } 
        }]
    };
};
        