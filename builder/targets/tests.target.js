module.exports = function(config,logger) {
  
    return {
        name: "tests",
        description: "setup files for tests",
        depends: ["builder"],
        tasks: [{
            copyDir: {
                basedirs: {
                    to: config.project.basedir + "/tests/interactive/UserTests/assets",
                    from: config.app.build + "/lib"
                },
                copy: [ '/themes']
            }
        },{
            copy: {
                from: config.app.build + "/lib/a_pixel.png",
                to: config.project.basedir + "/tests/interactive/UserTests/assets/a_pixel.png"
            }
        },{
            deleteDir: [ config.app.deploy + "/tests" ]
        },{
            mkdir: [ config.app.deploy + "/tests" ]
        },{
           copyDir: {
                basedirs: {
                    to: config.app.deploy,
                    from: config.project.basedir
                },
                copy: [ '/tests']
            } 
        },{
            deleteFile: [
                    config.app.deploy + "/tests/interactive/config.js",
                    config.app.deploy + "/tests/interactive/test_frame.html"
                ]
        },{
            rename: [{
                from: config.app.deploy + "/tests/interactive/config-www.js",
                to: config.app.deploy + "/tests/interactive/config.js"
            },{
                from: config.app.deploy + "/tests/interactive/test_frame-www.html",
                to: config.app.deploy + "/tests/interactive/test_frame.html"
            }]
        }]
    };
};