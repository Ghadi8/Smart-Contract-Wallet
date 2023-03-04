require("dotenv").config();
const { SimpleAccountAPI } = require("@account-abstraction/sdk");

const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const factoryAddress = process.env.FACTORY_ADDRESS;

const privateKey = process.env.PRIV_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

const createAddress = async (index) => {
  const walletAPI = new SimpleAccountAPI({
    provider,
    entryPointAddress: process.env.ENTRYPOINT_ADDRESS,
    owner: wallet,
    factoryAddress,
    index,
  });
  const address = await walletAPI.getCounterFactualAddress();

  return address;
};

module.exports = {
  createAddress,
};
