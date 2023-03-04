const simpleAccountCont = artifacts.require("SimpleAccount");

const { setEnvValue } = require("../utils/env-man");

const conf = require("../migration-parameters");

const setSimpleAccount = (n, v) => {
  setEnvValue("../", `SIMPLE_ACCOUNT_${n.toUpperCase()}`, v);
};

module.exports = async function (deployer, network, accounts) {
  switch (network) {
    case "goerli":
      c = { ...conf.goerli };
    case "mainnet":
      c = { ...conf.mainnet };
    default:
      c = { ...conf.devnet };
  }

  await deployer.deploy(simpleAccountCont, c.entrypointAddress);

  const simpleAccount = await simpleAccountCont.deployed();

  if (simpleAccount) {
    console.log(
      `Deployed: SimpleAccount
            network: ${network}
            address: ${simpleAccount.address}
            creator: ${accounts[0]}`
    );

    setSimpleAccount(network, simpleAccount.address);
  } else {
    console.log(`SimpleAccount Deployment Unsuccessful`);
  }
};
