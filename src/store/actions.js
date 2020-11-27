// WEB3
export function web3Loaded(connection) {
  return {
    type: 'WEB3_LOADED',
    connection
  }
}

//Load Account 
export function web3AccountLoaded(account) {
  return {
    type: 'WEB3_ACCOUNT_LOADED',
    account
  }
}

// TOKEN Contract 
export function tokenLoaded(contract) {
  return {
    type: 'TOKEN_LOADED',
    contract
  }
}

// EXCHANGE Contract 
export function exchangeLoaded(contract) {
  return {
    type: 'EXCHANGE_LOADED',
    contract
  }
}

//Loaded Cancelled Orders 
export function cancelledOrdersLoaded(cancelledOrders) {
  return {
    type: 'CANCELLED_ORDERS_LOADED',
    cancelledOrders
  }
}

//Loaded Filled Orders
export function filledOrdersLoaded(filledOrders) {
  return {
    type: 'FILLED_ORDERS_LOADED',
    filledOrders
  }
}

//Loaded all orders 
export function allOrdersLoaded(allOrders) {
  return {
    type: 'ALL_ORDERS_LOADED',
    allOrders
  }
}

// Cancel Order
export function orderCancelling() {
  return {
    type: 'ORDER_CANCELLING'
  }
}

//Order cancelled complete 
export function orderCancelled(order) {
  return {
    type: 'ORDER_CANCELLED',
    order
  }
}

// Fill Order
export function orderFilling() {
  return {
    type: 'ORDER_FILLING'
  }
}

//Order filled completed
export function orderFilled(order) {
  return {
    type: 'ORDER_FILLED',
    order
  }
}

// Balances ether 
export function etherBalanceLoaded(balance) {
  return {
    type: 'ETHER_BALANCE_LOADED',
    balance
  }
}

// Balances token 
export function tokenBalanceLoaded(balance) {
  return {
    type: 'TOKEN_BALANCE_LOADED',
    balance
  }
}

// Balance of ether Loaded
export function exchangeEtherBalanceLoaded(balance) {
  return {
    type: 'EXCHANGE_ETHER_BALANCE_LOADED',
    balance
  }
}

// Balance of token loaded 
export function exchangeTokenBalanceLoaded(balance) {
  return {
    type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
    balance
  }
}

// All balanced loaded 
export function balancesLoaded() {
  return {
    type: 'BALANCES_LOADED'
  }
}

// Balanced loading 
export function balancesLoading() {
  return {
    type: 'BALANCES_LOADING'
  }
}

// Ether for deposit in form changing  
export function etherDepositAmountChanged(amount) {
  return {
    type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
    amount
  }
}

// Ether withdrawal amount in form changin 
export function etherWithdrawAmountChanged(amount) {
  return {
    type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
    amount
  }
}

// Token amount deposit in form changing 
export function tokenDepositAmountChanged(amount) {
  return {
    type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
    amount
  }
}

// Token amount withdrawal in form changing 
export function tokenWithdrawAmountChanged(amount) {
  return {
    type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
    amount
  }
}

// Buy order amount in form changing 
export function buyOrderAmountChanged(amount) {
  return {
    type: 'BUY_ORDER_AMOUNT_CHANGED',
    amount
  }
}

// Buy price amount in form changing 
export function buyOrderPriceChanged(price) {
  return {
    type: 'BUY_ORDER_PRICE_CHANGED',
    price
  }
}


export function buyOrderMaking(price) {
  return {
    type: 'BUY_ORDER_MAKING'
  }
}

// Generic Order
export function orderMade(order) {
  return {
    type: 'ORDER_MADE',
    order
  }
}

// Sell Order
export function sellOrderAmountChanged(amount) {
  return {
    type: 'SELL_ORDER_AMOUNT_CHANGED',
    amount
  }
}

// Sell order amount in form changing 
export function sellOrderPriceChanged(price) {
  return {
    type: 'SELL_ORDER_PRICE_CHANGED',
    price
  }
}

// Making the sell order 
export function sellOrderMaking(price) {
  return {
    type: 'SELL_ORDER_MAKING'
  }
}

// Stopping exchage in emergency 
export function exchangeStopped() {
  return {
    type: 'EXCHANGE_STOPPED'
  }
}
// Starting exchange to resume from emergency 
export function exchangeStarted() {
  return {
    type: 'EXCHANGE_STARTED'
  }
}

//Load Admin Account 
export function adminAccountLoaded(account) {
  return {
    type: 'ADMIN_ACCOUNT_LOADED',
    account
  }
}

// In future extend to EXCHANGE_ORDER_STOPPING AND EXCHANGE_ORDER_STARTING