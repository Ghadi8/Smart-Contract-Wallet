const { JSONRPCServer } = require("json-rpc-2.0");
const express = require("express");
const bodyParser = require("body-parser");

const { createAddress } = require("./services/create-address");

const { withdrawEth } = require("./services/withdraw");

const server = new JSONRPCServer();

server.addMethod("createAddress", async ({ index }) => {
  const address = await createAddress(index);
  return address;
});

server.addMethod("withdrawEth", async ({ index, to, amount }) => {
  const uoHash = await withdrawEth(index, to, amount);
  return "Withdrawal successful";
});

express()
  .use(bodyParser.json())
  .post("/sw", (req, res) => {
    server
      .receive(req.body)
      .then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
          res.json(jsonRPCResponse);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((e) => {
        console.error("unexpected error", e);
        res.sendStatus(500);
      });
  })
  .listen(process.env.PORT || 3000, () => {
    console.log(
      "HTTP-JSON-RPC Server is listening on port",
      process.env.PORT || 3000
    );
  });
