const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
var web3 = new Web3(provider);

const { toTokens } = require("./utils/test-utils")(web3);

module.exports = {
  devnet: { entrypointAddress: "0x0F46c65C17AA6b4102046935F33301f0510B163A" },
  goerli: {
    entrypointAddress: "0x0F46c65C17AA6b4102046935F33301f0510B163A",
  },
  mainnet: {},
};
