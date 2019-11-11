import {combineReducers} from 'redux';

function web3(state = {}, action) {
    switch(action.type) {
        case 'WEB3_LOADED':
            return {...state,connection:action.connection}
        default:
            return state;
    }
}


function web3Account(state = {}, action) {
    switch(action.type) {
        case 'WEB3_ACCOUNT_LOADED':
            return {...state,account:action.account}
        default:
            return state;
    }
}

function tokenContract(state = {}, action) {
    switch(action.type) {
        case 'TOKEN_CONTRACT_LOADED':
            return {...state,loaded: true, contract:action.tokenContract}
        default:
            return state;
    }
}

function exchangeContract(state = {}, action) {
    switch(action.type) {
        case 'EXCHANGE_CONTRACT_LOADED':
            return {...state,loaded: true, contract:action.exchangeContract}
        default:
            return state;
    }
}

function cancelledOrders(state = {}, action) {
    switch(action.type) {
        case 'CANCELLED_ORDERS_LOADED':
            return {...state, cancelledOrders:{loaded:true, data: action.cancelledOrders}}
        default:
            return state;
    }
}

function tradesOrders(state = {}, action) {
    switch(action.type) {
        case 'TRADES_ORDERS_LOADED':
            return {...state, tradesOrders:{loaded:true, data: action.tradesOrders}}
        default:
            return state;
    }
}

function orders(state = {}, action) {
    switch(action.type) {
        case 'ORDERS_LOADED':
            return {...state, orders:{loaded:true, data: action.orders}}
        default:
            return state;
    }
}

function orderCancelling(state = {}, action) {
    switch(action.type) {
        case 'ORDER_CANCELLING':
            return {...state, orderCancelling: true}
        default:
            return state;
    }
}

function orderCancelled(state = {}, action) {
    switch(action.type) {
        case 'ORDER_CANCELLED':
            return {...state,
                    orderCancelling: false, 
                    cancelledOrders : {
                        ...state.cancelledOrders,
                        data:[
                            state.cancelledOrders.data,
                            action.order
                        ]
                    }
                }
        default:
            return state;
    }
}


function orderTrading(state = {}, action) {
    switch(action.type) {
        case 'ORDER_TRADING':
            return {...state, orderTrading: true}
        default:
            return state;
    }
}

function orderTraded(state = {}, action) {
    //prevent duplicate orders
    let index,data;
    index  = state.tradesOrders.data.findIndex(order => order.id === action.order.id);

    if(index === -1) {
        data = [
            state.tradesOrders.data,
            action.order
        ]
    } else {
        data = state.tradesOrders.data; //already existing trades 
    }

    switch(action.type) {
        case 'ORDER_TRADED':
            return {...state,
                    orderTrading: false, 
                    tradesOrders : {
                        ...state.tradesOrders,
                        data:data
                    }
                }
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    web3,
    web3Account,
    tokenContract,
    exchangeContract,
    cancelledOrders,
    tradesOrders,
    orders,
    orderCancelling,
    orderCancelled,
    orderTrading,
    orderTraded
});

export default rootReducer;