import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (

     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">Demo: Decentralised App Exchange</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>        
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link medium"
              href={`https://etherscan.io/address/${this.props.account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Your address: {this.props.account}
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;
