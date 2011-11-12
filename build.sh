#!/usr/bin/env node

/**
 * Base script for invoking a build. Call with
 * 
 *     > build <target>
 */
var Builder = require("build"),
    sys = require("sys"),
    path = require("path"),
    util = require("util"),
    fs = require("fs");
    


/**
 * Parse arguments array
 * @param {Array} args optional arguments arrray.
 * @return {Object} opts key value hash.
 * @export
 */
 parse = function(args) {
    // args is optional, default is process.argv
    args = args || process.argv;

    var opts = {}, curSwitch;

    args.forEach(function(arg) {
        // its a switch
        if (/^(-|--)/.test(arg) || !curSwitch) {
            opts[arg] = true;
            curSwitch = arg;
        // this arg is a data
        } else {
            if (arg === 'false') {
                arg = false;
            } else if (arg === 'true') {
                arg = true;
            } else if (!isNaN(arg)) {
                arg = Number(arg);
            }

            // it was a boolean switch per default, 
            // now it has got a val
            if (typeof opts[curSwitch] === 'boolean') {
                opts[curSwitch] = arg;
            } else if (Array.isArray(opts[curSwitch])) {
                opts[curSwitch].push(arg);
            } else {
                opts[curSwitch] = [opts[curSwitch], arg];
            }
        }
    });

    return opts;
};

var args = parse();

//sys.puts("args: " + sys.inspect(args));
var configPath = fs.realpathSync((args['--config'] != undefined) ? args['--config'] : "./builder/config.js"),
    logfile = (args['--logfile'] != undefined) ? args['--logfile'] : "./build.log",
    config = require(configPath),
    target = (args['--target'] != undefined) ? args['--target'] : config.project["default"];

var logfileBase = path.basename(logfile),
    logfilePath = path.dirname(logfile)

logfile = fs.realpathSync(logfilePath) + "/" + logfileBase;
logfile = path.normalize(logfile);

config.logfilePath = logfile;
config.filepath = configPath;
config.targets = fs.realpathSync(path.dirname(configPath) + "/targets");

sys.puts("config: " + util.inspect(config, true, null));

new Builder(config, logfile).build(target);


/**  


  
  <target description="Package Tutorials" name="tutorials" depends="build">
    <echo message="packaging tutorials"/>
    <mkdir dir="${build.home}/tutorials"/>
    <copy todir="${build.home}/tutorials/lib">
        <fileset dir="${build.home}/lib"/>
    </copy>
    <copy todir="${build.home}/tutorials/browsr">
      <fileset dir="${deploy.home}/reference/tutorials/browsr"/>
    </copy>
  </target>
	
  <target description="Package Examples" name="examples" depends="build">
    <echo message="packaging examples"/>
    <mkdir dir="${build.home}/examples"/>
    <copy todir="${build.home}/examples">
        <fileset dir="${deploy.home}/reference/examples"/>
    </copy>
  	
  </target>


  


  <target name="dist" description="Create binary distribution" depends="clean,build,tutorials,examples">
    
    <echo message="Creating distribution archives"/>
    <mkdir dir="${dist.home}"/>

    <delete file="${dist.home}/${app.name}-${app.version}.tar.gz"/>
    <delete file="${dist.home}/${app.name}-tutorials-${app.version}.tar.gz"/>
    <delete file="${dist.home}/${app.name}-examples-${app.version}.tar.gz"/>
    <delete file="${dist.home}/${app.name}-${app.version}.zip"/>
    <delete file="${dist.home}/${app.name}-tutorials-${app.version}.zip"/>
    <delete file="${dist.home}/${app.name}-examples-${app.version}.zip"/>

    <!-- Create source zip file -->
    <zip destfile="${dist.home}/${app.name}-${app.version}.zip" update="true">
      <zipfileset dir="${build.home}/lib" prefix="${app.name}"/>
    </zip>
    <!-- Create tutorials zip file -->
    <zip destfile="${dist.home}/${app.name}-tutorials-${app.version}.zip" update="true">
      <zipfileset dir="${build.home}/tutorials" prefix="${app.name}"/>
    </zip>
    <!-- Create examples zip file -->
    <zip destfile="${dist.home}/${app.name}-examples-${app.version}.zip" update="true">
      <zipfileset dir="${build.home}/examples" prefix="${app.name}"/>
    </zip>
    
    <!-- create tar file -->
    <tar destfile="${dist.home}/${app.name}-${app.version}.tar">
      <tarfileset dir="${build.home}/lib" prefix="${app.name}"/>
    </tar>
    <gzip src="${dist.home}/${app.name}-${app.version}.tar" destfile="${dist.home}/${app.name}-${app.version}.tar.gz"/>
    
    <delete file="${dist.home}/${app.name}-${app.version}.tar"/>
    
    <!-- create tar file -->
    <tar destfile="${dist.home}/${app.name}-tutorials-${app.version}.tar">
      <tarfileset dir="${build.home}/tutorials" prefix="${app.name}"/>
    </tar>
    <gzip src="${dist.home}/${app.name}-tutorials-${app.version}.tar" destfile="${dist.home}/${app.name}-tutorials-${app.version}.tar.gz"/>
    
    <delete file="${dist.home}/${app.name}-tutorials-${app.version}.tar"/>
    
    <!-- create tar file -->
    <tar destfile="${dist.home}/${app.name}-examples-${app.version}.tar">
      <tarfileset dir="${build.home}/examples" prefix="${app.name}"/>
    </tar>
    <gzip src="${dist.home}/${app.name}-examples-${app.version}.tar" destfile="${dist.home}/${app.name}-examples-${app.version}.tar.gz"/>
    
    <delete file="${dist.home}/${app.name}-examples-${app.version}.tar"/>
    
  </target>

*/
