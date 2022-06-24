import { EVM_REVERT, tokenFormat } from "./helpers";

const Token = artifacts.require("./Token");

require("chai").use(require("chai-as-promised")).should();

contract("Token", ([deployer, receiver, exchange]) => {
  const name = "Fojini Token";
  const symbol = "FJNY";
  const decimals = "18";
  const totalSupply = tokenFormat(7000000).toString();
  let token;

  beforeEach(async () => {
    token = await Token.new();
  });

  describe("deployment", () => {
    it("tracks the name", async () => {
      const result = await token.name();
      result.should.equal(name);
    });

    it("tracks the symbol", async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });

    it("tracks the decimals", async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals);
    });

    it("tracks the total supply", async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply);
    });

    it("assigns the total supply to the deployer", async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply);
    });
  });

  describe("sending tokens", () => {
    let result;
    let amount;

    describe("success", () => {
      beforeEach(async () => {
        amount = tokenFormat(100);
        result = await token.transfer(receiver, amount, { from: deployer });
      });

      it("transfers token balances and updates balances", async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokenFormat(6999900).toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokenFormat(100).toString());
      });

      it("emits a Transfer event", () => {
        // Get event logs check all correct our emitted event is ...
        // event Transfer(address indexed from, address indexed to, uint256 value);
        const log = result.logs[0];
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.should.equal(receiver, "to is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("rejects insufficient balances", async () => {
        let invalidAmount;
        invalidAmount = tokenFormat(100000000); // 100 million - greater than total supply
        token
          .transfer(receiver, invalidAmount, { from: deployer })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects invalid recipients", () => {
        token.transfer(0x0, amount, { from: deployer }).should.be.rejected;
      });
    });
  });

  describe("approving tokens", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokenFormat(100);
      result = await token.approve(exchange, amount, { from: deployer });
    });

    describe("success", () => {
      it("allocates an allowance for delegated token spending on exchange", async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal(amount.toString());
      });

      it("emits an Approval event", () => {
        // Get event logs check all correct our emitted event is ...
        // event Approval(address indexed owner, address indexed spender, uint256 value);
        const log = result.logs[0];
        log.event.should.eq("Approval");
        const event = log.args;
        event.owner.toString().should.equal(deployer, "owner is correct");
        event.spender.should.equal(exchange, "spender is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("rejects invalid spenders", () => {
        token.approve(0x0, amount, { from: deployer }).should.be.rejected;
      });
    });
  });

  describe("delegated token transfers", () => {
    let result;
    let amount;

    beforeEach(async () => {
      amount = tokenFormat(100);
      let c = await token.approve(exchange, amount, { from: deployer });
    });

    describe("success", () => {
      beforeEach(async () => {
        result = await token.transferFrom(deployer, receiver, amount, {
          from: exchange,
        });
      });

      it("transfers token balances", async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokenFormat(6999900).toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokenFormat(100).toString());
      });

      it("resets the allowance", async () => {
        const allowance = await token.allowance(deployer, exchange);
        allowance.toString().should.equal("0");
      });

      it("emits a Transfer event", () => {
        // Get event logs check all correct our emitted event is ...
        // event Transfer(address indexed from, address indexed to, uint256 value);
        const log = result.logs[0];
        log.event.should.eq("Transfer");
        const event = log.args;
        event.from.toString().should.equal(deployer, "from is correct");
        event.to.should.equal(receiver, "to is correct");
        event.value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", () => {
      it("rejects insufficient amounts", () => {
        // Attempt transfer of too many tokens
        const invalidAmount = tokenFormat(100000000);
        token
          .transferFrom(deployer, receiver, invalidAmount, { from: exchange })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it("rejects invalid recipients", () => {
        token.transferFrom(deployer, 0x0, amount, { from: exchange }).should.be
          .rejected;
      });
    });
  });
});
