const { JSONRPCServer } = require("json-rpc-2.0");
const express = require("express");
const bodyParser = require("body-parser");

const { createAddress } = require("./services/create-address");

const { withdrawETH } = require("./services/withdraw-eth");

const { withdrawERC20 } = require("./services/withdraw-erc20");

const server = new JSONRPCServer();

server.addMethod("getAddress", async ({ index }) => {
  const address = await createAddress(index);
  return address;
});

server.addMethod("withdrawETH", async ({ index, to, amount }) => {
  const txHash = await withdrawETH(index, to, amount);
  return txHash;
});

server.addMethod(
  "withdrawERC20",
  async ({ index, to, amount, tokenAddress }) => {
    const txHash = await withdrawERC20(index, to, amount, tokenAddress);
    return txHash;
  }
);

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
