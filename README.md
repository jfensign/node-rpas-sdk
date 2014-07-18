node-rpas-sdk
=============

SDK for the RPAS Cloud REST API

[![NPM](https://nodei.co/npm/node-rpas-sdk.png?compact=true)](https://nodei.co/npm/node-rpas-sdk/)

##Usage

``` javascript

var rpas = require('node-rpas-sdk')

rpas.config({
 "api-version": "v1",
 "username": "", //unless using token auth
 "password": "", //unless using token auth
 "token": ""
}).
then(function(me) {
 //With streams
 rpas.taxonomies.list.stream().pipe(process.stdout)
 return rpas.taxonomies.list
}, 
handle_error).
then(function(list_resource) {
 //With promises
 list_resource.promise().then(console.log, handle_error)
 return list_resource
}, 
handle_error).
then(function(list_resource) {
 //With traditional callbacks
 list_resource.cb({}, function(e, rd, data) {
  if(e) return handle_error(e)
  console.log("%s\n", JSON.stringify(data, null, 4))
 })
}, handle_error)
```
