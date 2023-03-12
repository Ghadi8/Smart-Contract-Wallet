require("dotenv").config();
const { SimpleAccountAPI, PaymasterAPI } = require("@account-abstraction/sdk");
const {
  HttpRpcClient,
} = require("@account-abstraction/sdk/dist/src/HttpRpcClient");

const { getGasFee } = require("./utils");

const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const factoryAddress = process.env.FACTORY_ADDRESS;

const batchERC20 = async (index, to, amounts, tokenAddress) => {
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

  let dest = [];
  let func = [];

  const ac = await walletAPI._getAccountContract();

  const ABI = ["function transfer(address to, uint256 amount)"];
  let iface = new ethers.utils.Interface(ABI);

  const token = ethers.utils.getAddress(tokenAddress);

  to.map((addr) => addr.trim()).forEach((addr, id) => {
    dest.push(ethers.utils.getAddress(token));
    func.push(
      iface.encodeFunctionData("transfer", [
        ethers.utils.getAddress(addr),
        amounts[id],
      ])
    );
  });

  const data = await ac.interface.encodeFunctionData("executeBatch", [
    dest,
    func,
  ]);

  const op = await walletAPI.createSignedUserOp({
    target: sender,
    value: 0,
    data,
    ...(await getGasFee(provider)),
    gasLimit: 100000,
  });

  const uoHash = await client.sendUserOpToBundler(op);

  const txHash = await walletAPI.getUserOpReceipt(uoHash);

  return txHash;
};

module.exports = {
  batchERC20,
};
