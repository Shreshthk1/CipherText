// wsServer.js (CommonJS, matching your server)
const { WebSocketServer } = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
  const clients = new Map(); // username -> ws connection

  wss.on("connection", (ws) => {
    let username = null;
    console.log("new ws connection ")

    ws.on("message", (raw) => {
        console.log("ws message recieved ")
      const data = JSON.parse(raw);
        console.log(data.type);
        
      if (data.type === "register") {
        username = data.username;
        clients.set(username, ws);
        return;
      }

      if (data.type === "message") {
        const targetWs = clients.get(data.to);
        console.log("routing message to:", data.to, "found connection:", !!targetWs);
        if (targetWs) {
          targetWs.send(JSON.stringify({
            type: "message",
            from: data.from,
            iv: data.iv,
            ciphertext: data.ciphertext,
          }));
        }
      }
    });

    ws.on("close", () => {
      if (username) clients.delete(username);
    });
  });
}

module.exports = { setupWebSocket };