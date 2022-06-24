require("@babel/register");
//require("babel-polyfill");
require("dotenv").config(); //inject the environment variables into truffle project

//const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 || "";
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2 || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

module.exports = {
  networks: {
    development: {
      networkCheckTimeout: 100000,
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      skipDryRun: true,
      networkCheckTimeout: 100000,
      provider: function () {
        return new HDWalletProvider(
          [PRIVATE_KEY1, PRIVATE_KEY2],
          `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`
        );
      },
      network_id: 4,
      gas: 5500000,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
