
import { EVM_REVERT, tokenFormat } from './helpers';

const Exchange = artifacts.require('./Exchange');
const Token    = artifacts.require('./Token');

require('chai').use(require('chai-as-promised'))
               .should()

contract('Exchange', (accounts) => {
   
    const deployer   = accounts[0];
    const feeAccount = accounts[1]; //feeAccount 
    const user1      = accounts[2];
    const user2      = accounts[3];
    const feePercent = 1; //fee is 1 percent
    let exchange;
    let token;
    const ETHER = '0x0000000000000000000000000000000000000000';

    beforeEach(async () => {
        token    = await Token.new();
        exchange = await Exchange.new(feeAccount,feePercent);
        //above is alternative to token = await Exchange.deployed();
        
        //transfer tokens to user1
        token.transfer(user1, tokenFormat('1'), {from:deployer});   
    });

    describe('deployment', () => {

        it('tracks account address for fees', async () => {
          const result = await exchange.feeAccount();
          result.should.equal(feeAccount);
        });   
        
        it('tracks feePercent', async () => {
          const result = await exchange.feePercent();
          result.toString().should.equal(feePercent.toString());
        }); 
        
        describe('depositing tokens', () => { 

            let depositToken;
            let depositAmount = tokenFormat('0.5');
            let balance;
           
            describe('success and emits event', () => { 

                //approve first
                beforeEach(async () => {
                    await token.approve(exchange.address, depositAmount, {from:user1});
                    depositToken = await exchange.depositToken(token.address, depositAmount, {from:user1});
                });

                it('tracks the token deposit', async () => {
                    balance = await token.balanceOf(exchange.address);
                    balance.toString().should.equal(depositAmount.toString());
                    let balanceUser1 = await exchange.tokens(token.address, user1);
                    balanceUser1.toString().should.equal(depositAmount.toString());
                });

                it('emits correct Deposit event', () => {
                    const event = depositToken.logs[0].args;
                    assert.equal(depositToken.logs[0].event, 'Deposit');
                    assert.equal(event.token,token.address,'Token address is correct!');
                    assert.equal(event.sender,user1, 'Sender address is correct!');
                    assert.equal(event.amount.toString(),depositAmount.toString(),'Amount is correct!');
                    assert.equal(event.balance.toString(),depositAmount.toString(),'Balance is correct!');
                })
            });
            describe('failure', () => { 
                //try to transfer before tokens are approved
               it('fails when tokens are not approved', async () => {
                    await exchange.depositToken(token.address, depositAmount, {from: user1}).should
                    .be
                    .rejectedWith(EVM_REVERT);
               });

               it('rejects ether deposits for depositTokens', async () => {
                await exchange.depositToken(ETHER, depositAmount, {from: user1}).should
                .be
                .rejectedWith(EVM_REVERT);
           });
                
            });
        });
        
       
    });

});
