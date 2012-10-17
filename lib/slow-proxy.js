var http = require("http")
  , https = require("https")
  , url = require("url")
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
  , opts_props = [
        "headers"
      , "host"
      , "hostname"
      , "method"
      , "path"
      , "port"
      , "protocol"
    ]
;

function fetch( path, delay, callback ) {
  var options = {
          hostname: config.hostname
        , port: config.port
        , protocol: config.protocol
      }
  ;

  if (typeof path == 'string') {
    options.path = path;
  } else if (path != null) {
    opts_props.forEach(function( prop ) {
      if (path[prop] != null) {
        options[prop] = path[prop];
      }
    });
  }

  var html = ""
    , protocol = (options.protocol === "https:" ? https : http)
  ;

  console.log("Fetching: " + options.hostname + options.path);
  protocol.request(options, function( aeRes ) {
    aeRes.on("data", function( data ) {
      html += data.toString();
    }).on("end", function() {
      setTimeout(function() {
        callback(html);
      }, parseInt(delay, 10));
    });
  }).on('error', function(e) {
      console.log("Got error: " + e.message);
  }).end();
}

function route( app, basepath, reqType ) {
  if (!basepath) basepath = config.route_path_prefix;
  console.log("Setting up " + (reqType || "") + " route for path: " + basepath);
  app[reqType || "get"](new RegExp(basepath.replace(/\//g, "\\/") + "(\\d+)/(.*)$"), function(request, response) {
    fetch("/" + request.params[1] + (url.parse(request.url).search || ""), request.params[0], function( html ) {
      response.write(html);
      response.end();
    });
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
