
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
            
            describe('successful withdrawal and emits event', () => { 

                //fund first
                beforeEach(async () => {
                    await exchange.depositEther({from:user1, value: etherAmount});
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
                        assert.equal(event.amount.toString(),etherAmount.toString(),'Ether Amount withdrawn is correct!');
                        assert.equal(event.balance.toString(),'0','Ether Balance is correct!');
                    })

                });

                describe('failure', () => {
                    it('rejects ether withdrawals insufficient balances', async () => {
                        //try withdraw 2 ether when you have 1 ether only 
                        await exchange.withdrawEther(tokenFormat('2'), {from: user1}).should
                        .be
                        .rejectedWith(EVM_REVERT);
                         });
                        
                });

            });
        });

        describe('withdrawing tokens', () => { 

                let withdrawToken;
                let depositAmount = tokenFormat('1');
                let balance;
                
                describe('successful withdrawal and emits event', () => { 
    
                    beforeEach(async () => {            
                        await token.approve(exchange.address, depositAmount, {from:user1});
                        await exchange.depositToken(token.address, depositAmount, {from:user1});
                        withdrawToken = await exchange.withdrawToken(token.address,depositAmount, {from:user1});
                    });
    
                    describe('success', () => {
                    
                        it('withdraws token', async () => {
                            balance = await exchange.tokens(token.address,user1);
                            balance.toString().should.equal('0');
                        });
    
                        it('emits correct Withdraw event', () => {
                            const event = withdrawToken.logs[0].args;
                            assert.equal(withdrawToken.logs[0].event, 'Withdraw');
                            assert.equal(event.token,token.address,'Token address is correct!');
                            assert.equal(event.sender,user1, 'Sender address is correct!');
                            assert.equal(event.amount.toString(),depositAmount.toString(),'Ether Amount withdrawn is correct!');
                            assert.equal(event.balance.toString(),'0','Ether Balance is correct!');
                        })
    
                    });
    
                    describe('failure', () => {
                        it('rejects token withdrawals insufficient balances', async () => {
                            //try withdraw 2 tokens when you have 1 token only 
                            await exchange.withdrawToken(token.address,tokenFormat('2'), {from: user1}).should
                            .be
                            .rejectedWith(EVM_REVERT);
                             });

                        it('rejects ether withdrawals ', async () => {
                                //try withdraw 2 tokens when you have 1 token only 
                                await exchange.withdrawToken(ETHER_ADDRESS, tokenFormat('1'), {from: user1}).should
                                .be
                                .rejectedWith(EVM_REVERT);
                                 });
                            
                    });
    
                });
            });
        
        describe('checking balances', () => {
                let amount = tokenFormat('0.1');
                let balanceEther;
                let balanceTokens;
                beforeEach(async() => {
                    await exchange.depositEther({from:user1, value:amount});
                    await token.approve(exchange.address, amount, {from:user1});
                    await exchange.depositToken(token.address, amount, {from:user1});                
                });
                it('returns correct balances', async () => {
                    balanceEther = await exchange.balanceOf(ETHER_ADDRESS, user1);
                    balanceEther.toString().should.equal(amount.toString());                    
                    balanceTokens = await exchange.balanceOf(token.address, user1);                    
                    balanceTokens.toString().should.equal(amount.toString());
                });
            });

        describe('making orders', () => {
                let makeOrder;
                let amountGet = tokenFormat('0.3');
                let amountGive = tokenFormat('0.2');//ether to give for token
                beforeEach(async() => {
                    makeOrder = await exchange.makeOrder(token.address, 
                                                         amountGet,
                                                         ETHER_ADDRESS,
                                                         amountGive,
                                                         {from:user1}
                                                        );              
                });
                describe('success', () => {
                    
                    it('creates and tracks an order', async () => {
                        let orderCount  = await exchange.orderCount();
                        orderCount.toString().should.equal('1');
                  
                        let order = await exchange.orders('1');
                        assert.equal(order.id.toString(),'1','Order has correct id!');
                        assert.equal(order.user,user1, 'Sender address is correct!');
                        assert.equal(order.tokenGet,token.address,'Token to get address is correct!');
                        assert.equal(order.tokenGive,ETHER_ADDRESS, 'Token to give address is correct');
                        assert.equal(order.amountGet.toString(),amountGet.toString(), 'Amount get for token is correct');
                        assert.equal(order.amountGive.toString(),amountGive.toString(), 'Amount give for exchange is correct');
                        order.timestamp.toString().length.should.be.at.least(1, 'Timestamp is present');
                    });

                    it('emits correct Withdraw event', () => {
                        const event = makeOrder.logs[0].args;
                        assert.equal(makeOrder.logs[0].event, 'Order');
                        assert.equal(event.id.toString(),'1','Order has correct id!');
                        assert.equal(event.user,user1, 'Sender address is correct!');
                        assert.equal(event.tokenGet,token.address,'Token to get address is correct!');
                        assert.equal(event.tokenGive,ETHER_ADDRESS, 'Token to give address is correct');
                        assert.equal(event.amountGet.toString(),amountGet.toString(), 'Amount get for token is correct');
                        assert.equal(event.amountGive.toString(),amountGive.toString(), 'Amount give for exchange is correct');
                    })

                });

                describe('failure', () => {
                        it('', () => {

                        });       
                });      
                
            });

    });        
       
});
