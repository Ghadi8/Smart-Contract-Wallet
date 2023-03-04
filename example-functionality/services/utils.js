const ethers = require("ethers");

const getGasFee = async (provider) => {
  let maxFeePerGas;
  let maxPriorityFeePerGas;

  const [block, eth_maxPriorityFeePerGas] = await Promise.all([
    await provider.getBlock("latest"),
    await provider.send("eth_maxPriorityFeePerGas", []),
  ]);

  if (block && block.baseFeePerGas) {
    maxPriorityFeePerGas = ethers.BigNumber.from(eth_maxPriorityFeePerGas);
    if (maxPriorityFeePerGas) {
      maxFeePerGas = block.baseFeePerGas.mul(2).add(maxPriorityFeePerGas);
    }
  }

  return { maxFeePerGas, maxPriorityFeePerGas };
};

module.exports = {
  getGasFee,
};
