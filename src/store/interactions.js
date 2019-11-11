//handle blockchain interactions 
import {web3Loaded,
        web3AccountLoaded,
        tokenContractLoaded,
        exchangeContractLoaded,
        //cancelledOrdersLoaded,
        //tradesOrdersLoaded,
        //ordersLoaded,
        orderCancelling,
        orderCancelled,
        orderTraded,
        orderTrading
       } from './actions';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
//import { ETHER_ADDRESS } from '../helpers'

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    dispatch(web3Loaded(web3));
    return web3;
}

export const loadWeb3Account = async (web3, dispatch) => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    dispatch(web3AccountLoaded(account));
    return account;
  }
 
export const loadTokenContract = async (web3, networkId, dispatch) => {
    try {
      const token = web3.eth.Contract(Token.abi, Token.networks[networkId].address);
      dispatch(tokenContractLoaded(token));
      return token;
    } catch (error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.');
      return null;
    }
}

export const loadExchangeContract = async (web3, networkId, dispatch) => {
    try {
      const exchange = web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
      dispatch(exchangeContractLoaded(exchange));
      return exchange;
    } catch (error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.');
      return null;
    }
  }

export const loadAllOrders = async (exchangeContract, dispatch) => {

     //Fetch Cancelled Orders from event stream
     //const cancelledOrdersStream = await exchangeContract.getPastEvents("CancelOrder", { fromBlock: 0, toBlock: "latest" });
     //Format Cancelled Orders to get properties of interest
     //const cancelledOrders       = cancelledOrdersStream.map(event =>event.returnValues);
     //Add cancelled orders to redux store
     //dispatch(cancelledOrdersLoaded(cancelledOrders));

    //Fetch Trades Orders from event stream
    //const tradesOrdersStream = await exchangeContract.getPastEvents("Trade", { fromBlock: 0, toBlock: "latest" });
    //Format Trade Orders to get properties of interest
    //const tradesOrders       = tradesOrdersStream.map(event =>event.returnValues);
    //Add cancelled orders to redux store
    //dispatch(tradesOrdersLoaded(tradesOrders));

    //Fetch All Orders (Cancelled and Traded)from event stream
    //const ordersStream = await exchangeContract.getPastEvents("Order", { fromBlock: 0, toBlock: "latest" });
    //Format Trade Orders to get properties of interest
    //const orders       = ordersStream.map(event =>event.returnValues);
    //Add cancelled orders to redux store
    //dispatch(ordersLoaded(orders));

      
      
  }

  export const cancelOrder = (dispatch, exchange, order, account) => {
    //using event emit pattern vs promise, callback etc
    exchange.methods.cancelOrder(order.id).send({from:account}).on('transactionHash', (hash) => {
      dispatch(orderCancelling())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })

  }

  export const subscribeToEvents = async (dispatch, exchange) => {
    
     //subscribe Cancel Event
      exchange.events.Cancel({}, (error,event) => {
          dispatch(orderCancelled(event.returnValues));
      });
     //subscribe Trade Event
      exchange.events.Trade({}, (error,event) => {
        dispatch(orderTraded(event.returnValues));
     });


  }

  export const doTrade = (dispatch, exchange, order, account) => {
    //using event emit pattern vs promise, callback etc
    exchange.methods.cancelOrder(order.id).send({from:account}).on('transactionHash', (hash) => {
      dispatch(orderTrading())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })

  }

 