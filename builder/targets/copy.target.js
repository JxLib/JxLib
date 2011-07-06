module.exports = function(config,logger) {
  
    return {
        name: "copy",
        description: "Copies JxLib files to www directory",
        depends: "build",
        tasks: [{
            copyDir: {
                    basedirs: {
                        to: config.app.deploy,
                        from: config.app.build
                    },
                    copy: [ '/lib']
                }
        }]
    };
};
