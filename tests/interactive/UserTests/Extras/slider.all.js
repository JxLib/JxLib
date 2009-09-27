{
    tests: [
        {
            title: "Slider - basic test",
            description: "This tests that the slider works correctly",
            verify: "Did the slider work normally?",
            before: function(){
                var slider = new Jx.Slider({
                    max: 255,
                    min: 0,
                    step: 1,
                    mode: 'horizontal',
                    wheel: true,
                    snap: false,
                    startAt: 150,
                    offset: 0,
                    onChange: function(step){
                        var el = new Element('p',{
                            'html': 'changed to step ' + step
                        });
                        el.inject($('output'));
                    },
                    onComplete: function(step){
                        var el = new Element('p',{
                            'html': 'completed change to step ' + step
                        });
                        el.inject($('output'));
                    }
                });
                
                slider.addTo('parent');
                
                slider.start();
            
                
            },
            body: "",
            post: function(){
                
            }
        }
        
    ]
}
