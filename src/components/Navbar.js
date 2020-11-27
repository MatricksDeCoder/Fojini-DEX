import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GREEN, RED } from './helpers'

import { accountSelector, 
         exchangeSelector,
         adminAccountSelector, 
         isEmergencySelector } from '../store/selectors'

import { stopExchange, 
         startExchange } from '../store/interactions'

const EmergencySection  = (props) => {

  const { isEmergency, adminAccount, account, exchange, dispatch } = props
  const color  = isEmergency ? RED : GREEN
  const status = isEmergency ? 'Exchange Is Fully Functional!': 'Exchange In Emergency! Cancel Your Orders! Withdrawals Working!'

  if(account == adminAccount) {
    
    return (

      <li className="nav-item">
        <button
          className=`btn-${RED}`
          onClick={(event) => {
              emergencyStart(
                dispatch, 
                exchange,
              )
            } 
          }
        >
          Emergency!
        </button>
      </li>
      <li className="nav-item">
        <button
          className=`btn-${GREEN}`
          onClick={(event) => {
              emergencyStop(
                dispatch, 
                exchange,
              )
            } 
          }
        >
          Emergency!
        </button>
      </li>

    )

  } else {

    return (
      <li className="nav-item ">
        <button
          className=`btn-${color}`
          onClick={(event) => {
            window.alert(status)
          }}
        >
          EXCHANGE STATUS!
        <button>
      </li>
    )

  }

}

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">Fojini Token Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
          {EmergencySection(this.props)}
          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://etherscan.io/address/${this.props.account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.props.account}
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: accountSelector(state),
    isEmergency: isEmergencySelector(state),
    exchange: exchangeSelector(state),
    adminAccount: adminAccountSelector(state)
  }  
}

export default connect(mapStateToProps)(Navbar)
