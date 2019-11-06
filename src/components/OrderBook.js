import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
//import Spinner from './Spinner';

const renderOrder = () => {

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
        key={1}
        className="order-book-order"
      >
        <td>30</td>
        <td className=''>25</td>
        <td>100</td>
      </tr>
    </OverlayTrigger>
  )
}

const showOrderBook = (props) => {

  return(
    <tbody>
      {renderOrder()} 
      <tr>
        <th>DAPP</th>
        <th>DAPP/ETH</th>
        <th>ETH</th>
      </tr>
      {renderOrder}
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
              { showOrderBook(this.props)}
            </table>
          </div>
        </div>
      </div>

    );
  }
}

export default OrderBook;