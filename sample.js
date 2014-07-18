var
rpas = require("./lib"),

_ = require('underscore'),

extract = function extract_paths(root) {
 var 
 path = root.original_path || root.name,
 delimiter = " | ",
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

handle_auth_error = function(error) {
 console.error("Could not authenticate.\nInfo: %s", JSON.stringify(error))
},

flatten_taxonomy_paths = function() {
 var 
 taxonomies_p = rpas.taxonomies.list().then(function(taxonomies) {
  var
  grouped_paths = _.extend.apply({}, taxonomies.map(function(taxonomy) {
   var
   tmp = {}

   tmp[taxonomy.TaxonomyName] = extract(taxonomy.TaxonomyLevels[0]).
    sort(function(a, b) {
     var 
     norm = function(x) {
      return x.toUpperCase()
     }

     a = norm(a)
     b = norm(b)

     return a<b?-1:a>b?1:0

    })

   return tmp
  }))

  //Do something with paths
  console.log(JSON.stringify(grouped_paths, null, 4))

 },
 function(e) {
  console.error(e)
 }).done()
}

rpas.config({
 "api-version": "v1",
 "username": "client_100_admi",
 "password": "13705754"
}).
then(flatten_taxonomy_paths, handle_auth_error)

