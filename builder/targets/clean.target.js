var util = require("util");

module.exports = function(config, logger){
    
    var ret = {
        name: "clean",
        description: "clean up areas that we copy files to including dist and build directories",
        tasks: [{
            echo: "Removing build directories"
        },{
            deleteDir: [
                config.app.build,
                config.app.docs + "/api",
                config.project.basedir + "/tests/interactive/UserTests/assets/themes",
                config.app.deploy + "/tests",
                config.app.deploy + "/builder/src",
                config.app.deploy + "/builder/assets",
                config.app.deploy + "/reference/tutorials/lib",
                config.app.deploy + "/reference/examples/lib",
                config.app.deploy + "/lib",
                config.project.basedir + "/utils/ndconfig/Data"
            ]
        },{
            mkdir: [ config.app.deploy + "/lib" ]
        },{
            copy: {
                from: config.project.basedir + "/tests/empty.html",
                to: config.app.deploy + "/lib/empty.html"
            }
        }]
    };
    logger.debug("Value to return from clean function " + util.inspect(ret, false, null));
    return ret;
    
};