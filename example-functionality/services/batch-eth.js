require("dotenv").config();
const { SimpleAccountAPI, PaymasterAPI } = require("@account-abstraction/sdk");
const {
  HttpRpcClient,
} = require("@account-abstraction/sdk/dist/src/HttpRpcClient");

const { getGasFee } = require("./utils");

const ethers = require("ethers");

const web3 = require("web3");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const factoryAddress = process.env.FACTORY_ADDRESS;

const batchEth = async (index, to, amounts) => {
  const privateKey = process.env.PRIV_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);

  const walletAPI = new SimpleAccountAPI({
    provider,
    entryPointAddress: process.env.ENTRYPOINT_ADDRESS,
    owner: wallet,
    factoryAddress,
    index,
  });

  const chainId = await provider.getNetwork().then((net) => net.chainId);

  const client = await new HttpRpcClient(
    process.env.BUNDLER_RPC_URL,
    process.env.ENTRYPOINT_ADDRESS,
    chainId
  );

  const sender = await walletAPI.getCounterFactualAddress();

  let values = [];

  for (let i = 0; i < amounts.length; i++) {
    values.push(web3.utils.toWei(amounts[i].toString(), "ether"));
  }

  let dest = [];
  let func = [];

  const ac = await walletAPI._getAccountContract();

  to.map((addr) => addr.trim()).forEach((addr, id) => {
    dest.push(sender);
    func.push(
      ac.interface.encodeFunctionData("execute", [
        ethers.utils.getAddress(addr),
        values[id],
        "0x",
      ])
    );
  });

  const op = await walletAPI.createSignedUserOp({
    target: sender,
    data: ac.interface.encodeFunctionData("executeBatch", [dest, func]),
    ...(await getGasFee(provider)),
    gasLimit: 100000,
  });

  const uoHash = await client.sendUserOpToBundler(op);

  const txHash = await walletAPI.getUserOpReceipt(uoHash);

  return txHash;
};

module.exports = {
  batchEth,
};
