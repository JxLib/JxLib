module.exports = function(config,logger) {
  
    return {
        name: "docs",
        description: "Create documentation",
        depends: ["prepare"],
        tasks: [{
            mkdir: [
                config.app.build + "/docs",
                config.app.build + "/docs/api"
            ]
        },{
            echo: "Generating documentation"
        },{
            exec: [{
                os: ["win32"],
                cmd: "cmd",
                args: ["/c","perl", 
                    config.dependencies.NaturalDocs,
                    "-i","./Source","-o","framedhtml","./docs/api","-p", 
                    config.project.basedir + "/utils/ndconfig","-s","jx","-r"
                ],
                options: {cwd: config.app.build}
            },{
                os: ["linux","darwin"],
                cmd: "/usr/bin/env",
                args: ["perl",
                    config.dependencies.NaturalDocs,
                    "-i","./Source","-o","framedhtml","./docs/api","-p",
                    config.project.basedir + "/utils/ndconfig","-s","jx","-r"
                ],
                options: {cwd: config.app.build}
                
            }]
        },{
            mkdir: [ config.app.docs + "/api" ]
        },{
            copyDir: {
                basedirs: {
                    to: config.app.docs,
                    from: config.app.build + "/docs"
                },
                copy: [ '/api']
            }
        }]
    };
};