

module.exports = function(config,logger) {
  
    return {
        name: "build",
        description: "Build the Jx library",
        depends: "prepare",
        tasks: [{
            callTarget: {
                target: "theme",
                params: {
                    theme: "crispin"
                }
            }
        },{
            callTarget: {
                target: "theme",
                params: {
                    theme: "delicious"
                }
            }
        }]
    };
};