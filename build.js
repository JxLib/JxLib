
/**
 * Base script for invoking a build. Call with
 * 
 *     > build <target>
 */
var builder = require("utils/node-builder/builder"),
    fs = require('fs');

//Load any custom tasks here


   

config.targets = [
    ,,,
];



/**  
  <target description="Copies JxLib files to www directory" name="copy" depends="build" >
  	<copy todir="${deploy.home}/lib">
        <fileset dir="${build.home}/lib"/>
    </copy>
  </target>
	
	
  <target description="Deploy JxLib" name="deploy" depends="copy,builder,tests,docs">
    <echo message="deploying files"/>
    <copy todir="${deploy.home}/reference/tutorials/lib">
        <fileset dir="${build.home}/lib"/>
    </copy>
    <copy todir="${deploy.home}/reference/examples/lib">
        <fileset dir="${build.home}/lib"/>
    </copy>
  </target>
	
  <target description="Deploy source for www download builder" name="builder" depends="copy">
	<delete dir="${deploy.home}/builder/src" />
  	<delete dir="${deploy.home}/builder/assets" />
  	<mkdir dir="${deploy.home}/builder/src"/>
  	<mkdir dir="${deploy.home}/builder/assets"/>
  	<mkdir dir="${deploy.home}/builder/assets/themes"/>
  	<mkdir dir="${deploy.home}/builder/src/core"/>
  	<mkdir dir="${deploy.home}/builder/src/more"/>
  	<mkdir dir="${deploy.home}/builder/src/core/Source"/>
  	<mkdir dir="${deploy.home}/builder/src/more/Source"/>
  	<mkdir dir="${deploy.home}/builder/src/jxlib"/>
  	<mkdir dir="${deploy.home}/builder/src/jxlib/Source"/>
  	
  	<copy todir="${deploy.home}/builder/src/core/Source">
  		<fileset dir="${vendor.home}/mootools-core/current/Source" />
  	</copy>
	<copy todir="${deploy.home}/builder/src/more/Source">
  		<fileset dir="${vendor.home}/mootools-more/current/Source" />
  	</copy>
	<copy todir="${deploy.home}/builder/src/jxlib/Source/">
  		<fileset dir="${build.home}/Source" />
  	</copy>
	<copy todir="${deploy.home}/builder/assets/themes/">
  		<fileset dir="${build.home}/lib/themes/" />
  	</copy>

    <!-- Copy all theme files to the builder/src directory -->

  	<copy file="${build.home}/images/a_pixel.png" todir="${deploy.home}/builder/assets" />
  	<copy todir="${deploy.home}/builder/src/jxlib/themes/">
  		<fileset dir="${build.home}/themes/" />
  	</copy>
      
	<!-- Place JSON files -->
  	<move file="${build.home}/lib/deps.json" todir="${deploy.home}/builder/work/" />
  	<move file="${build.home}/lib/jxlib.json" todir="${deploy.home}/builder" />
  	<move file="${build.home}/lib/core.json" todir="${deploy.home}/builder" />
  	<move file="${build.home}/lib/more.json" todir="${deploy.home}/builder" />
  </target>
	
	<target description="setup files for tests" name="tests" depends="builder">
		<!-- Copy themes to the right locations -->
		<copy todir="${basedir}/tests/interactive/UserTests/assets/themes">
	  	    <fileset dir="${build.home}/lib/themes/"/>
	  	</copy>
		<copy file="${build.home}/lib/a_pixel.png" todir="${basedir}/tests/interactive/UserTests/assets/" />
		
		<delete dir="${deploy.home}/tests" />
		<mkdir dir="${deploy.home}/tests"/>
		<copy todir="${deploy.home}/tests">
			<fileset dir="${basedir}/tests" />
		</copy>
		<delete file="${deploy.home}/tests/interactive/config.js"/>
		<rename dest="${deploy.home}/tests/interactive/config.js" src="${deploy.home}/tests/interactive/config-www.js"/>
		
		<delete file="${deploy.home}/tests/interactive/test_frame.html"/>
		<rename dest="${deploy.home}/tests/interactive/test_frame.html" src="${deploy.home}/tests/interactive/test_frame-www.html"/>
				
		
	</target>
  
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


  <target description="Create documentation" name="docs" depends="prepare">

    <mkdir dir="${build.home}/docs"/>
    <mkdir dir="${build.home}/docs/api"/>
    <echo message="Generating documentation"/>
    <exec executable="cmd" os="Windows Vista, Windows XP" dir="${build.home}">
      <arg line="/c perl ${NaturalDocs} -i ./Source -o framedhtml ./docs/api -p ${basedir}/utils/ndconfig -s jx -r"/>
    </exec>
    <exec executable="/usr/bin/env" os="Mac OS X, Linux" dir="${build.home}">
      <arg line=" perl ${NaturalDocs} -i ./Source -o framedhtml ./docs/api -p ${basedir}/utils/ndconfig -s jx -r"/>
    </exec>
    <mkdir dir="${docs.home}/api"/>
    <copy todir="${docs.home}/api">
      <fileset dir="${build.home}/docs/api"/>
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
