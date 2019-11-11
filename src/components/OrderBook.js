import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from './Spinner';
import {orderBookSelector, 
        ordersBookLoadedSelector,
        accountSelector,
        exchangeContractSelector,
        orderTradingSelector
       }   from '../store/selectors';
import {connect} from 'react-redux';
import {doTrade} from '../store/interactions';

const renderOrder = (order) => {

    return (
     
      <OverlayTrigger
          key={order.id}
          placement='auto'
          overlay={
            <Tooltip id={order.id}>
              {`Click here to fill order ${order.orderSign}`}
            </Tooltip>
          }
      >
      <tr
        key={order.id}
        className="order-book-order"
        onClick = {() => doTrade(this.props.dispatch, this.props.exchangeContract, order,this.props.account)}
      >
        <td>order.tokenAmount</td>
        <td className={`text-${order.orderTypeClass}`}>order.tokenPrice</td>
        <td>order.etherAmount</td>
      </tr>
    </OverlayTrigger>
  )
}

const showOrderBook = (props) => {
  //render orders
  const {openOrders} = props;
  return(
    <tbody>
      {openOrders.sellOrders.map((order) => renderOrder(order))}
      <tr>
        <th>DAPP</th>
        <th>DAPP/ETH</th>
        <th>ETH</th>
      </tr>
      {openOrders.buyOrders.map((order) => renderOrder(order))}
    </tbody>
  )
}

class OrderBook extends Component {
  render() {
    return (
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">
            Order Book
          </div>
          <div className="card-body order-book">
            <table className="table table-dark table-sm small">
              {this.props.canDisplayOpenOrders? showOrderBook(this.props.openOrders): <Spinner type = 'table' />}
            </table>
          </div>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {

  const ordersLoaded   = ordersBookLoadedSelector(state);
  const ordersTrading  = orderTradingSelector(state);
  const canDisplayOpenOrders = ordersLoaded && !ordersTrading;
  return { 
    openOrders: orderBookSelector(state),
    account: accountSelector(state),
    exchangeContract: exchangeContractSelector(state),
    canDisplayOpenOrders : canDisplayOpenOrders
  };
}

export default connect(mapStateToProps)(OrderBook);
