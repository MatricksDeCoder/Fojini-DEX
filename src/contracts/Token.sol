pragma solidity ^0.5.0;

contract Token {

    string public name ="Dexed Token";
    string public symbol = "DXD";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor() public {
        totalSupply = 7000000*(10**decimals);
    }

}