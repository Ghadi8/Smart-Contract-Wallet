require("dotenv").config();
const { SimpleAccountAPI, PaymasterAPI } = require("@account-abstraction/sdk");
const {
  HttpRpcClient,
} = require("@account-abstraction/sdk/dist/src/HttpRpcClient");

const { getGasFee } = require("./utils");

const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const factoryAddress = process.env.FACTORY_ADDRESS;

const withdrawERC20 = async (index, to, amount, tokenAddress) => {
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

  const ABI = ["function transfer(address to, uint256 amount)"];
  let iface = new ethers.utils.Interface(ABI);

  const decimalsABI = ["function decimals() view returns (uint8)"];
  let decimalsIface = new ethers.utils.Interface(decimalsABI);

  const token = new ethers.Contract(tokenAddress, decimalsIface, provider);

  const decimals = await token.decimals();

  const value = ethers.utils.parseUnits(amount.toString(), decimals);
  const data = iface.encodeFunctionData("transfer", [to, value]);

  const target = ethers.utils.getAddress(tokenAddress);

  const op = await walletAPI.createSignedUserOp({
    target,
    value: 0,
    data,
    ...(await getGasFee(provider)),
  });

  const uoHash = await client.sendUserOpToBundler(op);

  const txHash = await walletAPI.getUserOpReceipt(uoHash);

  return txHash;
};

module.exports = {
  withdrawERC20,
};
