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
                                                       }
                                                       );

const cancelledOrdersLoaded           = state => get(state, 'cancelledOrders.tradesOrders.loaded',false);
export const cancelledOrdersLoadedSelector     = createSelector(cancelledOrdersLoaded, bool => bool);
const cancelled                       = state => get(state, 'cancelledOrders.cancelledOrders.data',[]);
export const cancelledOrdersSelector  = createSelector(cancelled, c => c);

const ordersLoaded                    = state => get(state, 'orders.tradesOrders.loaded',false);
export const ordersLoadedSelector     = createSelector(ordersLoaded, bool => bool);
const orders                          = state => get(state, 'orders.orders.data',[]);
export const ordersSelector           = createSelector(orders, o => o);