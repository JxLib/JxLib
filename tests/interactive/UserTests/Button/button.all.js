{
    tests: [
        {
            title: "Button - Visual Representation",
            description: "This test is to verify that the button displays properly.",
            verify: "Do you see a fully formed button in window? It won't do anything, just be sure that all the appropriate parts are there and that it looks correct.",
            before: function(){
	        	new Jx.Button({
	        		label: 'Just a label',
	        		tooltip: 'a tooltip',
	        		image: 'UserTests/Button/assets/crispin.png'
	        	}).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        },{
        	title: "Button - Hover",
        	description: "This test is to verify that the hover state is correct.",
        	verify: "Does the button change states when you hover over it?",
        	before: function(){},
        	body:"",
        	post: function(){}
        },{
        	title: "Button - Tooltip",
        	description: "This test is to verify that the tooltip shows up.",
        	verify: "Does the tooltip show when you mouse over the button and pause?",
        	before: function(){},
        	body:"",
        	post: function(){}
        },{
            title: "Button - Set Tooltip",
            description: "This test is to verify that the tooltip changes when setTooltip is called.",
            verify: "Does the tooltip change from 'a tooltip' to 'a changed tooltip' when you click the button?",
            before: function(){
                document.id('button').empty();
                var btn = new Jx.Button({
                    label: 'Click to change the tooltip',
                    tooltip: 'a tooltip',
                    image: 'UserTests/Button/assets/crispin.png',
                    onClick: function(){
                        btn.setTooltip('a changed tooltip');
                    }
                });
                
                btn.addTo('button');
            },
            body:"",
            post: function(){}
        }
        
    ]
}
