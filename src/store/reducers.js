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



const rootReducer = combineReducers({
    web3,
    web3Account,
    tokenContract,
    exchangeContract,
    cancelledOrders,
    tradesOrders,
    orders
});

export default rootReducer;