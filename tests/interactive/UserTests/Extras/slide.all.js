{
    tests: [
        {
            title: "Slide - height",
            description: "This tests that the slide works correctly. The blue div should be the trigger and the red div should hide/reveal.",
            verify: "Did the slide (height) work correctly?",
            before: function(){
                var trigger = new Element('div', {
                    styles: {
                        'background-color': '#0000ff',
                        'width': '100%',
                        'height': 50
                    }
                });
  
                var target = new Element('div', {
                    styles: {
                        'background-color': '#ff0000',
                        'width': '100%'
                    }
                });
                
                target.grab($('sample-text').clone().setStyle('display','block'));
            
                var container = $('container');
                container.empty();
                
                container.adopt(trigger,target);
                
                var slide = new Jx.Slide({
                    target: target,
                    trigger: trigger,
                    type: 'height'
                });
                
            },
            body: "",
            post: function(){
                
            }
        },
        {
            title: "Slide - width",
            description: "This tests that the slide works correctly. The blue div should be the trigger and the red div should hide/reveal.",
            verify: "Did the slide (width) work correctly?",
            before: function(){
                var trigger = new Element('div', {
                    styles: {
                        'background-color': '#0000ff',
                        'width': '25%',
                        'float': 'left',
                        'height': 200
                    }
                });
  
                var target = new Element('div', {
                    styles: {
                        'background-color': '#ff0000',
                        'width': '73%',
                        'float': 'left'
                    }
                });
                
                target.grab($('sample-text').clone().setStyle('display','block'));
                
                var container = $('container');
                container.empty();
                
                container.adopt(trigger,target);
                
                var slide = new Jx.Slide({
                    target: target,
                    trigger: trigger,
                    type: 'width',
                    setOpenTo: '73%'
                });
                
            },
            body: "",
            post: function(){
                
            }
        }
        
    ]
}
