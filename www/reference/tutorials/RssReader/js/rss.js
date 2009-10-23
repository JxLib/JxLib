window.addEvent('load', function(){ new RssReader(); });

var RssReader = new Class({
    feeds: null,
    initialize: function() {
        this.feeds = [];
        this.draw();        
        this.addFeed('http://www.smashingmagazine.com/wp-rss.php');
    },
    
    draw: function() {
        var rssToolbar = new Jx.Toolbar();

        rssToolbar.add(
            new Jx.Button({
                label: 'Subscribe',
            }), 
            new Jx.Button({
                label: 'Refresh All'
            })
        );

        var statusBar = new Jx.Toolbar({
            position: 'bottom'
        });

        statusBar.add(
            new Jx.Button({
                label: 'something',
            }), 
            new Jx.Button({
                label: 'else'
            })
        );

        var rssReader = new Jx.Panel({
            label: 'Moo.Jx RSS News Reader',
            toolbars: [rssToolbar, statusBar],
            collapse: false,
            parent: document.body
        });
        
        var rssSplit = new Jx.Splitter(rssReader.content);

        var feedList = new Jx.Panel({
            label: 'Feeds',
            collapse: false,
            maximize: true
        });

        this.feedTree = new Jx.Tree(feedList.content);
        this.allFeeds = new Jx.TreeFolder({label: 'All Feeds'});
        this.feedTree.append(this.allFeeds);

        this.feedFavorites = new Jx.Panel({
            label: 'Favorites',
            collapse: false,
            maximize: true
        });
        var panelSet = new Jx.PanelSet(rssSplit.elements[0], [feedList, this.feedFavorites]);

        var feedSplit = new Jx.Splitter(rssSplit.elements[1], {
            layout: 'vertical'
        });
        this.feedGrid = new Jx.Grid(feedSplit.elements[0], {
            columnHeaders: true
        });

        var feedContent = new Jx.Button({
            label: 'Content',
            toggle: true
        });
        var feedHeader = new Jx.Button({
            label: 'Header',
            toggle: true
        });
        new Jx.ButtonSet().add(feedContent, feedHeader);

        var articleToolbar = new Jx.Toolbar();
        articleToolbar.add(feedContent, feedHeader);

        this.feedArticle = new Jx.Panel({
            hideTitle: true,
            toolbars: [articleToolbar]
        });
        this.feedArticle.addTo(feedSplit.elements[1]);
    },
    
    addFeed: function(url) {
        var feed = new RssGridModel({
            url: url,
            onSuccess: function(feed) {
                this.feedGrid.setModel(feed);
            },
            onSelect: function(article) {
                this.feedArticle.content.innerHTML = article.description;
            }
        });
    }
});

var RssGridModel = new Class({
    Implements: [Events, Options],
    selectedRow: null,
    columnHeaders: ['Title', 'Date Published'],
    columnWidths: [200,100],
    initialize: function(options) {
        this.setOptions(options);
        new Request({
            url:'php/getRSS.php', 
            data:{url: this.options.url}, 
            onSuccess: (function(json){
                eval('this.feedInfo = '+json);
                this.fireEvent('success', this);
            }).bind(this), 
            onFailure: (function(){
                this.fireEvent('failure', this);
            }).bind(this)
        }).send();
    },
    addGridListener: function() {},
    removeGridListener: function() {},
    getColumnCount: function() {return this.columnHeaders.length;},
    getColumnHeaderHTML: function(col) {return this.columnHeaders[col]; },
    getColumnHeaderHeight: function() { return 25 },
    getColumnWidth: function(col) { return this.columnWidths[col]; },
    getRowHeaderHTML: function(row) { return row },
    getRowHeaderWidth: function() { return 24 },
    getRowHeight: function(row) { return 20 },
    getRowCount: function() {
        if (this.feedInfo) {
            return this.feedInfo.items.length;
        } else {
            return 0;
        }
    },
    getValueAt: function(row, col) {
        if (this.feedInfo && row < this.feedInfo.items.length) {
            if (col == 0) {
                return this.feedInfo.items[row].title;
            } else if (col == 1) {
                return this.feedInfo.items[row].pubDate;
            } else {
                return '';
            }
        }
    },
    isCellEditable: function() { return false },
    setValueAt: function(row, col, value) {},
    rowSelected: function(grid, row) {
        if (this.selectedRow != null) {
            grid.selectRow(this.selectedRow, false);
        }
        this.selectedRow = row;
        grid.selectRow(row, true);
        this.fireEvent('select', this.feedInfo.items[row]);
    },
    cellSelected: function(grid, row,col) { this.rowSelected(grid,row); },
});