/**
 * This is a requirejs loader plugin that can load Jx Components
 *
 * use:
 *
 * define(['jx!button'],function(button){
 *     //use button here...
 * });
 *
 * or
 *
 * require(['jx!button'],function(button){
 *     //use button here...
 * });
 *
 * The key is really the normalize function which takes a Jx class name and turns it into a file path.
 */



define('jx',{
    normalize: function(name, normalize){
        
        //first replace the '.' with '/'
        name = name.toLowerCase().replace('.','/');
        
        //add jx to the beginning and '.js' to the end
        if (name.indexOf('jx/') != 0) {
            name = 'jx/' + name;
        }
        
        return normalize(name);
        
    },
    
    load: function(name, req, load, config){
        //just require it as it should have been normalized to the correct path
        req([name], function (value) {
            load(value);
        });
    }
});