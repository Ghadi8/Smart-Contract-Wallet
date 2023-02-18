require("dotenv").config();
const ethers = require("ethers");

const web3 = require("web3");

const accountAbi = require("../../abis/SimpleAccount.json");

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

const withdrawEth = async (account, to, amount) => {
  const privateKey = process.env.PRIV_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);

  const accountContract = new ethers.Contract(account, accountAbi.abi, wallet);

  const value = web3.utils.toWei(amount.toString(), "ether");

  const tx = await accountContract.execute(to, value, "0x00");

  const txHash = tx.hash;

  return txHash;
};

const main = async () => {
  const accountAddress = "0x3134CF48778cCd821d2B66719C1fe42f09460125";
  const to = "0xA3F484fD8DC83315A63F3863af0bF83046bbE849";
  const amount = 0.01;

  const hash = await withdrawEth(accountAddress, to, amount);

  console.log({ hash });
};

main();
