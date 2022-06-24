// Lighthouse for random number
const Lighthouse = artifacts.require("Lighthouse");
// Fojini Exchange Smart Contract
const Exchange = artifacts.require("Exchange");

//web3 and accounts are available in the migrations deployer
module.exports = async (deployer, network) => {
  const accounts = await web3.eth.getAccounts();
  // Make feeAccount same as admin account accessible to admins of exchange.
  const feeAccount = accounts[0];
  const feePercent = 1;

  /*
  On Rinkeby use rinkeby address for lighthouse
  On Local make use of Lighthouse.sol 
  */
  // Seperate rinkeby network deployment settings from local development testing deploy setttings
  if (network == "rinkeby") {
    var address = "0x613D2159db9ca2fBB15670286900aD6c1C79cC9a"; //address of RNG lighthouse on rinkeby
    await deployer.deploy(Exchange, feeAccount, feePercent, address);
  } else {
    // For local testing

    // First deploy the lighthouse, then use the lighthouse's address to deploy Exchange. This allows
    // Exchange to know which lighthouse to obtain data from.
    await deployer.deploy(Lighthouse);
    await deployer.deploy(Exchange, feeAccount, feePercent, Lighthouse.address);
  }
};
