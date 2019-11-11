export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

export function tokenContractLoaded(tokenContract) {
    return {
        type: 'TOKEN_CONTRACT_LOADED',
        tokenContract
    }
}

export function exchangeContractLoaded(exchangeContract) {
    return {
        type: 'EXCHANGE_CONTRACT_LOADED',
        exchangeContract
    }
}

export function cancelledOrdersLoaded(cancelledOrders) {
    return {
        type: 'CANCELLED_ORDERS_LOADED',
        cancelledOrders
    }
}

export function tradesOrdersLoaded(tradesOrders) {
    return {
        type: 'TRADES_ORDERS_LOADED',
        tradesOrders
    }
}

export function ordersLoaded(orders) {
    return {
        type: 'ORDERS_LOADED',
        orders
    }
}

export function orderCancelling() {
    return {
        type: 'ORDER-CANCELLING'
    }
}

export function orderCancelled(order) {
    return {
        type: 'ORDER-CANCELLED',
        order
    }
}

export function orderTrading() {
    return {
        type: 'ORDER-TRADING'
    }
}

export function orderTraded(order) {
    return {
        type: 'ORDER-TRADED',
        order
    }
}

