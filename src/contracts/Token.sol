pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;

    string  public name     = "Dexed Token";
    string  public symbol   = "DXD";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    //Track balances
    mapping(address => uint256) public balanceOf;

    //Send tokens
    function transfer(address _to, uint _value) public returns(bool success) {
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        return true;
    }

    constructor() public {
        totalSupply = 7*(10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }  

}