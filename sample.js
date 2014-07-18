var
rpas = require("./lib"),

_ = require('underscore'),

taxonomy_paths = [],

extract = function extract_paths(root) {
 var delimiter = " | ";
 
 var 
 path = root.original_path || root.name,
 recurse = function () {
  var 
  paths = [].concat.apply([], root.children.
   map(function (v) {
    if(v.original_path)
     return extract_paths(v, path);
    }).
    filter(function(v) {
     return v;
    }));

  paths.push(path);

  return paths;
 };
 
 return root.children
  ? recurse(root)
  : path;
},

handle_error = function(e) {
 console.error(e)
},
Do = function() {

 rpas.config({
  "api-version": "v1",
  "username": "client_100_admin",
  "password": "13705754"
 }).
 then(function(config) {
  var 
  taxonomies_p = rpas.taxonomies.list().
   then(function(taxonomies) {
   	console.log(JSON.stringify(_.extend.apply({}, taxonomies.
   	 map(function(taxonomy) {
   	  var
   	  tmp = {}

   	  tmp[taxonomy.TaxonomyName] = extract(taxonomy.TaxonomyLevels[0]).
   	   sort(function(a, b) {
   	    var norm = function(x) {
   	     return x.toUpperCase()
   	    }

   	    a = norm(a)
   	    b = norm(b)

   	    return a<b?-1:a>b?1:0

   	   })

   	  return tmp
   	 })), null, 4))
   },
   function(e) {
   	console.error(e)
   }).
   done()
 },
 function(e) {
  console.log("CONFIG ERROR")
 }).
 done()

}()
