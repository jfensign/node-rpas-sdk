request = require 'request'

q = require 'q'

resources =
	users: "users"
	roles: "roles"
	taxonomies: "taxonomies"
	rated_items: "rated_items"
	workflows: "workflows"
	authenticate: "authenticate"

base_uri = "http://54.214.50.90"

rpas_headers = 
	"api-version": "v1"
	"x-its-rpas": null

resolve_uri = (resource, params...) ->
	["#{base_uri}/#{resources[resource]}", params].join "/"

exports.config = (options) ->
	deferred = do q.defer

	rpas_headers["api-version"] = options["api-version"] if options["api-version"]

	if options.token
		rpas_headers["x-its-rpas"] = options.token

		q.resolve options

	else
		if options.username and options.password
			auth_encoded_str = new Buffer("#{options.username}:#{options.password}").toString "base64"
			auth_string = "Basic #{auth_encoded_str}"
			request
				method: "post" 
				url: resolve_uri "authenticate"
				headers:
					"Authorization": auth_string
				(e, r, b) ->
					try
						b = JSON.parse(b)
						console.log(b.Auth)
						if b.Auth
							console.log("AUTHED")
							rpas_headers["x-its-rpas"] = b.Auth.RequestToken
							deferred.resolve b
						else
							console.log("NOT AUTHED")
							deferred.reject e or b
					catch e
					  deferred.reject e or b

	deferred.promise

for key of resources
	exports[key] = 
		list: (query) ->
			deferred =  do q.defer

			request
			  url: resolve_uri "taxonomies"
			  qs: query
			  headers: rpas_headers
			  json: true
			  (e, r, b) -> if e then deferred.reject e else deferred.resolve b

	 		deferred.promise

		select: (id, query) ->
			deferred = do q.defer

			request
			  url: resolve_uri "taxonomies", id
			  qs: query
			  headers: rpas_headers
			  json: true
			  (e, r, b) -> if e then deferred.reject e else deferred.resolve b

			deferred.promise


