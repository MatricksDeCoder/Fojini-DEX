require('babel-register');
require('babel-polyfill');
require('dotenv').config(); //inject environment variables into truffle project
const HDWalletProvider  = require('truffle-hdwallet-provider-privkey');
const PRIVATE_KEYS      = process.env.PRIVATE_KEYS  || '';
const INFURA_API_KEY    = process.env.INFURA_API_KEY;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(PRIVATE_KEYS.split(','), `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`);
      },
      network_id: 42,
      gasPrice: 25000000000,
      gas: 3716887
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
