const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
var web3 = new Web3(provider);

module.exports = {
  devnet: { entrypointAddress: "0x0576a174D229E3cFA37253523E645A78A0C91B57" },
  goerli: {
    entrypointAddress: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
  },
  mainnet: {},
};
