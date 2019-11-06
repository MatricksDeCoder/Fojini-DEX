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
 **Withdraw Tokens**
 **Deposit Ether**
 **Withdraw Ether** 
 **Check balances**
 **Make orders**
 **Cancel order**
 **Fill order**
 **Charge fees**

*/

pragma solidity ^0.5.0;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import './Token.sol'; //import Token to use for deposit and withdrawals, exchanges etc 

contract Exchange {
    using SafeMath for uint;

    address public feeAccount; //account for exchange fees
    uint256 public feePercent; // percentage of fees taken in trades etc by exchange
    address constant ETHER = address(0); //blank address is ether
    uint256 public orderCount; //count of orders to work as id;

    //Keep track tokens deposited on exchange
    mapping(address => mapping(address => uint256)) public tokens;
    //First address of token, second address of user who deposited token

    //Storage for orders
    mapping(uint256 => _Order) public orders;

    //Track cancelled orders
    mapping(uint256 => bool) public orderCancelled;

    //Track filled orders
    mapping(uint256 => bool) public orderFilled;

    //Model order
    struct _Order {
        uint id; //id order
        address user;//user making order
        address tokenGet; //token they want to purchase        
        address tokenGive; //token to exchange with
        uint amountGet; //amount of token want to get
        uint amountGive; //amount of token to Give
        uint timestamp; 
    }

    constructor(address _feeAccount, uint256 _feePercent) public {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    //Events
    //Deposit Event
    event Deposit(address token, address sender, uint256 amount, uint256 balance);
    //Withdraw Event
    event Withdraw(address token, address sender, uint256 amount, uint256 balance);
    //Order Event
    event Order(uint id,address user,address tokenGet,address tokenGive,uint amountGet,uint amountGive,uint timestamp);
    //CancelOrder Event
    event CancelOrder(uint id,address user,address tokenGet,address tokenGive,uint amountGet,uint amountGive,uint timestamp);
    //Trade Event
    event Trade(uint id, address user, address tokenGet, address tokenGive, uint amountGet, uint amountGive,address sender,uint timestamp);

    //ether must be sent via depositEther only must have way to send back 
    //fallback best practise
    function() external {
        revert();
    }

    //Deposit Ether
    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        //emit Deposit Event
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    //Withdraw Ether
    function withdrawEther(uint _amount) public payable {
        //sufficient balance
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        //send ether to sender
        msg.sender.transfer(_amount);
        //emit Withdraw Event
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
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

    function withdrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        //sufficient balance
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(Token(_token).transfer(msg.sender, _amount));
        //Emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(address _token, address _user) public view returns(uint256) {
        return tokens[_token][_user];
    }

    function makeOrder(address _tokenGet,uint256 _amountGet, address _tokenGive, uint256 _amountGive) public {
        orderCount = orderCount.add(1);
        orders[orderCount]= _Order(orderCount, msg.sender, _tokenGet, _tokenGive,_amountGet, _amountGive, now);
        emit Order(orderCount,msg.sender,_tokenGet,_tokenGive,_amountGet,_amountGive,now);        
    }
    
    function cancelOrder(uint _id) public {//orders not actually removed
        _Order storage _order = orders[_id]; //fetch order from storage
        //Order must be a valid order
        require(_order.id == _id);
        //You can only cancel your order
        require(address(_order.user) == msg.sender);
        orderCancelled[_id] = true;
        emit CancelOrder(_id,msg.sender,_order.tokenGet,_order.tokenGive,_order.amountGet,_order.amountGive, now);
    }

    function fillOrder(uint256 _id) public {
        //validate order before trade
        require(_id > 0 && _id <= orderCount);
        require(!orderFilled[_id]);//order is not filled
        require(!orderCancelled[_id]); //order is not cancelled
        //Get order
        _Order storage _order = orders[_id];
        //Make trade
        _trade(_id,_order.user,_order.tokenGet, _order.amountGet, _order.tokenGive, _order.amountGive);
        //Mark order as filled
        orderFilled[_order.id] = true;
    }


    function _trade(uint _orderId, address _user, address _tokenGet,uint256 _amountGet, address _tokenGive, uint256 _amountGive) internal {
        
        //handle fees
        uint256 _feeAmount = _amountGet.mul(feePercent).div(100);//
        tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount].add(_feeAmount);
        
        //for trade there exists a user who madeOrder to get the tokenGet and give tokenGive the msg.sender wants to give
        tokens[_tokenGet][_user]  = tokens[_tokenGet][_user].add(_amountGet);
        tokens[_tokenGive][_user] = tokens[_tokenGive][_user].sub(_amountGive);
        
        //update amounts of giver and taken from user and msg.sender(two parties to trade)
        tokens[_tokenGet][msg.sender]  = tokens[_tokenGet][msg.sender].sub(_amountGet.add(_feeAmount)); //filler of trade
        tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender].add(_amountGive);

        //Emit TradeEvent        
        emit Trade(_orderId, _user, _tokenGet, _tokenGive, _amountGet, _amountGive,msg.sender,now);
    }

}