// Fojini Token Contract
const Token = artifacts.require("Token");

//web3 and accounts are available in the migrations deployer
module.exports = async (deployer) => {
  await deployer.deploy(Token);
  console.log("Token deployed!!!");
};
