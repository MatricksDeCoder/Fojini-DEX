import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from "./Spinner";

import {
  myFilledOrdersLoadedSelector,
  myFilledOrdersSelector,
  myOpenOrdersLoadedSelector,
  myOpenOrdersSelector,
  exchangeSelector,
  accountSelector,
  orderCancellingSelector,
} from "../store/selectors";

import { cancelOrder } from "../store/interactions";

const showMyFilledOrders = (props) => {
  const { myFilledOrders } = props;

  return (
    <tbody>
      {myFilledOrders.map((order) => {
        return (
          <tr key={order.id}>
            <td className="text-muted">{order.formattedTimestamp}</td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.orderSign}
              {order.tokenAmount}
            </td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenPrice}
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

const showMyOpenOrders = (props) => {
  const { myOpenOrders, dispatch, exchange, account } = props;

  return (
    <tbody>
      {myOpenOrders.map((order) => {
        return (
          <tr key={order.id}>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenAmount}
            </td>
            <td className={`text-${order.orderTypeClass}`}>
              {order.tokenPrice}
            </td>
            <td
              className="text-muted cancel-order"
              onClick={(e) => {
                cancelOrder(dispatch, exchange, order, account);
              }}
            >
              X
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};

class MyTransactions extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">My Transactions</div>
        <div className="card-body">
          <Tabs defaultActiveKey="trades" className="bg-dark text-white">
            <Tab eventKey="trades" title="Trades" className="bg-dark">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Time </th>
                    <th>FOJINI </th>
                    <th>FOJINI/ETH </th>
                  </tr>
                </thead>
                {this.props.showMyFilledOrders ? (
                  showMyFilledOrders(this.props)
                ) : (
                  <Spinner type="table" />
                )}
              </table>
            </Tab>
            <Tab eventKey="orders" title="Orders">
              <table className="table table-dark table-sm small">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>FOJINI/ETH</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                {this.props.showMyOpenOrders ? (
                  showMyOpenOrders(this.props)
                ) : (
                  <Spinner type="table" />
                )}
              </table>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state);
  const orderCancelling = orderCancellingSelector(state);

  return {
    myFilledOrders: myFilledOrdersSelector(state),
    showMyFilledOrders: myFilledOrdersLoadedSelector(state),
    myOpenOrders: myOpenOrdersSelector(state),
    showMyOpenOrders: myOpenOrdersLoaded && !orderCancelling,
    exchange: exchangeSelector(state),
    account: accountSelector(state),
  };
}

export default connect(mapStateToProps)(MyTransactions);
