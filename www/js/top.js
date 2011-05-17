var refTree;
var panelContent;
var homeTab, refTab, examplesTab, examplesTabNew, testsTab, codeTab, issuesTab, downloadTab;

window.addEvent('load', function() {
    var defaultTab = Cookie.read('JxHomePage.CurrentTab') || 'homeTab';

    /* toolbar to contain the tabs, goes in the panel */
    var toolbarContainer = new Jx.Toolbar.Container({
        scroll: false, 
        autoSize: true
    }).addTo('content');
    
    var toolbar = new Jx.Toolbar();
    toolbarContainer.add(toolbar);
    
    /* create the main navigation tabs */
    homeTab = new Jx.Tab({
        label: 'Home', 
        content: 'homePage',
        onDown: function() {
            (function(){
                window.top.main.location.href = 'home.html';
                Cookie.write('JxHomePage.CurrentTab', 'homeTab');
            }).delay(10);
        }
    });
    /**
    examplesTab = new Jx.Tab({
        label: 'Examples', 
        content: 'exampleList',
        onDown: function() {
            (function() {
                window.top.main.location.href = 'reference/examples';
                Cookie.write('JxHomePage.CurrentTab', 'examplesTab');                
            }).delay(10);
        }
    });
    */
    examplesTab = new Jx.Tab({
        label: 'Examples',
        content: 'exampleListNew',
        cacheContent: true,
        onDown: function() {
            (function() {
                window.top.main.location.href = 'reference/examples/index-new.html';
                Cookie.write('JxHomePage.CurrentTab', 'examplesTab');
            }).delay(10);
        }
    });
    refTab = new Jx.Tab({
        label: 'API Reference', 
        content: 'refList',
        onDown: function() {
            (function(){
                window.top.main.location.href = 'reference/api';
                Cookie.write('JxHomePage.CurrentTab', 'refTab');
            }).delay();
        }
    });
    testsTab = new Jx.Tab({
        label: 'Tests', 
        content: 'testList',
        onDown: function() {
            (function(){
                window.top.main.location.href = 'tests';
                Cookie.write('JxHomePage.CurrentTab', 'testsTab');
            }).delay();
        }
    });
    codeTab = new Jx.Tab({
        label: 'Code', 
        onDown: function() {
            (function(){
                window.open('https://github.com/JxLib/JxLib','github');
                Cookie.write('JxHomePage.CurrentTab', 'homeTab');
            }).delay();
        }
    });
    issuesTab = new Jx.Tab({
        label: 'Issues', 
        onDown: function() {
            (function(){
                window.open('http://jxlib.lighthouseapp.com/dashboard','issues');
                Cookie.write('JxHomePage.CurrentTab', 'homeTab');
            }).delay();
        }
    });
    groupTab = new Jx.Tab({
        label: 'Group', 
        onDown: function() {
            (function(){
                window.open('http://groups.google.com/group/jxlib','group');
                Cookie.write('JxHomePage.CurrentTab', 'homeTab');
            }).delay();
        }
    });
    downloadTab = new Jx.Tab({
        label: 'Download Builder', 
        onDown: function() {
            (function(){
                window.top.main.location.href = 'builder';
                Cookie.write('JxHomePage.CurrentTab', 'downloadTab');
            }).delay();
        }
    });
    new Jx.TabSet('tabset').add(homeTab, refTab, examplesTab, codeTab, issuesTab, groupTab);
    toolbar.add(homeTab, examplesTab, refTab, codeTab, issuesTab,  groupTab);
    
    switch(defaultTab) {
        case 'homeTab':
            homeTab.setActive(true);
            break;
        case 'refTab':
            refTab.setActive(true);
            break;
        case 'issuesTab':
            issuesTab.setActive(true);
            break;
        case 'examplesTab':
            examplesTab.setActive(true);
            break;
        case 'testsTab':
            testsTab.setActive(true);
            break;
        case 'codeTab':
            codeTab.setActive(true);
            break;
        case 'groupTab':
            groupTab.setActive(true);
            break;
        case 'downloadTab':
            downloadTab.setActive(true);
            break;
    }
});