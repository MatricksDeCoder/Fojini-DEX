import React, { Component } from 'react';
import Balance from './Balance';
import NewOrder from './NewOrder';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import MyTransactions from './MyTransactions';
import Trades from './Trades';
import {connect} from 'react-redux';
import {exchangeContractSelector} from '../store/selectors';
import {loadAllOrders, subscribeToEvents} from '../store/interactions';

class Main extends Component {

  componentWillMount() {
    this.loadBlockchainData();
  }

  async loadBlockchainData() {
    await loadAllOrders(this.props.exchangeContract);
    await subscribeToEvents(this.props.dispatch, this.props.exchangeContract);
  }

  render() {
    return (
      <div className="content">
        <div className="vertical-split">
          <Balance />
          <NewOrder />
        </div>
        <OrderBook />
        <div className="vertical-split">
          <PriceChart />
          <MyTransactions />
        </div>
        <Trades />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      exchangeContract: exchangeContractSelector(state)
  }
}

export default connect(mapStateToProps)(Main);
