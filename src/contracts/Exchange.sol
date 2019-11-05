/*
-Can Deposit and Withdraw Funds
-Manage Orders 
 - make orders
 - cancel orders
-Make Trades
 - fill orders
 - charge fees

 ** Set Fee  **
 ** Set Account for Fee **
 **Deposit Tokens **
 **Withdraw Tokens
 **Deposit Ether
 **Withdraw Ether 
 **Check balances
 **Make orders
 **Cancel order
 **Fill order
 **Charge fees

*/

pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './Token.sol'; //import Token to use for deposit and withdrawals, exchanges etc 

contract Exchange {
    using SafeMath for uint;

    address public feeAccount; //account for exchange fees
    uint256 public feePercent; // percentage of fees taken in trades etc by exchange
    address constant ETHER = address(0); //blank address is ether

    //Keep track tokens deposited on exchange
    mapping(address => mapping(address => uint256)) public tokens;
    //First address of token, second address of user who deposited token

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //Events

    //Deposit Event
    event Deposit(address token, address sender, uint256 amount, uint256 balance);

    //Deposit Ether
    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        //emit Deposit Event
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }
    
    function depositToken(address _token, uint256 _amount) public {
        //Prevent deposit of ether
        require(_token != ETHER);
        //Track which token deposited (tracked by address _token)
        //Get instance of token and use transferFrom
        //Below needs approval before transferFrom
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        //Manage balances of tokens deposited
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        //Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    
}