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

export function etherBalanceLoaded(etherBalance) {
    return {
        type: 'ETHER-BALANCE-LOADED',
        etherBalance
    }
}

export function tokenBalanceLoaded(tokenBalance) {
    return {
        type: 'TOKEN-BALANCE-LOADED',
        tokenBalance
    }
}

export function exchangeEtherBalanceLoaded(exchangeEtherBalance) {
    return {
        type: 'EXCHANGE-ETHER-BALANCE-LOADED',
        exchangeEtherBalance
    }
}

export function exchangeTokenBalanceLoaded(exchangeTokenBalance) {
    return {
        type: 'EXCHANGE-TOKEN-BALANCE-LOADED',
        exchangeTokenBalance
    }
}

export function balancesLoading() {
    return {
        type: 'BALANCES-LOADING'
    }
}

//Triggers that occur when depositing or withdrawing in the form
//Triggers anytime one of the balances is loading
export function etherDepositAmountChanged(amount) {
    return {
        type: 'ETHER-DEPOSIT-AMOUNT-CHANGED',
        amount
    }
}

export function tokenDepositAmountChanged(amount) {
    return {
        type: 'TOKEN-DEPOSIT-AMOUNT-CHANGED',
        amount
    }
}

export function etherWithdrawAmountChanged(amount) {
    return {
        type: 'ETHER-WITHDRAW-AMOUNT-CHANGED',
        amount
    }
}

export function tokenWithdrawAmountChanged(amount) {
    return {
        type: 'TOKEN-WITHDRAW-AMOUNT-CHANGED',
        amount
    }
}



        
        

