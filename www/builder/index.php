<?php
/**
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
define('DS',DIRECTORY_SEPARATOR);

$basedir = 'src';
$sdirs = array('core','more','jxlib');
$file = 'Source/scripts.json';

/**
 * grab all scripts.json files, translate to php data structures
 * We do this so we don't have to manually update this file each time
 * we change the source files. 
 */
foreach($sdirs as $d){
	$path = $basedir . DS . $d . DS . $file; 
	$f = file_get_contents($path);
	$deps[$d] = json_decode($f,true);
}

//check for the profile.json file
if (!empty($_FILES['profile']) && is_file($_FILES['profile']['tmp_name'])){
	$profile = file_get_contents($_FILES['profile']['tmp_name']);
}

//All Dependencies have been figured and JSON files pre-created by the ANT script

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Strict//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>JxLib Download Builder</title>
	<link rel="stylesheet" href="../lib/themes/crispin/jxtheme.css" type="text/css" media="screen" charset="utf-8">
	<link rel="stylesheet" href="../css/home.css" type="text/css" media="screen" charset="utf-8">
	<link rel="stylesheet" href="css/builder.css" type="text/css" media="screen" charset="utf-8">
	
	<!-- Javascript for the builder -->
	<script type="text/javascript" src="../lib/jxlib.js"></script>
	<script type="text/javascript" src="js/slider.js"></script>
	<script type="text/javascript" src="js/builder.js"></script>

	<script type="text/javascript">
		window.addEvent('domready',function(){
			var b = new builder({
			    onDepsLoaded: function(){ 
			        b.setProfile(<?php echo $profile ?>);
			    }
			});
		});
	</script>
	
</head>
<body>

	<h1>JxLib Downloads Builder</h1>
	
	<p>This page allows you to build a custom version of JxLib, <a href="http://www.mootools.net">MooTools Core and More</a>.</p>
	<p>The release version of JxLib includes every possible option and it includes complete copies of <a href="http://www.mootools.net">MooTools Core and More</a>.  While convenient for development, you may wish to strip out components of JxLib and/or MooTools that you don't need to minimize file sizes in your production site.  If you want to include everything from JxLib, then you should just use the release package since it contains full and standalone builds in compressed and uncompressed formats.</p>
	<h2>Icon Meanings</h2>
	<ul>
		<li><img alt="gray check mark" src="img/check-gray16.png"> - 
			No files in the section have been selected.</li>
		<li><img alt="blue check mark" src="img/check-blue16.png"> -
			Some, but not all, files in the section have been selected.</li>
		<li><img alt="green check mark" src="img/check-green16.png"> - 
			All of the files in that section have been selected.</li>
	</ul>
	
	<h2>Profiles</h2>
	<p>Each download comes with a profile.json file that you can upload here to get the exact same download configuration.</p>
	<form action="index.php" id="profile-form" enctype="multipart/form-data" method="post">
	<label for="profile">Profile File: </label><input type="file" name="profile" id="profile">
	<br/><input type="submit" value="Load Profile">
	</form>
	
	
	<!-- Start the actual builder -->
	<form action="builder.php" id="builder-form" method="post">
		<!-- Mootools Core -->
		<div id="moo-core">
			<div class="library">
				<p>Mootools Core</p>
				<div>
					<label>Include this Library:</label>
					<input type="checkbox" name="mootools-core"	id="mootools-core"/>
				</div>
				<br class="clear">
			</div>
			<div class="library-selector" id="core-selector">
				<div>
					<input type="radio" name="core" value="full" id="core-full"/>
					<label>Include full library</label>
				</div>
				<div>
					<input type="radio" name="core" value="deps" id="core-deps"/>
					<label>Include dependencies only</label>
				</div>
				<br class="clear">
			</div>
			<div class="files" id="core-files">
				<table>
					<?php 
						foreach($deps['core'] as $folder => $files){
							echo "<div class=\"folder\" id=\"core-".$folder."\"><span class=\"folder-name\">".$folder."</span>";
							echo "<span class=\"toggles\">Select: <span class=\"all\">all</span> | <span class=\"none\">none</span></span></span>";
							echo "</div>";
							echo "<div class=\"filelist\">";
							foreach($files as $name => $a){
								echo "<div class=\"file\">";
								echo "<span class=\"check\"><input type=\"checkbox\" name=\"files[]\" value=\"".$name."\" id=\"".$name."\" class=\"dep\"></span>";
								echo "<span class=\"name\">".$name."</span>";
								echo "<span class=\"desc\">".$a['desc']."</span>";
								echo "<br class=\"clear\"/>";
								echo "</div>";
							}
							echo "</div>";
						}
					?>
				</table>
			</div>
		</div>
		<!-- Mootools More -->
		<div id="moo-more">
			<div class="library spacer">
				<p>Mootools More</p>
				<div>
					<label>Include this Library:</label>
					<input type="checkbox" name="mootools-more"	id="mootools-more"/>
				</div>
				<br class="clear">
			</div>
			<div class="library-selector" id="more-selector">
				<div>
					<input type="radio" name="more" id="more-full" value="full"/>
					<label>Include full library</label>
				</div>
				<div>
					<input type="radio" name="more" id="more-deps" value="deps"/>
					<label>Include dependencies only</label>
				</div>
				<br class="clear">
			</div>
			<div class="files" id="more-files">
				<?php 
					foreach($deps['more'] as $folder => $files){
						echo "<div class=\"folder\" id=\"more-".$folder."\"><span class=\"folder-name\">".$folder."</span>";
						echo "<span class=\"toggles\">Select: <span class=\"all\">all</span> | <span class=\"none\">none</span></span></span>";
						echo "</div>";
						echo "<div class=\"filelist\">";
						foreach($files as $name => $a){
							echo "<div class=\"file\">";
							echo "<span class=\"check\"><input type=\"checkbox\" name=\"files[]\" value=\"".$name."\" id=\"".$name."\" class=\"dep\"></span>";
							echo "<span class=\"name\">".$name."</span>";
							echo "<span class=\"desc\">".$a['desc']."</span>";
							echo "<br class=\"clear\"/>";
							echo "</div>";
						}
						echo "</div>";
					}
				?>
			
			</div>
		</div>
		<!-- JxLib -->
		<div class="library spacer">
			<p>JxLib</p>
			<br class="clear">
		</div>
		<div class="files">		
			<?php 
				foreach($deps['jxlib'] as $folder => $files){
						echo "<div class=\"folder\" id=\"jxlib-".$folder."\"><span class=\"folder-name\">".$folder;
						echo "<span class=\"toggles\">Select: <span class=\"all\">all</span> | <span class=\"none\">none</span></span></span></span>";
						$desc = array_shift($files);
						echo "<span class=\"description\">".$desc."</span>";
						echo "</div>";
						echo "<div class=\"filelist\">";
						foreach($files as $name => $a){
							echo "<div class=\"file\">";
							echo "<span class=\"check\"><input type=\"checkbox\" name=\"files[]\" value=\"".$name."\" id=\"".$name."\" class=\"dep\"></span>";
							echo "<span class=\"name\">".ucfirst($name)."</span>";
							echo "<span class=\"desc\">".$a['desc']."</span>";
							echo "<br class=\"clear\"/>";
							echo "</div>";
						}
						echo "</div>";
					}
			?>
		</div>
		
		<div id="options">
			<!-- Optional Dependencies -->
			<h2>Dependencies</h2>
			<div id="dependencies">
				<input type="checkbox" name="opt-deps" id="opt-deps"/><label>Include Optional Dependencies</label>
			</div>
			<!-- Build options -->
			<h2 class="toggle">Build and Compression options  <span class="defaults">- selected: <span id="build-choice">jxlib,jxlib.uncompressed</span></span></h2>
			<div id="build">
				<p>Select the build configurations to include in your download package:</p>

				<p>Select: <span id="build-all">all</span> | <span id="build-default">default</span> | <span id="build-none">none</span></p>
								
				<div>
					<input type="checkbox" name="build[]" id="build-jxlib" value="jxlib" checked="checked" /><label for="build-jxlib">jxlib.js - combines all requested files into a single compressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-jxlib-uncompressed" value="jxlib.uncompressed" checked="checked" /><label for="build-jxlib-uncompressed">jxlib.uncompressed.js - combines all requested files into a single uncompressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-jxlib-standalone" value="jxlib.standalone" /><label for="build-jxlib-standalone">jxlib.standalone.js - combines all jxlib files into a single compressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-jxlib-standalone-uncompressed" value="jxlib.standalone.uncompressed" /><label for="build-jxlib-standalone-uncompressed">jxlib.standalone.uncompressed.js - combines all jxlib files into a single uncompressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-mootools" value="mootools" /><label for="build-mootools">mootools.js - combines all mootools core and more files into a single compressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-mootools-uncompressed" value="mootools.uncompressed" /><label for="build-mootools-uncompressed">mootools.uncompressed.js - combines all mootools core and more files into a single uncompressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-mootools-core" value="mootools.core" /><label for="build-mootools-core">mootools.core.js - combines all mootools core files into a single compressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-mootools-core-uncompressed" value="mootools.core.uncompressed" /><label for="build-mootools-core-uncompressed">mootools.core.uncompressed.js - combines all mootools core files into a single uncompressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-mootools-more" value="mootools.more" /><label for="build-mootools-more">mootools.more.js - combines all mootools more files into a single compressed file</label>
				</div>
				<div>
					<input type="checkbox" name="build[]" id="build-mootools-more-uncompressed" value="mootools.more.uncompressed" /><label for="build-mootools-more-uncompressed">mootools.more.uncompressed.js - combines all mootools more files into a single uncompressed file</label>
				</div>
				
			</div>
			<!-- compression options -->
			<h2 class="toggle">Compression <span class="defaults">- selected: <span id="js-choice">JsMin</span> Compression, <span id="file-choice">.tar.gz</span> file type</span></h2>
			<div id="compression">
				<p>Choose one of the following Javascript compression types:</p>
			
				<div id="j-compress">
					<div>
						<input name="j-compress" type="radio" value="jsmin" checked="checked" id="jsmin" /><label><span>JsMin</span> by Douglas Crockford (default)</label>
					</div>
					<div>
						<input name="j-compress" type="radio" value="packer" id="packer" /><label><span>Packer</span> by Dean Edward</label>
					</div>
				</div>
				<p>And also one of the following archive/compression combinations for your downloaded file:</p>
				<div id="f-compress">
					<div>
						<input name="f-compress" type="radio" value="gzip" id="gzip" checked="checked" /><label>Tar archive format with gzip compression - <span>.tar.gz</span> (default)</label>
					</div>
					<div>
						<input name="f-compress" type="radio" value="bz2" id="bz2" /><label>Tar archive format with bz2 compression - <span>.tar.bz2</span></label>
					</div>
					<div>
						<input name="f-compress" type="radio" value="zip" id="zip" /><label>Zip archive format - <span>.zip</span></label>
					</div>
				</div>
			</div>
		</div>
		<div id='download'></div>
			<!-- Launch builder button -->

	</form>
</body>
</html>