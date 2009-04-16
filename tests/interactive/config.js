UnitTester.site = 'JxLib';
UnitTester.title = 'Interactive Unit Test Framework';

//will need to rename the src directory to Source for this to work without 
//modifications, also may need to think about moving the source for mootools
//especially if we deploy this to the website. The paths here are svn related
//and would probably change if moved to www.
window.addEvent('load', function(){
	new UnitTester({
		"jxlib": '../..',
		"mootools-core": '../../../vendor/mootools-core/current',
		"mootools-more": '../../../vendor/mootools-more/current'
	}, {
		Scripts: 'UserTests/'
	});
});