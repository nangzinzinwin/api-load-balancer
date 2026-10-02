const http = require("http");

const backends = [
  { host: "localhost", port: 3001 },
    { host: "localhost", port: 3002 }
    ];

    let currentBackend = 0;

    const server = http.createServer((req, res) => {
      const backend = backends[currentBackend];

        currentBackend = (currentBackend + 1) % backends.length;

          const options = {
              hostname: backend.host,
                  port: backend.port,
                      path: req.url,
                          method: req.method,
                              headers: req.headers
                                };

                                  const proxy = http.request(options, (backendRes) => {
                                      res.writeHead(backendRes.statusCode, backendRes.headers);
                                          backendRes.pipe(res);
                                            });

                                              proxy.on("error", () => {
                                                  res.writeHead(502);
                                                      res.end("Backend server unavailable");
                                                        });

                                                          req.pipe(proxy);
                                                          });

                                                          server.listen(3000, () => {
                                                            console.log("Load balancer running on port 3000");
                                                            });