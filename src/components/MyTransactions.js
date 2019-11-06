import React, { Component } from 'react'
//import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
//import Spinner from './Spinner'

const showMyFilledOrders = (props) => {

  return(
    <tbody>
          <tr key={1}>
            <td className="text-muted">11/Nov/2018</td>
            <td className=''>High 700</td>
            <td className=''>7</td>
          </tr>
    </tbody>
  )
}

const showMyOpenOrders = (props) => {

  return(
    <tbody>
          <tr key={1}>
            <td className=''>350}</td>
            <td className=''>12</td>
            <td className="text-muted cancel-order">X</td>
          </tr>
    </tbody>
  )
}

class MyTransactions extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">
          My Transactions
        </div>
        <div className="card-body">
          <Tabs defaultActiveKey="trades" className="bg-dark text-white">
            <Tab eventKey="trades" title="Trades" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>DEXED</th>
                    <th>DEXED/ETH</th>
                  </tr>
                </thead>
                {showMyFilledOrders()}
              </table>
            </Tab>
            <Tab eventKey="orders" title="Orders">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>DAPP/ETH</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                {showMyOpenOrders()}
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default MyTransactions;