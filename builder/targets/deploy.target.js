module.exports = function(config,logger) {
  
    return {
        name: "deploy",
        description: "Deploy JxLib",
        depends: ["tests","docs","require"],
        tasks: [{
            echo: "Deploying files"
        },{
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/reference/tutorials",
                    from: config.app.build 
                },
                copy: [ '/lib']
            }
        },{
            copyDir: {
                basedirs: {
                    to: config.app.deploy + "/reference/examples",
                    from: config.app.build 
                },
                copy: [ '/lib']
            }
        }]
    };
};
