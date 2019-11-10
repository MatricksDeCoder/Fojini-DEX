import {get, groupBy, reject, maxBy, minBy} from 'lodash';
import { createSelector } from 'reselect';
import moment from 'moment';
import { ETHER_ADDRESS, GREEN, RED, etherFormat, tokenFormat } from '../helpers';

console.log(groupBy, minBy, reject, maxBy, GREEN, RED, moment);

const account               = state => get(state, 'web3Account.account'); //vs state.web3.account
export const accountSelector= createSelector(account, acc => acc); //any formating first

const web3                  = state => get(state, 'web3.connection');
export const web3Selector   = createSelector(web3, w => w); //any formating first

const tokenLoaded           = state => get(state, 'tokenContract.loaded',true);
const exchangeLoaded        = state => get(state, 'exchangeContract.loaded', true); //pass default values 
export const contractsLoadedSelector  = createSelector(tokenLoaded,  
    exchangeLoaded,
    (tl,el) => (tl && el)
);

//Functions to decorate and format orders
let etherAmount, tokenAmount, tokenPrice, formattedTimestamp, tokenPriceClass;

const decoratedTrades = (ordersIn) => {
    //Track the order to compare 
    let previousOrder = ordersIn[0];
    return ordersIn.map(order => {
        order = decoratedOrder(order);
        order = decoratedTradeOrder(order, previousOrder);
        previousOrder = order; //update previous order once decorated
        return order;
    });
}

//decorator specific filled orders
//need to check if previous price was higher or lower than current
//make use of css class to show if order was higher(green) or lower(red)
//make use of tokenPriceClass
const decoratedTradeOrder = (order, previousOrder) => {
    tokenPriceClass = tokenPriceClassFunc(order.tokenPrice, order.id, previousOrder);
    return {
        ...order,
        tokenPriceClass
    }
}

//tokenPriceClass function
const tokenPriceClassFunc = (tokenPrice,orderId, previousOrder) => {
    //show green price if 1 order exists
    if(previousOrder.id === orderId) {
        return GREEN;
    }
    if(previousOrder.tokenPrice <= tokenPrice) {
        return GREEN;
    }else {
        return RED;
    }
}

//general decorator all orders 
const decoratedOrder = (order) => {
    if(order.tokenGive === ETHER_ADDRESS) {
        etherAmount = order.amountGive;
        tokenAmount = order.amountGet;
    } else {
        etherAmount = order.amountGet;
        tokenAmount = order.amountGive;
    }
    etherAmount = etherFormat(etherAmount);
    tokenAmount = tokenFormat(tokenAmount);
    //calculate tokenPrice
    tokenPrice  = etherAmount/tokenAmount;
    const precision = 10000;
    tokenPrice  = Math.round(tokenPrice*precision) / precision;
    //format timestamp from unix 
    formattedTimestamp = moment.unix(order.timestamp).format('h:mm:s a M/D');

    return ({
        ...order,
        etherAmount,
        tokenAmount,
        tokenPrice,
        formattedTimestamp
    });
}

const exchangeContract                = state => get(state, 'exchangeContract.contract');
export const exchangeContractSelector = createSelector(exchangeContract, ex => ex); //any formating first

const tokenContract                   = state => get(state, 'tokenContract.contract');
export const tokenContractSelector    = createSelector(tokenContract, t => t); //any formating first

// All Orders 
const ordersLoaded                    = state => get(state, 'orders.tradesOrders.loaded',false);
export const ordersLoadedSelector     = createSelector(ordersLoaded, bool => bool);
const orders                          = state => get(state, 'orders.orders.data',[]);
export const ordersSelector           = createSelector(orders, o => o);

// Trades 
const tradesLoaded                    = state => get(state, 'tradesOrders.tradesOrders.loaded',false);
export const tradesLoadedSelector     = createSelector(tradesLoaded, bool => bool);
const trades                          = state => get(state, 'tradesOrders.tradesOrders.data',[]);
export const tradesSelector           = createSelector(trades,                                                         
                                                       (trades) => {
                                                           //sort orders by date ascending for price comparison
                                                           trades = trades.sort((a,b) =>a.timestamp-b.timestamp);
                                                           //decorate orders
                                                           trades  = decoratedTrades(trades);
                                                           //sort orders descending order to display
                                                           trades = trades.sort((a,b) => b.timestamp-a.timestamp);
                                                           return trades;
                                                       }
                                                       );

//Cancelled Orders                                                     
const cancelledOrdersLoaded           = state => get(state, 'cancelledOrders.tradesOrders.loaded',false);
export const cancelledOrdersLoadedSelector     = createSelector(cancelledOrdersLoaded, bool => bool);
const cancelled                       = state => get(state, 'cancelledOrders.cancelledOrders.data',[]);
export const cancelledOrdersSelector  = createSelector(cancelled, c => c);

//OrderBook Loadeed and Building OrderBook[open orders]
//Want to deal with orders excluding trades and cancelled Orders to have tradeable orderBook
const ordersBookLoaded                 = state => ordersLoaded(state) && tradesLoaded(state) && cancelledOrdersLoaded(state);
export const ordersBookLoadedSelector  = createSelector(ordersBookLoaded, bool => bool);

//Open order book based only on open orders
const openOrders = (state) => {
    const ordersIn = orders(state);
    const tradesIn = trades(state);
    const cancelledIn = cancelled(state);
    const openOrders = reject(ordersIn, (order) => {
        const orderFilled = tradesIn.some((o) => o.id === order.id);
        const orderCancelled = cancelledIn.some((o) => o.id === order.id);
        return (orderFilled || orderCancelled); //reject order if its traded/filled or cancelled
    });
    return openOrders;
}

export const orderBookSelector         = createSelector(
    openOrders,
    (openOrders) => {
        //decorate orders
        openOrders  = decoratedOrderBooks(openOrders);
        //group orders by buy or sell 
        openOrders  = groupBy(openOrders, 'orderType');
        //get the orders of each type
        const buyOrders = get(openOrders, 'buy',[]);
        //sort buy orders by token price
         openOrders = {
            ...openOrders,
            buyOrders : buyOrders.sort((a,b) => b.tokenPrice-a.tokenPrice)
        }
        const sellOrders = get(openOrders, 'sell',[]);
        //sort buy orders by token price
         openOrders = {
            ...openOrders,
            sellOrders : sellOrders.sort((a,b) => b.tokenPrice-a.tokenPrice)
        }

        return openOrders;
    }
)

const decoratedOrderBooks = (ordersIn) => {
    return ordersIn.map(order => {
        order = decoratedOrder(order);
        //Decorate to determine if order is a buy or sell order 
        order = decorateBuySell(order);
        return order;
    });
}

//buySell function
const decorateBuySell = (order) => {
    //show green price if 1 order exists
    const orderType = order.tokenGive === ETHER_ADDRESS? 'buy': 'sell';
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType==='buy'?GREEN:RED),
        orderFillCalls: (orderType === 'buy'? 'sell':'buy')
    })
}

//My transactions selectors
//My orders are loaded if all filled orders are loaded and all open orders are loaded
export const myTradesOrdersLoadedSelector      = createSelector(
    tradesLoaded,
    bool => bool
);
export const myOpenOrdersLoadedSelector        = createSelector(
    ordersBookLoaded,
    bool => bool
);

//filter out transactions based on account 

//My Trades
export const myTradesOrdersSelector      = createSelector(
    account, 
    trades,
    (account, trades) => {
        //find our orders only
        trades = trades.filter((trade) => trade.user === account || trade.userFill === account);
        //sort by time ascending
        trades = trades.sort((a,b)=> a.timestamp-b.timestamp);
        //decorate the orders
        trades = decoratedMyTrades(trades);
        return trades;
    }
);

const decoratedMyTrades = (trades) => {
    return (
        trades.map((trade) => {
            trade = decoratedOrder(trade);
            //figure out if order is a buy trade or sell trade 
            trade = decoratedMyTrade(trade,account);
            return trade;
        })
    )
}

const decoratedMyTrade = (trade, account) => {
    const myTrade = trade.user === account; //check its my order;
    let orderType;
    if(myTrade) {
        orderType = trade.tokenGIVE === ETHER_ADDRESS?'buy':'sell';
    }else {
        orderType = trade.tokenGIVE === ETHER_ADDRESS?'sell':'buy';
    }
    return ({
        ...trade,
        orderType,
        orderTypeClass: orderType === 'buy'?GREEN:RED,
        orderSign:orderType === 'buy'? '+':'-'
    })
}

//My Open Orders
export const myOpenOrdersSelector      = createSelector(
    account, 
    openOrders,
    (account, openOrders) => {
        //find our orders only
        openOrders = openOrders.filter((openOrder) => openOrders.user === account);
        //decorate the open orders
        openOrders = decoratedMyOpenOrders(openOrders);
        //sort date descending
        openOrders = openOrders.sort((a,b) => b.timestamp-a.timestamp);
        return openOrders;
    }
);

const decoratedMyOpenOrders = (orders) => {
    return (
        orders.map((order) => {
            order = decoratedOrder(order);
            //figure out if order is a buy trade or sell trade 
            order = decoratedMyOpenOrder(order,account);
            return order;
        })
    )
}

const decoratedMyOpenOrder = (order, account) => {

    let orderType = orders.tokenGIVE === ETHER_ADDRESS?'buy':'sell';

    return ({
        ...order,
        orderType,
        orderTypeClass: orderType === 'buy'?GREEN:RED,
        orderSign:orderType === 'buy'? '+':'-'
    })
}

//Price Chart Selectors 
export const priceChartLoadedSelector = createSelector(tradesLoaded, bool => bool);//ready when all trades loaded
export const priceChartSelector       = createSelector(
    trades,
    //turn trades into a series
    (trades) => {
        trades = trades.sort((a,b) => a.timestamp-b.timestamp);
        trades = trades.map(trade => decoratedOrder(trade));
        //get Last 2 orders for final price and final price change
        let secondLastOrder, lastOrder;
        [secondLastOrder, lastOrder] = trades.slice(orders.length-2, orders.length);
        //get prices
        const lastPrice = get(lastOrder, 'tokenPrice',0);
        const secondLastPrice = get(secondLastOrder, 'tokenPrice',0);        

        return ({
            ...trades,
            lastPriceChange: lastPrice>=secondLastPrice?'+':"-",
            priceSeries: [{
                data:buildGraphData(trades)
            }]
        })
    }

)

const buildGraphData = (trades) => {
    /*Graph data must be in form below
          data: [
            {
              x: new Date(1538778600000),
              y: [6629.81, 6650.5, 6623.04, 6633.33]
            },
            {
              x: new Date(1538780400000),
              y: [6632.01, 6643.59, 6620, 6630.11]
            }]
    */
    //group candles every hour apart
    trades = groupBy(trades, (trade) => moment.unix(trade.timestamp).startOf('hour').format());
    //Get each hour where the data exists
    const hours = Object.keys(trades);
    //Build the grapgh ...Need to get open, close, high, low of prices and also 
    const graphData = hours.map((hour) => {
        //fetch all the orders by hour
        const group = trades[hour]
        const open = group[0]; //first order as they are in ascending order timestamp
        const close = group[group.length-1]; //last order 
        const low  = minBy(group,'tokenPrice');
        const high = maxBy(group,'tokenPrice');
        return {
            x: new Date(hour),
            y:[open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        }
    })

    return graphData;
          
}

//Order cancelling and order cancelled selectors 

const orderCancelling                     = state => get(state, 'orderCancelling',false);
export const orderCancellingSelector      = createSelector(
    orderCancelling,
    bool => bool
);