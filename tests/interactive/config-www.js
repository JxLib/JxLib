UnitTester.site = 'JxLib';
UnitTester.title = 'Interactive Unit Test Framework';

window.addEvent('load', function(){
	new UnitTester({
		"jxlib": '../../builder/src/jxlib',
		"mootools-core": '../../builder/src/core',
		"mootools-more": '../../builder/src/more'
	}, {
		Scripts: 'UserTests/'
	});
});