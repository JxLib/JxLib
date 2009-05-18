describe('common tests',{
	'Jx should be defined': function(){
		value_of($defined(Jx)).should_be_true();
	},
	'Family mutator check': function(){
		var c = new Class({
			Family: 'Jx.Widget'
		});
		newC = new c();
		value_of($type(newC)).should_be('Jx.Widget');
	},
    'Jx.getNumber()':function() {
        value_of(Jx.getNumber()).should_be(0);
        value_of(Jx.getNumber('letter')).should_be(0);
        value_of(Jx.getNumber(10)).should_be(10);
    }
});

describe('Element extension tests', {
	'before': function(){
		el = new Element('div',{
	        'styles':{
	            'border':'1px solid #000',
	            'padding':'1px',
	            'margin':'1px',
	            'width':'1px',
	            'height':'1px',
	            'position':'absolute'
	        }
	    });
	    el.inject(document.body);
	},
    'Element.getContentBoxSize()':function() {
        var size = el.getContentBoxSize();
        el.destroy();
        value_of(size.width).should_be(1);
        value_of(size.height).should_be(1);
    },
    'Element.getBorderBoxSize()':function() {
        var size = el.getBorderBoxSize();
        el.destroy();
        value_of(size.width).should_be(5);
        value_of(size.height).should_be(5);
    },
    'Element.getMarginBoxSize()':function() {
        var size = el.getMarginBoxSize();
        el.destroy();
        value_of(size.width).should_be(7);
        value_of(size.height).should_be(7);
    },
    'Element.setContentBoxSize':function() {
        el.setContentBoxSize({'width':2,'height':2});
        var size = el.getContentBoxSize();
        el.destroy();
        value_of(size.width).should_be(2);
        value_of(size.height).should_be(2);
    },
    'Element.setBorderBoxSize':function() {
        el.setBorderBoxSize({'width':10,'height':10});
        var size = el.getContentBoxSize();
        var bsize = el.getMarginBoxSize();
        el.destroy();
        value_of(size.width).should_be(4);
        value_of(size.height).should_be(4);
        value_of(bsize.width).should_be(10);
        value_of(bsize.height).should_be(10);
    },
    'Element.getPaddingSize':function() {
        var size = el.getPaddingSize();
        el.destroy();
        value_of(size.left).should_be(1);
        value_of(size.top).should_be(1);
        value_of(size.right).should_be(1);
        value_of(size.bottom).should_be(1);
    },
    'Element.getBorderSize':function() {
        var size = el.getBorderSize();
        el.destroy();
        value_of(size.left).should_be(1);
        value_of(size.top).should_be(1);
        value_of(size.right).should_be(1);
        value_of(size.bottom).should_be(1);
    } ,
    'Element.getMarginSize':function() {
        var size = el.getMarginSize();
        el.destroy();
        value_of(size.left).should_be(1);
        value_of(size.top).should_be(1);
        value_of(size.right).should_be(1);
        value_of(size.bottom).should_be(1);
    }
});