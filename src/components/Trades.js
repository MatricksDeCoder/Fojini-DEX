import React, { Component } from 'react';import { connect } from 'react-redux';
import {tradesSelector, tradesLoadedSelector} from '../store/selectors';
import Spinner from './Spinner';

const showTrades = (trades) => {
  return(
    <tbody>
      { trades.map((order) => {
        return(
          <tr className={`order-${order.id}`} key={order.id}>
            <td className="text-muted">{order.formattedTimestamp}</td>
            <td>{order.tokenAmount}</td>
            <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
          </tr>
        )
      }) }
    </tbody>
  )
}
class Trades extends Component {

  render() {
    return (
      <div className="vertical">
        <div className="card bg-dark text-white">
          <div className="card-header">
            Trades
          </div>
          <div className="card-body">
            <table className="table table-dark table-sm small">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>DEXED</th>
                  <th>DEXED/ETH</th>
                </tr>
              </thead>
              {this.props.tradesLoaded? showTrades(this.props.trades) : <Spinner type ="table"/>}
            </table>
          </div>
        </div>
      </div>
    )
  }
  
}

function mapStateToProps(state) {
  return { 
    trades: tradesSelector(state)  || [{a:1,b:2, id:1}],
    tradesLoaded: tradesLoadedSelector(state)
  };
}

export default connect(mapStateToProps)(Trades);
