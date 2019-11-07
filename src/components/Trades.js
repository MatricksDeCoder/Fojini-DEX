import React, { Component } from 'react';import { connect } from 'react-redux';
//import Spinner from './Spinner';

const showFilledOrders = () => {
  return(
    <tbody>
          <tr className='' key={1}>
            <td className="text-muted">12/03/19</td>
            <td>400</td>
            <td className=''>50</td>
          </tr>
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
              {showFilledOrders()}
            </table>
          </div>
        </div>
      </div>
    )
  }
  
}

function mapStateToProps(state) {
  return  {}
}
export default connect(mapStateToProps)(Trades);