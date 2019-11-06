//Token Contract
const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

module.exports = aysync function(deployer) {  

  const accounts = await web3.eth.getAccounts();
  await deployer.deploy(Token);
  await deployer.deploy(Exchange,accounts[1], 1);

};
