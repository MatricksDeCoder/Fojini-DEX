import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';
import Spinner from './Spinner';
import {myOpenOrdersSelector, 
        myTradesOrdersSelector,
        myTradesOrdersLoadedSelector,
        myOpenOrdersLoadedSelector,
        accountSelector,
        exchangeContractSelector,
        orderCancellingSelector,
  } from '../store/selectors';
import {cancelOrder} from '../store/interactions';

const showMyOpenOrders = (openOrders) => {

  return(
    <tbody>
    { openOrders.map( (order) =>  {
      return (
          <tr key={order.id}>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td className="text-muted cancel-order"
                onClick  ={cancelOrder(this.props.dispatch, this.props.exchangeContract, order,this.props.account)}
            >X</td>
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
                {this.propscanDisplayOpenOrders? showMyOpenOrders(this.props.myOpenOrders) : <Spinner type='table'/>}
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state);
  const orderCancelling    = orderCancellingSelector(state);
  const canDisplayOpenOrders = myOpenOrdersLoaded && !orderCancelling;
  return ({ 
    myFilledOrders : myTradesOrdersSelector(state),
    myOpenOrders:myOpenOrdersSelector(state),    
    myFilledOrdersLoaded: myTradesOrdersLoadedSelector(state),
    account: accountSelector(state),
    exchangeContract: exchangeContractSelector(state),
    canDisplayOpenOrders : canDisplayOpenOrders
  });
}

export default connect(mapStateToProps)(MyTransactions);
