//migration is about changing the state of the blockchain
const Token = artifacts.require("Token");

module.exports = function(deployer) {
  deployer.deploy(Token);
};
