import React, { Component } from 'react';
import Balance from './Balance';
import NewOrder from './NewOrder';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import MyTransactions from './MyTransactions';
import Trades from './Trades';

class Main extends Component {

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

export default Main;
