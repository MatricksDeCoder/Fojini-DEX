// Load WEB3 to state
export function web3Loaded(connection) {
  return {
    type: "WEB3_LOADED",
    connection,
  };
}

// Load the IUser Account to state
export function web3AccountLoaded(account) {
  return {
    type: "WEB3_ACCOUNT_LOADED",
    account,
  };
}

// Load the FOJINI TOKEN Contract to state
export function tokenLoaded(contract) {
  return {
    type: "TOKEN_LOADED",
    contract,
  };
}

// Load FOJINI EXCHANGE Contract to state
export function exchangeLoaded(contract) {
  return {
    type: "EXCHANGE_LOADED",
    contract,
  };
}

//Load All the Cancelled Orders
export function cancelledOrdersLoaded(cancelledOrders) {
  return {
    type: "CANCELLED_ORDERS_LOADED",
    cancelledOrders,
  };
}

//Load All the Filled Orders(Trades)
export function filledOrdersLoaded(filledOrders) {
  return {
    type: "FILLED_ORDERS_LOADED",
    filledOrders,
  };
}

//Load all orders (open orders)
export function allOrdersLoaded(allOrders) {
  return {
    type: "ALL_ORDERS_LOADED",
    allOrders,
  };
}

//Load that an existing order is cancelling
export function orderCancelling() {
  return {
    type: "ORDER_CANCELLING",
  };
}

//Order cancelled
export function orderCancelled(order) {
  return {
    type: "ORDER_CANCELLED",
    order,
  };
}

// Load that an existing order is filling
export function orderFilling() {
  return {
    type: "ORDER_FILLING",
  };
}

//Order filled completed
export function orderFilled(order) {
  return {
    type: "ORDER_FILLED",
    order,
  };
}

// Balances ether
export function etherBalanceLoaded(balance) {
  return {
    type: "ETHER_BALANCE_LOADED",
    balance,
  };
}

// Balances token
export function tokenBalanceLoaded(balance) {
  return {
    type: "TOKEN_BALANCE_LOADED",
    balance,
  };
}

// Balance of ether Loaded
export function exchangeEtherBalanceLoaded(balance) {
  return {
    type: "EXCHANGE_ETHER_BALANCE_LOADED",
    balance,
  };
}

// Balance of token loaded
export function exchangeTokenBalanceLoaded(balance) {
  return {
    type: "EXCHANGE_TOKEN_BALANCE_LOADED",
    balance,
  };
}

// All balanced loaded
export function balancesLoaded() {
  return {
    type: "BALANCES_LOADED",
  };
}

// Balanced loading
export function balancesLoading() {
  return {
    type: "BALANCES_LOADING",
  };
}

// Ether for deposit
export function etherDepositAmountChanged(amount) {
  return {
    type: "ETHER_DEPOSIT_AMOUNT_CHANGED",
    amount,
  };
}

// Ether withdrawal amount
export function etherWithdrawAmountChanged(amount) {
  return {
    type: "ETHER_WITHDRAW_AMOUNT_CHANGED",
    amount,
  };
}

// Token amount deposit
export function tokenDepositAmountChanged(amount) {
  return {
    type: "TOKEN_DEPOSIT_AMOUNT_CHANGED",
    amount,
  };
}

// Token amount withdrawal in form changing
export function tokenWithdrawAmountChanged(amount) {
  return {
    type: "TOKEN_WITHDRAW_AMOUNT_CHANGED",
    amount,
  };
}

// Buy order amount in form changing
export function buyOrderAmountChanged(amount) {
  return {
    type: "BUY_ORDER_AMOUNT_CHANGED",
    amount,
  };
}

// The buy price amount in form changing
export function buyOrderPriceChanged(price) {
  return {
    type: "BUY_ORDER_PRICE_CHANGED",
    price,
  };
}

// The buy order is making
export function buyOrderMaking(price) {
  return {
    type: "BUY_ORDER_MAKING",
  };
}

// Order done
export function orderMade(order) {
  return {
    type: "ORDER_MADE",
    order,
  };
}

// Sell order amount in form changing
export function sellOrderAmountChanged(amount) {
  return {
    type: "SELL_ORDER_AMOUNT_CHANGED",
    amount,
  };
}

// Sell order price in form changing
export function sellOrderPriceChanged(price) {
  return {
    type: "SELL_ORDER_PRICE_CHANGED",
    price,
  };
}

// Making sell order
export function sellOrderMaking(price) {
  return {
    type: "SELL_ORDER_MAKING",
  };
}

// Stopping exchage in emergency
export function exchangeStopped() {
  return {
    type: "EXCHANGE_STOPPED",
  };
}
// Starting exchange to resume from emergency
export function exchangeStarted() {
  return {
    type: "EXCHANGE_STARTED",
  };
}

//Load Admin Account
export function adminAccountLoaded(account) {
  return {
    type: "ADMIN_ACCOUNT_LOADED",
    account,
  };
}

// In future extend to EXCHANGE_ORDER_STOPPING AND EXCHANGE_ORDER_STARTING
