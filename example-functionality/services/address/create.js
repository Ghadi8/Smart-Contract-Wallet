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

const createAddress = async (salt) => {
  const tx = await factoryContract.createAccount(
    process.env.ENTRYPOINT_ADDRESS,
    bytes32({ input: salt.toString() })
  );

  const receipt = await tx.wait();
  const account = receipt.events[0].address;

  return account;
};

createAddress(0).then((address) => console.log(address));
