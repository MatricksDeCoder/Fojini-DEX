
import { EVM_REVERT, tokenFormat, ETHER_ADDRESS} from './helpers';

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
                await exchange.depositToken(ETHER_ADDRESS, depositAmount, {from: user1}).should
                .be
                .rejectedWith(EVM_REVERT);
           });
                
            });
        });

        describe('depositing ether', () => { 

            let depositEther;
            let etherAmount = tokenFormat('1');
            let balance;
            
            describe('success and emits event', () => { 

                //approve first
                beforeEach(async () => {
                    depositEther = await exchange.depositEther({from:user1, value: etherAmount});
                });

                it('reverts when ether is sent', async () => {
                    depositEther = await exchange.sendTransaction({from:user1, value: etherAmount}).should.be.
                    rejectedWith(EVM_REVERT);
                });

                it('tracks the ether deposit', async () => {
                    balance = await exchange.tokens(ETHER_ADDRESS, user1);
                    balance.toString().should.equal(etherAmount.toString());
                });

                it('emits correct Deposit event', () => {
                    const event = depositEther.logs[0].args;
                    assert.equal(depositEther.logs[0].event, 'Deposit');
                    assert.equal(event.token,ETHER_ADDRESS,'Ether address is correct!');
                    assert.equal(event.sender,user1, 'Sender address is correct!');
                    assert.equal(event.amount.toString(),etherAmount.toString(),'Ether Amount is correct!');
                    assert.equal(event.balance.toString(),etherAmount.toString(),'Ether Balance is correct!');
                })
            });
         
        });

        describe('withdrawing ether', () => { 

            let withdrawEther;
            let etherAmount = tokenFormat('1');
            let balance;
            let depositEther;
            
            describe('successful withdrawal and emits event', () => { 

                //approve first
                beforeEach(async () => {
                    depositEther = await exchange.depositEther({from:user1, value: etherAmount});
                });

                describe('success', () => {
                    beforeEach(async () => {
                        withdrawEther = await exchange.withdrawEther(etherAmount, {from:user1});
                    });

                    it('withdraws ether funds', async () => {
                        balance = await exchange.tokens(ETHER_ADDRESS,user1);
                        balance.toString().should.equal('0');
                    });

                    it('emits correct Withdraw event', () => {
                        const event = withdrawEther.logs[0].args;
                        assert.equal(withdrawEther.logs[0].event, 'Withdraw');
                        assert.equal(event.token,ETHER_ADDRESS,'Ether address is correct!');
                        assert.equal(event.sender,user1, 'Sender address is correct!');
                        assert.equal(event.amount.toString(),etherAmount.toString(),'Ether Amount withdranw is correct!');
                        assert.equal(event.balance.toString(),'0','Ether Balance is correct!');
                    })

                });

                describe('failure', () => {

                });

            });
         
        });
        
       
    });

});
