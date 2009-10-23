{
    tests: [
        {
            title: "List - Construction",
            description: "This test is to verify that the list is built and displays correctly with some initial items.",
            verify: "Do you see a list of 5 items.",
            before: function(){
                var list = document.id('list').retrieve('jxList');
                if (list) list.destroy();
                new Jx.List('list', {
                    items: [
                        new Element('li', {html:"item 1"}),
                        new Element('li', {html:"item 2"}),
                        new Element('li', {html:"item 3"}),
                        new Element('li', {html:"item 4"}),
                        new Element('li', {html:"item 5"})
                    ],
                    hover: false,
                    select: false
                });
                
            },
            body: "",
            post: function(){
            }
        },{
            title: "List - Hover",
            description: "This test is to verify that the list items respond correctly when you mouse over them.",
            verify: "When you mouse over and out of an item, does its visible appearance change?",
            before: function(){
                var list = document.id('list').retrieve('jxList');
                if (list) list.destroy();
                new Jx.List('list', {
                    items: [
                        new Element('li', {html:"item 1"}),
                        new Element('li', {html:"item 2"}),
                        new Element('li', {html:"item 3"}),
                        new Element('li', {html:"item 4"}),
                        new Element('li', {html:"item 5"})
                    ],
                    hover: true,
                    hoverClass: 'jxHover',
                    select: false
                });

            },
            body: "",
            post: function(){
            }
        },{
            title: "List - Select",
            description: "This test is to verify that the list items respond correctly when you click them by selecting them and that there must always be at least one selected item.",
            verify: "When you select an item by clicking, does its visible appearance change?  Do previously selected items become deselected?",
            before: function(){
                var list = document.id('list').retrieve('jxList');
                if (list) list.destroy();
                new Jx.List('list', {
                    items: [
                        new Element('li', {html:"item 1"}),
                        new Element('li', {html:"item 2"}),
                        new Element('li', {html:"item 3"}),
                        new Element('li', {html:"item 4"}),
                        new Element('li', {html:"item 5"})
                    ],
                    hover: true,
                    hoverClass: 'jxHover',
                    select: true,
                    selectClass: 'jxSelected',
                    minimumSelection: 1
                });

            },
            body: "",
            post: function(){
            }
        },{
            title: "List - Select Multiple",
            description: "This test is to verify that the list items respond correctly when it is configured to select multiple items.",
            verify: "When you select an item by clicking, does its visible appearance change?  Are you able to select multiple items?",
            before: function(){
                var list = document.id('list').retrieve('jxList');
                if (list) list.destroy();
                new Jx.List('list', {
                    items: [
                        new Element('li', {html:"item 1"}),
                        new Element('li', {html:"item 2"}),
                        new Element('li', {html:"item 3"}),
                        new Element('li', {html:"item 4"}),
                        new Element('li', {html:"item 5"})
                    ],
                    hover: true,
                    hoverClass: 'jxHover',
                    select: true,
                    selectMode: 'multiple',
                    selectClass: 'jxSelected'
                });

            },
            body: "",
            post: function(){
            }
        }
    ]
}
