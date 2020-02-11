//Token Contract
const Token    = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

//web3 and accounts are available in the migrations deployer
module.exports = async function(deployer) {  

  const accounts = await web3.eth.getAccounts();
  const account    = accounts[0];
  const feePercent = 1;

  await deployer.deploy(Token);
  await deployer.deploy(Exchange,account, feePercent);

};
