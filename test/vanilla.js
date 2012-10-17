// Basic Node.js webserver boilerplate
var http = require("http")
  , url = require("url")
;

// Include and configure slow-proxy
var proxy = require("../lib/slow-proxy");
proxy.set("hostname", "www.my-other-site.com");

var app = http.createServer(function( req, res ) {
  var parsed_url = url.parse(req.url)
    , relative_url = parsed_url.pathname + (parsed_url.search || "")
    , matched_url = relative_url.match(/^\/proxy\/(\d+)(\/.+)$/)
    , delay
    , fetch_url
  ;

  if (matched_url) {
    // Extract data from the match
    delay = matched_url[1];
    fetch_url = matched_url[2];

    // Call the `fetch` method
    proxy.fetch(fetch_url, delay, function( html ) {
      // Forward the response html
      res.end(html);
    });
  }
});

// Listen on port 3000
app.listen(3000);
