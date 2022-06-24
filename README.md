# Fojini Decentralized Exchange

### About

Fojini is a simple Ethereum based decentralized exchange with its own token Fojini, has low or no trading fees if you are lucky. Decentralized exchange allows for trustless exchange of assets and tokens on Ethereum without giving away control of your assets.

### Usage

You need to have [Metamask Wallet](https://metamask.io/). Connect to the app using your wallet. When connected, your address will show on the top navigation bar. You can deposit your tokens or ether, create orders by choosing the amount of token you want to get in exchange for amount of ether or vice versa, or fill open orders to make a trade.

# Development Project

### Deployment

Smart Contracts deployed to Ethereum [Rinkeby Testnet](https://www.rinkeby.io/#stats) and [Kovan Testnest](https://kovan-testnet.github.io/website/). The smart contracts are not upgradeable. App deployed on [Heroku](https://www.heroku.com/) and is available on site [https://fojini.herokuapp.com/](https://fojini.herokuapp.com/) but must have Metamask installed on your computer.

### Technology Stack and Tools

- [Metamask Wallet](https://metamask.io/)
- [Truffle](https://www.trufflesuite.com/) - development framework
- [React](https://reactjs.org/) - front end framework
- [Redux](https://redux.js.org/) - front end state management framework
- [Solidity](https://docs.soliditylang.org/en/v0.7.4/) - ethereum smart contract language
- [Ganache](https://www.trufflesuite.com/ganache) - local blockchain development
- [Web3](https://web3js.readthedocs.io/en/v1.3.0/) - library interact with ethereum nodes
- [JavaScript](https://www.javascript.com/) - logic front end and testing smart contracts
- [Infura](https://infura.io/) - connection to ethereum networks
- [Open Zeppelin](https://infura.io/) - smart contract libraries
- [Oracle](https://docs.rhombus.network/#rhombus-api-reference) - Lighthouse, Rhombus for randomness

### Installation

You need to have [ganache-cli](https://www.npmjs.com/package/ganache-cli) installed globally using npm!

Clone the project

```sh
$ git clone https://github.com/MatricksDeCoder/Fojini-DEX.git
$ cd Fojini-DEX
```

##### Folder / Directory Structure

- Fojini Dex
  - migrations
  - public
  - scripts
  - src
    - abis
    - components
    - contracts
    - flats
    - store
      index.js
  - tests

Node version used was v16.13.0

Install the dependancies

```sh
$ npm install
```

Run local blockchain with ganache. Ensure truffle-config.js networks config is your Ganache port. By default it should be host: 127.0.0.1 and port: 7545 or 8545 depending you used GUI or CLI.

```sh
$ ganache-cli
```

Connect your ganache addresses from list of given addresses to Metamask by copying the private key and importing these private keys to Metamask.

Compile, Test and Migrate Contracts on Ganache
To deploy to rinkeby use truffle migrate --reset --network rinkeby
Advisable to rerun ganache-cli before each test

```sh
$ truffle compile --all
$ truffle test ./test/Token.test.js
$ truffle test ./test/Exchange.test.js
$ truffle migrate --reset --network development
```

Load exchange with some initial data, orders, trades, cancels etc

```sh
$ truffle exec scripts/seed-exchange.js
```

Rinkeby

```sh
$ truffle exec scripts/seed-exchange.js --network rinkeby
```

Run app locally

```sh
$ npm run start
```

To interact with contracts, exchange with Metamask you need Metamask installed
If using ganache copy private key from ganache cli to Metmask
If want to interact with deployed contracts on other networks not local switch network on Metamask

### Other documents for project

| Doc             | Available at                                               | About                                                        |
| --------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| Design Patterns | [design_pattern_decisions.md](design_pattern_decisions.md) | Design pattern decisions                                     |
| Security        | [avoiding_common_attacks.md](avoiding_common_attacks.md)   | Security considerations and implementations                  |
| Addresses       | [deployed_addresses.txt](deployed_addresses.txt)           | Addresses and networks and testnest where contracts deployed |
| Contributing    | [Contributing.md](Contributing.md)                         | How to contribute to project                                 |

### Todos

- Add more Etheruem tokens to trade
- Extend the Fojini token
- Make contract upgradeable
- Explore protocols like 0x etc
- Explore more DEFI intergration e.g Compound
- Explore more complex orders, matching etc and executions on exchange
- Routing on front end eg Admin panel to show status exchange,execute emergency etc

## License

MIT
