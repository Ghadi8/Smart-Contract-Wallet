require("dotenv").config();
const ethers = require("ethers");

const web3 = require("web3");

const accountAbi = require("../../abis/SimpleAccount.json");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const withdrawERC20 = async (account, to, amount, contractAddress) => {
  const privateKey = process.env.PRIV_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);

  const accountContract = new ethers.Contract(account, accountAbi.abi, wallet);

  // data should be the encoded data for the transfer function of the ERC20 token

  let ABI = ["function transfer(address to, uint amount)"];

  let iface = new ethers.utils.Interface(ABI);

  const encodedData = iface.encodeFunctionData("transfer", [to, amount]);

  const tx = await accountContract.execute(contractAddress, 0, encodedData);

  const txHash = tx.hash;

  return txHash;
};

const main = async () => {
  const contractAddress = process.env.YEENUS_ADDRESS;
  const accountAddress = "0x3134CF48778cCd821d2B66719C1fe42f09460125";
  const to = "0xA3F484fD8DC83315A63F3863af0bF83046bbE849";
  const amount = 2000000000;

  const hash = await withdrawERC20(accountAddress, to, amount, contractAddress);

  console.log({ hash });
};

main();
