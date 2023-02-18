const factoryCont = artifacts.require("SimpleAccountFactory");
const simpleAccountCont = artifacts.require("SimpleAccount");

const { setEnvValue } = require("../utils/env-man");

const conf = require("../migration-parameters");

const setFactory = (n, v) => {
  setEnvValue("../", `FACTORY_${n.toUpperCase()}`, v);
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

  const simple_account_address = (await simpleAccountCont.deployed()).address;

  await deployer.deploy(factoryCont, simple_account_address);

  const factory = await factoryCont.deployed();

  if (factory) {
    console.log(
      `Deployed: Factory
            network: ${network}
            address: ${factory.address}
            creator: ${accounts[0]}`
    );

    setFactory(network, factory.address);
  } else {
    console.log(`Factory Deployment Unsuccessful`);
  }
};
