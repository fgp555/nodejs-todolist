
const http = require("http");

// Mock database
let database = [{ id: 1, name: "task 1" }];

// Helper functions
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body ? JSON.parse(body) : {});
    });
    req.on("error", reject);
  });
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

// Server
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // GET /findAll
  if (method === "GET" && url === "/findAll") {
    sendResponse(res, 200, database);
  }

  // GET /findOne/:id
  else if (method === "GET" && url.startsWith("/findOne/")) {
    const id = parseInt(url.split("/")[2], 10);
    const item = database.find((entry) => entry.id === id);
    if (item) {
      sendResponse(res, 200, item);
    } else {
      sendResponse(res, 404, { message: "Item not found" });
    }
  }

  // POST /create
  else if (method === "POST" && url === "/create") {
    const body = await parseBody(req);
    const id = database.length + 1;
    const newItem = { id, ...body };
    database.push(newItem);
    sendResponse(res, 201, newItem);
  }

  // PUT /update/:id
  else if (method === "PUT" && url.startsWith("/update/")) {
    const id = parseInt(url.split("/")[2], 10);
    const body = await parseBody(req);
    const item = database.find((entry) => entry.id === id);
    if (item) {
      Object.assign(item, body);
      sendResponse(res, 200, item);
    } else {
      sendResponse(res, 404, { message: "Item not found" });
    }
  }

  // DELETE /delete/:id
  else if (method === "DELETE" && url.startsWith("/delete/")) {
    const id = parseInt(url.split("/")[2], 10);
    const index = database.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      const deletedItem = database.splice(index, 1)[0];
      sendResponse(res, 200, deletedItem);
    } else {
      sendResponse(res, 404, { message: "Item not found" });
    }
  }

  // Route not found
  else {
    sendResponse(res, 404, { message: "Route not found" });
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
