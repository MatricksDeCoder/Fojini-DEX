import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import Spinner from './Spinner';
import {myOpenOrdersSelector, 
        myTradesOrdersSelector,
        myTradesOrdersLoadedSelector,
        myOpenOrdersLoadedSelector 
  } from '../store/selectors';

const showMyOpenOrders = (openOrders) => {

  return(
    <tbody>
    { openOrders.map( (order) =>  {
      return (
          <tr key={order.id}>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td className="text-muted">X</td>
          </tr> );
      }) 
    }
    </tbody>
  );

}

const showMyFilledOrders = (filledOrders) => {

  return(
    <tbody>
    { filledOrders.map( (order) =>  {
      return (
          <tr key={order.id}>
            <td className=''>{order.formattedTimestamp}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.orderSign}-{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
          </tr> );
      }) 
    }
    </tbody>
  );
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
                {this.props.myFilledOrdersLoaded? showMyFilledOrders(this.props.myFilledOrders): <Spinner type = 'table'/>}
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
                {this.props.myOpenOrdersLoaded? showMyOpenOrders(this.props.myOpenOrders) : <Spinner type='table'/>}
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return ({ 
    myFilledOrders : myTradesOrdersSelector(state),
    myOpenOrders:myOpenOrdersSelector(state),
    myOpenOrdersLoaded:myOpenOrdersLoadedSelector(state),
    myFilledOrdersLoaded: myTradesOrdersLoadedSelector(state)
  });
}

export default connect(mapStateToProps)(MyTransactions);
