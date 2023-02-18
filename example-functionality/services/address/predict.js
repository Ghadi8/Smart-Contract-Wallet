require("dotenv").config();
const ethers = require("ethers");

const factoryAbi = require("../../abis/SimpleAccountFactory.json");

const bytes32 = require("bytes32");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const factoryAddress = process.env.FACTORY_ADDRESS;

const privateKey = process.env.PRIV_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

const factoryContract = new ethers.Contract(
  factoryAddress,
  factoryAbi.abi,
  wallet
);

const predictAddress = async (salt) => {
  const tx = await factoryContract.getAddress(
    bytes32({ input: salt.toString() })
  );

  return tx;
};

predictAddress(2).then((address) => console.log(address));
