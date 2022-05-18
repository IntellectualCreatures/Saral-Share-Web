const http = require("http");
const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  // set response content
  res.writeHead(302, {
    location: "https://www.saralcode.com/apps/saralshare/web",
    //add other headers here...
  });
  res.end();
});

server.listen(PORT);
