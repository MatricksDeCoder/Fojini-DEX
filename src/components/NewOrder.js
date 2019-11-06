import React, { Component } from 'react'
//import { connect } from 'react-redux'
import { Tabs, Tab } from 'react-bootstrap'
//import Spinner from './Spinner'

class NewOrder extends Component {

  render() {
    return (
    
      <Tabs defaultActiveKey="buy" className="bg-dark text-white">

      <Tab eventKey="buy" title="Buy" className="bg-dark">

          <form >
          <div className="form-group small">
            <label>Buy Amount (DEXED)</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-sm bg-dark text-white"
                placeholder="Buy Amount"
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
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-sm btn-block">Buy Order</button>
          25
        </form>

      </Tab>

      <Tab eventKey="sell" title="Sell" className="bg-dark">

        <form >
        <div className="form-group small">
          <label>Buy Sell (DEXED)</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm bg-dark text-white"
              placeholder="Sell amount"
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
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-sm btn-block">Sell Order</button>
          30
      </form>

      </Tab>
    </Tabs>

    );
  }
}

export default NewOrder;