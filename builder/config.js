var fs = require('fs');

var basedir = fs.realpathSync(__dirname + "/.."),
    config = {
        project: { 
            basedir: basedir, 
            "default": "deploy"
        },
        app: {
            name: "jxlib",
            path: "/jxlib",
            version: "3.1b3",
            home: basedir,
            build: basedir + "/build",
            dist: basedir + "/dist",
            deploy: basedir + "/www",
            docs: basedir + "/www/reference",
            vendor: basedir + "/vendor",
            utils: basedir + "/utils"
        }
    };

config.dependencies = {
    NaturalDocs: config.app.utils + "/NaturalDocs-1.4/NaturalDocs"
};

config.loader = {
    base: {
        'moveImages': false,
        'rewriteImageUrl': false,
        debug: false
    },
    repos: {
        'core': {
            'paths': {
                'js': config.app.vendor + "/mootools-core/Source"
            }
        },
        'more': {
            'paths': {
                'js': config.app.vendor + "/mootools-more/Source"
            }
        },
        'jxlib': {
            'paths': {
                'js': config.app.build + '/Source',
                'css': config.app.build + '/themes/{theme}/css',
                'cssalt': config.app.build + '/themes/{theme}'
                //'images': jxLibPath + '/themes/{theme}/images'
            }
        }
    }
};

config.tasks = [];

module.exports = config;