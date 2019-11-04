pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Token {
    using SafeMath for uint;

    string  public name     = "Dexed Token";
    string  public symbol   = "DXD";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    //Event Transfer
    event Transfer(address indexed from, address indexed to, uint256 value); 

    //Event Transfer
    event TransferFrom(address indexed from, address indexed to, uint256 value); 

    //Approve Event 
    event Approve(address indexed owner, address indexed spender, uint256 amount); 

    //Track balances
    mapping(address => uint256) public balanceOf;

    //Track amount whoever is delegated can exchange on behalf
    //Address of approver and addresses of all those who can spend/exchange on behalf
    mapping(address => mapping(address => uint256)) public allowances;

    //Send tokens
    function transfer(address _to, uint _value) public returns(bool success) {
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != address(0));
        balanceOf[_from] = balanceOf[_from].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(_from, _to, _value);
    }

    //Approve Tokens to tranfer on behalf
    function approve(address _spender, uint256 _amount) public returns(bool success) {
        require(msg.sender != address(0));
        require(_spender != address(0));
        allowances[msg.sender][_spender] = _amount;
        emit Approve(msg.sender, _spender, _amount);
        return true;
    }

    //Send tokens on behalf
    function transferFrom(address _from, address _to, uint _value) public returns(bool success) {
        require(balanceOf[_from] >= _value);
        require(allowances[_from][msg.sender] >= _value);
        allowances[_from][msg.sender] = allowances[_from][msg.sender].sub(_value); //allowance to act on behalf reduced
        _transfer(_from, _to, _value);
        emit Transfer(_from,_to,_value);
        return true;
    }

    constructor() public {
        totalSupply = 7*(10**decimals);
        balanceOf[msg.sender] = totalSupply;
    }  

}