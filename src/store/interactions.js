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
        orderTrading,
        etherBalanceLoaded,
        tokenBalanceLoaded,
        exchangeEtherBalanceLoaded,
        exchangeTokenBalanceLoaded,
        balancesLoading,
        depositDone,
        orderMade,
        withdrawDone
       } from './actions';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import Exchange from '../abis/Exchange.json';
import { ETHER_ADDRESS } from '../helpers';

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
      const token = await web3.eth.Contract(Token.abi, Token.networks[networkId].address);
      dispatch(tokenContractLoaded(token));
      return token;
    } catch (error) {
      console.log('Contract not deployed to the current network. Please select another network with Metamask.');
      return null;
    }
}

export const loadExchangeContract = async (web3, networkId, dispatch) => {
    try {
      const exchange = await web3.eth.Contract(Exchange.abi, Exchange.networks[networkId].address);
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

  export const subscribeToEvents = (dispatch, exchange) => {
    
     //subscribe Cancel Event
      exchange.events.Cancel({}, (error,event) => {
          dispatch(orderCancelled(event.returnValues));
      });
     //subscribe Trade Event
      exchange.events.Trade({}, (error,event) => {
        dispatch(orderTraded(event.returnValues));
     });
     //subscribe Deposit Event 
     exchange.events.Deposit({}, (error,event) => {
      dispatch(depositDone(event.returnValues));
     });
    //subscribe Withdraw Event 
     exchange.events.Withdraw({}, (error,event) => {
      dispatch(withdrawDone(event.returnValues));
     });
    //subscribe Order Event 
    exchange.events.Order({}, (error,event) => {
      dispatch(orderMade(event.returnValues));
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

  export const loadBalances = async (dispatch, web3, exchange, token, account) => {
    //load Ether Balances and Token Balances takes 
    const etherBalance = web3.eth.getBalance(account);
    dispatch(etherBalanceLoaded(etherBalance));

    const tokenBalance = await Token.methods.balanceOf(account).call();
    dispatch(tokenBalanceLoaded(tokenBalance));

    //load balances on exchange
    const exchangeEtherBalance = Exchange.methods.balanceOf(ETHER_ADDRESS, account);
    dispatch(exchangeEtherBalanceLoaded(exchangeEtherBalance));

    const exchangeTokenBalance = Token.methods.balanceOf(token.options.address, account).call();
    dispatch(exchangeTokenBalanceLoaded(exchangeTokenBalance));

    dispatch(balancesLoading())

  }
 
  //depositing and withdrawing tokena and ether
   export const depositEther = (dispatch, web3, exchange, etherDepositAmount, account) => {
    
    const amount  = web3.utils.toWei(etherDepositAmount, 'ether');
    exchange.methods.depositEther().send({from:account, value: amount }).on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })
    dispatch(balancesLoading())

  }


  export const withdrawEther = (dispatch, web3, exchange, etherWithdrawAmount, account) => {
    
    const amount  = web3.utils.toWei(etherWithdrawAmount, 'ether');

    exchange.methods.withdrawEther(amount).send({from:account}).on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })
    dispatch(balancesLoading())

  }

  export const depositToken = async (dispatch, exchange, web3, token, tokenDepositAmount, account) => {
    
    const amount  = web3.utils.toWei(tokenDepositAmount, 'ether');
    //deposits require approving the exchange fisrt 
    token.methods.approve(exchange.options.address, tokenDepositAmount).on('transactionHash', (hash) => {
        exchange.methods.depositToken().send({from:account, value: amount }).on('transactionHash', (hash) => {
          dispatch(balancesLoading())
        }).on('error', (error) => {
          console.log(error);
          window.alert("There was an error try again!");
        })
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    });

  }

export const withdrawToken = async (dispatch, exchange, web3, tokenWithdrawAmount, account) => {
    
    const amount  = web3.utils.toWei(tokenWithdrawAmount, 'ether');
    await exchange.methods.withdrawToken(amount).send({from:account}).on('transactionHash', (hash) => {
      dispatch(balancesLoading())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })
    dispatch(balancesLoading())

}

  //Make buy and sell orders
  export const makeBuyOrder = async (dispatch, exchange, token, web3, buyOrder, account) => {
    
    const tokenGet   = token.options.address;
    const amountGet  = web3.utils.toWei(buyOrder.amount, 'ether');
    const tokenGive  = ETHER_ADDRESS;
    const amountGive = web3.utils.toWei((buyOrder.amount*buyOrder.price).toString(), 'ether');;

    await exchange.methods.makeOrder(
      tokenGet,
      amountGet,
      tokenGive,
      amountGive
    ).send({from:account}).on('transactionHash', (hash) => {
      dispatch(buyOrder())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })

}

  export const makeSellOrder = async (dispatch, exchange, token, web3, sellOrder, account) => {
    
    const tokenGet   = token.options.address;
    const amountGet  = web3.utils.toWei(sellOrder.amount, 'ether');
    const tokenGive  = ETHER_ADDRESS;
    const amountGive = web3.utils.toWei((sellOrder.amount*sellOrder.price).toString(), 'ether');;

    await exchange.methods.makeOrder(
      tokenGet,
      amountGet,
      tokenGive,
      amountGive
    ).send({from:account}).on('transactionHash', (hash) => {
      dispatch(sellOrder())
    }).on('error', (error) => {
      console.log(error);
      window.alert("There was an error try again!");
    })
    
}