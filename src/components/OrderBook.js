import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Spinner from './Spinner';
import {orderBookSelector, ordersBookLoadedSelector}   from '../store/selectors';
import {connect} from 'react-redux';

const renderOrder = (order,props) => {

    return (
     
      <OverlayTrigger
          key={1}
          placement='auto'
          overlay={
            <Tooltip id={1}>
              {`Click here to fill order`}
            </Tooltip>
          }
      >
      <tr
        key={order.id}
        className="order-book-order"
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
              {this.props.ordersLoaded? showOrderBook(this.props.openOrders): <Spinner type = 'table' />}
            </table>
          </div>
        </div>
      </div>

    );
  }
}

function mapStateToProps(state) {
  return { 
    openOrders: orderBookSelector(state),
    ordersLoaded : ordersBookLoadedSelector(state)
  };
}

export default connect(mapStateToProps)(OrderBook);
