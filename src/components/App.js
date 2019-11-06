import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import Main from './Main';
import Navbar from './Navbar';


class App extends Component {
  
  constructor(props) {

    super(props);
    this.state = {
      accounts:[],
      exchangeContract:'',
      tokenContract: '',
      loading:false
    }

  };

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);//inject existing from window/browser
      await window.ethereum.enable();
    } else if (window.web3) { //Legacy browsers
      window.web3 = new Web3(window.web3.currentProvider);//inject existing from window/browser
    } else {
      window.alert("Non-ethereum browser detected! Please install/use Metamask!");
    }

  }

  async loadBlockchainData() {

    const web3     = window.web3;
    //get accounts
    const accounts = web3.eth.getAccounts();
    this.setState({accounts});
    //detect network automatically
    const netId           = web3.eth.net.getId();
    const netDataToken    = Token.networks[netId];
    const netDataExchange = Exchange.networks[netId];
    
    if(netDataToken) {

      const tokenContract = web3.eth.Contract(Token.abi, netDataToken.address);
      this.setState({tokenContract});
      
      this.setState({loading:false});
    } else {
      window.alert("Token contract not deployed on that network! Please change network!");
    }

    if(netDataExchange) {

      const exchangeContract = web3.eth.Contract(Exchange.abi, netDataToken.address);
      this.setState({exchangeContract});

      this.setState({loading:false});
    } else {
      window.alert("Exchange contract not deployed on that network! Please change network!");
    }

  }

  render() {
    return (
    <div >
      <Navbar account = {'0x00000000000000'} />
      <div className = 'container mt-5'>
        <div className = 'row'>
          <main role='main' className = 'col-lg-12 d-flex'>
            {this.state.loading ? <div>Loading</div> : <Main />}   
          </main>
        </div>  
      </div >
    </div>
    );
  }
}

export default App;
