import React, { Component } from 'react';
//import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
//import Spinner from './Spinner'

class Balance extends Component {

  render() {
    return (
      
      <Tabs defaultActiveKey="deposit" className="bg-dark text-white">

      <Tab eventKey="deposit" title="Deposit" className="bg-dark">
        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>10 Ether</td>
              <td>10 Exchange Ether Balancet</td>
            </tr>
          </tbody>
        </table>

        <form className="row">
          <div className="col-12 col-sm pr-sm-2">
            <input
            type="text"
            placeholder="ETH Amount"
            className="form-control form-control-sm bg-dark text-white"
            required />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
          </div>
        </form>

        <table className="table table-dark table-sm small">
          <tbody>
            <tr>
              <td>DAPP</td>
              <td>10 Tokens</td>
              <td>10 Tokens for Exchange</td>
            </tr>
          </tbody>
        </table>

        <form className="row" >
          <div className="col-12 col-sm pr-sm-2">
            <input
            type="text"
            placeholder="DAPP Amount"
            className="form-control form-control-sm bg-dark text-white"
            required />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">Deposit</button>
          </div>
        </form>

      </Tab>

      <Tab eventKey="withdraw" title="Withdraw" className="bg-dark">

        <table className="table table-dark table-sm small">
          <thead>
            <tr>
              <th>Token</th>
              <th>Wallet</th>
              <th>Exchange</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ETH</td>
              <td>5 Ether</td>
              <td>5 Ether Exchange</td>
            </tr>
          </tbody>
        </table>

        <form className="row" >
          <div className="col-12 col-sm pr-sm-2">
            <input
            type="text"
            placeholder="ETH Amount"
            className="form-control form-control-sm bg-dark text-white"
            required />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
          </div>
        </form>

        <table className="table table-dark table-sm small">
          <tbody>
            <tr>
              <td>DAPP</td>
              <td>5 Token</td>
              <td>5 Token Exchange</td>
            </tr>
          </tbody>
        </table>

        <form className="row" >
          <div className="col-12 col-sm pr-sm-2">
            <input
            type="text"
            placeholder="DAPP Amount"
            className="form-control form-control-sm bg-dark text-white"
            required />
          </div>
          <div className="col-12 col-sm-auto pl-sm-0">
            <button type="submit" className="btn btn-primary btn-block btn-sm">Withdraw</button>
          </div>
        </form>

      </Tab>
    </Tabs>

    );
  }
}

export default Balance;