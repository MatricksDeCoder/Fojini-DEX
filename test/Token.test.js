import { tokenFormat } from './helpers';

const Token = artifacts.require('./Token');

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

    describe('deployment', () => {
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

        it('transfers token balances', async () => {
            let balanceOfSender;
            let balanceOfReceiver;
            let balanceOfSenderAfter;
            let balanceOfReceiverAfter;
            
            balanceOfSender   = await token.balanceOf(accounts[0]);
            balanceOfReceiver = await token.balanceOf(accounts[1]);
            //console.log(balanceOfSender.toString(),balanceOfReceiver.toString());
            token.transfer(accounts[1], tokenFormat('1'), {from: accounts[0]});
            balanceOfSenderAfter   = await token.balanceOf(accounts[0]);
            balanceOfReceiverAfter = await token.balanceOf(accounts[1]);
            //console.log(balanceOfSenderAfter.toString(),balanceOfReceiverAfter.toString());
            balanceOfReceiverAfter.toString().should.equal(tokenFormat('1').toString());
            balanceOfSenderAfter.toString().should.equal(tokenFormat('6').toString());

        });
        
    });

})