// Run tests seperate e.g truffle test ./test/Token.test.js
// Running all tests e.g truffle test may have challenges
import { tokenFormat, etherFormat, EVM_REVERT, ETHER_ADDRESS } from "./helpers";

const Token = artifacts.require("./Token");
const Exchange = artifacts.require("./Exchange");
const Lighthouse = artifacts.require("./Lighthouse");

require("chai").use(require("chai-as-promised")).should();

contract("Exchange", ([deployer, feeAccount, user1, user2]) => {
  let token;
  let exchange;
  let lighthouse;
  const feePercent = 1;

  beforeEach(async () => {
    // Deploy Fojini token
    token = await Token.new();
    lighthouse = await Lighthouse.new();

    // Fojini tokens all initially to deployer ....Transfer some tokens to user1
    token.transfer(user1, tokenFormat(100), { from: deployer });

    // Deploy Fojini Exchange
    exchange = await Exchange.new(feeAccount, feePercent, lighthouse.address);
  });

  describe("deployment", () => {
    it("tracks the fee account", async () => {
      const result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });

    it("tracks the fee percent", async () => {
      const result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString());
    });

    it("tracks admin Account", async () => {
      const result = await exchange.owner();
      result.should.equal(deployer);
    });
  });

  describe("fallback", () => {
    it("reverts when Ether is sent", () => {
      exchange
        .sendTransaction({ value: 1, from: user1 })
        .should.be.rejectedWith(EVM_REVERT);
    });
  });

  describe("depositing Ether", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = etherFormat(1);
      result = await exchange.depositEther({ from: user1, value: amount });
    });

    it("tracks the Ether deposit", async () => {
      const balance = await exchange.tokens(ETHER_ADDRESS, user1);
      balance.toString().should.equal(amount.toString());
    });

    it("emits a Deposit event", () => {
      const log = result.logs[0];
      log.event.should.eq("Deposit");
      const event = log.args;
      event.token.should.equal(ETHER_ADDRESS, "token address correct");
      event.user.should.equal(user1, "user address correct");
      event.amount
        .toString()
        .should.equal(amount.toString(), "amount ether in correct");
      event.balance
        .toString()
        .should.equal(amount.toString(), "balance correct");
    });
  });

  describe("withdrawing Ether", () => {
    let result;
    let amount;

    beforeEach(async () => {
      // Deposit Ether first
      amount = etherFormat(1);
      let x = await exchange.depositEther({ from: user1, value: amount });
    });

    describe("success", () => {
      beforeEach(async () => {
        // Withdraw Ether
        result = await exchange.withdrawEther(amount, { from: user1 });
      });

      it("withdraws Ether funds", async () => {
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal("0");
      });

      it('emits a "Withdraw" event', () => {
        const log = result.logs[0];
        log.event.should.eq("Withdraw");
        const event = log.args;
        event.token.should.equal(ETHER_ADDRESS);
        event.user.should.equal(user1);
        event.amount.toString().should.equal(amount.toString());
        event.balance.toString().should.equal("0");
      });
    });

    describe("failure", () => {
      it("rejects withdraws for insufficient balances", async () => {
        let z = await exchange
          .withdrawEther(etherFormat(100), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("depositing tokens", () => {
    let result;
    let amount;

    describe("success", () => {
      beforeEach(async () => {
        amount = tokenFormat(10);
        let y = await token.approve(exchange.address, amount, { from: user1 });
        result = await exchange.depositToken(token.address, amount, {
          from: user1,
        });
      });

      it("tracks the token deposit", async () => {
        // Check exchange token balance
        let balance;
        balance = await token.balanceOf(exchange.address);
        balance.toString().should.equal(amount.toString());
        // Check tokens on exchange
        balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal(amount.toString());
      });

      it("emits a Deposit event", () => {
        const log = result.logs[0];
        log.event.should.eq("Deposit");
        const event = log.args;
        event.token.should.equal(token.address, "token address is correct");
        event.user.should.equal(user1, "user address is correct");
        event.amount
          .toString()
          .should.equal(amount.toString(), "amount is correct");
        event.balance
          .toString()
          .should.equal(amount.toString(), "balance is correct");
      });
    });

    describe("failure", () => {
      it("rejects Ether deposits", () => {
        exchange
          .depositToken(ETHER_ADDRESS, tokenFormat(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("fails when no tokens are approved", () => {
        // Tokens need approve before depositing
        exchange
          .depositToken(token.address, tokenFormat(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("withdrawing tokens", () => {
    let result;
    let amount;

    describe("success", async () => {
      beforeEach(async () => {
        // Deposit tokens first
        amount = tokenFormat(10);
        let j = await token.approve(exchange.address, amount, { from: user1 });
        let k = await exchange.depositToken(token.address, amount, {
          from: user1,
        });

        // Withdraw tokens
        result = await exchange.withdrawToken(token.address, amount, {
          from: user1,
        });
      });

      it("withdraws token funds", async () => {
        const balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal("0");
      });

      it('emits a "Withdraw" event', () => {
        const log = result.logs[0];
        log.event.should.eq("Withdraw");
        const event = log.args;
        event.token.should.equal(token.address);
        event.user.should.equal(user1);
        event.amount.toString().should.equal(amount.toString());
        event.balance.toString().should.equal("0");
      });
    });

    describe("failure", () => {
      it("rejects Ether withdraws", () => {
        exchange
          .withdrawToken(ETHER_ADDRESS, tokenFormat(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("fails for insufficient balances", () => {
        // Attempt to withdraw tokens without depositing any first
        exchange
          .withdrawToken(token.address, tokenFormat(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });

  describe("checking balances", () => {
    let amount = tokenFormat(15);
    beforeEach(async () => {
      let m = await exchange.depositEther({
        from: user1,
        value: etherFormat(1),
      });
      let n = await token.approve(exchange.address, amount, { from: user1 });
      let a = await exchange.depositToken(token.address, amount, {
        from: user1,
      });
    });

    it("returns user balance", async () => {
      const result = await exchange.balanceOf(ETHER_ADDRESS, user1);
      result.toString().should.equal(etherFormat(1).toString());
      const tokenBalance = await exchange.balanceOf(token.address, user1);
      tokenBalance.toString().should.equal(amount.toString());
    });
  });

  describe("making orders", () => {
    let result;

    beforeEach(async () => {
      result = await exchange.makeOrder(
        token.address,
        tokenFormat(1),
        ETHER_ADDRESS,
        etherFormat(1),
        { from: user1 }
      );
    });

    it("tracks the newly created order", async () => {
      const orderCount = await exchange.orderCount();
      orderCount.toString().should.equal("1");
      const order = await exchange.orders("1");
      order.id.toString().should.equal("1", "id is correct");
      order.user.should.equal(user1, "user is correct");
      order.tokenGet.should.equal(token.address, "tokenGet is correct");
      order.amountGet
        .toString()
        .should.equal(tokenFormat(1).toString(), "amountGet is correct");
      order.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
      order.amountGive
        .toString()
        .should.equal(etherFormat(1).toString(), "amountGive is correct");
      order.timestamp
        .toString()
        .length.should.be.at.least(1, "timestamp is present");
    });

    it('emits an "Order" event', () => {
      const log = result.logs[0];
      log.event.should.eq("Order");
      const event = log.args;
      event.id.toString().should.equal("1", "id is correct");
      event.user.should.equal(user1, "user is correct");
      event.tokenGet.should.equal(token.address, "tokenGet is correct");
      event.amountGet
        .toString()
        .should.equal(tokenFormat(1).toString(), "amountGet is correct");
      event.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
      event.amountGive
        .toString()
        .should.equal(etherFormat(1).toString(), "amountGive is correct");
      event.timestamp
        .toString()
        .length.should.be.at.least(1, "timestamp is present");
    });
  });

  describe("order actions", () => {
    beforeEach(async () => {
      // user1 deposits ether only
      let b = await exchange.depositEther({
        from: user1,
        value: etherFormat(1),
      });
      // deployer give tokens to user2
      let c = await token.transfer(user2, tokenFormat(100), { from: deployer });
      // user2 deposits tokens only
      let d = await token.approve(exchange.address, tokenFormat(2), {
        from: user2,
      });
      let e = await exchange.depositToken(token.address, tokenFormat(2), {
        from: user2,
      });
      // user1 makes an order to buy tokens with Ether
      let f = await exchange.makeOrder(
        token.address,
        tokenFormat(1),
        ETHER_ADDRESS,
        etherFormat(1),
        { from: user1 }
      );
    });

    describe("filling orders", () => {
      let result;

      let isLucky;
      describe("success", () => {
        beforeEach(async () => {
          // user2 fills order
          result = await exchange.fillOrder("1", { from: user2 });
          isLucky = result.logs[0].args.isLucky;
        });

        it('emits a "Trade" event', () => {
          console.log("=====Is this a lucky Trade=====");
          console.log(isLucky);
          const log = result.logs[0];
          log.event.should.eq("Trade");
          const event = log.args;
          event.id.toString().should.equal("1", "id is correct");
          event.user.should.equal(user1, "user is correct");
          event.tokenGet.should.equal(token.address, "tokenGet is correct");
          event.amountGet
            .toString()
            .should.equal(tokenFormat(1).toString(), "amountGet is correct");
          event.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
          event.amountGive
            .toString()
            .should.equal(etherFormat(1).toString(), "amountGive is correct");
          event.userFill.should.equal(user2, "userFill is correct");
          event.timestamp
            .toString()
            .length.should.be.at.least(1, "timestamp is present");
        });

        //user2 should receive 1% less if fee charged when filling the order
        it("executes the trade & may charges fees", async () => {
          let balance;
          balance = await exchange.balanceOf(token.address, user1);
          balance
            .toString()
            .should.equal(tokenFormat(1).toString(), "user1 received tokens");
          balance = await exchange.balanceOf(ETHER_ADDRESS, user2);
          balance
            .toString()
            .should.equal(etherFormat(1).toString(), "user2 received Ether");
          balance = await exchange.balanceOf(ETHER_ADDRESS, user1);
          balance.toString().should.equal("0", "user1 Ether deducted");

          if (isLucky) {
            // user2 will not pay fees
            balance = await exchange.balanceOf(token.address, user2);
            balance
              .toString()
              .should.equal(
                tokenFormat(1).toString(),
                "user2 tokens deducted with fee applied"
              );
            const feeAccount = await exchange.feeAccount();
            balance = await exchange.balanceOf(token.address, feeAccount);
            balance
              .toString()
              .should.equal(
                tokenFormat(0).toString(),
                "feeAccount received fee"
              );
          } else {
            // user2 will pay fees
            balance = await exchange.balanceOf(token.address, user2);
            balance
              .toString()
              .should.equal(
                tokenFormat(0.99).toString(),
                "user2 tokens deducted with fee applied"
              );
            const feeAccount = await exchange.feeAccount();
            balance = await exchange.balanceOf(token.address, feeAccount);
            balance
              .toString()
              .should.equal(
                tokenFormat(0.01).toString(),
                "feeAccount received fee"
              );
          }
        });

        it("updates filled orders", async () => {
          const orderFilled = await exchange.orderFilled(1);
          orderFilled.should.equal(true);
          const orderFilledCount = await exchange.filledOrderCount();
          orderFilledCount.toString().should.equal("1");
        });
      });

      describe("failure", () => {
        it("rejects invalid order ids", () => {
          const invalidOrderId = 99999;
          exchange
            .fillOrder(invalidOrderId, { from: user2 })
            .should.be.rejectedWith(EVM_REVERT);
        });

        it("rejects already-filled orders", () => {
          // Fill the order
          exchange.fillOrder("1", { from: user2 }).should.be.fulfilled;
          // Try to fill it again
          exchange
            .fillOrder("1", { from: user2 })
            .should.be.rejectedWith(EVM_REVERT);
        });

        it("rejects cancelled orders", () => {
          // Cancel the order
          exchange.cancelOrder("1", { from: user1 }).should.be.fulfilled;
          // Try to fill the order
          exchange
            .fillOrder("1", { from: user2 })
            .should.be.rejectedWith(EVM_REVERT);
        });
      });
    });

    describe("cancelling orders", () => {
      let outcome;

      describe("success", async () => {
        beforeEach(async () => {
          outcome = await exchange.cancelOrder("1", { from: user1 });
        });

        it("updates cancelled orders", async () => {
          const orderCancelled = await exchange.orderCancelled(1);
          orderCancelled.should.equal(true);
          const orderCancelledCount = await exchange.cancelledOrderCount();
          orderCancelledCount.toString().should.equal("1");
        });

        it('emits a "Cancel" event', () => {
          const log = outcome.logs[0];
          log.event.should.eq("Cancel");
          const event = log.args;
          event.id.toString().should.equal("1", "id is correct");
          event.user.should.equal(user1, "user is correct");
          event.tokenGet.should.equal(token.address, "tokenGet is correct");
          event.amountGet
            .toString()
            .should.equal(tokenFormat(1).toString(), "amountGet is correct");
          event.tokenGive.should.equal(ETHER_ADDRESS, "tokenGive is correct");
          event.amountGive
            .toString()
            .should.equal(etherFormat(1).toString(), "amountGive is correct");
          event.timestamp
            .toString()
            .length.should.be.at.least(1, "timestamp is present");
        });
      });

      describe("failure", () => {
        it("rejects invalid order ids", () => {
          const invalidOrderId = 99999;
          exchange
            .cancelOrder(invalidOrderId, { from: user1 })
            .should.be.rejectedWith(EVM_REVERT);
        });

        it("rejects unauthorized cancelations", async () => {
          // Try to cancel the order from user1 who did not create order
          exchange
            .cancelOrder("1", { from: user2 })
            .should.be.rejectedWith(EVM_REVERT);
        });
      });
    });
  });

  describe("circuit breaker ..emergency", () => {
    let result;

    beforeEach(async () => {
      // user1 deposits ether only
      let aa = await exchange.depositEther({
        from: user1,
        value: etherFormat(1),
      });
      // deployer give tokens to user2
      let bb = await token.transfer(user2, tokenFormat(100), {
        from: deployer,
      });
      // user2 deposits tokens only
      let cc = await token.approve(exchange.address, tokenFormat(5), {
        from: user2,
      });
      let dd = await exchange.depositToken(token.address, tokenFormat(2), {
        from: user2,
      });
      // user1 makes an order to buy tokens with Ether
      let ee = await exchange.makeOrder(
        token.address,
        tokenFormat(1),
        ETHER_ADDRESS,
        etherFormat(1),
        { from: user1 }
      );
    });

    describe("success", async () => {
      beforeEach(async () => {
        // admin executes emergency
        result = await exchange.stopExchange({ from: deployer });
      });

      it("updates exchange to be in emergency", async () => {
        const emergency = await exchange.emergency();
        emergency.should.equal(true);
      });

      it("emits a StopExchange event", () => {
        const log = result.logs[0];
        log.event.should.eq("StopExchange");
        const event = log.args;
        event.admin.should.equal(deployer);
        event.isEmergency.should.equal(true);
      });

      it("it rejects trades", async () => {
        exchange
          .fillOrder(1, { from: user2 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("it rejects new orders", async () => {
        exchange
          .makeOrder(
            token.address,
            tokenFormat(1),
            ETHER_ADDRESS,
            etherFormat(1),
            { from: user1 }
          )
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("it allows cancelling orders", async () => {
        let ff = await exchange.cancelOrder("1", { from: user1 });
        const orderCancelled = await exchange.orderCancelled(1);
        orderCancelled.should.equal(true);
        const orderCancelledCount = await exchange.cancelledOrderCount();
        orderCancelledCount.toString().should.equal("1");
      });

      it("allows token withdrawals", async () => {
        let amount = tokenFormat(2);
        let gg = await exchange.withdrawToken(token.address, amount, {
          from: user2,
        });
        const balance = await exchange.tokens(token.address, user2);
        balance.toString().should.equal("0");
      });

      it("allows ETH withdrawals", async () => {
        let amount = tokenFormat(1);
        let kk = await exchange.withdrawEther(amount, { from: user1 });
        const balance = await exchange.tokens(ETHER_ADDRESS, user1);
        balance.toString().should.equal("0");
      });

      it("it denies ETH deposits", async () => {
        exchange
          .depositEther({ from: user1, value: etherFormat(1) })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("it denies Token deposits", async () => {
        exchange
          .depositToken(token.address, tokenFormat(2), { from: user2 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      describe("success admin can restart all exchange functionality", async () => {
        beforeEach(async () => {
          // admin removes emergency
          result = await exchange.startExchange({ from: deployer });
        });

        it("updates exchange out of emergency", async () => {
          const emergency = await exchange.emergency();
          emergency.should.equal(false);
        });

        it("emits a StartExchange event", () => {
          const log = result.logs[0];
          log.event.should.eq("StartExchange");
          const event = log.args;
          event.admin.should.equal(deployer);
          event.isEmergency.should.equal(false);
        });

        describe("resumes all exchange functionality", () => {
          it("allows ETH deposit", () => {
            exchange.depositEther({ from: user1, value: etherFormat(1) }).should
              .be.fulfilled;
          });

          it("allows Token deposits", async () => {
            exchange.depositToken(token.address, tokenFormat(1), {
              from: user2,
            }).should.be.fulfilled;
          });

          it("allows Making orders", () => {
            exchange.makeOrder(
              token.address,
              tokenFormat(1),
              ETHER_ADDRESS,
              etherFormat(1),
              { from: user1 }
            ).should.be.fulfilled;
          });

          it("allows Filling orders", () => {
            exchange.fillOrder("1", { from: user2 }).should.be.fulfilled;
          });
        });
      });
    });

    describe("failure", () => {
      it("rejects emergency anyone not admin eg user1", () => {
        exchange
          .stopExchange({ from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects emergency anyone not admin eg user2", () => {
        exchange
          .stopExchange({ from: user2 })
          .should.be.rejectedWith(EVM_REVERT);
      });
    });
  });
});
