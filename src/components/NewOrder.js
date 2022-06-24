import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from "./Spinner";

import {
  exchangeSelector,
  tokenSelector,
  accountSelector,
  web3Selector,
  buyOrderSelector,
  sellOrderSelector,
} from "../store/selectors";

import {
  buyOrderAmountChanged,
  buyOrderPriceChanged,
  sellOrderAmountChanged,
  sellOrderPriceChanged,
} from "../store/actions";

import { makeBuyOrder, makeSellOrder } from "../store/interactions";

const showForm = (props) => {
  const {
    dispatch,
    buyOrder,
    exchange,
    token,
    web3,
    account,
    sellOrder,
    showBuyTotal,
    showSellTotal,
  } = props;

  return (
    <Tabs defaultActiveKey="buy" className="bg-dark text-white">
      <Tab eventKey="buy" title="Buy" className="bg-dark">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            makeBuyOrder(dispatch, exchange, token, web3, buyOrder, account);
          }}
        >
          <div className="form-group small">
            <label>Buy Amount (FOJINI)</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white"
                placeholder="Buy Amount"
                onChange={(e) =>
                  dispatch(buyOrderAmountChanged(e.target.value))
                }
                required
              />
            </div>
          </div>
          <div className="form-group small">
            <label>Buy Price</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white"
                placeholder="Buy Price"
                onChange={(e) => dispatch(buyOrderPriceChanged(e.target.value))}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm btn-block">
            Buy Order
          </button>
          {showBuyTotal ? (
            <small> Total: {buyOrder.amount * buyOrder.price} ETH</small>
          ) : null}
        </form>
      </Tab>

      <Tab eventKey="sell" title="Sell" className="bg-dark">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            makeSellOrder(dispatch, exchange, token, web3, sellOrder, account);
          }}
        >
          <div className="form-group small">
            <label>Buy Sell (FOJINI)</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white"
                placeholder="Sell amount"
                onChange={(e) =>
                  dispatch(sellOrderAmountChanged(e.target.value))
                }
                required
              />
            </div>
          </div>
          <div className="form-group small">
            <label>Sell Price</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white"
                placeholder="Sell Price"
                onChange={(e) =>
                  dispatch(sellOrderPriceChanged(e.target.value))
                }
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm btn-block">
            Sell Order
          </button>
          {showSellTotal ? (
            <small>Total: {sellOrder.amount * sellOrder.price} ETH</small>
          ) : null}
        </form>
      </Tab>
    </Tabs>
  );
};

class NewOrder extends Component {
  render() {
    return (
      <div className="card bg-dark text-white">
        <div className="card-header">New Order</div>
        <div className="card-body">
          {this.props.showForm ? showForm(this.props) : <Spinner />}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const buyOrder = buyOrderSelector(state);
  const sellOrder = sellOrderSelector(state);

  return {
    account: accountSelector(state),
    exchange: exchangeSelector(state),
    token: tokenSelector(state),
    web3: web3Selector(state),
    buyOrder,
    sellOrder,
    showForm: !buyOrder.making && !sellOrder.making,
    showBuyTotal: buyOrder.amount && buyOrder.price,
    showSellTotal: sellOrder.amount && sellOrder.price,
  };
}

export default connect(mapStateToProps)(NewOrder);
