const Token = artifacts.require('./Token');

require('chai').use(require('chai-as-promised'))
               .should()

contract('Token', () => {

    const name = "Dexed Token";
    const symbol = "DXD";
    const decimals = '18';
    const totalSupply = '7000000000000000000000000';
    let token;

    beforeEach(async () => {
        token = await Token.new()
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
            result.toString().should.equal(totalSupply)
        });
        
    });

})