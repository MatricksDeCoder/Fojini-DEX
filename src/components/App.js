import React, { Component } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Main from "./Main";
import { connect } from "react-redux";

import {
  loadWeb3,
  loadAccount,
  loadToken,
  loadExchange,
  loadAdminAccount,
} from "../store/interactions";

import { contractsLoadedSelector } from "../store/selectors";

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData(this.props.dispatch);
  }

  // get the blokchain data into redux
  async loadBlockchainData(dispatch) {
    // load web3
    const web3 = await loadWeb3(dispatch);
    // load netId
    const networkId = await web3.eth.net.getId();
    console.log("NET", networkId);
    // load user account
    await loadAccount(web3, dispatch);
    // load fojini token
    const token = await loadToken(web3, networkId, dispatch);

    if (!token) {
      window.alert(
        "Fojini Token smart contract not detected on the current network. Please select another network with Metamask."
      );
      return;
    }
    // load exchange token
    const exchange = await loadExchange(web3, networkId, dispatch);

    if (!exchange) {
      window.alert(
        "Fojini Exchange smart contract not detected on the current network. Please select another network with Metamask."
      );
      return;
    }
    // load adminAccount
    const adminAccount = await loadAdminAccount(exchange, dispatch);
    console.log("ADMIN ACCOUNT", adminAccount);
  }

  render() {
    return (
      <div>
        <Navbar />
        {this.props.contractsLoaded ? (
          <Main />
        ) : (
          <div className="content"></div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contractsLoaded: contractsLoadedSelector(state),
  };
}

export default connect(mapStateToProps)(App);
