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

const withdrawETH = async (index, to, amount) => {
  const privateKey = process.env.PRIV_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);

  const value = web3.utils.toWei(amount.toString(), "ether");

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

  const target = ethers.utils.getAddress(to);

  const op = await walletAPI.createSignedUserOp({
    target,
    value,
    data: "0x",
    ...(await getGasFee(provider)),
  });

  const uoHash = await client.sendUserOpToBundler(op);

  const txHash = await walletAPI.getUserOpReceipt(uoHash);

  return txHash;
};

module.exports = {
  withdrawETH,
};
