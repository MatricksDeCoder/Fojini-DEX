import { tokenFormat } from './helpers';

const Token = artifacts.require('./Token');

const EVM_REVERT = 'VM Exception while processing transaction: revert';

require('chai').use(require('chai-as-promised'))
               .should()

contract('Token', (accounts) => {
    //accounts[0] = deployer
    const name = "Dexed Token";
    const symbol = "DXD";
    const decimals = '18';
    const totalSupply = tokenFormat('7').toString();
    let token;

    beforeEach(async () => {
        token = await Token.new()
        //above is alternative to token = await Token.deployed();        
    });

    describe('deployment ', () => {
        it('tracks the name', async () => {
          const result = await token.name()
          result.should.equal(name)
        });
        
        it('tracks symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol)
        });

        it('tracks decimal', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        });

        it('tracks total supply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        });

        it('assigns total supply to deployer', async () => {
            const result = await token.balanceOf(accounts[0])
            result.toString().should.equal(totalSupply.toString())
        });

        it('transfers token balances and emits transfer event', async () => {
            let balanceOfSender;
            let balanceOfReceiver;
            let balanceOfSenderAfter;
            let balanceOfReceiverAfter;
            
            balanceOfSender   = await token.balanceOf(accounts[0]);
            balanceOfReceiver = await token.balanceOf(accounts[1]);
            //console.log(balanceOfSender.toString(),balanceOfReceiver.toString());
            const transfer = await token.transfer(accounts[1], tokenFormat('1'), {from: accounts[0]});
            balanceOfSenderAfter   = await token.balanceOf(accounts[0]);
            balanceOfReceiverAfter = await token.balanceOf(accounts[1]);
            //console.log(balanceOfSenderAfter.toString(),balanceOfReceiverAfter.toString());
            balanceOfReceiverAfter.toString().should.equal(tokenFormat('1').toString());
            balanceOfSenderAfter.toString().should.equal(tokenFormat('6').toString());
            //event emitted and correct
            const event = transfer.logs[0].args;
            assert.equal(transfer.logs[0].event, 'Transfer');
            assert.equal(event.from.toString(),accounts[0],'Sender address is correct!');
            assert.equal(event.to,accounts[1], 'Receiver address is correct!');
            assert.equal(event.value.toString(),tokenFormat('1').toString(),'Amount is correct!');
        });
       
    });

    describe('failure', () => {
        it('rejects insufficient balances', async () => {
            //Try amount greater than total supply 
            
            await token.transfer(accounts[1], tokenFormat('8'), {from: accounts[0]}).should
                                                                                    .be
                                                                                    .rejectedWith(EVM_REVERT);

            //Try to transfer tokens when you dont have any 
            await token.transfer(accounts[0], tokenFormat('8'), {from: accounts[1]}).should
                                                                                    .be
                                                                                    .rejectedWith(EVM_REVERT);
            it('rejects invalid recipients/address', async() => {
                //Rejects invalid recipients
                await token.transfer('0x0', tokenFormat('0.5'), {from: accounts[0]}).should
                                                                                        .be
                                                                                        .rejectedWith(EVM_REVERT);
            });                                                                 
            
        });        
              
    });

    describe('approving tokens to do on behalf', () => {
        let approve;
        let amount = tokenFormat('0.05');

        beforeEach(async () => {
            approve = await token.approve(accounts[3], amount, {from:accounts[0]});
        })

        describe('success approvals', () => {
            //will treat accounts[3] as the exchange
            it('allocates allowance for delegated spending', async () => {
                const allowance = await token.allowances(accounts[0], accounts[3]);//returns amount allowed to act on behalf
                allowance.toString().should.equal(amount.toString());
            });

            it('emits event correctly', () => {
                //event approve
                const event = approve.logs[0].args;
                assert.equal(approve.logs[0].event, 'Approve');
                assert.equal(event.owner,accounts[0],'Owner approving exchange is correct!');
                assert.equal(event.spender, accounts[3], 'Approved Exchange is correct!');
                assert.equal(event.amount.toString(),amount.toString(),'Amount allowed/delegated is correct!');
            })

        });

        describe('failure approvals', () => {
            it('rejects invalid spenders', async() => {
                //Rejects invalid recipients
                await token.approve('0x0', amount, {from: accounts[0]}).should
                                                                       .be
                                                                       .rejected;
            }); 
        });       
              
    });

    describe('sending tokens on behalf/transferFrom', () => {
        let approve;
        let transfer;
        let amount = tokenFormat('0.05');

        beforeEach(async () => {
            approve = await token.approve(accounts[3], amount, {from:accounts[0]});
        })

        describe('success sending/ transferFrom', () => {
            
            it('transfers token balances and emits transfer event', async () => {
                let balanceOf0;
                let balanceOf4;
                //exchange now acting on behalf of accounts[0] since approved
                const transfer = await token.transferFrom(accounts[0], accounts[4], amount, {from:accounts[3]});
                balanceOf0   = await token.balanceOf(accounts[0]);
                balanceOf4   = await token.balanceOf(accounts[4]);
                balanceOf0.toString().should.equal(tokenFormat('6.95').toString());
                balanceOf4.toString().should.equal(tokenFormat('0.05').toString());
                //event emitted and correct
                const event = transfer.logs[0].args;
                assert.equal(transfer.logs[0].event, 'Transfer');
                assert.equal(event.from.toString(),accounts[0],'Sender address is correct original owner!');
                assert.equal(event.to,accounts[4], 'Receiver accounts[4] address is correct!');
                assert.equal(event.value.toString(),amount.toString(),'Amount is correct!');
            });

        });

        describe('failures sending /transferFrom', () => {
            it('rejects invalid owners', async() => {
                //Rejects invalid recipients
                await token.transferFrom('0x0', amount, {from: accounts[3]}).should
                                                                       .be
                                                                       .rejected;
            }); 

            it('rejects invalid spenders', async() => {
                //Rejects invalid recipients
                await token.transferFrom('0x0', amount, {from: '0x0'}).should
                                                                       .be
                                                                       .rejected;
            }); 

            it('rejects invalid amounts', async() => {
                //Rejects amount greater than allowed for 1 > 0.05
                await token.transferFrom(accounts[0], tokenFormat('1'), {from: accounts[0]}).should
                                                                       .be
                                                                       .rejected;
            }); 

            it('rejects spenders not approved', async() => {
                //Rejects amount greater than allowed for 1 > 0.05
                await token.transferFrom(accounts[0], amount, {from: accounts[4]}).should
                                                                       .be
                                                                       .rejected;
            }); 
        });       
              
    });

})