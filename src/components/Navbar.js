import React, { Component } from "react";
import { connect } from "react-redux";
import { GREEN, RED } from "../helpers";

import {
  accountSelector,
  exchangeSelector,
  adminAccountSelector,
  isEmergencySelector,
} from "../store/selectors";

import { stopExchange, startExchange } from "../store/interactions";

const EmergencySection = (props) => {
  const { isEmergency, adminAccount, account, exchange, dispatch } = props;
  const color = isEmergency ? RED : GREEN;
  const status = isEmergency
    ? "Exchange Is Fully Functional!"
    : "Exchange In Emergency! Cancel Your Orders! Withdrawals Working!";

  if (account === adminAccount) {
    return (
      <a className="navbar-brand" href="#/">
        <button
          className={`btn-${RED}`}
          onClick={(event) => {
            stopExchange(dispatch, exchange, account);
          }}
        >
          Stop!
        </button>
        <button
          className={`btn-${GREEN}`}
          onClick={(event) => {
            startExchange(dispatch, exchange, account);
          }}
        >
          Start!
        </button>
      </a>
    );
  } else {
    return (
      <a className="navbar-brand" href="#/">
        <button
          className={`btn-${color}`}
          onClick={(event) => {
            window.alert(status);
          }}
        >
          EXCHANGE STATUS !
        </button>
      </a>
    );
  }
};

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">
          Fojini Token Exchange
        </a>
        {EmergencySection(this.props)}
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://rinkeby.etherscan.io/address/${this.props.account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.account}
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    isEmergency: isEmergencySelector(state),
    exchange: exchangeSelector(state),
    adminAccount: adminAccountSelector(state),
  };
}

export default connect(mapStateToProps)(Navbar);
