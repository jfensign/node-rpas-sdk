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

handle_error = function(error) {
 console.error("Error encountered.\nInfo: %s", JSON.stringify(error))
},

flatten_taxonomy_paths = function() {
 var 
 taxonomies_p = rpas.taxonomies.list.promise().then(function(taxonomies) {
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
  console.log("%s\n\n\n", JSON.stringify(grouped_paths, null, 4))

 },
 function(e) {
  console.error(e)
 }).done()
}

rpas.config({
 "api-version": "v1",
 "username": "",
 "password": ""
}).
then(function(me) {
 //With streams
 rpas.taxonomies.list.stream().pipe(process.stdout)
 return rpas.taxonomies.list
}, handle_error).then(function(list_resource) {
 //With promises
 list_resource.promise().then(flatten_taxonomy_paths, handle_error)
 return list_resource
}, handle_error).then(function(list_resource) {
 //With traditional callbacks
 list_resource.cb({}, function(e, rd, data) {
  if(e) return handle_error(e)
  console.log("%s\n", JSON.stringify(data, null, 4))
 })
}, handle_error)

