//Exchange Contract
const Exchange = artifacts.require("Exchange");

module.exports = function(deployer) {
  deployer.deploy(Exchange);
};
