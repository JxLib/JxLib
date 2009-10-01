{
    tests: [
        {
            title: "Dataview using base store",
            description: "This tests that the dataview works. This tests using the base store with it prefilled with data.",
            verify: "Did the dataview work correctly?",
            before: function(){
                $('container').empty();
                var store = new Jx.Store({
                    columns: [{
                        name: 'id',
                        type: 'numeric'
                    },{
                        name: 'filename',
                        type: 'alphanumeric'
                    },{
                        name: 'caption',
                        type: 'alphanumeric'
                    }]
                });
                var data = [
                    { id: 0, filename: 'img_0581.jpg', caption: 'a picture' },
                    { id: 1, filename: 'img_0582.jpg', caption: 'a picture' },
                    { id: 2, filename: 'img_0583.jpg', caption: 'a picture' },
                    { id: 3, filename: 'img_0584.jpg', caption: 'a picture' },
                    { id: 4, filename: 'img_0585.jpg', caption: 'a picture' },
                    { id: 5, filename: 'img_0586.jpg', caption: 'a picture' },
                    { id: 6, filename: 'img_0587.jpg', caption: 'a picture' },
                    { id: 7, filename: 'img_0588.jpg', caption: 'a picture' },
                    { id: 8, filename: 'img_0589.jpg', caption: 'a picture' },
                    { id: 9, filename: 'img_0590.jpg', caption: 'a picture' },
                    { id: 10, filename: 'img_0591.jpg', caption: 'a picture' },
                    { id: 11, filename: 'img_0592.jpg', caption: 'a picture' },
                    { id: 12, filename: 'img_0593.jpg', caption: 'a picture' },
                    { id: 13, filename: 'img_0594.jpg', caption: 'a picture' },
                    { id: 14, filename: 'img_0595.jpg', caption: 'a picture' },
                    { id: 15, filename: 'img_0596.jpg', caption: 'a picture' },
                    { id: 16, filename: 'img_0597.jpg', caption: 'a picture' },
                    { id: 17, filename: 'img_0598.jpg', caption: 'a picture' },
                    { id: 18, filename: 'img_0599.jpg', caption: 'a picture' },
                    { id: 19, filename: 'img_0600.jpg', caption: 'a picture' },
                    { id: 20, filename: 'img_0601.jpg', caption: 'a picture' },
                    { id: 21, filename: 'img_0602.jpg', caption: 'a picture' },
                    { id: 22, filename: 'img_0603.jpg', caption: 'a picture' },
                    { id: 23, filename: 'img_0604.jpg', caption: 'a picture' },
                    { id: 24, filename: 'img_0605.jpg', caption: 'a picture' },
                    { id: 25, filename: 'img_0606.jpg', caption: 'a picture' },
                    { id: 26, filename: 'img_0607.jpg', caption: 'a picture' }
                ];
                store.load(data);
                
                //the dataview takes a store and some templates to create the view
                //the developer is responsible for styling them. All panel options
                //apply as well.
                var dv = new Jx.Panel.DataView({
                    label: 'Some Random Pictures',
                    close: false,
                    data: store,
                    sortColumns: ['id'],
                    containerClass: 'jxDVContainer',
                    itemClass: 'jxDVItem',
                    itemTemplate: '<img src="UserTests/Panel/assets/{filename}" alt="{caption}"/><span>{caption}</span>',
                    emptyTemplate: '<div>No items to display</div>'
                });
                
                dv.addTo('container');
                dv.domObj.resize();
                
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Dataview using base store",
            description: "This tests that the dataview works. This tests using the base store with it being filled after the dataview is created.",
            verify: "Did the dataview work correctly?",
            before: function(){
                $('container').empty();
                var store = new Jx.Store({
                    columns: [{
                        name: 'id',
                        type: 'numeric'
                    },{
                        name: 'filename',
                        type: 'alphanumeric'
                    },{
                        name: 'caption',
                        type: 'alphanumeric'
                    }]
                });
                var data = [
                    { id: 0, filename: 'img_0581.jpg', caption: 'a picture' },
                    { id: 1, filename: 'img_0582.jpg', caption: 'a picture' },
                    { id: 2, filename: 'img_0583.jpg', caption: 'a picture' },
                    { id: 3, filename: 'img_0584.jpg', caption: 'a picture' },
                    { id: 4, filename: 'img_0585.jpg', caption: 'a picture' },
                    { id: 5, filename: 'img_0586.jpg', caption: 'a picture' },
                    { id: 6, filename: 'img_0587.jpg', caption: 'a picture' },
                    { id: 7, filename: 'img_0588.jpg', caption: 'a picture' },
                    { id: 8, filename: 'img_0589.jpg', caption: 'a picture' },
                    { id: 9, filename: 'img_0590.jpg', caption: 'a picture' },
                    { id: 10, filename: 'img_0591.jpg', caption: 'a picture' },
                    { id: 11, filename: 'img_0592.jpg', caption: 'a picture' },
                    { id: 12, filename: 'img_0593.jpg', caption: 'a picture' },
                    { id: 13, filename: 'img_0594.jpg', caption: 'a picture' },
                    { id: 14, filename: 'img_0595.jpg', caption: 'a picture' },
                    { id: 15, filename: 'img_0596.jpg', caption: 'a picture' },
                    { id: 16, filename: 'img_0597.jpg', caption: 'a picture' },
                    { id: 17, filename: 'img_0598.jpg', caption: 'a picture' },
                    { id: 18, filename: 'img_0599.jpg', caption: 'a picture' },
                    { id: 19, filename: 'img_0600.jpg', caption: 'a picture' },
                    { id: 20, filename: 'img_0601.jpg', caption: 'a picture' },
                    { id: 21, filename: 'img_0602.jpg', caption: 'a picture' },
                    { id: 22, filename: 'img_0603.jpg', caption: 'a picture' },
                    { id: 23, filename: 'img_0604.jpg', caption: 'a picture' },
                    { id: 24, filename: 'img_0605.jpg', caption: 'a picture' },
                    { id: 25, filename: 'img_0606.jpg', caption: 'a picture' },
                    { id: 26, filename: 'img_0607.jpg', caption: 'a picture' }
                ];
                
                //the dataview takes a store and some templates to create the view
                //the developer is responsible for styling them. All panel options
                //apply as well.
                var dv = new Jx.Panel.DataView({
                    label: 'Some Random Pictures',
                    close: false,
                    data: store,
                    sortColumns: ['id'],
                    containerClass: 'jxDVContainer',
                    itemClass: 'jxDVItem',
                    itemTemplate: '<img src="UserTests/Panel/assets/{filename}" alt="{caption}"/><span>{caption}</span>',
                    emptyTemplate: '<div>No items to display</div>'
                });
                
                store.load(data);
                
                dv.addTo('container');
                dv.domObj.resize();
                
            },
            body: "",
            post: function(){
                
            }
        }
    ],
    otherScripts: ["mergesort"]
}
