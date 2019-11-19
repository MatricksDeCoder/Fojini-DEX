import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import Main from './Main';
import Navbar from './Navbar';
import {loadWeb3, 
        loadWeb3Account, 
        loadTokenContract,
        loadExchangeContract} from '../store/interactions';
import {
          contractsLoadedSelector,
       } from '../store/selectors'

class App extends Component {
  
 async componentWillMount() {

    this.loadBlockchainData(this.props.dispatch);
    
  }

  async loadBlockchainData(dispatch) {

    const web3             = loadWeb3(dispatch);
    await web3.eth.net.getNetworkType();
    const networkId        = await web3.eth.net.getId();
    await loadWeb3Account(web3, dispatch);

    const tokenContract    = await loadTokenContract(web3, networkId, dispatch);    
    if(!tokenContract) {
      window.alert('Token smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }

    const exchangeContract = await loadExchangeContract(web3, networkId,dispatch);
    if(!exchangeContract) {
      window.alert('Exchange smart contract not detected on the current network. Please select another network with Metamask.')
      return
    }

  }

  render() {
    return (
      <div>
        <Navbar />
        { this.props.contractsLoaded ? <Main /> : <div className="content"></div> }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded:contractsLoadedSelector(state)
  }
}

export default connect(mapStateToProps)(App);

