UnitTester.site = 'JxLib';
UnitTester.title = 'Interactive Unit Test Framework';

window.addEvent('load', function(){
	new UnitTester({
		"jxlib": '../../src',
		"mootools-core": '../../../vendor/mootools-core/current',
		"mootools-more": '../../../vendor/mootools-more/current'
	}, {
		Scripts: 'UserTests/'
	});
});