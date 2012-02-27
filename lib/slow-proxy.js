var http = require("http")
 ,  url = require("url")
;

// ## Define the configuration defaults
// - `hostname`, `protocol`, & `port` are used directly in the `http.get(...)`
// - `hostname` is required (I can't guess this)
// - `delay` is the minimum time used to hang the response
var config = {
        hostname: ""
      , protocol: "http:"
      , port: 80
      , route_path_prefix: "/proxy/"
    }
;

function fetch( path, delay, callback ) {
  var options = {
          host: config.hostname
        , port: config.port
        , protocol: config.protocol
        , path: path
      }
    , html = ""
  ;

  console.log("Fetching: " + options.host + options.path);
  http.get(options, function( aeRes ) {
    aeRes.on("data", function( data ) {
      html += data.toString();
    }).on("end", function() {
      callback(html);
    });
  }).on('error', function(e) {
      console.log("Got error: " + e.message);
  }).end();
}

function route( app, basepath, reqType ) {
  if (!basepath) basepath = config.route_path_prefix;
  console.log("Setting up " + (reqType || "") + " route for path: " + basepath);
  app[reqType || "get"](new RegExp(basepath.replace(/\//g, "\\/") + "(\\d+)/(.*)$"), function(request, response) {
    setTimeout(function() {
      fetch("/" + request.params[1] + (url.parse(request.url).search || ""), function( html ) {
        response.write(html);
        response.end();
      });
    }, parseInt(request.params[0], 10));
  });
}

// ## Define the exports
// - `fetch` gets the processed html (with all rules applied)
// - `route` sets up an express route with a given **app**
// - `set` defines a configuration property
module.exports = {
    fetch: fetch
  , route: route
  , set: function( prop, value ) {
      config[prop] = value;
    }
};